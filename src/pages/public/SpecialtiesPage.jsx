import {
  Activity, ArrowRight, Baby, Bone, Brain, CalendarCheck, Clock3, Eye, HeartPulse,
  MapPin, Search, Sparkles, Stethoscope,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpecialties } from '../../services/specialtyService';
import './PublicPages.css';

// La API no guarda íconos: se elige uno según el tipo de especialidad (ver specialtyService).
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

const steps = [
  { icon: Search, title: 'Elige un área', text: 'Selecciona la especialidad que quieres explorar para filtrar el directorio.' },
  { icon: MapPin, title: 'Revisa la información', text: 'Compara la especialidad, el consultorio y otros datos visibles del profesional.' },
  { icon: CalendarCheck, title: 'Continúa con tu cita', text: 'Inicia sesión desde el directorio para continuar con las opciones de reserva.' },
];

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;

    getSpecialties()
      .then((items) => alive && setSpecialties(items))
      .catch((err) => alive && setLoadError(err.message || 'No se pudieron cargar las especialidades.'))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="public-page catalog-page">
      <section className="catalog-hero">
        <div className="catalog-shell">
          <span className="catalog-kicker"><Stethoscope size={17} /> Directorio MediTurn</span>
          <h1>Especialidades para encontrar la atención que buscas</h1>
          <p>Conoce qué aborda cada área y utiliza los filtros para encontrar profesionales en el directorio público de MediTurn.</p>
          <Link className="catalog-hero__link" to="/medicos">Ver directorio médico <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="catalog-content catalog-shell">
        <div className="catalog-heading">
          <span className="catalog-section-kicker">Áreas de atención</span>
          <h2>Nuestras especialidades</h2>
          <p>Cada especialidad reúne un área distinta de atención. Selecciona una para ver si hay profesionales publicados en el directorio.</p>
        </div>
        <div className="specialty-page-grid">
          {loading && <p>Cargando especialidades...</p>}
          {!loading && loadError && <p>{loadError}</p>}
          {specialties.map(({ id, icon, name, description }) => {
            const Icon = ICONS[icon] ?? Stethoscope;

            return (
              <article className="specialty-page-card" key={id}>
                <span className="specialty-page-card__icon"><Icon size={23} aria-hidden="true" /></span>
                <h3>{name}</h3>
                <p>{description || 'Atención especializada con profesionales del directorio MediTurn.'}</p>
                <Link to={`/medicos?especialidad=${encodeURIComponent(name)}`}>
                  Ver profesionales <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="catalog-note">La disponibilidad depende de los profesionales registrados en el directorio.</p>
      </section>

      <section className="specialty-guide">
        <div className="catalog-shell">
          <div className="catalog-heading">
            <span className="catalog-section-kicker">Guía rápida</span>
            <h2>¿Cómo encontrar un profesional?</h2>
            <p>Desde MediTurn puedes pasar de explorar un área a revisar la información del directorio en unos pasos.</p>
          </div>
          <div className="specialty-steps">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article className="specialty-step" key={title}>
                <span className="specialty-step__number">0{index + 1}</span>
                <span className="specialty-step__icon"><Icon size={21} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="specialty-directory-info catalog-shell">
        <div className="specialty-directory-info__copy">
          <span className="catalog-section-kicker">Información del directorio</span>
          <h2>Revisa los datos antes de continuar</h2>
          <p>En cada tarjeta del directorio puedes consultar información útil del profesional. Los horarios son referenciales y pueden cambiar.</p>
          <Link className="specialty-directory-info__link" to="/medicos">Abrir directorio <ArrowRight size={16} /></Link>
        </div>
        <div className="specialty-directory-info__items">
          <div><Stethoscope size={19} /><span><strong>Especialidad</strong><small>Área de atención del profesional</small></span></div>
          <div><MapPin size={19} /><span><strong>Consultorio</strong><small>Ubicación publicada en su perfil</small></span></div>
          <div><Clock3 size={19} /><span><strong>Próximo horario</strong><small>Disponibilidad de referencia</small></span></div>
        </div>
      </section>
    </main>
  );
}
