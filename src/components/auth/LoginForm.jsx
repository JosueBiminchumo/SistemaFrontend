import { useState } from 'react';
import { login, roleToHomeRoute } from '../../services/authService';

const initialValues = {
  email: '',
  password: '',
  remember: true,
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm({ onLogin }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = 'Ingresa tu correo.';
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = 'Ingresa un correo válido.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Ingresa tu contraseña.';
    } else if (values.password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const email = values.email.trim().toLowerCase();
      const response = await login({ email, password: values.password });
      const user = response.user;
      onLogin({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        dashboardPath: roleToHomeRoute(user.role),
        remember: values.remember,
      });
    } catch (error) {
      setErrors({
        password: error.message || 'Credenciales incorrectas. Revisa tus datos.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {message && <p className="form-alert form-alert--info">{message}</p>}

      <label className="field" htmlFor="login-email">
        <span>Correo electrónico</span>
        <input
          autoComplete="email"
          id="login-email"
          name="email"
          onChange={handleChange}
          placeholder="paciente@mediturn.pe"
          type="email"
          value={values.email}
        />
        {errors.email && <small>{errors.email}</small>}
      </label>

      <label className="field" htmlFor="login-password">
        <span>Contraseña</span>
        <input
          autoComplete="current-password"
          id="login-password"
          name="password"
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          type="password"
          value={values.password}
        />
        {errors.password && <small>{errors.password}</small>}
      </label>

      <div className="form-row form-row--between">
        <label className="check-field" htmlFor="remember">
          <input
            checked={values.remember}
            id="remember"
            name="remember"
            onChange={handleChange}
            type="checkbox"
          />
          <span>Recordarme</span>
        </label>
        <span className="muted-link">Acceso seguro</span>
      </div>

      <button
        className="button button--primary button--full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
