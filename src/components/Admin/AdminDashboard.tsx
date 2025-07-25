import React, { useEffect } from 'react';
import {
  IconUsers,
  IconHome,
  IconCurrencyNaira,
  IconFlag,
  IconShieldCheck,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle
} from '@tabler/icons-react';
import { useAdminStore } from '../../store/adminStore';

const AdminDashboard: React.FC = () => {
  const { 
    dashboardMetrics, 
    fetchDashboardMetrics, 
    isLoading 
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardMetrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard metrics</p>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: dashboardMetrics.users.total.toLocaleString(),
      change: `+${dashboardMetrics.users.growthRate}%`,
      changeType: 'positive' as const,
      icon: IconUsers,
      color: 'blue',
      subtitle: `${dashboardMetrics.users.newThisMonth} new this month`
    },
    {
      title: 'Active Properties',
      value: dashboardMetrics.properties.active.toLocaleString(),
      change: `+${dashboardMetrics.properties.growthRate}%`,
      changeType: 'positive' as const,
      icon: IconHome,
      color: 'green',
      subtitle: `${dashboardMetrics.properties.pending} pending approval`
    },
    {
      title: 'Monthly Revenue',
      value: `₦${(dashboardMetrics.transactions.revenue / 1000).toFixed(0)}K`,
      change: `+${dashboardMetrics.transactions.revenueGrowth}%`,
      changeType: 'positive' as const,
      icon: IconCurrencyNaira,
      color: 'purple',
      subtitle: `${dashboardMetrics.transactions.thisMonth} transactions`
    },
    {
      title: 'Pending Reports',
      value: dashboardMetrics.reports.pending.toString(),
      change: dashboardMetrics.reports.critical > 0 ? `${dashboardMetrics.reports.critical} critical` : 'All resolved',
      changeType: dashboardMetrics.reports.critical > 0 ? 'negative' as const : 'neutral' as const,
      icon: IconFlag,
      color: 'red',
      subtitle: `${dashboardMetrics.reports.resolved} resolved this month`
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-blue-600 bg-blue-50';
      case 'green':
        return 'bg-green-500 text-green-600 bg-green-50';
      case 'purple':
        return 'bg-purple-500 text-purple-600 bg-purple-50';
      case 'red':
        return 'bg-red-500 text-red-600 bg-red-50';
      default:
        return 'bg-gray-500 text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const colorClasses = getColorClasses(metric.color).split(' ');
          
          return (
            <div key={metric.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[2]}`}>
                  <Icon size={24} className={colorClasses[1]} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metric.changeType === 'positive' && (
                    <IconTrendingUp size={16} className="text-green-500" />
                  )}
                  {metric.changeType === 'negative' && (
                    <IconTrendingDown size={16} className="text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 
                    metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <IconUsers size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <IconHome size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Property approved</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <IconFlag size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New report submitted</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-medium text-green-600">
                {dashboardMetrics.system.uptime}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-blue-600">
                {dashboardMetrics.system.responseTime}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-gray-600">
                {dashboardMetrics.system.errorRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Verifications</span>
              <span className="text-sm font-medium text-orange-600">
                {dashboardMetrics.verifications.pending}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {dashboardMetrics.reports.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <IconAlertTriangle size={20} className="text-red-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Critical Reports Require Attention
              </h4>
              <p className="text-sm text-red-700 mt-1">
                You have {dashboardMetrics.reports.critical} critical reports that need immediate review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;