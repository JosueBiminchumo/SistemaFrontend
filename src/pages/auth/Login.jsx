import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  
  // 1. Creamos los estados para capturar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Modificamos el submit para que sea asíncrono y llame al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores anteriores

    try {
      // Enviamos las credenciales al servicio de Axios
      const data = await login({ email, password });
      
      // Guardamos el token
      localStorage.setItem('token', data.token);
      
      // Redirigimos (luego ajustaremos esto para que lea el rol del token)
      navigate('/paciente/inicio');
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Lado izquierdo (Se mantiene intacto) */}
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

        {/* Formulario */}
        <div className="login-form-container">
          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">Ingresa tus datos para continuar</p>

          {/* 3. Mostramos el mensaje de error si falla la conexión */}
          {error && <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={email} // Conectamos el input al estado
                onChange={(e) => setEmail(e.target.value)} // Actualizamos el estado al escribir
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                required
                value={password} // Conectamos el input al estado
                onChange={(e) => setPassword(e.target.value)} // Actualizamos el estado al escribir
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