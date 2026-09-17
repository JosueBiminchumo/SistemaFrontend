import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorAppointmentDetailPage from './pages/doctor/DoctorAppointmentDetailPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage'; 
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
        <Route path="/medico/agenda" element={<DoctorSchedulePage />} />
        <Route path="/medico/citas" element={<DoctorAppointmentsPage />} />
         <Route path="/medico/citas/:id" element={<DoctorAppointmentDetailPage />} /> 
         <Route path="/medico/perfil" element={<DoctorProfilePage />} />
         <Route path="/medico/dashboard" element={<DoctorDashboardPage />} />

        {/* Rutas del Administrador */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}