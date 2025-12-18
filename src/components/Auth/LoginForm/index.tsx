import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../validations/auth';
import { useAuth } from '../../../context/AuthContext';
import { AuthErrorType, UserRole } from '../../../types/auth';
import Button from '../../UI/Button';
import Card from '../../UI/Card';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false
    }
  });
  
  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await login(formData);

      // Redirect based on user role
      switch (response.user.role) {
        case UserRole.HOME_OWNER:
          navigate('/dashboard/homeowner', { replace: true });
          break;
        case UserRole.HOME_SEEKER:
          navigate('/dashboard/homeseeker', { replace: true });
          break;
        case UserRole.ADMIN:
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.type === AuthErrorType.INVALID_CREDENTIALS) {
        setServerError('Invalid email/phone or password');
      } else if (error.type === AuthErrorType.ACCOUNT_SUSPENDED) {
        setServerError('Your account has been suspended. Please contact support.');
      } else {
        setServerError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card className="mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {serverError}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="emailOrPhone"
              placeholder="Enter your email or phone number"
              className={`w-full px-3 py-2 border ${
                errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('emailOrPhone')}
            />
            {errors.emailOrPhone && (
              <p className="mt-1 text-sm text-red-500">{errors.emailOrPhone.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;