import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const fieldClass =
  'mt-1 w-full px-3 py-2.5 rounded-sm bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword, error } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword({ emailOrPhone: email });
      setSubmitted(true);
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link if an account exists."
    >
      {submitted ? (
        <div className="text-center space-y-4">
          <div className="border border-courtyard-100 bg-courtyard-50 px-4 py-3 text-sm text-courtyard-800">
            If an account exists for <strong>{email}</strong>, a reset link has been sent.
            Check your inbox and spam folder.
          </div>
          <Link to="/auth/login" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border border-laterite-500/30 bg-laterite-500/10 px-4 py-3 text-sm text-laterite-600">
              {error.message}
            </div>
          )}

          <label htmlFor="email" className="block text-sm text-ink-800">
            Email address
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-sm bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>

          <div className="text-center">
            <Link to="/auth/login" className="text-sm text-courtyard-700 hover:text-courtyard-600">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
