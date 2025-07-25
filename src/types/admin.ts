/**
 * Admin role and permission types
 */
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support'
}

export enum AdminPermission {
  // User management
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  SUSPEND_USERS = 'suspend_users',
  
  // Property management
  VIEW_PROPERTIES = 'view_properties',
  EDIT_PROPERTIES = 'edit_properties',
  DELETE_PROPERTIES = 'delete_properties',
  APPROVE_PROPERTIES = 'approve_properties',
  FEATURE_PROPERTIES = 'feature_properties',
  
  // Content moderation
  VIEW_REPORTS = 'view_reports',
  RESOLVE_REPORTS = 'resolve_reports',
  MODERATE_CONTENT = 'moderate_content',
  
  // Verification management
  VIEW_VERIFICATIONS = 'view_verifications',
  APPROVE_VERIFICATIONS = 'approve_verifications',
  REJECT_VERIFICATIONS = 'reject_verifications',
  
  // Analytics and reporting
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  
  // System settings
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_ADMINS = 'manage_admins',
  
  // Financial
  VIEW_PAYMENTS = 'view_payments',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions'
}

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  avatar?: string;
  department?: string;
  notes?: string;
}

/**
 * Dashboard metrics interface
 */
export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  properties: {
    total: number;
    active: number;
    pending: number;
    featured: number;
    newThisMonth: number;
    growthRate: number;
  };
  transactions: {
    total: number;
    thisMonth: number;
    revenue: number;
    revenueGrowth: number;
  };
  reports: {
    pending: number;
    resolved: number;
    critical: number;
  };
  verifications: {
    pending: number;
    approved: number;
    rejected: number;
  };
  system: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

/**
 * Analytics data interfaces
 */
export interface UserAnalytics {
  registrations: {
    date: string;
    count: number;
    homeowners: number;
    seekers: number;
  }[];
  activity: {
    date: string;
    activeUsers: number;
    sessions: number;
    avgSessionDuration: number;
  }[];
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    userTypes: Record<string, number>;
  };
}

export interface PropertyAnalytics {
  listings: {
    date: string;
    count: number;
    approved: number;
    pending: number;
  }[];
  views: {
    date: string;
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
  }[];
  pricing: {
    averageRent: number;
    priceRanges: Record<string, number>;
    locationPricing: Record<string, number>;
  };
  performance: {
    topPerforming: Array<{
      propertyId: string;
      title: string;
      views: number;
      inquiries: number;
      conversionRate: number;
    }>;
  };
}

export interface RevenueAnalytics {
  revenue: {
    date: string;
    amount: number;
    subscriptions: number;
    featuredListings: number;
    other: number;
  }[];
  subscriptions: {
    active: number;
    cancelled: number;
    churnRate: number;
    mrr: number; // Monthly Recurring Revenue
    arpu: number; // Average Revenue Per User
  };
  forecasting: {
    projectedRevenue: number;
    projectedGrowth: number;
    seasonalTrends: Record<string, number>;
  };
}

/**
 * Moderation queue interfaces
 */
export interface ModerationItem {
  id: string;
  type: 'property' | 'user' | 'review' | 'message' | 'verification';
  itemId: string;
  title: string;
  description: string;
  reportedBy?: string;
  reportReason?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  metadata?: Record<string, any>;
}

export interface ModerationAction {
  id: string;
  moderationItemId: string;
  action: 'approve' | 'reject' | 'suspend' | 'delete' | 'escalate' | 'request_changes';
  reason: string;
  notes?: string;
  performedBy: string;
  performedAt: Date;
  reversible: boolean;
}

/**
 * System settings interfaces
 */
export interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  verification: {
    autoApproveEmail: boolean;
    autoApprovePhone: boolean;
    requireIdentityVerification: boolean;
    requireAddressVerification: boolean;
    verificationExpiryDays: number;
  };
  moderation: {
    autoModerationEnabled: boolean;
    flaggedContentThreshold: number;
    autoSuspendThreshold: number;
    reviewTimeoutHours: number;
  };
  payments: {
    currency: string;
    taxRate: number;
    subscriptionPlans: SubscriptionPlan[];
    featuredListingPrice: number;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    smsNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
    adminAlertThresholds: {
      newReports: number;
      systemErrors: number;
      failedPayments: number;
    };
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    listings: number;
    featuredListings: number;
    photos: number;
    support: 'basic' | 'priority' | 'dedicated';
  };
  isActive: boolean;
  displayOrder: number;
}

/**
 * Audit log interfaces
 */
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Admin notification interfaces
 */
export interface AdminNotification {
  id: string;
  type: 'system' | 'moderation' | 'user' | 'payment' | 'security';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Bulk operation interfaces
 */
export interface BulkOperation {
  id: string;
  type: 'user_action' | 'property_action' | 'data_export' | 'data_import';
  action: string;
  targetIds: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  performedBy: string;
  results?: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

/**
 * Data export interfaces
 */
export interface DataExport {
  id: string;
  type: 'users' | 'properties' | 'transactions' | 'analytics' | 'audit_logs';
  format: 'csv' | 'json' | 'xlsx';
  filters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

/**
 * API request/response interfaces
 */
export interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Form interfaces for admin operations
 */
export interface CreateAdminUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  department?: string;
  notes?: string;
}

export interface UpdateAdminUserDto {
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  permissions?: AdminPermission[];
  isActive?: boolean;
  department?: string;
  notes?: string;
}

export interface ModerationDecisionDto {
  action: 'approve' | 'reject' | 'suspend' | 'delete' | 'escalate' | 'request_changes';
  reason: string;
  notes?: string;
}

export interface SystemSettingsUpdateDto {
  section: keyof SystemSettings;
  settings: Partial<SystemSettings[keyof SystemSettings]>;
}