import {
  ArrowRight,
  Activity,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  CalendarDays,
  Eye,
  HeartPulse,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpecialties } from '../../services/specialtyService';
import './PublicPages.css';

const benefits = [
  {
    icon: Search,
    number: '01',
    title: 'Encuentra atención',
    text: 'Explora médicos y especialidades para encontrar la atención que necesitas.',
    path: '/medicos',
    link: 'Ver médicos',
  },
  {
    icon: CalendarCheck,
    number: '02',
    title: 'Organiza tus citas',
    text: 'Accede a tu espacio personal para revisar y gestionar tus citas médicas.',
    path: '/login',
    link: 'Ir a mi cuenta',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Ten tus datos a mano',
    text: 'Consulta tu perfil y mantén actualizados tus datos personales.',
    path: '/registro',
    link: 'Crear cuenta',
  },
];

const steps = [
  {
    icon: UserRoundPlus,
    title: 'Crea tu cuenta',
    text: 'Regístrate como paciente con tus datos personales.',
  },
  {
    icon: Stethoscope,
    title: 'Busca un profesional',
    text: 'Revisa el directorio y encuentra un médico por especialidad.',
  },
  {
    icon: CalendarDays,
    title: 'Gestiona tus citas',
    text: 'Ingresa a tu cuenta para organizar tu atención.',
  },
];

const fallbackSpecialties = [
  { icon: HeartPulse, title: 'Cardiología' },
  { icon: Sparkles, title: 'Dermatología' },
  { icon: Brain, title: 'Neurología' },
  { icon: Baby, title: 'Pediatría' },
  { icon: Bone, title: 'Traumatología' },
  { icon: Stethoscope, title: 'Medicina general' },
  { icon: Activity, title: 'Ginecología' },
  { icon: Eye, title: 'Oftalmología' },
];

const ICONS = {
  heart: HeartPulse,
  sparkles: Sparkles,
  brain: Brain,
  baby: Baby,
  bone: Bone,
  stethoscope: Stethoscope,
  shield: Activity,
  eye: Eye,
};

export default function HomePage() {
  // Se muestran las especialidades reales; si el servidor no responde, queda la lista de respaldo.
  const [specialties, setSpecialties] = useState(fallbackSpecialties);

  useEffect(() => {
    let alive = true;

    getSpecialties()
      .then((items) => {
        if (alive && items.length > 0) {
          setSpecialties(items.map((item) => ({ icon: ICONS[item.icon] ?? Stethoscope, title: item.name })));
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="public-page home-page">
      <section className="home-hero">
        <div className="home-shell home-hero__layout">
          <div className="home-hero__content">
            <span className="home-kicker">
              <HeartPulse size={16} aria-hidden="true" />
              Tu salud, más cerca
            </span>
            <h1>
              Una forma más simple de <span>cuidar tu salud.</span>
            </h1>
            <p className="home-hero__lead">
              Encuentra médicos, conoce sus especialidades y organiza tus citas
              desde un solo lugar.
            </p>
            <div className="home-hero__actions">
              <Link className="home-button home-button--light" to="/medicos">
                Buscar médicos <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="home-button home-button--outline" to="/registro">
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
                <div className="home-preview-search">
                  <span className="home-preview-search__icon"><Search size={17} /></span>
                  <span>¿Qué especialidad necesitas?</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </div>
                <div className="home-preview-note">
                  <span className="home-preview-note__icon"><CalendarDays size={19} /></span>
                  <span>
                    <strong>Tu atención, organizada</strong>
                    <small>Perfil y citas en un solo lugar</small>
                  </span>
                  <CalendarCheck size={18} className="home-preview-note__check" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="home-floating-badge">
              <span className="home-floating-badge__icon"><Stethoscope size={18} /></span>
              <span><strong>Atención médica</strong><small>a tu ritmo</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-specialties" id="especialidades">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-section-kicker">Atención para cada etapa</span>
            <h2>Nuestras especialidades</h2>
            <p>Explora distintas áreas de atención y encuentra profesionales en el directorio MediTurn.</p>
          </div>
          <div className="home-specialty-grid">
            {specialties.map(({ icon: Icon, title }) => (
              <Link className="home-specialty-card" key={title} to={`/medicos?especialidad=${encodeURIComponent(title)}`}>
                <span className="home-specialty-card__icon"><Icon size={22} aria-hidden="true" /></span>
                <strong>{title}</strong>
                <small>Ver profesionales <ArrowRight size={14} aria-hidden="true" /></small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-benefits" id="nosotros">
        <div className="home-shell">
          <div className="home-section-heading">
            <span className="home-section-kicker">Conoce MediTurn</span>
            <h2>¿Por qué elegir MediTurn?</h2>
            <p>Un espacio sencillo para encontrar profesionales y organizar tu información de salud.</p>
          </div>

          <div className="home-benefit-grid">
            {benefits.map(({ icon: Icon, number, title, text, path, link }) => (
              <article className="home-benefit-card" key={number}>
                <div className="home-benefit-card__top">
                  <span className="home-benefit-card__icon"><Icon size={22} aria-hidden="true" /></span>
                  <span className="home-benefit-card__number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={path} className="home-text-link">
                  {link} <ArrowRight size={16} aria-hidden="true" />
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
            <h2>Un camino claro para cuidar de ti</h2>
            <p>Crea tu cuenta y usa MediTurn para organizar tu atención médica.</p>
            <Link className="home-text-link" to="/registro">
              Comenzar ahora <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-step-list">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article className="home-step" key={title}>
                <span className="home-step__icon"><Icon size={21} aria-hidden="true" /></span>
                <span className="home-step__number">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="home-shell home-final-cta__content">
          <div>
            <span className="home-section-kicker">Da el primer paso</span>
            <h2>Empieza a organizar tu atención hoy.</h2>
          </div>
          <Link className="home-button home-button--light" to="/registro">
            Crear cuenta <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
