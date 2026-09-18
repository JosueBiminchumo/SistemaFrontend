const initialPatients = [
  {
    id: 1,
    firstName: 'Ana',
    lastName: 'Paciente',
    document: '74567890',
    birthDate: '2000-05-15',
    phone: '987654321',
    email: 'paciente@mediturn.pe',
    address: 'Av. Los Álamos 123, Lima',
  },
  {
    id: 2,
    firstName: 'Carlos',
    lastName: 'Ramírez',
    document: '70876543',
    birthDate: '1998-08-20',
    phone: '986543210',
    email: 'carlos@mediturn.pe',
    address: 'Av. Brasil 456, Lima',
  },
];

const initialAppointments = [
  {
    id: 1,
    patientId: 1,
    doctor: 'Dr. Luis Medina',
    specialty: 'Cardiología',
    date: '2026-09-20',
    time: '10:00',
    reason: 'Control médico',
    status: 'confirmed',
  },
  {
    id: 2,
    patientId: 2,
    doctor: 'Dr. Luis Medina',
    specialty: 'Cardiología',
    date: '2026-09-20',
    time: '11:00',
    reason: 'Dolor en el pecho',
    status: 'pending',
  },
];

const initialNotifications = [];

function initializeLocalStorage() {
  if (!localStorage.getItem('patients')) {
    localStorage.setItem(
      'patients',
      JSON.stringify(initialPatients)
    );
  }

  if (!localStorage.getItem('appointments')) {
    localStorage.setItem(
      'appointments',
      JSON.stringify(initialAppointments)
    );
  }

  if (!localStorage.getItem('notifications')) {
    localStorage.setItem(
      'notifications',
      JSON.stringify(initialNotifications)
    );
  }
}

export { initializeLocalStorage };