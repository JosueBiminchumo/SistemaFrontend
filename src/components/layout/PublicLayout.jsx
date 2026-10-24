import { useState } from 'react';
import { HeartPulse, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import Footer from './Footer';
import './PublicLayout.css';

const dashboardByRole = {
  paciente: '/paciente/inicio',
  medico: '/medico/dashboard',
  admin: '/admin/dashboard',
};

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('mediturn_user') || 'null');
  } catch {
    return null;
  }
}

function PublicHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = readCurrentUser();
  const dashboardPath = user ? dashboardByRole[user.role] : null;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const links = (mobile = false) => (
    <>
      <NavLink
        className={({ isActive }) => `public-header__link${isActive ? ' is-active' : ''}`}
        end
        onClick={mobile ? closeMenu : undefined}
        to="/"
      >
        Inicio
      </NavLink>
      <NavLink
        className={({ isActive }) => `public-header__link${isActive ? ' is-active' : ''}`}
        onClick={mobile ? closeMenu : undefined}
        to="/medicos"
      >
        Médicos
      </NavLink>
      <NavLink className={({ isActive }) => `public-header__link${isActive ? ' is-active' : ''}`} onClick={mobile ? closeMenu : undefined} to="/especialidades">
        Especialidades
      </NavLink>
      <NavLink className={({ isActive }) => `public-header__link${isActive ? ' is-active' : ''}`} onClick={mobile ? closeMenu : undefined} to="/nosotros">
        Nosotros
      </NavLink>
      {dashboardPath && (
        <NavLink
          className={({ isActive }) => `public-header__link${isActive ? ' is-active' : ''}`}
          onClick={mobile ? closeMenu : undefined}
          to={dashboardPath}
        >
          Mi panel
        </NavLink>
      )}
    </>
  );

  const actions = (mobile = false) => (
    user ? (
      <div className="public-header__signed-in">
        <span className="public-header__user" title={user.email}>
          <span className="public-header__user-dot" />
          {user.firstName || user.name || user.role}
        </span>
        <button className="public-header__login" onClick={handleLogout} type="button">
          Cerrar sesión
        </button>
      </div>
    ) : (
      <>
        <NavLink
          className={({ isActive }) => `public-header__login${isActive ? ' is-active' : ''}`}
          onClick={mobile ? closeMenu : undefined}
          state={{ from: location.pathname }}
          to="/login"
        >
          Iniciar sesión
        </NavLink>
        <Link className="public-header__register" onClick={mobile ? closeMenu : undefined} to="/registro">
          Registrarse
        </Link>
      </>
    )
  );

  return (
    <header className="public-header">
      <Link className="public-header__brand" onClick={closeMenu} to="/" aria-label="MediTurn, inicio">
        <span className="public-header__mark"><HeartPulse size={22} strokeWidth={2.2} /></span>
        <span className="public-header__brand-copy">
          <strong>Medi<span>Turn</span></strong>
          <small>Salud a tu tiempo</small>
        </span>
      </Link>

      <nav className="public-header__links" aria-label="Navegación principal">
        {links()}
      </nav>

      <div className="public-header__actions">{actions()}</div>

      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="public-header__menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {menuOpen && (
        <div className="public-header__mobile-panel">
          <nav className="public-header__mobile-links" aria-label="Navegación móvil">
            {links(true)}
          </nav>
          <div className="public-header__mobile-actions">{actions(true)}</div>
        </div>
      )}
    </header>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <PublicHeader />
      <div className="public-layout-content">{children}</div>
      <Footer />
    </div>
  );
}

export default PublicLayout;
