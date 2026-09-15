import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="card-img-top bg-light p-3"
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{doctor.name}</h5>
        <h6 className="card-subtitle mb-3 text-primary">{doctor.specialty}</h6>
        
        <p className="card-text mb-1">
          <small className="text-muted">Experiencia:</small> {doctor.experience}
        </p>
        <p className="card-text mb-2">
          <small className="text-muted">Calificación:</small> ⭐ {doctor.rating}
        </p>
        
        <p className="card-text mb-4">
          <span className={`badge ${doctor.availability ? 'bg-success' : 'bg-danger'}`}>
            {doctor.availability ? 'Disponible' : 'No disponible'}
          </span>
        </p>
        
        <button
          className="btn btn-outline-primary mt-auto w-100"
          onClick={() => navigate(`/paciente/medicos/${doctor.id}`)}
        >
          Ver Detalles y Reservar
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;