import { useEffect, useState } from 'react';
import { listAppointments } from '../../services/appointmentService';
import DoctorLayout from './DoctorLayout';
import './DoctorPatientsPage.css';

function summarizePatients(appointments) {
  const patients = new Map();
  appointments.forEach((appointment) => {
    const patient = patients.get(appointment.patientId) ?? {
      id: appointment.patientId,
      name: appointment.patientName,
      total: 0,
      lastDate: '',
    };
    const date = appointment.startAt.slice(0, 10);
    patient.total += 1;
    if (date > patient.lastDate) patient.lastDate = date;
    patients.set(appointment.patientId, patient);
  });
  return [...patients.values()].sort((left, right) => right.lastDate.localeCompare(left.lastDate));
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAppointments()
      .then((appointments) => setPatients(summarizePatients(appointments)))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorLayout>
      <div className="doctor-patients">
        <header className="doctor-patients__header">
          <h1>Pacientes</h1>
          <p className="doctor-patients__subtitle">Pacientes vinculados a tus citas registradas</p>
        </header>

        {loading && <p role="status">Cargando pacientes...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && patients.length === 0 ? (
          <p className="doctor-patients__empty">Aún no tienes pacientes registrados.</p>
        ) : !loading && !error ? (
          <ul className="patient-cards">
            {patients.map((patient) => (
              <li key={patient.id} className="patient-card">
                <div className="patient-card__avatar">
                  {patient.name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()}
                </div>
                <div className="patient-card__info">
                  <span className="patient-card__name">{patient.name}</span>
                  <span className="patient-card__meta">Última cita: {patient.lastDate}</span>
                </div>
                <div className="patient-card__total">
                  <span className="patient-card__total-value">{patient.total}</span>
                  <span className="patient-card__total-label">citas</span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </DoctorLayout>
  );
}
