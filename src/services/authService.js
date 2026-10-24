import api from './api';

const roleDetails = {
  PATIENT: { role: 'paciente', dashboardPath: '/paciente/inicio' },
  DOCTOR: { role: 'medico', dashboardPath: '/medico/dashboard' },
  ADMIN: { role: 'admin', dashboardPath: '/admin/dashboard' },
};

function saveSession(authResponse) {
  if (!authResponse?.accessToken || !authResponse?.user) {
    throw new Error('El backend devolvió una respuesta de sesión incompleta.');
  }

  const role = roleDetails[authResponse.user.role] || roleDetails.PATIENT;
  const user = {
    ...authResponse.user,
    name: `${authResponse.user.firstName} ${authResponse.user.lastName}`.trim(),
    role: role.role,
    backendRole: authResponse.user.role,
    dashboardPath: role.dashboardPath,
  };

  localStorage.setItem('token', authResponse.accessToken);
  localStorage.setItem('mediturn_user', JSON.stringify(user));

  return { ...authResponse, user };
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const login = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return saveSession(data);
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión', { cause: error });
  }
};

export const register = async (userData) => {
  try {
    const { data } = await api.post('/auth/register', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      documentNumber: userData.documentNumber,
      birthDate: userData.birthDate,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
    });
    return saveSession(data);
  } catch (error) {
    throw new Error(error.message || 'Error al registrar usuario', { cause: error });
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('mediturn_user');
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload?.exp) return true; 

  return payload.exp * 1000 > Date.now();
};
export const getUserRole = () => {
  const storedUser = localStorage.getItem('mediturn_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser).backendRole || null;
    } catch {
      return null;
    }
  }

  const token = getToken();
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.role || payload?.rol || payload?.authorities?.[0] || null;
};

export const roleToHomeRoute = (role) => {
  switch (role) {
    case 'MEDICO':
    case 'DOCTOR':
      return '/medico/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PACIENTE':
    case 'PATIENT':
    default:
      return '/paciente/inicio';
  }
};
