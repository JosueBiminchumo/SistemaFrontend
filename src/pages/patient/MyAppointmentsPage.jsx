import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import './MyAppointmentsPage.css';

function getAppointments() {
  const storedUser = localStorage.getItem('mediturn_user');
  const storedAppointments = localStorage.getItem('appointments');

  if (!storedUser || !storedAppointments) {
    return [];
  }

  const currentUser = JSON.parse(storedUser);
  const appointments = JSON.parse(storedAppointments);

  return appointments.filter(
    (appointment) => appointment.patientId === currentUser.id
  );
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState(getAppointments);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const storedAppointments = localStorage.getItem('appointments');
      const allAppointments = JSON.parse(storedAppointments || '[]');

      const updatedAppointments = allAppointments.map(
        (appointment) =>
          appointment.id === id
            ? { ...appointment, status: 'cancelled' }
            : appointment
      );

      const currentUser = JSON.parse(
        localStorage.getItem('mediturn_user')
      );

      const currentUserAppointments = updatedAppointments.filter(
        (appointment) => appointment.patientId === currentUser.id
      );

      setAppointments(currentUserAppointments);

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
      });
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

          <Link
            to="/paciente/reservar-cita"
            className="new-appointment-button"
          >
            + Nueva cita
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