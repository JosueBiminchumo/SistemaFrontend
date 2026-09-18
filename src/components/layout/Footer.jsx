import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <div className="app-footer-brand">
          <strong>MediTurno</strong>
          <p>Tu salud, a tu tiempo</p>
        </div>

        <div className="app-footer-contact">
          <p>📞 (01) 555-0000</p>
          <p>✉️ contacto@mediturno.com</p>
        </div>
      </div>

      <div className="app-footer-bottom">
        <p>© {new Date().getFullYear()} MediTurno. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;