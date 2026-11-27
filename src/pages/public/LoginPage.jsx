import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import AuthModal from '../../components/auth/AuthModal';
import LoginForm from '../../components/auth/LoginForm';
import './PublicPages.css';

const HOME_LOCATION = { pathname: '/' };

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation || HOME_LOCATION;
  const closeModal = useCallback(() => {
    navigate(backgroundLocation, { replace: true });
  }, [backgroundLocation, navigate]);

  const handleLogin = (user) => {
    localStorage.setItem('mediturn_user', JSON.stringify(user));
    navigate(user.dashboardPath);
  };

  return (
    <AuthModal className="auth-modal--login" onClose={closeModal} title="Inicia sesión">
      <div className="login-modal-welcome">
        <span className="login-modal-welcome__icon"><HeartPulse size={23} aria-hidden="true" /></span>
        <span>
          <strong>Bienvenido de nuevo</strong>
          <small>Tu espacio de salud te espera.</small>
        </span>
        <ShieldCheck className="login-modal-welcome__secure" size={20} aria-hidden="true" />
      </div>
      <p className="auth-modal__subtitle">Ingresa tus datos para acceder a tu cuenta.</p>
      <LoginForm onLogin={handleLogin} />
      <p className="auth-footer">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" state={{ backgroundLocation }}>Regístrate aquí</Link>
      </p>
    </AuthModal>
  );
}
