import { useState, useCallback, useMemo } from 'react';
import { usePropertyStore } from '../store';
import type { PropertySearchFilters, PropertyType, ListingType } from '../types/property';

// Bounds interface for map-based search
interface Bounds {
  southwest: {
    lat: number;
    lng: number;
  };
  northeast: {
    lat: number;
    lng: number;
  };
}

// Extended search filters with bounds
interface ExtendedSearchFilters extends PropertySearchFilters {
  bounds?: Bounds;
}

/**
 * Custom hook for managing property search filters
 * @param initialFilters - Initial search filters
 */
export const usePropertyFilters = (initialFilters?: Partial<ExtendedSearchFilters>) => {
  const { searchFilters, setSearchFilters, resetSearchFilters } = usePropertyStore();
  const [localFilters, setLocalFilters] = useState<Partial<ExtendedSearchFilters>>(initialFilters || {});

  // Apply filters to the store
  const applyFilters = useCallback(() => {
    // Convert bounds to coordinates for API if present
    const filtersToApply = { ...localFilters };

    if (filtersToApply.bounds) {
      // Extract coordinates for API
      filtersToApply.centerLat = (filtersToApply.bounds.northeast.lat + filtersToApply.bounds.southwest.lat) / 2;
      filtersToApply.centerLng = (filtersToApply.bounds.northeast.lng + filtersToApply.bounds.southwest.lng) / 2;

      // Calculate radius in kilometers (approximate)
      const latDiff = Math.abs(filtersToApply.bounds.northeast.lat - filtersToApply.bounds.southwest.lat);
      const lngDiff = Math.abs(filtersToApply.bounds.northeast.lng - filtersToApply.bounds.southwest.lng);

      // Rough conversion to kilometers (very approximate)
      const latKm = latDiff * 111; // 1 degree lat ≈ 111 km
      const lngKm = lngDiff * 111 * Math.cos(filtersToApply.centerLat * Math.PI / 180);

      filtersToApply.radius = Math.max(latKm, lngKm) / 2;

      // Remove bounds as it's not part of the API
      delete filtersToApply.bounds;
    }

    setSearchFilters(filtersToApply);
  }, [localFilters, setSearchFilters]);

  // Update a single filter
  const updateFilter = useCallback(<K extends keyof ExtendedSearchFilters>(
    key: K,
    value: ExtendedSearchFilters[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Remove a filter
  const removeFilter = useCallback((key: keyof ExtendedSearchFilters) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Reset local filters
  const resetLocalFilters = useCallback(() => {
    setLocalFilters({});
  }, []);

  // Reset all filters (both local and in store)
  const resetAllFilters = useCallback(() => {
    resetLocalFilters();
    resetSearchFilters();
  }, [resetLocalFilters, resetSearchFilters]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(localFilters).length > 0;
  }, [localFilters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(localFilters).length;
  }, [localFilters]);

  // Helper functions for common filter operations
  const setPropertyType = useCallback((type: PropertyType[] | undefined) => {
    updateFilter('propertyType', type);
  }, [updateFilter]);

  const setListingType = useCallback((type: ListingType | undefined) => {
    updateFilter('listingType', type);
  }, [updateFilter]);

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setLocalFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  }, []);

  const setBedroomRange = useCallback((min?: number, max?: number) => {
    setLocalFilters(prev => ({
      ...prev,
      minBedrooms: min,
      maxBedrooms: max
    }));
  }, []);

  // Set search bounds from map
  const setSearchBounds = useCallback((bounds: Bounds | undefined) => {
    if (bounds) {
      updateFilter('bounds', bounds);
    } else {
      removeFilter('bounds');
    }
  }, [updateFilter, removeFilter]);

  return {
    // State
    filters: localFilters,
    storeFilters: searchFilters,
    hasActiveFilters,
    activeFilterCount,

    // Actions
    updateFilter,
    removeFilter,
    applyFilters,
    resetLocalFilters,
    resetAllFilters,

    // Helper functions
    setPropertyType,
    setListingType,
    setPriceRange,
    setBedroomRange,
    setSearchBounds,
  };
};