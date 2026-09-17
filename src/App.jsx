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

function ApplicationRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route
          path="/paciente/inicio"
          element={<PatientDashboard />}
        />

        <Route
          path="/medico/agenda"
          element={<DoctorSchedule />}
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
        </Route>

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