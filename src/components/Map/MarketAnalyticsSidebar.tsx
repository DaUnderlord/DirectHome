import React, { useMemo } from 'react';
import { Property } from '../../types/property';
import { 
  IconTrendingUp, 
  IconTrendingDown,
  IconHome,
  IconBuilding,
  IconBuildingSkyscraper,
  IconCurrencyNaira,
  IconCalendar,
  IconMapPin,
  IconChartBar,
  IconUsers,
  IconClock
} from '@tabler/icons-react';

export interface MarketAnalyticsSidebarProps {
  properties: Property[];
  selectedArea?: string;
  mapBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  className?: string;
}

interface MarketStats {
  totalProperties: number;
  averagePrice: number;
  medianPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: {
    [key: string]: number;
  };
  listingTypes: {
    rent: number;
    sale: number;
  };
  pricePerSqft: number;
  daysOnMarket: number;
  priceChange: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  popularAmenities: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

const MarketAnalyticsSidebar: React.FC<MarketAnalyticsSidebarProps> = ({
  properties,
  selectedArea = 'Selected Area',
  mapBounds,
  className = ''
}) => {
  // Calculate market statistics
  const marketStats = useMemo((): MarketStats => {
    if (properties.length === 0) {
      return {
        totalProperties: 0,
        averagePrice: 0,
        medianPrice: 0,
        priceRange: { min: 0, max: 0 },
        propertyTypes: {},
        listingTypes: { rent: 0, sale: 0 },
        pricePerSqft: 0,
        daysOnMarket: 0,
        priceChange: { percentage: 0, trend: 'stable' },
        popularAmenities: []
      };
    }

    // Basic stats
    const totalProperties = properties.length;
    const prices = properties.map(p => p.pricing.price).sort((a, b) => a - b);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const medianPrice = prices[Math.floor(prices.length / 2)];
    const priceRange = { min: prices[0], max: prices[prices.length - 1] };

    // Property types
    const propertyTypes: { [key: string]: number } = {};
    properties.forEach(property => {
      propertyTypes[property.type] = (propertyTypes[property.type] || 0) + 1;
    });

    // Listing types
    const listingTypes = {
      rent: properties.filter(p => p.listingType === 'rent').length,
      sale: properties.filter(p => p.listingType === 'sale').length
    };

    // Price per square foot
    const validAreaProperties = properties.filter(p => p.features.area > 0);
    const pricePerSqft = validAreaProperties.length > 0
      ? validAreaProperties.reduce((sum, p) => sum + (p.pricing.price / p.features.area), 0) / validAreaProperties.length
      : 0;

    // Days on market (mock calculation)
    const now = new Date();
    const daysOnMarket = properties.reduce((sum, property) => {
      const listingDate = new Date(property.createdAt);
      const days = Math.floor((now.getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / properties.length;

    // Price change (mock data - in real app would compare with historical data)
    const priceChange = {
      percentage: Math.random() * 10 - 5, // Random between -5% and +5%
      trend: 'stable' as 'up' | 'down' | 'stable'
    };
    if (priceChange.percentage > 2) priceChange.trend = 'up';
    else if (priceChange.percentage < -2) priceChange.trend = 'down';

    // Popular amenities
    const amenityCount: { [key: string]: number } = {};
    properties.forEach(property => {
      property.features.amenities?.forEach(amenity => {
        amenityCount[amenity] = (amenityCount[amenity] || 0) + 1;
      });
    });

    const popularAmenities = Object.entries(amenityCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalProperties) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProperties,
      averagePrice,
      medianPrice,
      priceRange,
      propertyTypes,
      listingTypes,
      pricePerSqft,
      daysOnMarket,
      priceChange,
      popularAmenities
    };
  }, [properties]);

  // Format price
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    } else {
      return `₦${price.toLocaleString()}`;
    }
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return IconHome;
      case 'apartment':
        return IconBuilding;
      case 'condo':
        return IconBuildingSkyscraper;
      default:
        return IconHome;
    }
  };

  // Get trend icon and color
  const getTrendDisplay = (trend: 'up' | 'down' | 'stable', percentage: number) => {
    if (trend === 'up') {
      return {
        icon: IconTrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: `+${percentage.toFixed(1)}%`
      };
    } else if (trend === 'down') {
      return {
        icon: IconTrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: `${percentage.toFixed(1)}%`
      };
    } else {
      return {
        icon: IconTrendingUp,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        text: '0.0%'
      };
    }
  };

  const trendDisplay = getTrendDisplay(marketStats.priceChange.trend, marketStats.priceChange.percentage);
  const TrendIcon = trendDisplay.icon;

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <IconChartBar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Market Analytics</h3>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <IconMapPin className="w-4 h-4 mr-1" />
          <span>{selectedArea}</span>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Properties</p>
                <p className="text-lg font-bold text-blue-900">{marketStats.totalProperties}</p>
              </div>
              <IconHome className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">Avg. Price</p>
                <p className="text-lg font-bold text-green-900">
                  {formatPrice(marketStats.averagePrice)}
                </p>
              </div>
              <IconCurrencyNaira className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Price Statistics */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Price Analysis</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Median Price</span>
              <span className="font-medium">{formatPrice(marketStats.medianPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price Range</span>
              <span className="font-medium">
                {formatPrice(marketStats.priceRange.min)} - {formatPrice(marketStats.priceRange.max)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price/sqft</span>
              <span className="font-medium">₦{marketStats.pricePerSqft.toFixed(0)}</span>
            </div>

            {/* Price Trend */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Price Trend</span>
              <div className={`flex items-center px-2 py-1 rounded-full ${trendDisplay.bgColor}`}>
                <TrendIcon className={`w-4 h-4 mr-1 ${trendDisplay.color}`} />
                <span className={`text-sm font-medium ${trendDisplay.color}`}>
                  {trendDisplay.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Types Distribution */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Property Types</h4>
          <div className="space-y-2">
            {Object.entries(marketStats.propertyTypes).map(([type, count]) => {
              const IconComponent = getPropertyTypeIcon(type);
              const percentage = (count / marketStats.totalProperties) * 100;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Listing Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Listing Types</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-xs text-purple-600 font-medium">For Rent</p>
              <p className="text-lg font-bold text-purple-900">{marketStats.listingTypes.rent}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-xs text-orange-600 font-medium">For Sale</p>
              <p className="text-lg font-bold text-orange-900">{marketStats.listingTypes.sale}</p>
            </div>
          </div>
        </div>

        {/* Market Activity */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Market Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <IconClock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Avg. Days on Market</span>
              </div>
              <span className="font-medium">{Math.round(marketStats.daysOnMarket)} days</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <IconUsers className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Market Activity</span>
              </div>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* Popular Amenities */}
        {marketStats.popularAmenities.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Popular Amenities</h4>
            <div className="space-y-2">
              {marketStats.popularAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1">{amenity.name}</span>
                  <div className="flex items-center space-x-2 ml-2">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${amenity.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8">
                      {amenity.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <IconCalendar className="w-3 h-3 mr-1" />
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyticsSidebar;