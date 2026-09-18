import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminLayout from './components/admin/AdminLayout';
import PatientLayout from './components/patient/PatientLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import AppointmentsManagementPage from './pages/admin/AppointmentsManagementPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import SpecialtiesManagementPage from './pages/admin/SpecialtiesManagementPage';
import StatisticsPage from './pages/admin/StatisticsPage';

import AppointmentDetailPage from './pages/patient/AppointmentDetailPage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import PatientHistoryPage from './pages/patient/PatientHistoryPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import RescheduleAppointmentPage from './pages/patient/RescheduleAppointmentPage';
import SearchDoctorsPage from './pages/patient/SearchDoctorsPage';
import DoctorDetailPage from './pages/patient/DoctorDetailPage';

import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorAppointmentDetailPage from './pages/doctor/DoctorAppointmentDetailPage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import DoctorSchedule from './pages/doctor/DoctorSchedulePage';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';

import DoctorsPage from './pages/public/DoctorsPage';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';

function ApplicationRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbarRoutes = ['/login', '/registro', '/auth'];
  const shouldShowNavbar = !isAdminRoute && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        <Route path="/paciente" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="inicio" element={<PatientDashboard />} />
          <Route path="buscar" element={<SearchDoctorsPage />} />
          <Route path="medicos/:id" element={<DoctorDetailPage />} />
          <Route path="reservar-cita" element={<BookAppointmentPage />} />
          <Route path="mis-citas" element={<MyAppointmentsPage />} />
          <Route path="historial" element={<PatientHistoryPage />} />
          <Route path="cita/:id" element={<AppointmentDetailPage />} />
          <Route path="cita/:id/reprogramar" element={<RescheduleAppointmentPage />} />
          <Route path="perfil" element={<PatientProfilePage />} />
        </Route>

        <Route path="/paciente/inicio" element={<PatientDashboardPage />} />

        <Route path="/medico/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/medico/agenda" element={<DoctorSchedule />} />
        <Route path="/medico/citas" element={<DoctorAppointmentsPage />} />
        <Route path="/medico/citas/:id" element={<DoctorAppointmentDetailPage />} />
        <Route path="/medico/perfil" element={<DoctorProfilePage />} />
        <Route path="/medico/pacientes" element={<DoctorPatientsPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="especialidades" element={<SpecialtiesManagementPage />} />
          <Route path="citas" element={<AppointmentsManagementPage />} />
          <Route path="estadisticas" element={<StatisticsPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
        </Route>

        <Route path="/login-local" element={<Login />} />
        <Route path="/registro-local" element={<Register />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ApplicationRoutes />
    </BrowserRouter>
  );
}