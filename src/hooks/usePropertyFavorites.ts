import { useCallback } from 'react';
import { useFavoritesStore } from '../store';
import type { Property } from '../types/property';

/**
 * Custom hook for managing property favorites and recently viewed
 */
export const usePropertyFavorites = () => {
  const {
    favorites,
    favoriteIds,
    recentlyViewed,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
  } = useFavoritesStore();

  // Mark a property as viewed (adds to recently viewed)
  const markAsViewed = useCallback((property: Property) => {
    addToRecentlyViewed(property);
  }, [addToRecentlyViewed]);

  // Get favorite status with memoization
  const getFavoriteStatus = useCallback((propertyId: string) => {
    return isFavorite(propertyId);
  }, [isFavorite]);

  return {
    // State
    favorites,
    favoriteIds,
    recentlyViewed,
    
    // Favorites actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite: getFavoriteStatus,
    clearFavorites,
    
    // Recently viewed actions
    markAsViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
  };
};