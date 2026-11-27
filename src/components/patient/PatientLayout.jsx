import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getCurrentUser, logout } from '../../services/authService';
import './PatientLayout.css';

export default function PatientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(setProfile)
      .catch((requestError) => setError(requestError.message));
  }, []);

  const isActive = (path) => location.pathname === path;

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Seguro que deseas salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Seguir aquí',
      reverseButtons: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#e2e8f0',
      customClass: { cancelButton: 'swal-cancel-button' },
    });

    if (!result.isConfirmed) return;

    logout();
    closeSidebar();
    navigate('/login', { replace: true });
  };

  const firstName = profile?.firstName ?? '';
  const lastName = profile?.lastName ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="patient-layout">
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <span className="mobile-brand-name">MediTurno</span>
      </header>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`patient-sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">🩺</div>

          <div>
            <span className="sidebar-brand-name">MediTurno</span>
            <span className="sidebar-brand-sub">
              Tu salud, a tu tiempo
            </span>
          </div>

          <button
            type="button"
            className="mobile-close-button"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <div className="sidebar-profile-card">
          <div className="sidebar-avatar">{initials}</div>

          <div>
            <strong>
              {profile ? `${firstName} ${lastName}` : 'Cargando cuenta...'}
            </strong>
            <span>Paciente</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/paciente"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${
              isActive('/paciente') ? 'active' : ''
            }`}
          >
            <span className="nav-icon">☷</span>
            Inicio
          </Link>

          <Link
            to="/paciente/reservar-cita"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${
              isActive('/paciente/reservar-cita') ? 'active' : ''
            }`}
          >
            <span className="nav-icon">+</span>
            Reservar cita
          </Link>

          <Link
            to="/paciente/mis-citas"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${
              isActive('/paciente/mis-citas') ? 'active' : ''
            }`}
          >
            <span className="nav-icon">📅</span>
            Mis citas
          </Link>

          <Link
            to="/paciente/historial"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${
              isActive('/paciente/historial') ? 'active' : ''
            }`}
          >
            <span className="nav-icon">📋</span>
            Historial
          </Link>

          <Link
            to="/paciente/perfil"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${
              isActive('/paciente/perfil') ? 'active' : ''
            }`}
          >
            <span className="nav-icon">👤</span>
            Mi perfil
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="patient-main-content">
        {error && <p role="alert">{error}</p>}
        <header className="patient-topbar">
          <div className="patient-search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="text"
              placeholder="Buscar..."
            />
          </div>

          <div className="patient-topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">
                {initials}
              </div>

              <span>{firstName || 'Cargando...'}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
