import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BedProvider } from './context/BedContext';

// Pages
import PublicDashboard from './pages/PublicDashboard/PublicDashboard';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import NurseDashboard from './pages/NurseDashboard/NurseDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard/ReceptionistDashboard';
import StaffDashboard from './pages/StaffDashboard/StaffDashboard';
import InternalDashboard from './pages/InternalDashboard/InternalDashboard';
import AboutPage from './pages/About/AboutPage';
import OurStoryPage from './pages/OurStory/OurStoryPage';
import ContactInfoPage from './pages/Contact/ContactInfoPage';
import CareersPage from './pages/Careers/CareersPage';
import HelpCentrePage from './pages/HelpCentre/HelpCentrePage';
import PrivacySettingsPage from './pages/Privacy/PrivacySettingsPage';
import DeveloperPage from './pages/Developer/DeveloperPage';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  console.log('App component loaded successfully!');
  
  return (
    <Router>
      <AuthProvider>
        <BedProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/contact-info" element={<ContactInfoPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/help-centre" element={<HelpCentrePage />} />
            <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nurse-dashboard"
              element={
                <ProtectedRoute requiredRole="nurse">
                  <NurseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist-dashboard"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <ReceptionistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute requiredRole={['staff', 'doctor', 'nurse', 'receptionist']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <InternalDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BedProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
