import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  PromotionPackage,
  PropertyPromotion,
  ListingAnalytics,
  PromotionCampaign,
  FeaturedListingConfig,
  PromotionPayment,
  PromotionStatistics,
  PromotionRecommendation,
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionListQuery,
  AnalyticsQuery,
  BulkPromotionRequest,
  BulkPromotionResponse,
  PromotionType,
  PromotionStatus,
  PaymentStatus
} from '../types/premium';

interface PremiumState {
  // Promotion packages
  promotionPackages: PromotionPackage[];
  
  // User promotions
  userPromotions: PropertyPromotion[];
  activePromotions: PropertyPromotion[];
  
  // Analytics
  listingAnalytics: Record<string, ListingAnalytics>;
  promotionStatistics: PromotionStatistics | null;
  
  // Campaigns
  campaigns: PromotionCampaign[];
  
  // Configuration
  featuredConfig: FeaturedListingConfig | null;
  
  // Payments
  promotionPayments: PromotionPayment[];
  
  // Recommendations
  recommendations: Record<string, PromotionRecommendation>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  // Packages
  fetchPromotionPackages: () => Promise<void>;
  
  // Promotions
  fetchUserPromotions: (userId: string, query?: PromotionListQuery) => Promise<void>;
  createPromotion: (promotion: CreatePromotionDto) => Promise<string | null>;
  updatePromotion: (promotionId: string, updates: UpdatePromotionDto) => Promise<boolean>;
  cancelPromotion: (promotionId: string, reason: string) => Promise<boolean>;
  pausePromotion: (promotionId: string, reason: string) => Promise<boolean>;
  resumePromotion: (promotionId: string) => Promise<boolean>;
  renewPromotion: (promotionId: string) => Promise<boolean>;
  
  // Bulk operations
  createBulkPromotion: (request: BulkPromotionRequest) => Promise<BulkPromotionResponse | null>;
  
  // Analytics
  fetchListingAnalytics: (query: AnalyticsQuery) => Promise<void>;
  fetchPromotionStatistics: (userId: string, startDate: Date, endDate: Date) => Promise<void>;
  
  // Recommendations
  fetchPromotionRecommendations: (propertyId: string) => Promise<void>;
  
  // Payments
  fetchPromotionPayments: (userId: string) => Promise<void>;
  processPayment: (promotionId: string, paymentMethodId: string) => Promise<boolean>;
  
  // Configuration
  fetchFeaturedConfig: () => Promise<void>;
  updateFeaturedConfig: (config: Partial<FeaturedListingConfig>) => Promise<boolean>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePremiumStore = create<PremiumState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        promotionPackages: [],
        userPromotions: [],
        activePromotions: [],
        listingAnalytics: {},
        promotionStatistics: null,
        campaigns: [],
        featuredConfig: null,
        promotionPayments: [],
        recommendations: {},
        isLoading: false,
        error: null,

