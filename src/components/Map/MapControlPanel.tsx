import React, { useState } from 'react';
import { 
  IconFilter, 
  IconX, 
  IconHome, 
  IconBuilding, 
  IconBuildingSkyscraper,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconMapPin,
  IconStar
} from '@tabler/icons-react';
import { PropertyType, ListingType } from '../../types/property';
import { MapFilters } from './MarketMapView';

export interface MapControlPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: Partial<MapFilters>) => void;
  onLocationSearch?: (query: string) => void;
  className?: string;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const MapControlPanel: React.FC<MapControlPanelProps> = ({
  filters,
  onFiltersChange,
  onLocationSearch,
  className = '',
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile); // Default expanded on desktop, collapsed on mobile
  const [searchQuery, setSearchQuery] = useState('');

  // Property type options
  const propertyTypeOptions = [
    { value: PropertyType.HOUSE, label: 'Houses', icon: IconHome, color: 'text-green-600' },
    { value: PropertyType.APARTMENT, label: 'Apartments', icon: IconBuilding, color: 'text-blue-600' },
    { value: PropertyType.CONDO, label: 'Condos', icon: IconBuildingSkyscraper, color: 'text-purple-600' }
  ];

  // Listing type options
  const listingTypeOptions = [
    { value: ListingType.RENT, label: 'For Rent' },
    { value: ListingType.SALE, label: 'For Sale' }
  ];

  // Bedroom options
  const bedroomOptions = [1, 2, 3, 4, 5];

  // Handle property type toggle
  const handlePropertyTypeToggle = (type: PropertyType) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({ propertyTypes: newTypes });
  };

  // Handle listing type toggle
  const handleListingTypeToggle = (type: ListingType) => {
    const currentTypes = filters.listingTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({ listingTypes: newTypes });
  };

  // Handle bedroom toggle
  const handleBedroomToggle = (bedrooms: number) => {
    const currentBedrooms = filters.bedrooms || [];
    const newBedrooms = currentBedrooms.includes(bedrooms)
      ? currentBedrooms.filter(b => b !== bedrooms)
      : [...currentBedrooms, bedrooms];
    
    onFiltersChange({ bedrooms: newBedrooms });
  };

  // Handle price range change
  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value.replace(/,/g, ''));
    onFiltersChange({
      priceRange: {
        ...filters.priceRange,
        [field]: numValue
      }
    });
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Handle location search
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLocationSearch && searchQuery.trim()) {
      onLocationSearch(searchQuery.trim());
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      propertyTypes: [],
      listingTypes: [],
      bedrooms: [],
      priceRange: { min: 0, max: 0 },
      showHeatmap: true,
      showPropertyMarkers: true
    });
  };

  // Count active filters
  const activeFilterCount = (
    (filters.propertyTypes?.length || 0) +
    (filters.listingTypes?.length || 0) +
    (filters.bedrooms?.length || 0) +
    (filters.priceRange?.min > 0 ? 1 : 0) +
    (filters.priceRange?.max > 0 ? 1 : 0)
  );

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 ${className} ${isMobile && isCollapsed ? 'fixed bottom-4 left-4 right-4 z-40' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <IconFilter className="w-5 h-5 text-gray-600" />
          <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 'Filters' : 'Map Filters'}
          </h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (isMobile && onToggleCollapse) {
                onToggleCollapse();
              }
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <IconX className="w-4 h-4" /> : <IconFilter className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Location Search */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleLocationSearch} className="flex space-x-2">
          <div className="flex-1 relative">
            <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMobile ? "Search..." : "Search location..."}
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${isMobile ? 'text-base' : ''}`}
              aria-label="Search for a location"
              list="location-suggestions"
            />
            
            {/* Basic autocomplete datalist */}
            <datalist id="location-suggestions">
              <option value="Victoria Island" />
              <option value="Lekki Phase 1" />
              <option value="Ikeja GRA" />
              <option value="Ikoyi" />
              <option value="Surulere" />
              <option value="Yaba" />
              <option value="Ajah" />
              <option value="Magodo" />
            </datalist>
          </div>
          <button
            type="submit"
            className={`${isMobile ? 'px-3' : 'px-4'} py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
            aria-label="Search location"
          >
            <IconSearch className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Map Display Options */}
      <div className="p-4 border-b border-gray-200">
        <h4 className={`font-medium text-gray-900 mb-3 ${isMobile ? 'text-sm' : 'text-sm'}`}>Display Options</h4>
        <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showHeatmap}
              onChange={(e) => onFiltersChange({ showHeatmap: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-describedby="heatmap-description"
            />
            <span className="ml-2 text-sm text-gray-700 flex items-center">
              {filters.showHeatmap ? <IconEye className="w-4 h-4 mr-1" /> : <IconEyeOff className="w-4 h-4 mr-1" />}
              {isMobile ? 'Heat Map' : 'Price Heat Map'}
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showPropertyMarkers}
              onChange={(e) => onFiltersChange({ showPropertyMarkers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-describedby="markers-description"
            />
            <span className="ml-2 text-sm text-gray-700 flex items-center">
              {filters.showPropertyMarkers ? <IconEye className="w-4 h-4 mr-1" /> : <IconEyeOff className="w-4 h-4 mr-1" />}
              {isMobile ? 'Markers' : 'Property Markers'}
            </span>
          </label>
        </div>
        
        {/* Hidden descriptions for screen readers */}
        <div className="sr-only">
          <div id="heatmap-description">Shows price distribution as colored areas on the map</div>
          <div id="markers-description">Shows individual property locations as clickable markers</div>
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="p-4 border-b border-gray-200">
        <h4 className={`font-medium text-gray-900 mb-3 ${isMobile ? 'text-sm' : 'text-sm'}`}>Quick Filters</h4>
        <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
          <button
            onClick={() => onFiltersChange({
              propertyTypes: [PropertyType.HOUSE, PropertyType.APARTMENT],
              priceRange: { min: 0, max: 2000000 },
              listingTypes: [ListingType.SALE]
            })}
            className="flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
          >
            <IconHome className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium">Affordable</span>
          </button>
          
          <button
            onClick={() => onFiltersChange({
              propertyTypes: [PropertyType.APARTMENT, PropertyType.CONDO],
              listingTypes: [ListingType.RENT]
            })}
            className="flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
          >
            <IconBuilding className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium">Rentals</span>
          </button>
          
          {!isMobile && (
            <>
              <button
                onClick={() => onFiltersChange({
                  bedrooms: [3, 4, 5],
                  propertyTypes: [PropertyType.HOUSE]
                })}
                className="flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
              >
                <IconHome className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium">Family Homes</span>
              </button>
              
              <button
                onClick={() => onFiltersChange({
                  priceRange: { min: 10000000, max: 0 }
                })}
                className="flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
              >
                <IconStar className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium">Luxury</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className={`space-y-4 p-4 ${isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
          {/* Property Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Property Types</h4>
            <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 gap-2'}`}>
              {propertyTypeOptions.map(option => {
                const Icon = option.icon;
                const isSelected = filters.propertyTypes?.includes(option.value);
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handlePropertyTypeToggle(option.value)}
                    className={`flex items-center ${isMobile ? 'p-3' : 'p-2'} rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${option.label}`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isSelected ? 'text-blue-600' : option.color}`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                      {isMobile ? option.label.replace('s', '') : option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listing Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Listing Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {listingTypeOptions.map(option => {
                const isSelected = filters.listingTypes?.includes(option.value);
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleListingTypeToggle(option.value)}
                    className={`${isMobile ? 'p-3' : 'p-2'} rounded-lg border ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${option.label}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h4>
            <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}>
              {bedroomOptions.map(bedrooms => {
                const isSelected = filters.bedrooms?.includes(bedrooms);
                
                return (
                  <button
                    key={bedrooms}
                    onClick={() => handleBedroomToggle(bedrooms)}
                    className={`${isMobile ? 'p-3' : 'p-2'} rounded-lg border ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${bedrooms} or more bedrooms`}
                  >
                    {bedrooms}+
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range (₦)</h4>
            <div className={`grid grid-cols-2 gap-3 ${isMobile ? 'gap-2' : ''}`}>
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="min-price">Min Price</label>
                <input
                  id="min-price"
                  type="text"
                  value={filters.priceRange?.min ? formatNumber(filters.priceRange.min) : ''}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  placeholder="0"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMobile ? 'text-base' : 'text-sm'}`}
                  aria-label="Minimum price filter"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="max-price">Max Price</label>
                <input
                  id="max-price"
                  type="text"
                  value={filters.priceRange?.max ? formatNumber(filters.priceRange.max) : ''}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  placeholder="No limit"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMobile ? 'text-base' : 'text-sm'}`}
                  aria-label="Maximum price filter"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControlPanel;