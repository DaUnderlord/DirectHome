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
import propertyDbService, { mapDbPropertyToProperty } from './propertyService';

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
    // Use real Supabase service
    return propertyDbService.searchProperties(filters);
  },

  // Get a single property by ID
  getProperty: async (id: string): Promise<PropertyApiResponse> => {
    // Use real Supabase service
    return propertyDbService.getProperty(id);
  },

  // Create a new property listing
  createProperty: async (property: PropertyCreateRequest): Promise<PropertyApiResponse> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated',
          property: null as any
        };
      }

      // Insert property into database
      const { data, error } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          title: property.title,
          description: property.description,
          property_type: property.propertyType,
          listing_type: property.listingType,
          status: 'pending',
          verification_status: 'unverified',
          // Location
          address: property.location.address,
          city: property.location.city,
          state: property.location.state,
          zip_code: property.location.zipCode,
          country: property.location.country || 'Nigeria',
          latitude: property.location.latitude,
          longitude: property.location.longitude,
          // Features
          bedrooms: property.features.bedrooms,
          bathrooms: property.features.bathrooms,
          square_footage: property.features.squareFootage,
          year_built: property.features.yearBuilt,
          furnished: property.features.furnished,
          pets_allowed: property.features.petsAllowed,
          amenities: property.features.amenities || [],
          // Pricing
          price: property.pricing.price,
          currency: property.pricing.currency || 'NGN',
          payment_frequency: property.pricing.paymentFrequency,
          security_deposit: property.pricing.securityDeposit,
          negotiable: property.pricing.negotiable,
          // Availability
          available_from: property.availability.availableFrom,
          minimum_stay: property.availability.minimumStay,
          maximum_stay: property.availability.maximumStay,
          // Rules
          smoking_allowed: property.rules?.smoking || false,
          parties_allowed: property.rules?.parties || false,
          children_allowed: property.rules?.children !== false,
          additional_rules: property.rules?.additionalRules || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        return {
          success: false,
          message: error.message,
          property: null as any
        };
      }

      // Map database property to frontend type
      const createdProperty = mapDbPropertyToProperty(data, []);

      return {
        property: createdProperty,
        success: true
      };
    } catch (error) {
      console.error('Property creation failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create property',
        property: null as any
      };
    }
  },

  // Update an existing property
  updateProperty: async (id: string, property: PropertyUpdateRequest): Promise<PropertyApiResponse> => {
    try {
      // Build update object
      const updateData: any = {};
      
      if (property.title) updateData.title = property.title;
      if (property.description) updateData.description = property.description;
      if (property.propertyType) updateData.property_type = property.propertyType;
      if (property.listingType) updateData.listing_type = property.listingType;
      if (property.status) updateData.status = property.status;
      
      // Location updates
      if (property.location) {
        if (property.location.address) updateData.address = property.location.address;
        if (property.location.city) updateData.city = property.location.city;
        if (property.location.state) updateData.state = property.location.state;
        if (property.location.zipCode) updateData.zip_code = property.location.zipCode;
        if (property.location.latitude) updateData.latitude = property.location.latitude;
        if (property.location.longitude) updateData.longitude = property.location.longitude;
      }
      
      // Features updates
      if (property.features) {
        if (property.features.bedrooms !== undefined) updateData.bedrooms = property.features.bedrooms;
        if (property.features.bathrooms !== undefined) updateData.bathrooms = property.features.bathrooms;
        if (property.features.squareFootage !== undefined) updateData.square_footage = property.features.squareFootage;
        if (property.features.yearBuilt !== undefined) updateData.year_built = property.features.yearBuilt;
        if (property.features.furnished !== undefined) updateData.furnished = property.features.furnished;
        if (property.features.petsAllowed !== undefined) updateData.pets_allowed = property.features.petsAllowed;
        if (property.features.amenities) updateData.amenities = property.features.amenities;
      }
      
      // Pricing updates
      if (property.pricing) {
        if (property.pricing.price !== undefined) updateData.price = property.pricing.price;
        if (property.pricing.currency) updateData.currency = property.pricing.currency;
        if (property.pricing.paymentFrequency) updateData.payment_frequency = property.pricing.paymentFrequency;
        if (property.pricing.securityDeposit !== undefined) updateData.security_deposit = property.pricing.securityDeposit;
        if (property.pricing.negotiable !== undefined) updateData.negotiable = property.pricing.negotiable;
      }
      
      // Availability updates
      if (property.availability) {
        if (property.availability.availableFrom) updateData.available_from = property.availability.availableFrom;
        if (property.availability.minimumStay !== undefined) updateData.minimum_stay = property.availability.minimumStay;
        if (property.availability.maximumStay !== undefined) updateData.maximum_stay = property.availability.maximumStay;
      }
      
      // Rules updates
      if (property.rules) {
        if (property.rules.smoking !== undefined) updateData.smoking_allowed = property.rules.smoking;
        if (property.rules.pets !== undefined) updateData.pets_allowed = property.rules.pets;
        if (property.rules.parties !== undefined) updateData.parties_allowed = property.rules.parties;
        if (property.rules.children !== undefined) updateData.children_allowed = property.rules.children;
        if (property.rules.additionalRules) updateData.additional_rules = property.rules.additionalRules;
      }
      
      updateData.updated_at = new Date().toISOString();
      
      // Update in database
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          property_images (*)
        `)
        .single();
      
      if (error) {
        console.error('Error updating property:', error);
        return {
          success: false,
          message: error.message,
          property: null as any
        };
      }
      
      // Map to frontend type
      const updatedProperty = mapDbPropertyToProperty(data, data.property_images || []);
      
      return {
        property: updatedProperty,
        success: true
      };
    } catch (error) {
      console.error('Property update failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update property',
        property: null as any
      };
    }
  },

  // Delete a property
  deleteProperty: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting property:', error);
        return {
          success: false,
          message: error.message,
          data: undefined
        };
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      console.error('Property deletion failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete property',
        data: undefined
      };
    }
  },
  
  // Upload property image
  uploadPropertyImage: async (data: PropertyImageUploadRequest): Promise<ApiResponse<{ image: string }>> => {
    try {
      // Upload image to Supabase Storage
      const fileExt = data.image.name.split('.').pop();
      const fileName = `${data.propertyId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, data.image);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return {
          success: false,
          message: uploadError.message,
          data: { image: '' }
        };
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);
      
      // Save image record to database
      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: data.propertyId,
          url: publicUrl,
          thumbnail_url: publicUrl,
          caption: data.caption,
          is_primary: data.isPrimary || false
        });
      
      if (dbError) {
        console.error('Error saving image record:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('property-images').remove([fileName]);
        return {
          success: false,
          message: dbError.message,
          data: { image: '' }
        };
      }
      
      return {
        success: true,
        data: { image: publicUrl }
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload image',
        data: { image: '' }
      };
    }
  },
  
  // Update property image
  updatePropertyImage: async (data: PropertyImageUpdateRequest): Promise<ApiResponse<{ image: string }>> => {
    try {
      const { error } = await supabase
        .from('property_images')
        .update({
          caption: data.caption,
          is_primary: data.isPrimary
        })
        .eq('id', data.imageId);
      
      if (error) {
        console.error('Error updating image:', error);
        return {
          success: false,
          message: error.message,
          data: { image: '' }
        };
      }
      
      // Get the updated image URL
      const { data: imageData } = await supabase
        .from('property_images')
        .select('url')
        .eq('id', data.imageId)
        .single();
      
      return {
        success: true,
        data: {
          image: imageData?.url || ''
        }
      };
    } catch (error) {
      console.error('Image update failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update image',
        data: { image: '' }
      };
    }
  },
  
  // Delete property image
  deletePropertyImage: async (imageId: string): Promise<ApiResponse<void>> => {
    try {
      // Get image URL first to delete from storage
      const { data: imageData } = await supabase
        .from('property_images')
        .select('url')
        .eq('id', imageId)
        .single();
      
      // Delete from database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);
      
      if (error) {
        console.error('Error deleting image record:', error);
        return {
          success: false,
          message: error.message,
          data: undefined
        };
      }
      
      // Delete from storage if we have the URL
      if (imageData?.url) {
        const fileName = imageData.url.split('/').slice(-2).join('/');
        await supabase.storage.from('property-images').remove([fileName]);
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      console.error('Image deletion failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete image',
        data: undefined
      };
    }
  },
  
  // Upload property document
  uploadPropertyDocument: async (data: PropertyDocumentUploadRequest): Promise<ApiResponse<{ document: string }>> => {
    try {
      // Upload document to Supabase Storage
      const fileExt = data.document.name.split('.').pop();
      const fileName = `${data.propertyId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(fileName, data.document);
      
      if (uploadError) {
        console.error('Error uploading document:', uploadError);
        return {
          success: false,
          message: uploadError.message,
          data: { document: '' }
        };
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-documents')
        .getPublicUrl(fileName);
      
      return {
        success: true,
        data: { document: publicUrl }
      };
    } catch (error) {
      console.error('Document upload failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload document',
        data: { document: '' }
      };
    }
  },
  
  // Delete property document
  deletePropertyDocument: async (_documentId: string): Promise<ApiResponse<void>> => {
    try {
      // For now, just return success since we don't have a documents table
      // This would need to be implemented when document management is added
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      console.error('Document deletion failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete document',
        data: undefined
      };
    }
  },
  
  // Feature a property (premium)
  featureProperty: async (id: string): Promise<PropertyApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ featured: true })
        .eq('id', id)
        .select(`
          *,
          property_images (*)
        `)
        .single();
      
      if (error) {
        console.error('Error featuring property:', error);
        return {
          success: false,
          message: error.message,
          property: null as any
        };
      }
      
      const property = mapDbPropertyToProperty(data, data.property_images || []);
      
      return {
        property,
        success: true
      };
    } catch (error) {
      console.error('Feature property failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to feature property',
        property: null as any
      };
    }
  },
  
  // Get featured properties
  getFeaturedProperties: async (): Promise<PropertiesApiResponse> => {
    // Use real Supabase service
    return propertyDbService.getFeaturedProperties();
  },
  
  // Get similar properties
  getSimilarProperties: async (id: string, limit: number = 4): Promise<PropertiesApiResponse> => {
    try {
      // Get the property to find similar ones
      const { data: property } = await supabase
        .from('properties')
        .select('property_type, city, price')
        .eq('id', id)
        .single();
      
      if (!property) {
        return {
          properties: [],
          success: true,
          pagination: { total: 0, page: 1, limit, totalPages: 0 }
        };
      }
      
      // Find similar properties (same type, same city, similar price range)
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('property_type', property.property_type)
        .eq('city', property.city)
        .neq('id', id)
        .eq('status', 'active')
        .gte('price', property.price * 0.7)
        .lte('price', property.price * 1.3)
        .limit(limit);
      
      if (error) {
        console.error('Error fetching similar properties:', error);
        return {
          properties: [],
          success: false,
          message: error.message,
          pagination: { total: 0, page: 1, limit, totalPages: 0 }
        };
      }
      
      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );
      
      return {
        properties,
        success: true,
        pagination: {
          total: properties.length,
          page: 1,
          limit,
          totalPages: 1
        }
      };
    } catch (error) {
      console.error('Similar properties fetch failed:', error);
      return {
        properties: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch similar properties',
        pagination: { total: 0, page: 1, limit, totalPages: 0 }
      };
    }
  },
  
  // Get nearby properties
  getNearbyProperties: async (latitude: number, longitude: number, radius: number = 5, limit: number = 10): Promise<PropertiesApiResponse> => {
    try {
      // Use PostGIS for geospatial queries
      // For now, we'll do a simple bounding box query
      const latDelta = radius / 111; // Rough conversion: 1 degree latitude ≈ 111 km
      const lonDelta = radius / (111 * Math.cos(latitude * Math.PI / 180));
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .gte('latitude', latitude - latDelta)
        .lte('latitude', latitude + latDelta)
        .gte('longitude', longitude - lonDelta)
        .lte('longitude', longitude + lonDelta)
        .eq('status', 'active')
        .limit(limit);
      
      if (error) {
        console.error('Error fetching nearby properties:', error);
        return {
          properties: [],
          success: false,
          message: error.message,
          pagination: { total: 0, page: 1, limit, totalPages: 0 }
        };
      }
      
      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );
      
      return {
        properties,
        success: true,
        pagination: {
          total: properties.length,
          page: 1,
          limit,
          totalPages: 1
        }
      };
    } catch (error) {
      console.error('Nearby properties fetch failed:', error);
      return {
        properties: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch nearby properties',
        pagination: { total: 0, page: 1, limit, totalPages: 0 }
      };
    }
  },
};

export default api;