import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { PropertyOwnerDashboard } from '../PropertyOwner';
import HomeSeekerDashboard from './HomeSeekerDashboard';
import RoleToggle from './RoleToggle';

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  
  // Check if user has multiple roles (both homeowner and homeseeker)
  const hasMultipleRoles = user && 
    ((user.role === UserRole.HOME_OWNER && user.previousRoles?.includes(UserRole.HOME_SEEKER)) ||
     (user.role === UserRole.HOME_SEEKER && user.previousRoles?.includes(UserRole.HOME_OWNER)));
  
  // Determine available roles - memoized to prevent infinite loop
  const availableRoles = useMemo(() => {
    if (!user) return [];
    return user.previousRoles ? [user.role, ...user.previousRoles] : [user.role];
  }, [user?.role, user?.previousRoles]);
  
  // Set initial active role based on user's primary role or stored preference
  useEffect(() => {
    if (!user) return;
    
    const storedRole = localStorage.getItem('preferred_dashboard_role');
    
    if (storedRole && availableRoles.includes(storedRole as UserRole)) {
      setActiveRole(storedRole as UserRole);
    } else {
      setActiveRole(user.role);
    }
  }, [user?.role, availableRoles]);
  
  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('preferred_dashboard_role', role);
  };
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=dashboard" replace />;
  }
  
  // Show loading state if role is not determined yet
  if (!activeRole) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }
  
  return (
    <>
      {/* Role Toggle (only shown if user has multiple roles) */}
      {hasMultipleRoles && (
        <div className="container mx-auto px-4 pt-8 pb-0">
          <RoleToggle 
            availableRoles={availableRoles as UserRole[]} 
            activeRole={activeRole} 
            onRoleChange={handleRoleChange}
            showBadges={true}
            pendingCounts={{
              [UserRole.HOME_OWNER]: 3,
              [UserRole.HOME_SEEKER]: 1
            }}
          />
        </div>
      )}
      
      {/* Dashboard Content based on active role */}
      {activeRole === UserRole.HOME_OWNER ? (
        <PropertyOwnerDashboard />
      ) : (
        <HomeSeekerDashboard 
          activeRole={activeRole} 
          onRoleChange={handleRoleChange} 
        />
      )}
    </>
  );
};

export default DashboardRouter;