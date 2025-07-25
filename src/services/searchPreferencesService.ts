/**
 * Service for managing search preferences and history
 */

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  filters?: any;
}

export interface SearchPreferences {
  recentSearches: SearchHistory[];
  favoriteLocations: string[];
  defaultFilters: any;
  searchRadius: number;
  autoComplete: boolean;
  saveHistory: boolean;
}

class SearchPreferencesService {
  private readonly STORAGE_KEY = 'search-preferences';
  private readonly HISTORY_KEY = 'search-history';
  private readonly MAX_HISTORY_ITEMS = 50;

  /**
   * Get user search preferences
   */
  getPreferences(): SearchPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultPreferences(),
          ...parsed,
          recentSearches: parsed.recentSearches?.map((search: any) => ({
            ...search,
            timestamp: new Date(search.timestamp)
          })) || []
        };
      }
    } catch (error) {
      console.error('Failed to load search preferences:', error);
    }
    
    return this.getDefaultPreferences();
  }

  /**
   * Save user search preferences
   */
  savePreferences(preferences: Partial<SearchPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save search preferences:', error);
    }
  }

  /**
   * Get search history
   */
  getSearchHistory(): SearchHistory[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
    
    return [];
  }

  /**
   * Add search to history
   */
  addToHistory(query: string, resultCount: number, filters?: any): void {
    if (!this.getPreferences().saveHistory) {
      return;
    }

    try {
      const history = this.getSearchHistory();
      
      // Remove duplicate if exists
      const filtered = history.filter(item => item.query !== query);
      
      // Add new search to beginning
      const newSearch: SearchHistory = {
        id: `search-${Date.now()}`,
        query,
        timestamp: new Date(),
        resultCount,
        filters
      };
      
      const updated = [newSearch, ...filtered].slice(0, this.MAX_HISTORY_ITEMS);
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add to search history:', error);
    }
  }

  /**
   * Clear search history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }

  /**
   * Remove specific search from history
   */
  removeFromHistory(id: string): void {
    try {
      const history = this.getSearchHistory();
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove from search history:', error);
    }
  }

  /**
   * Add location to favorites
   */
  addFavoriteLocation(location: string): void {
    try {
      const preferences = this.getPreferences();
      const updated = {
        ...preferences,
        favoriteLocations: [...new Set([location, ...preferences.favoriteLocations])]
      };
      this.savePreferences(updated);
    } catch (error) {
      console.error('Failed to add favorite location:', error);
    }
  }

  /**
   * Remove location from favorites
   */
  removeFavoriteLocation(location: string): void {
    try {
      const preferences = this.getPreferences();
      const updated = {
        ...preferences,
        favoriteLocations: preferences.favoriteLocations.filter(loc => loc !== location)
      };
      this.savePreferences(updated);
    } catch (error) {
      console.error('Failed to remove favorite location:', error);
    }
  }

  /**
   * Get popular searches (most frequent)
   */
  getPopularSearches(limit: number = 10): SearchHistory[] {
    try {
      const history = this.getSearchHistory();
      
      // Count frequency of each query
      const frequency = new Map<string, { count: number; latest: SearchHistory }>();
      
      history.forEach(search => {
        const current = frequency.get(search.query);
        if (current) {
          current.count++;
          if (search.timestamp > current.latest.timestamp) {
            current.latest = search;
          }
        } else {
          frequency.set(search.query, { count: 1, latest: search });
        }
      });
      
      // Sort by frequency and return latest search for each query
      return Array.from(frequency.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map(item => item.latest);
    } catch (error) {
      console.error('Failed to get popular searches:', error);
      return [];
    }
  }

  /**
   * Get recent searches (by time)
   */
  getRecentSearches(limit: number = 10): SearchHistory[] {
    try {
      return this.getSearchHistory()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get recent searches:', error);
      return [];
    }
  }

  /**
   * Search in history
   */
  searchHistory(query: string): SearchHistory[] {
    try {
      const history = this.getSearchHistory();
      const lowerQuery = query.toLowerCase();
      
      return history.filter(search =>
        search.query.toLowerCase().includes(lowerQuery)
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to search history:', error);
      return [];
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): SearchPreferences {
    return {
      recentSearches: [],
      favoriteLocations: [],
      defaultFilters: {},
      searchRadius: 10, // km
      autoComplete: true,
      saveHistory: true
    };
  }

  /**
   * Export search data
   */
  exportData(): { preferences: SearchPreferences; history: SearchHistory[] } {
    return {
      preferences: this.getPreferences(),
      history: this.getSearchHistory()
    };
  }

  /**
   * Import search data
   */
  importData(data: { preferences?: SearchPreferences; history?: SearchHistory[] }): void {
    try {
      if (data.preferences) {
        this.savePreferences(data.preferences);
      }
      
      if (data.history) {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data.history));
      }
    } catch (error) {
      console.error('Failed to import search data:', error);
    }
  }
}

// Export singleton instance
export const searchPreferencesService = new SearchPreferencesService();
export default searchPreferencesService;