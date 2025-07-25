import React, { useState, useEffect, useMemo } from 'react';
import {
  IconMap,
  IconTrendingUp,
  IconHome,
  IconCurrencyNaira,
  IconInfoCircle,
  IconBookmark,
  IconBookmarkFilled,
  IconAdjustments,
  IconX
} from '@tabler/icons-react';
import { Property } from '../../types/property';
import { useProperty } from '../../hooks/useProperty';
import { usePropertyFavorites } from '../../hooks/usePropertyFavorites';
import { useMapVisualization } from '../../hooks/useMapVisualization';
import { useIsMobile } from '../../hooks/useMediaQuery';
import MarketMapView from '../Map/MarketMapView';
import MapControlPanel from '../Map/MapControlPanel';
import PropertyDetailsPanel from '../Map/PropertyDetailsPanel';
import MarketAnalyticsSidebar from '../Map/MarketAnalyticsSidebar';

interface MarketMapCalculatorProps {
  initialProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

const MarketMapCalculator: React.FC<MarketMapCalculatorProps> = ({
  initialProperty,
  onPropertySelect,
  className = ''
}) => {
  const { properties, loading, error } = useProperty();
  const allProperties = properties || [];
  const { toggleFavorite, isFavorite } = usePropertyFavorites();
  const isMobile = useIsMobile();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(initialProperty || null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(!isMobile); // Default collapsed on mobile
  const [showFilters, setShowFilters] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Initialize map visualization hook
  const {
    mapState,
    setMapState,
    filters,
    setFilters,
    filteredProperties,
    searchLocation,
    focusOnProperty,
    getPropertiesInBounds,
    isLoading: mapLoading,
    error: mapError,
    lastSyncTime,
    syncedPropertiesCount
  } = useMapVisualization({
    properties: allProperties,
    initialCenter: [3.3792, 6.5244], // Lagos, Nigeria
    initialZoom: 10
  });

  // Focus on initial property if provided
  useEffect(() => {
    if (initialProperty && initialProperty.location.coordinates) {
      focusOnProperty(initialProperty);
      setSelectedProperty(initialProperty);
      setShowDetailsPanel(true);
    }
  }, [initialProperty, focusOnProperty]);

  // Handle property selection from map
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsPanel(true);
    onPropertySelect?.(property);
  };

  // Handle property favorite toggle
  const handleFavoriteToggle = (propertyId: string) => {
    const property = filteredProperties.find(p => p.id === propertyId);
    if (property) {
      toggleFavorite(property);
    }
  };

  // Handle location search
  const handleLocationSearch = async (query: string) => {
    try {
      await searchLocation(query);
    } catch (error) {
      console.error('Location search failed:', error);
    }
  };

  // Handle area selection for analytics
  const handleAreaSelect = (bounds: mapboxgl.LngLatBounds) => {
    setMapState({
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      }
    });
  };

  // Get properties in current view for analytics
  const visibleProperties = useMemo(() => {
    return getPropertiesInBounds();
  }, [getPropertiesInBounds]);

  // Calculate quick stats for the header
  const quickStats = useMemo(() => {
    if (!filteredProperties.length) {
      return { total: 0, avgPrice: 0, priceRange: { min: 0, max: 0 } };
    }

    const prices = filteredProperties.map(p => p.pricing.price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      total: filteredProperties.length,
      avgPrice,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [filteredProperties]);

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    } else {
      return `₦${price.toLocaleString()}`;
    }
  };

