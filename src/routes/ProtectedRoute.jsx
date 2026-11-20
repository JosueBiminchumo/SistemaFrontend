import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../services/authService';

function normalizeRole(role) {
  return typeof role === 'string' ? role.trim().toUpperCase() : '';
}

/**
 * Antes CUALQUIERA podía escribir /admin/dashboard o /medico/dashboard
 * en la URL sin haber iniciado sesión, porque App.jsx montaba esas rutas
 * sin ninguna verificación. Este componente cierra ese hueco.
 *
 * allowedRoles es opcional: si se omite, solo exige estar autenticado.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
    const userRole = normalizeRole(getUserRole());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
