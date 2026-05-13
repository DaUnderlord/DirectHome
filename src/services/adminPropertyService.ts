import { supabase } from '../lib/supabase';
import { Property, PropertyStatus, PropertyVerificationStatus } from '../types/property';
import { mapDbPropertyToProperty } from './propertyService';

export interface AdminPropertyCreateRequest {
  ownerId: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFootage?: number;
    yearBuilt?: number;
    furnished: boolean;
    petsAllowed: boolean;
    amenities: string[];
  };
  pricing: {
    price: number;
    currency: string;
    paymentFrequency: string;
    securityDeposit?: number;
    negotiable: boolean;
  };
  availability: {
    availableFrom: string;
    minimumStay?: number;
    maximumStay?: number;
  };
  rules?: {
    smoking: boolean;
    parties: boolean;
    children: boolean;
    additionalRules: string[];
  };
  images?: string[];
  status?: PropertyStatus;
  verificationStatus?: PropertyVerificationStatus;
}

export interface BulkPropertyImportResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  errors: Array<{ row: number; error: string; data?: any }>;
  createdProperties: Property[];
}

export interface PropertyApprovalRequest {
  propertyId: string;
  status: PropertyStatus;
  verificationStatus: PropertyVerificationStatus;
  adminNotes?: string;
  rejectionReason?: string;
}

class AdminPropertyService {
  /**
   * Create a property as admin (can set owner, status, verification)
   */
  async createProperty(data: AdminPropertyCreateRequest): Promise<{ success: boolean; property?: Property; error?: string }> {
    try {
      const { data: insertData, error } = await supabase
        .from('properties')
        .insert({
          owner_id: data.ownerId,
          title: data.title,
          description: data.description,
          property_type: data.propertyType,
          listing_type: data.listingType,
          status: data.status || 'active',
          verification_status: data.verificationStatus || 'verified',
          // Location
          address: data.location.address,
          city: data.location.city,
          state: data.location.state,
          zip_code: data.location.zipCode,
          country: data.location.country,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          // Features
          bedrooms: data.features.bedrooms,
          bathrooms: data.features.bathrooms,
          square_footage: data.features.squareFootage,
          year_built: data.features.yearBuilt,
          furnished: data.features.furnished,
          pets_allowed: data.features.petsAllowed,
          amenities: data.features.amenities,
          // Pricing
          price: data.pricing.price,
          currency: data.pricing.currency,
          payment_frequency: data.pricing.paymentFrequency,
          security_deposit: data.pricing.securityDeposit,
          negotiable: data.pricing.negotiable,
          // Availability
          available_from: data.availability.availableFrom,
          minimum_stay: data.availability.minimumStay,
          maximum_stay: data.availability.maximumStay,
          // Rules
          smoking_allowed: data.rules?.smoking || false,
          parties_allowed: data.rules?.parties || false,
          children_allowed: data.rules?.children !== false,
          additional_rules: data.rules?.additionalRules || []
        })
        .select()
        .single();

      if (error) throw error;

      // Handle images if provided
      if (data.images && data.images.length > 0) {
        const imageInserts = data.images.map((url, index) => ({
          property_id: insertData.id,
          url: url,
          thumbnail_url: url,
          is_primary: index === 0
        }));

        await supabase.from('property_images').insert(imageInserts);
      }

      const property = mapDbPropertyToProperty(insertData, []);
      return { success: true, property };
    } catch (error) {
      console.error('Admin property creation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create property' 
      };
    }
  }

  /**
   * Approve or reject a property
   */
  async updatePropertyStatus(request: PropertyApprovalRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        status: request.status,
        verification_status: request.verificationStatus,
        updated_at: new Date().toISOString()
      };

      if (request.adminNotes) {
        updateData.admin_notes = request.adminNotes;
      }

