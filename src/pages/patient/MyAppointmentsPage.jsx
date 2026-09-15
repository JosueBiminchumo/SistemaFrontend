import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import './MyAppointmentsPage.css';

const initialAppointments = [
  {
    id: 1,
    doctor: 'Dr. Carlos Ramírez',
    specialty: 'Medicina General',
    date: '20 de septiembre de 2026',
    time: '09:00',
    status: 'confirmed',
  },
  {
    id: 2,
    doctor: 'Dra. María López',
    specialty: 'Cardiología',
    date: '25 de septiembre de 2026',
    time: '15:00',
    status: 'pending',
  },
];

function getAppointments() {
  const storedAppointments = localStorage.getItem('appointments');

  if (storedAppointments) {
    return JSON.parse(storedAppointments);
  }

  localStorage.setItem(
    'appointments',
    JSON.stringify(initialAppointments)
  );

  return initialAppointments;
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState(getAppointments);
  const navigate = useNavigate();

  const handleCancel = (id) => {
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
        (appointment) =>
          appointment.id === id
            ? { ...appointment, status: 'cancelled' }
            : appointment
      );

      setAppointments(updatedAppointments);

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
            <p>Consulta y gestiona tus citas médicas.</p>
          </div>

          <Link
            to="/paciente/reservar-cita"
            className="new-appointment-button"
          >
            Nueva cita
          </Link>
        </div>

        <div className="appointments-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </section>
    </main>
  );
}