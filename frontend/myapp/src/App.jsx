import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { AddStudentPage } from './pages/AddStudentPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import './App.css';

function RequireStaff({ children }) {
  const { user } = useAuth();
  if (!user || user.role === 'PARENT' || user.role === 'STUDENT') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/parent"            element={<ParentPortalPage />} />
        <Route path="/student"           element={<StudentPortalPage />} />
        <Route path="/students/register" element={<RequireStaff><AddStudentPage /></RequireStaff>} />
        <Route path="/*"                 element={<RequireStaff><AdminDashboard /></RequireStaff>} />
      </Routes>
    </div>
  );
}
