import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDoctors } from '../../services/doctorService';
import { listSpecialties } from '../../services/specialtyService';
import './PublicPages.css';

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listDoctors(), listSpecialties()])
      .then(([doctorItems, specialtyItems]) => {
        setDoctors(doctorItems.filter((doctor) => doctor.active));
        setSpecialties(specialtyItems.filter((item) => item.active));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const name = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      return (name.includes(normalizedSearch)
        || doctor.specialty.toLowerCase().includes(normalizedSearch))
        && (!specialty || doctor.specialty === specialty);
    });
  }, [doctors, search, specialty]);

  return (
    <main className="public-page">
      <section className="list-hero">
        <span className="eyebrow">Directorio público</span>
        <h1>Médicos disponibles en MediTurn</h1>
        <p>Consulta los médicos y especialidades registrados.</p>
      </section>

      <section className="filters-bar" aria-label="Filtros de médicos">
        <label className="field" htmlFor="doctor-search">
          <span>Buscar</span>
          <input
            id="doctor-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre o especialidad"
            type="search"
            value={search}
          />
        </label>

        <label className="field" htmlFor="specialty">
          <span>Especialidad</span>
          <select
            id="specialty"
            onChange={(event) => setSpecialty(event.target.value)}
            value={specialty}
          >
            <option value="">Todas</option>
            {specialties.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
      </section>

      {error && <p role="alert">{error}</p>}

      <section className="doctor-grid" aria-label="Resultados de médicos">
        {loading ? (
          <div className="empty-state"><p role="status">Cargando médicos...</p></div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty-state">
            <h2>No encontramos médicos</h2>
            <p>Prueba con otro nombre o selecciona todas las especialidades.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => {
            const name = `${doctor.firstName} ${doctor.lastName}`;
            return (
              <article className="doctor-card" key={doctor.id}>
                <div className="doctor-card__top">
                  <div className="avatar">{`${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase()}</div>
                  <div>
                    <h2>{name}</h2>
                    <span>{doctor.specialty}</span>
                  </div>
                </div>
                <dl className="doctor-details">
                  <div>
                    <dt>CMP</dt>
                    <dd>{doctor.licenseNumber}</dd>
                  </div>
                  <div>
                    <dt>Información</dt>
                    <dd>{doctor.biography || 'Sin biografía registrada'}</dd>
                  </div>
                </dl>
                <Link className="button button--outline button--full" to="/login">
                  Iniciar sesión para reservar
                </Link>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
