import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Property, 
  PropertySearchFilters, 
  PropertyCreateRequest, 
  PropertyUpdateRequest,
  PropertySearchResults
} from '../types/property';
import { propertyService } from '../services/api';

interface PropertyState {
  // Properties data
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  
  // Search and filters
  searchFilters: PropertySearchFilters;
  searchResults: PropertySearchResults | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalResults: number;
  
  // Actions
  fetchProperties: (filters?: PropertySearchFilters) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  createProperty: (data: PropertyCreateRequest) => Promise<Property | null>;
  updateProperty: (id: string, data: PropertyUpdateRequest) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<boolean>;
  setSearchFilters: (filters: Partial<PropertySearchFilters>) => void;
  resetSearchFilters: () => void;
  setCurrentPage: (page: number) => void;
  clearCurrentProperty: () => void;
}

// Default search filters
const defaultSearchFilters: PropertySearchFilters = {
  page: 1,
  limit: 12,
  sortBy: 'date_newest',
};

// Create the property store
export const usePropertyStore = create<PropertyState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        properties: [],
        currentProperty: null,
        isLoading: false,
        error: null,
        searchFilters: defaultSearchFilters,
        searchResults: null,
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
        
        // Actions
        fetchProperties: async (filters?: PropertySearchFilters) => {
          set({ isLoading: true, error: null });
          try {
            const appliedFilters = filters || get().searchFilters;
            const response = await propertyService.getProperties(appliedFilters);
            
            if (response.success) {
              set({ 
                properties: response.properties,
                totalPages: response.pagination?.totalPages || 0,
                totalResults: response.pagination?.total || 0,
                currentPage: response.pagination?.page || 1,
                searchResults: {
                  properties: response.properties,
                  total: response.pagination?.total || 0,
                  page: response.pagination?.page || 1,
                  limit: response.pagination?.limit || 12,
                  totalPages: response.pagination?.totalPages || 0,
                  filters: appliedFilters
                },
                isLoading: false
              });
            } else {
              set({ error: response.message || 'Failed to fetch properties', isLoading: false });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred', 
              isLoading: false 
            });
          }
        },
        
        fetchPropertyById: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await propertyService.getProperty(id);
            
            if (response.success) {
              set({ currentProperty: response.property, isLoading: false });
            } else {
              set({ error: response.message || 'Failed to fetch property', isLoading: false });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred', 
              isLoading: false 
            });
          }
        },
        
        createProperty: async (data: PropertyCreateRequest) => {
          set({ isLoading: true, error: null });
          try {
            const response = await propertyService.createProperty(data);
            
            if (response.success) {
              // Add the new property to the list if we have properties loaded
              const properties = get().properties;
              if (properties.length > 0) {
                set({ properties: [response.property, ...properties] });
              }
              
              set({ isLoading: false });
              return response.property;
            } else {
              set({ error: response.message || 'Failed to create property', isLoading: false });
              return null;
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred', 
              isLoading: false 
            });
            return null;
          }
        },
        
        updateProperty: async (id: string, data: PropertyUpdateRequest) => {
          set({ isLoading: true, error: null });
          try {
            const response = await propertyService.updateProperty(id, data);
            
            if (response.success) {
              // Update the property in the list if it exists
              const properties = get().properties;
              const updatedProperties = properties.map(p => 
                p.id === id ? response.property : p
              );
              
              // Update current property if it's the one being edited
              const currentProperty = get().currentProperty;
              if (currentProperty && currentProperty.id === id) {
                set({ currentProperty: response.property });
              }
              
              set({ properties: updatedProperties, isLoading: false });
              return response.property;
            } else {
              set({ error: response.message || 'Failed to update property', isLoading: false });
              return null;
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred', 
              isLoading: false 
            });
            return null;
          }
        },
        
        deleteProperty: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await propertyService.deleteProperty(id);
            
            if (response.success) {
              // Remove the property from the list
              const properties = get().properties.filter(p => p.id !== id);
              
              // Clear current property if it's the one being deleted
              const currentProperty = get().currentProperty;
              if (currentProperty && currentProperty.id === id) {
                set({ currentProperty: null });
              }
              
              set({ properties, isLoading: false });
              return true;
            } else {
              set({ error: response.message || 'Failed to delete property', isLoading: false });
              return false;
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred', 
              isLoading: false 
            });
            return false;
          }
        },
        
        setSearchFilters: (filters: Partial<PropertySearchFilters>) => {
          const currentFilters = get().searchFilters;
          set({ 
            searchFilters: { ...currentFilters, ...filters },
            // Reset to page 1 when filters change
            currentPage: 1
          });
        },
        
        resetSearchFilters: () => {
          set({ searchFilters: defaultSearchFilters, currentPage: 1 });
        },
        
        setCurrentPage: (page: number) => {
          set({ 
            currentPage: page,
            searchFilters: { ...get().searchFilters, page }
          });
        },
        
        clearCurrentProperty: () => {
          set({ currentProperty: null });
        }
      }),
      {
        name: 'property-storage',
        // Only persist certain parts of the state
        partialize: (state) => ({
          searchFilters: state.searchFilters,
          currentPage: state.currentPage,
        }),
      }
    )
  )
);