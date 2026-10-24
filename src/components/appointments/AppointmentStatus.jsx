export default function AppointmentStatus({ status }) {
  const statusConfig = {
    confirmed: {
      label: 'Confirmada',
      className: 'status-confirmed',
    },
    pending: {
      label: 'Pendiente',
      className: 'status-pending',
    },
    cancelled: {
      label: 'Cancelada',
      className: 'status-cancelled',
    },
    completed: {
      label: 'Atendida',
      className: 'status-completed',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`appointment-status ${currentStatus.className}`}>
      {currentStatus.label}
    </span>
  );
}