      if (request.rejectionReason) {
        updateData.rejection_reason = request.rejectionReason;
      }

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', request.propertyId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Property status update failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update property status' 
      };
    }
  }

  /**
   * Get pending properties for approval
   */
  async getPendingProperties(): Promise<{ success: boolean; properties?: Property[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );

      return { success: true, properties };
    } catch (error) {
      console.error('Failed to fetch pending properties:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pending properties' 
      };
    }
  }

  /**
   * Bulk import properties from CSV data
   */
  async bulkImportProperties(csvData: any[]): Promise<BulkPropertyImportResult> {
    const result: BulkPropertyImportResult = {
      success: false,
      totalProcessed: csvData.length,
      successCount: 0,
      failureCount: 0,
      errors: [],
      createdProperties: []
    };

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      try {
        // Validate required fields
        if (!row.title || !row.ownerId || !row.propertyType) {
          throw new Error('Missing required fields: title, ownerId, or propertyType');
        }

        // Parse amenities if it's a string
        let amenities: string[] = [];
        if (row.amenities) {
          amenities = typeof row.amenities === 'string' 
            ? row.amenities.split(',').map((a: string) => a.trim())
            : row.amenities;
        }

        // Parse additional rules if it's a string
        let additionalRules: string[] = [];
        if (row.additionalRules) {
          additionalRules = typeof row.additionalRules === 'string'
            ? row.additionalRules.split(',').map((r: string) => r.trim())
            : row.additionalRules;
        }

        // Parse images if it's a string
        let images: string[] = [];
        if (row.images) {
          images = typeof row.images === 'string'
            ? row.images.split(',').map((img: string) => img.trim())
            : row.images;
        }

        const propertyData: AdminPropertyCreateRequest = {
          ownerId: row.ownerId,
          title: row.title,
          description: row.description || '',
          propertyType: row.propertyType,
          listingType: row.listingType || 'rent',
          location: {
            address: row.address || '',
            city: row.city || '',
            state: row.state || '',
            zipCode: row.zipCode,
            country: row.country || 'Nigeria',
            latitude: row.latitude ? parseFloat(row.latitude) : undefined,
            longitude: row.longitude ? parseFloat(row.longitude) : undefined
          },
          features: {
            bedrooms: parseInt(row.bedrooms) || 0,
            bathrooms: parseInt(row.bathrooms) || 0,
            squareFootage: row.squareFootage ? parseInt(row.squareFootage) : undefined,
            yearBuilt: row.yearBuilt ? parseInt(row.yearBuilt) : undefined,
            furnished: row.furnished === 'true' || row.furnished === true,
            petsAllowed: row.petsAllowed === 'true' || row.petsAllowed === true,
            amenities: amenities
          },
          pricing: {
            price: parseFloat(row.price) || 0,
            currency: row.currency || 'NGN',
            paymentFrequency: row.paymentFrequency || 'monthly',
            securityDeposit: row.securityDeposit ? parseFloat(row.securityDeposit) : undefined,
            negotiable: row.negotiable === 'true' || row.negotiable === true
          },
          availability: {
            availableFrom: row.availableFrom || new Date().toISOString(),
            minimumStay: row.minimumStay ? parseInt(row.minimumStay) : undefined,
            maximumStay: row.maximumStay ? parseInt(row.maximumStay) : undefined
          },
          rules: {
            smoking: row.smokingAllowed === 'true' || row.smokingAllowed === true,
            parties: row.partiesAllowed === 'true' || row.partiesAllowed === true,
            children: row.childrenAllowed !== 'false' && row.childrenAllowed !== false,
            additionalRules: additionalRules
          },
          images: images,
          status: (row.status as PropertyStatus) || 'active',
          verificationStatus: (row.verificationStatus as PropertyVerificationStatus) || 'verified'
        };

        const createResult = await this.createProperty(propertyData);

        if (createResult.success && createResult.property) {
          result.successCount++;
          result.createdProperties.push(createResult.property);
        } else {
          result.failureCount++;
          result.errors.push({
            row: rowNumber,
            error: createResult.error || 'Unknown error',
            data: row
          });
        }
      } catch (error) {
        result.failureCount++;
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: row
        });
      }
    }

    result.success = result.successCount > 0;
    return result;
  }

  /**
   * Get all properties with admin filters
   */
  async getAllProperties(filters?: {
    status?: PropertyStatus;
    verificationStatus?: PropertyVerificationStatus;
    ownerId?: string;
    city?: string;
    state?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; properties?: Property[]; total?: number; error?: string }> {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `, { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }

      if (filters?.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }

      query = query.order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const properties = (data || []).map((item: any) => 
        mapDbPropertyToProperty(item, item.property_images || [])
      );

      return { success: true, properties, total: count || 0 };
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch properties' 
      };
    }
  }

  /**
   * Delete a property (admin only)
   */
  async deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete property images first
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);

      // Delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Property deletion failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete property' 
      };
    }
  }
}

export const adminPropertyService = new AdminPropertyService();
export default adminPropertyService;
