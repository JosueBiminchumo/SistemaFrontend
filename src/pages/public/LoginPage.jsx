import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import './PublicPages.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    localStorage.setItem('mediturn_user', JSON.stringify(user));
    navigate(user.dashboardPath);
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel--login">
        <div className="auth-copy">
          <span className="eyebrow">Acceso</span>
          <h1>Inicia sesion en MediTurn</h1>
          <p>
            Ingresa con la cuenta registrada en el sistema.
          </p>
          <ul className="auth-list">
            <li>Validacion de correo y contrasena.</li>
            <li>Acceso para paciente, medico y administrador.</li>
            <li>Redireccion al panel principal.</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Iniciar sesion</h2>
          <p className="auth-subtitle">Tus credenciales se validan con el sistema.</p>
          <LoginForm onLogin={handleLogin} />
          <p className="auth-footer">
            No tienes cuenta? <Link to="/registro">Registrate aqui</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
