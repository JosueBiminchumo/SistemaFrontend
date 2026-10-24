import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppointment, updateStatus } from './doctorApi';
import DoctorLayout from './DoctorLayout';
import './DoctorAppointmentDetailPage.css';

const nextStatusOptions = {
  PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['COMPLETADA', 'CANCELADA'],
  COMPLETADA: [],
  CANCELADA: [],
};

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alive = true;
    getAppointment(id)
      .then((appt) => alive && setAppointment(appt))
      .catch(() => alive && setNotFound(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <DoctorLayout>
        <div className="doctor-appointment-detail">
          <p className="doctor-appointment-detail__empty">Cargando cita...</p>
        </div>
      </DoctorLayout>
    );
  }

  if (notFound || !appointment) {
    return (
      <DoctorLayout>
        <div className="doctor-appointment-detail">
          <p className="doctor-appointment-detail__empty">Cita no encontrada.</p>
          <Link to="/medico/citas">← Volver a mis citas</Link>
        </div>
      </DoctorLayout>
    );
  }

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    setErrorMessage('');
    try {
      const updated = await updateStatus(appointment.id, newStatus);
      setAppointment(updated);
      setFeedback(`Estado actualizado a ${updated.status}.`);
      setTimeout(() => setFeedback(''), 2500);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo actualizar el estado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="doctor-appointment-detail">
        <Link to="/medico/citas" className="doctor-appointment-detail__back">← Volver a mis citas</Link>

        <header className="doctor-appointment-detail__header">
          <h1>Cita con {appointment.patientName}</h1>
          <span className={`appointment-status appointment-status--${appointment.status.toLowerCase()}`}>
            {appointment.status}
          </span>
        </header>

        {feedback && <div className="doctor-appointment-detail__feedback">{feedback}</div>}
        {errorMessage && <div className="doctor-appointment-detail__feedback" role="alert">{errorMessage}</div>}

        <div className="doctor-appointment-detail__card">
          <div className="detail-row">
            <span className="detail-row__label">Paciente</span>
            <span className="detail-row__value">{appointment.patientName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label">Fecha</span>
            <span className="detail-row__value">{appointment.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label">Hora</span>
            <span className="detail-row__value">{appointment.time} - {appointment.endTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label">Motivo</span>
            <span className="detail-row__value">{appointment.reason}</span>
          </div>
        </div>

        {nextStatusOptions[appointment.status]?.length > 0 && (
          <div className="doctor-appointment-detail__actions">
            <span className="doctor-appointment-detail__actions-label">Actualizar estado:</span>
            {nextStatusOptions[appointment.status].map((option) => (
              <button
                key={option}
                type="button"
                disabled={saving}
                className={`btn-status btn-status--${option.toLowerCase()}`}
                onClick={() => handleStatusChange(option)}
              >
                Marcar como {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
