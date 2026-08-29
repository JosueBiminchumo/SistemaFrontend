import { Link, useNavigate } from 'react-router-dom';
import './Login.css';


export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora simulamos el inicio de sesión
    navigate('/paciente/inicio');
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Lado izquierdo */}
        <div className="login-info">
          <h1>Bienvenido</h1>

          <p>
            Ingresa a tu cuenta para gestionar tus citas
            médicas de manera rápida y sencilla.
          </p>

          <div className="login-decoration">
            <span>✓</span>
            <p>Gestiona tus citas</p>

            <span>✓</span>
            <p>Consulta tu agenda</p>

            <span>✓</span>
            <p>Accede a tu información</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="login-form-container">
          <h2>Iniciar sesión</h2>

          <p className="login-subtitle">
            Ingresa tus datos para continuar
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Recordarme
              </label>

              <a href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>

          <div className="register-link">
            <span>¿No tienes una cuenta?</span>{' '}
            <Link to="/registro">
              Regístrate aquí
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}