import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconMap, 
  IconTrendingUp, 
  IconTrendingDown,
  IconHome,
  IconCurrencyNaira,
  IconMapPin,
  IconChartBar,
  IconRefresh,
  IconArrowRight
} from '@tabler/icons-react';
import { Property } from '../../types/property';
import { useProperty } from '../../hooks/useProperty';

interface MarketInsight {
  area: string;
  averagePrice: number;
  propertyCount: number;
  priceChange: number;
  trend: 'up' | 'down' | 'stable';
  popularType: string;
}

interface MapInsightsWidgetProps {
  userLocation?: string;
  favoriteAreas?: string[];
  className?: string;
}

const MapInsightsWidget: React.FC<MapInsightsWidgetProps> = ({
  userLocation = 'Lagos',
  favoriteAreas = ['Victoria Island', 'Lekki', 'Ikeja'],
  className = ''
}) => {
  const { properties, loading } = useProperty();
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(favoriteAreas[0] || 'Lagos');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate market insights from properties data
  useEffect(() => {
    if (!properties || properties.length === 0) return;

    const generateInsights = () => {
      const areaInsights: MarketInsight[] = [];
      
      // Group properties by area (using city as area for simplicity)
      const areaGroups = properties.reduce((groups: Record<string, Property[]>, property: Property) => {
        const area = property.location.city;
        if (!groups[area]) {
          groups[area] = [];
        }
        groups[area].push(property);
        return groups;
      }, {} as Record<string, Property[]>);

      // Calculate insights for each area
      Object.entries(areaGroups).forEach(([area, areaProperties]: [string, Property[]]) => {
        if (areaProperties.length === 0) return;

        const prices = areaProperties.map((p: Property) => p.pricing.price);
        const averagePrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
        
        // Calculate property type distribution
        const typeCount = areaProperties.reduce((count: Record<string, number>, property: Property) => {
          count[property.propertyType] = (count[property.propertyType] || 0) + 1;
          return count;
        }, {} as Record<string, number>);
        
        const popularType = Object.entries(typeCount)
          .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)[0]?.[0] || 'apartment';

        // Mock price change calculation (in real app, compare with historical data)
        const priceChange = (Math.random() - 0.5) * 20; // Random between -10% and +10%
        const trend: 'up' | 'down' | 'stable' = 
          priceChange > 3 ? 'up' : 
          priceChange < -3 ? 'down' : 'stable';

        areaInsights.push({
          area,
          averagePrice,
          propertyCount: areaProperties.length,
          priceChange,
          trend,
          popularType
        });
      });

      // Sort by property count and take top areas
      areaInsights.sort((a, b) => b.propertyCount - a.propertyCount);
      setInsights(areaInsights.slice(0, 6));
    };

    generateInsights();
  }, [properties]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

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

  // Get trend icon and color
  const getTrendDisplay = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'up') {
      return {
        icon: IconTrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: `+${change.toFixed(1)}%`
      };
    } else if (trend === 'down') {
      return {
        icon: IconTrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: `${change.toFixed(1)}%`
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

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconMap className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
            >
              <IconRefresh className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <Link
              to="/rent-calculator?tab=market-map"
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Map
            </Link>
          </div>
        </div>
      </div>

      {/* Area Selector */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <IconMapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Focus Area</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {favoriteAreas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedArea === area
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="p-6">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <IconChartBar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No market data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.slice(0, 4).map((insight, index) => {
              const trendDisplay = getTrendDisplay(insight.trend, insight.priceChange);
              const TrendIcon = trendDisplay.icon;
              
              return (
                <div
                  key={insight.area}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                    insight.area === selectedArea
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedArea(insight.area)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{insight.area}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {insight.propertyCount} properties
                      </span>
                    </div>
                    
                    <div className={`flex items-center px-2 py-1 rounded-full ${trendDisplay.bgColor}`}>
                      <TrendIcon className={`w-3 h-3 mr-1 ${trendDisplay.color}`} />
                      <span className={`text-xs font-medium ${trendDisplay.color}`}>
                        {trendDisplay.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <IconCurrencyNaira className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(insight.averagePrice)}
                        </span>
                        <span className="text-xs text-gray-500">avg</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <IconHome className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 capitalize">
                          {insight.popularType}s
                        </span>
                      </div>
                    </div>
                    
                    <IconArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          
          <Link
            to="/rent-calculator?tab=market-map"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>Explore full map</span>
            <IconArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapInsightsWidget;