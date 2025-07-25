import { useCallback, useEffect } from 'react';
import { usePropertyStore } from '../store';
import { usePropertyFavorites } from './usePropertyFavorites';
import type { Property, PropertyCreateRequest, PropertyUpdateRequest } from '../types/property';

/**
 * Custom hook for managing individual property operations
 * @param propertyId - Optional property ID to fetch on mount
 */
export const useProperty = (propertyId?: string) => {
  const {
    properties,
    currentProperty,
    isLoading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    clearCurrentProperty,
  } = usePropertyStore();

  const { markAsViewed, isFavorite } = usePropertyFavorites();

  // Fetch property on mount if ID is provided
  useEffect(() => {
    if (propertyId) {
      fetchPropertyById(propertyId);
    }
    
    // Clear current property on unmount
    return () => {
      clearCurrentProperty();
    };
  }, [propertyId, fetchPropertyById, clearCurrentProperty]);

  // Mark property as viewed when it's loaded
  useEffect(() => {
    if (currentProperty) {
      markAsViewed(currentProperty);
    }
  }, [currentProperty, markAsViewed]);

  // Create a new property
  const handleCreateProperty = useCallback(async (data: PropertyCreateRequest) => {
    return await createProperty(data);
  }, [createProperty]);

  // Update an existing property
  const handleUpdateProperty = useCallback(async (id: string, data: PropertyUpdateRequest) => {
    return await updateProperty(id, data);
  }, [updateProperty]);

  // Delete a property
  const handleDeleteProperty = useCallback(async (id: string) => {
    return await deleteProperty(id);
  }, [deleteProperty]);

  // Check if the current property is a favorite
  const isCurrentPropertyFavorite = currentProperty ? isFavorite(currentProperty.id) : false;

  return {
    // State
    properties,
    property: currentProperty,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    isFavorite: isCurrentPropertyFavorite,
    
    // Actions
    fetchProperties,
    fetchProperty: fetchPropertyById,
    createProperty: handleCreateProperty,
    updateProperty: handleUpdateProperty,
    deleteProperty: handleDeleteProperty,
    clearProperty: clearCurrentProperty,
  };
};