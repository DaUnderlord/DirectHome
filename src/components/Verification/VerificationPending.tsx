import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconClock, 
  IconCheck, 
  IconHome, 
  IconSearch, 
  IconSettings, 
  IconArrowRight 
} from '@tabler/icons-react';

const VerificationPending: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <IconClock className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Verification In Progress</h1>
        <p className="text-gray-600 mt-2">
          Your documents have been submitted and are being reviewed
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <IconClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Verification Status: Pending</h2>
              <p className="text-sm text-gray-600">
                Estimated completion time: 1-2 business days
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">What happens next?</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
                  1
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Our team will review your submitted documents
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
                  2
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    You'll receive a notification when verification is complete
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
                  3
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Once verified, you can start listing properties immediately
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md">
            <div className="flex items-start">
              <IconCheck className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Verification Benefits</h3>
                <ul className="mt-1 text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Verified badge on your profile</li>
                  <li>Higher visibility in search results</li>
                  <li>Increased trust from potential tenants</li>
                  <li>Access to premium features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">While You Wait</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <div className="flex items-center mb-2">
              <IconSearch className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-base font-medium text-gray-900">Browse Properties</h3>
            </div>
            <p className="text-sm text-gray-600">
              Explore available properties while your verification is in progress
            </p>
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <span>Start browsing</span>
              <IconArrowRight size={14} className="ml-1" />
            </div>
          </div>
          
          <div 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <div className="flex items-center mb-2">
              <IconSettings className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-base font-medium text-gray-900">Complete Your Profile</h3>
            </div>
            <p className="text-sm text-gray-600">
              Add more details to your profile to attract potential tenants
            </p>
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <span>Update profile</span>
              <IconArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;