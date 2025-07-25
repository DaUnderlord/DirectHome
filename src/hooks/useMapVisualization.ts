import { useState, useCallback, useEffect, useMemo } from 'react';
import { Property } from '../types/property';
import { MapFilters } from '../components/Map/MarketMapView';
import { geocodingService } from '../services/geocodingService';
import { mapDataSyncService, MapBounds } from '../services/mapDataSyncService';

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface UseMapVisualizationProps {
  properties: Property[];
  initialCenter?: [number, number];
  initialZoom?: number;
}

export interface UseMapVisualizationReturn {
  // Map state
  mapState: MapState;
  setMapState: (state: Partial<MapState>) => void;
  
  // Filters
  filters: MapFilters;
  setFilters: (filters: Partial<MapFilters>) => void;
  clearFilters: () => void;
  
  // Properties
  filteredProperties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  
  // UI state
  showHeatmap: boolean;
  setShowHeatmap: (show: boolean) => void;
  showPropertyMarkers: boolean;
  setShowPropertyMarkers: (show: boolean) => void;
  
  // Actions
  searchLocation: (query: string) => Promise<void>;
  focusOnProperty: (property: Property) => void;
  getPropertiesInBounds: () => Property[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Real-time sync
  lastSyncTime: Date | null;
  syncedPropertiesCount: number;
}

const DEFAULT_FILTERS: MapFilters = {
  propertyTypes: [],
  priceRange: { min: 0, max: 0 },
  bedrooms: [],
  listingTypes: [],
  showHeatmap: true,
  showPropertyMarkers: true
};

const DEFAULT_CENTER: [number, number] = [3.3792, 6.5244]; // Lagos, Nigeria
const DEFAULT_ZOOM = 10;

export const useMapVisualization = ({
  properties,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM
}: UseMapVisualizationProps): UseMapVisualizationReturn => {
  // Map state
  const [mapState, setMapStateInternal] = useState<MapState>({
    center: initialCenter,
    zoom: initialZoom
  });

  // Filters
  const [filters, setFiltersInternal] = useState<MapFilters>(DEFAULT_FILTERS);

  // Selected property
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time sync state
  const [syncedProperties, setSyncedProperties] = useState<Property[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Update map state
  const setMapState = useCallback((newState: Partial<MapState>) => {
    setMapStateInternal(prev => ({ ...prev, ...newState }));
  }, []);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<MapFilters>) => {
    setFiltersInternal(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersInternal(DEFAULT_FILTERS);
  }, []);

  // Derived state for display options
  const showHeatmap = filters.showHeatmap;
  const showPropertyMarkers = filters.showPropertyMarkers;

  const setShowHeatmap = useCallback((show: boolean) => {
    setFilters({ showHeatmap: show });
  }, [setFilters]);

  const setShowPropertyMarkers = useCallback((show: boolean) => {
    setFilters({ showPropertyMarkers: show });
  }, [setFilters]);

  // Combine original properties with synced properties
  const allProperties = useMemo(() => {
    const propertyMap = new Map<string, Property>();
    
    // Add original properties
    properties.forEach(property => {
      propertyMap.set(property.id, property);
    });
    
    // Add/update with synced properties
    syncedProperties.forEach(property => {
      propertyMap.set(property.id, property);
    });
    
    return Array.from(propertyMap.values());
  }, [properties, syncedProperties]);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.min > 0 && property.pricing.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max > 0 && property.pricing.price > filters.priceRange.max) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.features.bedrooms)) {
        return false;
      }

      // Listing type filter
      if (filters.listingTypes.length > 0 && !filters.listingTypes.includes(property.listingType)) {
        return false;
      }

      return true;
    });
  }, [allProperties, filters]);

  // Search for a location and update map center
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await geocodingService.geocodeAddress(query);
      setMapState({
        center: result.coordinates,
        zoom: 14
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location');
    } finally {
      setIsLoading(false);
    }
  }, [setMapState]);

  // Focus on a specific property
  const focusOnProperty = useCallback((property: Property) => {
    if (property.location.coordinates) {
      setMapState({
        center: property.location.coordinates,
        zoom: 16
      });
      setSelectedProperty(property);
    }
  }, [setMapState]);

  // Get properties within current map bounds
  const getPropertiesInBounds = useCallback(() => {
    if (!mapState.bounds) return filteredProperties;

    return filteredProperties.filter(property => {
      if (!property.location.coordinates) return false;

      const [lng, lat] = property.location.coordinates;
      return (
        lat <= mapState.bounds!.north &&
        lat >= mapState.bounds!.south &&
        lng <= mapState.bounds!.east &&
        lng >= mapState.bounds!.west
      );
    });
  }, [filteredProperties, mapState.bounds]);

  // Auto-focus on properties when filters change
  useEffect(() => {
    if (filteredProperties.length > 0 && filteredProperties.length !== properties.length) {
      // Calculate bounds for filtered properties
      const validProperties = filteredProperties.filter(p => p.location.coordinates);
      
      if (validProperties.length > 0) {
        const coordinates = validProperties.map(p => p.location.coordinates!);
        const lngs = coordinates.map(coord => coord[0]);
        const lats = coordinates.map(coord => coord[1]);

        const bounds = {
          north: Math.max(...lats),
          south: Math.min(...lats),
          east: Math.max(...lngs),
          west: Math.min(...lngs)
        };

        // Calculate center and appropriate zoom
        const centerLng = (bounds.east + bounds.west) / 2;
        const centerLat = (bounds.north + bounds.south) / 2;

        // Simple zoom calculation based on bounds size
        const lngDiff = bounds.east - bounds.west;
        const latDiff = bounds.north - bounds.south;
        const maxDiff = Math.max(lngDiff, latDiff);
        
        let zoom = 10;
        if (maxDiff < 0.01) zoom = 15;
        else if (maxDiff < 0.05) zoom = 13;
        else if (maxDiff < 0.1) zoom = 12;
        else if (maxDiff < 0.5) zoom = 10;
        else zoom = 8;

        setMapState({
          center: [centerLng, centerLat],
          zoom,
          bounds
        });
      }
    }
  }, [filteredProperties, properties.length, setMapState]);

  // Clear selected property when filters change
  useEffect(() => {
    if (selectedProperty && !filteredProperties.find(p => p.id === selectedProperty.id)) {
      setSelectedProperty(null);
    }
  }, [filteredProperties, selectedProperty]);

  // Set up real-time data synchronization
  useEffect(() => {
    // Subscribe to property updates
    const unsubscribePropertyUpdates = mapDataSyncService.subscribe('property_update', (event) => {
      if (event.type === 'property_added' || event.type === 'property_updated') {
        setSyncedProperties(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(p => p.id === event.property.id);
          
          if (existingIndex >= 0) {
            updated[existingIndex] = event.property;
          } else {
            updated.push(event.property);
          }
          
          return updated;
        });
      } else if (event.type === 'property_removed') {
        setSyncedProperties(prev => prev.filter(p => p.id !== event.property.id));
      }
      
      setLastSyncTime(event.timestamp);
    });

    // Subscribe to heatmap updates
    const unsubscribeHeatmapUpdates = mapDataSyncService.subscribe('heatmap_update', (event) => {
      // Trigger heatmap recalculation
      setLastSyncTime(event.timestamp);
    });

    // Fetch initial data for current bounds
    if (mapState.bounds) {
      const bounds: MapBounds = {
        north: mapState.bounds.north,
        south: mapState.bounds.south,
        east: mapState.bounds.east,
        west: mapState.bounds.west
      };
      
      mapDataSyncService.fetchPropertiesInBounds(bounds).then(boundProperties => {
        setSyncedProperties(prev => {
          const combined = [...prev];
          boundProperties.forEach(property => {
            const existingIndex = combined.findIndex(p => p.id === property.id);
            if (existingIndex >= 0) {
              combined[existingIndex] = property;
            } else {
              combined.push(property);
            }
          });
          return combined;
        });
      });
    }

    return () => {
      unsubscribePropertyUpdates();
      unsubscribeHeatmapUpdates();
    };
  }, [mapState.bounds]);

  // Update heatmap data when bounds change
  useEffect(() => {
    if (mapState.bounds) {
      const bounds: MapBounds = {
        north: mapState.bounds.north,
        south: mapState.bounds.south,
        east: mapState.bounds.east,
        west: mapState.bounds.west
      };
      
      mapDataSyncService.updateHeatmapData(bounds);
    }
  }, [mapState.bounds]);

  return {
    // Map state
    mapState,
    setMapState,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    
    // Properties
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    
    // UI state
    showHeatmap,
    setShowHeatmap,
    showPropertyMarkers,
    setShowPropertyMarkers,
    
    // Actions
    searchLocation,
    focusOnProperty,
    getPropertiesInBounds,
    
    // Loading states
    isLoading,
    error,
    
    // Real-time sync
    lastSyncTime,
    syncedPropertiesCount: syncedProperties.length
  };
};