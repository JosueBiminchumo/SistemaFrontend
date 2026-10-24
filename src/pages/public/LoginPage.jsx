import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck2, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';
import { login } from '../../services/authService';
import './PublicPages.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const { user } = await login(credentials);
    navigate(user.dashboardPath, { replace: true });
  };

  return (
    <main className="auth-page login-page">
      <section className="login-experience">
        <aside className="login-brand-panel">
          <div className="login-brand-panel__content">
            <div className="login-brand-mark"><HeartPulse size={30} strokeWidth={2} /></div>
            <span className="login-brand-name">Medi<span>Turn</span></span>
            <p className="login-brand-lead">Tu salud, a tu tiempo. Gestiona tus citas médicas de forma fácil y segura.</p>
            <div className="login-benefits">
              <div><CalendarCheck2 size={19} /><span><strong>Organiza tus citas</strong><small>Todo en un solo lugar</small></span></div>
              <div><Stethoscope size={19} /><span><strong>Encuentra especialistas</strong><small>Atención según tus necesidades</small></span></div>
              <div><ShieldCheck size={19} /><span><strong>Acceso protegido</strong><small>Tu cuenta, bajo tu control</small></span></div>
            </div>
          </div>
          <span className="login-brand-panel__foot">MediTurn · Salud a tu tiempo</span>
        </aside>

        <div className="login-form-panel">
          <div className="login-form-content">
            <span className="login-form-kicker">Bienvenido de nuevo</span>
            <h1>Inicia sesión</h1>
            <p className="login-form-subtitle">Ingresa a tu cuenta para continuar.</p>
            <LoginForm onLogin={handleLogin} />
            <p className="login-register-prompt">
              ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </div>
          <p className="login-form-help">¿Necesitas ayuda? <Link to="/medicos">Explora el directorio médico</Link></p>
        </div>
      </section>
    </main>
  );
}
