import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/authService';
import { listDoctors } from '../../services/doctorService';
import DoctorLayout from './DoctorLayout';
import './DoctorProfilePage.css';

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentUser(), listDoctors()])
      .then(([user, doctors]) => {
        const doctor = doctors.find((item) => item.userId === user.id);
        if (!doctor) {
          throw new Error('No existe un perfil médico asociado a esta cuenta.');
        }
        setProfile({
          name: `${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialty,
          email: user.email,
          biography: doctor.biography,
          licenseNumber: doctor.licenseNumber,
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const initials = profile
    ? profile.name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()
    : '';

  return (
    <DoctorLayout>
      <div className="doctor-profile">
        <header className="doctor-profile__header">
          <div>
            <h1>Mi perfil</h1>
            <p className="doctor-profile__subtitle">Información registrada en el sistema</p>
          </div>
        </header>

        {loading && <p role="status">Cargando perfil...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && profile && (
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
                  <span className="detail-item__icon">▣</span>
                  <span>CMP {profile.licenseNumber}</span>
                </div>
              </div>
              <p className="doctor-profile__bio">
                {profile.biography || 'No hay una biografía registrada.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
