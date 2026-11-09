import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { getPostLoginPath } from '../../utils/authRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  /**
   * When the role does not match, send the user to their own dashboard instead of
   * /unauthorized. Used on the role dashboards so a profile switch (or a role that
   * loads a moment after login) lands on the right page.
   */
  redirectToOwnDashboard?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectToOwnDashboard = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role-based access
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <Navigate to={redirectToOwnDashboard ? getPostLoginPath(user.role) : '/unauthorized'} replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
