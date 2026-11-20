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

import { getAppointmentSeries, getDashboardStatistics } from '../../services/statisticsService';
import './StatisticsPage.css';

const chartColors = ['#2563eb', '#0891b2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const statusNames = {
  PENDING: 'Pendientes',
  CONFIRMED: 'Confirmadas',
  COMPLETED: 'Completadas',
  CANCELLED: 'Canceladas',
};

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toCsv(rows) {
  return rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
}

export default function StatisticsPage() {
  const [report, setReport] = useState(null);
  const [series, setSeries] = useState({ day: [], status: [], specialty: [], doctor: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = `${new Date().getFullYear()}-01-01`;
    const to = getToday();

    Promise.all([
      getDashboardStatistics(from, to),
      getAppointmentSeries('day', from, to),
      getAppointmentSeries('status', from, to),
      getAppointmentSeries('specialty', from, to),
      getAppointmentSeries('doctor', from, to),
    ])
      .then(([dashboard, byDay, byStatus, bySpecialty, byDoctor]) => {
        setReport(dashboard);
        setSeries({
          day: byDay.values,
          status: byStatus.values,
          specialty: bySpecialty.values,
          doctor: byDoctor.values.slice(0, 5),
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const monthlyAppointments = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(new Date().getFullYear(), index, 1).toLocaleDateString('es-PE', { month: 'short' }),
    appointments: 0,
  }));
  series.day.forEach(({ label, value }) => {
    const monthIndex = new Date(`${label}T12:00:00`).getMonth();
    monthlyAppointments[monthIndex].appointments += value;
  });

  const totalBySpecialty = series.specialty.reduce((sum, item) => sum + item.value, 0);
  const specialtyStatistics = series.specialty.map((item, index) => ({
    name: item.label,
    value: item.value,
    percentage: totalBySpecialty ? Math.round((item.value / totalBySpecialty) * 100) : 0,
    color: chartColors[index % chartColors.length],
  }));
  const doctorStatistics = series.doctor.map((item) => ({
    doctor: item.label,
    appointments: item.value,
  }));
  const statusStatistics = series.status.map((item, index) => ({
    name: statusNames[item.label] ?? item.label,
    value: item.value,
    color: chartColors[index % chartColors.length],
  }));
  const totalByStatus = statusStatistics.reduce((sum, item) => sum + item.value, 0);

  const exportReport = () => {
    if (!report) return;

    const rows = [
      ['REPORTE ESTADÍSTICO MEDITURN'],
      ['Desde', report.from, 'Hasta', report.to],
      [],
      ['RESUMEN'],
      ['Citas', report.appointments],
      ['Pacientes', report.patients],
      ['Médicos activos', report.doctors],
      ['Especialidades activas', report.specialties],
      [],
      ['CITAS POR MES'],
      ['Mes', 'Cantidad'],
      ...monthlyAppointments.map((item) => [item.month, item.appointments]),
      [],
      ['CITAS POR ESPECIALIDAD'],
      ['Especialidad', 'Cantidad'],
      ...specialtyStatistics.map((item) => [item.name, item.value]),
      [],
      ['CITAS POR MÉDICO'],
      ['Médico', 'Cantidad'],
      ...doctorStatistics.map((item) => [item.doctor, item.appointments]),
      [],
      ['CITAS POR ESTADO'],
      ['Estado', 'Cantidad'],
      ...statusStatistics.map((item) => [item.name, item.value]),
    ];
    const blob = new Blob([`\uFEFF${toCsv(rows)}`], { type: 'text/csv;charset=utf-8;' });
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
          <p>Datos registrados desde el 1 de enero hasta hoy</p>
        </div>
        <button
          type="button"
          className="statistics-page__export"
          onClick={exportReport}
          disabled={!report || loading}
        >
          <Download size={17} />
          Exportar reporte
        </button>
      </header>

      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Cargando estadísticas...</p>}
      {!loading && report && (
        <>
          <section className="statistics-grid" aria-label="Resumen">
            {[
              ['Citas del año', report.appointments],
              ['Pacientes', report.patients],
              ['Médicos activos', report.doctors],
              ['Especialidades activas', report.specialties],
            ].map(([label, value]) => (
              <article className="statistics-card" key={label}>
                <h2>{label}</h2>
                <p className="statistics-total">{value}</p>
              </article>
            ))}
          </section>

          <section className="statistics-grid">
            <article className="statistics-card">
              <h2>Citas por mes</h2>
              <div className="statistics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAppointments}>
                    <CartesianGrid stroke="#e8edf5" strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="appointments" stroke="#2563eb" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="statistics-card">
              <h2>Citas por especialidad</h2>
              <div className="statistics-chart statistics-chart--pie">
                {specialtyStatistics.length === 0 ? <p>Sin citas registradas en este período.</p> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={specialtyStatistics} dataKey="value" nameKey="name" cx="50%" cy="52%" outerRadius={82}>
                        {specialtyStatistics.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            <article className="statistics-card">
              <h2>Médicos con más citas</h2>
              <div className="statistics-chart">
                {doctorStatistics.length === 0 ? <p>Sin citas registradas en este período.</p> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={doctorStatistics} layout="vertical" margin={{ left: 45 }}>
                      <CartesianGrid stroke="#e8edf5" strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="doctor" width={110} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#0891b2" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            <article className="statistics-card">
              <h2>Distribución por estado</h2>
              {statusStatistics.length === 0 ? <p>Sin citas registradas en este período.</p> : (
                <div className="status-distribution">
                  {statusStatistics.map((item) => {
                    const percentage = totalByStatus ? Math.round((item.value / totalByStatus) * 100) : 0;
                    return (
                      <div className="status-distribution__item" key={item.name}>
                        <div className="status-distribution__information">
                          <span>{item.name}</span>
                          <span>{item.value} ({percentage}%)</span>
                        </div>
                        <div className="status-distribution__track">
                          <div className="status-distribution__progress" style={{ width: `${percentage}%`, background: item.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </main>
  );
}