        // Packages
        fetchPromotionPackages: async () => {
          set({ isLoading: true, error: null });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockPackages: PromotionPackage[] = [
              {
                id: 'pkg-featured',
                name: 'Featured Listing',
                type: PromotionType.FEATURED,
                description: 'Make your property stand out with featured placement',
                features: [
                  'Top placement in search results',
                  'Featured badge on property card',
                  'Homepage visibility',
                  'Basic analytics'
                ],
                price: 5000,
                currency: 'NGN',
                duration: 30,
                priority: 2,
                isActive: true,
                displayOrder: 1,
                benefits: {
                  featuredPlacement: true,
                  highlightedCard: true,
                  topSearchResults: true,
                  socialMediaPromotion: false,
                  extendedVisibility: true,
                  prioritySupport: false,
                  detailedAnalytics: false,
                  customBadge: false
                }
              },
              {
                id: 'pkg-premium',
                name: 'Premium Listing',
                type: PromotionType.PREMIUM,
                description: 'Maximum visibility with premium features',
                features: [
                  'All Featured benefits',
                  'Social media promotion',
                  'Priority customer support',
                  'Detailed analytics dashboard',
                  'Custom promotional badge'
                ],
                price: 12000,
                currency: 'NGN',
                duration: 30,
                priority: 3,
                isActive: true,
                displayOrder: 2,
                benefits: {
                  featuredPlacement: true,
                  highlightedCard: true,
                  topSearchResults: true,
                  socialMediaPromotion: true,
                  extendedVisibility: true,
                  prioritySupport: true,
                  detailedAnalytics: true,
                  customBadge: true
                }
              },
              {
                id: 'pkg-spotlight',
                name: 'Spotlight',
                type: PromotionType.SPOTLIGHT,
                description: 'Short-term high visibility boost',
                features: [
                  'Top search placement for 7 days',
                  'Homepage spotlight section',
                  'Email newsletter inclusion',
                  'Quick visibility boost'
                ],
                price: 2500,
                currency: 'NGN',
                duration: 7,
                priority: 4,
                isActive: true,
                displayOrder: 3,
                benefits: {
                  featuredPlacement: true,
                  highlightedCard: true,
                  topSearchResults: true,
                  socialMediaPromotion: true,
                  extendedVisibility: false,
                  prioritySupport: false,
                  detailedAnalytics: false,
                  customBadge: false
                }
              }
            ];
            
            set({ promotionPackages: mockPackages, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch promotion packages', isLoading: false });
          }
        },

        // Promotions
        fetchUserPromotions: async (userId, query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const mockPromotions: PropertyPromotion[] = [
              {
                id: 'promo-1',
                propertyId: 'prop-123',
                packageId: 'pkg-featured',
                userId,
                type: PromotionType.FEATURED,
                status: PromotionStatus.ACTIVE,
                startDate: new Date('2024-01-15'),
                endDate: new Date('2024-02-14'),
                price: 5000,
                currency: 'NGN',
                paymentId: 'pay-1',
                paymentStatus: PaymentStatus.COMPLETED,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15'),
                autoRenew: true,
                renewalAttempts: 0
              },
              {
                id: 'promo-2',
                propertyId: 'prop-456',
                packageId: 'pkg-premium',
                userId,
                type: PromotionType.PREMIUM,
                status: PromotionStatus.EXPIRED,
                startDate: new Date('2023-12-01'),
                endDate: new Date('2023-12-31'),
                price: 12000,
                currency: 'NGN',
                paymentId: 'pay-2',
                paymentStatus: PaymentStatus.COMPLETED,
                createdAt: new Date('2023-12-01'),
                updatedAt: new Date('2023-12-31'),
                autoRenew: false,
                renewalAttempts: 0
              }
            ];
            
            const activePromotions = mockPromotions.filter(p => p.status === PromotionStatus.ACTIVE);
            
            set({ 
              userPromotions: mockPromotions, 
              activePromotions,
              isLoading: false 
            });
          } catch (error) {
            set({ error: 'Failed to fetch user promotions', isLoading: false });
          }
        },

        createPromotion: async (promotion) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newPromotion: PropertyPromotion = {
              id: `promo-${Date.now()}`,
              propertyId: promotion.propertyId,
              packageId: promotion.packageId,
              userId: 'current-user-id', // This would come from auth context
              type: PromotionType.FEATURED, // This would be determined by package
              status: PromotionStatus.PENDING,
              startDate: new Date(),
              endDate: new Date(Date.now() + (promotion.duration || 30) * 24 * 60 * 60 * 1000),
              price: 5000, // This would come from the package
              currency: 'NGN',
              paymentStatus: PaymentStatus.PENDING,
              createdAt: new Date(),
              updatedAt: new Date(),
              autoRenew: promotion.autoRenew || false,
              renewalAttempts: 0
            };
            
            set(state => ({
              userPromotions: [...state.userPromotions, newPromotion],
              isLoading: false
            }));
            
