import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './BookAppointmentPage.css';

const specialties = [
  {
    id: 'cardiologia',
    name: 'Cardiología',
    count: '2 médicos',
    icon: '❤️',
  },
  {
    id: 'dermatologia',
    name: 'Dermatología',
    count: '2 médicos',
    icon: '✨',
  },
  {
    id: 'neurologia',
    name: 'Neurología',
    count: '1 médico',
    icon: '🧠',
  },
  {
    id: 'pediatria',
    name: 'Pediatría',
    count: '2 médicos',
    icon: '👶',
  },
  {
    id: 'traumatologia',
    name: 'Traumatología',
    count: '1 médico',
    icon: '🦴',
  },
  {
    id: 'medicina-general',
    name: 'Medicina General',
    count: '3 médicos',
    icon: '🩺',
  },
  {
    id: 'ginecologia',
    name: 'Ginecología',
    count: '2 médicos',
    icon: '🛡️',
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmología',
    count: '1 médico',
    icon: '👁️',
  },
];

const doctorsBySpecialty = {
  cardiologia: [
    {
      id: 'carlos-mendoza',
      name: 'Dr. Carlos Mendoza Ríos',
      specialty: 'Cardiología',
      experience: '12 años de experiencia',
      rating: '4.9',
      initials: 'CM',
    },
    {
      id: 'maria-lopez',
      name: 'Dra. María López',
      specialty: 'Cardiología',
      experience: '9 años de experiencia',
      rating: '4.8',
      initials: 'ML',
    },
  ],

  dermatologia: [
    {
      id: 'ana-torres',
      name: 'Dra. Ana Torres Valdez',
      specialty: 'Dermatología',
      experience: '8 años de experiencia',
      rating: '4.7',
      initials: 'AT',
    },
    {
      id: 'luis-mendoza',
      name: 'Dr. Luis Mendoza',
      specialty: 'Dermatología',
      experience: '11 años de experiencia',
      rating: '4.8',
      initials: 'LM',
    },
  ],

  neurologia: [
    {
      id: 'carlos-ramirez',
      name: 'Dr. Carlos Ramírez',
      specialty: 'Neurología',
      experience: '10 años de experiencia',
      rating: '4.9',
      initials: 'CR',
    },
  ],

  pediatria: [
    {
      id: 'juan-torres',
      name: 'Dr. Juan Torres',
      specialty: 'Pediatría',
      experience: '9 años de experiencia',
      rating: '4.8',
      initials: 'JT',
    },
    {
      id: 'laura-castillo',
      name: 'Dra. Laura Castillo',
      specialty: 'Pediatría',
      experience: '7 años de experiencia',
      rating: '4.7',
      initials: 'LC',
    },
  ],

  traumatologia: [
    {
      id: 'miguel-herrera',
      name: 'Dr. Miguel Herrera',
      specialty: 'Traumatología',
      experience: '13 años de experiencia',
      rating: '4.9',
      initials: 'MH',
    },
  ],

  'medicina-general': [
    {
      id: 'carlos-garcia',
      name: 'Dr. Carlos García',
      specialty: 'Medicina General',
      experience: '10 años de experiencia',
      rating: '4.8',
      initials: 'CG',
    },
    {
      id: 'patricia-gomez',
      name: 'Dra. Patricia Gómez',
      specialty: 'Medicina General',
      experience: '8 años de experiencia',
      rating: '4.7',
      initials: 'PG',
    },
    {
      id: 'andres-flores',
      name: 'Dr. Andrés Flores',
      specialty: 'Medicina General',
      experience: '6 años de experiencia',
      rating: '4.6',
      initials: 'AF',
    },
  ],

  ginecologia: [
    {
      id: 'elena-vargas',
      name: 'Dra. Elena Vargas',
      specialty: 'Ginecología',
      experience: '11 años de experiencia',
      rating: '4.9',
      initials: 'EV',
    },
    {
      id: 'jorge-ruiz',
      name: 'Dr. Jorge Ruiz',
      specialty: 'Ginecología',
      experience: '8 años de experiencia',
      rating: '4.7',
      initials: 'JR',
    },
  ],

  oftalmologia: [
    {
      id: 'sofia-navarro',
      name: 'Dra. Sofía Navarro',
      specialty: 'Oftalmología',
      experience: '9 años de experiencia',
      rating: '4.8',
      initials: 'SN',
    },
  ],
};

