import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAppointmentById, rescheduleAppointment } from '../../services/appointmentService';
import { getDoctorSlots } from '../../services/doctorService';
import './RescheduleAppointmentPage.css';

export default function RescheduleAppointmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [slots, setSlots] = useState([]);

  // 1. Cargar la cita actual
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentById(id);
        setAppointment(data);
        setReason(data.reason || ''); // Cargamos el motivo original
      } catch (error) {
        console.error('Error al cargar la cita:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  // 2. Cargar los horarios cuando el usuario selecciona una nueva fecha
  useEffect(() => {
    const fetchSlots = async () => {
      if (!newDate || !appointment?.doctorId) {
        setSlots([]);
        return;
      }
      try {
        setNewTime(''); // Limpiamos la hora seleccionada previamente
        const data = await getDoctorSlots(appointment.doctorId, newDate);
        setSlots(data);
      } catch (error) {
        console.error('Error cargando horarios disponibles:', error);
        setSlots([]);
      }
    };
    fetchSlots();
  }, [newDate, appointment]);

  if (loading) {
    return (
      <main className="reschedule-appointment-page">
        <section className="reschedule-appointment-container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </section>
      </main>
    );
  }

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

    if (!newDate || !newTime || !reason.trim()) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'Asegúrate de seleccionar fecha, horario y especificar el motivo.',
        icon: 'warning',
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
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      try {
        // Llamada a la API real: elimina el chequeo manual y confía en el backend
        await rescheduleAppointment(id, {
          doctorId: appointment.doctorId,
          date: newDate,
          time: newTime,
          reason: reason
        });

        // Mantener las notificaciones locales porque no tienen API aún
        const currentUser = JSON.parse(localStorage.getItem('mediturn_user') || '{}');
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const newNotification = {
          id: `appointment-rescheduled-${appointment.id}-${Date.now()}`,
          appointmentId: appointment.id,
          patientId: currentUser.id,
          message: `Tu cita con ${appointment.doctor} fue reprogramada para el ${newDate} a las ${newTime}.`,
          date: newDate,
          time: newTime,
          read: false,
        };
        localStorage.setItem('notifications', JSON.stringify([newNotification, ...storedNotifications]));

        Swal.fire({
          title: 'Cita reprogramada',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          confirmButtonText: 'Ver cita',
          confirmButtonColor: '#2563eb',
        }).then(() => {
          navigate(`/paciente/cita/${appointment.id}`);
        });
      } catch (error) {
        Swal.fire({
          title: 'No se pudo reprogramar',
          text: error.message || 'El médico ya tiene una cita registrada en ese horario o hubo un problema. Selecciona otro.',
          icon: 'error',
          confirmButtonColor: '#2563eb',
        });
      }
    });
  };

  const availableSlots = slots.filter((slot) => slot.available);

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
            <span>Información de la cita que deseas reprogramar.</span>
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
              <span>Fecha y hora actuales</span>
              <strong>
                {appointment.date} a las {appointment.time}
              </strong>
            </div>
          </div>
        </section>

        <form className="reschedule-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">
              <h2>Nueva fecha y horario</h2>
              <p>Selecciona cuándo deseas realizar tu cita.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-date">Nueva fecha</label>
                <input
                  id="new-date"
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-time">Horario disponible</label>
                <select 
                  id="new-time" 
                  required 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  disabled={!newDate || availableSlots.length === 0}
                >
                  <option value="">
                    {!newDate 
                      ? 'Selecciona una fecha primero' 
                      : availableSlots.length === 0 
                      ? 'No hay horarios' 
                      : 'Selecciona un horario'}
                  </option>
                  
                  {availableSlots.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <h2>Motivo</h2>
              <p>Puedes indicar por qué deseas reprogramar tu cita.</p>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Motivo de la reprogramación</label>
              <textarea
                id="reason"
                rows="4"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Indica el motivo de la reprogramación (requerido)"
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