import React from 'react';
import AuthLayout from './AuthLayout';
import RegisterForm from './RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Create an Account" subtitle="Join DirectHome to find your perfect property">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;