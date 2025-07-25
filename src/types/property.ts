import { User } from './auth';

// Property Types
export enum PropertyType {
  HOUSE = 'house',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  APARTMENT = 'apartment',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  OTHER = 'other'
}

// Listing Types
export enum ListingType {
  RENT = 'rent',
  SALE = 'sale'
}

// Property Status
export enum PropertyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  RENTED = 'rented',
  SOLD = 'sold',
  INACTIVE = 'inactive',
  DRAFT = 'draft'
}

// Verification Status
export enum PropertyVerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// Property Location Interface
export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number]; // [longitude, latitude] for map integration
  neighborhood?: string;
  landmark?: string;
  distanceToLandmarks?: {
    name: string;
    distance: number; // in kilometers
    type: 'school' | 'hospital' | 'shopping' | 'transportation' | 'other';
  }[];
}

// Property Features Interface
export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number; // Alias for squareFootage
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  floors?: number;
  parking?: {
    available: boolean;
    type?: 'garage' | 'carport' | 'street' | 'none';
    spaces?: number;
  };
  furnished?: boolean;
  petsAllowed?: boolean;
  amenities: string[];
  utilities?: {
    water: boolean;
    electricity: boolean;
    internet: boolean;
    heating: boolean;
    cooling: boolean;
    gas: boolean;
    included: boolean; // Whether utilities are included in rent
  };
  outdoorFeatures?: string[];
  securityFeatures?: string[];
}

// Property Image Interface
export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  uploadedAt: Date;
}

// Property Document Interface
export interface PropertyDocument {
  id: string;
  title: string;
  url: string;
  type: 'deed' | 'certificate' | 'floorplan' | 'other';
  uploadedAt: Date;
}

// Property Pricing Interface
export interface PropertyPricing {
  price: number;
  currency: string;
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  securityDeposit?: number;
  additionalFees?: {
    name: string;
    amount: number;
    frequency?: 'one-time' | 'monthly' | 'annually';
  }[];
  negotiable: boolean;
  pricePerSquareFoot?: number;
}

// Property Availability Interface
export interface PropertyAvailability {
  availableFrom: Date;
  minimumStay?: number; // in months
  maximumStay?: number; // in months
  leaseTerms?: string[];
  showingAvailability?: {
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  };
}

// Property Rules Interface
export interface PropertyRules {
  smoking: boolean;
  pets: boolean;
  parties: boolean;
  children: boolean;
  additionalRules?: string[];
}

// Property Analytics Interface
export interface PropertyAnalytics {
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  lastViewed?: Date;
  viewHistory?: {
    date: Date;
    count: number;
  }[];
  averageTimeOnPage?: number; // in seconds
}

// Property Review Interface
export interface PropertyReview {
  id: string;
  userId: string;
  user?: User;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  helpful?: number; // Number of users who found this review helpful
  response?: {
    comment: string;
    createdAt: Date;
  };
}

// Complete Property Interface
export interface Property {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  owner?: User;
  type: PropertyType; // Alias for propertyType for backward compatibility
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  verificationStatus: PropertyVerificationStatus;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: PropertyImage[];
  documents?: PropertyDocument[];
  pricing: PropertyPricing;
  availability: PropertyAvailability;
  rules?: PropertyRules;
  analytics?: PropertyAnalytics;
  reviews?: PropertyReview[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Property Search Filters
export interface PropertySearchFilters {
  query?: string;
  propertyType?: PropertyType[];
  listingType?: ListingType;
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  amenities?: string[];
  furnished?: boolean;
  petsAllowed?: boolean;
  availableFrom?: Date;
  radius?: number;
  centerLat?: number;
  centerLng?: number;
  featured?: boolean;
  verifiedOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'date_newest' | 'date_oldest' | 'relevance';
  page?: number;
  limit?: number;
}

// Property Search Results
export interface PropertySearchResults {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: PropertySearchFilters;
}

// Property Creation Request
export interface PropertyCreateRequest {
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  location: Omit<PropertyLocation, 'distanceToLandmarks'>;
  features: Omit<PropertyFeatures, 'outdoorFeatures' | 'securityFeatures'> & {
    amenities: string[];
  };
  pricing: Omit<PropertyPricing, 'pricePerSquareFoot'>;
  availability: {
    availableFrom: Date;
    minimumStay?: number;
    maximumStay?: number;
  };
  rules?: PropertyRules;
}

// Property Update Request
export interface PropertyUpdateRequest {
  title?: string;
  description?: string;
  propertyType?: PropertyType;
  listingType?: ListingType;
  status?: PropertyStatus;
  location?: Partial<PropertyLocation>;
  features?: Partial<PropertyFeatures>;
  pricing?: Partial<PropertyPricing>;
  availability?: Partial<PropertyAvailability>;
  rules?: Partial<PropertyRules>;
}

// Property Image Upload Request
export interface PropertyImageUploadRequest {
  propertyId: string;
  image: File;
  isPrimary?: boolean;
  caption?: string;
}

// Property Image Update Request
export interface PropertyImageUpdateRequest {
  imageId: string;
  isPrimary?: boolean;
  caption?: string;
  order?: number;
}

// Property Document Upload Request
export interface PropertyDocumentUploadRequest {
  propertyId: string;
  document: File;
  title: string;
  type: PropertyDocument['type'];
}

// Property API Responses
export interface PropertyApiResponse {
  property: Property;
  success: boolean;
  message?: string;
}

export interface PropertiesApiResponse {
  properties: Property[];
  success: boolean;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}