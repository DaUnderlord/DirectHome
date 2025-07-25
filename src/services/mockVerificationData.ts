import {
  UserVerification,
  VerificationLevel,
  VerificationStatus,
  VerificationRequest,
  VerificationDocument,
  VerificationDocumentType,
  Rating,
  TrustIndicator,
  VerificationBadge
} from '../types/verification';

// Mock user verifications
export const mockUserVerifications: Record<string, UserVerification> = {
  'user-1': {
    userId: 'user-1',
    identityVerified: true,
    addressVerified: true,
    phoneVerified: true,
    emailVerified: true,
    documentsVerified: true,
    verificationLevel: VerificationLevel.STANDARD,
    trustScore: 85,
    verifiedSince: new Date('2024-01-15'),
    lastVerificationUpdate: new Date('2024-01-15'),
    verificationBadges: ['verified-identity', 'verified-address', 'trusted-member'],
    activeVerificationRequests: [],
    completedVerificationRequests: []
  },
  'user-2': {
    userId: 'user-2',
    identityVerified: false,
    addressVerified: false,
    phoneVerified: true,
    emailVerified: true,
    documentsVerified: false,
    verificationLevel: VerificationLevel.BASIC,
    trustScore: 45,
    lastVerificationUpdate: new Date('2024-01-10'),
    verificationBadges: ['email-verified'],
    activeVerificationRequests: [],
    completedVerificationRequests: []
  }
};

// Mock verification requests
export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'req-1',
    userId: 'user-2',
    type: 'identity',
    documents: [],
    submittedAt: new Date('2024-01-20'),
    status: VerificationStatus.PENDING,
    notes: 'Identity verification request'
  }
];

// Mock verification documents
export const mockVerificationDocuments: VerificationDocument[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    type: VerificationDocumentType.ID_CARD,
    fileUrl: '/uploads/id-card-1.jpg',
    fileName: 'national-id.jpg',
    fileSize: 2048000,
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-16'),
    verifiedBy: 'admin-1',
    status: VerificationStatus.VERIFIED
  }
];

// Mock ratings
export const mockRatings: Rating[] = [
  {
    id: 'rating-1',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    score: 5,
    comment: 'Great landlord, very responsive and professional',
    createdAt: new Date('2024-01-18'),
    propertyId: 'prop-1',
    isAnonymous: false,
    isVerified: true,
    helpfulCount: 3,
    reportCount: 0,
    adminReviewed: false
  },
  {
    id: 'rating-2',
    fromUserId: 'user-3',
    toUserId: 'user-1',
    score: 4,
    comment: 'Good tenant, paid rent on time',
    createdAt: new Date('2024-01-10'),
    isAnonymous: false,
    isVerified: true,
    helpfulCount: 1,
    reportCount: 0,
    adminReviewed: false
  }
];

// Mock trust indicators
export const mockTrustIndicators: Record<string, TrustIndicator[]> = {
  'user-1': [
    {
      id: 'trust-1',
      name: 'Identity Verified',
      description: 'Government-issued ID verified',
      iconName: 'shield-check',
      category: 'identity',
      score: 100,
      isVerified: true,
      verifiedAt: new Date('2024-01-15')
    },
    {
      id: 'trust-2',
      name: 'Address Verified',
      description: 'Residential address confirmed',
      iconName: 'map-pin',
      category: 'identity',
      score: 100,
      isVerified: true,
      verifiedAt: new Date('2024-01-15')
    },
    {
      id: 'trust-3',
      name: 'High Response Rate',
      description: 'Responds to messages within 2 hours',
      iconName: 'clock',
      category: 'behavior',
      score: 90,
      isVerified: true,
      verifiedAt: new Date('2024-01-20')
    }
  ],
  'user-2': [
    {
      id: 'trust-4',
      name: 'Email Verified',
      description: 'Email address confirmed',
      iconName: 'mail',
      category: 'identity',
      score: 50,
      isVerified: true,
      verifiedAt: new Date('2024-01-10')
    }
  ]
};

// Mock verification badges
export const mockVerificationBadges: VerificationBadge[] = [
  {
    id: 'badge-1',
    name: 'Verified Identity',
    description: 'Government-issued ID verified',
    iconUrl: '/icons/verified-identity.svg',
    color: '#10B981',
    criteria: {
      requiredVerificationLevel: VerificationLevel.BASIC,
      requiredTrustScore: 30,
      requiredDocuments: [VerificationDocumentType.ID_CARD],
      minimumRating: 0
    },
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'badge-2',
    name: 'Trusted Member',
    description: 'High trust score and positive reviews',
    iconUrl: '/icons/trusted-member.svg',
    color: '#3B82F6',
    criteria: {
      requiredVerificationLevel: VerificationLevel.STANDARD,
      requiredTrustScore: 80,
      requiredDocuments: [VerificationDocumentType.ID_CARD, VerificationDocumentType.UTILITY_BILL],
      minimumRating: 4.0,
      minimumTransactions: 5
    },
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'badge-3',
    name: 'Premium Verified',
    description: 'Highest level of verification',
    iconUrl: '/icons/premium-verified.svg',
    color: '#F59E0B',
    criteria: {
      requiredVerificationLevel: VerificationLevel.PREMIUM,
      requiredTrustScore: 90,
      requiredDocuments: [
        VerificationDocumentType.ID_CARD,
        VerificationDocumentType.PASSPORT,
        VerificationDocumentType.UTILITY_BILL,
        VerificationDocumentType.BANK_STATEMENT
      ],
      minimumRating: 4.5,
      minimumTransactions: 10
    },
    displayOrder: 3,
    isActive: true
  }
];