import { useEffect, useState } from 'react';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';

import { getCurrentUser } from '../../services/authService';
import './AdminProfilePage.css';

const roleLabels = {
  ADMIN: 'Administrador',
  DOCTOR: 'Médico',
  PATIENT: 'Paciente',
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setProfile)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : '';
  const role = roleLabels[profile?.role] ?? profile?.role ?? '';

  return (
    <main className="admin-profile-page">
      <header className="admin-profile-page__header">
        <h1>Configuración</h1>
        <p>Información de la cuenta registrada en la base de datos</p>
      </header>

      {loading && <p role="status">Cargando información de la cuenta...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && profile && (
        <section className="admin-profile-grid">
          <aside className="admin-profile-summary">
            <div className="admin-profile-summary__avatar">{initials}</div>
            <h2>{profile.firstName} {profile.lastName}</h2>
            <span className="admin-profile-summary__role">{role}</span>

            <div className="admin-profile-summary__information">
              <div>
                <Mail size={17} />
                <span>{profile.email}</span>
              </div>
            </div>
          </aside>

          <div className="admin-profile-forms">
            <article className="admin-profile-card">
              <div className="admin-profile-card__heading">
                <div className="admin-profile-card__icon">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2>Información personal</h2>
                  <p>Datos de la cuenta autenticada</p>
                </div>
              </div>

              <div className="admin-profile-form-grid">
                <label>
                  Nombres
                  <input value={profile.firstName} readOnly />
                </label>
                <label>
                  Apellidos
                  <input value={profile.lastName} readOnly />
                </label>
                <label>
                  Correo electrónico
                  <input type="email" value={profile.email} readOnly />
                </label>
                <label>
                  Rol
                  <input value={role} readOnly />
                </label>
              </div>
            </article>

            <article className="admin-profile-card">
              <div className="admin-profile-card__heading">
                <div className="admin-profile-card__icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2>Seguridad</h2>
                  <p>La autenticación y los permisos se verifican en el servidor.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}
