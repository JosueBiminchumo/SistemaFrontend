import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CalendarDays, HeartPulse, Search, ShieldCheck, Stethoscope, UserRoundPlus } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import './PublicPages.css';

const overview = [
  {
    icon: Stethoscope,
    label: 'Directorio',
    title: 'Médicos',
    description: 'Conoce a los profesionales disponibles en MediTurn.',
    path: '/medicos',
    action: 'Explorar médicos',
  },
  {
    icon: HeartPulse,
    label: 'Áreas de atención',
    title: 'Especialidades',
    description: 'Encuentra el área de atención que estás buscando.',
    path: '/especialidades',
    action: 'Ver especialidades',
  },
  {
    icon: ShieldCheck,
    label: 'La plataforma',
    title: 'Nosotros',
    description: 'Descubre qué puedes hacer con MediTurn.',
    path: '/nosotros',
    action: 'Conocer MediTurn',
  },
];

export default function HomePage() {
  const location = useLocation();

  return (
    <>
      <main className="public-page public-page--home home-page">
        <section className="home-hero">
          <div className="home-shell home-hero__layout">
            <div className="home-hero__content">
              <span className="home-kicker">
                <HeartPulse size={16} aria-hidden="true" />
                Tu salud, más cerca
              </span>
              <h1>Una forma más simple de <span>cuidar tu salud.</span></h1>
              <p className="home-hero__lead">
                Encuentra médicos, conoce sus especialidades y organiza tus citas desde un solo lugar.
              </p>
              <div className="home-hero__actions">
                <Link className="home-button home-button--light" to="/medicos">
                  Buscar médicos <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link className="home-button home-button--outline" to="/registro" state={{ backgroundLocation: location }}>
                  Crear cuenta
                </Link>
              </div>
              <div className="home-hero__assurance">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Tu información personal se gestiona de forma segura</span>
              </div>
            </div>

            <div className="home-hero__visual" aria-label="Vista previa de MediTurn">
              <div className="home-visual-orbit home-visual-orbit--one" />
              <div className="home-visual-orbit home-visual-orbit--two" />
              <div className="home-preview-card">
                <div className="home-preview-card__top">
                  <span className="home-preview-brand">
                    <span className="home-preview-brand__icon"><HeartPulse size={17} /></span>
                    MediTurn
                  </span>
                  <span className="home-preview-status"><i /> Tu espacio de salud</span>
                </div>
                <div className="home-preview-card__body">
                  <span className="home-preview-label">ATENCIÓN MÉDICA</span>
                  <h2>Todo empieza con un buen cuidado.</h2>
                  <p>Encuentra un profesional y da el siguiente paso para cuidar de ti.</p>
                  <Link className="home-preview-search" to="/especialidades">
                    <span className="home-preview-search__icon"><Search size={17} /></span>
                    <span>¿Qué especialidad necesitas?</span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <div className="home-preview-note">
                    <span className="home-preview-note__icon"><CalendarCheck size={19} /></span>
                    <span><strong>Tu atención, organizada</strong><small>Perfil y citas en un solo lugar</small></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-overview">
          <div className="home-shell">
            <div className="home-section-heading">
              <span className="home-section-kicker">Explora MediTurn</span>
              <h2>Atención médica desde un solo lugar</h2>
              <p>Conoce las secciones principales de la plataforma.</p>
            </div>
            <div className="home-benefit-grid">
              {overview.map(({ icon: Icon, label, title, description, path, action }) => (
                <article className="home-benefit-card" key={title}>
                  <div className="home-benefit-card__top">
                    <span className="home-benefit-card__icon"><Icon size={22} aria-hidden="true" /></span>
                  </div>
                  <span className="home-overview__label">{label}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <Link className="home-text-link" to={path}>
                    {action} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-process">
          <div className="home-shell home-process__layout">
            <div className="home-process__intro">
              <span className="home-section-kicker">Empieza en pocos pasos</span>
              <h2>Un camino claro para organizar tu atención</h2>
              <p>Usa las herramientas de MediTurn para encontrar profesionales y gestionar tus citas desde tu cuenta.</p>
              <Link className="home-text-link" to="/medicos">
                Explorar médicos <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-step-list">
              <div className="home-step">
                <span className="home-step__icon"><UserRoundPlus size={21} aria-hidden="true" /></span>
                <span className="home-step__number">01</span>
                <div><h3>Crea tu cuenta</h3><p>Regístrate como paciente para acceder a tu espacio personal.</p></div>
              </div>
              <div className="home-step">
                <span className="home-step__icon"><Stethoscope size={21} aria-hidden="true" /></span>
                <span className="home-step__number">02</span>
                <div><h3>Busca un profesional</h3><p>Consulta el directorio de médicos y sus especialidades.</p></div>
              </div>
              <div className="home-step">
                <span className="home-step__icon"><CalendarDays size={21} aria-hidden="true" /></span>
                <span className="home-step__number">03</span>
                <div><h3>Gestiona tus citas</h3><p>Ingresa a tu cuenta para organizar tu atención médica.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-final-cta">
          <div className="home-shell home-final-cta__content">
            <div>
              <span className="home-section-kicker">Da el primer paso</span>
              <h2>Empieza a organizar tu atención hoy.</h2>
            </div>
            <Link className="home-button home-button--light" to="/registro" state={{ backgroundLocation: location }}>
              Crear cuenta <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
