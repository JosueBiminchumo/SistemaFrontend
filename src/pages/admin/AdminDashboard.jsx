import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  UsersRound,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import StatCard from '../../components/dashboard/StatCard';
import RecentAppointments from '../../components/dashboard/RecentAppointments';
import { listAppointments } from '../../services/appointmentService';
import {
  getAppointmentSeries,
  getDashboardStatistics,
} from '../../services/statisticsService';
import './AdminDashboard.css';

const statusPresentation = {
  PENDING: { label: 'Pendientes', color: '#f59e0b' },
  CONFIRMED: { label: 'Confirmadas', color: '#2563eb' },
  COMPLETED: { label: 'Completadas', color: '#10b981' },
  CANCELLED: { label: 'Canceladas', color: '#ef4444' },
};

const appointmentStatusLabels = {
  PENDING: 'PENDIENTE',
  CONFIRMED: 'CONFIRMADA',
  COMPLETED: 'COMPLETADA',
  CANCELLED: 'CANCELADA',
};

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildMonthlyAppointments(dailySeries, year) {
  const monthly = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(year, index, 1).toLocaleDateString('es-PE', {
      month: 'short',
    }),
    appointments: 0,
  }));

  dailySeries.forEach(({ label, value }) => {
    const date = new Date(`${label}T12:00:00`);
    if (date.getFullYear() === year) {
      monthly[date.getMonth()].appointments += value;
    }
  });

  return monthly;
}

function mapUpcomingAppointments(appointments) {
  const now = new Date();

  return appointments
    .filter((appointment) => {
      const startAt = new Date(appointment.startAt);
      return startAt >= now
        && ['PENDING', 'CONFIRMED'].includes(appointment.status);
    })
    .sort((left, right) => left.startAt.localeCompare(right.startAt))
    .slice(0, 5)
    .map((appointment) => ({
      id: appointment.id,
      patient: appointment.patientName,
      doctor: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.startAt.slice(0, 10),
      time: appointment.startAt.slice(11, 16),
      status: appointmentStatusLabels[appointment.status] ?? appointment.status,
    }));
}

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [dailySeries, setDailySeries] = useState([]);
  const [statusSeries, setStatusSeries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const from = `${year}-01-01`;
    const to = toLocalDateString(today);

    Promise.all([
      getDashboardStatistics(from, to),
      getAppointmentSeries('day', from, to),
      getAppointmentSeries('status', from, to),
      listAppointments(),
    ])
      .then(([dashboard, byDay, byStatus, appointmentItems]) => {
        setReport(dashboard);
        setDailySeries(byDay.values);
        setStatusSeries(byStatus.values);
        setAppointments(appointmentItems);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const monthlyAppointments = useMemo(
    () => buildMonthlyAppointments(dailySeries, new Date().getFullYear()),
    [dailySeries],
  );
  const appointmentStatus = statusSeries.map(({ label, value }) => ({
    name: statusPresentation[label]?.label ?? label,
    value,
    color: statusPresentation[label]?.color ?? '#64748b',
  }));
  const upcomingAppointments = mapUpcomingAppointments(appointments);
  const today = toLocalDateString(new Date());
  const appointmentsToday = appointments.filter(
    (appointment) => appointment.startAt.slice(0, 10) === today,
  ).length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'PENDING',
  ).length;
  const totalAppointments = monthlyAppointments.reduce(
    (total, item) => total + item.appointments,
    0,
  );

  const statistics = report
    ? [
        {
          title: 'Total médicos',
          value: report.doctors,
          description: 'Activos',
          icon: Stethoscope,
          color: 'blue',
        },
        {
          title: 'Total pacientes',
          value: report.patients,
          description: 'Registrados',
          icon: UsersRound,
          color: 'cyan',
        },
        {
          title: 'Citas hoy',
          value: appointmentsToday,
          description: 'Registradas en MySQL',
          icon: CalendarDays,
          color: 'green',
        },
        {
          title: 'Pendientes',
          value: pendingAppointments,
          description: 'Por atender',
          icon: Clock3,
          color: 'orange',
        },
      ]
    : [];

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Panel Administrativo</h1>
          <p>Resumen general del sistema MediTurn</p>
        </div>
      </header>

      {loading && <p role="status">Cargando datos desde la base de datos...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && report && (
        <>
          <section className="stats-grid" aria-label="Indicadores principales">
            {statistics.map((statistic) => (
              <StatCard
                key={statistic.title}
                title={statistic.title}
                value={statistic.value}
                description={statistic.description}
                icon={statistic.icon}
                color={statistic.color}
              />
            ))}
          </section>

          <section className="dashboard-charts">
            <article className="dashboard-card dashboard-card--large">
              <div className="chart-heading">
                <h2>Citas por mes — {report.to.slice(0, 4)}</h2>
                <span>Total: {totalAppointments}</span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyAppointments}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="appointmentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
                    <XAxis
                      dataKey="month"
                      axisLine={{ stroke: '#94a3b8' }}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={{ stroke: '#94a3b8' }}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} citas`, 'Cantidad']}
                      labelFormatter={(label) => `Mes: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="url(#appointmentGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="dashboard-card dashboard-card--status">
              <h2>Estado de citas</h2>
              {appointmentStatus.length === 0 ? (
                <p className="empty-message">No hay citas registradas en este período.</p>
              ) : (
                <>
                  <div className="pie-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appointmentStatus}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={82}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {appointmentStatus.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} citas`]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="status-legend">
                    {appointmentStatus.map((item) => (
                      <div className="status-legend__item" key={item.name}>
                        <div className="status-legend__label">
                          <span style={{ backgroundColor: item.color }} />
                          {item.name}
                        </div>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
          </section>

          <RecentAppointments appointments={upcomingAppointments} />
        </>
      )}
    </main>
  );
}
