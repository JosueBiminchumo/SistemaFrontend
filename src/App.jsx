import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AdminLayout from './components/admin/AdminLayout';
import PatientLayout from './components/patient/PatientLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AppointmentsManagementPage from './pages/admin/AppointmentsManagementPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import SpecialtiesManagementPage from './pages/admin/SpecialtiesManagementPage';
import StatisticsPage from './pages/admin/StatisticsPage';

import AppointmentDetailPage from './pages/patient/AppointmentDetailPage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientHistoryPage from './pages/patient/PatientHistoryPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import RescheduleAppointmentPage from './pages/patient/RescheduleAppointmentPage';

import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorSchedule from './pages/doctor/DoctorSchedulePage';

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
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/auth"
          element={<Navigate to="/login" replace />}
        />

        {/* Rutas del paciente */}
        <Route path="/paciente" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route
            path="inicio"
            element={<PatientDashboard />}
          />
          <Route
            path="reservar-cita"
            element={<BookAppointmentPage />}
          />
          <Route
            path="mis-citas"
            element={<MyAppointmentsPage />}
          />
          <Route
            path="historial"
            element={<PatientHistoryPage />}
          />
          <Route
            path="cita/:id"
            element={<AppointmentDetailPage />}
          />
          <Route
            path="cita/:id/reprogramar"
            element={<RescheduleAppointmentPage />}
          />
          <Route
            path="perfil"
            element={<PatientProfilePage />}
          />
        </Route>

        {/* Rutas del médico */}
        <Route
          path="/medico/dashboard"
          element={<DoctorDashboardPage />}
        />
        <Route
          path="/medico/agenda"
          element={<DoctorSchedule />}
        />

        {/* Rutas del administrador */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="especialidades"
            element={<SpecialtiesManagementPage />}
          />
          <Route
            path="citas"
            element={<AppointmentsManagementPage />}
          />
          <Route
            path="estadisticas"
            element={<StatisticsPage />}
          />
          <Route
            path="perfil"
            element={<AdminProfilePage />}
          />
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}