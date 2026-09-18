import { Link } from 'react-router-dom';
import { getAppointments, getProfile, todayISO } from './doctorStorage';
import DoctorLayout from './DoctorLayout';
import './DoctorDashboardPage.css';

function formatToday() {
  return new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function DoctorDashboardPage() {
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

  const totalPending = appointments.filter(
    (appt) => appt.date === today && appt.status === 'PENDIENTE'
  ).length;

  return (
    <DoctorLayout>
      <div className="doctor-dashboard">
        <header className="doctor-dashboard__header">
          <div className="doctor-dashboard__header-text">
            <p className="doctor-dashboard__subtitle">{profile.specialty}</p>
            <h1>{profile.name}</h1>
          </div>
          <span className="doctor-dashboard__date">{formatToday()}</span>
        </header>

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
        </section>

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