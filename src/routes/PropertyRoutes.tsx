import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PropertyListingForm from '../components/Property/PropertyListingForm';
import PropertyListingGuard from '../components/Property/PropertyListingGuard';
import RoleConversionFlow from '../components/Profile/RoleConversionFlow';
import VerificationFlow from '../components/Verification/VerificationFlow';
import VerificationPending from '../components/Verification/VerificationPending';
import { useAuth } from '../context/AuthContext';

const PropertyRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Property Listing Routes */}
      <Route path="list-property" element={<Layout />}>
        <Route 
          index 
          element={
            <PropertyListingGuard>
              <PropertyListingForm />
            </PropertyListingGuard>
          } 
        />
      </Route>
      
      {/* Role Conversion Flow */}
      <Route path="role-conversion" element={<Layout />}>
        <Route 
          index 
          element={
            isAuthenticated ? <RoleConversionFlow /> : <Navigate to="/auth/login?redirect=role-conversion" replace />
          } 
        />
      </Route>
      
      {/* Verification Flow */}
      <Route path="verification-flow" element={<Layout />}>
        <Route 
          index 
          element={
            isAuthenticated ? <VerificationFlow /> : <Navigate to="/auth/login?redirect=verification-flow" replace />
          } 
        />
      </Route>
      
      {/* Verification Pending */}
      <Route path="verification-pending" element={<Layout />}>
        <Route 
          index 
          element={
            isAuthenticated ? <VerificationPending /> : <Navigate to="/auth/login?redirect=verification-pending" replace />
          } 
        />
      </Route>
    </Routes>
  );
};

export default PropertyRoutes;