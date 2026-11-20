import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  isAuthenticated,
  logout,
  roleToHomeRoute,
} from '../services/authService';

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
    <nav className="navbar">
      <Link className="navbar__brand" to="/">
        <span className="navbar__mark">M</span>
        <strong>MediTurn</strong>
      </Link>

      <div className="navbar__links" aria-label="Navegacion principal">
        <NavLink className="navbar__link" to="/">
          Inicio
        </NavLink>
        <NavLink className="navbar__link" to="/medicos">
          Medicos
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
            <NavLink className="navbar__link" to="/login" state={{ from: location.pathname }}>
              Iniciar sesion
            </NavLink>
            <Link className="navbar__button" to="/registro">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
    </>
  );
}
