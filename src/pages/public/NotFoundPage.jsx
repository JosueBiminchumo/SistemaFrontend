import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function NotFoundPage() {
  return (
    <main className="state-page">
      <section className="state-panel">
        <span className="state-code">404</span>
        <h1>Pagina no encontrada</h1>
        <p>
          La ruta que intentaste abrir no existe o todavia no esta disponible.
        </p>
        <div className="state-actions">
          <Link className="button button--primary" to="/">
            Ir al inicio
          </Link>
          <Link className="button button--secondary" to="/medicos">
            Ver medicos
          </Link>
        </div>
      </section>
    </main>
  );
}
