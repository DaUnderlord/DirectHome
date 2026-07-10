import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-gray-600 text-center text-sm mb-6">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
              Check your inbox and spam folder.
            </div>
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/auth/login" className="text-sm text-blue-600 hover:text-blue-800">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
