import { Link, useNavigate } from 'react-router-dom';
import { getAppointments, getProfile, todayISO } from './doctorStorage';
import DoctorLayout from './DoctorLayout';
import './DoctorDashboardPage.css';

function formatToday() {
  return new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const appointments = getAppointments();
  const today = todayISO(0);

  const todayAppointments = appointments
    .filter((appt) => appt.date === today && appt.status !== 'CANCELADA')
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = appointments
    .filter((appt) => appt.date > today && appt.status !== 'CANCELADA')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const totalPending = appointments.filter((appt) => appt.status === 'PENDIENTE').length;
  const totalConfirmed = appointments.filter((appt) => appt.status === 'CONFIRMADA').length;
  const totalCompleted = appointments.filter((appt) => appt.status === 'COMPLETADA').length;
  const totalCancelled = appointments.filter((appt) => appt.status === 'CANCELADA').length;
  const totalAll = appointments.length || 1;

  const statusBars = [
    { label: 'Pendientes', value: totalPending, color: '#d97706' },
    { label: 'Confirmadas', value: totalConfirmed, color: '#16a34a' },
    { label: 'Completadas', value: totalCompleted, color: '#2563eb' },
    { label: 'Canceladas', value: totalCancelled, color: '#dc2626' },
  ];

  return (
    <DoctorLayout>
      <div className="doctor-dashboard">
        <header className="doctor-dashboard__header">
          <div className="doctor-dashboard__header-text">
            <p className="doctor-dashboard__subtitle">{profile.specialty}</p>
            <h1>{getGreeting()}, {profile.name.replace('Dr. ', '').replace('Dra. ', '')}</h1>
          </div>
          <span className="doctor-dashboard__date">{formatToday()}</span>
        </header>

        {/* Acciones rápidas */}
        <section className="doctor-dashboard__quick-actions">
          <button type="button" className="quick-action" onClick={() => navigate('/medico/agenda')}>
            <span className="quick-action__icon">📅</span>
            Agregar horario
          </button>
          <button type="button" className="quick-action" onClick={() => navigate('/medico/citas')}>
            <span className="quick-action__icon">🗂️</span>
            Ver todas las citas
          </button>
          <button type="button" className="quick-action" onClick={() => navigate('/medico/pacientes')}>
            <span className="quick-action__icon">🧑‍🤝‍🧑</span>
            Ver pacientes
          </button>
          <button type="button" className="quick-action" onClick={() => navigate('/medico/perfil')}>
            <span className="quick-action__icon">👤</span>
            Editar perfil
          </button>
        </section>

        <section className="doctor-dashboard__stats">
          <div className="stat-card">
            <span className="stat-card__value">{todayAppointments.length}</span>
            <span className="stat-card__label">Citas de hoy</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{totalPending}</span>
            <span className="stat-card__label">Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{upcomingAppointments.length}</span>
            <span className="stat-card__label">Próximos turnos</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{appointments.length}</span>
            <span className="stat-card__label">Total citas</span>
          </div>
        </section>

        <div className="doctor-dashboard__grid">
          <section className="doctor-dashboard__section">
            <div className="doctor-dashboard__section-header">
              <h2>Citas de hoy</h2>
              <Link to="/medico/citas">Ver todas</Link>
            </div>

            {todayAppointments.length === 0 ? (
              <p className="doctor-dashboard__empty">No tienes citas programadas para hoy.</p>
            ) : (
              <ul className="appointment-list">
                {todayAppointments.map((appt) => (
                  <li key={appt.id} className="appointment-list__item">
                    <span className="appointment-list__time">{appt.time}</span>
                    <span className="appointment-list__patient">{appt.patientName}</span>
                    <span className="appointment-list__reason">{appt.reason}</span>
                    <span className={`appointment-status appointment-status--${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="doctor-dashboard__section">
            <div className="doctor-dashboard__section-header">
              <h2>Resumen de estados</h2>
            </div>

            <div className="status-chart">
              {statusBars.map((bar) => (
                <div key={bar.label} className="status-chart__row">
                  <span className="status-chart__label">{bar.label}</span>
                  <div className="status-chart__track">
                    <div
                      className="status-chart__fill"
                      style={{ width: `${(bar.value / totalAll) * 100}%`, background: bar.color }}
                    />
                  </div>
                  <span className="status-chart__value">{bar.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="doctor-dashboard__section">
          <div className="doctor-dashboard__section-header">
            <h2>Próximos turnos</h2>
            <Link to="/medico/agenda">Ver agenda</Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p className="doctor-dashboard__empty">No tienes próximos turnos.</p>
          ) : (
            <ul className="appointment-list">
              {upcomingAppointments.map((appt) => (
                <li key={appt.id} className="appointment-list__item">
                  <span className="appointment-list__time">{appt.date} · {appt.time}</span>
                  <span className="appointment-list__patient">{appt.patientName}</span>
                  <span className="appointment-list__reason">{appt.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DoctorLayout>
  );
}