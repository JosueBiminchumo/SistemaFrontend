import { useState } from 'react';
import {
  Camera,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  UserRound,
} from 'lucide-react';

import './AdminProfilePage.css';

const initialProfile = {
  names: 'Admin',
  lastNames: 'MediTurno',
  email: 'admin@mediturno.pe',
  phone: '987654321',
};

const initialPasswords = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState(initialPasswords);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));

    setProfileMessage('');
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((currentPasswords) => ({
      ...currentPasswords,
      [name]: value,
    }));

    setPasswordMessage('');
    setPasswordError('');
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const requiredValues = [
      profile.names,
      profile.lastNames,
      profile.email,
      profile.phone,
    ];

    if (requiredValues.some((value) => !value.trim())) {
      setProfileMessage(
        'Todos los campos de información personal son obligatorios.',
      );
      return;
    }

    setProfileMessage('Información personal actualizada correctamente.');
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPasswordError('Completa todos los campos de contraseña.');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError(
        'La nueva contraseña debe tener al menos 8 caracteres.',
      );
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Las nuevas contraseñas no coinciden.');
      return;
    }

    setPasswords(initialPasswords);
    setPasswordError('');
    setPasswordMessage('Contraseña actualizada correctamente.');
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((currentVisibility) => ({
      ...currentVisibility,
      [field]: !currentVisibility[field],
    }));
  };

  return (
    <main className="admin-profile-page">
      <header className="admin-profile-page__header">
        <h1>Configuración</h1>
        <p>Administra la información y seguridad de tu cuenta</p>
      </header>

      <section className="admin-profile-grid">
        <aside className="admin-profile-summary">
          <div className="admin-profile-summary__avatar">
            AM

            <button
              type="button"
              aria-label="Cambiar fotografía"
              title="Cambiar fotografía"
            >
              <Camera size={16} />
            </button>
          </div>

          <h2>
            {profile.names} {profile.lastNames}
          </h2>

          <span className="admin-profile-summary__role">
            Administrador
          </span>

          <div className="admin-profile-summary__information">
            <div>
              <Mail size={17} />
              <span>{profile.email}</span>
            </div>

            <div>
              <Phone size={17} />
              <span>{profile.phone}</span>
            </div>
          </div>

          <p>
            La fotografía de perfil se habilitará cuando el sistema se
            conecte con el backend.
          </p>
        </aside>

        <div className="admin-profile-forms">
          <form
            className="admin-profile-card"
            onSubmit={handleProfileSubmit}
          >
            <div className="admin-profile-card__heading">
              <div className="admin-profile-card__icon">
                <UserRound size={20} />
              </div>

              <div>
                <h2>Información personal</h2>
                <p>Actualiza los datos principales de tu cuenta</p>
              </div>
            </div>

            <div className="admin-profile-form-grid">
              <label>
                Nombres
                <input
                  type="text"
                  name="names"
                  value={profile.names}
                  onChange={handleProfileChange}
                  maxLength={60}
                />
              </label>

              <label>
                Apellidos
                <input
                  type="text"
                  name="lastNames"
                  value={profile.lastNames}
                  onChange={handleProfileChange}
                  maxLength={60}
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  maxLength={120}
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  maxLength={15}
                />
              </label>
            </div>

            {profileMessage && (
              <p className="admin-profile-message">
                {profileMessage}
              </p>
            )}

            <footer className="admin-profile-card__footer">
              <button type="submit">
                <Save size={17} />
                Guardar cambios
              </button>
            </footer>
          </form>

          <form
            className="admin-profile-card"
            onSubmit={handlePasswordSubmit}
          >
            <div className="admin-profile-card__heading">
              <div className="admin-profile-card__icon">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h2>Seguridad</h2>
                <p>Actualiza la contraseña de acceso</p>
              </div>
            </div>

            <div className="admin-password-fields">
              <label>
                Contraseña actual

                <div className="admin-password-input">
                  <input
                    type={
                      visiblePasswords.currentPassword
                        ? 'text'
                        : 'password'
                    }
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility('currentPassword')
                    }
                    aria-label="Mostrar u ocultar contraseña actual"
                  >
                    {visiblePasswords.currentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                Nueva contraseña

                <div className="admin-password-input">
                  <input
                    type={
                      visiblePasswords.newPassword
                        ? 'text'
                        : 'password'
                    }
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility('newPassword')
                    }
                    aria-label="Mostrar u ocultar nueva contraseña"
                  >
                    {visiblePasswords.newPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                Confirmar nueva contraseña

                <div className="admin-password-input">
                  <input
                    type={
                      visiblePasswords.confirmPassword
                        ? 'text'
                        : 'password'
                    }
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility('confirmPassword')
                    }
                    aria-label="Mostrar u ocultar confirmación"
                  >
                    {visiblePasswords.confirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>
            </div>

            {passwordError && (
              <p className="admin-profile-error">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className="admin-profile-message">
                {passwordMessage}
              </p>
            )}

            <footer className="admin-profile-card__footer">
              <button type="submit">
                <LockKeyhole size={17} />
                Actualizar contraseña
              </button>
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}