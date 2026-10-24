import api from './api';

// ---------- Mappers de estado ----------
// API (MAYÚSCULAS) <-> UI actual (minúsculas: pending, confirmed, cancelled, completed)
const STATUS_FROM_API = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const toUiStatus = (status) => STATUS_FROM_API[status] ?? 'pending';
export const toApiStatus = (status) => String(status).toUpperCase(); // 'confirmed' -> 'CONFIRMED'

// ---------- Mappers de fecha/hora ----------
// date 'YYYY-MM-DD' + time 'HH:mm' -> '2026-11-03T09:30:00' (hora local de Lima, sin offset)
export function toStartAt(date, time) {
  const t = time.length === 5 ? `${time}:00` : time;
  return `${date}T${t}`;
}

// '2026-11-03T09:30:00' -> { date: '2026-11-03', time: '09:30' }
export function splitStartAt(startAt) {
  return { date: startAt.slice(0, 10), time: startAt.slice(11, 16) };
}

// API -> forma que ya consumen AppointmentCard, AppointmentStatus y las páginas
export function toAppointmentView(a) {
  const { date, time } = splitStartAt(a.startAt);
  return {
    id: a.id,
    patientId: a.patientId,
    patientName: a.patientName,
    doctorId: a.doctorId,
    doctor: a.doctorName,        // la UI usa `doctor` como texto
    specialtyId: a.specialtyId,
    specialty: a.specialtyName,
    date,
    time,
    endTime: a.endAt.slice(11, 16),
    startAt: a.startAt,
    reason: a.reason,
    status: toUiStatus(a.status),   // 'pending' | 'confirmed' | 'cancelled' | 'completed'
    apiStatus: a.status,            // original en MAYÚSCULAS por si se necesita
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

// ---------- Consultas ----------
// La API ya filtra por rol: PATIENT ve las suyas, DOCTOR las suyas, ADMIN todas.
// filters: { status?: 'pending'|'PENDING'..., from?: 'YYYY-MM-DD', to?: 'YYYY-MM-DD', doctorId? }
export async function getMyAppointments({ status, from, to, doctorId } = {}) {
  const params = {};
  if (status && status !== 'all') params.status = toApiStatus(status);
  if (from) params.from = from;
  if (to) params.to = to;
  if (doctorId) params.doctorId = doctorId;
  const { data } = await api.get('/appointments', { params });
  return data.map(toAppointmentView);
}

export async function getAppointmentById(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return toAppointmentView(data);
}

// ---------- Acciones ----------
// El paciente NO se envía: sale del JWT.
export async function createAppointment({ doctorId, date, time, reason }) {
  const { data } = await api.post('/appointments', {
    doctorId,
    startAt: toStartAt(date, time),
    reason: reason.trim(),
  });
  return toAppointmentView(data);
}

// Reprogramar: la API exige doctorId y reason siempre (reenvía los actuales si no cambian).
// Deja la cita en PENDING.
export async function rescheduleAppointment(id, { doctorId, date, time, reason }) {
  const { data } = await api.put(`/appointments/${id}`, {
    doctorId,
    startAt: toStartAt(date, time),
    reason: reason.trim(),
  });
  return toAppointmentView(data);
}

export async function cancelAppointment(id) {
  const { data } = await api.patch(`/appointments/${id}/cancel`);
  return toAppointmentView(data);
}

// Solo DOCTOR asignado o ADMIN. status: 'confirmed' | 'completed' | 'cancelled' (o en mayúsculas)
export async function updateAppointmentStatus(id, status) {
  const { data } = await api.patch(`/appointments/${id}/status`, { status: toApiStatus(status) });
  return toAppointmentView(data);
}

// ---------- Vista para los paneles de MÉDICO y ADMIN ----------
// Esos paneles muestran los estados en español y en mayúsculas (PENDIENTE, CONFIRMADA...).
const STATUS_ES = {
  PENDING: 'PENDIENTE',
  CONFIRMED: 'CONFIRMADA',
  COMPLETED: 'COMPLETADA',
  CANCELLED: 'CANCELADA',
};
const STATUS_API = Object.fromEntries(Object.entries(STATUS_ES).map(([api, es]) => [es, api]));

export const toEsStatus = (status) => STATUS_ES[status] ?? 'PENDIENTE';
export const fromEsStatus = (status) => STATUS_API[status] ?? String(status).toUpperCase();

export function toPanelView(a) {
  return {
    ...toAppointmentView(a),
    patient: a.patientName,     // admin
    doctor: a.doctorName,       // admin
    specialty: a.specialtyName, // admin
    status: toEsStatus(a.status),
  };
}

// DOCTOR ve solo las suyas; ADMIN ve todas (lo decide el backend por el JWT).
export async function getPanelAppointments({ status, from, to, doctorId } = {}) {
  const params = {};
  if (status && status !== 'all') params.status = fromEsStatus(status);
  if (from) params.from = from;
  if (to) params.to = to;
  if (doctorId) params.doctorId = doctorId;
  const { data } = await api.get('/appointments', { params });
  return data.map(toPanelView);
}

export async function getPanelAppointmentById(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return toPanelView(data);
}

export async function changePanelStatus(id, esStatus) {
  const { data } = await api.patch(`/appointments/${id}/status`, { status: fromEsStatus(esStatus) });
  return toPanelView(data);
}

export async function cancelPanelAppointment(id) {
  const { data } = await api.patch(`/appointments/${id}/cancel`);
  return toPanelView(data);
}
