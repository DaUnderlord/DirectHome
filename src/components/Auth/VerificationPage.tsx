import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  IconMail, 
  IconPhone, 
  IconCheck, 
  IconArrowLeft,
  IconRefresh
} from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';

const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, verifyPhone, user } = useAuth();
  
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const email = searchParams.get('email') || user?.email || '';
  const phone = searchParams.get('phone') || user?.phone || '';

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode.trim()) return;
    
    setIsVerifyingEmail(true);
    setError('');
    
    try {
      await verifyEmail(emailCode);
      setEmailVerified(true);
    } catch (err) {
      setError('Invalid email verification code. Please try again.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCode.trim()) return;
    
    setIsVerifyingPhone(true);
    setError('');
    
    try {
      await verifyPhone(phoneCode);
      setPhoneVerified(true);
    } catch (err) {
      setError('Invalid phone verification code. Please try again.');
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const handleResendCode = (type: 'email' | 'phone') => {
    setResendCooldown(60);
    // In a real app, this would trigger a new verification code to be sent
    console.log(`Resending ${type} verification code`);
  };

  const handleContinue = () => {
    if (emailVerified || phoneVerified) {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <IconMail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verify Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent verification codes to secure your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Verification */}
          {email && !emailVerified && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <IconMail className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Email Verification</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to <span className="font-medium">{email}</span>
              </p>
              
              <form onSubmit={handleEmailVerification}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => handleResendCode('email')}
                    disabled={resendCooldown > 0}
                    className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 flex items-center"
                  >
                    <IconRefresh className="w-4 h-4 mr-1" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={emailCode.length !== 6 || isVerifyingEmail}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingEmail ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Email Verified */}
          {emailVerified && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <IconCheck className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Email verified successfully!</span>
              </div>
            </div>
          )}

          {/* Phone Verification */}
          {phone && !phoneVerified && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <IconPhone className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Phone Verification</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
              </p>
              
              <form onSubmit={handlePhoneVerification}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => handleResendCode('phone')}
                    disabled={resendCooldown > 0}
                    className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 flex items-center"
                  >
                    <IconRefresh className="w-4 h-4 mr-1" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={phoneCode.length !== 6 || isVerifyingPhone}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingPhone ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Verify Phone'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Phone Verified */}
          {phoneVerified && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <IconCheck className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Phone verified successfully!</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {(emailVerified || phoneVerified) && (
              <button
                onClick={handleContinue}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue to Dashboard
              </button>
            )}
            
            <button
              onClick={handleSkip}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Skip for Now
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              <IconArrowLeft className="w-4 h-4 mr-1" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;