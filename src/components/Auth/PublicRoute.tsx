import React from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  // For now, just render the children
  // In a real implementation, this would check authentication status
  return <>{children}</>;
};

export default PublicRoute;