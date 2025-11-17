import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LogProvider } from './context/LogContext';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LaporanPage from './pages/ReportPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

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
    <LogProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayoutWithLogout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="laporan" element={<LaporanPage />} />
              <Route path="activity-history" element={<ActivityHistoryPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </LogProvider>
  );
}

export default App;