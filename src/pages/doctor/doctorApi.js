import {
  getMyDoctorProfile,
  updateMyDoctorBiography,
  getScheduleRules,
  saveScheduleRules,
} from '../../services/doctorService';
import {
  getPanelAppointments,
  getPanelAppointmentById,
  changePanelStatus,
} from '../../services/appointmentService';

export const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const appointmentStatuses = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

// Fecha local en formato YYYY-MM-DD (sin pasar por UTC, para no adelantar el día en Lima).
export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ---------- Perfil ----------
export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem('mediturn_user')) || {};
  } catch {
    return {};
  }
}

let profileCache = null;

// Une el usuario de la sesión (nombre, correo) con GET /doctors/me (id, especialidad, biografía).
export async function getProfile(force = false) {
  if (profileCache && !force) return profileCache;
  const doctor = await getMyDoctorProfile();
  const user = getSessionUser();
  profileCache = {
    id: doctor.id,
    firstName: doctor.firstName,
    name: doctor.name,
    specialty: doctor.specialty,
    licenseNumber: doctor.licenseNumber,
    email: user.email ?? '',
    bio: doctor.biography,
  };
  return profileCache;
}

// El backend solo permite editar la biografía (PUT /doctors/me).
export async function saveBiography(bio) {
  const doctor = await updateMyDoctorBiography(bio);
  profileCache = { ...(profileCache ?? {}), bio: doctor.biography };
  return profileCache;
}

export const clearProfileCache = () => {
  profileCache = null;
};

// ---------- Agenda ----------
export async function getSchedule() {
  const profile = await getProfile();
  return getScheduleRules(profile.id);
}

// Reemplaza toda la agenda semanal (PUT /doctors/{id}/schedule/rules).
export async function saveSchedule(slots) {
  const profile = await getProfile();
  return saveScheduleRules(profile.id, slots);
}

// ---------- Citas (el backend ya filtra por el médico del JWT) ----------
export const getAppointments = () => getPanelAppointments();
export const getAppointment = (id) => getPanelAppointmentById(id);
export const updateStatus = (id, status) => changePanelStatus(id, status);

// Pacientes atendidos, derivados de las citas.
export function summarizePatients(appointments) {
  const map = new Map();
  appointments.forEach((appt) => {
    const key = appt.patientId ?? appt.patientName;
    if (!map.has(key)) {
      map.set(key, { id: key, name: appt.patientName, total: 0, lastDate: appt.date });
    }
    const entry = map.get(key);
    entry.total += 1;
    if (appt.date > entry.lastDate) entry.lastDate = appt.date;
  });
  return Array.from(map.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}
