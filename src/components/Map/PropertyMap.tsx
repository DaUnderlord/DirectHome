import React, { useState, useRef } from 'react';
import { 
  IconMaximize, 
  IconMinimize, 
  IconMapPin, 
  IconFilter,
  IconLayersIntersect,
  IconPencil,
  IconSearch,
  IconBuildingSkyscraper,
  IconHome,
  IconBuildingCottage,
  IconBuildingArch,
  IconInfoCircle,
  IconList,
  IconMap,
  IconAdjustments
} from '@tabler/icons-react';
import mapboxgl from 'mapbox-gl';
import MapView from './MapView';
import DrawSearchControl from './DrawSearchControl';
import { Property, PropertyType } from '../../types/property';
import PropertyCard from '../Property/PropertyCard';
import FilterPanel from '../Property/FilterPanel';
import { usePropertySearch, usePropertyFilters } from '../../hooks';

interface PropertyMapProps {
  properties?: Property[];
  initialCenter?: [number, number]; // [longitude, latitude]
  initialZoom?: number;
  height?: number | string;
  showFilters?: boolean;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties: initialProperties,
  initialCenter = [3.3792, 6.5244], // Default to Lagos, Nigeria
  initialZoom = 12,
  height = 600,
  showFilters = true,
  className = '',
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mapLayerDrawerOpen, setMapLayerDrawerOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState('streets-v11');
  const [activeTab, setActiveTab] = useState<string>('properties');
  const [visiblePropertyTypes, setVisiblePropertyTypes] = useState<Record<PropertyType, boolean>>({
    [PropertyType.HOUSE]: true,
    [PropertyType.APARTMENT]: true,
    [PropertyType.CONDO]: true,
    [PropertyType.TOWNHOUSE]: true,
    [PropertyType.LAND]: true,
    [PropertyType.COMMERCIAL]: true,
    [PropertyType.OTHER]: true
  });
  const [searchBounds, setSearchBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'split' | 'list'>('map');
  
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  // Use property filters hook
  const { 
    updateFilter, 
    applyFilters 
  } = usePropertyFilters();
  
  // Use property search hook if no properties are provided
  const { 
    properties: searchProperties, 
    isLoading, 
    search 
  } = usePropertySearch(
    {}, 
    initialProperties ? false : true
  );
  
  // Use provided properties or search results
  const properties = initialProperties || searchProperties;
  
  // Filter properties by visible types
  const filteredProperties = properties.filter(
    property => visiblePropertyTypes[property.propertyType]
  );
  
  // Handle map reference
  const handleMapLoaded = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };
  
