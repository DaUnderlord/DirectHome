import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { 
  IconTrash, 
  IconRuler, 
  IconMapPin, 
  IconSquare,
  IconCircle,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';

interface DrawSearchControlProps {
  map: mapboxgl.Map | null;
  onBoundsChange?: (bounds: mapboxgl.LngLatBounds) => void;
}

const DrawSearchControl: React.FC<DrawSearchControlProps> = ({ 
  map, 
  onBoundsChange 
}) => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const drawControlsRef = useRef<HTMLDivElement>(null);
  const [drawMode, setDrawMode] = useState<string>('simple_select');
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [areaInfo, setAreaInfo] = useState<{
    area: number;
    perimeter: number;
  } | null>(null);
  
  // Initialize draw control
  useEffect(() => {
    if (!map) return;
    
    // Create draw instance
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'simple_select',
      styles: [
        // Base polygon style
        {
          'id': 'gl-draw-polygon-fill-inactive',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#3b82f6',
            'fill-outline-color': '#3b82f6',
            'fill-opacity': 0.1
          }
        },
        // Active polygon style
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#3b82f6',
            'fill-outline-color': '#3b82f6',
            'fill-opacity': 0.2
          }
        },
        // Polygon outline style
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3b82f6',
            'line-width': 2
          }
        },
        // Active polygon outline style
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3b82f6',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // Vertex point style
        {
          'id': 'gl-draw-polygon-and-line-vertex-inactive',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#fff',
            'circle-stroke-color': '#3b82f6',
            'circle-stroke-width': 2
          }
        },
        // Active vertex point style
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['==', 'active', 'true']],
          'paint': {
            'circle-radius': 6,
            'circle-color': '#fff',
            'circle-stroke-color': '#3b82f6',
            'circle-stroke-width': 3
          }
        },
        // Midpoint style
        {
          'id': 'gl-draw-polygon-midpoint',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'midpoint'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 3,
            'circle-color': '#3b82f6'
          }
        }
      ]
    });
    
    // Add draw control to map
    map.addControl(drawRef.current);
    
    // Handle draw events
    map.on('draw.create', handleDrawUpdate);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.delete', handleDrawDelete);
    
    // Clean up on unmount
    return () => {
      if (map && drawRef.current) {
        map.off('draw.create', handleDrawUpdate);
        map.off('draw.update', handleDrawUpdate);
        map.off('draw.delete', handleDrawDelete);
        map.removeControl(drawRef.current);
      }
    };
  }, [map]);
  
  // Calculate area in square kilometers
  const calculateArea = (coordinates: [number, number][]) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    // Use turf.js area calculation if available
    if ((window as any).turf && (window as any).turf.area) {
      const polygon = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      };
      
      return (window as any).turf.area(polygon) / 1000000; // Convert to square kilometers
    }
    
    // Simple approximation if turf.js is not available
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    area = Math.abs(area) / 2;
    
    // Convert to square kilometers (very approximate)
    const lat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
    const degreeToKm = 111.32 * Math.cos(lat * Math.PI / 180);
    return area * degreeToKm * degreeToKm;
  };
  
  // Calculate perimeter in kilometers
  const calculatePerimeter = (coordinates: [number, number][]) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      const dx = coordinates[i][0] - coordinates[j][0];
      const dy = coordinates[i][1] - coordinates[j][1];
      
      // Convert to kilometers (approximate)
      const lat = (coordinates[i][1] + coordinates[j][1]) / 2;
      const degreeToKm = 111.32 * Math.cos(lat * Math.PI / 180);
      perimeter += Math.sqrt(dx * dx + dy * dy) * degreeToKm;
    }
    
    return perimeter;
  };

  // Handle draw update
  const handleDrawUpdate = () => {
    if (!map || !drawRef.current || !onBoundsChange) return;
    
    const data = drawRef.current.getAll();
    if (data.features.length > 0) {
      // Get bounds of drawn polygon
      // Use type assertion to handle the geometry type
      const feature = data.features[0];
      
      // Make sure we're dealing with a polygon
      if (feature.geometry.type !== 'Polygon') return;
      
      // Get the coordinates from the polygon
      const polygonCoords = feature.geometry.coordinates[0] as [number, number][];
      
      if (polygonCoords.length < 2) return;
      
      // Create a new bounds object
      const bounds = new mapboxgl.LngLatBounds();
      
      // Extend the bounds with each coordinate
      for (const coord of polygonCoords) {
        bounds.extend(coord);
      }
      
      // Calculate area and perimeter
      const area = calculateArea(polygonCoords);
      const perimeter = calculatePerimeter(polygonCoords);
      
      setAreaInfo({
        area: parseFloat(area.toFixed(2)),
        perimeter: parseFloat(perimeter.toFixed(2))
      });
      
      // Update draw mode
      setDrawMode(drawRef.current.getMode());
      
      onBoundsChange(bounds);
    }
  };
  
  // Handle draw delete
  const handleDrawDelete = () => {
    if (!onBoundsChange) return;
    setAreaInfo(null);
    onBoundsChange(new mapboxgl.LngLatBounds());
  };
  
  // Handle mode change
  const handleModeChange = (mode: string) => {
    if (!drawRef.current) return;
    drawRef.current.changeMode(mode);
    setDrawMode(mode);
  };
  
  // Start drawing polygon
  const handleStartDraw = () => {
    handleModeChange('draw_polygon');
  };
  
  // Start drawing circle (if supported)
  const handleStartDrawCircle = () => {
    if (!drawRef.current) return;
    
    // Check if circle drawing is supported
    if ((drawRef.current as any).modes && (drawRef.current as any).modes.draw_circle) {
      handleModeChange('draw_circle');
    } else {
      // Fallback to polygon
      handleStartDraw();
    }
  };
  
  // Clear drawing
  const handleClearDraw = () => {
    if (!drawRef.current) return;
    drawRef.current.deleteAll();
    setAreaInfo(null);
    if (onBoundsChange) {
      onBoundsChange(new mapboxgl.LngLatBounds());
    }
  };

  return (
    <div ref={drawControlsRef} className="mapbox-draw-controls">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Draw Search Area</span>
        <button 
          className="text-gray-500 hover:text-gray-700"
          title={showHelp ? "Hide help" : "Show help"}
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </button>
      </div>
      
      {showHelp && (
        <p className="text-xs text-gray-500 mb-4">
          Draw a shape on the map to search for properties within that area. 
          You can draw a polygon by clicking multiple points, or use the circle tool for a radius search.
        </p>
      )}
      
      <div className="flex space-x-2 mb-4">
        <button
          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${drawMode === 'draw_polygon' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          title="Draw polygon"
          onClick={handleStartDraw}
        >
          <IconSquare size={16} className="mr-1" />
          Polygon
        </button>
        
        <button
          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${drawMode === 'draw_circle' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          title="Draw circle (approximate)"
          onClick={handleStartDrawCircle}
        >
          <IconCircle size={16} className="mr-1" />
          Circle
        </button>
        
        <button
          className="flex items-center px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          title="Clear drawing"
          onClick={handleClearDraw}
        >
          <IconTrash size={16} className="mr-1" />
          Clear
        </button>
      </div>
      
      {areaInfo && (
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-xs text-gray-600">
            <IconRuler size={14} className="mr-1" />
            <span>Area: {areaInfo.area} km²</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <IconMapPin size={14} className="mr-1" />
            <span>Perimeter: {areaInfo.perimeter} km</span>
          </div>
        </div>
      )}
      
      {!areaInfo && (
        <p className="text-xs text-gray-500">
          Draw a shape to search within that area
        </p>
      )}
    </div>
  );
};

export default DrawSearchControl;