const STORAGE_KEYS = {
  SCHEDULE: 'mediturno_doctor_schedule',
  APPOINTMENTS: 'mediturno_doctor_appointments',
  PROFILE: 'mediturno_doctor_profile',
};

export const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const appointmentStatuses = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// Datos iniciales — solo se usan la PRIMERA vez que no hay nada en localStorage
const seedSchedule = [
  { id: 1, day: 'Lunes', startTime: '09:00', endTime: '13:00' },
  { id: 2, day: 'Lunes', startTime: '15:00', endTime: '18:00' },
  { id: 3, day: 'Miércoles', startTime: '09:00', endTime: '12:00' },
  { id: 4, day: 'Viernes', startTime: '10:00', endTime: '14:00' },
];

const seedAppointments = [
  { id: 1, patientName: 'María López', date: todayISO(0), time: '09:00', reason: 'Control general', status: 'CONFIRMADA' },
  { id: 2, patientName: 'Carlos Ruiz', date: todayISO(0), time: '10:30', reason: 'Dolor de espalda', status: 'PENDIENTE' },
  { id: 3, patientName: 'Ana Torres', date: todayISO(0), time: '12:00', reason: 'Seguimiento', status: 'CONFIRMADA' },
  { id: 4, patientName: 'Jorge Salas', date: todayISO(1), time: '08:30', reason: 'Primera consulta', status: 'PENDIENTE' },
  { id: 5, patientName: 'Lucía Vera', date: todayISO(2), time: '11:00', reason: 'Control', status: 'CONFIRMADA' },
  { id: 6, patientName: 'Pedro Gómez', date: todayISO(-2), time: '15:00', reason: 'Revisión post-operatoria', status: 'COMPLETADA' },
  { id: 7, patientName: 'Sofía Ramos', date: todayISO(-3), time: '09:30', reason: 'Consulta general', status: 'CANCELADA' },
];

const seedProfile = {
  name: 'Dr. Juan Pérez',
  specialty: 'Medicina General',
  email: 'juan.perez@mediturno.com',
  phone: '999-888-777',
  bio: 'Médico general con 8 años de experiencia en atención primaria.',
};

function readFromStorage(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch (error) {
    console.error(`Error leyendo "${key}" de localStorage:`, error);
    return seed;
  }
}

function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error guardando "${key}" en localStorage:`, error);
  }
}

export const getSchedule = () => readFromStorage(STORAGE_KEYS.SCHEDULE, seedSchedule);
export const saveSchedule = (slots) => writeToStorage(STORAGE_KEYS.SCHEDULE, slots);

export const getAppointments = () => readFromStorage(STORAGE_KEYS.APPOINTMENTS, seedAppointments);
export const saveAppointments = (appointments) => writeToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

export const getProfile = () => readFromStorage(STORAGE_KEYS.PROFILE, seedProfile);
export const saveProfile = (profile) => writeToStorage(STORAGE_KEYS.PROFILE, profile);