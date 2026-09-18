import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientHistoryPage.css';

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

function getStatusLabel(status) {
  if (status === 'completed' || status === 'atendida') {
    return 'Completada';
  }

  return 'Cancelada';
}

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const appointments = getAppointments();

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'completed' ||
      appointment.status === 'atendida' ||
      appointment.status === 'cancelled'
  );

  const filteredAppointments = historyAppointments.filter((appointment) => {
    const search = searchTerm.toLowerCase();

    return (
      appointment.doctor?.toLowerCase().includes(search) ||
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

        {filteredAppointments.length > 0 ? (
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
                  const isCompleted =
                    appointment.status === 'completed' ||
                    appointment.status === 'atendida';

                  return (
                    <tr key={appointment.id}>
                      <td className="history-doctor">
                        {appointment.doctor}
                      </td>

                      <td>{appointment.specialty}</td>

                      <td>{appointment.date}</td>

                      <td>{appointment.time}</td>

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
        ) : (
          <div className="history-empty">
            <div className="history-empty-icon">📋</div>

            <h3>No hay registros en el historial</h3>

            <p>
              No se encontraron citas completadas o canceladas.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}