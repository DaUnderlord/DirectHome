import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconDashboard,
  IconUsers,
  IconHome,
  IconFlag,
  IconShieldCheck,
  IconChartBar,
  IconSettings,
  IconUserShield,
  IconFileText,
  IconCreditCard,
  IconBell,
  IconMenu2,
  IconX,
  IconLogout,
  IconChevronDown
} from '@tabler/icons-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock user data
  const user = {
    firstName: 'Admin',
    lastName: 'User'
  };
  
  // Mock notification data
  const unreadNotificationCount = 2;

  const handleLogout = async () => {
    // Mock logout functionality
    navigate('/auth/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: IconDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: IconUsers,
      current: location.pathname.startsWith('/admin/users')
    },
    {
      name: 'Properties',
      href: '/admin/properties',
      icon: IconHome,
      current: location.pathname.startsWith('/admin/properties')
    },
    {
      name: 'Moderation',
      href: '/admin/moderation',
      icon: IconFlag,
      current: location.pathname.startsWith('/admin/moderation')
    },
    {
      name: 'Verifications',
      href: '/admin/verifications',
      icon: IconShieldCheck,
      current: location.pathname.startsWith('/admin/verifications')
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: IconChartBar,
      current: location.pathname.startsWith('/admin/analytics')
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: IconCreditCard,
      current: location.pathname.startsWith('/admin/payments')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: IconSettings,
      current: location.pathname.startsWith('/admin/settings')
    },
    {
      name: 'Admin Users',
      href: '/admin/admins',
      icon: IconUserShield,
      current: location.pathname.startsWith('/admin/admins')
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit',
      icon: IconFileText,
      current: location.pathname.startsWith('/admin/audit')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${item.current
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <IconMenu2 size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
                {navigationItems.find(item => item.current)?.name || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                >
                  <IconBell size={20} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                  <IconChevronDown size={16} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <IconLogout size={16} className="mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;