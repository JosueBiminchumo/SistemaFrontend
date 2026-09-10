import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorAppointments } from './doctorAppointmentsMock';
import './DoctorAppointmentDetailPage.css';

const nextStatusOptions = {
  PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['COMPLETADA', 'CANCELADA'],
  COMPLETADA: [],
  CANCELADA: [],
};

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams();

  const original = useMemo(
    () => doctorAppointments.find((appt) => appt.id === Number(id)),
    [id]
  );

  const [status, setStatus] = useState(original?.status);
  const [feedback, setFeedback] = useState('');

  if (!original) {
    return (
      <div className="doctor-appointment-detail">
        <p className="doctor-appointment-detail__empty">Cita no encontrada.</p>
        <Link to="/medico/citas">← Volver a mis citas</Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setFeedback(`Estado actualizado a ${newStatus}.`);
    setTimeout(() => setFeedback(''), 2500);
  };

  return (
    <div className="doctor-appointment-detail">
      <Link to="/medico/citas" className="doctor-appointment-detail__back">← Volver a mis citas</Link>

      <header className="doctor-appointment-detail__header">
        <h1>Cita con {original.patientName}</h1>
        <span className={`appointment-status appointment-status--${status.toLowerCase()}`}>
          {status}
        </span>
      </header>

      {feedback && <div className="doctor-appointment-detail__feedback">{feedback}</div>}

      <div className="doctor-appointment-detail__card">
        <div className="detail-row">
          <span className="detail-row__label">Paciente</span>
          <span className="detail-row__value">{original.patientName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Fecha</span>
          <span className="detail-row__value">{original.date}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Hora</span>
          <span className="detail-row__value">{original.time}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Motivo</span>
          <span className="detail-row__value">{original.reason}</span>
        </div>
      </div>

      {nextStatusOptions[status]?.length > 0 && (
        <div className="doctor-appointment-detail__actions">
          <span className="doctor-appointment-detail__actions-label">Actualizar estado:</span>
          {nextStatusOptions[status].map((option) => (
            <button
              key={option}
              type="button"
              className={`btn-status btn-status--${option.toLowerCase()}`}
              onClick={() => handleStatusChange(option)}
            >
              Marcar como {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
