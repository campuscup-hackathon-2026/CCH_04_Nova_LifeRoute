import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LiveTrackingPage } from './pages/tracking/LiveTrackingPage';
import { MobileDialerPage } from './pages/MobileDialerPage';
import { Incoming109CallModal } from './components/common/Incoming109CallModal';

// Patient Dashboard
import { PatientDashboard } from './dashboards/patient/PatientDashboard';
import { BookingHistory } from './dashboards/patient/BookingHistory';
import { PatientProfile } from './dashboards/patient/PatientProfile';

// Driver Dashboard
import { DriverDashboard } from './dashboards/driver/DriverDashboard';
import { DriverNavigation } from './dashboards/driver/DriverNavigation';
import { TripHistory } from './dashboards/driver/TripHistory';
import { DriverProfile } from './dashboards/driver/DriverProfile';

// Hospital Dashboard
import { HospitalDashboard } from './dashboards/hospital/HospitalDashboard';
import { FleetManagement } from './dashboards/hospital/FleetManagement';
import { DriverManagement } from './dashboards/hospital/DriverManagement';
import { BedAvailability } from './dashboards/hospital/BedAvailability';
import { HospitalAnalytics } from './dashboards/hospital/HospitalAnalytics';

// Admin Dashboard
import { AdminDashboard } from './dashboards/admin/AdminDashboard';
import { UserManagement } from './dashboards/admin/UserManagement';
import { HospitalVerification } from './dashboards/admin/HospitalVerification';
import { DriverVerification } from './dashboards/admin/DriverVerification';
import { AdminAnalytics } from './dashboards/admin/AdminAnalytics';
import { AuditLogs } from './dashboards/admin/AuditLogs';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Global Real-time 109 Incoming Call Alert Listener */}
      <Incoming109CallModal />

      <Routes>
        {/* Dedicated Mobile Dialer Screen (Open on your phone) */}
        <Route path="/dial-109" element={<MobileDialerPage />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/track" element={<LiveTrackingPage />} />
          <Route path="/track/:bookingId" element={<LiveTrackingPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Patient Routes */}
          <Route path="patient" element={<PatientDashboard />} />
          <Route path="patient/history" element={<BookingHistory />} />
          <Route path="patient/profile" element={<PatientProfile />} />

          {/* Driver Routes */}
          <Route path="driver" element={<DriverDashboard />} />
          <Route path="driver/navigate" element={<DriverNavigation />} />
          <Route path="driver/trips" element={<TripHistory />} />
          <Route path="driver/profile" element={<DriverProfile />} />

          {/* Hospital Routes */}
          <Route path="hospital" element={<HospitalDashboard />} />
          <Route path="hospital/fleet" element={<FleetManagement />} />
          <Route path="hospital/drivers" element={<DriverManagement />} />
          <Route path="hospital/beds" element={<BedAvailability />} />
          <Route path="hospital/analytics" element={<HospitalAnalytics />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/map" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/hospitals" element={<HospitalVerification />} />
          <Route path="admin/drivers" element={<DriverVerification />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/logs" element={<AuditLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

