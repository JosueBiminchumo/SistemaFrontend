import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminLayout from './components/admin/AdminLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedulePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SpecialtiesManagementPage from './pages/admin/SpecialtiesManagementPage';

function ApplicationRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Ruta inicial */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas del paciente */}
        <Route
          path="/paciente/inicio"
          element={<PatientDashboard />}
        />

        {/* Rutas del médico */}
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
        </Route>

        {/* Página no encontrada */}
        <Route
          path="*"
          element={<h2>404 - Página no encontrada</h2>}
        />
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