import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoctor } from '../../services/doctorService';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctor(id)
      .then(setDoctor)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="container py-5"><p role="status">Cargando médico...</p></main>;
  }

  if (error || !doctor) {
    return (
      <main className="container py-5 text-center">
        <h2>Médico no encontrado</h2>
        {error && <p role="alert">{error}</p>}
        <button className="btn btn-primary mt-3" onClick={() => navigate('/paciente/buscar')}>
          Volver a la búsqueda
        </button>
      </main>
    );
  }

  const name = `${doctor.firstName} ${doctor.lastName}`;

  return (
    <main className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/paciente/buscar')}>
        &larr; Volver a la búsqueda
      </button>

      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-circle bg-primary-subtle text-primary fw-bold fs-3 p-4" aria-hidden="true">
              {`${doctor.firstName?.[0] ?? ''}${doctor.lastName?.[0] ?? ''}`.toUpperCase()}
            </div>
            <div>
              <h1 className="h3 mb-1">{name}</h1>
              <p className="text-primary mb-0">{doctor.specialty}</p>
            </div>
          </div>

          <h2 className="h5">Información del médico</h2>
          <p><strong>CMP:</strong> {doctor.licenseNumber}</p>
          <p><strong>Estado:</strong> {doctor.active ? 'Activo' : 'Inactivo'}</p>
          <p>{doctor.biography || 'No hay una biografía registrada.'}</p>

          <button
            className="btn btn-success btn-lg mt-3"
            disabled={!doctor.active}
            onClick={() => navigate('/paciente/reservar-cita')}
          >
            Reservar una cita
          </button>
        </div>
      </section>
    </main>
  );
};

export default DoctorDetailPage;
