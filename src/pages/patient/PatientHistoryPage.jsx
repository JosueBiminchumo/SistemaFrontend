import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listAppointments } from '../../services/appointmentService';
import './PatientHistoryPage.css';

function getStatusLabel(status) {
  if (status === 'COMPLETED') {
    return 'Completada';
  }

  return 'Cancelada';
}

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listAppointments()
      .then(setAppointments)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'COMPLETED' ||
      appointment.status === 'CANCELLED'
  );

  const filteredAppointments = historyAppointments.filter((appointment) => {
    const search = searchTerm.toLowerCase();

    return (
      appointment.doctorName?.toLowerCase().includes(search) ||
      appointment.specialty?.toLowerCase().includes(search) ||
      appointment.reason?.toLowerCase().includes(search)
    );
  });

  return (
    <main className="patient-history-page">
      <section className="patient-history-container">
        <button
          type="button"
          className="back-history-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="history-header">
          <div>
            <h1>Historial</h1>
            <p>Citas completadas y canceladas</p>
          </div>
        </div>

        {loading && <p role="status">Cargando historial...</p>}
        {error && <p role="alert">{error}</p>}

        <div className="history-search-box">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            placeholder="Buscar por médico o especialidad..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!loading && filteredAppointments.length > 0 ? (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Médico</th>
                  <th>Especialidad</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {[...filteredAppointments].reverse().map((appointment) => {
                  const isCompleted = appointment.status === 'COMPLETED';

                  return (
                    <tr key={appointment.id}>
                      <td className="history-doctor">
                        {appointment.doctorName}
                      </td>

                      <td>{appointment.specialty}</td>

                      <td>{appointment.startAt.slice(0, 10)}</td>

                      <td>{appointment.startAt.slice(11, 16)}</td>

                      <td>
                        <div className="history-status-cell">
                          <span
                            className={`history-badge ${
                              isCompleted
                                ? 'completada'
                                : 'cancelada'
                            }`}
                          >
                            {getStatusLabel(appointment.status)}
                          </span>

                          <button
                            type="button"
                            className="history-view-button"
                            title="Ver detalle"
                            onClick={() =>
                              navigate(
                                `/paciente/cita/${appointment.id}`
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : !loading && !error ? (
          <div className="history-empty">
            <div className="history-empty-icon">📋</div>

            <h3>
              {historyAppointments.length === 0
                ? 'Aún no tienes citas en el historial'
                : 'No hay resultados para esta búsqueda'}
            </h3>
            <p>
              {historyAppointments.length === 0
                ? 'Cuando completes o canceles una cita, aparecerá aquí.'
                : 'Prueba con otro médico, especialidad o motivo.'}
            </p>
            {historyAppointments.length === 0 ? (
              <Link to="/paciente/reservar-cita">Reservar una cita</Link>
            ) : (
              <button type="button" onClick={() => setSearchTerm('')}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}