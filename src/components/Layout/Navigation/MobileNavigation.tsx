import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconHammer,
  IconBuildingSkyscraper,
  IconUser,
  IconDashboard,
  IconLogin,
  IconLogout,
  IconX
} from '@tabler/icons-react';
import Logo from '../../UI/Logo';
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

  useEffect(() => {
    const lastPath = lastPathRef.current;
    if (isOpen && location.pathname !== lastPath) {
      onClose();
    }
    lastPathRef.current = location.pathname;
  }, [location.pathname, isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
    { label: 'Home', path: '/', icon: IconHome, show: true },
    { label: 'Construction Estimator', path: '/construction-estimator', icon: IconHammer, show: true },
    { label: 'Listings (Soon)', path: '/search', icon: IconBuildingSkyscraper, show: true },
    { label: 'Dashboard', path: '/dashboard', icon: IconDashboard, show: isAuthenticated },
    { label: 'Profile', path: '/profile', icon: IconUser, show: isAuthenticated },
    { label: 'Login', path: '/auth/login', icon: IconLogin, show: !isAuthenticated },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className={`fixed top-0 left-0 h-full w-[min(20rem,88vw)] z-50 bg-paper-50 border-r border-paper-200 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-paper-200">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 rounded-sm text-ink-600 hover:bg-paper-200 transition"
            aria-label="Close menu"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navigationItems
              .filter(item => item.show)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-4 min-h-12 px-4 py-3 rounded-sm transition-colors ${
                        isActive
                          ? 'bg-courtyard-50 text-courtyard-700 border border-courtyard-100'
                          : 'text-ink-800 hover:bg-paper-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>

        {isAuthenticated && (
          <div className="p-3 border-t border-paper-200 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 w-full min-h-12 px-4 py-3 rounded-sm text-laterite-600 hover:bg-paper-100 transition"
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
