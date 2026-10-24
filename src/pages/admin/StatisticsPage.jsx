import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  SPECIALTY_COLORS,
  getAppointmentSeries,
  getDashboardStats,
  groupDaysByMonth,
  toStatusChart,
  yearRange,
} from '../../services/statisticsService';
import { getPanelAppointments } from '../../services/appointmentService';
import './StatisticsPage.css';

const renderPieLabel = ({
  name,
  percent,
  x,
  y,
  textAnchor,
  fill,
}) => (
  <text
    x={x}
    y={y}
    fill={fill}
    textAnchor={textAnchor}
    dominantBaseline="central"
    fontSize={12}
  >
    {`${name} ${Math.round(percent * 100)}%`}
  </text>
);

// "Médicos con más citas": el backend no agrupa por médico, se calcula con las citas del año.
function topDoctors(appointments, year) {
  const counts = new Map();

  appointments
    .filter((item) => item.date.startsWith(String(year)) && item.status !== 'CANCELADA')
    .forEach((item) => counts.set(item.doctor, (counts.get(item.doctor) ?? 0) + 1));

  return [...counts.entries()]
    .map(([doctor, total]) => ({ doctor, appointments: total }))
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 5);
}

const loadStatistics = async () => {
  const year = new Date().getFullYear();
  const range = yearRange(year);

  const [dashboard, dailySeries, specialtySeries, appointments] = await Promise.all([
    getDashboardStats(range),
    getAppointmentSeries('day', range),
    getAppointmentSeries('specialty', range),
    getPanelAppointments(),
  ]);

  return {
    year,
    monthlyAppointments: groupDaysByMonth(dailySeries.points),
    specialtyStatistics: specialtySeries.points.map((point, index) => ({
      name: point.label,
      value: point.value,
      color: SPECIALTY_COLORS[index % SPECIALTY_COLORS.length],
    })),
    doctorStatistics: topDoctors(appointments, year),
    statusStatistics: toStatusChart(dashboard.appointmentsByStatus),
  };
};

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    loadStatistics()
      .then((result) => alive && setData(result))
      .catch((err) => alive && setError(err.message || 'No se pudieron cargar las estadísticas.'));

    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <main className="statistics-page">
        <header className="statistics-page__header">
          <div>
            <h1>Reportes</h1>
            <p>{error || 'Cargando estadísticas...'}</p>
          </div>
        </header>
      </main>
    );
  }

  const {
    year,
    monthlyAppointments,
    specialtyStatistics,
    doctorStatistics,
    statusStatistics,
  } = data;

  const specialtyTotal = specialtyStatistics.reduce((sum, item) => sum + item.value, 0);

  const exportReport = () => {
    const rows = [
      ['REPORTE ESTADÍSTICO MEDITURN'],
      [],
      [`CITAS POR MES ${year}`],
      ['Mes', 'Cantidad'],
      ...monthlyAppointments.map((item) => [
        item.month,
        item.appointments,
      ]),
      [],
      ['ESPECIALIDADES MÁS SOLICITADAS'],
      ['Especialidad', 'Cantidad', 'Porcentaje'],
      ...specialtyStatistics.map((item) => [
        item.name,
        item.value,
        `${specialtyTotal ? Math.round((item.value / specialtyTotal) * 100) : 0}%`,
      ]),
      [],
      ['MÉDICOS CON MÁS CITAS'],
      ['Médico', 'Cantidad'],
      ...doctorStatistics.map((item) => [
        item.doctor,
        item.appointments,
      ]),
      [],
      ['DISTRIBUCIÓN POR ESTADO'],
      ['Estado', 'Cantidad', 'Porcentaje'],
      ...statusStatistics.map((item) => [
        item.name,
        item.value,
        `${item.percentage}%`,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = 'reporte-estadistico-mediturn.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <main className="statistics-page">
      <header className="statistics-page__header">
        <div>
          <h1>Reportes</h1>
          <p>Datos estadísticos del sistema</p>
        </div>

        <button
          type="button"
          className="statistics-page__export"
          onClick={exportReport}
        >
          <Download size={17} />
          Exportar reporte
        </button>
      </header>

      <section className="statistics-grid">
        <article className="statistics-card">
          <h2>Citas por mes — {year}</h2>

          <div className="statistics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyAppointments}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 0,
                  left: -20,
                }}
              >
                <CartesianGrid
                  stroke="#e8edf5"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#98a2b3' }}
                  tick={{ fill: '#667085', fontSize: 11 }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: '#98a2b3' }}
                  tick={{ fill: '#667085', fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} citas`,
                    'Cantidad',
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: '#2563eb',
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="statistics-card">
          <h2>Especialidades más solicitadas</h2>

          <div className="statistics-chart statistics-chart--pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyStatistics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="52%"
                  outerRadius={82}
                  labelLine
                  label={renderPieLabel}
                  stroke="#ffffff"
                  strokeWidth={1}
                >
                  {specialtyStatistics.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [`${value} citas`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="statistics-card">
          <h2>Médicos con más citas</h2>

          <div className="statistics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorStatistics}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 15,
                  bottom: 0,
                  left: 45,
                }}
              >
                <CartesianGrid
                  stroke="#e8edf5"
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 11 }}
                />

                <YAxis
                  type="category"
                  dataKey="doctor"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} citas`,
                    'Cantidad',
                  ]}
                />

                <Bar
                  dataKey="appointments"
                  fill="#0891b2"
                  radius={[0, 5, 5, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="statistics-card">
          <h2>Distribución por estado</h2>

          <div className="status-distribution">
            {statusStatistics.map((status) => (
              <div
                className="status-distribution__item"
                key={status.name}
              >
                <div className="status-distribution__information">
                  <span>{status.name}</span>

                  <span>
                    {status.value} ({status.percentage}%)
                  </span>
                </div>

                <div className="status-distribution__track">
                  <div
                    className="status-distribution__progress"
                    style={{
                      width: `${status.percentage}%`,
                      backgroundColor: status.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}