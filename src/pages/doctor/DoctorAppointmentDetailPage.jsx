import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppointment, updateAppointmentStatus } from '../../services/appointmentService';
import DoctorLayout from './DoctorLayout';
import './DoctorAppointmentDetailPage.css';

const nextStatusOptions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const statusLabels = {
  PENDING: 'PENDIENTE',
  CONFIRMED: 'CONFIRMADA',
  COMPLETED: 'COMPLETADA',
  CANCELLED: 'CANCELADA',
};

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointment(id)
      .then(setAppointment)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setError('');
    try {
      const updated = await updateAppointmentStatus(appointment.id, newStatus);
      setAppointment(updated);
      setFeedback(`Estado actualizado a ${statusLabels[updated.status] ?? updated.status}.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <DoctorLayout>
      <div className="doctor-appointment-detail">
        <Link to="/medico/citas" className="doctor-appointment-detail__back">
          ← Volver a mis citas
        </Link>

        {loading && <p role="status">Cargando cita...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !appointment ? (
          <p className="doctor-appointment-detail__empty">No se encontró la cita.</p>
        ) : appointment ? (
          <>
            <header className="doctor-appointment-detail__header">
              <h1>Cita con {appointment.patientName}</h1>
              <span className={`appointment-status appointment-status--${appointment.status.toLowerCase()}`}>
                {statusLabels[appointment.status] ?? appointment.status}
              </span>
            </header>

            {feedback && <div className="doctor-appointment-detail__feedback">{feedback}</div>}

            <div className="doctor-appointment-detail__card">
              <div className="detail-row">
                <span className="detail-row__label">Paciente</span>
                <span className="detail-row__value">{appointment.patientName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Fecha</span>
                <span className="detail-row__value">{appointment.startAt.slice(0, 10)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Hora</span>
                <span className="detail-row__value">{appointment.startAt.slice(11, 16)}</span>
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
                    className={`btn-status btn-status--${option.toLowerCase()}`}
                    onClick={() => handleStatusChange(option)}
                  >
                    Marcar como {statusLabels[option]}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </DoctorLayout>
  );
}
