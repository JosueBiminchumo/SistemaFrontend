import Input from './components/common/Input';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorSchedule from "./pages/doctor/DoctorSchedulePage";
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas del Paciente */}
        <Route path="/paciente/inicio" element={<PatientDashboard />} />

        {/* Rutas del Médico */}
        <Route path="/medico/agenda" element={<DoctorSchedule />} />

        {/* Rutas del Administrador */}
        <Route path="*" element={
          <div style={{ padding: '40px', maxWidth: '400px' }}>
            <h2>404 - Página no encontrada</h2>
            <Input
              label="Correo electrónico"
              name="email"
              placeholder="correo@ejemplo.com"
              required
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              error="Este campo es obligatorio"
            />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}