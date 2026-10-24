import { useEffect, useState } from 'react';
import { getProfile, saveBiography } from './doctorApi';
import DoctorLayout from './DoctorLayout';
import './DoctorProfilePage.css';

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alive = true;
    getProfile(true)
      .then((p) => {
        if (!alive) return;
        setProfile(p);
        setBio(p.bio ?? '');
      })
      .catch((err) => alive && setErrorMessage(err.message || 'No se pudo cargar tu perfil.'));
    return () => { alive = false; };
  }, []);

  if (!profile) {
    return (
      <DoctorLayout>
        <div className="doctor-profile">
          <p className="doctor-profile__subtitle">{errorMessage || 'Cargando perfil...'}</p>
        </div>
      </DoctorLayout>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      const updated = await saveBiography(bio.trim());
      setProfile((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      setFeedback('Perfil actualizado correctamente.');
      setTimeout(() => setFeedback(''), 2500);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(profile.bio ?? '');
    setErrorMessage('');
    setIsEditing(false);
  };

  const initials = profile.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <DoctorLayout>
      <div className="doctor-profile">
        <header className="doctor-profile__header">
          <div>
            <h1>Mi perfil</h1>
            <p className="doctor-profile__subtitle">Información visible para pacientes y administración</p>
          </div>

          {!isEditing && (
            <button type="button" className="btn btn--primary" onClick={() => setIsEditing(true)}>
              ✎ Editar biografía
            </button>
          )}
        </header>

        {feedback && <div className="doctor-profile__feedback">✓ {feedback}</div>}
        {errorMessage && <div className="doctor-profile__feedback" role="alert">{errorMessage}</div>}

        {!isEditing ? (
          <div className="doctor-profile__card">
            <div className="doctor-profile__banner" />

            <div className="doctor-profile__body">
              <div className="doctor-profile__avatar">{initials}</div>

              <h2 className="doctor-profile__name">{profile.name}</h2>
              <span className="doctor-profile__badge">{profile.specialty}</span>

              <div className="doctor-profile__details">
                <div className="detail-item">
                  <span className="detail-item__icon">✉</span>
                  <span>{profile.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-item__icon">🪪</span>
                  <span>Colegiatura: {profile.licenseNumber}</span>
                </div>
              </div>

              <p className="doctor-profile__bio">{profile.bio || 'Aún no has agregado una biografía.'}</p>
            </div>
          </div>
        ) : (
          <form className="doctor-profile__form" onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input id="name" type="text" value={profile.name} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="specialty">Especialidad</label>
                <input id="specialty" type="text" value={profile.specialty} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input id="email" type="email" value={profile.email} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="license">Colegiatura</label>
                <input id="license" type="text" value={profile.licenseNumber} disabled />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Biografía</label>
              <textarea id="bio" rows="4" maxLength={2000} value={bio} onChange={(e) => setBio(e.target.value)} />
              <small>Tu nombre, especialidad y colegiatura los administra el administrador del sistema.</small>
            </div>

            <div className="doctor-profile__form-actions">
              <button type="button" className="btn btn--ghost" onClick={handleCancel} disabled={saving}>Cancelar</button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DoctorLayout>
  );
}
