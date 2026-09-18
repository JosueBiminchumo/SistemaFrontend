import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './PatientProfilePage.css';

const initialProfile = {
  firstName: 'Juan',
  lastName: 'Pérez',
  document: '74567890',
  birthDate: '2000-05-15',
  phone: '987654321',
  email: 'juan.perez@email.com',
  address: 'Av. Los Álamos 123, Lima',
};

function getProfile() {
  const storedProfile = localStorage.getItem('patientProfile');

  if (storedProfile) {
    return JSON.parse(storedProfile);
  }

  localStorage.setItem(
    'patientProfile',
    JSON.stringify(initialProfile)
  );

  return initialProfile;
}

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      'patientProfile',
      JSON.stringify(profile)
    );

    Swal.fire({
      title: 'Perfil actualizado',
      text: 'Tus datos se guardaron correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb',
    });
  };

  const handleCancel = () => {
    setProfile(getProfile());
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <main className="patient-profile-page">
      <section className="patient-profile-container">
        <button
          type="button"
          className="back-profile-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="profile-header">
          <h1>Mi perfil</h1>
          <p>Gestiona tu información personal</p>
        </div>

        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">
              {initials}
            </div>

            <p className="profile-name">
              {fullName}
            </p>

            <p className="profile-role">
              Paciente
            </p>

            <button
              type="button"
              className="change-photo"
            >
              Cambiar foto
            </button>
          </div>

          <form
            className="form-card"
            onSubmit={handleSubmit}
          >
            <h2>Información personal</h2>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="full-name">
                  Nombre completo
                </label>

                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  readOnly
                />
              </div>

              <div className="profile-field">
                <label htmlFor="document">
                  DNI
                </label>

                <input
                  id="document"
                  name="document"
                  type="text"
                  value={profile.document}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="birth-date">
                  Fecha de nacimiento
                </label>

                <input
                  id="birth-date"
                  name="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="phone">
                  Teléfono
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="email">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="profile-divider" />

            <h2>Cambiar contraseña</h2>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="current-password">
                  Contraseña actual
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                />
              </div>

              <div className="profile-field">
                <label htmlFor="new-password">
                  Nueva contraseña
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="save-profile-button"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>

                Guardar cambios
              </button>

              <button
                type="button"
                className="cancel-profile-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}