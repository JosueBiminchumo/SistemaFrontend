import { Link } from 'react-router-dom';
import './PublicPages.css';

const options = [
  {
    title: 'Iniciar sesion',
    text: 'Acceso para paciente, medico y administrador.',
    path: '/login',
    tag: 'Acceso',
    className: 'vento-card--main vento-card--teal',
  },
  {
    title: 'Registrarse',
    text: 'Formulario para crear una cuenta de paciente.',
    path: '/registro',
    tag: 'Paciente',
    className: 'vento-card--blue',
  },
  {
    title: 'Ver medicos',
    text: 'Lista de medicos disponibles por especialidad.',
    path: '/medicos',
    tag: 'Directorio',
    className: 'vento-card--cream',
  },
  {
    title: 'Roles',
    text: 'Paciente, medico y administrador.',
    path: '/login',
    tag: '3 tipos',
    className: 'vento-card--small',
  },
  {
    title: 'Citas',
    text: 'Consulta y reserva desde el panel del paciente.',
    path: '/login',
    tag: 'Gestion',
    className: 'vento-card--small vento-card--green',
  },
];

export default function HomePage() {
  return (
    <main className="public-page">
      <section className="vento-hero">
        <div className="hero-section__content">
          <span className="eyebrow">MediTurn</span>
          <h1>Gestion de citas medicas desde un solo lugar</h1>
          <p>
            Consulta medicos, crea una cuenta de paciente o ingresa al sistema
            segun tu tipo de usuario.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/login">
              Iniciar sesion
            </Link>
            <Link className="button button--secondary" to="/medicos">
              Ver medicos
            </Link>
          </div>
        </div>

        <div className="hero-summary" aria-label="Resumen de medicos">
          <span>Medicos disponibles</span>
          <strong>4</strong>
        </div>
      </section>

      <section className="public-section public-section--compact">
        <div className="section-heading">
          <h2>Opciones principales</h2>
        </div>
        <div className="vento-grid">
          {options.map((option) => (
            <Link
              className={`vento-card ${option.className}`}
              key={option.title}
              to={option.path}
            >
              <span>{option.tag}</span>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
