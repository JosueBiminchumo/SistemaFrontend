import './MyAppointmentsPage.css';

export default function MyAppointmentsPage() {
  return (
    <main className="my-appointments-page">
      <section className="my-appointments-container">
        <div className="my-appointments-header">
          <div>
            <h1>Mis citas</h1>
            <p>Consulta y gestiona tus citas médicas.</p>
          </div>

          <button className="new-appointment-button">
            Nueva cita
          </button>
        </div>

        <div className="appointments-list">
          <article className="appointment-card">
            <div className="appointment-card-header">
              <div>
                <h2>Dr. Carlos Ramírez</h2>
                <p>Medicina General</p>
              </div>

              <span className="appointment-status status-confirmed">
                Confirmada
              </span>
            </div>

            <div className="appointment-info">
              <div>
                <span>Fecha</span>
                <strong>20 de septiembre de 2026</strong>
              </div>

              <div>
                <span>Hora</span>
                <strong>09:00</strong>
              </div>
            </div>

            <div className="appointment-card-actions">
              <button className="detail-button">
                Ver detalle
              </button>

              <button className="reschedule-button">
                Reprogramar
              </button>

              <button className="cancel-button">
                Cancelar
              </button>
            </div>
          </article>

          <article className="appointment-card">
            <div className="appointment-card-header">
              <div>
                <h2>Dra. María López</h2>
                <p>Cardiología</p>
              </div>

              <span className="appointment-status status-pending">
                Pendiente
              </span>
            </div>

            <div className="appointment-info">
              <div>
                <span>Fecha</span>
                <strong>25 de septiembre de 2026</strong>
              </div>

              <div>
                <span>Hora</span>
                <strong>15:00</strong>
              </div>
            </div>

            <div className="appointment-card-actions">
              <button className="detail-button">
                Ver detalle
              </button>

              <button className="reschedule-button">
                Reprogramar
              </button>

              <button className="cancel-button">
                Cancelar
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}