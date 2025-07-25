import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '../../types/property';
import { geocodingService, GeocodeResult } from '../../services/geocodingService';
import { 
  IconMapPin, 
  IconHome, 
  IconBuilding, 
  IconBuildingSkyscraper,
  IconLoader,
  IconAlertCircle,
  IconRefresh,
  IconMaximize,
  IconMinimize
} from '@tabler/icons-react';

// Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1Ijoic3VubGVzcyIsImEiOiJjbWRmM3ppMHEwOXg0MmpyMTVxdW1tZGFsIn0.kNLc04GFk9sj2ihfB0YV4A';

export interface MapFilters {
  propertyTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number[];
  listingTypes: string[];
  showHeatmap: boolean;
  showPropertyMarkers: boolean;
}

export interface MarketMapViewProps {
  properties: Property[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  showHeatmap?: boolean;
  showPropertyMarkers?: boolean;
  filters?: Partial<MapFilters>;
  onPropertySelect?: (property: Property) => void;
  onAreaSelect?: (bounds: mapboxgl.LngLatBounds) => void;
  className?: string;
  isMobile?: boolean;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

interface ProcessedProperty extends Property {
  coordinates?: [number, number];
  geocoded?: boolean;
}

const MarketMapView: React.FC<MarketMapViewProps> = ({
  properties = [],
  center = [3.3792, 6.5244], // Default to Lagos, Nigeria
  zoom = 10,
  showHeatmap = true,
  showPropertyMarkers = true,
  filters = {},
  onPropertySelect,
  onAreaSelect,
  className = '',
  isMobile = false,
  isFullscreen = false,
  onFullscreenToggle
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedProperties, setProcessedProperties] = useState<ProcessedProperty[]>([]);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom,
        minZoom: 2,
        maxZoom: 20,
        attributionControl: false,
        // Mobile optimizations
        touchZoomRotate: isMobile,
        touchPitch: isMobile,
        dragRotate: !isMobile, // Disable rotation on mobile to prevent accidental rotation
        pitchWithRotate: !isMobile,
        // Accessibility
        keyboard: true,
        doubleClickZoom: true,
        scrollZoom: true,
        boxZoom: true,
        dragPan: true
      });

      // Add navigation controls with mobile-specific positioning
      const navControl = new mapboxgl.NavigationControl({
        showCompass: !isMobile, // Hide compass on mobile to save space
        showZoom: true,
        visualizePitch: !isMobile
      });
      map.current.addControl(navControl, isMobile ? 'bottom-left' : 'top-right');

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right');

      // Handle area selection
      if (onAreaSelect) {
        map.current.on('moveend', () => {
          if (map.current) {
            const bounds = map.current.getBounds();
            onAreaSelect(bounds);
          }
        });
      }

      map.current.on('load', () => {
        setIsLoading(false);
        setError(null);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Failed to load map. Please check your internet connection.');
        setIsLoading(false);
      });

