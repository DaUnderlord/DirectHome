// Mapbox token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1Ijoic3VubGVzcyIsImEiOiJjbWRmM3ppMHEwOXg0MmpyMTVxdW1tZGFsIn0.kNLc04GFk9sj2ihfB0YV4A';

// Nigeria bounds for validation
const NIGERIA_BOUNDS = {
    southwest: [2.6917, 4.2406], // [lng, lat]
    northeast: [14.6775, 13.8659]
};

export interface GeocodeResult {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
    confidence: number; // 0-1 scale
    components: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    };
    bounds?: {
        northeast: [number, number];
        southwest: [number, number];
    };
}

export interface GeocodingCache {
    [address: string]: {
        result: GeocodeResult;
        timestamp: number;
        expiresAt: number;
    };
}

class GeocodingService {
    private cache: GeocodingCache = {};
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    private readonly MAX_CACHE_SIZE = 1000;

    constructor() {
        this.loadCacheFromStorage();
    }

    /**
     * Geocode a single address to coordinates
     */
    async geocodeAddress(address: string): Promise<GeocodeResult> {
        // Check cache first
        const cached = this.getCachedResult(address);
        if (cached) {
            return cached;
        }

        try {
            // Try Mapbox Geocoding API first
            const result = await this.geocodeWithMapbox(address);

            // Validate coordinates are within Nigeria
            if (this.isWithinNigeria(result.coordinates)) {
                this.cacheResult(address, result);
                return result;
            }

            // If not in Nigeria, try to get a more specific result
            const nigeriaSpecificResult = await this.geocodeWithMapbox(`${address}, Nigeria`);
            if (this.isWithinNigeria(nigeriaSpecificResult.coordinates)) {
                this.cacheResult(address, nigeriaSpecificResult);
                return nigeriaSpecificResult;
            }

            throw new Error('Address not found within Nigeria');
        } catch (error) {
            console.error('Geocoding failed:', error);

            // Fallback: try to extract city/state and use approximate coordinates
            const fallbackResult = this.getFallbackCoordinates(address);
            if (fallbackResult) {
                this.cacheResult(address, fallbackResult);
                return fallbackResult;
            }

            throw new Error(`Unable to geocode address: ${address}`);
        }
    }

    /**
     * Search for locations with autocomplete
     */
    async searchLocations(query: string, options: { limit?: number } = {}): Promise<Array<{
        placeName: string;
        coordinates: [number, number];
        context?: string[];
        relevance?: number;
    }>> {
        const { limit = 5 } = options;
        
        if (!query.trim()) {
            return [];
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=ng&limit=${limit}&autocomplete=true`
            );

            if (!response.ok) {
                throw new Error('Location search request failed');
            }

            const data = await response.json();
            
            return data.features.map((feature: any) => ({
                placeName: feature.place_name,
                coordinates: feature.center as [number, number],
                context: feature.context?.map((ctx: any) => ctx.text) || [],
                relevance: feature.relevance || 0
            }));
        } catch (error) {
            console.error('Location search failed:', error);
            
            // Fallback to mock data for development
            return this.getMockSearchResults(query, limit);
        }
    }

    /**
     * Get mock search results for development/fallback
     */
    private getMockSearchResults(query: string, limit: number): Array<{
        placeName: string;
        coordinates: [number, number];
        context?: string[];
        relevance?: number;
    }> {
        const mockLocations = [
            { name: 'Victoria Island', coords: [3.4219, 6.4281] as [number, number], context: ['Lagos Island', 'Lagos State'] },
            { name: 'Lekki Phase 1', coords: [3.4700, 6.4474] as [number, number], context: ['Lekki', 'Lagos State'] },
            { name: 'Ikeja GRA', coords: [3.3515, 6.5966] as [number, number], context: ['Ikeja', 'Lagos State'] },
            { name: 'Ikoyi', coords: [3.4441, 6.4474] as [number, number], context: ['Lagos Island', 'Lagos State'] },
            { name: 'Surulere', coords: [3.3792, 6.5244] as [number, number], context: ['Lagos Mainland', 'Lagos State'] },
            { name: 'Yaba', coords: [3.3792, 6.5158] as [number, number], context: ['Lagos Mainland', 'Lagos State'] },
            { name: 'Ajah', coords: [3.5670, 6.4698] as [number, number], context: ['Eti-Osa', 'Lagos State'] },
            { name: 'Magodo', coords: [3.3792, 6.5792] as [number, number], context: ['Kosofe', 'Lagos State'] }
        ];

        const filtered = mockLocations
            .filter(location => location.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, limit);

        return filtered.map((location, index) => ({
            placeName: `${location.name}, Lagos, Nigeria`,
            coordinates: location.coords,
            context: location.context,
            relevance: 1 - (index * 0.1)
        }));
    }

    /**
     * Reverse geocode coordinates to address
     */
    async reverseGeocode(lat: number, lng: number): Promise<string> {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&country=ng&types=address,poi`
            );

            if (!response.ok) {
                throw new Error('Reverse geocoding request failed');
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                return data.features[0].place_name;
            }

            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    }

