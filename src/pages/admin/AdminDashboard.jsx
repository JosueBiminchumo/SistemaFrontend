import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
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


import {
  getAppointmentSeries,
  getDashboardStats,
  groupDaysByMonth,
  toStatusChart,
  todayISO,
  yearRange,
} from '../../services/statisticsService';
import { getPanelAppointments } from '../../services/appointmentService';
import StatCard from '../../components/dashboard/StatCard';
import RecentAppointments from '../../components/dashboard/RecentAppointments';
import './AdminDashboard.css';

const ACTIVITY_BY_STATUS = {
  PENDIENTE: { label: 'Nueva cita reservada', icon: Plus, color: 'blue' },
  CONFIRMADA: { label: 'Cita confirmada', icon: CheckCircle2, color: 'green' },
  COMPLETADA: { label: 'Cita completada', icon: CheckCircle2, color: 'green' },
  CANCELADA: { label: 'Cita cancelada', icon: Clock3, color: 'purple' },
};

// updatedAt llega como hora local de Lima ("2026-11-03T09:30:00"): se muestra tal cual.
const formatStamp = (iso) => (iso ? `${iso.slice(0, 10)} · ${iso.slice(11, 16)}` : '');

function buildActivity(appointments) {
  return [...appointments]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 3)
    .map((appointment) => {
      const info = ACTIVITY_BY_STATUS[appointment.status] ?? ACTIVITY_BY_STATUS.PENDIENTE;

      return {
        id: appointment.id,
        description: `${info.label} — ${appointment.patient} con ${appointment.doctor}`,
        time: formatStamp(appointment.updatedAt),
        icon: info.icon,
        color: info.color,
      };
    });
}

const loadDashboard = async () => {
  const range = yearRange();

  const [stats, dailySeries, appointments] = await Promise.all([
    getDashboardStats(range),
    getAppointmentSeries('day', range),
    getPanelAppointments(),
  ]);

  const today = todayISO();

  return {
    stats,
    monthlyAppointments: groupDaysByMonth(dailySeries.points),
    appointmentStatus: toStatusChart(stats.appointmentsByStatus),
    todayCount: dailySeries.points.find((point) => point.label === today)?.value ?? 0,
    upcomingAppointments: appointments
      .filter((item) => item.date >= today && item.status !== 'CANCELADA')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5),
    recentActivity: buildActivity(appointments),
  };
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    loadDashboard()
      .then((result) => alive && setData(result))
      .catch((err) => alive && setError(err.message || 'No se pudo cargar el panel.'));

    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <main className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <h1>Panel Administrativo</h1>
            <p>{error || 'Cargando información del sistema...'}</p>
          </div>
        </header>
      </main>
    );
  }

  const {
    stats,
    monthlyAppointments,
    appointmentStatus,
    todayCount,
    upcomingAppointments,
    recentActivity,
  } = data;

  const statistics = [
    {
      title: 'Total médicos',
      value: String(stats.totalDoctors),
      description: 'Activos',
      icon: Stethoscope,
      color: 'blue',
    },
    {
      title: 'Total pacientes',
      value: String(stats.totalPatients),
      description: 'Registrados',
      icon: UsersRound,
      color: 'cyan',
    },
    {
      title: 'Citas hoy',
      value: String(todayCount),
      description: new Date().toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      icon: CalendarDays,
      color: 'green',
    },
    {
      title: 'Pendientes',
      value: String(stats.pendingAppointments),
      description: 'Por confirmar',
      icon: Clock3,
      color: 'orange',
    },
  ];

  const totalAppointments = monthlyAppointments.reduce(
    (total, item) => total + item.appointments,
    0,
  );

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Panel Administrativo</h1>
          <p>Resumen general del sistema MediTurn</p>
        </div>
      </header>

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
            <h2>Citas por mes — {new Date().getFullYear()}</h2>
            <span>Total: {totalAppointments}</span>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyAppointments}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="appointmentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2563eb"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="#2563eb"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical
                  stroke="#e8edf5"
                />

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
        </article>
      </section>

      <RecentAppointments appointments={upcomingAppointments} />

      <section className="recent-activity">
        <div className="section-heading">
          <h2>Actividad reciente</h2>
        </div>

        <div className="activity-list">
          {recentActivity.map((activity) => {
            const ActivityIcon = activity.icon;

            return (
              <article className="activity-item" key={activity.id}>
                <div
                  className={`activity-item__icon activity-item__icon--${activity.color}`}
                >
                  <ActivityIcon size={19} />
                </div>

                <p>{activity.description}</p>
                <time>{activity.time}</time>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}