import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUserRole, isAuthenticated, logout, roleToHomeRoute } from '../../services/authService';

/**
 * Protege rutas con la sesión del backend (JWT) y el rol (PATIENT | DOCTOR | ADMIN).
 * Uso: <Route element={<ProtectedRoute roles={['PATIENT']} />}> ...rutas... </Route>
 */
export default function ProtectedRoute({ roles }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    logout();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = getUserRole();
  if (roles?.length && !roles.includes(role)) {
    return <Navigate to={role ? roleToHomeRoute(role) : '/unauthorized'} replace />;
  }

  return <Outlet />;
}
