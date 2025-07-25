import { useCallback, useEffect } from 'react';
import { usePropertyStore } from '../store';
import type { PropertySearchFilters } from '../types/property';

/**
 * Custom hook for property search functionality
 * @param initialFilters - Initial search filters
 * @param autoSearch - Whether to automatically search on mount or filter changes
 */
export const usePropertySearch = (
  initialFilters?: Partial<PropertySearchFilters>,
  autoSearch: boolean = true
) => {
  const {
    properties,
    searchFilters,
    searchResults,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalResults,
    fetchProperties,
    setSearchFilters,
    resetSearchFilters,
    setCurrentPage,
  } = usePropertyStore();

  // Set initial filters if provided
  useEffect(() => {
    if (initialFilters) {
      setSearchFilters(initialFilters);
    }
  }, [initialFilters, setSearchFilters]);

  // Fetch properties when filters change if autoSearch is true
  useEffect(() => {
    if (autoSearch) {
      fetchProperties();
    }
  }, [autoSearch, fetchProperties, searchFilters]);

  // Search function that can be called manually
  const search = useCallback((filters?: Partial<PropertySearchFilters>) => {
    if (filters) {
      setSearchFilters(filters);
    }
    return fetchProperties();
  }, [fetchProperties, setSearchFilters]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (!autoSearch) {
      fetchProperties({ ...searchFilters, page });
    }
  }, [autoSearch, fetchProperties, searchFilters, setCurrentPage]);

  // Apply a single filter and optionally search
  const applyFilter = useCallback((key: keyof PropertySearchFilters, value: any, searchNow: boolean = autoSearch) => {
    setSearchFilters({ [key]: value });
    if (searchNow && !autoSearch) {
      fetchProperties({ ...searchFilters, [key]: value });
    }
  }, [autoSearch, fetchProperties, searchFilters, setSearchFilters]);

  return {
    // State
    properties,
    searchFilters,
    searchResults,
    isLoading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalResults,
    },

    // Actions
    search,
    applyFilter,
    setSearchFilters,
    resetSearchFilters,
    handlePageChange,
  };
};