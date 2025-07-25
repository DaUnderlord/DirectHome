import { create } from 'zustand';
import {
  TrustIndicator,
  UserVerification,
  Rating,
  UserRatingSummary,
  VerificationLevel,
  VerificationStatus
} from '../types/verification';

// Mock data
const mockTrustIndicators: Record<string, TrustIndicator[]> = {
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
    }
  ]
};

const mockUserVerifications: Record<string, UserVerification> = {
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
  }
};

const mockRatings: Rating[] = [
  {
    id: 'rating-1',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    score: 5,
    comment: 'Great experience!',
    createdAt: new Date('2024-01-20'),
    isAnonymous: false,
    isVerified: true,
    helpfulCount: 2,
    reportCount: 0,
    adminReviewed: false
  }
];

// Define the store state interface
interface VerificationState {
  trustIndicators: Record<string, TrustIndicator[]>;
  userVerifications: Record<string, UserVerification>;
  ratings: Rating[];
  userRatingSummaries: Record<string, UserRatingSummary>;
  pendingVerifications: Record<string, any[]>;
  isLoading: boolean;
  error: string | null;

  // Fetch actions
  fetchTrustIndicators: (userId: string) => Promise<TrustIndicator[]>;
  fetchUserVerification: (userId: string) => Promise<UserVerification | null>;
  fetchUserRatings: (userId: string) => Promise<Rating[]>;
  fetchUserRatingSummary: (userId: string) => Promise<UserRatingSummary | null>;
  calculateTrustScore: (userId: string) => Promise<number>;

  // Verification request actions
  submitVerificationRequest: (userId: string, documents: Array<{
    type: string;
    file: File | null;
    url: string;
  }>, additionalInfo?: string) => Promise<any>;

  checkVerificationStatus: (userId: string) => Promise<VerificationStatus>;
  cancelVerificationRequest: (userId: string, requestId: string) => Promise<boolean>;

  // Selectors
  getUserVerificationStatus: (userId: string) => VerificationStatus | null;
  canUserListProperty: (userId: string) => boolean;
  getPendingVerifications: (userId: string) => any[];
}

// Mock pending verifications
const mockPendingVerifications: Record<string, any[]> = {};

