import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHome, IconShieldCheck, IconMessage, IconCoin } from '@tabler/icons-react';

interface BecomePropertyOwnerProps {
  className?: string;
}

const BecomePropertyOwner: React.FC<BecomePropertyOwnerProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/role-conversion');
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Become a Property Owner</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <IconHome className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">List Your Properties</h3>
            <p className="text-sm text-gray-600">Expand your profile to include property owner capabilities</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">Verified Listings</h4>
              <p className="text-xs text-gray-600">Build trust with verified property listings</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconMessage className="w-5 h-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">Direct Communication</h4>
              <p className="text-xs text-gray-600">Connect directly with potential tenants</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconCoin className="w-5 h-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">No Agent Fees</h4>
              <p className="text-xs text-gray-600">Save money by eliminating middlemen</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default BecomePropertyOwner;