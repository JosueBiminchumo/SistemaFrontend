import { Link } from 'react-router-dom';
import './PatientDashboard.css';

export default function PatientDashboard() {
  return (
    <main className="patient-dashboard">
      <section className="patient-dashboard-container">
        <div className="patient-dashboard-header">
          <div>
            <span className="patient-dashboard-label">Portal del paciente</span>
            <h1>¡Hola, Juan!</h1>
            <p>Gestiona tus citas y consulta tu información médica.</p>
          </div>

          <Link to="/paciente/perfil" className="profile-button">
            Mi perfil
          </Link>
        </div>

        <section className="next-appointment-card">
          <div className="next-appointment-header">
            <div>
              <span>PRÓXIMA CITA</span>
              <h2>Dr. Carlos Ramírez</h2>
              <p>Medicina General</p>
            </div>

            <span className="appointment-status">
              Confirmada
            </span>
          </div>

          <div className="appointment-details">
            <div className="appointment-detail">
              <span>Fecha</span>
              <strong>20 septiembre 2026</strong>
            </div>

            <div className="appointment-detail">
              <span>Hora</span>
              <strong>09:00 a. m.</strong>
            </div>

            <div className="appointment-detail">
              <span>Modalidad</span>
              <strong>Presencial</strong>
            </div>
          </div>

          <div className="next-appointment-actions">
            <Link to="/paciente/cita/1">
              Ver detalle
            </Link>

            <Link to="/paciente/cita/1/reprogramar">
              Reprogramar
            </Link>
          </div>
        </section>

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
              <strong>2</strong>
            </div>

            <div className="summary-card">
              <span>Citas pendientes</span>
              <strong>1</strong>
            </div>

            <div className="summary-card">
              <span>Citas atendidas</span>
              <strong>5</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}