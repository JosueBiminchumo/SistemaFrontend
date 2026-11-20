import { useEffect, useMemo, useState } from 'react';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import DoctorCard from '../../components/doctors/DoctorCard';
import { listDoctors } from '../../services/doctorService';
import { listSpecialties } from '../../services/specialtyService';

const SearchDoctorsPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    specialty: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listDoctors(), listSpecialties()])
      .then(([doctorItems, specialtyItems]) => {
        setDoctors(doctorItems.filter((doctor) => doctor.active));
        setSpecialties(specialtyItems.filter((specialty) => specialty.active));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => doctors.filter((doctor) => {
    const name = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const matchName = name.includes(filters.name.trim().toLowerCase());
    const matchSpecialty = !filters.specialty || doctor.specialty === filters.specialty;
    return matchName && matchSpecialty;
  }), [doctors, filters]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Buscar Médicos</h2>
      {error && <p role="alert">{error}</p>}
      
      <DoctorFilters 
        filters={filters} 
        setFilters={setFilters} 
        specialties={specialties.map((specialty) => specialty.name)}
      />
      
      <div className="row g-4 mt-2">
        {loading ? (
          <div className="col-12"><p role="status">Cargando médicos...</p></div>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div className="col-12 col-md-6 col-lg-4" key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">No se encontraron médicos con esos criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDoctorsPage;