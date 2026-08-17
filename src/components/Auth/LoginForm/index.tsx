import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../validations/auth';
import { useAuth } from '../../../context/AuthContext';
import { AuthErrorType, UserRole } from '../../../types/auth';

const fieldClass =
  'w-full px-3 py-3 min-h-[44px] text-base rounded-xl bg-charcoal-800 border border-charcoal-600 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500';

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-900/70 p-5 md:p-6"
      >
        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-stone-300 mb-1">
            Email or Phone<span className="text-gold-500 ml-1">*</span>
          </label>
          <input
            id="emailOrPhone"
            type="text"
            placeholder="Enter your email or phone number"
            autoComplete="username email tel"
            inputMode="email"
            className={`${fieldClass} ${errors.emailOrPhone ? 'border-red-500' : ''}`}
            {...register('emailOrPhone')}
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm text-red-400">{errors.emailOrPhone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1">
            Password<span className="text-gold-500 ml-1">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className={`${fieldClass} ${errors.password ? 'border-red-500' : ''}`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-500 focus:ring-gold-500"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-stone-400">
              Remember me
            </label>
          </div>
          <Link to="/auth/forgot-password" className="text-sm text-gold-400 hover:text-gold-300">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[44px] rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
