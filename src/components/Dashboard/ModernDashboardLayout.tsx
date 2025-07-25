import React from 'react';
import { User, UserRole } from '../../types/auth';
import { IconSparkles, IconTrendingUp } from '@tabler/icons-react';
import Container from '../UI/Container';

interface ModernDashboardLayoutProps {
  user: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  children: React.ReactNode;
  title: string;
  subtitle: string;
  stats?: Array<{
    label: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  }>;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  user,
  activeRole,
  onRoleChange,
  children,
  title,
  subtitle,
  stats = []
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.HOME_OWNER:
        return 'Property Owner';
      case UserRole.HOME_SEEKER:
        return 'Home Seeker';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Container size="xl" className="py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            </div>

            <div className="relative glass-card rounded-3xl p-8 border border-white/20 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <IconSparkles size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        {getGreeting()}, {user.firstName}!
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleDisplayName(activeRole)} Dashboard
                      </p>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {title}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                {/* Quick Stats Preview */}
                {stats.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {stats.slice(0, 3).map((stat, index) => (
                      <div
                        key={index}
                        className="glass-card p-4 rounded-2xl border border-white/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className={`text-2xl font-bold mb-1 ${
                            stat.color === 'blue' ? 'text-blue-600' :
                            stat.color === 'green' ? 'text-green-600' :
                            stat.color === 'yellow' ? 'text-yellow-600' :
                            stat.color === 'purple' ? 'text-purple-600' :
                            'text-red-600'
                          }`}>
                            {stat.value}
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            {stat.label}
                          </p>
                          {stat.change !== undefined && (
                            <div className={`flex items-center justify-center mt-1 text-xs ${
                              stat.trend === 'up' ? 'text-green-600' :
                              stat.trend === 'down' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              <IconTrendingUp 
                                size={12} 
                                className={`mr-1 ${
                                  stat.trend === 'down' ? 'rotate-180' : ''
                                }`} 
                              />
                              {Math.abs(stat.change)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ModernDashboardLayout;