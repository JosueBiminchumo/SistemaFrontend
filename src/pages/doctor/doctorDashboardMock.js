// Mock temporal — reemplazar cuando el Integrante 8 entregue el servicio real de citas
export const todayAppointments = [
  { id: 1, patientName: 'María López', time: '09:00', reason: 'Control general', status: 'CONFIRMADA' },
  { id: 2, patientName: 'Carlos Ruiz', time: '10:30', reason: 'Dolor de espalda', status: 'PENDIENTE' },
  { id: 3, patientName: 'Ana Torres', time: '12:00', reason: 'Seguimiento', status: 'CONFIRMADA' },
];

export const upcomingAppointments = [
  { id: 4, patientName: 'Jorge Salas', date: '2026-09-08', time: '08:30', reason: 'Primera consulta' },
  { id: 5, patientName: 'Lucía Vera', date: '2026-09-09', time: '11:00', reason: 'Control' },
];

export const doctorSummary = {
  name: 'Dr. Nombre Apellido',
  specialty: 'Medicina General',
  totalToday: todayAppointments.length,
  totalPending: todayAppointments.filter((a) => a.status === 'PENDIENTE').length,
};