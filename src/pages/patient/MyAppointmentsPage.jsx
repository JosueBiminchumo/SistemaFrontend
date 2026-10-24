import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import './MyAppointmentsPage.css';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Función para cargar las citas reales desde el backend
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar tus citas médicas.',
        icon: 'error',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar el componente
  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = (id) => {
    Swal.fire({
      title: '¿Estás seguro de que deseas cancelar esta cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
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
        // Llamada a la API para cancelar
        await cancelAppointment(id);

        Swal.fire({
          title: 'Cita cancelada',
          text: 'Tu cita ha sido cancelada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
        });

        // Recargar la lista desde el backend para reflejar el estado actualizado
        loadAppointments();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo cancelar la cita.',
          icon: 'error',
          confirmButtonColor: '#2563eb',
        });
      }
    });
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const search = searchTerm.toLowerCase();

    // Validamos que existan las propiedades antes de hacer toLowerCase()
    const doctorName = appointment.doctor ? appointment.doctor.toLowerCase() : '';
    const specialtyName = appointment.specialty ? appointment.specialty.toLowerCase() : '';
    const reasonText = appointment.reason ? appointment.reason.toLowerCase() : '';

    const matchesSearch =
      doctorName.includes(search) ||
      specialtyName.includes(search) ||
      reasonText.includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="my-appointments-page">
      <section className="my-appointments-container">
        <button
          type="button"
          className="back-appointments-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="my-appointments-header">
          <div>
            <h1>Mis citas</h1>
            <p>Gestiona tus citas médicas</p>
          </div>

          <Link
            to="/paciente/reservar-cita"
            className="new-appointment-button"
          >
            Nueva cita
          </Link>
        </div>

        <div className="appointments-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por médico o especialidad..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button
              type="button"
              className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendiente
            </button>
            <button
              type="button"
              className={`tab-btn ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmada
            </button>
            <button
              type="button"
              className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completada
            </button>
            <button
              type="button"
              className={`tab-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelada
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando tus citas...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="appointments-list">
            {[...filteredAppointments].reverse().map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <div className="empty-appointments">
            <div className="empty-icon">📅</div>
            <h3>No hay citas</h3>
            <p>No se encontraron citas con los filtros aplicados.</p>
            <Link to="/paciente/reservar-cita" className="btn-empty-book">
              + Reservar cita
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}