import { Link } from 'react-router-dom';
import './PatientDashboard.css';

function getAppointments() {
  const storedAppointments = localStorage.getItem('appointments');

  if (!storedAppointments) {
    return [];
  }

  return JSON.parse(storedAppointments);
}

function getProfile() {
  const storedProfile = localStorage.getItem('patientProfile');

  if (!storedProfile) {
    return {
      firstName: 'Juan',
      lastName: 'Pérez',
    };
  }

  return JSON.parse(storedProfile);
}

function formatDate(date) {
  if (!date) {
    return '';
  }

  if (date.includes(' de ')) {
    return date;
  }

  const [year, month, day] = date.split('-');

  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  return `${day} de ${months[Number(month) - 1]} de ${year}`;
}

export default function PatientDashboard() {
  const profile = getProfile();
  const appointments = getAppointments();

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== 'cancelled'
  );

  const nextAppointment = activeAppointments[0];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'pending'
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'completed'
  );

  return (
    <main className="patient-dashboard">
      <section className="patient-dashboard-container">
        <div className="patient-dashboard-header">
          <div>
            <span className="patient-dashboard-label">
              Portal del paciente
            </span>

            <h1>¡Hola, {profile.firstName}!</h1>

            <p>Gestiona tus citas y consulta tu información médica.</p>
          </div>

          <Link to="/paciente/perfil" className="profile-button">
            Mi perfil
          </Link>
        </div>

        {nextAppointment ? (
          <section className="next-appointment-card">
            <div className="next-appointment-header">
              <div>
                <span>PRÓXIMA CITA</span>

                <h2>{nextAppointment.doctor}</h2>

                <p>{nextAppointment.specialty}</p>
              </div>

              <span className="appointment-status">
                {nextAppointment.status === 'confirmed'
                  ? 'Confirmada'
                  : nextAppointment.status === 'pending'
                    ? 'Pendiente'
                    : nextAppointment.status === 'completed'
                      ? 'Atendida'
                      : 'Pendiente'}
              </span>
            </div>

            <div className="appointment-details">
              <div className="appointment-detail">
                <span>Fecha</span>

                <strong>
                  {formatDate(nextAppointment.date)}
                </strong>
              </div>

              <div className="appointment-detail">
                <span>Hora</span>

                <strong>{nextAppointment.time}</strong>
              </div>

              <div className="appointment-detail">
                <span>Modalidad</span>

                <strong>Presencial</strong>
              </div>
            </div>

            <div className="next-appointment-actions">
              <Link
                to={`/paciente/cita/${nextAppointment.id}`}
              >
                Ver detalle
              </Link>

              {nextAppointment.status !== 'completed' && (
                <Link
                  to={`/paciente/cita/${nextAppointment.id}/reprogramar`}
                >
                  Reprogramar
                </Link>
              )}
            </div>
          </section>
        ) : (
          <section className="next-appointment-card">
            <div className="next-appointment-header">
              <div>
                <span>PRÓXIMA CITA</span>

                <h2>No tienes citas próximas</h2>

                <p>
                  Puedes reservar una nueva cita cuando lo necesites.
                </p>
              </div>
            </div>

            <div className="next-appointment-actions">
              <Link to="/paciente/reservar-cita">
                Reservar cita
              </Link>
            </div>
          </section>
        )}

        <section className="patient-dashboard-section">
          <div className="section-title">
            <h2>¿Qué deseas hacer?</h2>

            <p>Accede rápidamente a las opciones de tu cuenta.</p>
          </div>

          <div className="patient-dashboard-actions">
            <Link to="/paciente/reservar-cita" className="dashboard-action">
              <span className="dashboard-action-icon">+</span>

              <div>
                <strong>Solicitar una cita</strong>

                <span>Agenda una nueva consulta médica</span>
              </div>
            </Link>

            <Link to="/paciente/mis-citas" className="dashboard-action">
              <span className="dashboard-action-icon">✓</span>

              <div>
                <strong>Mis citas</strong>

                <span>Consulta y administra tus citas</span>
              </div>
            </Link>

            <Link to="/paciente/perfil" className="dashboard-action">
              <span className="dashboard-action-icon">◯</span>

              <div>
                <strong>Mi perfil</strong>
                <span>Actualiza tus datos personales</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="patient-dashboard-section">
          <div className="section-title">
            <h2>Resumen</h2>
          </div>

          <div className="dashboard-summary">
            <div className="summary-card">
              <span>Próximas citas</span>

              <strong>{activeAppointments.length}</strong>
            </div>

            <div className="summary-card">
              <span>Citas pendientes</span>

              <strong>{pendingAppointments.length}</strong>
            </div>

            <div className="summary-card">
              <span>Citas atendidas</span>

              <strong>{completedAppointments.length}</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}