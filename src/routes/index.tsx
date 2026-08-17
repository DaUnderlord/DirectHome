import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth';

import Layout from '../components/Layout/Layout';
import LoginPage from '../components/Auth/LoginPage';
import RegisterPage from '../components/Auth/RegisterPage';
import ForgotPasswordPage from '../components/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../components/Auth/ResetPasswordPage';
import VerificationPage from '../components/Auth/VerificationPage';
import UnauthorizedPage from '../components/Auth/UnauthorizedPage';
import PublicRoute from '../components/Auth/PublicRoute';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

import HomePage from '../components/Pages/HomePage';
import ListingsComingSoon from '../components/Pages/ListingsComingSoon';

const RentCalculatorPage = React.lazy(() => import('../components/Pages/RentCalculatorPage'));
const ConstructionCostEstimator = React.lazy(() =>
  import('../components/Tools/ConstructionCostEstimator').then((m) => ({
    default: m.default,
  }))
);
const AboutPage = React.lazy(() => import('../components/Pages/AboutPage'));
const ContactPage = React.lazy(() => import('../components/Pages/ContactPage'));
const CareersPage = React.lazy(() => import('../components/Pages/CareersPage'));
const HelpPage = React.lazy(() => import('../components/Pages/HelpPage'));
const FrequentlyAskedQuestions = React.lazy(() => import('../components/Pages/FrequentlyAskedQuestions'));
const TermsPage = React.lazy(() => import('../components/Pages/TermsPage'));
const PrivacyPage = React.lazy(() => import('../components/Pages/PrivacyPage'));
const CookiesPage = React.lazy(() => import('../components/Pages/CookiesPage'));
const ProfilePage = React.lazy(() => import('../components/Profile/ProfilePage'));
const PropertyDetailPage = React.lazy(() =>
  import('../components/Property/PropertyDetail/PropertyDetailPage').then((m) => ({
    default: m.default,
  }))
);
const FavoriteProperties = React.lazy(() =>
  import('../components/Property/FavoriteProperties').then((m) => ({ default: m.default }))
);
const DashboardRouter = React.lazy(() => import('../components/Dashboard/DashboardRouter'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));
const PropertyRoutes = React.lazy(() => import('./PropertyRoutes'));
const PropertyOwnerDashboard = React.lazy(() =>
  import('../components/PropertyOwner/PropertyOwnerDashboard').then((m) => ({ default: m.default }))
);
const PropertyOnboardingForm = React.lazy(() =>
  import('../components/PropertyOwner/PropertyOnboarding').then((m) => ({ default: m.default }))
);
const ViewingManagement = React.lazy(() =>
  import('../components/PropertyOwner/ViewingManagement').then((m) => ({ default: m.default }))
);
const EnquiriesManagement = React.lazy(() =>
  import('../components/PropertyOwner/EnquiriesManagement').then((m) => ({ default: m.default }))
);
const ApplicationsManagement = React.lazy(() =>
  import('../components/PropertyOwner/ApplicationsManagement').then((m) => ({ default: m.default }))
);
const PaymentsManagement = React.lazy(() =>
  import('../components/PropertyOwner/PaymentsManagement').then((m) => ({ default: m.default }))
);
const MaintenanceManagement = React.lazy(() =>
  import('../components/PropertyOwner/MaintenanceManagement').then((m) => ({ default: m.default }))
);
const AnalyticsDashboard = React.lazy(() =>
  import('../components/PropertyOwner/AnalyticsDashboard').then((m) => ({ default: m.default }))
);

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-charcoal-950 text-stone-300">
    Loading…
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<ListingsComingSoon />} />
          <Route path="verified-properties" element={<ListingsComingSoon />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="property/:id" element={withSuspense(<PropertyDetailPage />)} />
          <Route path="calculator" element={withSuspense(<RentCalculatorPage />)} />
          <Route path="construction-estimator" element={withSuspense(<ConstructionCostEstimator />)} />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                {withSuspense(<FavoriteProperties />)}
              </ProtectedRoute>
            }
          />
          <Route path="about" element={withSuspense(<AboutPage />)} />
          <Route path="contact" element={withSuspense(<ContactPage />)} />
          <Route path="careers" element={withSuspense(<CareersPage />)} />
          <Route path="help" element={withSuspense(<HelpPage />)} />
          <Route path="faq" element={withSuspense(<FrequentlyAskedQuestions />)} />
          <Route path="terms" element={withSuspense(<TermsPage />)} />
          <Route path="privacy" element={withSuspense(<PrivacyPage />)} />
          <Route path="cookies" element={withSuspense(<CookiesPage />)} />
        </Route>

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

        <Route path="/dashboard" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                {withSuspense(<DashboardRouter />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="homeowner"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<DashboardRouter />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="homeseeker"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_SEEKER]}>
                {withSuspense(<DashboardRouter />)}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              {withSuspense(<AdminRoutes />)}
            </ProtectedRoute>
          }
        />

        <Route path="/*" element={withSuspense(<PropertyRoutes />)} />

        <Route path="/profile" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                {withSuspense(<ProfilePage />)}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/owner" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<PropertyOwnerDashboard />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="properties/new"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<PropertyOnboardingForm />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="properties"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<PropertyOwnerDashboard />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="viewings"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<ViewingManagement />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="enquiries"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<EnquiriesManagement />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<ApplicationsManagement />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<PaymentsManagement />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="maintenance"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<MaintenanceManagement />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute requiredRoles={[UserRole.HOME_OWNER]}>
                {withSuspense(<AnalyticsDashboard />)}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
