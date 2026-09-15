import './PatientProfilePage.css';

export default function PatientProfilePage() {
  return (
    <main className="patient-profile-page">
      <section className="patient-profile-container">
        <div className="patient-profile-header">
          <div className="profile-avatar">
            JP
          </div>

          <div>
            <h1>Mi perfil</h1>
            <p>Administra tu información personal.</p>
          </div>
        </div>

        <form className="patient-profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name">Nombres</label>
              <input
                id="first-name"
                type="text"
                defaultValue="Juan"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last-name">Apellidos</label>
              <input
                id="last-name"
                type="text"
                defaultValue="Pérez"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="document">Documento de identidad</label>
              <input
                id="document"
                type="text"
                defaultValue="74567890"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth-date">Fecha de nacimiento</label>
              <input
                id="birth-date"
                type="date"
                defaultValue="2000-05-15"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                defaultValue="987654321"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                defaultValue="juan.perez@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              type="text"
              defaultValue="Av. Los Álamos 123, Lima"
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