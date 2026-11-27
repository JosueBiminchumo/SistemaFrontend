import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search, ShieldCheck } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import './PublicPages.css';

const capabilities = [
  {
    icon: Search,
    title: 'Consulta el directorio',
    description: 'Revisa los médicos y las especialidades disponibles en el sistema.',
    link: '/medicos',
    linkText: 'Ver médicos',
  },
  {
    icon: CalendarDays,
    title: 'Gestiona tus citas',
    description: 'Accede a las funciones de citas desde tu cuenta de paciente.',
    link: '/login',
    linkText: 'Iniciar sesión',
  },
  {
    icon: ShieldCheck,
    title: 'Administra tu perfil',
    description: 'Consulta y actualiza la información de tu perfil desde el espacio personal.',
    link: '/registro',
    linkText: 'Crear cuenta',
  },
];

export default function AboutPage() {
  const location = useLocation();
  return (
    <>
      <main className="public-page catalog-page about-page">
        <section className="catalog-hero">
          <span className="eyebrow">Conoce MediTurn</span>
          <h1>Tu atención médica, organizada</h1>
          <p>MediTurn reúne el directorio de médicos, las especialidades y las herramientas para gestionar citas y el perfil del paciente.</p>
        </section>

        <section className="catalog-content about-content" aria-label="Funciones de MediTurn">
          <div className="about-heading">
            <h2>¿Qué puedes hacer en MediTurn?</h2>
            <p>Estas son las funciones disponibles en la plataforma.</p>
          </div>
          <div className="about-grid">
            {capabilities.map(({ icon: Icon, title, description, link, linkText }) => (
              <article className="about-card" key={title}>
                <span className="about-card__icon" aria-hidden="true"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link
                  state={['/login', '/registro'].includes(link) ? { backgroundLocation: location } : undefined}
                  to={link}
                >
                  {linkText} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
