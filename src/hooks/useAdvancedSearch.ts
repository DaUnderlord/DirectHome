import { useState, useEffect, useCallback } from 'react';
import { geocodingService } from '../services/geocodingService';
import { SearchSuggestion, SavedSearch, FilterPreset } from '../components/Map/AdvancedSearchPanel';
import { 
  IconHome, 
  IconBuilding, 
  IconCurrencyNaira, 
  IconMapPin,
  IconStar,
  IconTrendingUp
} from '@tabler/icons-react';
import { PropertyType, ListingType } from '../types/property';

interface UseAdvancedSearchOptions {
  maxSuggestions?: number;
  maxSavedSearches?: number;
}

export function useAdvancedSearch(options: UseAdvancedSearchOptions = {}) {
  const { maxSuggestions = 10, maxSavedSearches = 20 } = options;
  
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default filter presets
  const filterPresets: FilterPreset[] = [
    {
      id: 'affordable-homes',
      name: 'Affordable Homes',
      description: 'Properties under ₦2M',
      icon: IconHome,
      filters: {
        propertyTypes: [PropertyType.HOUSE, PropertyType.APARTMENT],
        priceRange: { min: 0, max: 2000000 },
        listingTypes: [ListingType.SALE]
      }
    },
    {
      id: 'luxury-properties',
      name: 'Luxury Properties',
      description: 'High-end properties over ₦10M',
      icon: IconStar,
      filters: {
        priceRange: { min: 10000000, max: 0 },
        listingTypes: [ListingType.SALE]
      }
    },
    {
      id: 'rental-apartments',
      name: 'Rental Apartments',
      description: 'Apartments for rent',
      icon: IconBuilding,
      filters: {
        propertyTypes: [PropertyType.APARTMENT, PropertyType.CONDO],
        listingTypes: [ListingType.RENT]
      }
    },
    {
      id: 'family-homes',
      name: 'Family Homes',
      description: '3+ bedroom houses',
      icon: IconHome,
      filters: {
        propertyTypes: [PropertyType.HOUSE],
        bedrooms: [3, 4, 5],
        listingTypes: [ListingType.SALE, ListingType.RENT]
      }
    },
    {
      id: 'investment-properties',
      name: 'Investment Properties',
      description: 'Properties with good ROI potential',
      icon: IconTrendingUp,
      filters: {
        propertyTypes: [PropertyType.APARTMENT, PropertyType.COMMERCIAL],
        listingTypes: [ListingType.SALE]
      }
    },
    {
      id: 'budget-rentals',
      name: 'Budget Rentals',
      description: 'Affordable rental properties',
      icon: IconCurrencyNaira,
      filters: {
        priceRange: { min: 0, max: 500000 },
        listingTypes: [ListingType.RENT]
      }
    }
  ];

  // Load saved searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('advanced-search-saved');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: new Date(search.lastUsed)
        })));
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }, []);

  // Save searches to localStorage
  const saveToPersistence = useCallback((searches: SavedSearch[]) => {
    try {
      localStorage.setItem('advanced-search-saved', JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save searches:', error);
    }
  }, []);

  // Generate search suggestions
  const generateSuggestions = useCallback(async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      const suggestions: SearchSuggestion[] = [];

      // Add location suggestions from geocoding
      try {
        const geocodeResults = await geocodingService.searchLocations(query, { limit: 5 });
        geocodeResults.forEach((result, index) => {
          suggestions.push({
            id: `location-${index}`,
            text: result.placeName,
            type: 'location',
            coordinates: result.coordinates,
            description: result.context?.join(', ')
          });
        });
      } catch (geocodeError) {
        console.warn('Geocoding failed:', geocodeError);
      }

      // Add popular area suggestions (mock data)
      const popularAreas = [
        'Victoria Island',
        'Lekki Phase 1',
        'Ikeja GRA',
        'Ikoyi',
        'Surulere',
        'Yaba',
        'Ajah',
        'Magodo'
      ];

      popularAreas
        .filter(area => area.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach((area, index) => {
          suggestions.push({
            id: `area-${index}`,
            text: area,
            type: 'area',
            description: 'Popular area in Lagos'
          });
        });

      // Add property type suggestions
      const propertyTypes = [
        { name: 'Houses', type: PropertyType.HOUSE },
        { name: 'Apartments', type: PropertyType.APARTMENT },
        { name: 'Condos', type: PropertyType.CONDO },
        { name: 'Commercial', type: PropertyType.COMMERCIAL }
      ];

      propertyTypes
        .filter(pt => pt.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .forEach((pt, index) => {
          suggestions.push({
            id: `property-${index}`,
            text: pt.name,
            type: 'property',
            description: `Search for ${pt.name.toLowerCase()}`
          });
        });

      return suggestions.slice(0, maxSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setError('Failed to load suggestions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [maxSuggestions]);

  // Update suggestions
  const updateSuggestions = useCallback(async (query: string) => {
    const newSuggestions = await generateSuggestions(query);
    setSuggestions(newSuggestions);
  }, [generateSuggestions]);

  // Save a search
  const saveSearch = useCallback((name: string, query: string, filters: any) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      query,
      filters,
      createdAt: new Date(),
      lastUsed: new Date()
    };

    const updatedSearches = [newSearch, ...savedSearches]
      .slice(0, maxSavedSearches);

    setSavedSearches(updatedSearches);
    saveToPersistence(updatedSearches);
  }, [savedSearches, maxSavedSearches, saveToPersistence]);

  // Delete a saved search
  const deleteSavedSearch = useCallback((id: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id);
    setSavedSearches(updatedSearches);
    saveToPersistence(updatedSearches);
  }, [savedSearches, saveToPersistence]);

  // Update last used time for a saved search
  const updateLastUsed = useCallback((id: string) => {
    const updatedSearches = savedSearches.map(search =>
      search.id === id
        ? { ...search, lastUsed: new Date() }
        : search
    );
    setSavedSearches(updatedSearches);
    saveToPersistence(updatedSearches);
  }, [savedSearches, saveToPersistence]);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Clear all saved searches
  const clearSavedSearches = useCallback(() => {
    setSavedSearches([]);
    localStorage.removeItem('advanced-search-saved');
  }, []);

  return {
    // State
    suggestions,
    savedSearches,
    filterPresets,
    isLoading,
    error,

    // Actions
    updateSuggestions,
    saveSearch,
    deleteSavedSearch,
    updateLastUsed,
    clearSuggestions,
    clearSavedSearches
  };
}