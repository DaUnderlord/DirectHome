import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '../../types/property';

export interface HeatmapData {
  coordinates: [number, number];
  price: number;
  propertyCount: number;
  averagePrice: number;
}

export interface PropertyHeatLayerProps {
  map: mapboxgl.Map;
  properties: Property[];
  intensity?: number;
  radius?: number;
  colorStops?: Array<[number, string]>;
  visible?: boolean;
  onHeatZoneHover?: (data: HeatmapData | null) => void;
}

const PropertyHeatLayer: React.FC<PropertyHeatLayerProps> = ({
  map,
  properties,
  intensity = 0.6,
  radius = 50,
  colorStops = [
    [0, 'rgba(33, 102, 172, 0)'],
    [0.2, 'rgba(103, 169, 207, 0.5)'],
    [0.4, 'rgba(209, 229, 240, 0.7)'],
    [0.6, 'rgba(253, 219, 199, 0.8)'],
    [0.8, 'rgba(239, 138, 98, 0.9)'],
    [1, 'rgba(178, 24, 43, 1)']
  ],
  visible = true,
  onHeatZoneHover
}) => {
  const heatmapSourceId = 'property-heatmap';
  const heatmapLayerId = 'property-heatmap-layer';
  const heatmapPointsLayerId = 'property-heatmap-points';
  const processedDataRef = useRef<HeatmapData[]>([]);

  // Process properties into heatmap data
  const processHeatmapData = (props: Property[]): HeatmapData[] => {
    const validProperties = props.filter(p => 
      p.location.coordinates && 
      Array.isArray(p.location.coordinates) && 
      p.location.coordinates.length === 2 &&
      p.pricing.price > 0
    );

    if (validProperties.length === 0) return [];

    // Group properties by proximity for heat zones
    const gridSize = 0.01; // Approximately 1km grid
    const grid = new Map<string, Property[]>();

    validProperties.forEach(property => {
      const [lng, lat] = property.location.coordinates as [number, number];
      const gridX = Math.floor(lng / gridSize);
      const gridY = Math.floor(lat / gridSize);
      const gridKey = `${gridX},${gridY}`;
      
      if (!grid.has(gridKey)) {
        grid.set(gridKey, []);
      }
      grid.get(gridKey)!.push(property);
    });

    // Convert grid to heatmap data
    const heatmapData: HeatmapData[] = [];
    grid.forEach((gridProperties, gridKey) => {
      if (gridProperties.length === 0) return;

      // Calculate center of grid cell
      const [gridX, gridY] = gridKey.split(',').map(Number);
      const centerLng = (gridX + 0.5) * gridSize;
      const centerLat = (gridY + 0.5) * gridSize;

      // Calculate average price and total count
      const totalPrice = gridProperties.reduce((sum, p) => sum + p.pricing.price, 0);
      const averagePrice = totalPrice / gridProperties.length;

      heatmapData.push({
        coordinates: [centerLng, centerLat],
        price: averagePrice,
        propertyCount: gridProperties.length,
        averagePrice
      });
    });

    return heatmapData;
  };

  // Normalize price values for heatmap intensity
  const normalizeHeatmapData = (data: HeatmapData[]) => {
    if (data.length === 0) return [];

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    return data.map(point => ({
      ...point,
      normalizedIntensity: priceRange > 0 ? (point.price - minPrice) / priceRange : 0.5
    }));
  };

  // Create GeoJSON for heatmap
  const createHeatmapGeoJSON = (data: HeatmapData[]) => {
    const normalizedData = normalizeHeatmapData(data);
    
    return {
      type: 'FeatureCollection' as const,
      features: normalizedData.map(point => ({
        type: 'Feature' as const,
        properties: {
          price: point.price,
          propertyCount: point.propertyCount,
          averagePrice: point.averagePrice,
          intensity: point.normalizedIntensity
        },
        geometry: {
          type: 'Point' as const,
          coordinates: point.coordinates
        }
      }))
    };
  };

  // Update heatmap when properties change
  useEffect(() => {
    if (!map) return;

    const updateHeatmap = () => {
      // Process properties into heatmap data
      const heatmapData = processHeatmapData(properties);
      processedDataRef.current = heatmapData;

      // Create GeoJSON
      const geoJSON = createHeatmapGeoJSON(heatmapData);

      // Check if source exists
      const source = map.getSource(heatmapSourceId) as mapboxgl.GeoJSONSource;
      if (source) {
        // Update existing source
        source.setData(geoJSON);
      } else {
        // Add new source
        map.addSource(heatmapSourceId, {
          type: 'geojson',
          data: geoJSON
        });

        // Add heatmap layer
        map.addLayer({
          id: heatmapLayerId,
          type: 'heatmap',
          source: heatmapSourceId,
          maxzoom: 15,
          paint: {
            // Increase the heatmap weight based on price intensity
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 0.1,
              1, 1
            ],
            // Increase the heatmap color weight by zoom level
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, intensity * 0.5,
              9, intensity
            ],
            // Color ramp for heatmap
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              ...colorStops.flat()
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, radius * 0.5,
              9, radius,
              15, radius * 2
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 1,
              15, 0
            ]
          }
        });

        // Add circle layer for high zoom levels
        map.addLayer({
          id: heatmapPointsLayerId,
          type: 'circle',
          source: heatmapSourceId,
          minzoom: 14,
          paint: {
            // Size circle radius by price intensity
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 10,
              1, 30
            ],
            // Color circle by price intensity
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, '#3b82f6',
              0.5, '#f59e0b',
              1, '#ef4444'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              15, 0.8
            ]
          }
        });

        // Add hover interactions
        if (onHeatZoneHover) {
          map.on('mouseenter', heatmapPointsLayerId, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features && e.features[0]) {
              const feature = e.features[0];
              const properties = feature.properties;
              if (properties) {
                onHeatZoneHover({
                  coordinates: (feature.geometry as any).coordinates,
                  price: properties.price,
                  propertyCount: properties.propertyCount,
                  averagePrice: properties.averagePrice
                });
              }
            }
          });

          map.on('mouseleave', heatmapPointsLayerId, () => {
            map.getCanvas().style.cursor = '';
            onHeatZoneHover(null);
          });
        }
      }
    };

    // Wait for map to be loaded
    if (map.isStyleLoaded()) {
      updateHeatmap();
    } else {
      map.on('styledata', updateHeatmap);
    }

    return () => {
      map.off('styledata', updateHeatmap);
    };
  }, [map, properties, intensity, radius, colorStops, onHeatZoneHover]);

  // Handle visibility changes
  useEffect(() => {
    if (!map) return;

    const heatmapLayer = map.getLayer(heatmapLayerId);
    const pointsLayer = map.getLayer(heatmapPointsLayerId);

    if (heatmapLayer) {
      map.setLayoutProperty(heatmapLayerId, 'visibility', visible ? 'visible' : 'none');
    }
    if (pointsLayer) {
      map.setLayoutProperty(heatmapPointsLayerId, 'visibility', visible ? 'visible' : 'none');
    }
  }, [map, visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!map) return;

      // Remove event listeners
      if (onHeatZoneHover) {
        map.off('mouseenter', heatmapPointsLayerId);
        map.off('mouseleave', heatmapPointsLayerId);
      }

      // Remove layers and source
      if (map.getLayer(heatmapLayerId)) {
        map.removeLayer(heatmapLayerId);
      }
      if (map.getLayer(heatmapPointsLayerId)) {
        map.removeLayer(heatmapPointsLayerId);
      }
      if (map.getSource(heatmapSourceId)) {
        map.removeSource(heatmapSourceId);
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default PropertyHeatLayer;