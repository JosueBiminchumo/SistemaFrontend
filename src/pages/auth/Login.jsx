import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login({ email, password });
      
      localStorage.setItem('token', data.token);
      
      navigate('/paciente/inicio');
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-info">
          <h1>Bienvenido</h1>
          <p>
            Ingresa a tu cuenta para gestionar tus citas
            médicas de manera rápida y sencilla.
          </p>
          <div className="login-decoration">
            <span>✓</span> <p>Gestiona tus citas</p>
            <span>✓</span> <p>Consulta tu agenda</p>
            <span>✓</span> <p>Accede a tu información</p>
          </div>
        </div>

        <div className="login-form-container">
          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">Ingresa tus datos para continuar</p>

          {error && <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" /> Recordarme
              </label>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>

          <div className="register-link">
            <span>¿No tienes una cuenta?</span>{' '}
            <Link to="/registro">Regístrate aquí</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
