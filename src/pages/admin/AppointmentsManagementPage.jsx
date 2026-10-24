import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Search,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

import AppointmentTable from '../../components/appointments/AppointmentTable';
import {
  cancelPanelAppointment,
  getPanelAppointments,
} from '../../services/appointmentService';
import './AppointmentsManagementPage.css';

const statusLabels = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    let alive = true;

    getPanelAppointments()
      .then((items) => {
        if (alive) {
          setAppointments(
            [...items].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
          );
        }
      })
      .catch((err) => alive && setLoadError(err.message || 'No se pudieron cargar las citas.'))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !searchValue ||
        (appointment.patient ?? '').toLowerCase().includes(searchValue) ||
        (appointment.doctor ?? '').toLowerCase().includes(searchValue) ||
        (appointment.specialty ?? '').toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'TODOS' ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const confirmCancellation = async () => {
    if (!appointmentToCancel) {
      return;
    }

    const target = appointmentToCancel;
    setActionError('');

    try {
      const updated = await cancelPanelAppointment(target.id);

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === updated.id ? updated : appointment,
        ),
      );
    } catch (err) {
      setActionError(err.message || 'No se pudo cancelar la cita.');
    } finally {
      setAppointmentToCancel(null);
    }
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

      {actionError && (
        <p className="appointments-page__error" role="alert">
          {actionError}
        </p>
      )}

      <section className="appointments-management-card">
        {loading && <div className="appointments-empty">Cargando citas...</div>}
        {!loading && loadError && <div className="appointments-empty">{loadError}</div>}
        {!loading && !loadError && <AppointmentTable
          appointments={filteredAppointments}
          onView={setSelectedAppointment}
          onCancel={setAppointmentToCancel}
        />}

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