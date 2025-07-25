import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  SubscriptionPlan,
  UserSubscription,
  PaymentMethodInfo,
  Transaction,
  Invoice,
  BillingHistory,
  SubscriptionAnalytics,
  Discount,
  SubscriptionChangePreview,
  PaymentProvider,
  PaymentIntent,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CreatePaymentMethodDto,
  ProcessPaymentDto,
  SubscriptionListQuery,
  TransactionListQuery,
  SubscriptionTier,
  SubscriptionStatus,
  BillingInterval,
  PaymentMethod,
  TransactionStatus
} from '../types/subscription';

interface SubscriptionState {
  // Plans
  subscriptionPlans: SubscriptionPlan[];
  
  // User subscription
  currentSubscription: UserSubscription | null;
  subscriptionHistory: UserSubscription[];
  
  // Payment methods
  paymentMethods: PaymentMethodInfo[];
  defaultPaymentMethod: PaymentMethodInfo | null;
  
  // Transactions and billing
  transactions: Transaction[];
  invoices: Invoice[];
  billingHistory: BillingHistory | null;
  
  // Analytics
  subscriptionAnalytics: SubscriptionAnalytics | null;
  
  // Discounts
  availableDiscounts: Discount[];
  appliedDiscount: Discount | null;
  
  // Payment providers
  paymentProviders: PaymentProvider[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  // Plans
  fetchSubscriptionPlans: () => Promise<void>;
  
  // Subscription management
  fetchCurrentSubscription: (userId: string) => Promise<void>;
  createSubscription: (subscription: CreateSubscriptionDto) => Promise<string | null>;
  updateSubscription: (subscriptionId: string, updates: UpdateSubscriptionDto) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string, reason: string) => Promise<boolean>;
  pauseSubscription: (subscriptionId: string, reason: string) => Promise<boolean>;
  resumeSubscription: (subscriptionId: string) => Promise<boolean>;
  previewSubscriptionChange: (newPlanId: string, billingInterval: BillingInterval) => Promise<SubscriptionChangePreview | null>;
  
  // Payment methods
  fetchPaymentMethods: (userId: string) => Promise<void>;
  addPaymentMethod: (paymentMethod: CreatePaymentMethodDto) => Promise<string | null>;
  updatePaymentMethod: (paymentMethodId: string, updates: Partial<PaymentMethodInfo>) => Promise<boolean>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  
  // Transactions and billing
  fetchTransactions: (userId: string, query?: TransactionListQuery) => Promise<void>;
  fetchInvoices: (userId: string) => Promise<void>;
  fetchBillingHistory: (userId: string) => Promise<void>;
  processPayment: (payment: ProcessPaymentDto) => Promise<PaymentIntent | null>;
  retryFailedPayment: (transactionId: string) => Promise<boolean>;
  
  // Analytics
  fetchSubscriptionAnalytics: (userId: string, startDate: Date, endDate: Date) => Promise<void>;
  
  // Discounts
  fetchAvailableDiscounts: () => Promise<void>;
  validateDiscountCode: (code: string) => Promise<Discount | null>;
  applyDiscount: (code: string) => Promise<boolean>;
  removeDiscount: () => void;
  
  // Payment providers
  fetchPaymentProviders: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        subscriptionPlans: [],
        currentSubscription: null,
        subscriptionHistory: [],
        paymentMethods: [],
        defaultPaymentMethod: null,
        transactions: [],
        invoices: [],
        billingHistory: null,
        subscriptionAnalytics: null,
        availableDiscounts: [],
        appliedDiscount: null,
        paymentProviders: [],
        isLoading: false,
        error: null,

