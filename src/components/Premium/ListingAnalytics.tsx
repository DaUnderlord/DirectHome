import React, { useEffect, useState } from 'react';
import { 
  IconEye, 
  IconMessageCircle, 
  IconHeart,
  IconShare,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
  IconMap,
  IconPhoto,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconDownload
} from '@tabler/icons-react';
import { usePremiumStore } from '../../store/premiumStore';
import { AnalyticsQuery } from '../../types/premium';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface ListingAnalyticsProps {
  propertyId: string;
  promotionId?: string;
  className?: string;
}

const ListingAnalytics: React.FC<ListingAnalyticsProps> = ({
  propertyId,
  promotionId,
  className = ''
}) => {
  const { 
    listingAnalytics,
    fetchListingAnalytics,
    isLoading 
  } = usePremiumStore();

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });

  const analytics = listingAnalytics[propertyId];

  useEffect(() => {
    const query: AnalyticsQuery = {
      propertyId,
      promotionId,
      startDate: dateRange.start,
      endDate: dateRange.end
    };
    
    fetchListingAnalytics(query);
  }, [fetchListingAnalytics, propertyId, promotionId, dateRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <IconTrendingUp size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">
          Analytics data will appear here once your property starts receiving views.
        </p>
      </Card>
    );
  }

  const metricCards = [
    {
      title: 'Total Views',
      value: formatNumber(analytics.metrics.views),
      change: analytics.performance.viewsGrowth,
      icon: IconEye,
      color: 'blue'
    },
    {
      title: 'Inquiries',
      value: analytics.metrics.inquiries.toString(),
      change: analytics.performance.inquiriesGrowth,
      icon: IconMessageCircle,
      color: 'green'
    },
    {
      title: 'Favorites',
      value: analytics.metrics.favorites.toString(),
      change: 0, // Would be calculated from historical data
      icon: IconHeart,
      color: 'red'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.performance.conversionRate}%`,
      change: 0, // Would be calculated from historical data
      icon: IconTrendingUp,
      color: 'purple'
    }
  ];

  const engagementMetrics = [
    { label: 'Phone Clicks', value: analytics.metrics.phoneClicks, icon: IconPhone },
    { label: 'Email Clicks', value: analytics.metrics.emailClicks, icon: IconMail },
    { label: 'WhatsApp Clicks', value: analytics.metrics.whatsappClicks, icon: IconBrandWhatsapp },
    { label: 'Map Views', value: analytics.metrics.mapViews, icon: IconMap },
    { label: 'Photo Views', value: analytics.metrics.photoViews, icon: IconPhoto },
    { label: 'Shares', value: analytics.metrics.shares, icon: IconShare }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Listing Analytics</h2>
          <p className="text-gray-600">
            Performance data for the last 30 days
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <IconCalendar size={16} />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <IconDownload size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <Card key={metric.title} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                  <Icon size={20} className={`text-${metric.color}-600`} />
                </div>
                {metric.change !== 0 && (
                  <div className={`flex items-center space-x-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
                    <span className="text-sm font-medium">
                      {formatPercentage(metric.change)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.title}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
          <div className="space-y-4">
            {engagementMetrics.map((metric) => {
              const Icon = metric.icon;
              const percentage = (metric.value / analytics.metrics.views) * 100;
              
              return (
                <div key={metric.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">{metric.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {metric.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. View Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDuration(analytics.performance.avgViewDuration)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {(analytics.performance.bounceRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Engagement Score</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.performance.engagementScore}/100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unique Views</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(analytics.metrics.uniqueViews)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Groups */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Groups</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.ageGroups).map(([age, percentage]) => (
              <div key={age} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{age}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Locations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.locations).map(([location, percentage]) => (
              <div key={location} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{location}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.devices).map(([device, percentage]) => (
              <div key={device} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{device}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Comparison */}
      {analytics.comparison && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.comparison.beforePromotion && (
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Before Promotion</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(analytics.comparison.beforePromotion.views || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {analytics.comparison.beforePromotion.inquiries || 0}
                    </div>
                    <div className="text-xs text-gray-500">Inquiries</div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Current Period</h4>
              <div className="space-y-2">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(analytics.metrics.views)}
                  </div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {analytics.metrics.inquiries}
                  </div>
                  <div className="text-xs text-gray-500">Inquiries</div>
                </div>
              </div>
            </div>

            {analytics.comparison.similarListings && (
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Similar Listings Avg.</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(analytics.comparison.similarListings.views || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {analytics.comparison.similarListings.inquiries || 0}
                    </div>
                    <div className="text-xs text-gray-500">Inquiries</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ListingAnalytics;