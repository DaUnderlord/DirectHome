import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const ResetPasswordPage: React.FC = () => {
  const { confirmResetPassword, error } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmResetPassword({
        token: '',
        newPassword: password,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2500);
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      {success ? (
        <div className="text-center space-y-4">
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-200">
            Password updated. Redirecting to sign in…
          </div>
          <Link to="/auth/login" className="text-gold-400 hover:text-gold-300 text-sm font-medium">
            Go to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(localError || error) && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {localError || error?.message}
            </div>
          )}

          <label htmlFor="password" className="block text-sm text-stone-300">
            New password
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </label>

          <label htmlFor="confirmPassword" className="block text-sm text-stone-300">
            Confirm password
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
