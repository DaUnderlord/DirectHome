import axios from 'axios';
import { supabase } from '../lib/supabase';
import { 
  Property, 
  PropertySearchFilters, 
  PropertyCreateRequest, 
  PropertyUpdateRequest,
  PropertyImageUploadRequest,
  PropertyImageUpdateRequest,
  PropertyDocumentUploadRequest,
  PropertyApiResponse,
  PropertiesApiResponse,
  PropertyStatus,
  PropertyVerificationStatus,
  PropertyRules
} from '../types/property';
import type { ApiResponse } from '../types';
import { mockPropertyService } from './mockPropertyData';

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear auth data and dispatch unauthorized event
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');
      window.dispatchEvent(new Event('directhome:unauthorized'));
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to delay responses in development mode to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  // Get all properties with optional filters
  getProperties: async (filters?: PropertySearchFilters): Promise<PropertiesApiResponse> => {
    if (isDevelopment) {
      await delay(500); // Simulate network latency
      return mockPropertyService.getProperties(filters);
    }
    
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  // Get a single property by ID
  getProperty: async (id: string): Promise<PropertyApiResponse> => {
    if (isDevelopment) {
      await delay(300); // Simulate network latency
      return mockPropertyService.getProperty(id);
    }
    
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create a new property listing
  createProperty: async (property: PropertyCreateRequest): Promise<PropertyApiResponse> => {
    if (isDevelopment) {
      await delay(800); // Simulate network latency
      
      // Generate a mock property from the request
      const mockProperty: Property = {
        id: `prop-${Date.now()}`,
        title: property.title,
        description: property.description,
        ownerId: 'current-user',
        propertyType: property.propertyType,
        listingType: property.listingType,
        status: PropertyStatus.PENDING,
        verificationStatus: PropertyVerificationStatus.PENDING,
        location: {
          ...property.location,
          country: property.location.country || 'Nigeria',
        },
        features: {
          ...property.features,
        },
        images: [],
        pricing: {
          ...property.pricing,
        },
        availability: {
          ...property.availability,
        },
        rules: property.rules ? {
          smoking: property.rules.smoking ?? false,
          pets: property.rules.pets ?? false,
          parties: property.rules.parties ?? false,
          children: property.rules.children ?? false,
          additionalRules: property.rules.additionalRules || []
        } : undefined,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return {
        property: mockProperty,
        success: true,
      };
    }
    
    const response = await api.post('/properties', property);
    return response.data;
  },

  // Update an existing property
  updateProperty: async (id: string, property: PropertyUpdateRequest): Promise<PropertyApiResponse> => {
    if (isDevelopment) {
      await delay(600); // Simulate network latency
      
      // Get the existing property
      const existingResponse = await mockPropertyService.getProperty(id);
      const existingProperty = existingResponse.property;

      const baseRules: PropertyRules = existingProperty.rules || {
        smoking: false,
        pets: false,
        parties: false,
        children: false,
        additionalRules: []
      };

      const mergedRules: PropertyRules | undefined = property.rules
        ? { ...baseRules, ...property.rules }
        : existingProperty.rules;
      
      // Update the property with the new data
      const updatedProperty: Property = {
        ...existingProperty,
        ...property,
        location: {
          ...existingProperty.location,
          ...(property.location || {}),
        },
        features: {
          ...existingProperty.features,
          ...(property.features || {}),
        },
        pricing: {
          ...existingProperty.pricing,
          ...(property.pricing || {}),
        },
        availability: {
          ...existingProperty.availability,
          ...(property.availability || {}),
        },
        rules: mergedRules,
        updatedAt: new Date(),
      };
      
      return {
        property: updatedProperty,
        success: true,
      };
    }
    
    const response = await api.put(`/properties/${id}`, property);
    return response.data;
  },

  // Delete a property
  deleteProperty: async (id: string): Promise<ApiResponse<void>> => {
    if (isDevelopment) {
      await delay(400); // Simulate network latency
      return {
        success: true,
        data: undefined,
      };
    }
    
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
  
  // Upload property image
  uploadPropertyImage: async (data: PropertyImageUploadRequest): Promise<ApiResponse<{ image: string }>> => {
    if (isDevelopment) {
      await delay(1000); // Simulate network latency
      return {
        success: true,
        data: {
          image: `https://picsum.photos/seed/${Date.now()}/800/600`,
        },
      };
    }
    
    const formData = new FormData();
    formData.append('propertyId', data.propertyId);
    formData.append('image', data.image);
    if (data.isPrimary !== undefined) formData.append('isPrimary', String(data.isPrimary));
    if (data.caption) formData.append('caption', data.caption);
    
    const response = await api.post('/properties/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Update property image
  updatePropertyImage: async (data: PropertyImageUpdateRequest): Promise<ApiResponse<{ image: string }>> => {
    if (isDevelopment) {
      await delay(400); // Simulate network latency
      return {
        success: true,
        data: {
          image: `https://picsum.photos/seed/${data.imageId}/800/600`,
        },
      };
    }
    
    const response = await api.put(`/properties/images/${data.imageId}`, data);
    return response.data;
  },
  
  // Delete property image
  deletePropertyImage: async (imageId: string): Promise<ApiResponse<void>> => {
    if (isDevelopment) {
      await delay(300); // Simulate network latency
      return {
        success: true,
        data: undefined,
      };
    }
    
    const response = await api.delete(`/properties/images/${imageId}`);
    return response.data;
  },
  
  // Upload property document
  uploadPropertyDocument: async (data: PropertyDocumentUploadRequest): Promise<ApiResponse<{ document: string }>> => {
    if (isDevelopment) {
      await delay(800); // Simulate network latency
      return {
        success: true,
        data: {
          document: `https://example.com/documents/${data.title.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        },
      };
    }
    
    const formData = new FormData();
    formData.append('propertyId', data.propertyId);
    formData.append('document', data.document);
    formData.append('title', data.title);
    formData.append('type', data.type);
    
    const response = await api.post('/properties/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete property document
  deletePropertyDocument: async (documentId: string): Promise<ApiResponse<void>> => {
    if (isDevelopment) {
      await delay(300); // Simulate network latency
      return {
        success: true,
        data: undefined,
      };
    }
    
    const response = await api.delete(`/properties/documents/${documentId}`);
    return response.data;
  },
  
  // Feature a property (premium)
  featureProperty: async (id: string): Promise<PropertyApiResponse> => {
    if (isDevelopment) {
      await delay(500); // Simulate network latency
      
      // Get the existing property
      const existingResponse = await mockPropertyService.getProperty(id);
      const existingProperty = existingResponse.property;
      
      // Update the property with featured flag
      const updatedProperty: Property = {
        ...existingProperty,
        featured: true,
        updatedAt: new Date(),
      };
      
      return {
        property: updatedProperty,
        success: true,
      };
    }
    
    const response = await api.post(`/properties/${id}/feature`);
    return response.data;
  },
  
  // Get featured properties
  getFeaturedProperties: async (): Promise<PropertiesApiResponse> => {
    if (isDevelopment) {
      await delay(400); // Simulate network latency
      return mockPropertyService.getFeaturedProperties();
    }
    
    const response = await api.get('/properties/featured');
    return response.data;
  },
  
  // Get similar properties
  getSimilarProperties: async (id: string, limit: number = 4): Promise<PropertiesApiResponse> => {
    if (isDevelopment) {
      await delay(400); // Simulate network latency
      return mockPropertyService.getSimilarProperties(id, limit);
    }
    
    const response = await api.get(`/properties/${id}/similar`, { params: { limit } });
    return response.data;
  },
  
  // Get nearby properties
  getNearbyProperties: async (latitude: number, longitude: number, radius: number = 5, limit: number = 10): Promise<PropertiesApiResponse> => {
    if (isDevelopment) {
      await delay(500); // Simulate network latency
      return mockPropertyService.getProperties({ limit });
    }
    
    const response = await api.get('/properties/nearby', { 
      params: { latitude, longitude, radius, limit } 
    });
    return response.data;
  },
};

export default api;