import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  IconShieldCheck, 
  IconAlertCircle, 
  IconInfoCircle,
  IconArrowRight
} from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import { useVerificationStore } from '../../store/verificationStore';
import { UserRole } from '../../types/auth';
import { VerificationStatus } from '../../types/verification';

interface PropertyListingGuardProps {
  children: React.ReactNode;
}

const PropertyListingGuard: React.FC<PropertyListingGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { getUserVerificationStatus, checkVerificationStatus } = useVerificationStore();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (user) {
        try {
          // Check verification status from the API
          const status = await checkVerificationStatus(user.id);
          setVerificationStatus(status);
        } catch (error) {
          console.error('Error checking verification status:', error);
          // Fallback to local state if API call fails
          const localStatus = getUserVerificationStatus(user.id);
          setVerificationStatus(localStatus);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [user, checkVerificationStatus, getUserVerificationStatus]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=list-property" replace />;
  }

  // If user is not a home owner, redirect to role conversion
  if (user && user.role !== UserRole.HOME_OWNER) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0">
              <IconInfoCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                You need to be a property owner to list properties
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your account is currently registered as a home seeker. To list properties, 
                you need to add property owner capabilities to your account.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <IconInfoCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Benefits of becoming a property owner</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>List your properties directly without agent fees</li>
                    <li>Connect with verified home seekers</li>
                    <li>Manage viewings and appointments efficiently</li>
                    <li>Keep your home seeker account for your own property searches</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/role-conversion')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center"
            >
              Become a Property Owner
              <IconArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is a home owner but not verified, redirect to verification flow
  if (user && user.role === UserRole.HOME_OWNER && verificationStatus !== VerificationStatus.VERIFIED) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0">
              <IconAlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Verification Required
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Before you can list properties on DirectHome, we need to verify your identity 
                and property ownership status. This helps ensure trust and safety for all users 
                on our platform.
              </p>
            </div>
          </div>
          
          {verificationStatus === VerificationStatus.PENDING ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <IconInfoCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Verification In Progress</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your verification request is currently being processed. This typically takes 1-2 business days.
                      You'll receive an email notification once your verification is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <IconShieldCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Verification Process</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      The verification process is quick and straightforward. You'll need to provide:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>A government-issued ID</li>
                      <li>Proof of address (utility bill, bank statement)</li>
                      <li>Optional: Property ownership documents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
            {verificationStatus === VerificationStatus.PENDING ? (
              <button
                onClick={() => navigate('/verification-pending')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md flex items-center"
              >
                View Verification Status
                <IconArrowRight size={16} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/verification-flow')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center"
              >
                Start Verification
                <IconArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If user is a verified home owner, allow access to the property listing form
  return <>{children}</>;
};

export default PropertyListingGuard;