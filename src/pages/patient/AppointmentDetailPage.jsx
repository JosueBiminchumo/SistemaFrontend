import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAppointmentById, cancelAppointment } from '../../services/appointmentService';
import { getMyPatientProfile } from '../../services/patientService';
import './AppointmentDetailPage.css';

const statusLabels = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

export default function AppointmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [patientName, setPatientName] = useState('Paciente');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetailData = async () => {
      try {
        setLoading(true);
        // Cargamos la cita y el perfil del paciente en paralelo
        const [apptData, profileData] = await Promise.all([
          getAppointmentById(id),
          getMyPatientProfile().catch(() => null) // Si el perfil falla, no bloqueamos la cita
        ]);

        setAppointment(apptData);

        if (profileData && profileData.nombre) {
          // Adaptamos el nombre si viene separado en nombre y apellido
          const fullName = profileData.apellido 
            ? `${profileData.nombre} ${profileData.apellido}` 
            : profileData.nombre;
          setPatientName(fullName);
        }
      } catch (error) {
        console.error('Error al cargar la cita:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetailData();
  }, [id]);

  if (loading) {
    return (
      <main className="appointment-detail-page">
        <section className="appointment-detail-container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando detalles de la cita...</p>
        </section>
      </main>
    );
  }

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
              <p>No se encontró la cita solicitada o hubo un error al cargarla.</p>
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
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      try {
        // Llamada a la API real para cancelar la cita
        await cancelAppointment(id);

        Swal.fire({
          title: 'Cita cancelada',
          text: 'Tu cita ha sido cancelada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
        }).then(() => {
          navigate('/paciente/mis-citas');
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo cancelar la cita. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#2563eb',
        });
      }
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
            {/* Si el backend envía imagen la mostramos, sino el icono por defecto */}
            {appointment.doctorImage ? (
              <img src={appointment.doctorImage} alt={appointment.doctor} style={{width: '100%', borderRadius: '50%'}} />
            ) : (
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
            )}
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
            <strong>{patientName}</strong>
          </div>

          <div className="detail-item">
            <span>Modalidad</span>
            <strong>Presencial</strong>
          </div>
        </section>

        <section className="reason-section">
          <h3>Motivo de la consulta</h3>
          <p>
            {appointment.reason || 'No se registró un motivo para esta cita.'}
          </p>
        </section>

        <section className="observations-section">
          <h3>Observaciones</h3>
          <p>
            {appointment.observations || 'No se registraron observaciones para esta cita.'}
          </p>
        </section>

        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div className="detail-actions">
            <button
              type="button"
              className="reschedule-button"
              onClick={() => navigate(`/paciente/cita/${appointment.id}/reprogramar`)}
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