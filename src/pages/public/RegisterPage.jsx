import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../../components/auth/AuthModal';
import RegisterForm from '../../components/auth/RegisterForm';
import { register } from '../../services/authService';
import './PublicPages.css';

const HOME_LOCATION = { pathname: '/' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation || HOME_LOCATION;
  const closeModal = useCallback(() => {
    navigate(backgroundLocation, { replace: true });
  }, [backgroundLocation, navigate]);

  const handleRegister = async (patient) => {
    const response = await register(patient);
    const user = response.user;

    localStorage.setItem(
      'mediturn_user',
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        dashboardPath: '/paciente',
      }),
    );
    navigate('/paciente/perfil');
  };

  return (
    <AuthModal className="auth-modal--register" onClose={closeModal} title="Crea tu cuenta">
      <RegisterForm onRegister={handleRegister} />
      <p className="auth-footer">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" state={{ backgroundLocation }}>Inicia sesión</Link>
      </p>
    </AuthModal>
  );
}
