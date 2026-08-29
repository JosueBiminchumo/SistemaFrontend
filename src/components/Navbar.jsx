import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '15px', backgroundColor: '#e2e8f0', display: 'flex', gap: '20px' }}>
      <strong style={{ marginRight: 'auto' }}>MediTurno</strong>
      
      <Link to="/login">Login</Link>
      <Link to="/paciente/inicio">Paciente</Link>
      <Link to="/medico/agenda">Médico</Link>
      <Link to="/admin/dashboard">Admin</Link>
    </nav>
  );
}