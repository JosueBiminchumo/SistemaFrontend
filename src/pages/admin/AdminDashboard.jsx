import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Stethoscope,
  UserPlus,
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
import './AdminDashboard.css';

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

const appointmentStatus = [
  {
    name: 'Completadas',
    value: 148,
    color: '#10b981',
  },
  {
    name: 'Confirmadas',
    value: 67,
    color: '#2563eb',
  },
  {
    name: 'Pendientes',
    value: 43,
    color: '#f59e0b',
  },
  {
    name: 'Canceladas',
    value: 24,
    color: '#ef4444',
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: 'María García',
    doctor: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    date: '2026-09-18',
    time: '09:00',
    status: 'CONFIRMADA',
  },
  {
    id: 2,
    patient: 'María García',
    doctor: 'Dra. Ana Torres',
    specialty: 'Dermatología',
    date: '2026-09-18',
    time: '10:30',
    status: 'COMPLETADA',
  },
  {
    id: 3,
    patient: 'Juan Carlos',
    doctor: 'Dr. Roberto Silva',
    specialty: 'Medicina general',
    date: '2026-09-19',
    time: '14:00',
    status: 'PENDIENTE',
  },
  {
    id: 4,
    patient: 'Ana Sofía',
    doctor: 'Dra. Patricia Flores',
    specialty: 'Ginecología',
    date: '2026-09-20',
    time: '11:00',
    status: 'CONFIRMADA',
  },
  {
    id: 5,
    patient: 'Pedro Arturo',
    doctor: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    date: '2026-09-21',
    time: '08:30',
    status: 'COMPLETADA',
  },
];

const recentActivity = [
  {
    id: 1,
    description: 'Cita completada — María García con Dr. Mendoza',
    time: 'Hace 15 min',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    id: 2,
    description: 'Nueva cita reservada — Ana Rodríguez con Dra. Flores',
    time: 'Hace 1 hora',
    icon: Plus,
    color: 'blue',
  },
  {
    id: 3,
    description: 'Nuevo paciente registrado — Pedro Arturo Morales',
    time: 'Hace 2 horas',
    icon: UserPlus,
    color: 'purple',
  },
];

export default function AdminDashboard() {
  const statistics = [
    {
      title: 'Total médicos',
      value: '6',
      description: 'Activos',
      icon: Stethoscope,
      color: 'blue',
    },
    {
      title: 'Total pacientes',
      value: '5',
      description: 'Registrados',
      icon: UsersRound,
      color: 'cyan',
    },
    {
      title: 'Citas hoy',
      value: '12',
      description: '16 septiembre 2026',
      icon: CalendarDays,
      color: 'green',
    },
    {
      title: 'Pendientes',
      value: '2',
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
            <h2>Citas por mes — 2026</h2>
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
                  domain={[0, 120]}
                  ticks={[0, 30, 60, 90, 120]}
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