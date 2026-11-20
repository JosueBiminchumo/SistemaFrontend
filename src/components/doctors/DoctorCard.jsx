import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const name = `${doctor.firstName} ${doctor.lastName}`;

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <div
          className="doctor-avatar mb-3"
          aria-hidden="true"
          style={{
            display: 'grid',
            width: 72,
            height: 72,
            placeItems: 'center',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {`${doctor.firstName?.[0] ?? ''}${doctor.lastName?.[0] ?? ''}`.toUpperCase()}
        </div>
        <h5 className="card-title fw-bold">{name}</h5>
        <h6 className="card-subtitle mb-3 text-primary">{doctor.specialty}</h6>
        <p className="card-text mb-2">{doctor.biography || `CMP ${doctor.licenseNumber}`}</p>
        <p className="card-text mb-4">
          <span className={`badge ${doctor.active ? 'bg-success' : 'bg-secondary'}`}>
            {doctor.active ? 'Activo' : 'Inactivo'}
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