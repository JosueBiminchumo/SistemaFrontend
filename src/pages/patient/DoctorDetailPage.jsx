import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsMock } from './doctorsMock';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(null);

  // Buscar el médico por el ID de la URL
  const doctor = doctorsMock.find(doc => doc.id === parseInt(id));

  // Si el usuario escribe un ID que no existe en la URL
  if (!doctor) {
    return (
      <div className="container py-5 text-center">
        <h2>Médico no encontrado</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/paciente/buscar')}>
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/paciente/buscar')}>
        &larr; Volver a la búsqueda
      </button>
      
      <div className="card shadow-sm border-0">
        <div className="row g-0">
          <div className="col-md-4 bg-light p-4 text-center">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="img-fluid rounded-circle mb-3 shadow"
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <h4 className="fw-bold">{doctor.name}</h4>
            <h6 className="text-primary">{doctor.specialty}</h6>
          </div>
          
          <div className="col-md-8 p-4 d-flex flex-column">
            <h5 className="mb-3 border-bottom pb-2">Información del Médico</h5>
            <p className="mb-1"><strong>Experiencia:</strong> {doctor.experience}</p>
            <p className="mb-1"><strong>Calificación:</strong> ⭐ {doctor.rating}</p>
            <p className="mb-4">
              <strong>Estado:</strong>{' '}
              <span className={`badge ${doctor.availability ? 'bg-success' : 'bg-danger'}`}>
                {doctor.availability ? 'Disponible para citas' : 'No disponible temporalmente'}
              </span>
            </p>

            <h5 className="mb-3 border-bottom pb-2">Horarios Disponibles</h5>
            {doctor.schedule && doctor.schedule.length > 0 ? (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {doctor.schedule.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn ${selectedTime === time ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-4">No hay horarios registrados para este médico.</p>
            )}

            <button 
              className="btn btn-success btn-lg mt-auto"
              disabled={!doctor.availability || doctor.schedule.length === 0 || !selectedTime}
              onClick={() => alert(`Horario seleccionado: ${selectedTime}. La lógica para reservar la cita se implementará en el siguiente ticket.`)}
            >
              {selectedTime ? `Continuar con la Reserva (${selectedTime})` : 'Selecciona un horario para continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
