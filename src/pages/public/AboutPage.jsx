import {
  ArrowRight, CalendarCheck, HeartPulse, LockKeyhole, Search, UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

const platformFeatures = [
  {
    icon: Search,
    title: 'Explora el directorio',
    text: 'Consulta perfiles médicos y usa la búsqueda para encontrar profesionales por nombre o especialidad.',
    path: '/medicos',
    action: 'Ver médicos',
  },
  {
    icon: CalendarCheck,
    title: 'Organiza tus citas',
    text: 'Desde tu cuenta puedes acceder a las opciones disponibles para consultar y gestionar tus citas.',
    path: '/login',
    action: 'Iniciar sesión',
  },
  {
    icon: UserRound,
    title: 'Mantén tu perfil al día',
    text: 'Crea tu cuenta y administra tus datos personales desde tu espacio en MediTurn.',
    path: '/registro',
    action: 'Crear cuenta',
  },
];

export default function AboutPage() {
  return (
    <main className="public-page about-page">
      <section className="catalog-hero about-hero">
        <div className="catalog-shell">
          <span className="catalog-kicker"><HeartPulse size={17} /> Sobre MediTurn</span>
          <h1>Una forma más clara de organizar tu atención médica</h1>
          <p>MediTurn reúne el directorio médico, tu perfil y la gestión de citas en una experiencia digital sencilla.</p>
          <Link className="catalog-hero__link" to="/registro">Conoce MediTurn <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="about-intro catalog-shell">
        <div className="about-intro__icon"><LockKeyhole size={25} aria-hidden="true" /></div>
        <div>
          <span className="catalog-section-kicker">Nuestro propósito</span>
          <h2>Hacer más simple el acceso a tu información de salud</h2>
          <p>Diseñamos MediTurn para que puedas encontrar opciones de atención, crear tu cuenta y tener tus datos y citas organizados desde un mismo lugar.</p>
        </div>
      </section>

      <section className="about-features">
        <div className="catalog-shell">
          <div className="catalog-heading">
            <span className="catalog-section-kicker">Qué puedes hacer</span>
            <h2>Un espacio pensado para acompañarte</h2>
            <p>Accede a las herramientas principales de MediTurn según lo que necesites.</p>
          </div>
          <div className="about-feature-grid">
            {platformFeatures.map(({ icon: Icon, title, text, path, action }) => (
              <article className="about-feature-card" key={title}>
                <span className="about-feature-card__icon"><Icon size={23} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={path}>{action} <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="catalog-shell about-cta__content">
          <div>
            <span className="catalog-section-kicker">Empieza cuando quieras</span>
            <h2>Tu salud, más cerca con MediTurn</h2>
          </div>
          <Link className="catalog-hero__link" to="/registro">Crear cuenta <ArrowRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
