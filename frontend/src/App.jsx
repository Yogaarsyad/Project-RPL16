import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LaporanPage from './pages/ReportPage'; // Tambah import
import DashboardLayout from './components/DashboardLayout'; // Import Layout

// Komponen wrapper untuk route yang dilindungi
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Layout khusus untuk Dashboard yang menangani logout
const DashboardLayoutWithLogout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return <DashboardLayout onLogout={handleLogout} />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rute Induk untuk Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayoutWithLogout />
              </ProtectedRoute>
            }
          >
            {/* Rute Anak: halaman default dashboard */}
            <Route index element={<DashboardPage />} />
            {/* Rute Anak: halaman profil */}
            <Route path="profile" element={<ProfilePage />} />
            {/* Tambah Rute Anak: halaman laporan */}
            <Route path="laporan" element={<LaporanPage />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;