/**
 * Service for optimizing map performance
 */

import { Property } from '../types/property';
import { debounce } from '../utils/deviceDetection';

export interface ClusterPoint {
  id: string;
  coordinates: [number, number];
  properties: Property[];
  count: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface PerformanceMetrics {
  renderTime: number;
  markerCount: number;
  clusterCount: number;
  memoryUsage: number;
  lastUpdate: Date;
}

class MapPerformanceService {
  private renderCache = new Map<string, any>();
  private clusterCache = new Map<string, ClusterPoint[]>();
  private readonly MAX_CACHE_SIZE = 100;
  private readonly CLUSTER_RADIUS = 50; // pixels
  private readonly MAX_ZOOM_FOR_CLUSTERING = 15;
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    markerCount: 0,
    clusterCount: 0,
    memoryUsage: 0,
    lastUpdate: new Date()
  };

  /**
   * Cluster properties based on zoom level and viewport
   */
  clusterProperties(
    properties: Property[],
    zoom: number,
    bounds: { north: number; south: number; east: number; west: number }
  ): ClusterPoint[] {
    const startTime = performance.now();

    // Don't cluster at high zoom levels
    if (zoom > this.MAX_ZOOM_FOR_CLUSTERING) {
      const clusters = properties
        .filter(p => p.location.coordinates)
        .map(p => ({
          id: p.id,
          coordinates: p.location.coordinates!,
          properties: [p],
          count: 1,
          bounds: {
            north: p.location.coordinates![1],
            south: p.location.coordinates![1],
            east: p.location.coordinates![0],
            west: p.location.coordinates![0]
          }
        }));

      this.updateMetrics(performance.now() - startTime, properties.length, clusters.length);
      return clusters;
    }

    // Create cache key
    const cacheKey = `${zoom}-${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}-${properties.length}`;
    
    // Check cache
    if (this.clusterCache.has(cacheKey)) {
      const cached = this.clusterCache.get(cacheKey)!;
      this.updateMetrics(performance.now() - startTime, properties.length, cached.length);
      return cached;
    }

    // Filter properties within bounds
    const visibleProperties = properties.filter(p => {
      if (!p.location.coordinates) return false;
      const [lng, lat] = p.location.coordinates;
      return lng >= bounds.west && lng <= bounds.east && lat >= bounds.south && lat <= bounds.north;
    });

    // Perform clustering
    const clusters = this.performClustering(visibleProperties, zoom);

    // Cache result
    this.cacheResult(cacheKey, clusters);

    this.updateMetrics(performance.now() - startTime, properties.length, clusters.length);
    return clusters;
  }

