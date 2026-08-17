import React from 'react';
import AuthLayout from './AuthLayout';
import RegisterForm from './RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Create an account" subtitle="Join DirectHome to plan a build, check rent, and get ready for listings.">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;