const availableTimes = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

export default function BookAppointmentPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const specialty = specialties.find(
    (item) => item.id === selectedSpecialty
  );

  const doctors = selectedSpecialty
    ? doctorsBySpecialty[selectedSpecialty] || []
    : [];

  const doctor = doctors.find(
    (item) => item.id === selectedDoctor
  );

  const handleSpecialtySelect = (specialtyId) => {
    setSelectedSpecialty(specialtyId);
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
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

      const storedAppointments = JSON.parse(
        localStorage.getItem('appointments') || '[]'
      );

      const appointmentExists = storedAppointments.some(
        (appointment) =>
          appointment.doctor === doctor.name &&
          appointment.date === selectedDate &&
          appointment.time === selectedTime &&
          appointment.status !== 'cancelled'
      );

      if (appointmentExists) {
        Swal.fire({
          title: 'Horario no disponible',
          text: 'El médico ya tiene una cita registrada en ese horario. Selecciona otro horario.',
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

  const handleSubmit = () => {
    const storedAppointments = JSON.parse(
      localStorage.getItem('appointments') || '[]'
    );

    const appointmentExists = storedAppointments.some(
      (appointment) =>
        appointment.doctor === doctor.name &&
        appointment.date === selectedDate &&
        appointment.time === selectedTime &&
        appointment.status !== 'cancelled'
    );

    if (appointmentExists) {
      Swal.fire({
        title: 'Horario no disponible',
        text: 'El médico ya tiene una cita registrada en ese horario. Selecciona otro horario.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });

      setCurrentStep(3);
      return;
    }

  const currentUser = JSON.parse(
    localStorage.getItem('mediturn_user')
  );

  const newAppointment = {
    id: storedAppointments.length > 0
      ? Math.max(...storedAppointments.map((appointment) => appointment.id)) + 1
      : 1,
    patientId: currentUser.id,
    doctor: doctor.name,
    specialty: doctor.specialty,
    date: selectedDate,
    time: selectedTime,
    reason: reason.trim(),
    status: 'pending',
  };

    const updatedAppointments = [
      ...storedAppointments,
      newAppointment,
    ];

  localStorage.setItem(
    'appointments',
    JSON.stringify(updatedAppointments)
  );

  const storedNotifications = JSON.parse(
    localStorage.getItem('notifications') || '[]'
  );

  const newNotification = {
    id: `appointment-${newAppointment.id}`,
    appointmentId: newAppointment.id,
    patientId: currentUser.id,
    message: `Tu cita con ${doctor.name} fue reservada para el ${selectedDate} a las ${selectedTime}.`,
    date: selectedDate,
    time: selectedTime,
    read: false,
  };

  localStorage.setItem(
    'notifications',
    JSON.stringify([
      newNotification,
      ...storedNotifications,
    ])
  );

    Swal.fire({
      title: 'Cita reservada con éxito',
      html: `
        <div class="reservation-success">
          <p>Tu cita ha sido registrada correctamente.</p>

          <div class="reservation-details">
            <div>
              <span>Especialidad</span>
              <strong>${specialty?.name}</strong>
            </div>

            <div>
              <span>Médico</span>
              <strong>${doctor?.name}</strong>
            </div>

            <div>
              <span>Fecha</span>
              <strong>${selectedDate}</strong>
            </div>

            <div>
              <span>Hora</span>
              <strong>${selectedTime}</strong>
            </div>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Ver mis citas',
      confirmButtonColor: '#2563eb',
    }).then(() => {
      navigate('/paciente/mis-citas');
    });
  };

  return (
    <main className="book-appointment-page">
      <div className="book-container">
        <div className="book-header">
          <h1>Reservar cita</h1>
          <p>Sigue los pasos para agendar tu cita médica</p>
        </div>

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
                {specialties.map((item) => (
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
                      {item.icon}
                    </div>

                    <div className="specialty-info">
                      <strong>{item.name}</strong>
                      <span>{item.count}</span>
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
                {doctors.map((item) => (
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
                        {item.initials}
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.experience}</span>
                      </div>
                    </div>

                    <div className="doctor-rating">
                      ⭐ {item.rating}
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
                    }}
                    min={new Date()
                      .toISOString()
                      .split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Horarios disponibles</label>

                  <div className="available-times">
                    {availableTimes.map((time) => (
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
            >
              Confirmar cita
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
