import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AppointmentDetailPage.css';

const statusLabels = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  completed: 'Completada',
  atendida: 'Completada',
};

export default function AppointmentDetailPage() {
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
      <main className="appointment-detail-page">
        <section className="appointment-detail-container">
          <button
            type="button"
            className="back-detail-button"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>

          <div className="appointment-detail-header">
            <div>
              <h1>Cita no encontrada</h1>
              <p>No se encontró la cita solicitada.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const handleCancel = () => {
    Swal.fire({
      title: '¿Cancelar esta cita?',
      text: 'La cita pasará a estado cancelada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cancelar cita',
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
                status: 'cancelled',
              }
            : currentAppointment
      );

      localStorage.setItem(
        'appointments',
        JSON.stringify(updatedAppointments)
      );

      Swal.fire({
        title: 'Cita cancelada',
        text: 'Tu cita ha sido cancelada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/paciente/mis-citas');
      });
    });
  };

  const statusClass = `status-${appointment.status}`;

  return (
    <main className="appointment-detail-page">
      <section className="appointment-detail-container">
        <button
          type="button"
          className="back-detail-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="appointment-detail-header">
          <div>
            <h1>Detalle de cita</h1>
            <p>Información de tu cita médica.</p>
          </div>

          <span className={`detail-status ${statusClass}`}>
            {statusLabels[appointment.status] || 'Pendiente'}
          </span>
        </div>

        <section className="doctor-section">
          <div className="doctor-avatar">
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

          <div>
            <h2>{appointment.doctor}</h2>
            <p>{appointment.specialty}</p>
          </div>
        </section>

        <section className="appointment-detail-info">
          <div className="detail-item">
            <span>Fecha</span>
            <strong>{appointment.date}</strong>
          </div>

          <div className="detail-item">
            <span>Hora</span>
            <strong>{appointment.time}</strong>
          </div>

          <div className="detail-item">
            <span>Paciente</span>
            <strong>Juan Pérez</strong>
          </div>

          <div className="detail-item">
            <span>Modalidad</span>
            <strong>Presencial</strong>
          </div>
        </section>

        <section className="reason-section">
          <h3>Motivo de la consulta</h3>

          <p>
            {appointment.reason ||
              'No se registró un motivo para esta cita.'}
          </p>
        </section>

        <section className="observations-section">
          <h3>Observaciones</h3>

          <p>
            {appointment.observations ||
              'No se registraron observaciones para esta cita.'}
          </p>
        </section>

        {appointment.status !== 'cancelled' &&
          appointment.status !== 'completed' &&
          appointment.status !== 'atendida' && (
            <div className="detail-actions">
              <button
                type="button"
                className="reschedule-button"
                onClick={() =>
                  navigate(
                    `/paciente/cita/${appointment.id}/reprogramar`
                  )
                }
              >
                Reprogramar cita
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancelar cita
              </button>
            </div>
          )}
      </section>
    </main>
  );
}