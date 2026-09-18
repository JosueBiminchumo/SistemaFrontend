import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al obtener los usuarios';
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al crear el usuario';
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al actualizar el usuario';
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al eliminar el usuario';
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get('/medicos');
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al obtener los médicos';
  }
};

export const getPatients = async () => {
  try {
    const response = await api.get('/pacientes');
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al obtener los pacientes';
  }
};