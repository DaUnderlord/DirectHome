import { supabase } from '../lib/supabase';
import { Property, PropertyType, ListingType, PropertyStatus, PropertyVerificationStatus } from '../types/property';

// Real house images from Unsplash for properties without images
const defaultHouseImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
];

interface SearchFilters {
  search?: string;
  location?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  verified?: boolean;
  petsAllowed?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// Map database property to frontend Property type
const mapDbPropertyToProperty = (dbProperty: any, images: any[] = []): Property => {
  const propertyImages = images.length > 0 
    ? images.map((img, index) => ({
        id: img.id,
        url: img.url,
        thumbnailUrl: img.thumbnail_url || img.url,
        isPrimary: img.is_primary || index === 0,
        order: img.display_order || index,
        uploadedAt: new Date(img.created_at),
      }))
    : [{
        id: `default-${dbProperty.id}`,
        url: defaultHouseImages[Math.floor(Math.random() * defaultHouseImages.length)],
        thumbnailUrl: defaultHouseImages[Math.floor(Math.random() * defaultHouseImages.length)],
        isPrimary: true,
        order: 0,
        uploadedAt: new Date(),
      }];

  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    ownerId: dbProperty.owner_id,
    propertyType: dbProperty.property_type as PropertyType,
    listingType: dbProperty.listing_type as ListingType,
    status: dbProperty.status as PropertyStatus,
    verificationStatus: dbProperty.verification_status as PropertyVerificationStatus,
    location: {
      address: dbProperty.address,
      city: dbProperty.city,
      state: dbProperty.state,
      zipCode: dbProperty.zip_code || '',
      country: dbProperty.country || 'Nigeria',
      latitude: dbProperty.latitude,
      longitude: dbProperty.longitude,
    },
    features: {
      bedrooms: dbProperty.bedrooms,
      bathrooms: dbProperty.bathrooms,
      squareFootage: dbProperty.square_footage,
      yearBuilt: dbProperty.year_built,
      furnished: dbProperty.furnished,
      petsAllowed: dbProperty.pets_allowed,
      amenities: dbProperty.amenities || [],
    },
    images: propertyImages,
    pricing: {
      price: dbProperty.price,
      currency: dbProperty.currency || 'NGN',
      paymentFrequency: dbProperty.payment_frequency,
      securityDeposit: dbProperty.security_deposit,
      negotiable: dbProperty.negotiable,
    },
    availability: {
      availableFrom: dbProperty.available_from ? new Date(dbProperty.available_from) : new Date(),
      minimumStay: dbProperty.minimum_stay,
      maximumStay: dbProperty.maximum_stay,
    },
    rules: {
      smoking: dbProperty.smoking_allowed,
      pets: dbProperty.pets_allowed,
      parties: dbProperty.parties_allowed,
      children: dbProperty.children_allowed,
      additionalRules: dbProperty.additional_rules || [],
    },
    analytics: {
      viewCount: dbProperty.view_count || 0,
      favoriteCount: dbProperty.favorite_count || 0,
      inquiryCount: dbProperty.inquiry_count || 0,
    },
    featured: dbProperty.featured,
    createdAt: new Date(dbProperty.created_at),
    updatedAt: new Date(dbProperty.updated_at),
  };
};

export const propertyDbService = {
  /**
   * Search properties from Supabase database
   */
  searchProperties: async (filters: SearchFilters = {}) => {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'active');

      // Apply search filter (title, description, address)
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }

      // Apply location filter (city or state)
      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
      }

      // Apply property type filter
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType as any);
      }

      // Apply listing type filter
      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType as any);
      }

      // Apply price filters
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply bedroom filter
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }

      // Apply bathroom filter
      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }

      // Apply furnished filter
      if (filters.furnished) {
        query = query.eq('furnished', true);
      }

      // Apply verified filter
      if (filters.verified) {
        query = query.eq('verification_status', 'verified');
      }

      // Apply pets allowed filter
      if (filters.petsAllowed) {
        query = query.eq('pets_allowed', true);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );

      return {
        properties,
        success: true,
        pagination: {
          total: count || properties.length,
          page,
          limit,
          totalPages: Math.ceil((count || properties.length) / limit),
        },
      };
    } catch (error) {
      console.error('Property search failed:', error);
      // Return empty results on error
      return {
        properties: [],
        success: false,
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      };
    }
  },

  /**
   * Get featured properties from database
   */
  getFeaturedProperties: async (limit: number = 6) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured properties:', error);
        throw error;
      }

      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );

      return {
        properties,
        success: true,
      };
    } catch (error) {
      console.error('Featured properties fetch failed:', error);
      return {
        properties: [],
        success: false,
      };
    }
  },

  /**
   * Get a single property by ID
   */
  getProperty: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      const property = mapDbPropertyToProperty(data, data.property_images || []);

      return {
        property,
        success: true,
      };
    } catch (error) {
      console.error('Property fetch failed:', error);
      return {
        property: null,
        success: false,
      };
    }
  },

  /**
   * Get property count for stats
   */
  getPropertyCount: async () => {
    try {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching property count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Property count fetch failed:', error);
      return 0;
    }
  },
};

export default propertyDbService;
