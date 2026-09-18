import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Search,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

import AppointmentTable from '../../components/appointments/AppointmentTable';
import './AppointmentsManagementPage.css';

const initialAppointments = [
  {
    id: 1,
    patient: 'María García',
    doctor: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    date: '2026-09-18',
    time: '09:00',
    status: 'CONFIRMADA',
    reason: 'Control cardiológico',
  },
  {
    id: 2,
    patient: 'María García',
    doctor: 'Dra. Ana Torres',
    specialty: 'Dermatología',
    date: '2026-09-16',
    time: '10:30',
    status: 'COMPLETADA',
    reason: 'Evaluación dermatológica',
  },
  {
    id: 3,
    patient: 'Juan Carlos',
    doctor: 'Dr. Roberto Silva',
    specialty: 'Medicina General',
    date: '2026-09-19',
    time: '14:00',
    status: 'PENDIENTE',
    reason: 'Dolor de cabeza recurrente',
  },
  {
    id: 4,
    patient: 'Ana Sofía',
    doctor: 'Dra. Patricia Flores',
    specialty: 'Ginecología',
    date: '2026-09-20',
    time: '11:00',
    status: 'CONFIRMADA',
    reason: 'Consulta preventiva',
  },
  {
    id: 5,
    patient: 'Pedro Arturo',
    doctor: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    date: '2026-09-15',
    time: '08:30',
    status: 'COMPLETADA',
    reason: 'Revisión de resultados',
  },
  {
    id: 6,
    patient: 'Juan Carlos',
    doctor: 'Dr. Miguel Ángel',
    specialty: 'Neurología',
    date: '2026-09-14',
    time: '16:00',
    status: 'CANCELADA',
    reason: 'Evaluación neurológica',
  },
  {
    id: 7,
    patient: 'María García',
    doctor: 'Dr. Roberto Silva',
    specialty: 'Medicina General',
    date: '2026-09-22',
    time: '15:30',
    status: 'PENDIENTE',
    reason: 'Consulta general',
  },
  {
    id: 8,
    patient: 'Ana Sofía',
    doctor: 'Dra. Lucía Ramírez',
    specialty: 'Pediatría',
    date: '2026-09-17',
    time: '09:30',
    status: 'COMPLETADA',
    reason: 'Control pediátrico',
  },
];

const statusLabels = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const filteredAppointments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !searchValue ||
        appointment.patient.toLowerCase().includes(searchValue) ||
        appointment.doctor.toLowerCase().includes(searchValue) ||
        appointment.specialty.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'TODOS' ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const confirmCancellation = () => {
    if (!appointmentToCancel) {
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentToCancel.id
          ? {
              ...appointment,
              status: 'CANCELADA',
            }
          : appointment,
      ),
    );

    setAppointmentToCancel(null);
  };

  return (
    <main className="appointments-page">
      <header className="appointments-page__header">
        <h1>Gestión de citas</h1>
        <p>Todas las citas del sistema</p>
      </header>

      <section className="appointments-filters">
        <label className="appointments-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Paciente, médico o especialidad..."
          />
        </label>

        <select
          className="appointments-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="CONFIRMADA">Confirmadas</option>
          <option value="COMPLETADA">Completadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </section>

      <section className="appointments-management-card">
        <AppointmentTable
          appointments={filteredAppointments}
          onView={setSelectedAppointment}
          onCancel={setAppointmentToCancel}
        />

        <footer className="appointments-management-footer">
          Mostrando {filteredAppointments.length} de {appointments.length}{' '}
          citas
        </footer>
      </section>

      {selectedAppointment && (
        <div
          className="appointment-modal"
          role="presentation"
          onMouseDown={() => setSelectedAppointment(null)}
        >
          <section
            className="appointment-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="appointment-modal__header">
              <div>
                <h2 id="appointment-detail-title">
                  Detalle de la cita
                </h2>
                <p>Cita N.º {selectedAppointment.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                aria-label="Cerrar detalle"
              >
                <X size={19} />
              </button>
            </header>

            <div className="appointment-detail">
              <div className="appointment-detail__item">
                <UserRound size={19} />

                <div>
                  <span>Paciente</span>
                  <strong>{selectedAppointment.patient}</strong>
                </div>
              </div>

              <div className="appointment-detail__item">
                <Stethoscope size={19} />

                <div>
                  <span>Médico</span>
                  <strong>{selectedAppointment.doctor}</strong>
                </div>
              </div>

              <div className="appointment-detail__item">
                <Stethoscope size={19} />

                <div>
                  <span>Especialidad</span>
                  <strong>{selectedAppointment.specialty}</strong>
                </div>
              </div>

              <div className="appointment-detail__item">
                <CalendarDays size={19} />

                <div>
                  <span>Fecha</span>
                  <strong>{selectedAppointment.date}</strong>
                </div>
              </div>

              <div className="appointment-detail__item">
                <Clock3 size={19} />

                <div>
                  <span>Hora</span>
                  <strong>{selectedAppointment.time}</strong>
                </div>
              </div>

              <div className="appointment-detail__item">
                <Clock3 size={19} />

                <div>
                  <span>Estado</span>
                  <strong>
                    {statusLabels[selectedAppointment.status]}
                  </strong>
                </div>
              </div>

              <div className="appointment-detail__reason">
                <span>Motivo de consulta</span>
                <p>{selectedAppointment.reason}</p>
              </div>
            </div>

            <footer className="appointment-modal__footer">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
              >
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}

      {appointmentToCancel && (
        <div
          className="appointment-modal"
          role="presentation"
          onMouseDown={() => setAppointmentToCancel(null)}
        >
          <section
            className="appointment-confirmation"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-appointment-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="cancel-appointment-title">Cancelar cita</h2>

            <p>
              ¿Deseas cancelar la cita de{' '}
              <strong>{appointmentToCancel.patient}</strong> con{' '}
              <strong>{appointmentToCancel.doctor}</strong>?
            </p>

            <div className="appointment-confirmation__actions">
              <button
                type="button"
                className="appointment-confirmation__back"
                onClick={() => setAppointmentToCancel(null)}
              >
                Volver
              </button>

              <button
                type="button"
                className="appointment-confirmation__confirm"
                onClick={confirmCancellation}
              >
                Cancelar cita
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}