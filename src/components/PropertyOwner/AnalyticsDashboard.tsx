import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconEye,
  IconMessage,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
  IconArrowLeft,
  IconStar,
  IconClock,
  IconChartBar
} from '@tabler/icons-react';
import Container from '../UI/Container';

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    properties,
    analytics,
    dashboardStats,
    isLoadingAnalytics,
    fetchAnalytics,
    fetchDashboardStats,
    fetchProperties
  } = usePropertyOwnerStore();

  useEffect(() => {
    const ownerId = user?.id || 'owner-1';
    fetchAnalytics(ownerId);
    fetchDashboardStats(ownerId);
    fetchProperties(ownerId);
  }, [user?.id, fetchAnalytics, fetchDashboardStats, fetchProperties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPropertyAnalytics = (propertyId: string) => {
    return analytics.find(a => a.propertyId === propertyId);
  };

  if (isLoadingAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IconArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Track your property performance and trends</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <IconEye size={24} />
              <IconTrendingUp size={20} />
            </div>
            <p className="text-blue-100 text-sm">Total Views</p>
            <p className="text-3xl font-bold">
              {analytics.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <IconMessage size={24} />
            </div>
            <p className="text-green-100 text-sm">Total Enquiries</p>
            <p className="text-3xl font-bold">
              {analytics.reduce((sum, a) => sum + a.enquiries, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <IconCalendar size={24} />
            </div>
            <p className="text-purple-100 text-sm">Total Viewings</p>
            <p className="text-3xl font-bold">
              {analytics.reduce((sum, a) => sum + a.viewings, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <IconUsers size={24} />
            </div>
            <p className="text-orange-100 text-sm">Applications</p>
            <p className="text-3xl font-bold">
              {analytics.reduce((sum, a) => sum + a.applications, 0)}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Avg. Conversion Rate</h3>
              <IconTrendingUp size={20} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {(analytics.reduce((sum, a) => sum + a.conversionRate, 0) / (analytics.length || 1)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Enquiry to rental conversion</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Avg. Time to Rent</h3>
              <IconClock size={20} className="text-blue-500" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {Math.round(analytics.reduce((sum, a) => sum + a.averageTimeToRent, 0) / (analytics.length || 1))} days
            </p>
            <p className="text-sm text-gray-500">From listing to tenant</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tenant Satisfaction</h3>
              <IconStar size={20} className="text-yellow-500" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {(analytics.reduce((sum, a) => sum + a.tenantSatisfaction, 0) / (analytics.length || 1)).toFixed(1)}
              <span className="text-lg text-gray-500">/5</span>
            </p>
            <p className="text-sm text-gray-500">Average rating</p>
          </div>
        </div>

        {/* Property Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Property Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Property</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Views</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Enquiries</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Viewings</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Applications</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Conversion</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => {
                  const propertyAnalytics = getPropertyAnalytics(property.id!);
                  return (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={property.media.images[0]?.url || 'https://via.placeholder.com/50'}
                            alt={property.basicInfo.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{property.basicInfo.title}</p>
                            <p className="text-sm text-gray-500">{property.location.lga}, {property.location.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{propertyAnalytics?.views || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{propertyAnalytics?.enquiries || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{propertyAnalytics?.viewings || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{propertyAnalytics?.applications || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (propertyAnalytics?.conversionRate || 0) >= 10
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {propertyAnalytics?.conversionRate || 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <IconStar size={16} className="text-yellow-500 mr-1" />
                          <span className="font-semibold">{propertyAnalytics?.tenantSatisfaction || '-'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Performing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <IconChartBar size={24} className="text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Top Performing Properties</h3>
            </div>
            <div className="space-y-4">
              {properties
                .sort((a, b) => {
                  const aViews = getPropertyAnalytics(a.id!)?.views || 0;
                  const bViews = getPropertyAnalytics(b.id!)?.views || 0;
                  return bViews - aViews;
                })
                .slice(0, 3)
                .map((property, index) => {
                  const propertyAnalytics = getPropertyAnalytics(property.id!);
                  return (
                    <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{property.basicInfo.title}</p>
                          <p className="text-sm text-gray-500">{propertyAnalytics?.views || 0} views</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-semibold">
                        {propertyAnalytics?.conversionRate || 0}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <h3 className="font-semibold text-xl mb-4">Tips to Improve Performance</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <span>Add more high-quality photos to increase views by up to 40%</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <span>Respond to enquiries within 1 hour for better conversion</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <span>Add a video walkthrough to stand out from competitors</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <span>Keep your pricing competitive with similar properties</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AnalyticsDashboard;
