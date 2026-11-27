import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import {
  getCurrentUser,
  isAuthenticated,
  logout,
  roleToHomeRoute,
} from '../services/authService';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const dashboardPath = user ? roleToHomeRoute(user.role) : null;

  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser()
        .then(setUser)
        .catch((requestError) => setError(requestError.message));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setError('');
    navigate('/login');
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <nav className="navbar" aria-label="Navegación principal">
        <Link className="navbar__brand" to="/">
          <span className="navbar__mark" aria-hidden="true"><HeartPulse size={21} /></span>
          <span className="navbar__brand-copy">
            <strong>MediTurn</strong>
            <small>Salud a tu tiempo</small>
          </span>
        </Link>
        <div className="navbar__links">
          <NavLink className="navbar__link" to="/" end>
            Inicio
          </NavLink>
          <NavLink className="navbar__link" to="/medicos">
            Médicos
          </NavLink>
          <NavLink className="navbar__link" to="/especialidades">
            Especialidades
          </NavLink>
          <NavLink className="navbar__link" to="/nosotros">
            Nosotros
          </NavLink>
          {dashboardPath && (
            <NavLink className="navbar__link" to={dashboardPath}>
              Mi panel
            </NavLink>
          )}
        </div>

        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__user">{user.role}</span>
              <button className="navbar__button" onClick={handleLogout} type="button">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink className="navbar__link" to="/login" state={{ backgroundLocation: location }}>
                Iniciar sesión
              </NavLink>
              <Link className="navbar__button" to="/registro" state={{ backgroundLocation: location }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
