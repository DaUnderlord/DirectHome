import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property, PropertyType } from '../../types/property';

export interface PropertyMarkerLayerProps {
  map: mapboxgl.Map;
  properties: Property[];
  selectedProperty?: Property;
  onPropertyClick?: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
  clusteringEnabled?: boolean;
  visible?: boolean;
}

interface ProcessedProperty extends Property {
  coordinates: [number, number];
}

const PropertyMarkerLayer: React.FC<PropertyMarkerLayerProps> = ({
  map,
  properties,
  selectedProperty,
  onPropertyClick,
  onPropertyHover,
  clusteringEnabled = true,
  visible = true
}) => {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const clusterMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Get property type icon SVG
  const getPropertyIconSVG = (propertyType: PropertyType, isSelected = false) => {
    const color = isSelected ? '#ef4444' : '#ffffff';
    const strokeWidth = isSelected ? '2.5' : '2';
    
    switch (propertyType) {
      case PropertyType.HOUSE:
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        `;
      case PropertyType.APARTMENT:
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12h12"/>
            <path d="M6 8h12"/>
            <path d="M6 16h12"/>
          </svg>
        `;
      case PropertyType.CONDO:
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        `;
      default:
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        `;
    }
  };

  // Get property type color
  const getPropertyTypeColor = (propertyType: PropertyType) => {
    switch (propertyType) {
      case PropertyType.HOUSE:
        return '#10b981'; // green
      case PropertyType.APARTMENT:
        return '#3b82f6'; // blue
      case PropertyType.CONDO:
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    } else {
      return `₦${price}`;
    }
  };

  // Create individual property marker
  const createPropertyMarker = (property: ProcessedProperty, isSelected = false) => {
    const el = document.createElement('div');
    el.className = `property-marker ${isSelected ? 'selected' : ''}`;
    el.setAttribute('data-property-id', property.id);

    const color = getPropertyTypeColor(property.type);
    const scale = isSelected ? 1.2 : 1;
    const zIndex = isSelected ? 1000 : 1;

    el.style.cssText = `
      width: 44px;
      height: 44px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
      transform: scale(${scale});
      z-index: ${zIndex};
    `;

    // Add property type icon
    el.innerHTML = getPropertyIconSVG(property.type, isSelected);

    // Add price label
    const priceLabel = document.createElement('div');
    priceLabel.style.cssText = `
      position: absolute;
      top: -12px;
      right: -12px;
      background: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transform: scale(${1 / scale});
    `;
    priceLabel.textContent = formatPrice(property.pricing.price);
    el.appendChild(priceLabel);

    // Add hover effects
    el.addEventListener('mouseenter', () => {
      if (!isSelected) {
        el.style.transform = 'scale(1.1)';
        el.style.zIndex = '999';
      }
      if (onPropertyHover) {
        onPropertyHover(property);
      }
    });

    el.addEventListener('mouseleave', () => {
      if (!isSelected) {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      }
      if (onPropertyHover) {
        onPropertyHover(null);
      }
    });

    // Add click handler
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onPropertyClick) {
        onPropertyClick(property);
      }
    });

    return el;
  };

  // Create cluster marker
  const createClusterMarker = (properties: ProcessedProperty[], center: [number, number]) => {
    const el = document.createElement('div');
    el.className = 'cluster-marker';
    
    const count = properties.length;
    const size = Math.min(60, Math.max(40, 30 + count * 2));

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
      color: white;
      font-weight: bold;
      font-size: ${Math.min(16, Math.max(12, 10 + count / 5))}px;
    `;

    el.textContent = count.toString();

    // Add hover effect
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // Add click handler to zoom in
    el.addEventListener('click', () => {
      map.flyTo({
        center: center,
        zoom: Math.min(map.getZoom() + 2, 18),
        duration: 1000
      });
    });

    return el;
  };

  // Simple clustering algorithm
  const clusterProperties = (properties: ProcessedProperty[], zoomLevel: number) => {
    if (!clusteringEnabled || zoomLevel > 14) {
      return properties.map(p => ({ type: 'single' as const, property: p }));
    }

    const clusters: Array<{ 
      type: 'single' | 'cluster'; 
      property?: ProcessedProperty; 
      properties?: ProcessedProperty[]; 
      center?: [number, number] 
    }> = [];
    const processed = new Set<string>();
    const clusterDistance = Math.max(50, 200 - zoomLevel * 10); // Adjust based on zoom

    properties.forEach(property => {
      if (processed.has(property.id)) return;

      const nearby = properties.filter(p => {
        if (processed.has(p.id) || p.id === property.id) return false;
        
        const distance = Math.sqrt(
          Math.pow(p.coordinates[0] - property.coordinates[0], 2) +
          Math.pow(p.coordinates[1] - property.coordinates[1], 2)
        ) * 111000; // Rough conversion to meters
        
        return distance < clusterDistance;
      });

      if (nearby.length > 0) {
        const clusterProperties = [property, ...nearby];
        clusterProperties.forEach(p => processed.add(p.id));
        
        // Calculate cluster center
        const centerLng = clusterProperties.reduce((sum, p) => sum + p.coordinates[0], 0) / clusterProperties.length;
        const centerLat = clusterProperties.reduce((sum, p) => sum + p.coordinates[1], 0) / clusterProperties.length;
        
        clusters.push({
          type: 'cluster',
          properties: clusterProperties,
          center: [centerLng, centerLat]
        });
      } else {
        processed.add(property.id);
        clusters.push({
          type: 'single',
          property
        });
      }
    });

    return clusters;
  };

  // Update markers when properties change
  useEffect(() => {
    if (!map || !visible) {
      // Clear all markers if not visible
      markersRef.current.forEach(marker => marker.remove());
      clusterMarkersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      clusterMarkersRef.current.clear();
      return;
    }

    // Filter properties with coordinates
    const validProperties = properties.filter(p => 
      p.location.coordinates && 
      Array.isArray(p.location.coordinates) && 
      p.location.coordinates.length === 2
    ).map(p => ({
      ...p,
      coordinates: p.location.coordinates as [number, number]
    }));

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    clusterMarkersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
    clusterMarkersRef.current.clear();

    if (validProperties.length === 0) return;

    // Get current zoom level
    const zoomLevel = map.getZoom();

    // Cluster properties
    const clusters = clusterProperties(validProperties, zoomLevel);

    // Add markers
    clusters.forEach((cluster, index) => {
      if (cluster.type === 'single' && cluster.property) {
        const isSelected = selectedProperty?.id === cluster.property.id;
        const el = createPropertyMarker(cluster.property, isSelected);
        const marker = new mapboxgl.Marker(el)
          .setLngLat(cluster.property.coordinates)
          .addTo(map);

        markersRef.current.set(cluster.property.id, marker);
      } else if (cluster.type === 'cluster' && cluster.properties && cluster.center) {
        const el = createClusterMarker(cluster.properties, cluster.center);
        const marker = new mapboxgl.Marker(el)
          .setLngLat(cluster.center)
          .addTo(map);

        clusterMarkersRef.current.set(`cluster-${index}`, marker);
      }
    });
  }, [map, properties, selectedProperty, visible, clusteringEnabled, onPropertyClick, onPropertyHover]);

  // Update markers when zoom changes (for clustering)
  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      // Re-render markers with new clustering
      const event = new CustomEvent('markersUpdate');
      map.getContainer().dispatchEvent(event);
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      clusterMarkersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      clusterMarkersRef.current.clear();
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default PropertyMarkerLayer;