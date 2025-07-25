import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IconAlertCircle } from '@tabler/icons-react';
import { Property } from '../../types/property';

// Mapbox token from environment variables or use the provided token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1Ijoic3VubGVzcyIsImEiOiJjbWRmM3ppMHEwOXg0MmpyMTVxdW1tZGFsIn0.kNLc04GFk9sj2ihfB0YV4A';

// Set Mapbox performance options
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
);

// Configure mapbox for better performance
mapboxgl.prewarm();

// Initialize mapbox
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapViewProps {
  properties?: Property[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  height?: number | string;
  interactive?: boolean;
  showMarkers?: boolean;
  mapStyle?: string;
  onMarkerClick?: (property: Property) => void;
  onMapLoaded?: (map: mapboxgl.Map) => void;
  onMapMoved?: (bounds: mapboxgl.LngLatBounds) => void;
  className?: string;
  children?: React.ReactNode;
  showDrawControls?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  properties = [],
  center = [3.3792, 6.5244], // Default to Lagos, Nigeria
  zoom = 12,
  height = 400,
  interactive = true,
  showMarkers = true,
  mapStyle = 'mapbox://styles/mapbox/streets-v11',
  onMarkerClick,
  onMapLoaded,
  onMapMoved,
  className = '',
  children,
  showDrawControls = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Check if Mapbox token is valid
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN') {
        setError('Mapbox token is missing. Please provide a valid token.');
        setLoading(false);
        return;
      }

      // Create map instance with optimized settings
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
        interactive: interactive,
        attributionControl: false, // We'll add this manually for better positioning
        maxZoom: 18,
        minZoom: 5,
        pitchWithRotate: false, // Disable pitch with rotate for better performance
        preserveDrawingBuffer: false, // Better performance
        antialias: false, // Better performance
        renderWorldCopies: true, // Show multiple copies of the world
        localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif", // Improve font rendering
      });

      // Add attribution control in a better position
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-left');

      // Add navigation controls
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: false
        }), 'top-right');

        // Add geolocation control
        map.current.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }), 'top-right');

        // Add scale control
        map.current.addControl(new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: 'metric'
        }), 'bottom-right');
      }

      // Handle map load event
      map.current.on('load', () => {
        setLoading(false);
        if (onMapLoaded && map.current) onMapLoaded(map.current);
      });

      // Handle map move end event
      if (onMapMoved) {
        map.current.on('moveend', () => {
          if (map.current) {
            const bounds = map.current.getBounds();
            if (bounds) {
              onMapMoved(bounds);
            }
          }
        });
      }

      // Handle map errors
      map.current.on('error', (e: { error: Error }) => {
        console.error('Map error:', e.error);
        setError('An error occurred with the map. Please try refreshing the page.');
      });

      // Clean up on unmount
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please try again later.');
      setLoading(false);
    }
  }, [center, interactive, mapStyle, onMapLoaded, onMapMoved, zoom]);

  // Add markers when properties change
  useEffect(() => {
    if (!map.current || !showMarkers || loading) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Skip if no properties
    if (properties.length === 0) return;

    // Check if we should use clustering
    const shouldCluster = properties.length > 10;

    if (shouldCluster && map.current.getSource('properties')) {
      // Update existing source data
      (map.current.getSource('properties') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: properties.map(property => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              property.location.longitude || center[0],
              property.location.latitude || center[1]
            ]
          },
          properties: {
            id: property.id,
            title: property.title,
            price: property.pricing.price,
            currency: property.pricing.currency,
            propertyType: property.propertyType,
            listingType: property.listingType
          }
        }))
      });
    } else if (shouldCluster) {
      // Add cluster source and layers
      map.current.addSource('properties', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: properties.map(property => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                property.location.longitude || center[0],
                property.location.latitude || center[1]
              ]
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.pricing.price,
              currency: property.pricing.currency,
              propertyType: property.propertyType,
              listingType: property.listingType
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add cluster layers
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'properties',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'properties',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Handle cluster click
      map.current.on('click', 'clusters', (e: mapboxgl.MapMouseEvent) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });

        if (!features || features.length === 0 || !map.current) return;

        const clusterId = features[0].properties?.cluster_id;
        if (!clusterId) return;

        const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource;

        // Use a direct function without type assertion
        source.getClusterExpansionZoom(clusterId, function (error, expandedZoom) {
          if (error || !map.current) return;

          // Use type assertion for geometry
          const point = features[0].geometry as GeoJSON.Point;
          const coordinates = point.coordinates as [number, number];

          map.current.easeTo({
            center: coordinates,
            zoom: expandedZoom as number // Cast to number to avoid null/undefined
          });
        });
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Handle unclustered point click
      map.current.on('click', 'unclustered-point', (e: mapboxgl.MapMouseEvent) => {
        const features = e.target.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point']
        });

        if (!features || features.length === 0 || !onMarkerClick) return;

        const feature = features[0];
        const propertyId = feature.properties?.id;

        if (propertyId) {
          const property = properties.find(p => p.id === propertyId);
          if (property) onMarkerClick(property);
        }
      });
    } else {
      // Add individual markers
      properties.forEach(property => {
        if (!map.current) return;

        // Create marker element
        const el = document.createElement('div');
        el.className = 'property-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = property.listingType === 'sale' ? '#3b82f6' : '#10b981';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        el.style.cursor = 'pointer';

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <div style="font-weight: bold;">${property.title}</div>
            <div style="color: #3b82f6; font-weight: bold;">
              ${new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: property.pricing.currency,
          maximumFractionDigits: 0,
        }).format(property.pricing.price)}
            </div>
          </div>
        `);

        // Create and add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([
            property.location.longitude || center[0],
            property.location.latitude || center[1]
          ])
          .setPopup(popup)
          .addTo(map.current);

        // Add click handler
        el.addEventListener('click', () => {
          if (onMarkerClick) onMarkerClick(property);
        });

        // Store marker reference
        markers.current.push(marker);
      });
    }

    // Fit map to markers if there are properties
    if (properties.length > 0 && map.current) {
      // Initialize bounds
      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoordinates = false;

      // Add coordinates to bounds
      for (const property of properties) {
        if (property.location.longitude && property.location.latitude) {
          bounds.extend([
            property.location.longitude,
            property.location.latitude
          ] as mapboxgl.LngLatLike);
          hasValidCoordinates = true;
        }
      }

      // Only fit bounds if we have valid coordinates
      if (hasValidCoordinates) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }
  }, [properties, loading, showMarkers, center, onMarkerClick]);

  return (
    <div className={`relative ${className}`} style={{ height: height || 400 }}>
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-red-500 text-center p-4">
            <IconAlertCircle size={32} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Draw controls */}
      {showDrawControls && map.current && (
        <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded shadow-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default MapView;