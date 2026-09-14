import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboardPage';
import DoctorSchedule from "./pages/doctor/DoctorSchedulePage";
import DoctorAppointments from './pages/doctor/DoctorAppointmentsPage';
import DoctorAppointmentDetail from './pages/doctor/DoctorAppointmentDetailPage';
import DoctorProfile from './pages/doctor/DoctorProfilePage';
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
        <Route path="/medico/dashboard" element={<DoctorDashboard />} />
        <Route path="/medico/agenda" element={<DoctorSchedule />} />
        <Route path="/medico/citas" element={<DoctorAppointments />} />
        <Route path="/medico/citas/:id" element={<DoctorAppointmentDetail />} />
        <Route path="/medico/perfil" element={<DoctorProfile />} />

        {/* Rutas del Administrador */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}