import './Header.css';

function Header({ userName = 'Usuario', userRole = '', onLogout }) {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-logo">MediTurno</span>
      </div>

      <div className="app-header-right">
        <button className="app-header-icon-btn" title="Notificaciones">
          🔔
        </button>

        <div className="app-header-user">
          <div className="app-header-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="app-header-user-info">
            <span className="app-header-user-name">{userName}</span>
            {userRole && <span className="app-header-user-role">{userRole}</span>}
          </div>
        </div>

        <button className="app-header-logout" onClick={onLogout} title="Cerrar sesión">
          ⏻
        </button>
      </div>
    </header>
  );
}

export default Header;