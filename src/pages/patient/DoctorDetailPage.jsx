import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, getDoctorSlots } from '../../services/doctorService';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Cargar el médico por el ID de la URL usando la API real
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError('No se pudo cargar la información del médico.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // 2. Cargar los horarios disponibles cada vez que el usuario cambie la fecha
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return; // No buscar si no hay fecha seleccionada
      
      try {
        setSelectedTime(null); // Limpiar la hora si cambia de día
        const slotsData = await getDoctorSlots(id, date);
        setSlots(slotsData);
      } catch (err) {
        console.error('Error al cargar horarios:', err);
        setSlots([]);
      }
    };
    fetchSlots();
  }, [id, date]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Pantalla de error o médico no encontrado
  if (error || !doctor) {
    return (
      <div className="container py-5 text-center">
        <h2>{error || 'Médico no encontrado'}</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/paciente/buscar')}>
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  // Filtrar para mostrar solo los horarios que la API marque como "available: true"
  const availableSlots = slots.filter(slot => slot.available);

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
            
            {/* Ocultamos experiencia y calificación si el backend devuelve null */}
            {doctor.experience && <p className="mb-1"><strong>Experiencia:</strong> {doctor.experience}</p>}
            {doctor.rating && <p className="mb-1"><strong>Calificación:</strong> ⭐ {doctor.rating}</p>}
            
            <p className="mb-4 mt-2">
              <strong>Estado:</strong>{' '}
              <span className={`badge ${doctor.availability ? 'bg-success' : 'bg-danger'}`}>
                {doctor.availability ? 'Disponible para citas' : 'No disponible temporalmente'}
              </span>
            </p>

            <h5 className="mb-3 border-bottom pb-2">Seleccionar Fecha y Horario</h5>
            
            {/* Nuevo Input de Fecha */}
            <div className="mb-4" style={{ maxWidth: '250px' }}>
              <label className="form-label text-muted small">Fecha de la cita:</label>
              <input 
                type="date" 
                className="form-control" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // No permite fechas pasadas
              />
            </div>

            {/* Lista de Horarios */}
            {date ? (
              availableSlots.length > 0 ? (
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`btn ${selectedTime === slot.time ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-4">No hay horarios disponibles para esta fecha.</p>
              )
            ) : (
              <p className="text-muted mb-4">Por favor selecciona una fecha para ver los horarios.</p>
            )}

            {/* Botón de Reserva conectado al state (Navegación) */}
            <button 
              className="btn btn-success btn-lg mt-auto"
              disabled={!doctor.availability || !selectedTime || !date}
              onClick={() => navigate('/paciente/reservar-cita', { 
                state: { 
                  doctorId: doctor.id, 
                  specialtyId: doctor.specialtyId, 
                  date: date, 
                  time: selectedTime 
                } 
              })}
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