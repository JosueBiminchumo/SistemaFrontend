import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
  Bell,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleUserRound,
  LogOut,
  Search,
  Settings,
  Stethoscope,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';

import './AdminLayout.css';

const menuOptions = [
  {
    label: 'Inicio',
    path: '/admin/dashboard',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: 'Médicos',
    path: '/admin/medicos',
    icon: UserRoundCog,
  },
  {
    label: 'Pacientes',
    path: '/admin/pacientes',
    icon: UsersRound,
  },
  {
    label: 'Especialidades',
    path: '/admin/especialidades',
    icon: Stethoscope,
  },
  {
    label: 'Citas',
    path: '/admin/citas',
    icon: CalendarDays,
  },
  {
    label: 'Usuarios',
    path: '/admin/usuarios',
    icon: CircleUserRound,
  },
  {
    label: 'Reportes',
    path: '/admin/estadisticas',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: 'Configuración',
    path: '/admin/perfil',
    icon: Settings,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand__icon">
            <Stethoscope size={21} />
          </div>

          <div>
            <strong>MediTurno</strong>
            <span>Tu salud, a tu tiempo</span>
          </div>
        </div>

        <div className="admin-user-card">
          <div className="admin-user-card__avatar">AM</div>

          <div>
            <strong>Admin MediTurno</strong>
            <span>Administrador</span>
          </div>
        </div>

        <nav className="admin-menu" aria-label="Menú administrativo">
          {menuOptions.map((option) => {
            const MenuIcon = option.icon;

            return (
              <NavLink
                key={option.path}
                to={option.path}
                className={({ isActive }) =>
                  `admin-menu__link ${
                    isActive ? 'admin-menu__link--active' : ''
                  }`
                }
              >
                <MenuIcon size={18} />
                <span>{option.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <label className="admin-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar en el panel administrativo"
            />
          </label>

          <div className="admin-topbar__account">
            <button
              type="button"
              className="admin-notification"
              aria-label="Notificaciones"
            >
              <Bell size={19} />
              <span />
            </button>

            <button
              type="button"
              className="admin-account-button"
              onClick={() => navigate('/admin/perfil')}
              aria-label="Abrir perfil del administrador"
            >
              <div className="admin-topbar__avatar">AM</div>
              <span>Admin</span>
            </button>
          </div>
        </header>

        <div className="admin-layout__content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}