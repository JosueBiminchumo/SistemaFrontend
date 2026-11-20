import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDoctors } from '../../services/doctorService';
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
  const [doctors, setDoctors] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listDoctors()
      .then(setDoctors)
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <main className="public-page public-page--home">
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
          <strong>{doctors ? doctors.length : '—'}</strong>
        </div>
      </section>

      <section className="public-section home-doctors">
        <div className="section-heading">
          <span className="eyebrow">Directorio</span>
          <h2>Médicos registrados</h2>
          <p>Información actualizada desde el sistema.</p>
        </div>

        {error && <p role="alert">{error}</p>}
        {!doctors && !error && <p role="status">Cargando médicos...</p>}
        {doctors && doctors.length === 0 && (
          <div className="empty-state">
            <h2>Aún no hay médicos registrados</h2>
            <p>El directorio mostrará aquí a los profesionales activos.</p>
          </div>
        )}
        {doctors && doctors.length > 0 && (
          <>
            <div className="doctor-grid home-doctors__grid">
              {doctors.slice(0, 3).map((doctor) => (
                <article className="doctor-card" key={doctor.id}>
                  <div className="doctor-card__top">
                    <div className="avatar" aria-hidden="true">
                      {`${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase()}
                    </div>
                    <div>
                      <h2>{doctor.firstName} {doctor.lastName}</h2>
                      <span>{doctor.specialty}</span>
                    </div>
                  </div>
                  <dl className="doctor-details">
                    <div>
                      <dt>Registro profesional</dt>
                      <dd>{doctor.licenseNumber}</dd>
                    </div>
                    <div>
                      <dt>Perfil</dt>
                      <dd>{doctor.biography || 'Sin biografía publicada'}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <Link className="button button--outline" to="/medicos">
              Ver directorio completo
            </Link>
          </>
        )}
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
