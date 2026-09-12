import { useState } from 'react';
import { getProfile, saveProfile } from './doctorStorage';
import DoctorLayout from './DoctorLayout';
import './DoctorProfilePage.css';

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(() => getProfile());
  const [form, setForm] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(form);
    saveProfile(form);
    setIsEditing(false);
    setFeedback('Perfil actualizado correctamente.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  return (
    <DoctorLayout>
      <div className="doctor-profile">
        <header className="doctor-profile__header">
          <h1>Mi perfil</h1>
          {!isEditing && (
            <button type="button" className="btn btn--primary" onClick={() => setIsEditing(true)}>
              Editar
            </button>
          )}
        </header>

        {feedback && <div className="doctor-profile__feedback">{feedback}</div>}

        {!isEditing ? (
          <div className="doctor-profile__card">
            <div className="doctor-profile__avatar">
              {profile.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </div>

            <div className="doctor-profile__info">
              <h2>{profile.name}</h2>
              <p className="doctor-profile__specialty">{profile.specialty}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p className="doctor-profile__bio">{profile.bio}</p>
            </div>
          </div>
        ) : (
          <form className="doctor-profile__form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input id="name" type="text" value={form.name} onChange={handleChange('name')} required />
            </div>
            <div className="form-group">
              <label htmlFor="specialty">Especialidad</label>
              <input id="specialty" type="text" value={form.specialty} onChange={handleChange('specialty')} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input id="email" type="email" value={form.email} onChange={handleChange('email')} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" type="tel" value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Biografía</label>
              <textarea id="bio" rows="3" value={form.bio} onChange={handleChange('bio')} />
            </div>
            <div className="doctor-profile__form-actions">
              <button type="button" className="btn btn--ghost" onClick={handleCancel}>Cancelar</button>
              <button type="submit" className="btn btn--primary">Guardar cambios</button>
            </div>
          </form>
        )}
      </div>
    </DoctorLayout>
  );
}