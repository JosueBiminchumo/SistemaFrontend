import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cancelAppointment, getAppointment } from '../../services/appointmentService';
import './AppointmentDetailPage.css';

const statusLabels = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export default function AppointmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointment(id)
      .then(setAppointment)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: '¿Cancelar esta cita?',
      text: 'La cita pasará a estado cancelada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cancelar cita',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#e2e8f0',
      customClass: { cancelButton: 'swal-cancel-button' },
    });

    if (!result.isConfirmed) return;

    try {
      setAppointment(await cancelAppointment(appointment.id));
      await Swal.fire({
        title: 'Cita cancelada',
        text: 'Tu cita ha sido cancelada correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver mis citas',
        confirmButtonColor: '#2563eb',
      });
      navigate('/paciente/mis-citas');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) {
    return <main className="appointment-detail-page"><p role="status">Cargando cita...</p></main>;
  }

  if (!appointment) {
    return (
      <main className="appointment-detail-page">
        <section className="appointment-detail-container">
          <button type="button" className="back-detail-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <div className="appointment-detail-header">
            <div>
              <h1>Cita no encontrada</h1>
              <p role="alert">{error || 'No se encontró la cita solicitada.'}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const statusClass = `status-${appointment.status.toLowerCase()}`;

  return (
    <main className="appointment-detail-page">
      <section className="appointment-detail-container">
        <button type="button" className="back-detail-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="appointment-detail-header">
          <div>
            <h1>Detalle de cita</h1>
            <p>Información registrada para tu cita médica.</p>
          </div>
          <span className={`detail-status ${statusClass}`}>
            {statusLabels[appointment.status] ?? appointment.status}
          </span>
        </div>

        {error && <p role="alert">{error}</p>}

        <section className="doctor-section">
          <div className="doctor-avatar" aria-hidden="true">🩺</div>
          <div>
            <h2>{appointment.doctorName}</h2>
            <p>{appointment.specialty}</p>
          </div>
        </section>

        <section className="appointment-detail-info">
          <div className="detail-item">
            <span>Fecha</span>
            <strong>{appointment.startAt.slice(0, 10)}</strong>
          </div>
          <div className="detail-item">
            <span>Hora</span>
            <strong>{appointment.startAt.slice(11, 16)}</strong>
          </div>
          <div className="detail-item">
            <span>Paciente</span>
            <strong>{appointment.patientName}</strong>
          </div>
        </section>

        <section className="reason-section">
          <h3>Motivo de la consulta</h3>
          <p>{appointment.reason}</p>
        </section>

        {['PENDING', 'CONFIRMED'].includes(appointment.status) && (
          <div className="detail-actions">
            <button
              type="button"
              className="reschedule-button"
              onClick={() => navigate(`/paciente/cita/${appointment.id}/reprogramar`)}
            >
              Reprogramar cita
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancelar cita
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
