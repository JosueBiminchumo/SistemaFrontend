import api from './api';

export const listDoctors = async (params = {}) => {
  const { data } = await api.get('/doctors', { params });
  return data;
};

export const getDoctor = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return data;
};

export const getDoctorSchedule = async (id, date) => {
  const { data } = await api.get(`/doctors/${id}/schedule`, { params: { date } });
  return data;
};

export const replaceMySchedule = async (schedule) => {
  await api.put('/doctors/me/schedule', schedule);
};
