import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getSpecialties } from '../../services/specialtyService';
import { getDoctors, getDoctorSlots } from '../../services/doctorService';
import { createAppointment } from '../../services/appointmentService';
import './BookAppointmentPage.css';

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Estados para los datos de la API
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  // Si venimos del perfil del médico (con navigate + state)
  useEffect(() => {
    const state = location.state;
    if (state?.doctorId && state?.date && state?.time) {
      setSelectedSpecialty(state.specialtyId);
      setSelectedDoctor(state.doctorId);
      setSelectedDate(state.date);
      setSelectedTime(state.time);
      setCurrentStep(4); // Saltamos directamente al paso 4 (Motivo)
    }
  }, [location.state]);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    getSpecialties().then(setSpecialties).catch(console.error);
  }, []);

  // Cargar médicos cuando se selecciona una especialidad
  useEffect(() => {
    if (selectedSpecialty) {
      getDoctors({ specialtyId: selectedSpecialty }).then(setDoctors).catch(console.error);
    } else {
      setDoctors([]);
    }
  }, [selectedSpecialty]);

  // Cargar horarios cuando se selecciona un médico y una fecha
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      getDoctorSlots(selectedDoctor, selectedDate).then(setSlots).catch(console.error);
    } else {
      setSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const specialty = specialties.find((item) => item.id === selectedSpecialty);
  const doctor = doctors.find((item) => item.id === selectedDoctor);

  const handleSpecialtySelect = (specialtyId) => {
    setSelectedSpecialty(specialtyId);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedSpecialty) {
        Swal.fire({
          title: 'Selecciona una especialidad',
          text: 'Debes seleccionar una especialidad para continuar.',
          icon: 'warning',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedDoctor) {
        Swal.fire({
          title: 'Selecciona un médico',
          text: 'Debes seleccionar un médico para continuar.',
          icon: 'warning',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!selectedDate || !selectedTime) {
        Swal.fire({
          title: 'Completa la fecha y hora',
          text: 'Debes seleccionar una fecha y un horario.',
          icon: 'warning',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
      // NOTA: Se eliminó la validación manual de choques de horario. El backend se encargará de esto.
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!reason.trim()) {
        Swal.fire({
          title: 'Ingresa el motivo',
          text: 'Debes indicar el motivo de la consulta.',
          icon: 'warning',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
      setCurrentStep(5);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 1) {
      navigate('/paciente');
      return;
    }
    setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    try {
      // Llamada real a la API para crear la cita
      const created = await createAppointment({
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
      });

      // Mantenemos las notificaciones locales (ya que el backend no las maneja por ahora)
      const currentUser = JSON.parse(localStorage.getItem('mediturn_user'));
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      const newNotification = {
        id: `appointment-${created.id}`,
        appointmentId: created.id,
        patientId: currentUser.id,
        message: `Tu cita con ${doctor.name} fue reservada para el ${selectedDate} a las ${selectedTime}.`,
        date: selectedDate,
        time: selectedTime,
        read: false,
      };

      localStorage.setItem('notifications', JSON.stringify([newNotification, ...storedNotifications]));

      Swal.fire({
        title: 'Cita reservada con éxito',
        html: `
          <div class="reservation-success">
            <p>Tu cita ha sido registrada correctamente.</p>
            <div class="reservation-details">
              <div><span>Especialidad</span><strong>${specialty?.name}</strong></div>
              <div><span>Médico</span><strong>${doctor?.name}</strong></div>
              <div><span>Fecha</span><strong>${selectedDate}</strong></div>
              <div><span>Hora</span><strong>${selectedTime}</strong></div>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Ver mis citas',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/paciente/mis-citas');
      });

    } catch (error) {
      // Si la API devuelve error 409 (horario ocupado) u otro problema
      Swal.fire({
        title: 'No se pudo reservar',
        text: error.message || 'El médico ya tiene una cita en ese horario o hubo un problema. Por favor intenta con otro horario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
      setCurrentStep(3); // Regresa al paso de elegir horario
    }
  };

  return (
    <main className="book-appointment-page">
      <div className="book-container">
        <div className="book-header">
          <h1>Reservar cita</h1>
          <p>Sigue los pasos para agendar tu cita médica</p>
        </div>

        <div className="steps-indicator">
          {/* ... (Todo el bloque de steps-indicator se mantiene exactamente igual para no romper los estilos CSS) ... */}
          <div className={`step-item ${currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : ''}`}>
            <div className={`step-number ${currentStep > 1 ? 'check' : ''}`}>{currentStep > 1 ? '✓' : '1'}</div>
            <span>Especialidad</span>
          </div>
          <div className={`step-line ${currentStep > 1 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <div className={`step-number ${currentStep > 2 ? 'check' : ''}`}>{currentStep > 2 ? '✓' : '2'}</div>
            <span>Médico</span>
          </div>
          <div className={`step-line ${currentStep > 2 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
            <div className={`step-number ${currentStep > 3 ? 'check' : ''}`}>{currentStep > 3 ? '✓' : '3'}</div>
            <span>Fecha y hora</span>
          </div>
          <div className={`step-line ${currentStep > 3 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}>
            <div className={`step-number ${currentStep > 4 ? 'check' : ''}`}>{currentStep > 4 ? '✓' : '4'}</div>
            <span>Motivo</span>
          </div>
          <div className={`step-line ${currentStep > 4 ? 'active' : ''}`}></div>

          <div className={`step-item ${currentStep === 5 ? 'active' : ''}`}>
            <div className="step-number">5</div>
            <span>Confirmar</span>
          </div>
        </div>

        <section className="selection-section">
          {currentStep === 1 && (
            <>
              <h2>Selecciona una especialidad</h2>
              <div className="specialties-grid">
                {specialties.map((item) => (
                  <div
                    key={item.id}
                    className={`specialty-card ${selectedSpecialty === item.id ? 'selected' : ''}`}
                    onClick={() => handleSpecialtySelect(item.id)}
                  >
                    <div className="specialty-icon-box">
                      {item.icon || '⚕️'}
                    </div>
                    <div className="specialty-info">
                      <strong>{item.name}</strong>
                      {item.count && <span>{item.count}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2>Selecciona un médico de {specialty?.name}</h2>
              <div className="doctors-list">
                {doctors.length > 0 ? doctors.map((item) => (
                  <div
                    key={item.id}
                    className={`doctor-card ${selectedDoctor === item.id ? 'selected' : ''}`}
                    onClick={() => handleDoctorSelect(item.id)}
                  >
                    <div className="doctor-info-left">
                      <div className="doctor-avatar">
                        <img src={item.image} alt={item.name} style={{width:'100%', borderRadius:'50%'}}/>
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        {item.experience && <span>{item.experience}</span>}
                      </div>
                    </div>
                    {item.rating && (
                      <div className="doctor-rating">⭐ {item.rating}</div>
                    )}
                  </div>
                )) : (
                  <p className="text-muted mt-3">No hay médicos registrados en esta especialidad.</p>
                )}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2>Selecciona fecha y hora</h2>
              <div className="appointment-date-time">
                <div className="form-group">
                  <label htmlFor="appointment-date">Fecha disponible <span>*</span></label>
                  <input
                    id="appointment-date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setSelectedTime('');
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Horarios disponibles</label>
                  {selectedDate ? (
                    <div className="available-times">
                      {slots.length > 0 ? slots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(slot.time)}
                          style={{ opacity: slot.available ? 1 : 0.5 }}
                        >
                          {slot.time}
                        </button>
                      )) : (
                        <p className="text-muted">No hay horarios registrados para esta fecha.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted mt-2">Selecciona una fecha primero.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2>Motivo de la consulta</h2>
              <div className="form-group">
                <label htmlFor="appointment-reason">Describe brevemente el motivo</label>
                <textarea
                  id="appointment-reason"
                  rows="6"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Describe brevemente el motivo de tu consulta"
                />
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <h2>Confirma tu cita</h2>
              <div className="appointment-confirmation">
                <div className="confirmation-header">
                  <div className="confirmation-icon">📋</div>
                  <div>
                    <h3>Resumen de tu cita</h3>
                    <p>Revisa los datos antes de confirmar</p>
                  </div>
                </div>

                <div className="confirmation-details">
                  <div className="confirmation-item">
                    <span>Especialidad</span>
                    <strong>{specialty?.name}</strong>
                  </div>
                  <div className="confirmation-item">
                    <span>Médico</span>
                    <strong>{doctor?.name}</strong>
                  </div>
                  <div className="confirmation-item">
                    <span>Fecha</span>
                    <strong>{selectedDate}</strong>
                  </div>
                  <div className="confirmation-item">
                    <span>Hora</span>
                    <strong>{selectedTime}</strong>
                  </div>
                  <div className="confirmation-item confirmation-reason">
                    <span>Motivo de la consulta</span>
                    <strong>{reason.trim() ? reason : 'No especificado'}</strong>
                  </div>
                </div>

                <div className="confirmation-notice">
                  <span>✓</span>
                  <p>Al confirmar, acepto que la cita queda sujeta a disponibilidad del médico seleccionado.</p>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="book-footer-actions">
          <button type="button" className="btn-anterior" onClick={handlePrevious}>
            &lt; Anterior
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              className={`btn-siguiente ${
                (currentStep === 1 && selectedSpecialty) ||
                (currentStep === 2 && selectedDoctor) ||
                (currentStep === 3 && selectedDate && selectedTime) ||
                (currentStep === 4 && reason.trim())
                  ? 'active'
                  : ''
              }`}
              onClick={handleNext}
            >
              Siguiente &gt;
            </button>
          ) : (
            <button type="button" className="btn-siguiente active" onClick={handleSubmit}>
              Confirmar cita
            </button>
          )}
        </div>
      </div>
    </main>
  );
}