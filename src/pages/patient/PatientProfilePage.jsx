import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMyPatientProfile, updateMyPatientProfile } from '../../services/patientService';
import './PatientProfilePage.css';

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getMyPatientProfile()
      .then((data) => {
        if (isMounted) {
          setProfile(data);
          setSavedProfile(data);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || 'No se pudo cargar tu perfil.');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const updatedProfile = await updateMyPatientProfile(profile);
      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      await Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tus datos se guardaron correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
      });
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setError('');
  };

  if (isLoading) {
    return (
      <main className="patient-profile-page">
        <section className="patient-profile-container profile-state">
          <p>Cargando tu perfil…</p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="patient-profile-page">
        <section className="patient-profile-container profile-state" role="alert">
          <h1>No se pudo cargar el perfil</h1>
          <p>{error || 'Inicia sesión como paciente e inténtalo nuevamente.'}</p>
          <button type="button" className="save-profile-button" onClick={() => navigate('/login')}>
            Ir a iniciar sesión
          </button>
        </section>
      </main>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`;

  return (
    <main className="patient-profile-page">
      <section className="patient-profile-container">
        <button type="button" className="back-profile-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="profile-header">
          <h1>Mi perfil</h1>
          <p>Consulta y actualiza tu información personal</p>
        </div>

        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <p className="profile-name">{fullName}</p>
            <p className="profile-role">Paciente</p>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Información personal</h2>

            {error && <p className="profile-error" role="alert">{error}</p>}

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="full-name">Nombre completo</label>
                <input id="full-name" type="text" value={fullName} readOnly />
              </div>

              <div className="profile-field">
                <label htmlFor="document-number">DNI</label>
                <input
                  id="document-number"
                  name="documentNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength="8"
                  pattern="[0-9]{8}"
                  value={profile.documentNumber || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="birth-date">Fecha de nacimiento</label>
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
                <label htmlFor="phone">Celular</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="9"
                  pattern="[0-9]{9}"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="email">Correo electrónico</label>
                <input id="email" type="email" value={profile.email || ''} readOnly />
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="save-profile-button" disabled={isSaving}>
                {isSaving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button type="button" className="cancel-profile-button" onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
