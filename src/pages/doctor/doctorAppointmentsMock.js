// Mock temporal — reemplazar cuando exista el servicio real de citas
export const appointmentStatuses = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

export const doctorAppointments = [
  { id: 1, patientName: 'María López', date: '2026-09-07', time: '09:00', reason: 'Control general', status: 'CONFIRMADA' },
  { id: 2, patientName: 'Carlos Ruiz', date: '2026-09-07', time: '10:30', reason: 'Dolor de espalda', status: 'PENDIENTE' },
  { id: 3, patientName: 'Ana Torres', date: '2026-09-07', time: '12:00', reason: 'Seguimiento', status: 'CONFIRMADA' },
  { id: 4, patientName: 'Jorge Salas', date: '2026-09-08', time: '08:30', reason: 'Primera consulta', status: 'PENDIENTE' },
  { id: 5, patientName: 'Lucía Vera', date: '2026-09-09', time: '11:00', reason: 'Control', status: 'CONFIRMADA' },
  { id: 6, patientName: 'Pedro Gómez', date: '2026-09-05', time: '15:00', reason: 'Revisión post-operatoria', status: 'COMPLETADA' },
  { id: 7, patientName: 'Sofía Ramos', date: '2026-09-04', time: '09:30', reason: 'Consulta general', status: 'CANCELADA' },
];