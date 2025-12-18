import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconSearch,
  IconPlus,
  IconUser,
  IconDashboard,
  IconLogin,
  IconLogout,
  IconX
} from '@tabler/icons-react';
import { useAuth } from '../../../context/AuthContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose
}) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  // Close menu when route changes
  useEffect(() => {
    const lastPath = lastPathRef.current;
    if (isOpen && location.pathname !== lastPath) {
      onClose();
    }
    lastPathRef.current = location.pathname;
  }, [location.pathname, isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    {
      label: 'Home',
      path: '/',
      icon: IconHome,
      show: true
    },
    {
      label: 'Search Properties',
      path: '/search',
      icon: IconSearch,
      show: true
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: IconDashboard,
      show: isAuthenticated
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: IconUser,
      show: isAuthenticated
    },
    {
      label: 'List Property',
      path: '/auth/login?redirect=list-property',
      icon: IconPlus,
      show: !isAuthenticated
    },
    {
      label: 'Login',
      path: '/auth/login',
      icon: IconLogin,
      show: !isAuthenticated
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Navigation Menu */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50
          glass-card border-r border-white/20
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            DirectHome
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl neumorphic-inset hover:neumorphic transition-all duration-200 btn-interactive"
            aria-label="Close menu"
          >
            <IconX size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
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
                        transition-all duration-200 btn-interactive
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:text-blue-600 neumorphic-inset hover:neumorphic'
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
        </div>

        {/* Footer Actions */}
        {isAuthenticated && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="
                flex items-center space-x-4 w-full px-4 py-3 rounded-xl
                text-red-600 hover:text-red-700 neumorphic-inset hover:neumorphic
                transition-all duration-200 btn-interactive
              "
            >
              <IconLogout size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default MobileNavigation;