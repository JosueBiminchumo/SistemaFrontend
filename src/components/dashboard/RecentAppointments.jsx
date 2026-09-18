const statusInformation = {
  PENDIENTE: {
    label: 'Pendiente',
    className: 'status status--pending',
  },
  CONFIRMADA: {
    label: 'Confirmada',
    className: 'status status--confirmed',
  },
  COMPLETADA: {
    label: 'Completada',
    className: 'status status--completed',
  },
  CANCELADA: {
    label: 'Cancelada',
    className: 'status status--cancelled',
  },
};

export default function RecentAppointments({ appointments }) {
  return (
    <section className="recent-appointments">
      <div className="section-heading section-heading--row">
        <h2>Próximas citas</h2>

        <button type="button" className="text-button">
          Ver todas <span aria-hidden="true">›</span>
        </button>
      </div>

      {appointments.length === 0 ? (
        <p className="empty-message">No existen citas registradas.</p>
      ) : (
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => {
                const status =
                  statusInformation[appointment.status] ??
                  statusInformation.PENDIENTE;

                return (
                  <tr key={appointment.id}>
                    <td>{appointment.patient}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.specialty}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={status.className}>
                        <span className="status__dot" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}