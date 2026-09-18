import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

const doctors = [
  {
    id: 1,
    name: 'Luis Medina',
    specialty: 'Cardiologia',
    location: 'Consultorio 201',
    nextSlot: 'Hoy 10:30',
    rating: '4.9',
  },
  {
    id: 2,
    name: 'Camila Rojas',
    specialty: 'Pediatria',
    location: 'Consultorio 105',
    nextSlot: 'Manana 09:00',
    rating: '4.8',
  },
  {
    id: 3,
    name: 'Marco Salazar',
    specialty: 'Dermatologia',
    location: 'Consultorio 304',
    nextSlot: 'Viernes 15:30',
    rating: '4.7',
  },
  {
    id: 4,
    name: 'Valeria Paredes',
    specialty: 'Medicina general',
    location: 'Consultorio 102',
    nextSlot: 'Hoy 16:00',
    rating: '4.9',
  },
];

const specialties = ['Todas', ...new Set(doctors.map((doctor) => doctor.specialty))];

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas');

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch);
      const matchesSpecialty = specialty === 'Todas' || doctor.specialty === specialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [search, specialty]);

  return (
    <main className="public-page">
      <section className="list-hero">
        <span className="eyebrow">Directorio publico</span>
        <h1>Medicos disponibles en MediTurn</h1>
        <p>
          Consulta especialistas y disponibilidad referencial antes de iniciar sesion
          o crear una cuenta de paciente.
        </p>
      </section>

      <section className="filters-bar" aria-label="Filtros de medicos">
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
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="doctor-grid" aria-label="Resultados de medicos">
        {filteredDoctors.length === 0 ? (
          <div className="empty-state">
            <h2>No encontramos medicos</h2>
            <p>Prueba con otro nombre o selecciona todas las especialidades.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <article
              className={`doctor-card ${doctor.id === 1 ? 'doctor-card--wide' : ''}`}
              key={doctor.id}
            >
              <div className="doctor-card__top">
                <div className="avatar">{doctor.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h2>Dr. {doctor.name}</h2>
                  <span>{doctor.specialty}</span>
                </div>
              </div>
              <dl className="doctor-details">
                <div>
                  <dt>Ubicacion</dt>
                  <dd>{doctor.location}</dd>
                </div>
                <div>
                  <dt>Proximo horario</dt>
                  <dd>{doctor.nextSlot}</dd>
                </div>
                <div>
                  <dt>Valoracion</dt>
                  <dd>{doctor.rating}</dd>
                </div>
              </dl>
              <Link className="button button--outline button--full" to="/login">
                Iniciar sesion para reservar
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
