import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getAppointment,
  rescheduleAppointment,
} from '../../services/appointmentService';
import { getDoctorSchedule } from '../../services/doctorService';
import './RescheduleAppointmentPage.css';

function localDateString(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function RescheduleAppointmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAppointment(id)
      .then((item) => {
        setAppointment(item);
        setReason(item.reason);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!appointment || !date) return undefined;

    let active = true;
    getDoctorSchedule(appointment.doctorId, date)
      .then((schedules) => {
        if (active) {
          setAvailableTimes([...new Set(
            schedules.flatMap((schedule) => schedule.availableSlots.map((slot) => slot.slice(0, 5)))
          )].sort());
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [appointment, date]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!appointment || !availableTimes.includes(time)) {
      setError('Selecciona un horario disponible para esa fecha.');
      return;
    }

    const confirmation = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'La fecha y el horario serán actualizados en tu cuenta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#e2e8f0',
      customClass: { cancelButton: 'swal-cancel-button' },
    });
    if (!confirmation.isConfirmed) return;

    setSaving(true);
    setError('');
    try {
      await rescheduleAppointment(appointment.id, {
        doctorId: appointment.doctorId,
        startAt: `${date}T${time}:00`,
        reason: reason.trim(),
      });
      await Swal.fire({
        title: 'Cita reprogramada',
        text: 'Los cambios se guardaron correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver cita',
        confirmButtonColor: '#2563eb',
      });
      navigate(`/paciente/cita/${appointment.id}`);
    } catch (requestError) {
      setError(requestError.message);
      await Swal.fire({
        title: 'No se pudo reprogramar',
        text: requestError.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="reschedule-appointment-page"><p role="status">Cargando cita...</p></main>;
  }

  if (!appointment) {
    return (
      <main className="reschedule-appointment-page">
        <section className="reschedule-appointment-container">
          <h1>Cita no encontrada</h1>
          <p role="alert">{error || 'No se encontró la cita que deseas reprogramar.'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="reschedule-appointment-page">
      <section className="reschedule-appointment-container">
        <button type="button" className="back-reschedule-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="reschedule-appointment-header">
          <h1>Reprogramar cita</h1>
          <p>Selecciona una nueva fecha y un horario disponible.</p>
        </div>
        {error && <p role="alert">{error}</p>}

        <section className="current-appointment">
          <div className="current-appointment-title">
            <h2>Cita actual</h2>
            <span>Información registrada en el sistema.</span>
          </div>
          <div className="current-appointment-info">
            <div><span>Médico</span><strong>{appointment.doctorName}</strong></div>
            <div><span>Especialidad</span><strong>{appointment.specialty}</strong></div>
            <div>
              <span>Fecha y hora</span>
              <strong>{appointment.startAt.slice(0, 10)} - {appointment.startAt.slice(11, 16)}</strong>
            </div>
          </div>
        </section>

        <form className="reschedule-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">
              <h2>Nueva fecha y horario</h2>
              <p>Los horarios se consultan al servidor según la agenda del médico.</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-date">Nueva fecha</label>
                <input
                  id="new-date"
                  type="date"
                  value={date}
                  min={localDateString(new Date())}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setTime('');
                    setAvailableTimes([]);
                    setError('');
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-time">Horario disponible</label>
                <select
                  id="new-time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  disabled={!date || availableTimes.length === 0}
                  required
                >
                  <option value="">Selecciona un horario</option>
                  {availableTimes.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {date && availableTimes.length === 0 && (
                  <small>No hay horarios disponibles para esta fecha.</small>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <h2>Motivo</h2>
              <p>Actualiza el motivo de la cita si es necesario.</p>
            </div>
            <div className="form-group">
              <label htmlFor="reason">Motivo de la cita</label>
              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="reschedule-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
