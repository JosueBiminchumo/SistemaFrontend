import api from './api';

export const listAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

export const getAppointment = async (id) => {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await api.post('/appointments', appointment);
  return data;
};

export const rescheduleAppointment = async (id, appointment) => {
  const { data } = await api.put(`/appointments/${id}`, appointment);
  return data;
};

export const cancelAppointment = async (id) => {
  const { data } = await api.patch(`/appointments/${id}/cancel`);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await api.patch(`/appointments/${id}/status`, { status });
  return data;
};