        // Plans
        fetchSubscriptionPlans: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockPlans: SubscriptionPlan[] = [
              {
                id: 'plan-free',
                name: 'Free',
                tier: SubscriptionTier.FREE,
                description: 'Perfect for getting started',
                tagline: 'Start your property journey',
                features: [
                  { id: 'f1', name: 'Basic Listings', description: 'Create basic property listings', included: true },
                  { id: 'f2', name: 'Standard Photos', description: 'Upload up to 5 photos per listing', included: true, limit: 5, unit: 'photos' },
                  { id: 'f3', name: 'Basic Search', description: 'Search and filter properties', included: true },
                  { id: 'f4', name: 'Featured Listings', description: 'Promote your listings', included: false },
                  { id: 'f5', name: 'Analytics', description: 'Detailed performance insights', included: false },
                  { id: 'f6', name: 'Priority Support', description: '24/7 priority customer support', included: false }
                ],
                limits: {
                  properties: 2,
                  featuredListings: 0,
                  photos: 10,
                  videoUploads: 0,
                  virtualTours: 0,
                  prioritySupport: false,
                  advancedAnalytics: false,
                  customBranding: false,
                  apiAccess: false,
                  bulkOperations: false
                },
                pricing: [
                  { interval: BillingInterval.MONTHLY, price: 0, currency: 'NGN' }
                ],
                isPopular: false,
                isActive: true,
                displayOrder: 1
              },
              {
                id: 'plan-basic',
                name: 'Basic',
                tier: SubscriptionTier.BASIC,
                description: 'Great for individual property owners',
                tagline: 'Most popular choice',
                features: [
                  { id: 'f1', name: 'Unlimited Listings', description: 'Create unlimited property listings', included: true },
                  { id: 'f2', name: 'Enhanced Photos', description: 'Upload up to 15 photos per listing', included: true, limit: 15, unit: 'photos' },
                  { id: 'f3', name: 'Featured Listings', description: '2 featured listings per month', included: true, limit: 2, unit: 'per month' },
                  { id: 'f4', name: 'Basic Analytics', description: 'View performance metrics', included: true },
                  { id: 'f5', name: 'Email Support', description: 'Email customer support', included: true },
                  { id: 'f6', name: 'Video Tours', description: 'Add video tours to listings', included: false }
                ],
                limits: {
                  properties: 10,
                  featuredListings: 2,
                  photos: 150,
                  videoUploads: 0,
                  virtualTours: 0,
                  prioritySupport: false,
                  advancedAnalytics: true,
                  customBranding: false,
                  apiAccess: false,
                  bulkOperations: false
                },
                pricing: [
                  { 
                    interval: BillingInterval.MONTHLY, 
                    price: 15000, 
                    currency: 'NGN' 
                  },
                  { 
                    interval: BillingInterval.YEARLY, 
                    price: 150000, 
                    currency: 'NGN',
                    discount: { percentage: 17, description: 'Save 2 months' }
                  }
                ],
                isPopular: true,
                isActive: true,
                displayOrder: 2
              },
              {
                id: 'plan-professional',
                name: 'Professional',
                tier: SubscriptionTier.PROFESSIONAL,
                description: 'Perfect for real estate professionals',
                tagline: 'Best value for professionals',
                features: [
                  { id: 'f1', name: 'Unlimited Listings', description: 'Create unlimited property listings', included: true },
                  { id: 'f2', name: 'Premium Photos', description: 'Upload up to 25 photos per listing', included: true, limit: 25, unit: 'photos' },
                  { id: 'f3', name: 'Unlimited Featured', description: 'Unlimited featured listings', included: true },
                  { id: 'f4', name: 'Video Tours', description: 'Add video tours to listings', included: true, limit: 5, unit: 'per listing' },
                  { id: 'f5', name: 'Advanced Analytics', description: 'Detailed performance insights', included: true },
                  { id: 'f6', name: 'Priority Support', description: 'Priority customer support', included: true },
                  { id: 'f7', name: 'Custom Branding', description: 'Add your logo and branding', included: true },
                  { id: 'f8', name: 'Bulk Operations', description: 'Manage multiple listings at once', included: true }
                ],
                limits: {
                  properties: 50,
                  featuredListings: -1,
                  photos: 1250,
                  videoUploads: 250,
                  virtualTours: 10,
                  prioritySupport: true,
                  advancedAnalytics: true,
                  customBranding: true,
                  apiAccess: false,
                  bulkOperations: true
                },
                pricing: [
                  { 
                    interval: BillingInterval.MONTHLY, 
                    price: 35000, 
                    currency: 'NGN' 
                  },
                  { 
                    interval: BillingInterval.YEARLY, 
                    price: 350000, 
                    currency: 'NGN',
                    discount: { percentage: 17, description: 'Save 2 months' }
                  }
                ],
                isPopular: false,
                isActive: true,
                displayOrder: 3
              },
              {
                id: 'plan-enterprise',
                name: 'Enterprise',
                tier: SubscriptionTier.ENTERPRISE,
                description: 'For large real estate companies',
                tagline: 'Complete solution',
                features: [
                  { id: 'f1', name: 'Unlimited Everything', description: 'No limits on listings, photos, or features', included: true },
                  { id: 'f2', name: 'Virtual Tours', description: 'Unlimited 360° virtual tours', included: true },
                  { id: 'f3', name: 'API Access', description: 'Full API access for integrations', included: true },
                  { id: 'f4', name: 'White Label', description: 'Complete white-label solution', included: true },
                  { id: 'f5', name: 'Dedicated Support', description: 'Dedicated account manager', included: true },
                  { id: 'f6', name: 'Custom Features', description: 'Custom feature development', included: true },
                  { id: 'f7', name: 'Advanced Reporting', description: 'Custom reports and analytics', included: true },
                  { id: 'f8', name: 'Multi-user Access', description: 'Team collaboration tools', included: true }
                ],
                limits: {
                  properties: -1,
                  featuredListings: -1,
                  photos: -1,
                  videoUploads: -1,
                  virtualTours: -1,
                  prioritySupport: true,
                  advancedAnalytics: true,
                  customBranding: true,
                  apiAccess: true,
                  bulkOperations: true
                },
                pricing: [
                  { 
                    interval: BillingInterval.MONTHLY, 
                    price: 100000, 
                    currency: 'NGN' 
                  },
                  { 
                    interval: BillingInterval.YEARLY, 
                    price: 1000000, 
                    currency: 'NGN',
                    discount: { percentage: 17, description: 'Save 2 months' }
                  }
                ],
                isPopular: false,
                isActive: true,
                displayOrder: 4
              }
            ];
            
