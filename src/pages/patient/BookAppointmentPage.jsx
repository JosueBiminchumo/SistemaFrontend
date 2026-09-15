import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './BookAppointmentPage.css';

const doctors = {
  1: {
    name: 'Dr. Carlos Ramírez',
    specialty: 'Medicina General',
  },
  2: {
    name: 'Dra. María López',
    specialty: 'Cardiología',
  },
  3: {
    name: 'Dr. Juan Torres',
    specialty: 'Pediatría',
  },
};

export default function BookAppointmentPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const doctorId = formData.get('doctor');
    const date = formData.get('date');
    const time = formData.get('time');
    const reason = formData.get('reason');

    const doctor = doctors[doctorId];

    const storedAppointments = JSON.parse(
      localStorage.getItem('appointments') || '[]'
    );

    const appointmentExists = storedAppointments.some(
      (appointment) =>
        appointment.doctor === doctor.name &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.status !== 'cancelled'
    );

    if (appointmentExists) {
      Swal.fire({
        title: 'Horario no disponible',
        text: 'El médico ya tiene una cita registrada en ese horario. Selecciona otro horario.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });

      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctor: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      reason,
      status: 'pending',
    };

    const updatedAppointments = [
      ...storedAppointments,
      newAppointment,
    ];

    localStorage.setItem(
      'appointments',
      JSON.stringify(updatedAppointments)
    );

    Swal.fire({
      title: 'Cita reservada',
      text: 'Tu cita ha sido registrada correctamente.',
      icon: 'success',
      confirmButtonText: 'Ver mis citas',
      confirmButtonColor: '#2563eb',
    }).then(() => {
      navigate('/paciente/mis-citas');
    });
  };

  return (
    <main className="book-appointment-page">
      <section className="book-appointment-container">
        <button
          type="button"
          className="back-booking-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="book-appointment-header">
          <h1>Reservar cita</h1>
          <p>
            Completa los datos para programar tu cita médica.
          </p>
        </div>

        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >
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
                <option value="">
                  Selecciona un horario
                </option>

                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">
              Motivo de la consulta
            </label>

            <textarea
              id="reason"
              name="reason"
              rows="5"
              placeholder="Describe brevemente el motivo de tu consulta"
              required
            />
          </div>

          <div className="appointment-actions">
            <button
              type="submit"
              className="reserve-button"
            >
              Reservar cita
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
