import { getPatientsSummary } from './doctorStorage';
import DoctorLayout from './DoctorLayout';
import './DoctorPatientsPage.css';

export default function DoctorPatientsPage() {
  const patients = getPatientsSummary();

  return (
    <DoctorLayout>
      <div className="doctor-patients">
        <header className="doctor-patients__header">
          <h1>Pacientes</h1>
          <p className="doctor-patients__subtitle">Pacientes que has atendido, según tu historial de citas</p>
        </header>

        {patients.length === 0 ? (
          <p className="doctor-patients__empty">Aún no tienes pacientes registrados.</p>
        ) : (
          <ul className="patient-cards">
            {patients.map((patient) => (
              <li key={patient.name} className="patient-card">
                <div className="patient-card__avatar">
                  {patient.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                </div>
                <div className="patient-card__info">
                  <span className="patient-card__name">{patient.name}</span>
                  <span className="patient-card__meta">Última visita: {patient.lastDate}</span>
                </div>
                <div className="patient-card__total">
                  <span className="patient-card__total-value">{patient.total}</span>
                  <span className="patient-card__total-label">citas</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DoctorLayout>
  );
}