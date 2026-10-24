import api from './api';

// ---------- Mappers ----------
const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=150`;

// API -> forma que ya usan DoctorCard / DoctorDetailPage / filtros
export function toDoctorView(d) {
  return {
    id: d.id,
    name: d.fullName,
    firstName: d.firstName,
    lastName: d.lastName,
    specialtyId: d.specialtyId,
    specialty: d.specialtyName,        // la UI espera el nombre como texto
    licenseNumber: d.licenseNumber,
    biography: d.biography ?? '',
    availability: d.active,            // "Disponible" = médico activo
    active: d.active,
    image: avatar(d.fullName),
    experience: null,                  // la API no tiene experiencia ni rating:
    rating: null,                      // la UI debe ocultarlos si son null
    schedule: [],                      // se llena con getDoctorSlots()
  };
}

const hhmm = (dateTime) => dateTime.slice(11, 16); // "2026-11-03T09:30:00" -> "09:30"

export function toSlotView(s) {
  return {
    startAt: s.startAt,
    endAt: s.endAt,
    date: s.startAt.slice(0, 10),
    time: hhmm(s.startAt),
    endTime: hhmm(s.endAt),
    available: s.available,
  };
}

// ---------- Catálogo ----------
export async function getDoctors({ specialtyId, search, includeInactive } = {}) {
  const params = {};
  if (specialtyId) params.specialtyId = specialtyId;
  if (search?.trim()) params.q = search.trim();
  if (includeInactive) params.includeInactive = true; // solo ADMIN
  const { data } = await api.get('/doctors', { params });
  return data.map(toDoctorView);
}

export async function getDoctorById(id) {
  const { data } = await api.get(`/doctors/${id}`);
  return toDoctorView(data);
}

// Franjas de un día. date = 'YYYY-MM-DD'. Devuelve todas con `available` true/false.
export async function getDoctorSlots(doctorId, date) {
  const { data } = await api.get(`/doctors/${doctorId}/schedule`, { params: { date } });
  return data.slots.map(toSlotView);
}

// ---------- Agenda semanal (DOCTOR dueño o ADMIN) ----------
const DAY_ES = {
  MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles', THURSDAY: 'Jueves',
  FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo',
};
const DAY_API = Object.fromEntries(Object.entries(DAY_ES).map(([api, es]) => [es, api]));

export function toRuleView(r) {
  return {
    id: r.id,
    day: DAY_ES[r.dayOfWeek],          // misma forma que doctorStorage: { day, startTime, endTime }
    startTime: r.startTime.slice(0, 5),
    endTime: r.endTime.slice(0, 5),
    slotMinutes: r.slotMinutes,
    active: r.active,
  };
}

export async function getScheduleRules(doctorId) {
  const { data } = await api.get(`/doctors/${doctorId}/schedule/rules`);
  return data.map(toRuleView);
}

// Reemplaza TODA la agenda semanal. rules = [{ day:'Lunes', startTime:'09:00', endTime:'13:00', slotMinutes? }]
export async function saveScheduleRules(doctorId, rules, defaultSlotMinutes = 30) {
  const payload = {
    rules: rules.map((r) => ({
      dayOfWeek: DAY_API[r.day],
      startTime: r.startTime,
      endTime: r.endTime,
      slotMinutes: r.slotMinutes ?? defaultSlotMinutes,
      active: r.active ?? true,
    })),
  };
  const { data } = await api.put(`/doctors/${doctorId}/schedule/rules`, payload);
  return data.map(toRuleView);
}

// ---------- Perfil del médico autenticado ----------
export async function getMyDoctorProfile() {
  const { data } = await api.get('/doctors/me');
  return toDoctorView(data);
}

export async function updateMyDoctorBiography(biography) {
  const { data } = await api.put('/doctors/me', { biography });
  return toDoctorView(data);
}