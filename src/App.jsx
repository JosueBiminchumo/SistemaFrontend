import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorSchedule from "./pages/doctor/DoctorSchedulePage";
import AdminDashboard from './pages/admin/AdminDashboard';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import AppointmentDetailPage from './pages/patient/AppointmentDetailPage';
import RescheduleAppointmentPage from './pages/patient/RescheduleAppointmentPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';

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
        <Route path="/paciente/reservar-cita" element={<BookAppointmentPage />} />
        <Route path="/paciente/mis-citas" element={<MyAppointmentsPage />} />
        <Route path="/paciente/cita/:id" element={<AppointmentDetailPage />}/>
        <Route path="/paciente/cita/:id/reprogramar"element={<RescheduleAppointmentPage />}/>
        <Route path="/paciente/perfil"element={<PatientProfilePage />}/>
        {/* Rutas del Médico */}
        <Route path="/medico/agenda" element={<DoctorSchedule />} />

        {/* Rutas del Administrador */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}