import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';
import { Property } from '../types/property';

interface FavoritesState {
  // Favorites
  favorites: Property[];
  favoriteIds: Set<string>;

  // Recently viewed
  recentlyViewed: Property[];

  // Actions
  addToFavorites: (property: Property) => void;
  removeFromFavorites: (propertyId: string) => void;
  toggleFavorite: (property: Property) => void;
  isFavorite: (propertyId: string) => boolean;
  clearFavorites: () => void;

  addToRecentlyViewed: (property: Property) => void;
  removeFromRecentlyViewed: (propertyId: string) => void;
  clearRecentlyViewed: () => void;
}

// Maximum number of recently viewed properties to store
const MAX_RECENTLY_VIEWED = 20;

// Custom storage options for handling Set serialization
type FavoritesStorageOptions = PersistOptions<FavoritesState> & {
  serialize?: (state: FavoritesState) => string;
  deserialize?: (str: string) => FavoritesState;
};

const favoritesStorageOptions: FavoritesStorageOptions = {
  name: 'favorites-storage',
  // Custom serialization to handle Set
  serialize: (state: FavoritesState) => {
    return JSON.stringify({
      ...state,
      favoriteIds: Array.from(state.favoriteIds)
    });
  },
  // Custom deserialization to handle Set
  deserialize: (str: string) => {
    const parsed = JSON.parse(str);
    return {
      ...parsed,
      favoriteIds: new Set(parsed.favoriteIds)
    };
  }
};

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        favorites: [],
        favoriteIds: new Set<string>(),
        recentlyViewed: [],

        // Favorites actions
        addToFavorites: (property: Property) => {
          const favorites = get().favorites;
          const favoriteIds = get().favoriteIds;

          // Only add if not already in favorites
          if (!favoriteIds.has(property.id)) {
            const updatedFavorites = [property, ...favorites];
            const updatedIds = new Set(favoriteIds);
            updatedIds.add(property.id);

            set({
              favorites: updatedFavorites,
              favoriteIds: updatedIds
            });
          }
        },

        removeFromFavorites: (propertyId: string) => {
          const favorites = get().favorites;
          const favoriteIds = get().favoriteIds;

          const updatedFavorites = favorites.filter(p => p.id !== propertyId);
          const updatedIds = new Set(favoriteIds);
          updatedIds.delete(propertyId);

          set({
            favorites: updatedFavorites,
            favoriteIds: updatedIds
          });
        },

        toggleFavorite: (property: Property) => {
          const isFavorite = get().favoriteIds.has(property.id);

          if (isFavorite) {
            get().removeFromFavorites(property.id);
          } else {
            get().addToFavorites(property);
          }
        },

        isFavorite: (propertyId: string) => {
          return get().favoriteIds.has(propertyId);
        },

        clearFavorites: () => {
          set({ favorites: [], favoriteIds: new Set() });
        },

        // Recently viewed actions
        addToRecentlyViewed: (property: Property) => {
          const recentlyViewed = get().recentlyViewed;

          // Remove if already in the list
          const filtered = recentlyViewed.filter(p => p.id !== property.id);

          // Add to the beginning of the list
          const updated = [property, ...filtered];

          // Limit the number of items
          const limited = updated.slice(0, MAX_RECENTLY_VIEWED);

          set({ recentlyViewed: limited });
        },

        removeFromRecentlyViewed: (propertyId: string) => {
          const recentlyViewed = get().recentlyViewed;
          const updated = recentlyViewed.filter(p => p.id !== propertyId);

          set({ recentlyViewed: updated });
        },

        clearRecentlyViewed: () => {
          set({ recentlyViewed: [] });
        },
      }),
      favoritesStorageOptions as PersistOptions<FavoritesState>
    )
  )
);