// Core types for the DirectHome real estate platform

// Re-export all authentication types
export * from './auth';

// Re-export all property types
export * from './property';

// Legacy Property interface - will be deprecated in favor of the more detailed Property interface in property.ts
export interface LegacyProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: 'house' | 'condo' | 'townhouse' | 'apartment';
  listingType: 'sale' | 'rent';
  images: string[];
  amenities: string[];
  yearBuilt?: number;
  lotSize?: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  featured?: boolean;
  status: 'active' | 'pending' | 'rented' | 'inactive';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  viewCount?: number;
  favoriteCount?: number;
}

// Note: The User interface is now imported from './auth.ts'
// Any code using the legacy LegacyUser interface should be updated to use User from auth.ts

// Legacy SearchFilters interface - will be deprecated in favor of PropertySearchFilters in property.ts
export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: LegacyProperty['propertyType'];
  listingType?: LegacyProperty['listingType'];
  city?: string;
  state?: string;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  amenities?: string[];
  featured?: boolean;
  verifiedOnly?: boolean;
  radius?: number;
  centerLat?: number;
  centerLng?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}