    /**
     * Batch geocode multiple addresses
     */
    async batchGeocode(addresses: string[]): Promise<GeocodeResult[]> {
        const results: GeocodeResult[] = [];
        const batchSize = 5; // Process in batches to avoid rate limiting

        for (let i = 0; i < addresses.length; i += batchSize) {
            const batch = addresses.slice(i, i + batchSize);
            const batchPromises = batch.map(address =>
                this.geocodeAddress(address).catch(error => {
                    console.error(`Failed to geocode ${address}:`, error);
                    return this.getFallbackCoordinates(address) || {
                        address,
                        coordinates: [3.3792, 6.5244] as [number, number], // Default to Lagos
                        confidence: 0.1,
                        components: {}
                    };
                })
            );

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Add delay between batches to respect rate limits
            if (i + batchSize < addresses.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return results;
    }

    /**
     * Geocode using Mapbox API
     */
    private async geocodeWithMapbox(address: string): Promise<GeocodeResult> {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=ng&limit=1`
        );

        if (!response.ok) {
            throw new Error('Mapbox geocoding request failed');
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            throw new Error('No results found');
        }

        const feature = data.features[0];
        const [lng, lat] = feature.center;

        // Extract address components
        const components: GeocodeResult['components'] = {};

        if (feature.context) {
            for (const context of feature.context) {
                if (context.id.startsWith('place')) {
                    components.city = context.text;
                } else if (context.id.startsWith('region')) {
                    components.state = context.text;
                } else if (context.id.startsWith('country')) {
                    components.country = context.text;
                } else if (context.id.startsWith('postcode')) {
                    components.postalCode = context.text;
                }
            }
        }

        // Extract street from address
        if (feature.properties?.address) {
            components.street = feature.properties.address;
        }

        return {
            address: feature.place_name,
            coordinates: [lng, lat],
            confidence: feature.relevance || 0.8,
            components,
            bounds: feature.bbox ? {
                southwest: [feature.bbox[0], feature.bbox[1]],
                northeast: [feature.bbox[2], feature.bbox[3]]
            } : undefined
        };
    }

    /**
     * Check if coordinates are within Nigeria bounds
     */
    private isWithinNigeria(coordinates: [number, number]): boolean {
        const [lng, lat] = coordinates;
        return (
            lng >= NIGERIA_BOUNDS.southwest[0] &&
            lng <= NIGERIA_BOUNDS.northeast[0] &&
            lat >= NIGERIA_BOUNDS.southwest[1] &&
            lat <= NIGERIA_BOUNDS.northeast[1]
        );
    }

    /**
     * Get fallback coordinates for major Nigerian cities
     */
    private getFallbackCoordinates(address: string): GeocodeResult | null {
        const cityCoordinates: { [key: string]: [number, number] } = {
            'lagos': [3.3792, 6.5244],
            'abuja': [7.3986, 9.0765],
            'kano': [8.5264, 12.0022],
            'ibadan': [3.9470, 7.3775],
            'port harcourt': [7.0134, 4.8156],
            'benin': [5.6037, 6.3350],
            'maiduguri': [13.0827, 11.8311],
            'zaria': [7.7104, 11.0449],
            'aba': [7.3667, 5.1167],
            'jos': [8.8965, 9.9285],
            'ilorin': [4.5421, 8.4966],
            'oyo': [3.9313, 7.8526],
            'enugu': [7.5109, 6.2649],
            'abeokuta': [3.3515, 7.1475],
            'kaduna': [7.4951, 10.5264],
            'akure': [5.1931, 7.2526],
            'bauchi': [9.8442, 10.3158],
            'sokoto': [5.2339, 13.0059],
            'onitsha': [6.7833, 6.1667],
            'warri': [5.7500, 5.5167]
        };

        const normalizedAddress = address.toLowerCase();

        for (const [city, coordinates] of Object.entries(cityCoordinates)) {
            if (normalizedAddress.includes(city)) {
                return {
                    address: `${city.charAt(0).toUpperCase() + city.slice(1)}, Nigeria`,
                    coordinates,
                    confidence: 0.6,
                    components: {
                        city: city.charAt(0).toUpperCase() + city.slice(1),
                        country: 'Nigeria'
                    }
                };
            }
        }

        return null;
    }

    /**
     * Get cached result if available and not expired
     */
    private getCachedResult(address: string): GeocodeResult | null {
        const cached = this.cache[address.toLowerCase()];

        if (cached && Date.now() < cached.expiresAt) {
            return cached.result;
        }

        // Remove expired cache entry
        if (cached) {
            delete this.cache[address.toLowerCase()];
            this.saveCacheToStorage();
        }

        return null;
    }

    /**
     * Cache geocoding result
     */
    private cacheResult(address: string, result: GeocodeResult): void {
        const now = Date.now();

        // Clean up old entries if cache is getting too large
        if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
            this.cleanupCache();
        }

        this.cache[address.toLowerCase()] = {
            result,
            timestamp: now,
            expiresAt: now + this.CACHE_DURATION
        };

        this.saveCacheToStorage();
    }

    /**
     * Clean up expired cache entries
     */
    private cleanupCache(): void {
        const now = Date.now();
        const entries = Object.entries(this.cache);

        // Remove expired entries
        entries.forEach(([address, cached]) => {
            if (now >= cached.expiresAt) {
                delete this.cache[address];
            }
        });

        // If still too large, remove oldest entries
        const remainingEntries = Object.entries(this.cache);
        if (remainingEntries.length >= this.MAX_CACHE_SIZE) {
            remainingEntries
                .sort((a, b) => a[1].timestamp - b[1].timestamp)
                .slice(0, remainingEntries.length - this.MAX_CACHE_SIZE + 100)
                .forEach(([address]) => {
                    delete this.cache[address];
                });
        }
    }

    /**
     * Load cache from localStorage
     */
    private loadCacheFromStorage(): void {
        try {
            const stored = localStorage.getItem('geocoding_cache');
            if (stored) {
                this.cache = JSON.parse(stored);
                this.cleanupCache(); // Clean up any expired entries
            }
        } catch (error) {
            console.error('Failed to load geocoding cache:', error);
            this.cache = {};
        }
    }

    /**
     * Save cache to localStorage
     */
    private saveCacheToStorage(): void {
        try {
            localStorage.setItem('geocoding_cache', JSON.stringify(this.cache));
        } catch (error) {
            console.error('Failed to save geocoding cache:', error);
        }
    }

    /**
     * Clear all cached results
     */
    clearCache(): void {
        this.cache = {};
        localStorage.removeItem('geocoding_cache');
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): { size: number; hitRate: number } {
        const size = Object.keys(this.cache).length;
        // Hit rate would need to be tracked separately in a real implementation
        return { size, hitRate: 0 };
    }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
export default geocodingService;