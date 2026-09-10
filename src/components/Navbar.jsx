import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const dashboardByRole = {
  paciente: '/paciente/inicio',
  medico: '/medico/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('mediturn_user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const dashboardPath = user ? dashboardByRole[user.role] : null;

  const handleLogout = () => {
    localStorage.removeItem('mediturn_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
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
  );
}
