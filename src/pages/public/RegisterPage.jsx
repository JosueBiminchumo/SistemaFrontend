import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import './PublicPages.css';

export default function RegisterPage() {
  const handleRegister = (patient) => {
    const patients = JSON.parse(
      localStorage.getItem('patients') || '[]'
    );

    const newPatient = {
      ...patient,
      id:
        patients.length > 0
          ? Math.max(
              ...patients.map((currentPatient) => currentPatient.id)
            ) + 1
          : 1,
    };

    patients.push(newPatient);

    localStorage.setItem('patients', JSON.stringify(patients));
    localStorage.setItem(
      'mediturn_registered_patient',
      JSON.stringify(newPatient)
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="eyebrow">Registro de paciente</span>
          <h1>Crea una cuenta para solicitar citas</h1>
          <p>
            Completa tus datos personales para crear una cuenta de paciente.
          </p>
          <ul className="auth-list">
            <li>Campos obligatorios para datos personales.</li>
            <li>Validacion de DNI, celular, correo y contrasena.</li>
            <li>Confirmacion visual del registro.</li>
          </ul>
        </div>

        <div className="auth-card auth-card--wide">
          <h2>Crear cuenta</h2>
          <p className="auth-subtitle">Completa tus datos como paciente.</p>
          <RegisterForm onRegister={handleRegister} />
          <p className="auth-footer">
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </div>
      </section>
    </main>
  );
}