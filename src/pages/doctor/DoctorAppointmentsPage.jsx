import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentStatuses, getAppointments } from './doctorStorage';
import './DoctorAppointmentsPage.css';

export default function DoctorAppointmentsPage() {
  const [appointments] = useState(() => getAppointments());
  const [statusFilter, setStatusFilter] = useState('TODAS');
  const [dateFilter, setDateFilter] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus = statusFilter === 'TODAS' || appt.status === statusFilter;
      const matchesDate = !dateFilter || appt.date === dateFilter;
      return matchesStatus && matchesDate;
    });
  }, [appointments, statusFilter, dateFilter]);

  return (
    <div className="doctor-appointments">
      <header className="doctor-appointments__header">
        <div>
          <h1>Mis citas</h1>
          <p className="doctor-appointments__subtitle">Consulta y filtra tus citas asignadas</p>
        </div>
      </header>

      <div className="doctor-appointments__filters">
        <div className="filter-field">
          <label htmlFor="statusFilter">Estado</label>
          <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="TODAS">Todas</option>
            {appointmentStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="dateFilter">Fecha</label>
          <input id="dateFilter" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>

        {(statusFilter !== 'TODAS' || dateFilter) && (
          <button type="button" className="filter-clear" onClick={() => { setStatusFilter('TODAS'); setDateFilter(''); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="doctor-appointments__empty">No hay citas que coincidan con los filtros.</p>
      ) : (
        <ul className="appointment-cards">
          {filteredAppointments.map((appt) => (
            <li key={appt.id} className="appointment-card">
              <div className="appointment-card__main">
                <span className="appointment-card__date">{appt.date} · {appt.time}</span>
                <span className="appointment-card__patient">{appt.patientName}</span>
                <span className="appointment-card__reason">{appt.reason}</span>
              </div>

              <div className="appointment-card__side">
                <span className={`appointment-status appointment-status--${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
                <Link to={`/medico/citas/${appt.id}`} className="appointment-card__link">
                  Ver detalle →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}