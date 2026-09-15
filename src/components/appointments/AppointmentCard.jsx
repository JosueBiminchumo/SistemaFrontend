import { Link } from 'react-router-dom';
import AppointmentStatus from './AppointmentStatus';

export default function AppointmentCard({ appointment, onCancel }) {
  return (
    <article className="appointment-card">
      <div className="appointment-card-header">
        <div>
          <h2>{appointment.doctor}</h2>
          <p>{appointment.specialty}</p>
        </div>

        <AppointmentStatus status={appointment.status} />
      </div>

      <div className="appointment-info">
        <div>
          <span>Fecha</span>
          <strong>{appointment.date}</strong>
        </div>

        <div>
          <span>Hora</span>
          <strong>{appointment.time}</strong>
        </div>
      </div>

      <div className="appointment-card-actions">
        <Link
          to={`/paciente/cita/${appointment.id}`}
          className="detail-button"
        >
          Ver detalle
        </Link>

        {appointment.status !== 'cancelled' && (
          <>
            <Link
              to={`/paciente/cita/${appointment.id}/reprogramar`}
              className="reschedule-button"
            >
              Reprogramar
            </Link>

            <button
              className="cancel-button"
              onClick={() => onCancel(appointment.id)}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </article>
  );
}

