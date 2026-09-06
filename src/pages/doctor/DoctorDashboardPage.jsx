import { Link } from 'react-router-dom';
import { todayAppointments, upcomingAppointments, doctorSummary } from './doctorDashboardMock';
import './DoctorDashboardPage.css';

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function DoctorDashboardPage() {
  return (
    <div className="doctor-dashboard">
      <header className="doctor-dashboard__header">
        <div className="doctor-dashboard__avatar">{getInitials(doctorSummary.name)}</div>
        <div>
          <h1>Bienvenido, {doctorSummary.name}</h1>
          <p className="doctor-dashboard__subtitle">
            <span className="doctor-dashboard__badge">{doctorSummary.specialty}</span>
          </p>
        </div>
      </header>

      <section className="doctor-dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__value">{doctorSummary.totalToday}</span>
          <span className="stat-card__label">Citas de hoy</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{doctorSummary.totalPending}</span>
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
  );
}