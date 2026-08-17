import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import AuthLayout from './AuthLayout';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  
  // Determine if we need to show a special message based on the redirect parameter
  const showListPropertyMessage = redirect === 'list-property';
  
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue.">
      <div className="max-w-md w-full">
        {showListPropertyMessage && (
          <div className="mb-4 p-4 bg-gold-500/10 border border-gold-500/25 rounded-xl">
            <p className="text-sm text-gold-200">
              Please sign in or create an account to list your property on DirectHome.
            </p>
          </div>
        )}
        
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;