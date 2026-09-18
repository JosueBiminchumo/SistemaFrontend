import React, { useState } from 'react';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import DoctorCard from '../../components/doctors/DoctorCard';
import { doctorsMock } from './doctorsMock';

const SearchDoctorsPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    specialty: '',
    availability: false,
  });

  // Extraer las especialidades únicas para el menú desplegable
  const specialties = [...new Set(doctorsMock.map(doc => doc.specialty))];

  // Lógica para filtrar la lista de médicos
  const filteredDoctors = doctorsMock.filter(doctor => {
    const matchName = doctor.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchSpecialty = filters.specialty === '' || doctor.specialty === filters.specialty;
    const matchAvailability = !filters.availability || doctor.availability === true;
    
    return matchName && matchSpecialty && matchAvailability;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">Buscar Médicos</h2>
      
      {/* Componente de Filtros */}
      <DoctorFilters 
        filters={filters} 
        setFilters={setFilters} 
        specialties={specialties} 
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