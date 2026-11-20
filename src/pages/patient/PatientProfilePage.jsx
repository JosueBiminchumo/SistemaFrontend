import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPatientProfile, updatePatientProfile } from '../../services/patientService';
import './PatientProfilePage.css';

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getPatientProfile()
      .then((response) => {
        if (!isMounted) {
          return;
        }
        setProfile(response);
        setSavedProfile(response);
      })
      .catch((error) => {
        if (isMounted) {
          setLoadError(error.message || 'No se pudo cargar el perfil.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="patient-profile-page">
        <section className="patient-profile-container">
          <p role="status">Cargando perfil...</p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="patient-profile-page">
        <section className="patient-profile-container">
          <h1>Perfil no encontrado</h1>
          <p role="alert">{loadError || 'No se encontró la información del paciente actual.'}</p>
        </section>
      </main>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const profileToSave = await updatePatientProfile({
        documentNumber: profile.documentNumber.trim(),
        birthDate: profile.birthDate,
        phone: profile.phone.trim(),
      });

      setProfile(profileToSave);
      setSavedProfile(profileToSave);

      await Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tus datos se guardaron correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
    } catch (error) {
      await Swal.fire({
        title: 'No se pudo actualizar el perfil',
        text: error.message || 'Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleCancel = () => {
    setProfile(savedProfile);
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
                  name="documentNumber"
                  inputMode="numeric"
                  maxLength="8"
                  type="text"
                  value={profile.documentNumber || profile.document || ''}
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
                  value={profile.birthDate || ''}
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
                  inputMode="numeric"
                  maxLength="9"
                  type="tel"
                  value={profile.phone || ''}
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
                  value={profile.email || ''}
                  onChange={handleChange}
                  required
                  readOnly
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