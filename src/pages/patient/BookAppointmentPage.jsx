import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createAppointment } from '../../services/appointmentService';
import { getDoctorSchedule, listDoctors } from '../../services/doctorService';
import { listSpecialties } from '../../services/specialtyService';
import './BookAppointmentPage.css';

const specialtyIcons = {
  Cardiología: '❤️',
  Dermatología: '✨',
  Neurología: '🧠',
  Pediatría: '👶',
  Traumatología: '🦴',
  'Medicina General': '🩺',
  Ginecología: '🛡️',
  Oftalmología: '👁️',
};

function getLocalDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export default function BookAppointmentPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);

  const specialty = specialties.find((item) => item.id === selectedSpecialty);
  const doctor = doctors.find((item) => item.id === selectedDoctor);
  const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : '';

  useEffect(() => {
    let active = true;

    listSpecialties()
      .then((items) => {
        if (active) {
          setSpecialties(items.filter((item) => item.active));
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingSpecialties(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) {
      return undefined;
    }

    let active = true;
    listDoctors({ specialtyId: selectedSpecialty })
      .then((items) => {
        if (active) {
          setDoctors(items);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingDoctors(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedSpecialty]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      return undefined;
    }

    let active = true;
    getDoctorSchedule(selectedDoctor, selectedDate)
      .then((schedules) => {
        if (active) {
          const slots = schedules.flatMap((schedule) =>
            schedule.availableSlots.map((slot) => slot.slice(0, 5))
          );
          setAvailableTimes([...new Set(slots)].sort());
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingTimes(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedDate, selectedDoctor, availabilityRefresh]);

  const handleSpecialtySelect = (specialtyId) => {
    setError('');
    setSelectedSpecialty(specialtyId);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setDoctors([]);
    setAvailableTimes([]);
    setIsLoadingDoctors(true);
  };

  const handleDoctorSelect = (doctorId) => {
    setError('');
    setSelectedDoctor(doctorId);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedSpecialty) {
        Swal.fire({
          title: 'Selecciona una especialidad',
          text: 'Debes seleccionar una especialidad para continuar.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
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
          confirmButtonText: 'Aceptar',
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
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
        });

        return;
      }

      if (!availableTimes.includes(selectedTime)) {
        Swal.fire({
          title: 'Horario no disponible',
          text: 'Ese horario ya no está disponible. Selecciona otro horario.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2563eb',
        });

        return;
      }

      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!reason.trim()) {
        Swal.fire({
          title: 'Ingresa el motivo',
          text: 'Debes indicar el motivo de la consulta.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
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
    if (!doctor || !availableTimes.includes(selectedTime)) {
      setError('El horario seleccionado ya no está disponible. Elige otro.');
      setCurrentStep(3);
      setSelectedTime('');
      setAvailabilityRefresh((current) => current + 1);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createAppointment({
        doctorId: doctor.id,
        startAt: `${selectedDate}T${selectedTime}:00`,
        reason: reason.trim(),
      });

      await Swal.fire({
        title: 'Cita reservada con éxito',
        text: `Tu cita con ${doctorName} quedó registrada para el ${selectedDate} a las ${selectedTime}.`,
        icon: 'success',
        confirmButtonText: 'Ver mis citas',
        confirmButtonColor: '#2563eb',
      });
      navigate('/paciente/mis-citas');
    } catch (requestError) {
      const message =
        requestError?.message || 'No se pudo reservar la cita. Intenta nuevamente.';
      setError(message);
      setSelectedTime('');
      setAvailabilityRefresh((current) => current + 1);
      await Swal.fire({
        title: 'No se pudo reservar la cita',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="book-appointment-page">
      <div className="book-container">
        <div className="book-header">
          <h1>Reservar cita</h1>
          <p>Sigue los pasos para agendar tu cita médica</p>
        </div>

        {error && <p role="alert">{error}</p>}

        <div className="steps-indicator">
          <div
            className={`step-item ${
              currentStep > 1
                ? 'completed'
                : currentStep === 1
                  ? 'active'
                  : ''
            }`}
          >
            <div
              className={`step-number ${
                currentStep > 1 ? 'check' : ''
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span>Especialidad</span>
          </div>

          <div
            className={`step-line ${
              currentStep > 1 ? 'active' : ''
            }`}
          ></div>

          <div
            className={`step-item ${
              currentStep === 2
                ? 'active'
                : currentStep > 2
                  ? 'completed'
                  : ''
            }`}
          >
            <div
              className={`step-number ${
                currentStep > 2 ? 'check' : ''
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span>Médico</span>
          </div>

          <div
            className={`step-line ${
              currentStep > 2 ? 'active' : ''
            }`}
          ></div>

          <div
            className={`step-item ${
              currentStep === 3
                ? 'active'
                : currentStep > 3
                  ? 'completed'
                  : ''
            }`}
          >
            <div
              className={`step-number ${
                currentStep > 3 ? 'check' : ''
              }`}
            >
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <span>Fecha y hora</span>
          </div>

          <div
            className={`step-line ${
              currentStep > 3 ? 'active' : ''
            }`}
          ></div>

          <div
            className={`step-item ${
              currentStep === 4
                ? 'active'
                : currentStep > 4
                  ? 'completed'
                  : ''
            }`}
          >
            <div
              className={`step-number ${
                currentStep > 4 ? 'check' : ''
              }`}
            >
              {currentStep > 4 ? '✓' : '4'}
            </div>
            <span>Motivo</span>
          </div>

          <div
            className={`step-line ${
              currentStep > 4 ? 'active' : ''
            }`}
          ></div>

          <div
            className={`step-item ${
              currentStep === 5 ? 'active' : ''
            }`}
          >
            <div className="step-number">5</div>
            <span>Confirmar</span>
          </div>
        </div>

        <section className="selection-section">
          {currentStep === 1 && (
            <>
              <h2>Selecciona una especialidad</h2>

              <div className="specialties-grid">
                {isLoadingSpecialties ? (
                  <p>Cargando especialidades...</p>
                ) : specialties.length === 0 ? (
                  <p>No hay especialidades activas disponibles.</p>
                ) : specialties.map((item) => (
                  <div
                    key={item.id}
                    className={`specialty-card ${
                      selectedSpecialty === item.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      handleSpecialtySelect(item.id)
                    }
                  >
                    <div className="specialty-icon-box">
                      {specialtyIcons[item.name] || '🩺'}
                    </div>

                    <div className="specialty-info">
                      <strong>{item.name}</strong>
                      <span>{item.description || 'Especialidad médica'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2>
                Selecciona un médico de{' '}
                {specialty?.name}
              </h2>

              <div className="doctors-list">
                {isLoadingDoctors ? (
                  <p>Cargando médicos...</p>
                ) : doctors.length === 0 ? (
                  <p>No hay médicos activos para esta especialidad.</p>
                ) : doctors.map((item) => (
                  <div
                    key={item.id}
                    className={`doctor-card ${
                      selectedDoctor === item.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      handleDoctorSelect(item.id)
                    }
                  >
                    <div className="doctor-info-left">
                      <div className="doctor-avatar">
                        {`${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase()}
                      </div>

                      <div>
                        <strong>{item.firstName} {item.lastName}</strong>
                        <span>{item.biography || `CMP ${item.licenseNumber}`}</span>
                      </div>
                    </div>

                    <div className="doctor-rating">
                      CMP {item.licenseNumber}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

            {currentStep === 3 && (
            <>
              <h2>Selecciona fecha y hora</h2>

              <div className="appointment-date-time">
                <div className="form-group">
                  <label htmlFor="appointment-date">
                    Fecha disponible <span>*</span>
                  </label>

                  <input
                    id="appointment-date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setSelectedTime('');
                      setAvailableTimes([]);
                      setError('');
                      setIsLoadingTimes(Boolean(event.target.value));
                    }}
                    min={getLocalDate()}
                  />
                </div>

                <div className="form-group">
                  <label>Horarios disponibles</label>

                  <div className="available-times">
                    {isLoadingTimes ? (
                      <p>Cargando horarios...</p>
                    ) : availableTimes.length === 0 ? (
                      <p>No hay horarios disponibles para esta fecha.</p>
                    ) : availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot ${
                          selectedTime === time ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2>Motivo de la consulta</h2>

              <div className="form-group">
                <label htmlFor="appointment-reason">
                  Describe brevemente el motivo
                </label>

                <textarea
                  id="appointment-reason"
                  rows="6"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
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
                    <strong>{doctorName}</strong>
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
                    <strong>
                      {reason.trim() ? reason : 'No especificado'}
                    </strong>
                  </div>
                </div>

                <div className="confirmation-notice">
                  <span>✓</span>

                  <p>
                    Al confirmar, acepto que la cita queda sujeta a
                    disponibilidad del médico seleccionado.
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="book-footer-actions">
          <button
            type="button"
            className="btn-anterior"
            onClick={handlePrevious}
          >
            &lt; Anterior
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              className={`btn-siguiente ${
                (
                  (currentStep === 1 && selectedSpecialty) ||
                  (currentStep === 2 && selectedDoctor) ||
                  (currentStep === 3 &&
                    selectedDate &&
                    selectedTime) ||
                  (currentStep === 4 && reason.trim())
                )
                  ? 'active'
                  : ''
              }`}
              onClick={handleNext}
            >
              Siguiente &gt;
            </button>
          ) : (
            <button
              type="button"
              className="btn-siguiente active"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar cita'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
