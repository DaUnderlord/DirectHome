import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPostLoginPath } from '../../utils/authRedirect';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-paper-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-courtyard-700"></div>
      </div>
    );
  }
  
  if (restricted && isAuthenticated && user) {
    return <Navigate to={getPostLoginPath(user.role)} replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;