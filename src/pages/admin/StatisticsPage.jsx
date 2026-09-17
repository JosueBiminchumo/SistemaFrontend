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

import './StatisticsPage.css';

const monthlyAppointments = [
  { month: 'Ene', appointments: 42 },
  { month: 'Feb', appointments: 58 },
  { month: 'Mar', appointments: 72 },
  { month: 'Abr', appointments: 60 },
  { month: 'May', appointments: 88 },
  { month: 'Jun', appointments: 95 },
  { month: 'Jul', appointments: 78 },
  { month: 'Ago', appointments: 110 },
  { month: 'Sep', appointments: 103 },
  { month: 'Oct', appointments: 88 },
  { month: 'Nov', appointments: 114 },
  { month: 'Dic', appointments: 92 },
];

const specialtyStatistics = [
  {
    name: 'Med. General',
    value: 38,
    color: '#2563eb',
  },
  {
    name: 'Cardiología',
    value: 22,
    color: '#0891b2',
  },
  {
    name: 'Ginecología',
    value: 18,
    color: '#10b981',
  },
  {
    name: 'Pediatría',
    value: 14,
    color: '#f59e0b',
  },
  {
    name: 'Otras',
    value: 8,
    color: '#ef4444',
  },
];

const doctorStatistics = [
  {
    doctor: 'Dr. Carlos Mendoza',
    appointments: 48,
  },
  {
    doctor: 'Dra. Lucía Ramírez',
    appointments: 42,
  },
  {
    doctor: 'Dra. Patricia Flores',
    appointments: 38,
  },
  {
    doctor: 'Dr. Roberto Silva',
    appointments: 35,
  },
  {
    doctor: 'Dra. Ana Torres',
    appointments: 29,
  },
];

const statusStatistics = [
  {
    name: 'Completadas',
    value: 148,
    percentage: 52,
    color: '#10b981',
  },
  {
    name: 'Confirmadas',
    value: 67,
    percentage: 24,
    color: '#2563eb',
  },
  {
    name: 'Pendientes',
    value: 43,
    percentage: 15,
    color: '#f59e0b',
  },
  {
    name: 'Canceladas',
    value: 24,
    percentage: 9,
    color: '#ef4444',
  },
];

const renderPieLabel = ({
  name,
  value,
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
    {`${name} ${value}%`}
  </text>
);

export default function StatisticsPage() {
  const exportReport = () => {
    const rows = [
      ['REPORTE ESTADÍSTICO MEDITURN'],
      [],
      ['CITAS POR MES'],
      ['Mes', 'Cantidad'],
      ...monthlyAppointments.map((item) => [
        item.month,
        item.appointments,
      ]),
      [],
      ['ESPECIALIDADES MÁS SOLICITADAS'],
      ['Especialidad', 'Porcentaje'],
      ...specialtyStatistics.map((item) => [
        item.name,
        `${item.value}%`,
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
          <h2>Citas por mes</h2>

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
                  domain={[0, 120]}
                  ticks={[0, 30, 60, 90, 120]}
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
                  formatter={(value) => [`${value}%`]}
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
                  domain={[0, 60]}
                  ticks={[0, 15, 30, 45, 60]}
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