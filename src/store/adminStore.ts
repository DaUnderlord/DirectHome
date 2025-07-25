import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  AdminUser,
  DashboardMetrics,
  UserAnalytics,
  PropertyAnalytics,
  RevenueAnalytics,
  ModerationItem,
  ModerationAction,
  SystemSettings,
  AuditLog,
  AdminNotification,
  BulkOperation,
  DataExport,
  AdminListQuery,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  ModerationDecisionDto,
  SystemSettingsUpdateDto
} from '../types/admin';

interface AdminState {
  // Current admin user
  currentAdmin: AdminUser | null;
  
  // Dashboard data
  dashboardMetrics: DashboardMetrics | null;
  
  // Analytics data
  userAnalytics: UserAnalytics | null;
  propertyAnalytics: PropertyAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  
  // Moderation data
  moderationQueue: ModerationItem[];
  moderationActions: ModerationAction[];
  
  // System settings
  systemSettings: SystemSettings | null;
  
  // Admin users
  adminUsers: AdminUser[];
  
  // Audit logs
  auditLogs: AuditLog[];
  
  // Notifications
  notifications: AdminNotification[];
  unreadNotificationCount: number;
  
  // Bulk operations
  bulkOperations: BulkOperation[];
  
  // Data exports
  dataExports: DataExport[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  // Dashboard
  fetchDashboardMetrics: () => Promise<void>;
  
  // Analytics
  fetchUserAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<void>;
  fetchPropertyAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<void>;
  fetchRevenueAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<void>;
  
  // Moderation
  fetchModerationQueue: (query?: AdminListQuery) => Promise<void>;
  submitModerationDecision: (itemId: string, decision: ModerationDecisionDto) => Promise<boolean>;
  assignModerationItem: (itemId: string, adminId: string) => Promise<boolean>;
  
  // System settings
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (update: SystemSettingsUpdateDto) => Promise<boolean>;
  
  // Admin users
  fetchAdminUsers: (query?: AdminListQuery) => Promise<void>;
  createAdminUser: (userData: CreateAdminUserDto) => Promise<string | null>;
  updateAdminUser: (adminId: string, updates: UpdateAdminUserDto) => Promise<boolean>;
  deleteAdminUser: (adminId: string) => Promise<boolean>;
  
  // Audit logs
  fetchAuditLogs: (query?: AdminListQuery) => Promise<void>;
  
  // Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  
  // Bulk operations
  createBulkOperation: (operation: Omit<BulkOperation, 'id' | 'status' | 'progress'>) => Promise<string | null>;
  fetchBulkOperations: () => Promise<void>;
  cancelBulkOperation: (operationId: string) => Promise<boolean>;
  
  // Data exports
  createDataExport: (exportConfig: Omit<DataExport, 'id' | 'status' | 'requestedAt' | 'expiresAt'>) => Promise<string | null>;
  fetchDataExports: () => Promise<void>;
  downloadDataExport: (exportId: string) => Promise<string | null>;
  
  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentAdmin: null,
        dashboardMetrics: null,
        userAnalytics: null,
        propertyAnalytics: null,
        revenueAnalytics: null,
        moderationQueue: [],
        moderationActions: [],
        systemSettings: null,
        adminUsers: [],
        auditLogs: [],
        notifications: [],
        unreadNotificationCount: 0,
        bulkOperations: [],
        dataExports: [],
        isLoading: false,
        error: null,

        // Dashboard actions
        fetchDashboardMetrics: async () => {
          set({ isLoading: true, error: null });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockMetrics: DashboardMetrics = {
              users: {
                total: 15420,
                active: 12350,
                newThisMonth: 1250,
                growthRate: 8.5
              },
              properties: {
                total: 8750,
                active: 7200,
                pending: 150,
                featured: 320,
                newThisMonth: 680,
                growthRate: 12.3
              },
              transactions: {
                total: 2340,
                thisMonth: 180,
                revenue: 125000,
                revenueGrowth: 15.2
              },
              reports: {
                pending: 23,
                resolved: 156,
                critical: 3
              },
              verifications: {
                pending: 45,
                approved: 234,
                rejected: 12
              },
              system: {
                uptime: 99.8,
                responseTime: 245,
                errorRate: 0.02
              }
            };
            
            set({ dashboardMetrics: mockMetrics, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch dashboard metrics', isLoading: false });
          }
        },

        // Analytics actions
        fetchUserAnalytics: async (dateRange) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockUserAnalytics: UserAnalytics = {
              registrations: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                count: Math.floor(Math.random() * 50) + 10,
                homeowners: Math.floor(Math.random() * 20) + 5,
                seekers: Math.floor(Math.random() * 30) + 5
              })),
              activity: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                activeUsers: Math.floor(Math.random() * 1000) + 500,
                sessions: Math.floor(Math.random() * 2000) + 800,
                avgSessionDuration: Math.floor(Math.random() * 300) + 180
              })),
              demographics: {
                ageGroups: {
                  '18-25': 25,
                  '26-35': 35,
                  '36-45': 25,
                  '46-55': 10,
                  '55+': 5
                },
                locations: {
                  'Lagos': 40,
                  'Abuja': 25,
                  'Port Harcourt': 15,
                  'Kano': 10,
                  'Others': 10
                },
                userTypes: {
                  'Home Seekers': 70,
                  'Home Owners': 30
                }
              }
            };
            
            set({ userAnalytics: mockUserAnalytics, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch user analytics', isLoading: false });
          }
        },

        fetchPropertyAnalytics: async (dateRange) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockPropertyAnalytics: PropertyAnalytics = {
              listings: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                count: Math.floor(Math.random() * 30) + 10,
                approved: Math.floor(Math.random() * 25) + 8,
                pending: Math.floor(Math.random() * 5) + 2
              })),
              views: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                totalViews: Math.floor(Math.random() * 5000) + 2000,
                uniqueViews: Math.floor(Math.random() * 3000) + 1500,
                avgViewDuration: Math.floor(Math.random() * 180) + 120
              })),
              pricing: {
                averageRent: 450000,
                priceRanges: {
                  '< ₦200k': 15,
                  '₦200k - ₦500k': 35,
                  '₦500k - ₦1M': 30,
                  '₦1M - ₦2M': 15,
                  '> ₦2M': 5
                },
                locationPricing: {
                  'Lagos Island': 850000,
                  'Victoria Island': 1200000,
                  'Lekki': 650000,
                  'Ikeja': 400000,
                  'Surulere': 350000
                }
              },
              performance: {
                topPerforming: [
                  {
                    propertyId: 'prop-1',
                    title: 'Luxury 3BR Apartment in VI',
                    views: 1250,
                    inquiries: 45,
                    conversionRate: 3.6
                  },
                  {
                    propertyId: 'prop-2',
                    title: 'Modern 2BR in Lekki',
                    views: 980,
                    inquiries: 32,
                    conversionRate: 3.3
                  }
                ]
              }
            };
            
            set({ propertyAnalytics: mockPropertyAnalytics, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch property analytics', isLoading: false });
          }
        },

        fetchRevenueAnalytics: async (dateRange) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockRevenueAnalytics: RevenueAnalytics = {
              revenue: Array.from({ length: 12 }, (_, i) => ({
                date: new Date(2024, i, 1).toISOString().split('T')[0],
                amount: Math.floor(Math.random() * 50000) + 30000,
                subscriptions: Math.floor(Math.random() * 30000) + 20000,
                featuredListings: Math.floor(Math.random() * 15000) + 8000,
                other: Math.floor(Math.random() * 5000) + 2000
              })),
              subscriptions: {
                active: 1250,
                cancelled: 85,
                churnRate: 6.8,
                mrr: 125000,
                arpu: 100
              },
              forecasting: {
                projectedRevenue: 180000,
                projectedGrowth: 15.5,
                seasonalTrends: {
                  'Q1': 0.9,
                  'Q2': 1.1,
                  'Q3': 1.2,
                  'Q4': 0.8
                }
              }
            };
            
            set({ revenueAnalytics: mockRevenueAnalytics, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch revenue analytics', isLoading: false });
          }
        },

        // Moderation actions
        fetchModerationQueue: async (query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const mockModerationItems: ModerationItem[] = [
              {
                id: 'mod-1',
                type: 'property',
                itemId: 'prop-123',
                title: 'Suspicious Property Listing',
                description: 'Property listing with potentially fake images and unrealistic pricing',
                reportedBy: 'user-456',
                reportReason: 'Fake listing',
                priority: 'high',
                status: 'pending',
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20')
              },
              {
                id: 'mod-2',
                type: 'user',
                itemId: 'user-789',
                title: 'User Account Review',
                description: 'Multiple reports of inappropriate behavior',
                reportedBy: 'user-101',
                reportReason: 'Inappropriate behavior',
                priority: 'medium',
                status: 'in_review',
                assignedTo: 'admin-1',
                createdAt: new Date('2024-01-19'),
                updatedAt: new Date('2024-01-20')
              }
            ];
            
            set({ moderationQueue: mockModerationItems, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch moderation queue', isLoading: false });
          }
        },

        submitModerationDecision: async (itemId, decision) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update the moderation item status
            set(state => ({
              moderationQueue: state.moderationQueue.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      status: decision.action === 'approve' ? 'approved' : 'rejected',
                      reviewedAt: new Date(),
                      reviewedBy: 'current-admin-id',
                      reviewNotes: decision.notes
                    }
                  : item
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to submit moderation decision', isLoading: false });
            return false;
          }
        },

        assignModerationItem: async (itemId, adminId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            set(state => ({
              moderationQueue: state.moderationQueue.map(item =>
                item.id === itemId
                  ? { ...item, assignedTo: adminId, status: 'in_review' }
                  : item
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to assign moderation item', isLoading: false });
            return false;
          }
        },

        // System settings actions
        fetchSystemSettings: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockSettings: SystemSettings = {
              general: {
                siteName: 'Real Estate',
                siteDescription: 'Direct property rental platform for Nigeria',
                contactEmail: 'contact@realestate.com',
                supportEmail: 'support@realestate.com',
                maintenanceMode: false,
                registrationEnabled: true
              },
              verification: {
                autoApproveEmail: true,
                autoApprovePhone: false,
                requireIdentityVerification: true,
                requireAddressVerification: true,
                verificationExpiryDays: 365
              },
              moderation: {
                autoModerationEnabled: true,
                flaggedContentThreshold: 3,
                autoSuspendThreshold: 5,
                reviewTimeoutHours: 48
              },
              payments: {
                currency: 'NGN',
                taxRate: 7.5,
                subscriptionPlans: [],
                featuredListingPrice: 5000
              },
              notifications: {
                emailNotificationsEnabled: true,
                smsNotificationsEnabled: true,
                pushNotificationsEnabled: true,
                adminAlertThresholds: {
                  newReports: 10,
                  systemErrors: 5,
                  failedPayments: 3
                }
              }
            };
            
            set({ systemSettings: mockSettings, isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch system settings', isLoading: false });
          }
        },

        updateSystemSettings: async (update) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              systemSettings: state.systemSettings
                ? {
                    ...state.systemSettings,
                    [update.section]: {
                      ...state.systemSettings[update.section],
                      ...update.settings
                    }
                  }
                : null,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update system settings', isLoading: false });
            return false;
          }
        },

        // Admin user management
        fetchAdminUsers: async (query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock admin users would be fetched here
            set({ adminUsers: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch admin users', isLoading: false });
          }
        },

        createAdminUser: async (userData) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const newAdminId = `admin-${Date.now()}`;
            // In real implementation, this would make an API call
            
            set({ isLoading: false });
            return newAdminId;
          } catch (error) {
            set({ error: 'Failed to create admin user', isLoading: false });
            return null;
          }
        },

        updateAdminUser: async (adminId, updates) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              adminUsers: state.adminUsers.map(admin =>
                admin.id === adminId ? { ...admin, ...updates, updatedAt: new Date() } : admin
              ),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to update admin user', isLoading: false });
            return false;
          }
        },

        deleteAdminUser: async (adminId) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => ({
              adminUsers: state.adminUsers.filter(admin => admin.id !== adminId),
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to delete admin user', isLoading: false });
            return false;
          }
        },

        // Audit logs
        fetchAuditLogs: async (query) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Mock audit logs would be fetched here
            set({ auditLogs: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch audit logs', isLoading: false });
          }
        },

        // Notifications
        fetchNotifications: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const mockNotifications: AdminNotification[] = [
              {
                id: 'notif-1',
                type: 'moderation',
                title: 'New Report Submitted',
                message: 'A new property has been reported for suspicious activity',
                priority: 'high',
                isRead: false,
                actionRequired: true,
                actionUrl: '/admin/moderation/reports/rep-123',
                createdAt: new Date()
              }
            ];
            
            const unreadCount = mockNotifications.filter(n => !n.isRead).length;
            
            set({ 
              notifications: mockNotifications, 
              unreadNotificationCount: unreadCount,
              isLoading: false 
            });
          } catch (error) {
            set({ error: 'Failed to fetch notifications', isLoading: false });
          }
        },

        markNotificationAsRead: async (notificationId) => {
          try {
            set(state => ({
              notifications: state.notifications.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
              ),
              unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1)
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to mark notification as read' });
            return false;
          }
        },

        markAllNotificationsAsRead: async () => {
          try {
            set(state => ({
              notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
              unreadNotificationCount: 0
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to mark all notifications as read' });
            return false;
          }
        },

        // Bulk operations
        createBulkOperation: async (operation) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const newOperation: BulkOperation = {
              ...operation,
              id: `bulk-${Date.now()}`,
              status: 'pending',
              progress: 0
            };
            
            set(state => ({
              bulkOperations: [...state.bulkOperations, newOperation],
              isLoading: false
            }));
            
            return newOperation.id;
          } catch (error) {
            set({ error: 'Failed to create bulk operation', isLoading: false });
            return null;
          }
        },

        fetchBulkOperations: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Mock bulk operations would be fetched here
            set({ bulkOperations: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch bulk operations', isLoading: false });
          }
        },

        cancelBulkOperation: async (operationId) => {
          try {
            set(state => ({
              bulkOperations: state.bulkOperations.map(op =>
                op.id === operationId ? { ...op, status: 'cancelled' } : op
              )
            }));
            
            return true;
          } catch (error) {
            set({ error: 'Failed to cancel bulk operation' });
            return false;
          }
        },

        // Data exports
        createDataExport: async (exportConfig) => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newExport: DataExport = {
              ...exportConfig,
              id: `export-${Date.now()}`,
              status: 'pending',
              requestedAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            };
            
            set(state => ({
              dataExports: [...state.dataExports, newExport],
              isLoading: false
            }));
            
            return newExport.id;
          } catch (error) {
            set({ error: 'Failed to create data export', isLoading: false });
            return null;
          }
        },

        fetchDataExports: async () => {
          set({ isLoading: true, error: null });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Mock data exports would be fetched here
            set({ dataExports: [], isLoading: false });
          } catch (error) {
            set({ error: 'Failed to fetch data exports', isLoading: false });
          }
        },

        downloadDataExport: async (exportId) => {
          try {
            // In real implementation, this would return a download URL
            return `https://api.realestate.com/admin/exports/${exportId}/download`;
          } catch (error) {
            set({ error: 'Failed to get download URL' });
            return null;
          }
        },

        // Utility actions
        clearError: () => set({ error: null }),
        setLoading: (loading) => set({ isLoading: loading })
      }),
      {
        name: 'admin-store',
        partialize: (state) => ({
          // Only persist these fields
          currentAdmin: state.currentAdmin,
          unreadNotificationCount: state.unreadNotificationCount
        })
      }
    )
  )
);