import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';



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
import PatientLayout from './components/patient/PatientLayout';
import PatientHistoryPage from './pages/patient/PatientHistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas del Paciente */}
        <Route path="/paciente" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="reservar-cita" element={<BookAppointmentPage />} />
          <Route path="mis-citas" element={<MyAppointmentsPage />} />
          <Route path="historial" element={<PatientHistoryPage />} />
          <Route path="cita/:id" element={<AppointmentDetailPage />} />
          <Route path="cita/:id/reprogramar"element={<RescheduleAppointmentPage />}/>
          <Route path="perfil" element={<PatientProfilePage />} />
        </Route>
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