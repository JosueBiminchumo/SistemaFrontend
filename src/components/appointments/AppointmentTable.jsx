import { CircleX, Eye } from 'lucide-react';

const statusInformation = {
  PENDIENTE: {
    label: 'Pendiente',
    className: 'appointment-status appointment-status--pending',
  },
  CONFIRMADA: {
    label: 'Confirmada',
    className: 'appointment-status appointment-status--confirmed',
  },
  COMPLETADA: {
    label: 'Completada',
    className: 'appointment-status appointment-status--completed',
  },
  CANCELADA: {
    label: 'Cancelada',
    className: 'appointment-status appointment-status--cancelled',
  },
};

export default function AppointmentTable({
  appointments,
  onView,
  onCancel,
}) {
  if (appointments.length === 0) {
    return (
      <div className="appointments-empty">
        No se encontraron citas con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="appointments-table-wrapper">
      <table className="management-appointments-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Especialidad</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => {
            const status =
              statusInformation[appointment.status] ??
              statusInformation.PENDIENTE;

            const canCancel =
              appointment.status === 'PENDIENTE' ||
              appointment.status === 'CONFIRMADA';

            return (
              <tr key={appointment.id}>
                <td className="appointment-patient">
                  {appointment.patient}
                </td>

                <td>{appointment.doctor}</td>
                <td>{appointment.specialty}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>

                <td>
                  <span className={status.className}>
                    <span className="appointment-status__dot" />
                    {status.label}
                  </span>
                </td>

                <td>
                  <div className="appointment-actions">
                    <button
                      type="button"
                      className="appointment-action appointment-action--view"
                      onClick={() => onView(appointment)}
                      aria-label={`Ver cita de ${appointment.patient}`}
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>

                    {canCancel && (
                      <button
                        type="button"
                        className="appointment-action appointment-action--cancel"
                        onClick={() => onCancel(appointment)}
                        aria-label={`Cancelar cita de ${appointment.patient}`}
                        title="Cancelar cita"
                      >
                        <CircleX size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}