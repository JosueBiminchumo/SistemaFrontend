import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search, ShieldCheck, Stethoscope } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDoctors } from '../../services/doctorService';
import { getSpecialties } from '../../services/specialtyService';
import './PublicPages.css';

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSpecialty = searchParams.get('especialidad');
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialtyNames, setSpecialtyNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;

    Promise.all([getDoctors(), getSpecialties()])
      .then(([doctorList, specialtyList]) => {
        if (!alive) return;
        setDoctors(doctorList);
        setSpecialtyNames(specialtyList.map((item) => item.name));
      })
      .catch((err) => alive && setLoadError(err.message || 'No se pudo cargar el directorio.'))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const specialties = useMemo(() => ['Todas', ...specialtyNames], [specialtyNames]);
  const specialty = specialties.includes(requestedSpecialty) ? requestedSpecialty : 'Todas';

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch);
      const matchesSpecialty = specialty === 'Todas' || doctor.specialty === specialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, search, specialty]);

  return (
    <main className="public-page doctors-page">
      <section className="doctors-hero">
        <div className="doctors-hero__content">
          <span className="doctors-kicker"><Stethoscope size={16} /> Directorio MediTurn</span>
          <h1>Encuentra al especialista que necesitas</h1>
          <p>Explora perfiles médicos y revisa información útil para elegir tu próxima consulta.</p>
        </div>
        <div className="doctors-hero__note">
          <span className="doctors-hero__icon"><Search size={20} /></span>
          <div><strong>Atención más sencilla</strong><small>Busca por nombre o especialidad</small></div>
        </div>
      </section>

      <section className="doctors-directory" aria-label="Directorio de médicos">
        <div className="doctors-directory__heading">
          <div>
            <span className="doctors-section-kicker">Directorio público</span>
            <h2>Médicos disponibles</h2>
          </div>
          <span className="doctors-count">{filteredDoctors.length} {filteredDoctors.length === 1 ? 'especialista' : 'especialistas'}</span>
        </div>

        <div className="doctors-filters" aria-label="Filtros de médicos">
          <label className="doctors-search" htmlFor="doctor-search">
            <Search aria-hidden="true" size={19} />
            <input
              id="doctor-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o especialidad"
              type="search"
              value={search}
            />
          </label>

          <label className="doctors-specialty" htmlFor="specialty">
            <span>Especialidad</span>
            <select
              id="specialty"
              onChange={(event) => {
                const nextSpecialty = event.target.value;
                setSearchParams(nextSpecialty === 'Todas' ? {} : { especialidad: nextSpecialty });
              }}
              value={specialty}
            >
              {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="doctors-grid" aria-label="Resultados de médicos">
          {loading ? (
            <div className="doctors-empty"><h3>Cargando médicos...</h3></div>
          ) : loadError ? (
            <div className="doctors-empty"><h3>{loadError}</h3></div>
          ) : filteredDoctors.length === 0 ? (
            <div className="doctors-empty">
              <span><Search size={22} /></span>
              <h3>No encontramos médicos</h3>
              <p>Prueba con otro nombre o selecciona todas las especialidades.</p>
              <button onClick={() => { setSearch(''); setSearchParams({}); }} type="button">Limpiar filtros</button>
            </div>
          ) : filteredDoctors.map((doctor) => (
            <article className="doctor-profile-card" key={doctor.id}>
              <div className="doctor-profile-card__top">
                <div className="doctor-profile-avatar">{doctor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              </div>
              <span className="doctor-specialty-tag">{doctor.specialty}</span>
              <h3>Dr. {doctor.name}</h3>
              <div className="doctor-profile-info">
                <span><ShieldCheck size={16} /> Colegiatura {doctor.licenseNumber}</span>
                {doctor.biography && <span>{doctor.biography.length > 90 ? `${doctor.biography.slice(0, 90)}...` : doctor.biography}</span>}
              </div>
              <Link className="doctor-profile-action" to="/login">
                Ver disponibilidad <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
        <p className="doctors-disclaimer">Inicia sesión como paciente para ver los horarios disponibles y reservar tu cita.</p>
      </section>
    </main>
  );
}
