import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import './DoctorLayout.css';

const navItems = [
  { path: '/medico/dashboard', label: 'Inicio', icon: '⬚' },
  { path: '/medico/agenda', label: 'Mi agenda', icon: '📅' },
  { path: '/medico/citas', label: 'Citas', icon: '🗂️' },
  { path: '/medico/pacientes', label: 'Pacientes', icon: '🧑‍🤝‍🧑' },
  { path: '/medico/perfil', label: 'Mi perfil', icon: '👤' },
];

export default function DoctorLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(setProfile)
      .catch((requestError) => setError(requestError.message));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Cargando cuenta...';
  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : '...';

  return (
    <div className="doctor-layout">
      <aside className={`doctor-layout__sidebar ${collapsed ? 'doctor-layout__sidebar--collapsed' : ''}`}>
        <div className="doctor-layout__sidebar-top">
          <button
            type="button"
            className="doctor-layout__toggle"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label="Alternar menú"
          >
            ☰
          </button>
          {!collapsed && <span className="doctor-layout__brand">MediTurno</span>}
        </div>

        <nav className="doctor-layout__nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`doctor-layout__nav-item ${location.pathname.startsWith(item.path) ? 'doctor-layout__nav-item--active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="doctor-layout__nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="doctor-layout__sidebar-bottom">
          <div className="doctor-layout__user">
            <span className="doctor-layout__avatar">{initials}</span>
            {!collapsed && (
              <div className="doctor-layout__user-info">
                <span className="doctor-layout__user-name">{fullName}</span>
                <span className="doctor-layout__user-role">Médico</span>
              </div>
            )}
          </div>

          <button type="button" className="doctor-layout__logout" onClick={handleLogout}>
            <span>⎋</span>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="doctor-layout__content">
        {error && <p role="alert">{error}</p>}
        {children}
      </main>
    </div>
  );
}