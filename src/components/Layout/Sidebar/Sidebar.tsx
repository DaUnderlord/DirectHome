import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/auth';
import MobileNavigation from '../Navigation/MobileNavigation';
import Logo from '../../UI/Logo';

const Sidebar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isHomeOwner = user?.role === UserRole.HOME_OWNER;
  const isHomeSeeker = user?.role === UserRole.HOME_SEEKER;

  return (
    <div className="h-full overflow-y-auto">
      <div className="md:hidden py-4 px-2">
        <Logo size="md" />
      </div>
      
      {isAuthenticated && (
        <div className="mb-4 p-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500">
                {isHomeOwner ? 'Property Owner' : isHomeSeeker ? 'Home Seeker' : 'User'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 md:hidden mb-4" />
      
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500 mb-4 px-4 uppercase tracking-wider">
          Main Navigation
        </div>

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Sidebar;