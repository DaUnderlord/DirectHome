import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminRole, AdminPermission } from '../../types/admin';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRoles?: AdminRole[];
  requiredPermissions?: AdminPermission[];
  fallbackPath?: string;
}

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(AdminPermission),
  [AdminRole.ADMIN]: Object.values(AdminPermission).filter(
    (permission) => permission !== AdminPermission.MANAGE_ADMINS
  ),
  [AdminRole.MODERATOR]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.VIEW_PROPERTIES,
    AdminPermission.EDIT_PROPERTIES,
    AdminPermission.APPROVE_PROPERTIES,
    AdminPermission.VIEW_REPORTS,
    AdminPermission.RESOLVE_REPORTS,
    AdminPermission.MODERATE_CONTENT,
    AdminPermission.VIEW_VERIFICATIONS,
    AdminPermission.APPROVE_VERIFICATIONS,
    AdminPermission.REJECT_VERIFICATIONS,
  ],
  [AdminRole.SUPPORT]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.VIEW_PROPERTIES,
    AdminPermission.VIEW_REPORTS,
    AdminPermission.VIEW_VERIFICATIONS,
    AdminPermission.VIEW_PAYMENTS,
  ],
};

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = '/unauthorized',
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== UserRole.ADMIN) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  const adminRole = AdminRole.ADMIN;
  const grantedPermissions = ROLE_PERMISSIONS[adminRole];

  if (requiredRoles.length > 0 && !requiredRoles.includes(adminRole)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((permission) => grantedPermissions.includes(permission))
  ) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
