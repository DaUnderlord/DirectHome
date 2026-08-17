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
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
  }>;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  user,
  activeRole,
  onRoleChange: _onRoleChange,
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
    <div className="min-h-screen bg-paper-100">
      <Container size="xl" className="py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="border border-paper-200 bg-paper-50 p-5 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-courtyard-700">
                    <IconSparkles size={22} className="text-paper-50" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-600 font-medium">
                      {getGreeting()}, {user.firstName}!
                    </p>
                    <p className="text-xs text-ink-400">
                      {getRoleDisplayName(activeRole)} dashboard
                    </p>
                  </div>
                </div>
                  
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink-950 mb-2 leading-tight">
                  {title}
                </h1>
                <p className="text-ink-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {stats.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div
                      key={index}
                      className="border border-paper-200 bg-paper-100 p-4 text-center"
                    >
                      <div className="text-2xl font-display font-semibold mb-1 text-courtyard-700">
                        {stat.value}
                      </div>
                      <p className="text-xs text-ink-400 font-medium">
                        {stat.label}
                      </p>
                      {stat.change !== undefined && (
                        <div className={`flex items-center justify-center mt-1 text-xs ${
                          stat.trend === 'up' ? 'text-courtyard-600' :
                          stat.trend === 'down' ? 'text-laterite-600' :
                          'text-ink-400'
                        }`}>
                          <IconTrendingUp 
                            size={12} 
                            className={`mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} 
                          />
                          {Math.abs(stat.change)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ModernDashboardLayout;
