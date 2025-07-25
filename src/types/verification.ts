/**
 * Enum for verification status
 */
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Enum for verification document types
 */
export enum VerificationDocumentType {
  ID_CARD = 'id_card',
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  PROPERTY_DEED = 'property_deed',
  TENANCY_AGREEMENT = 'tenancy_agreement',
  BUSINESS_REGISTRATION = 'business_registration',
  OTHER = 'other'
}

/**
 * Enum for verification level
 */
export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  STANDARD = 'standard',
  ADVANCED = 'advanced',
  PREMIUM = 'premium'
}

/**
 * Interface for verification document
 */
export interface VerificationDocument {
  id: string;
  userId: string;
  type: VerificationDocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  expiresAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  status: VerificationStatus;
  rejectionReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for verification request
 */
export interface VerificationRequest {
  id: string;
  userId: string;
  type: 'identity' | 'address' | 'property' | 'business';
  documents: VerificationDocument[];
  submittedAt: Date;
  processedAt?: Date;
  status: VerificationStatus;
  notes?: string;
  adminNotes?: string;
}

/**
 * Interface for user verification profile
 */
export interface UserVerification {
  userId: string;
  identityVerified: boolean;
  addressVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  documentsVerified: boolean;
  verificationLevel: VerificationLevel;
  trustScore: number;
  verifiedSince?: Date;
  lastVerificationUpdate: Date;
  verificationBadges: string[];
  activeVerificationRequests: VerificationRequest[];
  completedVerificationRequests: VerificationRequest[];
}

/**
 * Interface for rating
 */
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  score: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt?: Date;
  propertyId?: string;
  transactionId?: string;
  isAnonymous: boolean;
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  adminReviewed: boolean;
}

/**
 * Interface for user rating summary
 */
export interface UserRatingSummary {
  userId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  asOwnerRating: number;
  asSeekerRating: number;
  recentRatings: Rating[];
  responseRate: number;
  responseTime: number; // in hours
}

/**
 * Interface for trust indicator
 */
export interface TrustIndicator {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'identity' | 'property' | 'behavior' | 'community';
  score: number; // 0-100
  isVerified: boolean;
  verifiedAt?: Date;
  expiresAt?: Date;
}

/**
 * Interface for trust score calculation
 */
export interface TrustScoreCalculation {
  userId: string;
  baseScore: number;
  identityFactor: number;
  activityFactor: number;
  ratingFactor: number;
  completionFactor: number;
  verificationFactor: number;
  negativeFactors: {
    reportCount: number;
    cancellationRate: number;
    responseDelay: number;
    rejectedVerifications: number;
  };
  totalScore: number;
  calculatedAt: Date;
  previousScore?: number;
  scoreHistory: {
    score: number;
    date: Date;
  }[];
}

/**
 * Interface for verification settings
 */
export interface VerificationSettings {
  requiredDocumentsForBasic: VerificationDocumentType[];
  requiredDocumentsForStandard: VerificationDocumentType[];
  requiredDocumentsForAdvanced: VerificationDocumentType[];
  requiredDocumentsForPremium: VerificationDocumentType[];
  documentExpiryDays: Record<VerificationDocumentType, number>;
  minimumTrustScoreForVerification: number;
  trustScoreThresholds: {
    basic: number;
    standard: number;
    advanced: number;
    premium: number;
  };
  autoVerifyEmail: boolean;
  autoVerifyPhone: boolean;
  requireAddressVerification: boolean;
  requireIdentityVerification: boolean;
}

/**
 * Interface for report
 */
export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedPropertyId?: string;
  reportedMessageId?: string;
  reportedRatingId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Interface for verification badge
 */
export interface VerificationBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  criteria: {
    requiredVerificationLevel: VerificationLevel;
    requiredTrustScore: number;
    requiredDocuments: VerificationDocumentType[];
    minimumRating: number;
    minimumListings?: number;
    minimumTransactions?: number;
    otherRequirements?: string[];
  };
  displayOrder: number;
  isActive: boolean;
}

/**
 * Interface for creating a verification request
 */
export interface CreateVerificationRequestDto {
  userId: string;
  type: 'identity' | 'address' | 'property' | 'business';
  documents: {
    type: VerificationDocumentType;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[];
  notes?: string;
}

/**
 * Interface for creating a rating
 */
export interface CreateRatingDto {
  fromUserId: string;
  toUserId: string;
  score: number;
  comment?: string;
  propertyId?: string;
  transactionId?: string;
  isAnonymous: boolean;
}