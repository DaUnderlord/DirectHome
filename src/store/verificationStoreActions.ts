import {
  CreateRatingDto,
  CreateVerificationRequestDto,
  Rating,
  Report,
  TrustIndicator,
  UserRatingSummary,
  UserVerification,
  VerificationBadge,
  VerificationDocument,
  VerificationDocumentType,
  VerificationRequest
} from '../types/verification';

// Verification actions
export const verificationActions = (
  set: any,
  get: any,
  mockUserVerifications: Record<string, UserVerification>,
  mockVerificationRequests: VerificationRequest[],
  mockVerificationDocuments: VerificationDocument[],
  mockTrustIndicators: Record<string, TrustIndicator[]>,
  mockVerificationBadges: VerificationBadge[]
) => ({
  fetchUserVerification: async (userId: string): Promise<UserVerification | null> => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const verification = mockUserVerifications[userId] || null;
      
      set((state: any) => ({
        userVerifications: {
          ...state.userVerifications,
          [userId]: verification
        },
        currentUserVerification: verification,
        isLoading: false
      }));
      
      return verification;
    } catch (error) {
      set({ error: 'Failed to fetch user verification', isLoading: false });
      return null;
    }
  },

  fetchVerificationRequests: async (userId: string): Promise<VerificationRequest[]> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const requests = mockVerificationRequests.filter(req => req.userId === userId);
      
      set({ verificationRequests: requests, isLoading: false });
      return requests;
    } catch (error) {
      set({ error: 'Failed to fetch verification requests', isLoading: false });
      return [];
    }
  },

  fetchVerificationDocuments: async (userId: string): Promise<VerificationDocument[]> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const documents = mockVerificationDocuments.filter(doc => doc.userId === userId);
      
      set({ verificationDocuments: documents, isLoading: false });
      return documents;
    } catch (error) {
      set({ error: 'Failed to fetch verification documents', isLoading: false });
      return [];
    }
  },

  fetchTrustIndicators: async (userId: string): Promise<TrustIndicator[]> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const indicators = mockTrustIndicators[userId] || [];
      
      set((state: any) => ({
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

  fetchVerificationBadges: async (): Promise<VerificationBadge[]> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set({ verificationBadges: mockVerificationBadges, isLoading: false });
      return mockVerificationBadges;
    } catch (error) {
      set({ error: 'Failed to fetch verification badges', isLoading: false });
      return [];
    }
  },

  createVerificationRequest: async (request: CreateVerificationRequestDto): Promise<string | null> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: VerificationRequest = {
        id: `req-${Date.now()}`,
        userId: request.userId,
        type: request.type,
        documents: request.documents.map((doc, index) => ({
          id: `doc-${Date.now()}-${index}`,
          userId: request.userId,
          type: doc.type,
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          uploadedAt: new Date(),
          status: 'pending' as any
        })),
        submittedAt: new Date(),
        status: 'pending' as any,
        notes: request.notes
      };
      
      set((state: any) => ({
        verificationRequests: [...state.verificationRequests, newRequest],
        isLoading: false
      }));
      
      return newRequest.id;
    } catch (error) {
      set({ error: 'Failed to create verification request', isLoading: false });
      return null;
    }
  },

  uploadVerificationDocument: async (
    userId: string,
    type: VerificationDocumentType,
    file: File
  ): Promise<string | null> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocument: VerificationDocument = {
        id: `doc-${Date.now()}`,
        userId,
        type,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        status: 'pending' as any
      };
      
      set((state: any) => ({
        verificationDocuments: [...state.verificationDocuments, newDocument],
        isLoading: false
      }));
      
      return newDocument.id;
    } catch (error) {
      set({ error: 'Failed to upload verification document', isLoading: false });
      return null;
    }
  }
});

