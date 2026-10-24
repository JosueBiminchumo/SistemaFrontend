import api from './api';

export async function getMyPatientProfile() {
  const { data } = await api.get('/patients/me');
  return data;
}

export async function updateMyPatientProfile(profile) {
  const { data } = await api.put('/patients/me', {
    documentNumber: profile.documentNumber,
    birthDate: profile.birthDate,
    phone: profile.phone,
  });
  return data;
}
