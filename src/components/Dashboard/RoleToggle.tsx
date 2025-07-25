import React, { useState } from 'react';
import { UserRole } from '../../types/auth';
import { IconHome, IconSearch, IconBell } from '@tabler/icons-react';

interface RoleToggleProps {
  availableRoles: UserRole[];
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  showBadges?: boolean;
  pendingCounts?: {
    [UserRole.HOME_OWNER]?: number;
    [UserRole.HOME_SEEKER]?: number;
  };
}

const RoleToggle: React.FC<RoleToggleProps> = ({ 
  availableRoles, 
  activeRole, 
  onRoleChange,
  showBadges = true,
  pendingCounts = {}
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Only show roles that are available to the user
  const filteredRoles = availableRoles.filter(role => 
    role === UserRole.HOME_OWNER || role === UserRole.HOME_SEEKER
  );
  
  // Don't render if there's only one role
  if (filteredRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = (role: UserRole) => {
    if (role === activeRole) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onRoleChange(role);
      setIsAnimating(false);
    }, 150);
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case UserRole.HOME_OWNER:
        return {
          icon: IconHome,
          label: 'Property Owner',
          description: 'Manage your properties and listings',
          color: 'blue'
        };
      case UserRole.HOME_SEEKER:
        return {
          icon: IconSearch,
          label: 'Home Seeker',
          description: 'Find and save your favorite properties',
          color: 'green'
        };
      default:
        return {
          icon: IconHome,
          label: 'User',
          description: '',
          color: 'gray'
        };
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard View</h2>
          <p className="text-sm text-gray-600 mt-1">Switch between your different roles</p>
        </div>
        
        {showBadges && Object.values(pendingCounts).some(count => count && count > 0) && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            <IconBell size={14} />
            <span>
              {Object.values(pendingCounts).reduce((sum, count) => sum + (count || 0), 0)} pending
            </span>
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Background slider */}
        <div className={`
          absolute inset-y-0 w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg
          transition-transform duration-300 ease-out
          ${activeRole === UserRole.HOME_SEEKER ? 'translate-x-full' : 'translate-x-0'}
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}></div>
        
        <div className="relative grid grid-cols-2 gap-0">
          {filteredRoles.includes(UserRole.HOME_OWNER) && (
            <button
              onClick={() => handleRoleChange(UserRole.HOME_OWNER)}
              className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-300
                ${activeRole === UserRole.HOME_OWNER 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <div className="relative">
                <IconHome className="w-6 h-6 mb-2" />
                {showBadges && pendingCounts[UserRole.HOME_OWNER] && pendingCounts[UserRole.HOME_OWNER]! > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {pendingCounts[UserRole.HOME_OWNER]}
                  </div>
                )}
              </div>
              <span className="font-medium text-sm">Property Owner</span>
              <span className="text-xs opacity-75 mt-1 text-center leading-tight">
                Manage properties
              </span>
            </button>
          )}
          
          {filteredRoles.includes(UserRole.HOME_SEEKER) && (
            <button
              onClick={() => handleRoleChange(UserRole.HOME_SEEKER)}
              className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-300
                ${activeRole === UserRole.HOME_SEEKER 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <div className="relative">
                <IconSearch className="w-6 h-6 mb-2" />
                {showBadges && pendingCounts[UserRole.HOME_SEEKER] && pendingCounts[UserRole.HOME_SEEKER]! > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {pendingCounts[UserRole.HOME_SEEKER]}
                  </div>
                )}
              </div>
              <span className="font-medium text-sm">Home Seeker</span>
              <span className="text-xs opacity-75 mt-1 text-center leading-tight">
                Find properties
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* Role description */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          {getRoleInfo(activeRole).description}
        </p>
      </div>
    </div>
  );
};

export default RoleToggle;