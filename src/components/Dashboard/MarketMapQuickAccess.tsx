import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconMap, 
  IconSearch,
  IconBookmark,
  IconClock,
  IconTrendingUp,
  IconFilter,
  IconMapPin,
  IconArrowRight,
  IconHeart
} from '@tabler/icons-react';

interface QuickSearchArea {
  name: string;
  coordinates: [number, number];
  propertyCount: number;
  avgPrice: number;
  trending: boolean;
}

interface RecentSearch {
  query: string;
  timestamp: Date;
  resultCount: number;
}

interface MarketMapQuickAccessProps {
  recentSearches?: RecentSearch[];
  favoriteAreas?: QuickSearchArea[];
  trendingAreas?: QuickSearchArea[];
  className?: string;
}

const MarketMapQuickAccess: React.FC<MarketMapQuickAccessProps> = ({
  recentSearches = [
    { query: 'Victoria Island apartments', timestamp: new Date(Date.now() - 3600000), resultCount: 24 },
    { query: 'Lekki 3 bedroom houses', timestamp: new Date(Date.now() - 7200000), resultCount: 18 },
    { query: 'Ikeja affordable rent', timestamp: new Date(Date.now() - 86400000), resultCount: 42 }
  ],
  favoriteAreas = [
    { name: 'Victoria Island', coordinates: [3.4219, 6.4281], propertyCount: 156, avgPrice: 2500000, trending: true },
    { name: 'Lekki Phase 1', coordinates: [3.4700, 6.4474], propertyCount: 203, avgPrice: 1800000, trending: false },
    { name: 'Ikeja GRA', coordinates: [3.3515, 6.5966], propertyCount: 89, avgPrice: 1200000, trending: true }
  ],
  trendingAreas = [
    { name: 'Banana Island', coordinates: [3.4350, 6.4200], propertyCount: 45, avgPrice: 5000000, trending: true },
    { name: 'Ikoyi', coordinates: [3.4441, 6.4698], propertyCount: 78, avgPrice: 3200000, trending: true },
    { name: 'Ajah', coordinates: [3.5670, 6.4698], propertyCount: 134, avgPrice: 900000, trending: true }
  ],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'trending'>('recent');

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

  // Format time ago
  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Recently';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Recently';
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Generate map URL with area focus
  const getMapUrl = (area?: QuickSearchArea, search?: string) => {
    const baseUrl = '/rent-calculator?tab=market-map';
    if (area) {
      return `${baseUrl}&center=${area.coordinates[0]},${area.coordinates[1]}&zoom=14`;
    }
    if (search) {
      return `${baseUrl}&search=${encodeURIComponent(search)}`;
    }
    return baseUrl;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconMap className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Map Access</h3>
          </div>
          
          <Link
            to="/rent-calculator?tab=market-map"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <IconMap className="w-4 h-4" />
            <span>Open Map</span>
          </Link>
        </div>
      </div>

      {/* Quick Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <IconSearch className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Search</span>
        </div>
        
        <Link
          to="/rent-calculator?tab=market-map"
          className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
        >
          <IconSearch className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          <span className="text-gray-500 group-hover:text-gray-700">Search areas, property types, prices...</span>
          <IconArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'recent'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <IconClock className="w-4 h-4" />
              <span>Recent</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <IconHeart className="w-4 h-4" />
              <span>Saved</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'trending'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <IconTrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Recent Searches */}
        {activeTab === 'recent' && (
          <div className="space-y-3">
            {recentSearches.length === 0 ? (
              <div className="text-center py-8">
                <IconClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent searches</p>
              </div>
            ) : (
              recentSearches.map((search, index) => (
                <Link
                  key={index}
                  to={getMapUrl(undefined, search.query)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <IconSearch className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        {search.query}
                      </p>
                      <p className="text-xs text-gray-500">
                        {search.resultCount} results • {formatTimeAgo(search.timestamp)}
                      </p>
                    </div>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Favorite Areas */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {favoriteAreas.length === 0 ? (
              <div className="text-center py-8">
                <IconBookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No saved areas</p>
              </div>
            ) : (
              favoriteAreas.map((area, index) => (
                <Link
                  key={index}
                  to={getMapUrl(area)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <IconMapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{area.name}</p>
                        {area.trending && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Hot
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {area.propertyCount} properties • {formatPrice(area.avgPrice)} avg
                      </p>
                    </div>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Trending Areas */}
        {activeTab === 'trending' && (
          <div className="space-y-3">
            {trendingAreas.map((area, index) => (
              <Link
                key={index}
                to={getMapUrl(area)}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                    <span className="text-xs font-bold text-red-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{area.name}</p>
                      <IconTrendingUp className="w-3 h-3 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500">
                      {area.propertyCount} properties • {formatPrice(area.avgPrice)} avg
                    </p>
                  </div>
                </div>
                <IconArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/rent-calculator?tab=market-map&view=heatmap"
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
            >
              <IconTrendingUp className="w-3 h-3" />
              <span>Price Heatmap</span>
            </Link>
            
            <Link
              to="/rent-calculator?tab=market-map&filters=open"
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
            >
              <IconFilter className="w-3 h-3" />
              <span>Advanced Filters</span>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500">
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketMapQuickAccess;