import api from './api';

export const getDashboardStatistics = async (from, to) => {
  const { data } = await api.get('/statistics/dashboard', { params: { from, to } });
  return data;
};

export const getAppointmentSeries = async (groupBy, from, to) => {
  const { data } = await api.get('/statistics/appointments', {
    params: { groupBy, from, to },
  });
  return data;
};
