import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="skeleton skeleton-card" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div style={{ minHeight: '100vh', position: 'relative' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Workspace Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />

              {/* Redirect any other path to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Global toast alerts */}
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
