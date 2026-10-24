import { useState, useEffect } from 'react';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import DoctorCard from '../../components/doctors/DoctorCard';
import { getDoctors } from '../../services/doctorService';
import { getSpecialties } from '../../services/specialtyService';

const SearchDoctorsPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    specialty: '',
    availability: false,
  });

  // Nuevos estados para la API real
  const [doctors, setDoctors] = useState([]);
  const [specialtyNames, setSpecialtyNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Carga médicos y especialidades al mismo tiempo
        const [doctorsData, specialtiesData] = await Promise.all([
          getDoctors(),
          getSpecialties()
        ]);
        
        setDoctors(doctorsData);
        // Extrae solo los nombres de las especialidades para el filtro
        setSpecialtyNames(specialtiesData.map(s => s.name));
      } catch (err) {
        setError(err.message || 'Hubo un problema al cargar los médicos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lógica para filtrar la lista de médicos (ahora usa el estado 'doctors' en vez del mock)
  const filteredDoctors = doctors.filter(doctor => {
    const matchName = doctor.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchSpecialty = filters.specialty === '' || doctor.specialty === filters.specialty;
    const matchAvailability = !filters.availability || doctor.availability === true;
    
    return matchName && matchSpecialty && matchAvailability;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando médicos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Buscar Médicos</h2>
      
      {/* Componente de Filtros */}
      <DoctorFilters 
        filters={filters} 
        setFilters={setFilters} 
        specialties={specialtyNames} 
      />
      
      {/* Grilla de Tarjetas de Médicos */}
      <div className="row g-4 mt-2">
        {filteredDoctors.length > 0 ? (
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