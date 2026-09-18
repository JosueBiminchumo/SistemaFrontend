import { useNavigate } from 'react-router-dom';

const PatientDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
        <div className="container-fluid py-4">
          <h1 className="display-5 fw-bold text-primary">Bienvenido a MediTurn</h1>
          <p className="col-md-8 fs-4 text-secondary mt-3">
            Desde tu panel puedes gestionar tus citas, revisar tu historial médico y buscar a los mejores especialistas para cuidar de tu salud.
          </p>
          <button 
            className="btn btn-primary btn-lg mt-4" 
            type="button"
            onClick={() => navigate('/paciente/buscar')}
          >
            Buscar Médicos y Reservar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;