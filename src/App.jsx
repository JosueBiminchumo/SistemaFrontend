import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import PatientDashboard from './pages/patient/PatientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import AppointmentDetailPage from './pages/patient/AppointmentDetailPage';
import RescheduleAppointmentPage from './pages/patient/RescheduleAppointmentPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientLayout from './components/patient/PatientLayout';
import PatientHistoryPage from './pages/patient/PatientHistoryPage';

import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorSchedule from "./pages/doctor/DoctorSchedulePage";
import DoctorsPage from './pages/public/DoctorsPage';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas del Paciente */}
        <Route path="/paciente" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="reservar-cita" element={<BookAppointmentPage />} />
          <Route path="mis-citas" element={<MyAppointmentsPage />} />
          <Route path="historial" element={<PatientHistoryPage />} />
          <Route path="cita/:id" element={<AppointmentDetailPage />} />
          <Route path="cita/:id/reprogramar" element={<RescheduleAppointmentPage />} />
          <Route path="perfil" element={<PatientProfilePage />} />
        </Route>

        {/* Rutas del Médico */}
        <Route path="/medico/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/medico/agenda" element={<DoctorSchedule />} />

        {/* Rutas del Administrador */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}