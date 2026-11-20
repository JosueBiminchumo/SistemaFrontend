import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import './MyAppointmentsPage.css';
import { cancelAppointment, listAppointments } from '../../services/appointmentService';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listAppointments()
      .then((items) => setAppointments(items.map((appointment) => ({
        ...appointment,
        doctor: appointment.doctorName,
        date: appointment.startAt.slice(0, 10),
        time: appointment.startAt.slice(11, 16),
        status: appointment.status.toLowerCase(),
      }))))
      .catch((requestError) => setError(requestError.message));
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
        await cancelAppointment(id);
        setAppointments((currentAppointments) => currentAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment));
        Swal.fire({
          title: 'Cita cancelada',
          text: 'Tu cita ha sido cancelada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
        });
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter =
      filter === 'all' || appointment.status === filter;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      appointment.doctor?.toLowerCase().includes(search) ||
      appointment.specialty?.toLowerCase().includes(search) ||
      appointment.reason?.toLowerCase().includes(search);

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

          {error && <p role="alert">{error}</p>}

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
              className={`tab-btn ${
                filter === 'all' ? 'active' : ''
              }`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>

            <button
              type="button"
              className={`tab-btn ${
                filter === 'pending' ? 'active' : ''
              }`}
              onClick={() => setFilter('pending')}
            >
              Pendiente
            </button>

            <button
              type="button"
              className={`tab-btn ${
                filter === 'confirmed' ? 'active' : ''
              }`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmada
            </button>

            <button
              type="button"
              className={`tab-btn ${
                filter === 'completed' ? 'active' : ''
              }`}
              onClick={() => setFilter('completed')}
            >
              Completada
            </button>

            <button
              type="button"
              className={`tab-btn ${
                filter === 'cancelled' ? 'active' : ''
              }`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelada
            </button>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
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

            <p>
              No se encontraron citas con los filtros aplicados.
            </p>

            <Link
              to="/paciente/reservar-cita"
              className="btn-empty-book"
            >
              + Reservar cita
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}