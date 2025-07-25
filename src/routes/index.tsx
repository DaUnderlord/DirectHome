import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';

// Layouts
import Layout from '../components/Layout/Layout';

// Auth Components
import LoginPage from '../components/Auth/LoginPage';
import RegisterPage from '../components/Auth/RegisterPage';
import ForgotPasswordPage from '../components/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../components/Auth/ResetPasswordPage';
import VerificationPage from '../components/Auth/VerificationPage';
import UnauthorizedPage from '../components/Auth/UnauthorizedPage';

// Property Components
import { PropertyDetailPage, PropertyGrid } from '../components/Property';
import PropertyListingGuard from '../components/Property/PropertyListingGuard';
import VerificationFlow from '../components/Verification/VerificationFlow';
import VerificationPending from '../components/Verification/VerificationPending';
import RoleConversionFlow from '../components/Profile/RoleConversionFlow';
import DashboardRouter from '../components/Dashboard/DashboardRouter';

// Route Guards
import PublicRoute from '../components/Auth/PublicRoute';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

// Feature Routes
import AdminRoutes from './AdminRoutes';
import PropertyRoutes from './PropertyRoutes';

// Error Handling
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Import the new HomePage component
import HomePage from '../components/Pages/HomePage';

// Import RentCalculator component
import RentCalculator from '../components/RentCalculator/RentCalculator';

// Import Page components
import AboutPage from '../components/Pages/AboutPage';
import ContactPage from '../components/Pages/ContactPage';
import CareersPage from '../components/Pages/CareersPage';
import HelpPage from '../components/Pages/HelpPage';
import FrequentlyAskedQuestions from '../components/Pages/FrequentlyAskedQuestions';
// @ts-ignore - SimpleTermsPage is a JSX file without type definitions
import TermsPage from '../components/Pages/SimpleTermsPage';
import PrivacyPage from '../components/Pages/PrivacyPage';
import CookiesPage from '../components/Pages/CookiesPage';

const SearchPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-12 mb-8"></div>
    <PropertyGrid
      title="Available Properties"
      showFilters={true}
      showPagination={true}
    />
  </div>
);

const CalculatorPage = () => (
  <div className="container mx-auto px-4 py-8">
    <RentCalculator />
  </div>
);

// Import the ProfilePage component
import ProfilePage from '../components/Profile/ProfilePage';

// Dashboard Components (placeholders)
const HomeOwnerDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Home Owner Dashboard</h1>
    <p className="text-gray-600">Manage your properties and inquiries here.</p>
  </div>
);

const HomeSeekerDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Home Seeker Dashboard</h1>
    <p className="text-gray-600">View your saved properties and inquiries here.</p>
  </div>
);

const AdminDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
    <p className="text-gray-600">Manage users, properties, and platform settings here.</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />

          {/* Property Routes */}
          <Route path="property/:id" element={<PropertyDetailPage />} />

          {/* Calculator Route */}
          <Route path="calculator" element={<CalculatorPage />} />

          {/* Footer Routes */}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="faq" element={<FrequentlyAskedQuestions />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth">
          <Route
            path="login"
            element={
              <PublicRoute restricted={true}>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute restricted={true}>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <PublicRoute restricted={false}>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="reset-password"
            element={
              <PublicRoute restricted={false}>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="verify"
            element={
              <PublicRoute restricted={false}>
                <VerificationPage />
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="homeowner"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="homeseeker"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_SEEKER]}>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Property Routes - includes listing, verification, and role conversion */}
        <Route path="/*" element={<PropertyRoutes />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;