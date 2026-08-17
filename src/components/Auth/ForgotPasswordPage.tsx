import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

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
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-200">
            If an account exists for <strong>{email}</strong>, a reset link has been sent.
            Check your inbox and spam folder.
          </div>
          <Link to="/auth/login" className="text-gold-400 hover:text-gold-300 text-sm font-medium">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error.message}
            </div>
          )}

          <label htmlFor="email" className="block text-sm text-stone-300">
            Email address
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>

          <div className="text-center">
            <Link to="/auth/login" className="text-sm text-gold-400 hover:text-gold-300">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
