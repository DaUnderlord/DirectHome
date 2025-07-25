/**
 * Premium listing and monetization types
 */

export enum PromotionType {
  FEATURED = 'featured',
  PREMIUM = 'premium',
  SPOTLIGHT = 'spotlight',
  TOP_LISTING = 'top_listing'
}

export enum PromotionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

/**
 * Promotion package interface
 */
export interface PromotionPackage {
  id: string;
  name: string;
  type: PromotionType;
  description: string;
  features: string[];
  price: number;
  currency: string;
  duration: number; // in days
  maxListings?: number;
  priority: number; // higher number = higher priority
  isActive: boolean;
  displayOrder: number;
  benefits: {
    featuredPlacement: boolean;
    highlightedCard: boolean;
    topSearchResults: boolean;
    socialMediaPromotion: boolean;
    extendedVisibility: boolean;
    prioritySupport: boolean;
    detailedAnalytics: boolean;
    customBadge: boolean;
  };
}

/**
 * Property promotion interface
 */
export interface PropertyPromotion {
  id: string;
  propertyId: string;
  packageId: string;
  userId: string;
  type: PromotionType;
  status: PromotionStatus;
  startDate: Date;
  endDate: Date;
  price: number;
  currency: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  pausedAt?: Date;
  pausedReason?: string;
  cancelledAt?: Date;
  cancelledReason?: string;
  autoRenew: boolean;
  renewalAttempts: number;
  metadata?: Record<string, any>;
}

/**
 * Listing analytics interface
 */
export interface ListingAnalytics {
  propertyId: string;
  promotionId?: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    views: number;
    uniqueViews: number;
    clicks: number;
    inquiries: number;
    favorites: number;
    shares: number;
    phoneClicks: number;
    emailClicks: number;
    whatsappClicks: number;
    mapViews: number;
    photoViews: number;
  };
  performance: {
    viewsGrowth: number;
    inquiriesGrowth: number;
    conversionRate: number;
    avgViewDuration: number;
    bounceRate: number;
    engagementScore: number;
  };
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
    sources: Record<string, number>;
  };
  comparison: {
    beforePromotion?: Partial<ListingAnalytics['metrics']>;
    afterPromotion?: Partial<ListingAnalytics['metrics']>;
    similarListings?: Partial<ListingAnalytics['metrics']>;
  };
}

/**
 * Promotion campaign interface
 */
export interface PromotionCampaign {
  id: string;
  name: string;
  description: string;
  userId: string;
  propertyIds: string[];
  packageId: string;
  budget: number;
  spent: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: PromotionStatus;
  targetAudience: {
    locations: string[];
    ageGroups: string[];
    interests: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  performance: {
    impressions: number;
    clicks: number;
    inquiries: number;
    cost: number;
    ctr: number; // Click-through rate
    cpi: number; // Cost per inquiry
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Featured listing configuration
 */
export interface FeaturedListingConfig {
  maxFeaturedListings: number;
  featuredDuration: number; // in days
  featuredPrice: number;
  currency: string;
  autoRotation: boolean;
  rotationInterval: number; // in hours
  displayLocations: {
    homepage: boolean;
    searchResults: boolean;
    categoryPages: boolean;
    relatedListings: boolean;
  };
  styling: {
    badgeColor: string;
    badgeText: string;
    highlightColor: string;
    borderStyle: string;
  };
}

/**
 * Promotion payment interface
 */
export interface PromotionPayment {
  id: string;
  promotionId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentProvider: string;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Promotion statistics interface
 */
export interface PromotionStatistics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalPromotions: number;
  activePromotions: number;
  totalSpent: number;
  currency: string;
  averageROI: number;
  topPerformingPromotion: {
    promotionId: string;
    propertyTitle: string;
    views: number;
    inquiries: number;
    roi: number;
  };
  promotionBreakdown: {
    type: PromotionType;
    count: number;
    spent: number;
    performance: number;
  }[];
  monthlyTrends: {
    month: string;
    promotions: number;
    spent: number;
    inquiries: number;
  }[];
}

/**
 * API request/response interfaces
 */
export interface CreatePromotionDto {
  propertyId: string;
  packageId: string;
  duration?: number;
  autoRenew?: boolean;
  paymentMethodId?: string;
}

export interface UpdatePromotionDto {
  autoRenew?: boolean;
  pausedReason?: string;
  cancelledReason?: string;
}

export interface PromotionListQuery {
  status?: PromotionStatus;
  type?: PromotionType;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AnalyticsQuery {
  propertyId?: string;
  promotionId?: string;
  startDate: Date;
  endDate: Date;
  granularity?: 'day' | 'week' | 'month';
  metrics?: string[];
}

/**
 * Promotion recommendation interface
 */
export interface PromotionRecommendation {
  propertyId: string;
  recommendedPackage: PromotionPackage;
  reason: string;
  expectedBenefits: {
    viewsIncrease: number;
    inquiriesIncrease: number;
    roi: number;
  };
  confidence: number; // 0-100
  basedOn: {
    propertyType: boolean;
    location: boolean;
    priceRange: boolean;
    seasonality: boolean;
    competition: boolean;
  };
}

/**
 * Bulk promotion interface
 */
export interface BulkPromotionRequest {
  propertyIds: string[];
  packageId: string;
  duration?: number;
  autoRenew?: boolean;
  paymentMethodId?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

export interface BulkPromotionResponse {
  successful: string[]; // promotion IDs
  failed: {
    propertyId: string;
    reason: string;
  }[];
  totalCost: number;
  discount: number;
  finalCost: number;
  currency: string;
}