            return newPromotion.id;
          } catch (error) {
            set({ error: 'Failed to create promotion', isLoading: false });
            return null;
          }
        },

        updatePromotion: async (promotionId, updates) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? { ...promo, ...updates, updatedAt: new Date() }
                  : promo
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update promotion', isLoading: false });
            return false;
          }
        },

        cancelPromotion: async (promotionId, reason) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? {
                      ...promo,
                      status: PromotionStatus.CANCELLED,
                      cancelledAt: new Date(),
                      cancelledReason: reason,
                      updatedAt: new Date()
                    }
                  : promo
              ),
              activePromotions: state.activePromotions.filter(p => p.id !== promotionId),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to cancel promotion', isLoading: false });
            return false;
          }
        },

        pausePromotion: async (promotionId, reason) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? {
                      ...promo,
                      status: PromotionStatus.PAUSED,
                      pausedAt: new Date(),
                      pausedReason: reason,
                      updatedAt: new Date()
                    }
                  : promo
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to pause promotion', isLoading: false });
            return false;
          }
        },

        resumePromotion: async (promotionId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? {
                      ...promo,
                      status: PromotionStatus.ACTIVE,
                      pausedAt: undefined,
                      pausedReason: undefined,
                      updatedAt: new Date()
                    }
                  : promo
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to resume promotion', isLoading: false });
            return false;
          }
        },

        renewPromotion: async (promotionId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? {
                      ...promo,
                      status: PromotionStatus.ACTIVE,
                      startDate: new Date(),
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                      renewalAttempts: promo.renewalAttempts + 1,
                      updatedAt: new Date()
                    }
                  : promo
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to renew promotion', isLoading: false });
            return false;
          }
        },

        // Bulk operations
        createBulkPromotion: async (request) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const response: BulkPromotionResponse = {
              successful: request.propertyIds.slice(0, -1).map(id => `promo-${id}-${Date.now()}`),
              failed: [{
                propertyId: request.propertyIds[request.propertyIds.length - 1],
                reason: 'Property already has active promotion'
              }],
              totalCost: request.propertyIds.length * 5000,
              discount: request.discount ? 500 : 0,
              finalCost: (request.propertyIds.length * 5000) - (request.discount ? 500 : 0),
              currency: 'NGN'
            };
            
            set({ isLoading: false });
            return response;
          } catch (error) {
            set({ error: 'Failed to create bulk promotion', isLoading: false });
            return null;
          }
        },

        // Analytics
        fetchListingAnalytics: async (query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockAnalytics: ListingAnalytics = {
              propertyId: query.propertyId || 'prop-123',
              promotionId: query.promotionId,
              period: {
                start: query.startDate,
                end: query.endDate
              },
              metrics: {
                views: 1250,
                uniqueViews: 980,
                clicks: 145,
                inquiries: 23,
                favorites: 67,
                shares: 12,
                phoneClicks: 18,
                emailClicks: 15,
                whatsappClicks: 32,
                mapViews: 89,
                photoViews: 456
              },
              performance: {
                viewsGrowth: 35.2,
                inquiriesGrowth: 28.5,
                conversionRate: 1.84,
                avgViewDuration: 145,
                bounceRate: 0.32,
                engagementScore: 78
              },
              demographics: {
                ageGroups: {
                  '18-25': 15,
                  '26-35': 45,
                  '36-45': 30,
                  '46+': 10
                },
                locations: {
                  'Lagos': 60,
                  'Abuja': 25,
                  'Port Harcourt': 10,
                  'Others': 5
                },
                devices: {
                  'Mobile': 70,
                  'Desktop': 25,
                  'Tablet': 5
                },
                sources: {
                  'Direct': 40,
                  'Search': 35,
                  'Social': 15,
                  'Referral': 10
                }
              },
              comparison: {
                beforePromotion: {
                  views: 450,
                  inquiries: 8,
                  favorites: 23
                },
                similarListings: {
                  views: 680,
                  inquiries: 12,
                  favorites: 34
                }
              }
            };
            
            set(state => ({
              listingAnalytics: {
                ...state.listingAnalytics,
                [query.propertyId || 'prop-123']: mockAnalytics
              },
              isLoading: false
            }));
          } catch (error) {
            set({ error: 'Failed to fetch listing analytics', isLoading: false });
          }
        },

        fetchPromotionStatistics: async (userId, startDate, endDate) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const mockStats: PromotionStatistics = {
              userId,
              period: { start: startDate, end: endDate },
              totalPromotions: 5,
              activePromotions: 2,
              totalSpent: 35000,
              currency: 'NGN',
              averageROI: 2.8,
              topPerformingPromotion: {
                promotionId: 'promo-1',
                propertyTitle: 'Luxury 3BR Apartment in VI',
                views: 1250,
                inquiries: 23,
                roi: 3.2
              },
              promotionBreakdown: [
                {
                  type: PromotionType.FEATURED,
                  count: 3,
                  spent: 15000,
                  performance: 85
                },
                {
                  type: PromotionType.PREMIUM,
                  count: 2,
                  spent: 20000,
                  performance: 92
                }
              ],
              monthlyTrends: Array.from({ length: 6 }, (_, i) => ({
                month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
                promotions: Math.floor(Math.random() * 3) + 1,
                spent: Math.floor(Math.random() * 10000) + 5000,
                inquiries: Math.floor(Math.random() * 20) + 10
              }))
            };
            
            set({ promotionStatistics: mockStats, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch promotion statistics', isLoading: false });
          }
        },

        // Recommendations
        fetchPromotionRecommendations: async (propertyId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockRecommendation: PromotionRecommendation = {
              propertyId,
              recommendedPackage: {
                id: 'pkg-featured',
                name: 'Featured Listing',
                type: PromotionType.FEATURED,
                description: 'Make your property stand out with featured placement',
                features: [],
                price: 5000,
                currency: 'NGN',
                duration: 30,
                priority: 2,
                isActive: true,
                displayOrder: 1,
                benefits: {
                  featuredPlacement: true,
                  highlightedCard: true,
                  topSearchResults: true,
                  socialMediaPromotion: false,
                  extendedVisibility: true,
                  prioritySupport: false,
                  detailedAnalytics: false,
                  customBadge: false
                }
              },
              reason: 'Based on your property type and location, Featured Listing will give you the best ROI',
              expectedBenefits: {
                viewsIncrease: 180,
                inquiriesIncrease: 65,
                roi: 2.4
              },
              confidence: 85,
              basedOn: {
                propertyType: true,
                location: true,
                priceRange: true,
                seasonality: false,
                competition: true
              }
            };
            
            set(state => ({
              recommendations: {
                ...state.recommendations,
                [propertyId]: mockRecommendation
              },
              isLoading: false
            }));
          } catch (error) {
            set({ error: 'Failed to fetch recommendations', isLoading: false });
          }
        },

        // Payments
        fetchPromotionPayments: async (userId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Mock payments would be fetched here
            set({ promotionPayments: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch promotion payments', isLoading: false });
          }
        },

        processPayment: async (promotionId, paymentMethodId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update promotion payment status
            set(state => ({
              userPromotions: state.userPromotions.map(promo =>
                promo.id === promotionId
                  ? {
                      ...promo,
                      paymentStatus: PaymentStatus.COMPLETED,
                      status: PromotionStatus.ACTIVE,
                      updatedAt: new Date()
                    }
                  : promo
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Payment processing failed', isLoading: false });
            return false;
          }
        },

        // Configuration
        fetchFeaturedConfig: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const mockConfig: FeaturedListingConfig = {
              maxFeaturedListings: 20,
              featuredDuration: 30,
              featuredPrice: 5000,
              currency: 'NGN',
              autoRotation: true,
              rotationInterval: 24,
              displayLocations: {
                homepage: true,
                searchResults: true,
                categoryPages: true,
                relatedListings: true
              },
              styling: {
                badgeColor: '#F59E0B',
                badgeText: 'Featured',
                highlightColor: '#FEF3C7',
                borderStyle: 'solid'
              }
            };
            
            set({ featuredConfig: mockConfig, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch featured config', isLoading: false });
          }
        },

        updateFeaturedConfig: async (config) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              featuredConfig: state.featuredConfig
                ? { ...state.featuredConfig, ...config }
                : null,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update featured config', isLoading: false });
            return false;
          }
        },

        // Utility
        clearError: () => set({ error: null }),
        setLoading: (loading) => set({ isLoading: loading })
      }),
      {
        name: 'premium-store',
        partialize: (state) => ({
          // Only persist these fields
          promotionPackages: state.promotionPackages,
          featuredConfig: state.featuredConfig
        })
      }
    )
  )
);