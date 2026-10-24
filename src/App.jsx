import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
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
  return (
    <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/registro" element={<PublicLayout><RegisterPage /></PublicLayout>} />
        <Route path="/medicos" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
        <Route path="/especialidades" element={<PublicLayout><SpecialtiesPage /></PublicLayout>} />
        <Route path="/nosotros" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/unauthorized" element={<PublicLayout><UnauthorizedPage /></PublicLayout>} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        <Route element={<ProtectedRoute roles={['PATIENT']} />}>
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
        </Route>

        <Route element={<ProtectedRoute roles={['DOCTOR']} />}>

        <Route path="/medico/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/medico/agenda" element={<DoctorSchedule />} />
        <Route path="/medico/citas" element={<DoctorAppointmentsPage />} />
        <Route path="/medico/citas/:id" element={<DoctorAppointmentDetailPage />} />
        <Route path="/medico/perfil" element={<DoctorProfilePage />} />
        <Route path="/medico/pacientes" element={<DoctorPatientsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="especialidades" element={<SpecialtiesManagementPage />} />
          <Route path="citas" element={<AppointmentsManagementPage />} />
          <Route path="estadisticas" element={<StatisticsPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
        </Route>
        </Route>

        <Route path="/login-local" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/registro-local" element={<PublicLayout><Register /></PublicLayout>} />

        <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ApplicationRoutes />
    </BrowserRouter>
  );
}