  // Handle property marker click
  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };
  
  // Handle map bounds change
  const handleMapMoved = (bounds: mapboxgl.LngLatBounds) => {
    // Could update search filters based on map bounds
    console.log('Map bounds changed:', bounds.toString());
  };
  
  // Handle draw search bounds change
  const handleDrawBoundsChange = (bounds: mapboxgl.LngLatBounds) => {
    if (bounds.isEmpty()) {
      setSearchBounds(null);
      // Clear bounds filter
      updateFilter('bounds', undefined);
    } else {
      setSearchBounds(bounds);
      // Update bounds filter
      updateFilter('bounds', {
        southwest: {
          lat: bounds.getSouth(),
          lng: bounds.getWest()
        },
        northeast: {
          lat: bounds.getNorth(),
          lng: bounds.getEast()
        }
      });
    }
  };
  
  // Handle apply filters
  const handleApplyFilters = () => {
    applyFilters();
    search();
    setFilterDrawerOpen(false);
  };
  
  // Handle map style change
  const handleMapStyleChange = (style: string) => {
    setMapStyle(style);
    setMapLayerDrawerOpen(false);
  };
  
  // Handle property type visibility toggle
  const handlePropertyTypeToggle = (type: PropertyType) => {
    setVisiblePropertyTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Handle search within bounds
  const handleSearchInBounds = () => {
    if (searchBounds) {
      applyFilters();
      search();
    }
  };
  
  // Available map styles
  const mapStyles = [
    { id: 'streets-v11', name: 'Streets', icon: '🛣️' },
    { id: 'outdoors-v11', name: 'Outdoors', icon: '🏞️' },
    { id: 'light-v10', name: 'Light', icon: '☀️' },
    { id: 'dark-v10', name: 'Dark', icon: '🌙' },
    { id: 'satellite-v9', name: 'Satellite', icon: '🛰️' },
    { id: 'satellite-streets-v11', name: 'Satellite Streets', icon: '🌍' },
  ];
  
  // Property type icons
  const propertyTypeIcons = {
    [PropertyType.HOUSE]: <IconHome size={16} />,
    [PropertyType.APARTMENT]: <IconBuildingSkyscraper size={16} />,
    [PropertyType.CONDO]: <IconBuildingArch size={16} />,
    [PropertyType.TOWNHOUSE]: <IconBuildingCottage size={16} />,
    [PropertyType.LAND]: <IconMapPin size={16} />,
    [PropertyType.COMMERCIAL]: <IconBuildingSkyscraper size={16} />,
    [PropertyType.OTHER]: <IconBuildingSkyscraper size={16} />
  };

  return (
    <div 
      className={`border rounded-md ${className}`}
      style={{
        height: fullscreen ? '100vh' : height,
        position: fullscreen ? 'fixed' : 'relative',
        top: fullscreen ? 0 : 'auto',
        left: fullscreen ? 0 : 'auto',
        right: fullscreen ? 0 : 'auto',
        bottom: fullscreen ? 0 : 'auto',
        zIndex: fullscreen ? 1000 : 'auto',
      }}
    >
      {/* Map controls */}
      <div 
        className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-80 border-b border-gray-200"
      >
        <div className="flex items-center">
          <h4 className="text-lg font-semibold">Property Map</h4>
          <span className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {filteredProperties.length} Properties
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              className={`p-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('map')}
              title="Map view"
            >
              <IconMap size={18} />
            </button>
            <button
              className={`p-2 ${viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('split')}
              title="Split view"
            >
              <IconAdjustments size={18} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <IconList size={18} />
            </button>
          </div>
          
          {showFilters && (
            <button
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <IconFilter size={16} className="mr-1" />
              Filters
            </button>
          )}
          
          <button
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setMapLayerDrawerOpen(true)}
            title="Change map style"
          >
            <IconLayersIntersect size={18} />
          </button>
          
          <button
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
          </button>
        </div>
      </div>
      
      {/* Map and List Views */}
      <div className={`flex h-full ${viewMode === 'list' ? 'flex-col' : 'flex-row'}`}>
        {/* Map View - Hidden in list mode */}
        <div className={`
          ${viewMode === 'split' ? 'w-3/5' : 'w-full'}
          ${viewMode === 'list' ? 'hidden' : 'block'}
          h-full
        `}>
          <MapView
            properties={filteredProperties}
            center={initialCenter}
            zoom={initialZoom}
            height="100%"
            interactive={true}
            showMarkers={true}
            onMarkerClick={handleMarkerClick}
            onMapMoved={handleMapMoved}
            onMapLoaded={(map) => {
              handleMapLoaded(map);
            }}
            mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
          />
        </div>
        
        {/* List View - Shown in split or list mode */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`
            ${viewMode === 'split' ? 'w-2/5' : 'w-full'}
            ${viewMode === 'list' ? 'h-[calc(100%-60px)] mt-[60px]' : 'h-full'}
            overflow-y-auto p-4 bg-gray-50
            ${viewMode === 'split' ? 'border-l border-gray-200' : ''}
          `}>
            <div className="px-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Property Listings</h3>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {filteredProperties.length} Results
                </span>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No properties match your search criteria
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      compact={true}
                      onClick={() => {
                        setSelectedProperty(property);
                        // If in list view, switch to map view to see the property
                        if (viewMode === 'list') {
                          setViewMode('map');
                        }
                        // Center map on property
                        if (mapRef.current && property.location.latitude && property.location.longitude) {
                          mapRef.current.flyTo({
                            center: [property.location.longitude, property.location.latitude],
                            zoom: 15,
                            essential: true
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Map tools panel */}
      <div
        className="absolute top-20 left-2.5 z-10 w-[300px] max-w-[calc(100%-20px)] bg-white bg-opacity-95 border rounded-md p-4 shadow-md"
      >
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex items-center justify-center px-4 py-2 w-1/2 ${activeTab === 'properties' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('properties')}
            >
              <IconBuildingSkyscraper size={16} className="mr-1" />
              Properties
            </button>
            <button
              className={`flex items-center justify-center px-4 py-2 w-1/2 ${activeTab === 'draw' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('draw')}
            >
              <IconPencil size={16} className="mr-1" />
              Draw Search
            </button>
          </div>
        </div>
        
        {activeTab === 'properties' && (
          <div className="pt-4">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium">Property Types</span>
              <button 
                className="ml-1 text-gray-500 hover:text-gray-700"
                title="Toggle visibility of different property types on the map"
              >
                <IconInfoCircle size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(visiblePropertyTypes).map(([type, visible]) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={visible}
                    onChange={() => handlePropertyTypeToggle(type as PropertyType)}
                  />
                  <span className="ml-2 flex items-center">
                    {propertyTypeIcons[type as PropertyType]}
                    <span className="ml-1 text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </span>
                </label>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              {filteredProperties.length} properties visible on map
            </p>
          </div>
        )}
        
        {activeTab === 'draw' && (
          <div className="pt-4">
            {mapRef.current && (
              <>
                <DrawSearchControl 
                  map={mapRef.current} 
                  onBoundsChange={handleDrawBoundsChange} 
                />
                
                {searchBounds && !searchBounds.isEmpty() && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={handleSearchInBounds}
                    >
                      <IconSearch size={16} className="mr-1" />
                      Search in This Area
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Search for properties within the drawn area
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Selected property card */}
      {selectedProperty && (
        <div
          className="absolute bottom-5 left-5 right-5 max-w-md z-10 md:max-w-lg"
        >
          <PropertyCard 
            property={selectedProperty} 
            onView={true}
          />
          <button
            className="absolute top-2.5 right-2.5 flex items-center px-3 py-1.5 text-sm bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-700 rounded-md"
            onClick={() => setSelectedProperty(null)}
          >
            <IconMapPin size={14} className="mr-1" />
            Close
          </button>
        </div>
      )}
      
      {/* Filter drawer - simplified for now */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setFilterDrawerOpen(false)}></div>
          <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-auto shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Filter Properties</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="p-4">
              <FilterPanel 
                onApplyFilters={handleApplyFilters} 
                compact={false}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Map layers drawer - simplified for now */}
      {mapLayerDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMapLayerDrawerOpen(false)}></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-auto shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Map Layers</h3>
              <button onClick={() => setMapLayerDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                Select a map style to change the appearance of the map.
              </p>
              
              <div className="space-y-2">
                {mapStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`w-full flex items-center px-4 py-2 rounded-md ${mapStyle === style.id ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleMapStyleChange(style.id)}
                  >
                    <span className="mr-2">{style.icon}</span>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;