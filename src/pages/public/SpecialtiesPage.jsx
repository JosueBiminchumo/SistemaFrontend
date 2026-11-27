import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import { listDoctors } from '../../services/doctorService';
import { listSpecialties } from '../../services/specialtyService';
import './PublicPages.css';

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listSpecialties(), listDoctors()])
      .then(([specialtyItems, doctorItems]) => {
        setSpecialties(specialtyItems.filter((item) => item.active));
        setDoctors(doctorItems.filter((doctor) => doctor.active));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const doctorCounts = useMemo(() => doctors.reduce((counts, doctor) => {
    counts[doctor.specialty] = (counts[doctor.specialty] || 0) + 1;
    return counts;
  }, {}), [doctors]);

  return (
    <>
      <main className="public-page catalog-page">
        <section className="catalog-hero">
          <span className="eyebrow">Atención para cada etapa</span>
          <h1>Especialidades médicas</h1>
          <p>Consulta las áreas de atención registradas y encuentra profesionales disponibles.</p>
        </section>

        <section className="catalog-content" aria-label="Especialidades registradas">
          {error && <p className="catalog-error" role="alert">No se pudo consultar el catálogo: {error}</p>}
          {loading ? (
            <p className="catalog-message" role="status">Cargando especialidades...</p>
          ) : error ? (
            <p className="catalog-message">Intenta recargar la página.</p>
          ) : specialties.length === 0 ? (
            <div className="catalog-empty">
              <h2>No hay especialidades disponibles</h2>
              <p>Cuando se registren en el sistema, aparecerán aquí.</p>
            </div>
          ) : (
            <div className="specialty-grid">
              {specialties.map((specialty) => (
                <article className="specialty-card" key={specialty.id}>
                  <span className="specialty-card__icon" aria-hidden="true"><Stethoscope size={22} /></span>
                  <h2>{specialty.name}</h2>
                  {specialty.description && <p>{specialty.description}</p>}
                  <span className="specialty-card__count">
                    {doctorCounts[specialty.name] || 0} {doctorCounts[specialty.name] === 1 ? 'médico registrado' : 'médicos registrados'}
                  </span>
                  <Link to={`/medicos?especialidad=${encodeURIComponent(specialty.name)}`}>
                    Ver médicos <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
