import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div>
      <h1>Crear cuenta</h1>

      <form>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
          />
        </div>

        <button type="submit">
          Registrarse
        </button>
      </form>

      <p>
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
