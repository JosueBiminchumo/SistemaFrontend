import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProfile } from './doctorStorage';
import './DoctorLayout.css';

const navItems = [
  { path: '/medico/dashboard', label: 'Inicio', icon: '⬚' },
  { path: '/medico/agenda', label: 'Mi agenda', icon: '📅' },
  { path: '/medico/citas', label: 'Citas', icon: '🗂️' },
  { path: '/medico/perfil', label: 'Mi perfil', icon: '👤' },
];

export default function DoctorLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profile = getProfile();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

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
              className={`doctor-layout__nav-item ${location.pathname === item.path ? 'doctor-layout__nav-item--active' : ''}`}
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
                <span className="doctor-layout__user-name">{profile.name}</span>
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

      <main className="doctor-layout__content">{children}</main>
    </div>
  );
}