            set({ subscriptionPlans: mockPlans, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch subscription plans', isLoading: false });
          }
        },

        // Subscription management
        fetchCurrentSubscription: async (userId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const mockSubscription: UserSubscription = {
              id: 'sub-1',
              userId,
              planId: 'plan-basic',
              tier: SubscriptionTier.BASIC,
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: new Date('2024-01-01'),
              currentPeriodEnd: new Date('2024-02-01'),
              billingInterval: BillingInterval.MONTHLY,
              price: 15000,
              currency: 'NGN',
              autoRenew: true,
              nextBillingDate: new Date('2024-02-01'),
              usage: {
                properties: { used: 3, limit: 10 },
                featuredListings: { used: 1, limit: 2 },
                photos: { used: 45, limit: 150 },
                videoUploads: { used: 0, limit: 0 },
                virtualTours: { used: 0, limit: 0 },
                resetDate: new Date('2024-02-01')
              },
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            };
            
            set({ currentSubscription: mockSubscription, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch current subscription', isLoading: false });
          }
        },

        createSubscription: async (subscription) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newSubscriptionId = `sub-${Date.now()}`;
            
            // In real implementation, this would create the subscription
            // and update the current subscription state
            
            set({ isLoading: false });
            return newSubscriptionId;
          } catch (error) {
            set({ error: 'Failed to create subscription', isLoading: false });
            return null;
          }
        },

        updateSubscription: async (subscriptionId, updates) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set(state => ({
              currentSubscription: state.currentSubscription?.id === subscriptionId
                ? { ...state.currentSubscription, ...updates, updatedAt: new Date() }
                : state.currentSubscription,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update subscription', isLoading: false });
            return false;
          }
        },

        cancelSubscription: async (subscriptionId, reason) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set(state => ({
              currentSubscription: state.currentSubscription?.id === subscriptionId
                ? {
                    ...state.currentSubscription,
                    status: SubscriptionStatus.CANCELLED,
                    cancelledAt: new Date(),
                    cancelReason: reason,
                    autoRenew: false,
                    updatedAt: new Date()
                  }
                : state.currentSubscription,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to cancel subscription', isLoading: false });
            return false;
          }
        },

        pauseSubscription: async (subscriptionId, reason) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set(state => ({
              currentSubscription: state.currentSubscription?.id === subscriptionId
                ? {
                    ...state.currentSubscription,
                    status: SubscriptionStatus.PAUSED,
                    pausedAt: new Date(),
                    pauseReason: reason,
                    updatedAt: new Date()
                  }
                : state.currentSubscription,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to pause subscription', isLoading: false });
            return false;
          }
        },

        resumeSubscription: async (subscriptionId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set(state => ({
              currentSubscription: state.currentSubscription?.id === subscriptionId
                ? {
                    ...state.currentSubscription,
                    status: SubscriptionStatus.ACTIVE,
                    pausedAt: undefined,
                    pauseReason: undefined,
                    updatedAt: new Date()
                  }
                : state.currentSubscription,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to resume subscription', isLoading: false });
            return false;
          }
        },

        previewSubscriptionChange: async (newPlanId, billingInterval) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const { subscriptionPlans, currentSubscription } = get();
            const currentPlan = subscriptionPlans.find(p => p.id === currentSubscription?.planId);
            const newPlan = subscriptionPlans.find(p => p.id === newPlanId);
            
            if (!currentPlan || !newPlan) {
              throw new Error('Plan not found');
            }
            
            const newPricing = newPlan.pricing.find(p => p.interval === billingInterval);
            if (!newPricing) {
              throw new Error('Pricing not found');
            }
            
            const preview: SubscriptionChangePreview = {
              currentPlan,
              newPlan,
              prorationAmount: 5000, // Mock proration
              nextBillingAmount: newPricing.price,
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              immediateCharge: 0,
              changes: [
                {
                  feature: 'Properties Limit',
                  current: currentPlan.limits.properties,
                  new: newPlan.limits.properties,
                  impact: newPlan.limits.properties > currentPlan.limits.properties ? 'upgrade' : 'downgrade'
                },
                {
                  feature: 'Featured Listings',
                  current: currentPlan.limits.featuredListings,
                  new: newPlan.limits.featuredListings,
                  impact: newPlan.limits.featuredListings > currentPlan.limits.featuredListings ? 'upgrade' : 'downgrade'
                }
              ]
            };
            
            set({ isLoading: false });
            return preview;
          } catch (error) {
            set({ error: 'Failed to preview subscription change', isLoading: false });
            return null;
          }
        },

        // Payment methods
        fetchPaymentMethods: async (userId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockPaymentMethods: PaymentMethodInfo[] = [
              {
                id: 'pm-1',
                userId,
                type: PaymentMethod.CARD,
                isDefault: true,
                isActive: true,
                metadata: {
                  last4: '4242',
                  brand: 'Visa',
                  expiryMonth: 12,
                  expiryYear: 2025,
                  name: 'John Doe'
                },
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
              }
            ];
            
            const defaultMethod = mockPaymentMethods.find(pm => pm.isDefault) || null;
            
            set({ 
              paymentMethods: mockPaymentMethods, 
              defaultPaymentMethod: defaultMethod,
              isLoading: false 
            });
          } catch (error) {
            set({ error: 'Failed to fetch payment methods', isLoading: false });
          }
        },

        addPaymentMethod: async (paymentMethod) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newPaymentMethodId = `pm-${Date.now()}`;
            
            const newPaymentMethod: PaymentMethodInfo = {
              id: newPaymentMethodId,
              userId: 'current-user-id',
              type: paymentMethod.type,
              isDefault: paymentMethod.setAsDefault || false,
              isActive: true,
              metadata: paymentMethod.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            set(state => ({
              paymentMethods: [...state.paymentMethods, newPaymentMethod],
              defaultPaymentMethod: paymentMethod.setAsDefault ? newPaymentMethod : state.defaultPaymentMethod,
              isLoading: false
            }));
            
            return newPaymentMethodId;
          } catch (error) {
            set({ error: 'Failed to add payment method', isLoading: false });
            return null;
          }
        },

        updatePaymentMethod: async (paymentMethodId, updates) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              paymentMethods: state.paymentMethods.map(pm =>
                pm.id === paymentMethodId
                  ? { ...pm, ...updates, updatedAt: new Date() }
                  : pm
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update payment method', isLoading: false });
            return false;
          }
        },

        deletePaymentMethod: async (paymentMethodId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              paymentMethods: state.paymentMethods.filter(pm => pm.id !== paymentMethodId),
              defaultPaymentMethod: state.defaultPaymentMethod?.id === paymentMethodId 
                ? null 
                : state.defaultPaymentMethod,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to delete payment method', isLoading: false });
            return false;
          }
        },

        setDefaultPaymentMethod: async (paymentMethodId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            set(state => ({
              paymentMethods: state.paymentMethods.map(pm => ({
                ...pm,
                isDefault: pm.id === paymentMethodId
              })),
              defaultPaymentMethod: state.paymentMethods.find(pm => pm.id === paymentMethodId) || null,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to set default payment method', isLoading: false });
            return false;
          }
        },

        // Transactions and billing
        fetchTransactions: async (userId, query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const mockTransactions: Transaction[] = [
              {
                id: 'txn-1',
                userId,
                subscriptionId: 'sub-1',
                type: 'subscription',
                amount: 15000,
                currency: 'NGN',
                status: TransactionStatus.COMPLETED,
                description: 'Basic Plan - Monthly Subscription',
                createdAt: new Date('2024-01-01'),
                completedAt: new Date('2024-01-01')
              },
              {
                id: 'txn-2',
                userId,
                promotionId: 'promo-1',
                type: 'promotion',
                amount: 5000,
                currency: 'NGN',
                status: TransactionStatus.COMPLETED,
                description: 'Featured Listing Promotion',
                createdAt: new Date('2024-01-15'),
                completedAt: new Date('2024-01-15')
              }
            ];
            
            set({ transactions: mockTransactions, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch transactions', isLoading: false });
          }
        },

        fetchInvoices: async (userId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock invoices would be fetched here
            set({ invoices: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch invoices', isLoading: false });
          }
        },

        fetchBillingHistory: async (userId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const { transactions, paymentMethods } = get();
            
            const mockBillingHistory: BillingHistory = {
              userId,
              transactions,
              invoices: [],
              totalSpent: transactions.reduce((sum, txn) => sum + txn.amount, 0),
              currency: 'NGN',
              paymentMethods,
              upcomingCharges: {
                subscriptionRenewal: {
                  amount: 15000,
                  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  description: 'Basic Plan Renewal'
                },
                promotionCharges: []
              }
            };
            
            set({ billingHistory: mockBillingHistory, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch billing history', isLoading: false });
          }
        },

        processPayment: async (payment) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const paymentIntent: PaymentIntent = {
              id: `pi-${Date.now()}`,
              amount: payment.amount,
              currency: payment.currency,
              status: 'succeeded',
              createdAt: new Date()
            };
            
            set({ isLoading: false });
            return paymentIntent;
          } catch (error) {
            set({ error: 'Payment processing failed', isLoading: false });
            return null;
          }
        },

        retryFailedPayment: async (transactionId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            set(state => ({
              transactions: state.transactions.map(txn =>
                txn.id === transactionId
                  ? { ...txn, status: TransactionStatus.COMPLETED, completedAt: new Date() }
                  : txn
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to retry payment', isLoading: false });
            return false;
          }
        },

        // Analytics
        fetchSubscriptionAnalytics: async (userId, startDate, endDate) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockAnalytics: SubscriptionAnalytics = {
              userId,
              period: { start: startDate, end: endDate },
              metrics: {
                totalSpent: 45000,
                averageMonthlySpent: 15000,
                subscriptionValue: 15000,
                promotionSpent: 10000,
                savingsFromAnnual: 0
              },
              usage: {
                propertiesUtilization: 30, // 3/10 * 100
                featuredListingsUtilization: 50, // 1/2 * 100
                photosUtilization: 30, // 45/150 * 100
                videoUploadsUtilization: 0
              },
              recommendations: {
                reason: 'Based on your usage patterns, you might benefit from the Professional plan',
                potentialSavings: 5000
              }
            };
            
            set({ subscriptionAnalytics: mockAnalytics, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch subscription analytics', isLoading: false });
          }
        },

        // Discounts
        fetchAvailableDiscounts: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const mockDiscounts: Discount[] = [
              {
                id: 'disc-1',
                code: 'WELCOME20',
                name: 'Welcome Discount',
                description: '20% off your first month',
                type: 'percentage',
                value: 20,
                maxRedemptions: 1000,
                currentRedemptions: 245,
                validFrom: new Date('2024-01-01'),
                validUntil: new Date('2024-12-31'),
                applicablePlans: ['plan-basic', 'plan-professional'],
                firstTimeOnly: true,
                isActive: true
              }
            ];
            
            set({ availableDiscounts: mockDiscounts, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch available discounts', isLoading: false });
          }
        },

        validateDiscountCode: async (code) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const { availableDiscounts } = get();
            const discount = availableDiscounts.find(d => d.code === code && d.isActive);
            
            set({ isLoading: false });
            return discount || null;
          } catch (error) {
            set({ error: 'Failed to validate discount code', isLoading: false });
            return null;
          }
        },

        applyDiscount: async (code) => {
          set({ isLoading: true, error: null });
          
          try {
            const discount = await get().validateDiscountCode(code);
            
            if (discount) {
              set({ appliedDiscount: discount, isLoading: false });
              return true;
            } else {
              set({ error: 'Invalid discount code', isLoading: false });
              return false;
            }
          } catch (error) {
            set({ error: 'Failed to apply discount', isLoading: false });
            return false;
          }
        },

        removeDiscount: () => {
          set({ appliedDiscount: null });
        },

        // Payment providers
        fetchPaymentProviders: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const mockProviders: PaymentProvider[] = [
              {
                id: 'paystack',
                name: 'Paystack',
                type: PaymentMethod.CARD,
                isActive: true,
                supportedCurrencies: ['NGN', 'USD'],
                supportedCountries: ['NG'],
                fees: { percentage: 1.5, fixed: 100, currency: 'NGN' },
                processingTime: 'Instant',
                description: 'Pay with your debit/credit card',
                logo: '/logos/paystack.png'
              },
              {
                id: 'flutterwave',
                name: 'Flutterwave',
                type: PaymentMethod.BANK_TRANSFER,
                isActive: true,
                supportedCurrencies: ['NGN'],
                supportedCountries: ['NG'],
                fees: { percentage: 1.4, fixed: 0, currency: 'NGN' },
                processingTime: '1-2 business days',
                description: 'Direct bank transfer',
                logo: '/logos/flutterwave.png'
              }
            ];
            
            set({ paymentProviders: mockProviders, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch payment providers', isLoading: false });
          }
        },

        // Utility
        clearError: () => set({ error: null }),
        setLoading: (loading) => set({ isLoading: loading })
      }),
      {
        name: 'subscription-store',
        partialize: (state) => ({
          // Only persist these fields
          currentSubscription: state.currentSubscription,
          defaultPaymentMethod: state.defaultPaymentMethod,
          appliedDiscount: state.appliedDiscount
        })
      }
    )
  )
);