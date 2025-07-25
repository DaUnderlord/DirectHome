import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminRole, AdminPermission } from '../types/admin';

// Admin Layout
import AdminLayout from '../components/Admin/AdminLayout';

// Admin Components (will be created)
import AdminDashboard from '../components/Admin/AdminDashboard';
import UserManagement from '../components/Admin/UserManagement';
import PropertyManagement from '../components/Admin/PropertyManagement';
import ModerationPanel from '../components/Admin/ModerationPanel';
import VerificationManagement from '../components/Admin/VerificationManagement';
import Analytics from '../components/Admin/Analytics';
import SystemSettings from '../components/Admin/SystemSettings';
import AdminUserManagement from '../components/Admin/AdminUserManagement';
import AuditLogs from '../components/Admin/AuditLogs';
import ReportsManagement from '../components/Admin/ReportsManagement';
import PaymentManagement from '../components/Admin/PaymentManagement';

// Route Guards
import AdminRoute from '../components/Auth/AdminRoute';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Dashboard - accessible to all admin roles */}
        <Route 
          index 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* User Management */}
        <Route path="users">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_USERS]}>
                <UserManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path=":userId" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_USERS]}>
                <UserManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Property Management */}
        <Route path="properties">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_PROPERTIES]}>
                <PropertyManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path=":propertyId" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_PROPERTIES]}>
                <PropertyManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="pending" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.APPROVE_PROPERTIES]}>
                <PropertyManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="featured" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.FEATURE_PROPERTIES]}>
                <PropertyManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Content Moderation */}
        <Route path="moderation">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_REPORTS]}>
                <ModerationPanel />
              </AdminRoute>
            } 
          />
          <Route 
            path="reports" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_REPORTS]}>
                <ReportsManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="reports/:reportId" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.RESOLVE_REPORTS]}>
                <ReportsManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Verification Management */}
        <Route path="verifications">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_VERIFICATIONS]}>
                <VerificationManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="pending" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_VERIFICATIONS]}>
                <VerificationManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path=":verificationId" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.APPROVE_VERIFICATIONS]}>
                <VerificationManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Analytics and Reporting */}
        <Route path="analytics">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_ANALYTICS]}>
                <Analytics />
              </AdminRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_ANALYTICS]}>
                <Analytics />
              </AdminRoute>
            } 
          />
          <Route 
            path="properties" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_ANALYTICS]}>
                <Analytics />
              </AdminRoute>
            } 
          />
          <Route 
            path="revenue" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_ANALYTICS]}>
                <Analytics />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Payment Management */}
        <Route path="payments">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_PAYMENTS]}>
                <PaymentManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="subscriptions" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SUBSCRIPTIONS]}>
                <PaymentManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="transactions" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.VIEW_PAYMENTS]}>
                <PaymentManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* System Settings */}
        <Route path="settings">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="general" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="verification" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="moderation" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="payments" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="notifications" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_SETTINGS]}>
                <SystemSettings />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Admin User Management */}
        <Route path="admins">
          <Route 
            index 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_ADMINS]}>
                <AdminUserManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="new" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_ADMINS]}>
                <AdminUserManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path=":adminId" 
            element={
              <AdminRoute requiredPermissions={[AdminPermission.MANAGE_ADMINS]}>
                <AdminUserManagement />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Audit Logs */}
        <Route path="audit">
          <Route 
            index 
            element={
              <AdminRoute requiredRoles={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
                <AuditLogs />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;