  if (loading || mapLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading market map...</p>
        </div>
      </div>
    );
  }

  if (error || mapError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <IconInfoCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load market data</p>
          <p className="text-gray-500 text-sm">{error || mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <IconMap className="w-6 h-6 text-blue-600" />
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
              {isMobile ? 'Market Map' : 'Market Map Explorer'}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sync Status Indicator - Hidden on mobile */}
            {lastSyncTime && !isMobile && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live • {syncedPropertiesCount} synced</span>
              </div>
            )}

            {/* Mobile Filter Toggle */}
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${showFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                aria-label="Toggle filters"
              >
                <IconAdjustments className="w-4 h-4" />
              </button>
            )}

            {/* Analytics Toggle - Desktop only */}
            {!isMobile && (
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${showAnalytics
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                aria-label="Toggle analytics"
              >
                Analytics
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Total Properties</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>{quickStats.total}</p>
              </div>
              <IconHome className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-600`} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Average Price</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>{formatPrice(quickStats.avgPrice)}</p>
              </div>
              <IconCurrencyNaira className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-green-600`} />
            </div>
          </div>

          {!isMobile && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Price Range</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(quickStats.priceRange.min)} - {formatPrice(quickStats.priceRange.max)}
                  </p>
                </div>
                <IconTrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Interface */}
      <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-6'}`}>
        {/* Map Controls - Mobile: Conditional, Desktop: Always visible */}
        {isMobile ? (
          showFilters && (
            <MapControlPanel
              filters={filters}
              onFiltersChange={setFilters}
              onLocationSearch={handleLocationSearch}
              isMobile={isMobile}
              isCollapsed={!showFilters}
              onToggleCollapse={() => setShowFilters(!showFilters)}
              className="mb-4"
            />
          )
        ) : (
          <div className="lg:col-span-1">
            <MapControlPanel
              filters={filters}
              onFiltersChange={setFilters}
              onLocationSearch={handleLocationSearch}
              isMobile={isMobile}
              className="sticky top-4"
            />
          </div>
        )}

        {/* Map View */}
        <div className={`${isMobile ? '' : showAnalytics ? 'lg:col-span-2' : 'lg:col-span-3'} relative`}>
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden" 
            style={{ height: isMobile ? '70vh' : '600px' }}
          >
            <MarketMapView
              properties={filteredProperties}
              center={mapState.center}
              zoom={mapState.zoom}
              showHeatmap={filters.showHeatmap}
              showPropertyMarkers={filters.showPropertyMarkers}
              filters={filters}
              onPropertySelect={handlePropertySelect}
              onAreaSelect={handleAreaSelect}
              isMobile={isMobile}
              isFullscreen={isMapFullscreen}
              onFullscreenToggle={() => setIsMapFullscreen(!isMapFullscreen)}
              className="h-full"
            />
          </div>

          {/* Selected Property Quick Info */}
          {selectedProperty && !showDetailsPanel && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedProperty.title}</h4>
                  <p className="text-sm text-gray-600">{selectedProperty.location.city}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(selectedProperty.pricing.price)}
                    {selectedProperty.listingType === 'rent' && '/month'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFavoriteToggle(selectedProperty.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isFavorite(selectedProperty.id) ? (
                      <IconBookmarkFilled className="w-5 h-5 text-red-500" />
                    ) : (
                      <IconBookmark className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setShowDetailsPanel(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Sidebar - Desktop only */}
        {showAnalytics && !isMobile && (
          <div className="lg:col-span-1">
            <MarketAnalyticsSidebar
              properties={visibleProperties}
              selectedArea="Current View"
              mapBounds={mapState.bounds}
              className="sticky top-4"
            />
          </div>
        )}
      </div>

      {/* Property Details Panel Modal */}
      {showDetailsPanel && selectedProperty && (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${isMobile ? 'flex items-end' : 'flex items-center justify-center'} p-4`}>
          <div className={`bg-white ${isMobile ? 'rounded-t-xl w-full' : 'rounded-xl max-w-2xl w-full'} shadow-2xl max-h-[90vh] overflow-hidden`}>
            <PropertyDetailsPanel
              property={selectedProperty}
              onClose={() => setShowDetailsPanel(false)}
              onFavoriteToggle={handleFavoriteToggle}
              onScheduleViewing={(propertyId) => {
                console.log('Schedule viewing for:', propertyId);
                // Integrate with appointment system
              }}
              onContactOwner={(propertyId) => {
                console.log('Contact owner for:', propertyId);
                // Integrate with messaging system
              }}
              isFavorite={isFavorite(selectedProperty.id)}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Mobile Analytics Bottom Sheet */}
      {isMobile && showAnalytics && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-xl shadow-2xl z-40 max-h-[50vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Market Analytics</h3>
            <button
              onClick={() => setShowAnalytics(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close analytics"
            >
              <IconX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto">
            <MarketAnalyticsSidebar
              properties={visibleProperties}
              selectedArea="Current View"
              mapBounds={mapState.bounds}
              className="p-4"
            />
          </div>
        </div>
      )}

      {/* Help Text */}
      {!isMobile && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <IconInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to use the Market Map:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Use filters to narrow down properties by type, price, and features</li>
                <li>• Click on property markers to view details and pricing</li>
                <li>• Toggle heatmap to see price distribution across areas</li>
                <li>• Search for specific locations using the search bar</li>
                <li>• View market analytics for the current map area</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Help - Compact Version */}
      {isMobile && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <IconInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Quick Tips:</p>
              <p className="text-blue-700">
                Tap markers for details • Use filter button for options • Pinch to zoom
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketMapCalculator;