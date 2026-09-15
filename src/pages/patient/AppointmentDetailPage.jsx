import './AppointmentDetailPage.css';

export default function AppointmentDetailPage() {
  return (
    <main className="appointment-detail-page">
      <section className="appointment-detail-container">
        <div className="appointment-detail-header">
          <div>
            <h1>Detalle de la cita</h1>
            <p>Información de tu cita médica.</p>
          </div>

          <span className="detail-status">
            Confirmada
          </span>
        </div>

        <div className="doctor-section">
          <div className="doctor-avatar">
            CR
          </div>

          <div>
            <h2>Dr. Carlos Ramírez</h2>
            <p>Medicina General</p>
          </div>
        </div>

        <div className="appointment-detail-info">
          <div className="detail-item">
            <span>Fecha</span>
            <strong>20 de septiembre de 2026</strong>
          </div>

          <div className="detail-item">
            <span>Hora</span>
            <strong>09:00</strong>
          </div>

          <div className="detail-item">
            <span>Paciente</span>
            <strong>Juan Pérez</strong>
          </div>

          <div className="detail-item">
            <span>Estado</span>
            <strong>Confirmada</strong>
          </div>
        </div>

        <div className="reason-section">
          <h3>Motivo de la consulta</h3>
          <p>
            Consulta médica general para evaluación y seguimiento
            del estado de salud.
          </p>
        </div>

        <div className="detail-actions">
          <button className="reschedule-button">
            Reprogramar cita
          </button>

          <button className="cancel-button">
            Cancelar cita
          </button>
        </div>
      </section>
    </main>
  );
}