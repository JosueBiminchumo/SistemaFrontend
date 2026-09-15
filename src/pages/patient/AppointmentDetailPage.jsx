import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AppointmentDetailPage.css';

const statusLabels = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  completed: 'Atendida',
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
            <h1>Detalle de la cita</h1>
            <p>Información de tu cita médica.</p>
          </div>

          <span className={`detail-status ${statusClass}`}>
            {statusLabels[appointment.status] || 'Pendiente'}
          </span>
        </div>

        <section className="doctor-section">
          <div className="doctor-avatar">
            {appointment.doctor
              .split(' ')
              .filter((word) => word.length > 0)
              .slice(0, 2)
              .map((word) => word[0])
              .join('')}
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

        {appointment.status !== 'cancelled' &&
          appointment.status !== 'completed' && (
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