// Rating actions
export const ratingActions = (
  set: any,
  get: any,
  mockRatings: Rating[]
) => ({
  fetchUserRatings: async (userId: string): Promise<Rating[]> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userRatings = mockRatings.filter(rating => rating.toUserId === userId);
      
      set({ ratings: userRatings, isLoading: false });
      return userRatings;
    } catch (error) {
      set({ error: 'Failed to fetch user ratings', isLoading: false });
      return [];
    }
  },

  fetchUserRatingSummary: async (userId: string): Promise<UserRatingSummary | null> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userRatings = mockRatings.filter(rating => rating.toUserId === userId);
      
      if (userRatings.length === 0) {
        set({ isLoading: false });
        return null;
      }
      
      const totalRatings = userRatings.length;
      const averageRating = userRatings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings;
      
      const ratingDistribution = {
        '1': userRatings.filter(r => r.score === 1).length,
        '2': userRatings.filter(r => r.score === 2).length,
        '3': userRatings.filter(r => r.score === 3).length,
        '4': userRatings.filter(r => r.score === 4).length,
        '5': userRatings.filter(r => r.score === 5).length,
      };
      
      const summary: UserRatingSummary = {
        userId,
        averageRating,
        totalRatings,
        ratingDistribution,
        asOwnerRating: averageRating,
        asSeekerRating: averageRating,
        recentRatings: userRatings.slice(0, 5),
        responseRate: 95,
        responseTime: 2
      };
      
      set((state: any) => ({
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

  createRating: async (rating: CreateRatingDto): Promise<string | null> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRating: Rating = {
        id: `rating-${Date.now()}`,
        fromUserId: rating.fromUserId,
        toUserId: rating.toUserId,
        score: rating.score,
        comment: rating.comment,
        createdAt: new Date(),
        propertyId: rating.propertyId,
        transactionId: rating.transactionId,
        isAnonymous: rating.isAnonymous,
        isVerified: false,
        helpfulCount: 0,
        reportCount: 0,
        adminReviewed: false
      };
      
      set((state: any) => ({
        ratings: [...state.ratings, newRating],
        isLoading: false
      }));
      
      return newRating.id;
    } catch (error) {
      set({ error: 'Failed to create rating', isLoading: false });
      return null;
    }
  },

  updateRating: async (ratingId: string, score: number, comment?: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set((state: any) => ({
        ratings: state.ratings.map((rating: Rating) =>
          rating.id === ratingId
            ? { ...rating, score, comment, updatedAt: new Date() }
            : rating
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to update rating', isLoading: false });
      return false;
    }
  },

  deleteRating: async (ratingId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set((state: any) => ({
        ratings: state.ratings.filter((rating: Rating) => rating.id !== ratingId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to delete rating', isLoading: false });
      return false;
    }
  }
});

// Report actions
export const reportActions = (set: any, get: any) => ({
  createReport: async (
    reporterId: string,
    reportedUserId: string,
    reason: string,
    description: string,
    reportedPropertyId?: string,
    reportedMessageId?: string,
    reportedRatingId?: string
  ): Promise<string | null> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReport: Report = {
        id: `report-${Date.now()}`,
        reporterId,
        reportedUserId,
        reportedPropertyId,
        reportedMessageId,
        reportedRatingId,
        reason,
        description,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        severity: 'medium'
      };
      
      set((state: any) => ({
        reports: [...state.reports, newReport],
        isLoading: false
      }));
      
      return newReport.id;
    } catch (error) {
      set({ error: 'Failed to create report', isLoading: false });
      return null;
    }
  }
});

// Trust score actions
export const trustScoreActions = (set: any, get: any) => ({
  calculateTrustScore: async (userId: string): Promise<number> => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simple trust score calculation
      const state = get();
      const userVerification = state.userVerifications[userId];
      const userRatings = state.ratings.filter((r: Rating) => r.toUserId === userId);
      
      let score = 0;
      
      // Base score
      score += 20;
      
      // Verification factors
      if (userVerification?.identityVerified) score += 20;
      if (userVerification?.addressVerified) score += 15;
      if (userVerification?.phoneVerified) score += 10;
      if (userVerification?.emailVerified) score += 10;
      if (userVerification?.documentsVerified) score += 15;
      
      // Rating factor
      if (userRatings.length > 0) {
        const avgRating = userRatings.reduce((sum: number, r: Rating) => sum + r.score, 0) / userRatings.length;
        score += Math.round(avgRating * 2); // Max 10 points
      }
      
      // Cap at 100
      score = Math.min(score, 100);
      
      set({ isLoading: false });
      return score;
    } catch (error) {
      set({ error: 'Failed to calculate trust score', isLoading: false });
      return 0;
    }
  }
});