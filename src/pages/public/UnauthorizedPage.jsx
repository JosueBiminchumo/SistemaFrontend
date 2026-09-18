import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function UnauthorizedPage() {
  return (
    <main className="state-page">
      <section className="state-panel">
        <span className="state-code">403</span>
        <h1>Acceso no autorizado</h1>
        <p>
          Tu rol actual no tiene permiso para ver esta seccion. Inicia sesion
          con una cuenta que corresponda al modulo que deseas probar.
        </p>
        <div className="state-actions">
          <Link className="button button--primary" to="/login">
            Cambiar sesion
          </Link>
          <Link className="button button--secondary" to="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