// Create the store without middleware
export const useVerificationStore = create<VerificationState>((set, get) => ({
  trustIndicators: mockTrustIndicators,
  userVerifications: mockUserVerifications,
  ratings: mockRatings,
  userRatingSummaries: {},
  pendingVerifications: mockPendingVerifications,
  isLoading: false,
  error: null,

  fetchTrustIndicators: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const indicators = mockTrustIndicators[userId] || [];
      set(state => ({
        trustIndicators: {
          ...state.trustIndicators,
          [userId]: indicators
        },
        isLoading: false
      }));
      return indicators;
    } catch (error) {
      set({ error: 'Failed to fetch trust indicators', isLoading: false });
      return [];
    }
  },

  fetchUserVerification: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const verification = mockUserVerifications[userId] || null;
      set(state => ({
        userVerifications: {
          ...state.userVerifications,
          [userId]: verification
        },
        isLoading: false
      }));
      return verification;
    } catch (error) {
      set({ error: 'Failed to fetch user verification', isLoading: false });
      return null;
    }
  },

  fetchUserRatings: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const userRatings = mockRatings.filter(r => r.toUserId === userId);
      set({ isLoading: false });
      return userRatings;
    } catch (error) {
      set({ error: 'Failed to fetch user ratings', isLoading: false });
      return [];
    }
  },

  fetchUserRatingSummary: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const userRatings = mockRatings.filter(r => r.toUserId === userId);

      if (userRatings.length === 0) {
        set({ isLoading: false });
        return null;
      }

      const totalRatings = userRatings.length;
      const averageRating = userRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings;

      const summary: UserRatingSummary = {
        userId,
        averageRating,
        totalRatings,
        ratingDistribution: {
          '1': userRatings.filter(r => r.score === 1).length,
          '2': userRatings.filter(r => r.score === 2).length,
          '3': userRatings.filter(r => r.score === 3).length,
          '4': userRatings.filter(r => r.score === 4).length,
          '5': userRatings.filter(r => r.score === 5).length,
        },
        asOwnerRating: averageRating,
        asSeekerRating: averageRating,
        recentRatings: userRatings.slice(0, 3),
        responseRate: 95,
        responseTime: 2
      };

      set(state => ({
        userRatingSummaries: {
          ...state.userRatingSummaries,
          [userId]: summary
        },
        isLoading: false
      }));

      return summary;
    } catch (error) {
      set({ error: 'Failed to fetch user rating summary', isLoading: false });
      return null;
    }
  },

  calculateTrustScore: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const verification = mockUserVerifications[userId];
      const score = verification?.trustScore || 50;
      set({ isLoading: false });
      return score;
    } catch (error) {
      set({ error: 'Failed to calculate trust score', isLoading: false });
      return 0;
    }
  },

  // Verification request actions
  submitVerificationRequest: async (userId: string, documents, additionalInfo) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new verification request
      const newRequest = {
        id: `req-${Date.now()}`,
        userId,
        documents: documents.map(doc => ({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: doc.type,
          fileUrl: doc.url,
          fileName: doc.file?.name || 'document.pdf',
          fileSize: doc.file?.size || 0,
          mimeType: doc.file?.type || 'application/pdf',
          uploadedAt: new Date(),
          status: 'pending'
        })),
        additionalInfo,
        submittedAt: new Date(),
        status: 'pending',
        notes: additionalInfo
      };

      // Update pending verifications
      set(state => {
        const userPendingVerifications = state.pendingVerifications[userId] || [];

        return {
          pendingVerifications: {
            ...state.pendingVerifications,
            [userId]: [...userPendingVerifications, newRequest]
          },
          isLoading: false
        };
      });

      return newRequest;
    } catch (error) {
      set({ error: 'Failed to submit verification request', isLoading: false });
      throw error;
    }
  },

  checkVerificationStatus: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get user verification
      const userVerification = get().userVerifications[userId];

      // Get pending verifications
      const pendingVerifications = get().pendingVerifications[userId] || [];

      let status = 'unverified';

      if (userVerification?.verificationLevel && userVerification.verificationLevel !== 'none') {
        status = 'verified';
      } else if (pendingVerifications.length > 0) {
        status = 'pending';
      }

      set({ isLoading: false });
      return status as VerificationStatus;
    } catch (error) {
      set({ error: 'Failed to check verification status', isLoading: false });
      throw error;
    }
  },

  cancelVerificationRequest: async (userId: string, requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update pending verifications
      set(state => {
        const userPendingVerifications = state.pendingVerifications[userId] || [];

        return {
          pendingVerifications: {
            ...state.pendingVerifications,
            [userId]: userPendingVerifications.filter(req => req.id !== requestId)
          },
          isLoading: false
        };
      });

      return true;
    } catch (error) {
      set({ error: 'Failed to cancel verification request', isLoading: false });
      return false;
    }
  },

  // Selectors
  getUserVerificationStatus: (userId: string) => {
    const userVerification = get().userVerifications[userId];
    const pendingVerifications = get().pendingVerifications[userId] || [];

    if (userVerification?.verificationLevel && userVerification.verificationLevel !== 'none') {
      return VerificationStatus.VERIFIED;
    } else if (pendingVerifications.length > 0) {
      return VerificationStatus.PENDING;
    }

    return VerificationStatus.UNVERIFIED;
  },

  canUserListProperty: (userId: string) => {
    const status = get().getUserVerificationStatus(userId);
    return status === VerificationStatus.VERIFIED;
  },

  getPendingVerifications: (userId: string) => {
    return get().pendingVerifications[userId] || [];
  }
}));