import { Property } from '../types/property';
import { geocodingService } from './geocodingService';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PropertyUpdateEvent {
  type: 'property_added' | 'property_updated' | 'property_removed';
  property: Property;
  timestamp: Date;
}

export interface HeatmapUpdateEvent {
  type: 'heatmap_update';
  bounds: MapBounds;
  data: Array<{
    coordinates: [number, number];
    price: number;
    count: number;
  }>;
  timestamp: Date;
}

export type MapDataEvent = PropertyUpdateEvent | HeatmapUpdateEvent;

class MapDataSyncService {
  private eventListeners: Map<string, Array<(event: MapDataEvent) => void>> = new Map();
  private propertyCache: Map<string, Property> = new Map();
  private heatmapCache: Map<string, any> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor() {
    this.startSync();
  }

  /**
   * Start real-time synchronization
   */
  startSync() {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Simulate real-time updates every 30 seconds
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, 30000);

    // Listen for browser visibility changes to pause/resume sync
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  /**
   * Stop real-time synchronization
   */
  stopSync() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  /**
   * Subscribe to map data events
   */
  subscribe(eventType: string, callback: (event: MapDataEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    this.eventListeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event to all subscribers
   */
  private emit(eventType: string, event: MapDataEvent) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in map data sync callback:', error);
        }
      });
    }
  }

  /**
   * Fetch properties within bounds with caching
   */
  async fetchPropertiesInBounds(bounds: MapBounds, forceRefresh = false): Promise<Property[]> {
    const boundsKey = this.getBoundsKey(bounds);
    
    // Check cache first
    if (!forceRefresh && this.propertyCache.has(boundsKey)) {
      return [this.propertyCache.get(boundsKey)!];
    }

    try {
      // In a real app, this would be an API call
      const mockProperties = await this.mockFetchProperties(bounds);
      
      // Process properties with geocoding if needed
      const processedProperties = await this.processPropertiesWithGeocoding(mockProperties);
      
      // Update cache
      processedProperties.forEach(property => {
        this.propertyCache.set(property.id, property);
      });
      
      return processedProperties;
    } catch (error) {
      console.error('Failed to fetch properties in bounds:', error);
      return [];
    }
  }

  /**
   * Update heatmap data for bounds
   */
  async updateHeatmapData(bounds: MapBounds): Promise<void> {
    const boundsKey = this.getBoundsKey(bounds);
    
    try {
      const properties = await this.fetchPropertiesInBounds(bounds);
      const heatmapData = this.generateHeatmapData(properties, bounds);
      
      // Update cache
      this.heatmapCache.set(boundsKey, heatmapData);
      
      // Emit update event
      this.emit('heatmap_update', {
        type: 'heatmap_update',
        bounds,
        data: heatmapData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to update heatmap data:', error);
    }
  }

  /**
   * Add or update property
   */
  async updateProperty(property: Property): Promise<void> {
    const existingProperty = this.propertyCache.get(property.id);
    const eventType = existingProperty ? 'property_updated' : 'property_added';
    
    // Ensure property has coordinates
    if (!property.location.coordinates) {
      try {
        const fullAddress = `${property.location.address}, ${property.location.city}, ${property.location.state}`;
        const geocodeResult = await geocodingService.geocodeAddress(fullAddress);
        property.location.coordinates = geocodeResult.coordinates;
      } catch (error) {
        console.warn('Failed to geocode property:', error);
        return;
      }
    }
    
    // Update cache
    this.propertyCache.set(property.id, property);
    
    // Emit update event
    this.emit('property_update', {
      type: eventType,
      property,
      timestamp: new Date()
    });
  }

  /**
   * Remove property
   */
  removeProperty(propertyId: string): void {
    const property = this.propertyCache.get(propertyId);
    if (property) {
      this.propertyCache.delete(propertyId);
      
      this.emit('property_update', {
        type: 'property_removed',
        property,
        timestamp: new Date()
      });
    }
  }

  /**
   * Get cached properties
   */
  getCachedProperties(): Property[] {
    return Array.from(this.propertyCache.values());
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.propertyCache.clear();
    this.heatmapCache.clear();
  }

  /**
   * Handle browser visibility changes
   */
  private handleVisibilityChange() {
    if (document.hidden) {
      // Pause sync when tab is not visible
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
    } else {
      // Resume sync when tab becomes visible
      if (this.isActive && !this.syncInterval) {
        this.syncInterval = setInterval(() => {
          this.checkForUpdates();
        }, 30000);
        
        // Immediate check when tab becomes visible
        this.checkForUpdates();
      }
    }
  }

  /**
   * Check for updates (mock implementation)
   */
  private async checkForUpdates() {
    // In a real app, this would check with the server for updates
    // For now, we'll simulate occasional updates
    
    if (Math.random() < 0.1) { // 10% chance of update
      // Simulate a property update
      const cachedProperties = this.getCachedProperties();
      if (cachedProperties.length > 0) {
        const randomProperty = cachedProperties[Math.floor(Math.random() * cachedProperties.length)];
        
        // Simulate price change
        const updatedProperty = {
          ...randomProperty,
          pricing: {
            ...randomProperty.pricing,
            price: randomProperty.pricing.price * (0.95 + Math.random() * 0.1) // ±5% price change
          },
          updatedAt: new Date()
        };
        
        await this.updateProperty(updatedProperty);
      }
    }
  }

  /**
   * Mock property fetching (replace with real API call)
   */
  private async mockFetchProperties(bounds: MapBounds): Promise<Property[]> {
    // This would be replaced with actual API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Return mock properties within bounds
        resolve([]);
      }, 100);
    });
  }

  /**
   * Process properties with geocoding
   */
  private async processPropertiesWithGeocoding(properties: Property[]): Promise<Property[]> {
    const processedProperties: Property[] = [];
    
    for (const property of properties) {
      if (!property.location.coordinates) {
        try {
          const fullAddress = `${property.location.address}, ${property.location.city}, ${property.location.state}`;
          const geocodeResult = await geocodingService.geocodeAddress(fullAddress);
          
          processedProperties.push({
            ...property,
            location: {
              ...property.location,
              coordinates: geocodeResult.coordinates
            }
          });
        } catch (error) {
          console.warn(`Failed to geocode property ${property.id}:`, error);
          // Include property without coordinates
          processedProperties.push(property);
        }
      } else {
        processedProperties.push(property);
      }
    }
    
    return processedProperties;
  }

  /**
   * Generate heatmap data from properties
   */
  private generateHeatmapData(properties: Property[], bounds: MapBounds) {
    const gridSize = 0.01; // Approximately 1km grid
    const grid = new Map<string, { prices: number[]; count: number }>();
    
    properties.forEach(property => {
      if (!property.location.coordinates) return;
      
      const [lng, lat] = property.location.coordinates;
      
      // Check if property is within bounds
      if (lng < bounds.west || lng > bounds.east || lat < bounds.south || lat > bounds.north) {
        return;
      }
      
      const gridX = Math.floor(lng / gridSize);
      const gridY = Math.floor(lat / gridSize);
      const gridKey = `${gridX},${gridY}`;
      
      if (!grid.has(gridKey)) {
        grid.set(gridKey, { prices: [], count: 0 });
      }
      
      const gridData = grid.get(gridKey)!;
      gridData.prices.push(property.pricing.price);
      gridData.count++;
    });
    
    // Convert grid to heatmap data
    const heatmapData: Array<{
      coordinates: [number, number];
      price: number;
      count: number;
    }> = [];
    
    grid.forEach((gridData, gridKey) => {
      const [gridX, gridY] = gridKey.split(',').map(Number);
      const centerLng = (gridX + 0.5) * gridSize;
      const centerLat = (gridY + 0.5) * gridSize;
      const averagePrice = gridData.prices.reduce((sum, price) => sum + price, 0) / gridData.prices.length;
      
      heatmapData.push({
        coordinates: [centerLng, centerLat],
        price: averagePrice,
        count: gridData.count
      });
    });
    
    return heatmapData;
  }

  /**
   * Generate cache key for bounds
   */
  private getBoundsKey(bounds: MapBounds): string {
    return `${bounds.north.toFixed(4)},${bounds.south.toFixed(4)},${bounds.east.toFixed(4)},${bounds.west.toFixed(4)}`;
  }
}

// Export singleton instance
export const mapDataSyncService = new MapDataSyncService();
export default mapDataSyncService;