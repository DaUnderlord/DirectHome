import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/auth';
import Logo from '../../UI/Logo';
import {
  IconHome,
  IconSearch,
  IconPlus,
  IconUser,
  IconDashboard,
  IconLogin,
  IconLogout
} from '@tabler/icons-react';

const Sidebar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isHomeOwner = user?.role === UserRole.HOME_OWNER;
  const isHomeSeeker = user?.role === UserRole.HOME_SEEKER;

  const navigationItems = [
    { label: 'Home', path: '/', icon: IconHome, show: true },
    { label: 'Search Properties', path: '/search', icon: IconSearch, show: true },
    { label: 'Dashboard', path: '/dashboard', icon: IconDashboard, show: isAuthenticated },
    { label: 'Profile', path: '/profile', icon: IconUser, show: isAuthenticated },
    { label: 'List Property', path: '/auth/login?redirect=list-property', icon: IconPlus, show: !isAuthenticated },
    { label: 'Login', path: '/auth/login', icon: IconLogin, show: !isAuthenticated }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

        <ul className="space-y-2 px-4">
          {navigationItems
            .filter(item => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-4 px-4 py-3 rounded-xl
                      transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>

        {isAuthenticated && (
          <div className="px-4 pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 w-full px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <IconLogout size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;