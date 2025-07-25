/**
 * Subscription and payment types
 */

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  PAUSED = 'paused'
}

export enum BillingInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_MONEY = 'mobile_money',
  USSD = 'ussd',
  QR_CODE = 'qr_code'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

/**
 * Subscription plan interface
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  description: string;
  tagline?: string;
  features: PlanFeature[];
  limits: PlanLimits;
  pricing: PlanPricing[];
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  metadata?: Record<string, any>;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

export interface PlanLimits {
  properties: number; // -1 for unlimited
  featuredListings: number;
  photos: number;
  videoUploads: number;
  virtualTours: number;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  bulkOperations: boolean;
}

export interface PlanPricing {
  interval: BillingInterval;
  price: number;
  currency: string;
  discount?: {
    percentage: number;
    description: string;
  };
}

/**
 * User subscription interface
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  billingInterval: BillingInterval;
  price: number;
  currency: string;
  trialEnd?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  pausedAt?: Date;
  pauseReason?: string;
  autoRenew: boolean;
  paymentMethodId?: string;
  nextBillingDate?: Date;
  usage: SubscriptionUsage;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionUsage {
  properties: {
    used: number;
    limit: number;
  };
  featuredListings: {
    used: number;
    limit: number;
  };
  photos: {
    used: number;
    limit: number;
  };
  videoUploads: {
    used: number;
    limit: number;
  };
  virtualTours: {
    used: number;
    limit: number;
  };
  resetDate: Date;
}

/**
 * Payment method interface
 */
export interface PaymentMethodInfo {
  id: string;
  userId: string;
  type: PaymentMethod;
  isDefault: boolean;
  isActive: boolean;
  metadata: {
    // For cards
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    
    // For bank accounts
    bankName?: string;
    accountNumber?: string;
    
    // For mobile money
    provider?: string;
    phoneNumber?: string;
    
    // Common
    name?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  promotionId?: string;
  type: 'subscription' | 'promotion' | 'refund' | 'credit';
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethodId?: string;
  paymentProvider?: string;
  externalTransactionId?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
}

/**
 * Invoice interface
 */
export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  dueDate: Date;
  paidAt?: Date;
  voidedAt?: Date;
  items: InvoiceItem[];
  paymentAttempts: PaymentAttempt[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  metadata?: Record<string, any>;
}

export interface PaymentAttempt {
  id: string;
  amount: number;
  status: TransactionStatus;
  paymentMethodId?: string;
  failureReason?: string;
  attemptedAt: Date;
}

/**
 * Billing history interface
 */
export interface BillingHistory {
  userId: string;
  transactions: Transaction[];
  invoices: Invoice[];
  totalSpent: number;
  currency: string;
  paymentMethods: PaymentMethodInfo[];
  upcomingCharges: {
    subscriptionRenewal?: {
      amount: number;
      date: Date;
      description: string;
    };
    promotionCharges: {
      amount: number;
      date: Date;
      description: string;
    }[];
  };
}

/**
 * Subscription analytics interface
 */
export interface SubscriptionAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalSpent: number;
    averageMonthlySpent: number;
    subscriptionValue: number;
    promotionSpent: number;
    savingsFromAnnual: number;
  };
  usage: {
    propertiesUtilization: number;
    featuredListingsUtilization: number;
    photosUtilization: number;
    videoUploadsUtilization: number;
  };
  recommendations: {
    suggestedPlan?: SubscriptionPlan;
    reason: string;
    potentialSavings: number;
  };
}

/**
 * Discount and coupon interfaces
 */
export interface Discount {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_trial';
  value: number;
  currency?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  validFrom: Date;
  validUntil: Date;
  applicablePlans: string[];
  firstTimeOnly: boolean;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface AppliedDiscount {
  discountId: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_trial';
  value: number;
  appliedAmount: number;
  description: string;
}

/**
 * API request/response interfaces
 */
export interface CreateSubscriptionDto {
  planId: string;
  billingInterval: BillingInterval;
  paymentMethodId?: string;
  discountCode?: string;
  autoRenew?: boolean;
}

export interface UpdateSubscriptionDto {
  planId?: string;
  billingInterval?: BillingInterval;
  autoRenew?: boolean;
  pauseReason?: string;
  cancelReason?: string;
}

export interface CreatePaymentMethodDto {
  type: PaymentMethod;
  token?: string; // Payment provider token
  metadata: Record<string, any>;
  setAsDefault?: boolean;
}

export interface ProcessPaymentDto {
  amount: number;
  currency: string;
  paymentMethodId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionListQuery {
  status?: SubscriptionStatus;
  tier?: SubscriptionTier;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionListQuery {
  type?: string;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Subscription change preview interface
 */
export interface SubscriptionChangePreview {
  currentPlan: SubscriptionPlan;
  newPlan: SubscriptionPlan;
  prorationAmount: number;
  nextBillingAmount: number;
  nextBillingDate: Date;
  immediateCharge: number;
  changes: {
    feature: string;
    current: string | number | boolean;
    new: string | number | boolean;
    impact: 'upgrade' | 'downgrade' | 'same';
  }[];
}

/**
 * Payment provider interfaces
 */
export interface PaymentProvider {
  id: string;
  name: string;
  type: PaymentMethod;
  isActive: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  processingTime: string;
  description: string;
  logo?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret?: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Subscription notification interfaces
 */
export interface SubscriptionNotification {
  id: string;
  userId: string;
  type: 'renewal_reminder' | 'payment_failed' | 'trial_ending' | 'subscription_cancelled' | 'usage_limit_reached';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}