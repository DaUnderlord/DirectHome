import React from 'react';
import { UserRole } from '../../../types/auth';
import { Home, Search } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  error?: string;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onSelectRole,
  error,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">I am a:</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Owner Card */}
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedRole === UserRole.HOME_OWNER
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onSelectRole(UserRole.HOME_OWNER)}
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full ${
              selectedRole === UserRole.HOME_OWNER ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Home className={`h-6 w-6 ${
                selectedRole === UserRole.HOME_OWNER ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <h4 className="ml-3 text-lg font-medium">Home Owner</h4>
          </div>
          
          <p className="text-sm text-gray-600">
            I want to list my property for rent and connect directly with potential tenants.
          </p>
          
          <ul className="mt-3 space-y-1">
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              List properties without agent fees
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Communicate directly with tenants
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Manage viewings and appointments
            </li>
          </ul>
        </div>
        
        {/* Home Seeker Card */}
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedRole === UserRole.HOME_SEEKER
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onSelectRole(UserRole.HOME_SEEKER)}
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full ${
              selectedRole === UserRole.HOME_SEEKER ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Search className={`h-6 w-6 ${
                selectedRole === UserRole.HOME_SEEKER ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <h4 className="ml-3 text-lg font-medium">Home Seeker</h4>
          </div>
          
          <p className="text-sm text-gray-600">
            I'm looking for a property to rent and want to connect directly with homeowners.
          </p>
          
          <ul className="mt-3 space-y-1">
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Browse verified properties
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No agent fees or commissions
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Schedule viewings directly
            </li>
          </ul>
        </div>
      </div>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RoleSelection;