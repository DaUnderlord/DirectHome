import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { PropertyOwnerDashboard } from '../PropertyOwner';
import HomeSeekerDashboard from './HomeSeekerDashboard';
import ProfileSwitcher from './ProfileSwitcher';

const DASHBOARD_PATH: Partial<Record<UserRole, string>> = {
  [UserRole.HOME_OWNER]: '/dashboard/homeowner',
  [UserRole.HOME_SEEKER]: '/dashboard/homeseeker',
};

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated, switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login?redirect=dashboard" replace />;
  }

  const activeRole = user.role;
  const canSwitch = activeRole === UserRole.HOME_OWNER || activeRole === UserRole.HOME_SEEKER;

  // The dashboard follows the account's real role; switching changes it in the database
  // and moves to that role's dashboard route (those routes are role-protected).
  const handleSwitch = async (role: UserRole) => {
    const updated = await switchRole(role);
    navigate(DASHBOARD_PATH[updated.role] || '/dashboard', { replace: true });
  };

  return (
    <>
      {canSwitch && (
        <div className="container mx-auto px-4 pt-6 pb-0">
          <ProfileSwitcher activeRole={activeRole} onSwitch={handleSwitch} />
        </div>
      )}

      {activeRole === UserRole.HOME_OWNER ? (
        <PropertyOwnerDashboard />
      ) : (
        <HomeSeekerDashboard
          activeRole={activeRole}
          onRoleChange={(role) => void handleSwitch(role).catch(() => {})}
        />
      )}
    </>
  );
};

export default DashboardRouter;
