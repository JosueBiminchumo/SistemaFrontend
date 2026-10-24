import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck2, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import { register } from '../../services/authService';
import './PublicPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (patient) => {
    await register(patient);
    navigate('/paciente/perfil', { replace: true });
  };

  return (
    <main className="auth-page login-page register-page">
      <section className="login-experience register-experience">
        <aside className="login-brand-panel register-brand-panel">
          <div className="login-brand-panel__content">
            <div className="login-brand-mark"><HeartPulse size={30} strokeWidth={2} /></div>
            <span className="login-brand-name">Medi<span>Turn</span></span>
            <p className="login-brand-lead">Empieza a cuidar de tu salud con una experiencia sencilla y segura.</p>
            <div className="login-benefits">
              <div><CalendarCheck2 size={19} /><span><strong>Gestiona tus citas</strong><small>Organiza tu atención fácilmente</small></span></div>
              <div><Stethoscope size={19} /><span><strong>Conecta con especialistas</strong><small>Encuentra atención para ti</small></span></div>
              <div><ShieldCheck size={19} /><span><strong>Tus datos protegidos</strong><small>Información segura y personal</small></span></div>
            </div>
          </div>
          <span className="login-brand-panel__foot">MediTurn · Salud a tu tiempo</span>
        </aside>

        <div className="login-form-panel register-form-panel">
          <div className="login-form-content register-form-content">
            <span className="login-form-kicker">Únete a MediTurn</span>
            <h1>Crea tu cuenta</h1>
            <p className="login-form-subtitle">Completa tus datos para comenzar.</p>
            <RegisterForm onRegister={handleRegister} />
            <p className="login-register-prompt">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
