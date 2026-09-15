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

        <div className="patient-profile-header">
          <div className="profile-avatar">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>

          <div>
            <h1>Mi perfil</h1>
            <p>Administra tu información personal.</p>
          </div>
        </div>

        <form
          className="patient-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name">Nombres</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                value={profile.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last-name">Apellidos</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                value={profile.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="document">
                Documento de identidad
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

            <div className="form-group">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>

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

          <div className="form-group">
            <label htmlFor="address">Dirección</label>

            <input
              id="address"
              name="address"
              type="text"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="save-profile-button">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}