      // Add keyboard navigation support
      map.current.on('load', () => {
        if (map.current) {
          const canvas = map.current.getCanvas();
          canvas.setAttribute('tabindex', '0');
          canvas.setAttribute('role', 'application');
          canvas.setAttribute('aria-label', 'Interactive property map. Use arrow keys to pan, plus and minus keys to zoom.');
          
          // Keyboard event handlers
          canvas.addEventListener('keydown', (e) => {
            if (!map.current) return;
            
            const panDistance = 50;
            const center = map.current.getCenter();
            
            switch (e.key) {
              case 'ArrowUp':
                e.preventDefault();
                map.current.panBy([0, -panDistance]);
                break;
              case 'ArrowDown':
                e.preventDefault();
                map.current.panBy([0, panDistance]);
                break;
              case 'ArrowLeft':
                e.preventDefault();
                map.current.panBy([-panDistance, 0]);
                break;
              case 'ArrowRight':
                e.preventDefault();
                map.current.panBy([panDistance, 0]);
                break;
              case '+':
              case '=':
                e.preventDefault();
                map.current.zoomIn();
                break;
              case '-':
                e.preventDefault();
                map.current.zoomOut();
                break;
              case 'Escape':
                e.preventDefault();
                canvas.blur();
                break;
            }
          });
        }
      });

    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map. Please refresh the page.');
      setIsLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, onAreaSelect]);

  // Process properties with geocoding
  const processProperties = useCallback(async (props: Property[]) => {
    if (!props.length) {
      setProcessedProperties([]);
      return;
    }

    setGeocodingProgress({ current: 0, total: props.length });
    const processed: ProcessedProperty[] = [];

    for (let i = 0; i < props.length; i++) {
      const property = props[i];
      setGeocodingProgress({ current: i + 1, total: props.length });

      try {
        // Check if property already has coordinates
        if (property.location.coordinates) {
          processed.push({
            ...property,
            coordinates: property.location.coordinates,
            geocoded: true
          });
          continue;
        }

        // Geocode the address
        const fullAddress = `${property.location.address}, ${property.location.city}, ${property.location.state}`;
        const result = await geocodingService.geocodeAddress(fullAddress);
        
        processed.push({
          ...property,
          coordinates: result.coordinates,
          geocoded: true
        });
      } catch (error) {
        console.warn(`Failed to geocode property ${property.id}:`, error);
        // Add property without coordinates for now
        processed.push({
          ...property,
          geocoded: false
        });
      }
    }

    setProcessedProperties(processed);
  }, []);

  // Process properties when they change
  useEffect(() => {
    if (properties.length > 0) {
      processProperties(properties);
    }
  }, [properties, processProperties]);

  // Apply filters to properties
  const filteredProperties = React.useMemo(() => {
    return processedProperties.filter(property => {
      if (!property.coordinates) return false;

      // Property type filter
      if (filters.propertyTypes?.length && !filters.propertyTypes.includes(property.type)) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = property.pricing.price;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms?.length && !filters.bedrooms.includes(property.features.bedrooms)) {
        return false;
      }

      // Listing type filter
      if (filters.listingTypes?.length && !filters.listingTypes.includes(property.listingType)) {
        return false;
      }

      return true;
    });
  }, [processedProperties, filters]);

  // Get property type icon
  const getPropertyIcon = (propertyType: string) => {
    switch (propertyType.toLowerCase()) {
      case 'house':
        return IconHome;
      case 'apartment':
        return IconBuilding;
      case 'condo':
      case 'penthouse':
        return IconBuildingSkyscraper;
      default:
        return IconMapPin;
    }
  };

  // Create property marker element
  const createMarkerElement = (property: ProcessedProperty) => {
    const el = document.createElement('div');
    el.className = 'property-marker';
    
    // Mobile-optimized size
    const markerSize = isMobile ? 44 : 40; // Larger touch targets on mobile
    
    el.style.cssText = `
      width: ${markerSize}px;
      height: ${markerSize}px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      position: relative;
    `;

    // Add accessibility attributes
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `Property: ${property.title} - ${property.pricing.price.toLocaleString()} NGN`);
    el.setAttribute('aria-describedby', `property-${property.id}-details`);

    // Add property type icon
    const IconComponent = getPropertyIcon(property.type);
    el.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        ${property.type === 'house' ? 
          '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>' :
          property.type === 'apartment' ?
          '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M6 16h12"/>' :
          '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
        }
      </svg>
    `;

    // Add price label
    const priceLabel = document.createElement('div');
    priceLabel.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    
    const price = property.pricing.price;
    const formattedPrice = price >= 1000000 ? 
      `₦${(price / 1000000).toFixed(1)}M` : 
      price >= 1000 ? 
      `₦${(price / 1000).toFixed(0)}K` : 
      `₦${price}`;
    priceLabel.textContent = formattedPrice;
    el.appendChild(priceLabel);

    // Add hover and focus effects
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
      el.style.zIndex = '1000';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.zIndex = '1';
    });

    el.addEventListener('focus', () => {
      el.style.transform = 'scale(1.1)';
      el.style.zIndex = '1000';
      el.style.outline = '2px solid #3b82f6';
      el.style.outlineOffset = '2px';
    });

    el.addEventListener('blur', () => {
      el.style.transform = 'scale(1)';
      el.style.zIndex = '1';
      el.style.outline = 'none';
    });

    // Add keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });

    // Add touch feedback for mobile
    if (isMobile) {
      el.addEventListener('touchstart', () => {
        el.style.transform = 'scale(0.95)';
      });

      el.addEventListener('touchend', () => {
        el.style.transform = 'scale(1)';
      });
    }

    return el;
  };

  // Update markers when filtered properties change
  useEffect(() => {
    if (!map.current || !showPropertyMarkers) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredProperties.forEach(property => {
      if (!property.coordinates) return;

      const el = createMarkerElement(property);
      const marker = new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
    });
  }, [filteredProperties, showPropertyMarkers, onPropertySelect]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    // Re-initialize map
    setTimeout(() => {
      if (mapContainer.current && !map.current) {
        // Trigger re-initialization
        window.location.reload();
      }
    }, 100);
  };

  return (
    <div className={`relative w-full h-full ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Mobile Fullscreen Toggle */}
      {isMobile && onFullscreenToggle && (
        <button
          onClick={onFullscreenToggle}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <IconMinimize className="w-5 h-5 text-gray-700" />
          ) : (
            <IconMaximize className="w-5 h-5 text-gray-700" />
          )}
        </button>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className={`w-full h-full ${isFullscreen ? '' : 'rounded-xl'} overflow-hidden`}
        style={{ minHeight: isFullscreen ? '100vh' : '400px' }}
        role="application"
        aria-label="Interactive property map"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center">
            <IconLoader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading map...</p>
            {geocodingProgress.total > 0 && (
              <div className="mt-2">
                <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(geocodingProgress.current / geocodingProgress.total) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Processing properties {geocodingProgress.current}/{geocodingProgress.total}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center max-w-sm">
            <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IconRefresh className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Property Count Badge */}
      {!isLoading && !error && (
        <div className={`absolute ${isMobile ? 'top-16 left-4' : 'top-4 left-4'} bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg`}>
          <p className="text-sm font-medium text-gray-900">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
          </p>
        </div>
      )}

      {/* Map Legend */}
      {!isLoading && !error && showPropertyMarkers && !isMobile && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Property Types</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Houses & Apartments
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 ml-0.5"></div>
              Price indicator
            </div>
          </div>
        </div>
      )}

      {/* Mobile Legend - Compact Version */}
      {!isLoading && !error && showPropertyMarkers && isMobile && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Properties
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              Price
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketMapView;