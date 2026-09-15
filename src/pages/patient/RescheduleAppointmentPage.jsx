import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './RescheduleAppointmentPage.css';

export default function RescheduleAppointmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const appointments = JSON.parse(
    localStorage.getItem('appointments') || '[]'
  );

  const appointment = appointments.find(
    (item) => String(item.id) === id
  );

  if (!appointment) {
    return (
      <main className="reschedule-appointment-page">
        <section className="reschedule-appointment-container">
          <button
            type="button"
            className="back-reschedule-button"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>

          <div className="reschedule-appointment-header">
            <h1>Cita no encontrada</h1>
            <p>No se encontró la cita que deseas reprogramar.</p>
          </div>
        </section>
      </main>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newDate = formData.get('new-date');
    const newTime = formData.get('new-time');
    const reason = formData.get('reason');

    const appointmentExists = appointments.some(
    (currentAppointment) =>
      currentAppointment.id !== appointment.id &&
      currentAppointment.doctor === appointment.doctor &&
      currentAppointment.date === newDate &&
      currentAppointment.time === newTime &&
      currentAppointment.status !== 'cancelled'
  );

  if (appointmentExists) {
    Swal.fire({
      title: 'Horario no disponible',
      text: 'El médico ya tiene una cita registrada en ese horario. Selecciona otra fecha u horario.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb',
    });

    return;
  }
    Swal.fire({
      title: '¿Guardar cambios?',
      text: 'La fecha y horario de tu cita serán actualizados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#e2e8f0',
      customClass: {
        cancelButton: 'swal-cancel-button',
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const updatedAppointments = appointments.map(
        (currentAppointment) =>
          currentAppointment.id === appointment.id
            ? {
                ...currentAppointment,
                date: newDate,
                time: newTime,
                reason: reason || currentAppointment.reason,
                status: 'pending',
              }
            : currentAppointment
      );

      localStorage.setItem(
        'appointments',
        JSON.stringify(updatedAppointments)
      );

      Swal.fire({
        title: 'Cita reprogramada',
        text: 'Los cambios se guardaron correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver cita',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate(`/paciente/cita/${appointment.id}`);
      });
    });
  };

  return (
    <main className="reschedule-appointment-page">
      <section className="reschedule-appointment-container">
        <button
          type="button"
          className="back-reschedule-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="reschedule-appointment-header">
          <h1>Reprogramar cita</h1>
          <p>Selecciona una nueva fecha y horario para tu cita.</p>
        </div>

        <section className="current-appointment">
          <div className="current-appointment-title">
            <h2>Cita actual</h2>
            <span>
              Información de la cita que deseas reprogramar.
            </span>
          </div>

          <div className="current-appointment-info">
            <div>
              <span>Médico</span>
              <strong>{appointment.doctor}</strong>
            </div>

            <div>
              <span>Especialidad</span>
              <strong>{appointment.specialty}</strong>
            </div>

            <div>
              <span>Fecha y hora</span>
              <strong>
                {appointment.date} - {appointment.time}
              </strong>
            </div>
          </div>
        </section>

        <form
          className="reschedule-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <div className="form-section-title">
              <h2>Nueva fecha y horario</h2>
              <p>
                Selecciona cuándo deseas realizar tu cita.
              </p>
            </div>

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
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <h2>Motivo</h2>
              <p>
                Puedes indicar por qué deseas reprogramar tu cita.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Motivo de la reprogramación</label>

              <textarea
                id="reason"
                name="reason"
                rows="4"
                defaultValue={appointment.reason || ''}
                placeholder="Indica el motivo de la reprogramación"
              />
            </div>
          </div>

          <div className="reschedule-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
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