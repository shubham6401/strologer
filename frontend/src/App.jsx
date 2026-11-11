import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import ExecutiveLayout from './layouts/ExecutiveLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Astrologers from './pages/public/Astrologers';
import AstrologerDetail from './pages/public/AstrologerDetail';
import HowItWorks from './pages/public/HowItWorks';
import Contact from './pages/public/Contact';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

// Auth Pages
import ExecutiveLogin from './pages/auth/ExecutiveLogin';
import ExecutiveSignup from './pages/auth/ExecutiveSignup';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Executive Dashboard Pages
import ExecutiveOverview from './pages/executive/ExecutiveOverview';
import ExecutiveProfile from './pages/executive/ExecutiveProfile';
import ConsultationPricing from './pages/executive/ConsultationPricing';
import PaymentQrManagement from './pages/executive/PaymentQrManagement';
import BookingRequests from './pages/executive/BookingRequests';
import PaymentVerification from './pages/executive/PaymentVerification';
import ScheduledMeetings from './pages/executive/ScheduledMeetings';
import ConsultationHistory from './pages/executive/ConsultationHistory';
import EarningsDashboard from './pages/executive/EarningsDashboard';
import AvailabilitySettings from './pages/executive/AvailabilitySettings';
import ZoomSettings from './pages/executive/ZoomSettings';
import ExecutiveNotifications from './pages/executive/ExecutiveNotifications';

// Customer Dashboard Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookConsultation from './pages/customer/BookConsultation';
import PaymentPage from './pages/customer/PaymentPage';
import MyBookings from './pages/customer/MyBookings';
import UpcomingConsultations from './pages/customer/UpcomingConsultations';
import CustomerHistory from './pages/customer/CustomerHistory';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerNotifications from './pages/customer/CustomerNotifications';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/astrologers" element={<Astrologers />} />
              <Route path="/astrologers/:id" element={<AstrologerDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<Terms />} />

              {/* Authentication inside public chrome */}
              <Route path="/executive/login" element={<ExecutiveLogin />} />
              <Route path="/executive/signup" element={<ExecutiveSignup />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Client direct booking and payment within public/client layout */}
              <Route
                path="/book/:astrologerId"
                element={
                  <ProtectedRoute requiredRole="NORMAL_USER">
                    <BookConsultation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:bookingId"
                element={
                  <ProtectedRoute requiredRole="NORMAL_USER">
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Executive Dashboard Protected Routes */}
            <Route
              path="/executive"
              element={
                <ProtectedRoute requiredRole="EXECUTIVE">
                  <ExecutiveLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/executive/dashboard" replace />} />
              <Route path="dashboard" element={<ExecutiveOverview />} />
              <Route path="profile" element={<ExecutiveProfile />} />
              <Route path="pricing" element={<ConsultationPricing />} />
              <Route path="payment-qr" element={<PaymentQrManagement />} />
              <Route path="booking-requests" element={<BookingRequests />} />
              <Route path="payment-verification" element={<PaymentVerification />} />
              <Route path="scheduled-consultations" element={<ScheduledMeetings />} />
              <Route path="history" element={<ConsultationHistory />} />
              <Route path="earnings" element={<EarningsDashboard />} />
              <Route path="availability" element={<AvailabilitySettings />} />
              <Route path="zoom-settings" element={<ZoomSettings />} />
              <Route path="notifications" element={<ExecutiveNotifications />} />
            </Route>

            {/* Customer Dashboard Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="NORMAL_USER">
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="pending-payments" element={<MyBookings />} />
              <Route path="upcoming" element={<UpcomingConsultations />} />
              <Route path="history" element={<CustomerHistory />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="notifications" element={<CustomerNotifications />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
