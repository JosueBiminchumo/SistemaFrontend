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
import ProtectedRoute from './routes/ProtectedRoute';

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
import SearchDoctorsPage from './pages/patient/SearchDoctorsPage';
import DoctorDetailPage from './pages/patient/DoctorDetailPage';

import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorAppointmentDetailPage from './pages/doctor/DoctorAppointmentDetailPage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import DoctorSchedule from './pages/doctor/DoctorSchedulePage';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';

import DoctorsPage from './pages/public/DoctorsPage';
import AboutPage from './pages/public/AboutPage';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import RegisterPage from './pages/public/RegisterPage';
import SpecialtiesPage from './pages/public/SpecialtiesPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';

function ApplicationRoutes() {
  const location = useLocation();
  const authModalRoute = ['/login', '/registro'].includes(location.pathname);
  const defaultBackgroundLocation = authModalRoute
    ? { ...location, pathname: '/', search: '', hash: '' }
    : null;
  const backgroundLocation = location.state?.backgroundLocation || defaultBackgroundLocation;
  const routeLocation = backgroundLocation || location;
  const publicNavbarRoutes = ['/', '/medicos', '/especialidades', '/nosotros', '/login', '/registro', '/unauthorized'];
  const shouldShowNavbar = publicNavbarRoutes.includes(routeLocation.pathname);

  return (
    <div className={shouldShowNavbar ? 'app-frame app-frame--public' : 'app-frame'}>
      {shouldShowNavbar && <Navbar />}

      <Routes location={routeLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/especialidades" element={<SpecialtiesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        <Route
          path="/paciente"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE', 'PATIENT']}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientDashboard />} />
          <Route path="inicio" element={<Navigate to="/paciente" replace />} />
          <Route path="buscar" element={<SearchDoctorsPage />} />
          <Route path="medicos/:id" element={<DoctorDetailPage />} />
          <Route path="reservar-cita" element={<BookAppointmentPage />} />
          <Route path="mis-citas" element={<MyAppointmentsPage />} />
          <Route path="historial" element={<PatientHistoryPage />} />
          <Route path="cita/:id" element={<AppointmentDetailPage />} />
          <Route path="cita/:id/reprogramar" element={<RescheduleAppointmentPage />} />
          <Route path="perfil" element={<PatientProfilePage />} />
        </Route>

        <Route
          path="/medico/dashboard"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/agenda"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/citas"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/citas/:id"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorAppointmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/perfil"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/pacientes"
          element={
            <ProtectedRoute allowedRoles={['MEDICO', 'DOCTOR']}>
              <DoctorPatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="especialidades" element={<SpecialtiesManagementPage />} />
          <Route path="citas" element={<AppointmentsManagementPage />} />
          <Route path="estadisticas" element={<StatisticsPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes location={location}>
          <Route path="/login" element={<LoginPage isModal />} />
          <Route path="/registro" element={<RegisterPage isModal />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ApplicationRoutes />
    </BrowserRouter>
  );
}