  /**
   * Perform actual clustering algorithm
   */
  private performClustering(properties: Property[], zoom: number): ClusterPoint[] {
    const clusters: ClusterPoint[] = [];
    const processed = new Set<string>();
    
    // Calculate pixel distance based on zoom
    const pixelDistance = this.CLUSTER_RADIUS / Math.pow(2, zoom - 10);

    for (const property of properties) {
      if (processed.has(property.id) || !property.location.coordinates) {
        continue;
      }

      const [lng, lat] = property.location.coordinates;
      const cluster: ClusterPoint = {
        id: `cluster-${clusters.length}`,
        coordinates: [lng, lat],
        properties: [property],
        count: 1,
        bounds: { north: lat, south: lat, east: lng, west: lng }
      };

      processed.add(property.id);

      // Find nearby properties to cluster
      for (const otherProperty of properties) {
        if (processed.has(otherProperty.id) || !otherProperty.location.coordinates) {
          continue;
        }

        const [otherLng, otherLat] = otherProperty.location.coordinates;
        const distance = this.calculateDistance(lng, lat, otherLng, otherLat);

        if (distance <= pixelDistance) {
          cluster.properties.push(otherProperty);
          cluster.count++;
          processed.add(otherProperty.id);

          // Update cluster bounds
          cluster.bounds.north = Math.max(cluster.bounds.north, otherLat);
          cluster.bounds.south = Math.min(cluster.bounds.south, otherLat);
          cluster.bounds.east = Math.max(cluster.bounds.east, otherLng);
          cluster.bounds.west = Math.min(cluster.bounds.west, otherLng);
        }
      }

      // Update cluster center to centroid
      if (cluster.properties.length > 1) {
        const centerLng = cluster.properties.reduce((sum, p) => sum + p.location.coordinates![0], 0) / cluster.properties.length;
        const centerLat = cluster.properties.reduce((sum, p) => sum + p.location.coordinates![1], 0) / cluster.properties.length;
        cluster.coordinates = [centerLng, centerLat];
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  /**
   * Calculate distance between two points in degrees
   */
  private calculateDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
    const dlng = lng2 - lng1;
    const dlat = lat2 - lat1;
    return Math.sqrt(dlng * dlng + dlat * dlat);
  }

  /**
   * Lazy load properties within viewport
   */
  lazyLoadProperties(
    allProperties: Property[],
    bounds: { north: number; south: number; east: number; west: number },
    zoom: number
  ): Property[] {
    // Expand bounds slightly for smooth panning
    const buffer = 0.01 * (16 - zoom); // Larger buffer at lower zoom
    const expandedBounds = {
      north: bounds.north + buffer,
      south: bounds.south - buffer,
      east: bounds.east + buffer,
      west: bounds.west - buffer
    };

    return allProperties.filter(property => {
      if (!property.location.coordinates) return false;
      
      const [lng, lat] = property.location.coordinates;
      return (
        lng >= expandedBounds.west &&
        lng <= expandedBounds.east &&
        lat >= expandedBounds.south &&
        lat <= expandedBounds.north
      );
    });
  }

  /**
   * Optimize heat map data for rendering
   */
  optimizeHeatmapData(
    properties: Property[],
    bounds: { north: number; south: number; east: number; west: number },
    zoom: number
  ): Array<{ coordinates: [number, number]; weight: number }> {
    const cacheKey = `heatmap-${zoom}-${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}`;
    
    if (this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey);
    }

    // Grid size based on zoom level
    const gridSize = Math.max(0.001, 0.01 / Math.pow(2, zoom - 8));
    const grid = new Map<string, { coordinates: [number, number]; weight: number; count: number }>();

    // Filter and grid properties
    properties
      .filter(p => {
        if (!p.location.coordinates) return false;
        const [lng, lat] = p.location.coordinates;
        return lng >= bounds.west && lng <= bounds.east && lat >= bounds.south && lat <= bounds.north;
      })
      .forEach(property => {
        const [lng, lat] = property.location.coordinates!;
        const gridX = Math.floor(lng / gridSize);
        const gridY = Math.floor(lat / gridSize);
        const gridKey = `${gridX},${gridY}`;

        if (!grid.has(gridKey)) {
          grid.set(gridKey, {
            coordinates: [(gridX + 0.5) * gridSize, (gridY + 0.5) * gridSize],
            weight: 0,
            count: 0
          });
        }

        const gridCell = grid.get(gridKey)!;
        gridCell.weight += property.pricing.price;
        gridCell.count++;
      });

    // Convert to heat map points with normalized weights
    const heatmapData = Array.from(grid.values()).map(cell => ({
      coordinates: cell.coordinates,
      weight: cell.weight / cell.count // Average price
    }));

    // Normalize weights to 0-1 scale
    if (heatmapData.length > 0) {
      const maxWeight = Math.max(...heatmapData.map(d => d.weight));
      const minWeight = Math.min(...heatmapData.map(d => d.weight));
      const range = maxWeight - minWeight;

      if (range > 0) {
        heatmapData.forEach(point => {
          point.weight = (point.weight - minWeight) / range;
        });
      }
    }

    // Cache result
    this.cacheResult(cacheKey, heatmapData);

    return heatmapData;
  }

  /**
   * Debounced map update function
   */
  debouncedMapUpdate = debounce((callback: () => void) => {
    callback();
  }, 150);

  /**
   * Memory management - clean up old cache entries
   */
  cleanupCache(): void {
    // Clean render cache
    if (this.renderCache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.renderCache.entries());
      const toDelete = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 20);
      toDelete.forEach(([key]) => this.renderCache.delete(key));
    }

    // Clean cluster cache
    if (this.clusterCache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.clusterCache.entries());
      const toDelete = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 20);
      toDelete.forEach(([key]) => this.clusterCache.delete(key));
    }
  }

  /**
   * Cache result with automatic cleanup
   */
  private cacheResult(key: string, data: any): void {
    this.renderCache.set(key, data);
    
    // Trigger cleanup if cache is getting large
    if (this.renderCache.size > this.MAX_CACHE_SIZE) {
      this.cleanupCache();
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(renderTime: number, markerCount: number, clusterCount: number): void {
    this.metrics = {
      renderTime,
      markerCount,
      clusterCount,
      memoryUsage: this.estimateMemoryUsage(),
      lastUpdate: new Date()
    };
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    const renderCacheSize = this.renderCache.size * 1000; // Rough estimate
    const clusterCacheSize = this.clusterCache.size * 2000; // Rough estimate
    return renderCacheSize + clusterCacheSize;
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.renderCache.clear();
    this.clusterCache.clear();
  }

  /**
   * Preload data for smooth panning
   */
  preloadAdjacentTiles(
    bounds: { north: number; south: number; east: number; west: number },
    zoom: number
  ): { north: number; south: number; east: number; west: number }[] {
    const tileSize = 0.1 / Math.pow(2, zoom - 8);
    const adjacentTiles = [];

    // Generate adjacent tile bounds
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue; // Skip current tile

        adjacentTiles.push({
          north: bounds.north + (y * tileSize),
          south: bounds.south + (y * tileSize),
          east: bounds.east + (x * tileSize),
          west: bounds.west + (x * tileSize)
        });
      }
    }

    return adjacentTiles;
  }

  /**
   * Optimize marker rendering based on zoom level
   */
  optimizeMarkerRendering(zoom: number): {
    showLabels: boolean;
    markerSize: number;
    simplifyIcons: boolean;
  } {
    return {
      showLabels: zoom > 12,
      markerSize: Math.max(20, Math.min(40, zoom * 2)),
      simplifyIcons: zoom < 10
    };
  }
}

// Export singleton instance
export const mapPerformanceService = new MapPerformanceService();
export default mapPerformanceService;