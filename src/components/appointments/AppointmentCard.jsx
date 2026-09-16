import { Link } from 'react-router-dom';
import AppointmentStatus from './AppointmentStatus';

export default function AppointmentCard({ appointment, onCancel }) {
  const canCancel =
    appointment.status === 'pending' ||
    appointment.status === 'confirmed';

  return (
    <article className="card">
      <div className="avatar">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 2v6" />
          <path d="M15 2v6" />
          <path d="M9 8h8a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5v0" />
          <path d="M14 17v2a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-2" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      </div>

      <div className="info">
        <div className="info-top">
          <h3>{appointment.doctor}</h3>
          <AppointmentStatus status={appointment.status} />
        </div>

        <p className="meta">
          {appointment.specialty} · {appointment.date} · {appointment.time}
        </p>

        <p className="desc">
          {appointment.reason || 'Sin motivo especificado'}
        </p>
      </div>

      <div className="actions">
        <Link
          to={`/paciente/cita/${appointment.id}`}
          className="icon-btn"
          title="Ver detalle"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>

        {canCancel && (
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onCancel(appointment.id)}
            title="Cancelar cita"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="M9 9l6 6" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
