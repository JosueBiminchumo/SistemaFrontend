import api from './api';

export const listSpecialties = async () => {
  const { data } = await api.get('/specialties');
  return data;
};

export const createSpecialty = async (specialty) => {
  const { data } = await api.post('/specialties', specialty);
  return data;
};

export const updateSpecialty = async (id, specialty) => {
  const { data } = await api.put(`/specialties/${id}`, specialty);
  return data;
};

export const deactivateSpecialty = async (id) => {
  await api.delete(`/specialties/${id}`);
};
