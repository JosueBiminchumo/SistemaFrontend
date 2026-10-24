import api from './api';

// ---------- Mapper: API -> forma que usa la UI ----------
const ICON_BY_KEYWORD = [
  [/cardio/i, 'heart'],
  [/derma/i, 'sparkles'],
  [/neuro/i, 'brain'],
  [/pediat/i, 'baby'],
  [/trauma/i, 'bone'],
  [/oftalm/i, 'eye'],
  [/gineco/i, 'shield'],
  [/general/i, 'stethoscope'],
];

export function getSpecialtyIcon(name = '') {
  const match = ICON_BY_KEYWORD.find(([regex]) => regex.test(name));
  return match ? match[1] : 'stethoscope';
}

export function toSpecialtyView(s) {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    active: s.active,
    icon: getSpecialtyIcon(s.name), // la API no guarda icono
    doctors: 0,                     // la API no devuelve el conteo (ver getSpecialtiesWithDoctorCount)
  };
}

// ---------- Lectura ----------
export async function getSpecialties() {
  const { data } = await api.get('/specialties');
  return data.map(toSpecialtyView);
}

// Solo funciona con token ADMIN; para otros roles la API ignora includeInactive.
export async function getAllSpecialties() {
  const { data } = await api.get('/specialties', { params: { includeInactive: true } });
  return data.map(toSpecialtyView);
}

// Para la pantalla de administración: añade el conteo de médicos por especialidad.
export async function getSpecialtiesWithDoctorCount() {
  const [{ data: specialties }, { data: doctors }] = await Promise.all([
    api.get('/specialties', { params: { includeInactive: true } }),
    api.get('/doctors', { params: { includeInactive: true } }),
  ]);
  return specialties.map((s) => ({
    ...toSpecialtyView(s),
    doctors: doctors.filter((d) => d.specialtyId === s.id && d.active).length,
  }));
}

// ---------- Escritura (ADMIN) ----------
function toPayload({ name, description, active }) {
  return {
    name: name.trim(),
    description: description?.trim() || null,
    active: active ?? true,
  };
}

export async function createSpecialty(form) {
  const { data } = await api.post('/specialties', toPayload(form));
  return toSpecialtyView(data);
}

export async function updateSpecialty(id, form) {
  const { data } = await api.put(`/specialties/${id}`, toPayload(form));
  return toSpecialtyView(data);
}

// Baja lógica (active=false). El backend nunca borra físicamente.
export async function deactivateSpecialty(id) {
  await api.delete(`/specialties/${id}`);
}