import './BookAppointmentPage.css';

export default function BookAppointmentPage() {
  return (
    <main className="book-appointment-page">
      <section className="book-appointment-container">
        <div className="book-appointment-header">
          <h1>Reservar cita</h1>
          <p>
            Completa los datos para programar tu cita médica.
          </p>
        </div>

        <form className="appointment-form">
          <div className="form-group">
            <label htmlFor="doctor">Médico</label>
            <select id="doctor" name="doctor" required>
              <option value="">Selecciona un médico</option>
              <option value="1">
                Dr. Carlos Ramírez - Medicina General
              </option>
              <option value="2">
                Dra. María López - Cardiología
              </option>
              <option value="3">
                Dr. Juan Torres - Pediatría
              </option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input
                id="date"
                name="date"
                type="date"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Horario disponible</label>
              <select id="time" name="time" required>
                <option value="">Selecciona un horario</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motivo de la consulta</label>
            <textarea
              id="reason"
              name="reason"
              rows="5"
              placeholder="Describe brevemente el motivo de tu consulta"
              required
            />
          </div>

          <div className="appointment-actions">
            <button type="submit" className="reserve-button">
              Reservar cita
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}