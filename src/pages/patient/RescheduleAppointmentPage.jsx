import './RescheduleAppointmentPage.css';

export default function RescheduleAppointmentPage() {
  return (
    <main className="reschedule-appointment-page">
      <section className="reschedule-appointment-container">
        <div className="reschedule-appointment-header">
          <h1>Reprogramar cita</h1>
          <p>Selecciona una nueva fecha y horario para tu cita.</p>
        </div>

        <div className="current-appointment">
          <div>
            <span>Médico</span>
            <strong>Dr. Carlos Ramírez</strong>
          </div>

          <div>
            <span>Especialidad</span>
            <strong>Medicina General</strong>
          </div>

          <div>
            <span>Cita actual</span>
            <strong>20 de septiembre de 2026 - 09:00</strong>
          </div>
        </div>

        <form className="reschedule-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="new-date">Nueva fecha</label>
              <input
                id="new-date"
                name="new-date"
                type="date"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-time">Horario disponible</label>
              <select id="new-time" name="new-time" required>
                <option value="">Selecciona un horario</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motivo de la reprogramación</label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              placeholder="Indica el motivo de la reprogramación"
            />
          </div>

          <div className="reschedule-actions">
            <button type="button" className="cancel-button">
              Cancelar
            </button>

            <button type="submit" className="save-button">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}