import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import {
  PropertyOnboarding,
  ViewingRequest,
  ViewingStatus,
  Enquiry,
  EnquiryStatus,
  TenantApplication,
  ApplicationStatus,
  RentPayment,
  PaymentStatus,
  Expense,
  FinancialSummary,
  MaintenanceRequest,
  MaintenanceStatus,
  MaintenancePriority,
  PropertyAnalytics,
  OwnerDashboardStats,
  Notification,
  NotificationType,
  NigerianPropertyType,
  PropertyCategory,
  PaymentCycle,
  PowerSupplyType,
  WaterSource,
  KitchenType,
  FurnishingStatus,
  BuildingCondition
} from '../types/propertyOwner';

interface PropertyOwnerState {
  // Properties
  properties: PropertyOnboarding[];
  currentProperty: PropertyOnboarding | null;
  isLoadingProperties: boolean;
  
  // Viewings
  viewings: ViewingRequest[];
  isLoadingViewings: boolean;
  
  // Enquiries
  enquiries: Enquiry[];
  isLoadingEnquiries: boolean;
  
  // Applications
  applications: TenantApplication[];
  isLoadingApplications: boolean;
  
  // Payments
  payments: RentPayment[];
  expenses: Expense[];
  financialSummary: FinancialSummary | null;
  isLoadingFinancials: boolean;
  
  // Maintenance
  maintenanceRequests: MaintenanceRequest[];
  isLoadingMaintenance: boolean;
  
  // Analytics
  analytics: PropertyAnalytics[];
  dashboardStats: OwnerDashboardStats | null;
  isLoadingAnalytics: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions - Properties
  fetchProperties: (ownerId: string) => Promise<void>;
  createProperty: (property: Partial<PropertyOnboarding>) => Promise<PropertyOnboarding | null>;
  updateProperty: (id: string, data: Partial<PropertyOnboarding>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setCurrentProperty: (property: PropertyOnboarding | null) => void;
  
  // Actions - Viewings
  fetchViewings: (ownerId: string) => Promise<void>;
  updateViewingStatus: (id: string, status: ViewingStatus, notes?: string) => Promise<void>;
  generateAccessCode: (viewingId: string) => Promise<string>;
  addViewingFeedback: (viewingId: string, feedback: ViewingRequest['feedback']) => Promise<void>;
  
  // Actions - Enquiries
  fetchEnquiries: (ownerId: string) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  sendEnquiryReply: (enquiryId: string, message: string) => Promise<void>;
  
  // Actions - Applications
  fetchApplications: (ownerId: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => Promise<void>;
  generateContract: (applicationId: string) => Promise<string>;
  
  // Actions - Financials
  fetchFinancials: (ownerId: string, period?: { start: Date; end: Date }) => Promise<void>;
  recordPayment: (payment: Partial<RentPayment>) => Promise<void>;
  addExpense: (expense: Partial<Expense>) => Promise<void>;
  sendPaymentReminder: (paymentId: string) => Promise<void>;
  
  // Actions - Maintenance
  fetchMaintenanceRequests: (ownerId: string) => Promise<void>;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus, data?: Partial<MaintenanceRequest>) => Promise<void>;
  assignMaintenance: (id: string, assignedTo: string) => Promise<void>;
  
  // Actions - Analytics
  fetchAnalytics: (ownerId: string) => Promise<void>;
  fetchDashboardStats: (ownerId: string) => Promise<void>;
  
  // Actions - Notifications
  fetchNotifications: (ownerId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

// Mock data generators
const generateMockProperties = (): PropertyOnboarding[] => [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    basicInfo: {
      title: '3 Bedroom Flat in Lekki Phase 1',
      propertyType: NigerianPropertyType.THREE_BEDROOM,
      category: PropertyCategory.RENT,
      description: 'Spacious 3 bedroom flat with modern finishes in a serene environment.',
      size: 150,
      landmarks: ['Lekki Phase 1 Mall', 'Chevron Drive']
    },
    location: {
      fullAddress: '15 Admiralty Way, Lekki Phase 1',
      state: 'Lagos',
      lga: 'Eti-Osa',
      latitude: 6.4281,
      longitude: 3.4219,
      accessRoute: 'Off Admiralty Way, after Lekki Phase 1 roundabout'
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      kitchenType: KitchenType.OPEN,
      parkingSpaces: 2,
      powerSupply: PowerSupplyType.FULL_POWER,
      nepaHours: 18,
      waterSource: WaterSource.BOREHOLE,
      securityFeatures: ['Gatehouse', 'CCTV', 'Estate Security'],
      amenities: ['Air Conditioning', 'WiFi', 'Wardrobe', 'POP Ceiling'],
      accessibilityOptions: []
    },
    condition: {
      furnishingStatus: FurnishingStatus.SEMI_FURNISHED,
      buildingCondition: BuildingCondition.NEWLY_BUILT,
      maintenanceStatus: 'Excellent'
    },
    media: {
      images: [
        { id: 'img-1', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', type: 'image', isPrimary: true, uploadedAt: new Date() }
      ],
      videos: []
    },
    pricing: {
      rentPrice: 3500000,
      cautionFee: 500000,
      legalFee: 150000,
      serviceCharge: 500000,
      paymentCycle: PaymentCycle.YEARLY,
      negotiable: true
    },
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'prop-2',
    ownerId: 'owner-1',
    basicInfo: {
      title: 'Luxury 4 Bedroom Duplex in Ikoyi',
      propertyType: NigerianPropertyType.DUPLEX,
      category: PropertyCategory.RENT,
      description: 'Exquisite 4 bedroom duplex with swimming pool and BQ.',
      size: 350,
      landmarks: ['Ikoyi Club', 'Falomo Shopping Complex']
    },
    location: {
      fullAddress: '8 Bourdillon Road, Ikoyi',
      state: 'Lagos',
      lga: 'Eti-Osa',
      latitude: 6.4541,
      longitude: 3.4346,
      accessRoute: 'Off Bourdillon Road, near Ikoyi Club'
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      toilets: 6,
      kitchenType: KitchenType.OPEN,
      parkingSpaces: 4,
      powerSupply: PowerSupplyType.FULL_POWER,
      waterSource: WaterSource.BOREHOLE,
      securityFeatures: ['Gatehouse', 'CCTV', 'Electric Fence', 'Security Guard'],
      amenities: ['Swimming Pool', 'Gym', 'Air Conditioning', 'Smart Home', 'Boys Quarter'],
      accessibilityOptions: ['Elevator']
    },
    condition: {
      furnishingStatus: FurnishingStatus.FURNISHED,
      buildingCondition: BuildingCondition.NEWLY_BUILT,
      maintenanceStatus: 'Excellent'
    },
    media: {
      images: [
        { id: 'img-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', type: 'image', isPrimary: true, uploadedAt: new Date() }
      ],
      videos: []
    },
    pricing: {
      rentPrice: 15000000,
      cautionFee: 2000000,
      legalFee: 500000,
      serviceCharge: 2000000,
      paymentCycle: PaymentCycle.YEARLY,
      negotiable: false
    },
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const generateMockViewings = (): ViewingRequest[] => [
  {
    id: 'view-1',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    seekerId: 'seeker-1',
    seekerName: 'Adebayo Johnson',
    seekerPhone: '+2348012345678',
    seekerEmail: 'adebayo@email.com',
    requestedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    requestedTime: '10:00 AM',
    status: ViewingStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'view-2',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    seekerId: 'seeker-2',
    seekerName: 'Chioma Okafor',
    seekerPhone: '+2348023456789',
    seekerEmail: 'chioma@email.com',
    requestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    requestedTime: '2:00 PM',
    status: ViewingStatus.CONFIRMED,
    accessCode: 'VW-2024-ABC',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'view-3',
    propertyId: 'prop-2',
    propertyTitle: 'Luxury 4 Bedroom Duplex in Ikoyi',
    seekerId: 'seeker-3',
    seekerName: 'Emeka Nwosu',
    seekerPhone: '+2348034567890',
    seekerEmail: 'emeka@email.com',
    requestedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    requestedTime: '11:00 AM',
    status: ViewingStatus.COMPLETED,
    accessCode: 'VW-2024-XYZ',
    feedback: {
      rating: 4,
      interested: true,
      comments: 'Very nice property, considering it seriously.',
      followUpRequired: true
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const generateMockEnquiries = (): Enquiry[] => [
  {
    id: 'enq-1',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    seekerId: 'seeker-1',
    seekerName: 'Adebayo Johnson',
    seekerPhone: '+2348012345678',
    seekerEmail: 'adebayo@email.com',
    message: 'Hello, I am interested in this property. Is it still available?',
    status: EnquiryStatus.ACTIVE,
    lastContactDate: new Date(),
    messages: [
      {
        id: 'msg-1',
        senderId: 'seeker-1',
        senderType: 'seeker',
        content: 'Hello, I am interested in this property. Is it still available?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'msg-2',
        senderId: 'owner-1',
        senderType: 'owner',
        content: 'Yes, it is still available. Would you like to schedule a viewing?',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'enq-2',
    propertyId: 'prop-2',
    propertyTitle: 'Luxury 4 Bedroom Duplex in Ikoyi',
    seekerId: 'seeker-4',
    seekerName: 'Fatima Abdullahi',
    seekerPhone: '+2348045678901',
    seekerEmail: 'fatima@email.com',
    message: 'Is the rent negotiable? I am looking for a long-term lease.',
    status: EnquiryStatus.OPEN,
    lastContactDate: new Date(),
    messages: [
      {
        id: 'msg-3',
        senderId: 'seeker-4',
        senderType: 'seeker',
        content: 'Is the rent negotiable? I am looking for a long-term lease.',
        createdAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const generateMockApplications = (): TenantApplication[] => [
  {
    id: 'app-1',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    applicantId: 'seeker-5',
    applicantName: 'Oluwaseun Adeyemi',
    applicantPhone: '+2348056789012',
    applicantEmail: 'seun@email.com',
    occupation: 'Software Engineer',
    employer: 'Tech Company Ltd',
    monthlyIncome: 800000,
    documents: [
      { id: 'doc-1', type: 'id_card', name: 'National ID', url: '/docs/id.pdf', verified: true, uploadedAt: new Date() },
      { id: 'doc-2', type: 'employment_letter', name: 'Employment Letter', url: '/docs/emp.pdf', verified: true, uploadedAt: new Date() }
    ],
    guarantor: {
      name: 'Mr. Adeyemi Senior',
      phone: '+2348067890123',
      email: 'adeyemi.sr@email.com',
      relationship: 'Father',
      address: '25 Victoria Island, Lagos',
      occupation: 'Retired Civil Servant'
    },
    status: ApplicationStatus.UNDER_REVIEW,
    verificationStatus: 'verified',
    contractGenerated: false,
    contractSignedByTenant: false,
    contractSignedByOwner: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const generateMockPayments = (): RentPayment[] => [
  {
    id: 'pay-1',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    tenantId: 'tenant-1',
    tenantName: 'Current Tenant',
    amount: 3500000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: PaymentStatus.PENDING
  },
  {
    id: 'pay-2',
    propertyId: 'prop-2',
    propertyTitle: 'Luxury 4 Bedroom Duplex in Ikoyi',
    tenantId: 'tenant-2',
    tenantName: 'Premium Tenant',
    amount: 15000000,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: PaymentStatus.PAID,
    paymentMethod: 'Bank Transfer',
    receiptUrl: '/receipts/pay-2.pdf'
  }
];

const generateMockMaintenanceRequests = (): MaintenanceRequest[] => [
  {
    id: 'maint-1',
    propertyId: 'prop-1',
    propertyTitle: '3 Bedroom Flat in Lekki Phase 1',
    tenantId: 'tenant-1',
    tenantName: 'Current Tenant',
    title: 'AC not cooling properly',
    description: 'The living room AC is not cooling as it should. It makes noise but no cold air.',
    category: 'HVAC',
    priority: MaintenancePriority.MEDIUM,
    status: MaintenanceStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'maint-2',
    propertyId: 'prop-2',
    propertyTitle: 'Luxury 4 Bedroom Duplex in Ikoyi',
    tenantId: 'tenant-2',
    tenantName: 'Premium Tenant',
    title: 'Pool pump needs servicing',
    description: 'The swimming pool pump is making unusual sounds and needs professional servicing.',
    category: 'Pool',
    priority: MaintenancePriority.LOW,
    status: MaintenanceStatus.ASSIGNED,
    assignedTo: 'Pool Services Ltd',
    estimatedCost: 50000,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const generateMockNotifications = (): Notification[] => [
  {
    id: 'notif-1',
    type: NotificationType.VIEWING_REQUEST,
    title: 'New Viewing Request',
    message: 'Adebayo Johnson requested a viewing for 3 Bedroom Flat in Lekki Phase 1',
    propertyId: 'prop-1',
    actionUrl: '/dashboard/viewings',
    read: false,
    createdAt: new Date()
  },
  {
    id: 'notif-2',
    type: NotificationType.NEW_ENQUIRY,
    title: 'New Enquiry',
    message: 'You have a new enquiry about Luxury 4 Bedroom Duplex in Ikoyi',
    propertyId: 'prop-2',
    actionUrl: '/dashboard/enquiries',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 'notif-3',
    type: NotificationType.APPLICATION_RECEIVED,
    title: 'New Application',
    message: 'Oluwaseun Adeyemi submitted an application for 3 Bedroom Flat in Lekki Phase 1',
    propertyId: 'prop-1',
    actionUrl: '/dashboard/applications',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

export const usePropertyOwnerStore = create<PropertyOwnerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        properties: [],
        currentProperty: null,
        isLoadingProperties: false,
        
        viewings: [],
        isLoadingViewings: false,
        
        enquiries: [],
        isLoadingEnquiries: false,
        
        applications: [],
        isLoadingApplications: false,
        
        payments: [],
        expenses: [],
        financialSummary: null,
        isLoadingFinancials: false,
        
        maintenanceRequests: [],
        isLoadingMaintenance: false,
        
        analytics: [],
        dashboardStats: null,
        isLoadingAnalytics: false,
        
        notifications: [],
        unreadCount: 0,
        
        // Property Actions
        fetchProperties: async (ownerId: string) => {
          set({ isLoadingProperties: true });
          try {
            // Fetch from Supabase
            const { data, error } = await supabase
              .from('properties')
              .select('*')
              .eq('owner_id', ownerId);
            
            if (error) {
              console.error('Error fetching properties:', error);
              // Return empty array on error - no mock data
              set({ properties: [], isLoadingProperties: false });
              return;
            }
            
            if (data && data.length > 0) {
              // Transform Supabase data to PropertyOnboarding format
              const properties: PropertyOnboarding[] = data.map(p => ({
                id: p.id,
                ownerId: p.owner_id,
                basicInfo: {
                  title: p.title || '',
                  propertyType: p.property_type as NigerianPropertyType || NigerianPropertyType.THREE_BEDROOM,
                  category: p.listing_type === 'rent' ? PropertyCategory.RENT : PropertyCategory.SALE,
                  description: p.description || '',
                  size: p.square_footage || 0,
                  landmarks: []
                },
                location: {
                  fullAddress: p.address || '',
                  state: p.state || '',
                  lga: p.lga || '',
                  latitude: p.latitude,
                  longitude: p.longitude,
                  accessRoute: ''
                },
                features: {
                  bedrooms: p.bedrooms || 1,
                  bathrooms: p.bathrooms || 1,
                  toilets: p.toilets || 1,
                  kitchenType: KitchenType.CLOSED,
                  parkingSpaces: 0,
                  powerSupply: PowerSupplyType.NEPA_ONLY,
                  waterSource: WaterSource.MAINS,
                  securityFeatures: [],
                  amenities: p.amenities || [],
                  accessibilityOptions: []
                },
                condition: {
                  furnishingStatus: p.furnished ? FurnishingStatus.FURNISHED : FurnishingStatus.UNFURNISHED,
                  buildingCondition: BuildingCondition.GOOD,
                  maintenanceStatus: 'Good'
                },
                media: {
                  images: (p.images || []).map((url: string, idx: number) => ({
                    id: `img-${idx}`,
                    url,
                    type: 'image' as const,
                    isPrimary: idx === 0,
                    uploadedAt: new Date()
                  })),
                  videos: []
                },
                pricing: {
                  rentPrice: p.price || 0,
                  cautionFee: p.caution_fee,
                  legalFee: p.legal_fee,
                  serviceCharge: p.service_charge,
                  paymentCycle: p.payment_frequency === 'yearly' ? PaymentCycle.YEARLY : PaymentCycle.MONTHLY,
                  negotiable: false
                },
                status: p.status || 'draft',
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at)
              }));
              set({ properties, isLoadingProperties: false });
            } else {
              // No data - show empty state
              set({ properties: [], isLoadingProperties: false });
            }
          } catch (err) {
            console.error('Error in fetchProperties:', err);
            set({ properties: [], isLoadingProperties: false });
          }
        },
        
        createProperty: async (property: Partial<PropertyOnboarding>) => {
          set({ isLoadingProperties: true });
          
          try {
            // Prepare data for Supabase
            const propertyData = {
              owner_id: property.ownerId,
              title: property.basicInfo?.title || '',
              description: property.basicInfo?.description || '',
              property_type: property.basicInfo?.propertyType || 'apartment',
              listing_type: property.basicInfo?.category === PropertyCategory.RENT ? 'rent' : 'sale',
              address: property.location?.fullAddress || '',
              city: property.location?.lga || '',
              state: property.location?.state || '',
              lga: property.location?.lga || '',
              latitude: property.location?.latitude,
              longitude: property.location?.longitude,
              bedrooms: property.features?.bedrooms || 1,
              bathrooms: property.features?.bathrooms || 1,
              toilets: property.features?.toilets || 1,
              square_footage: property.basicInfo?.size || 0,
              furnished: property.condition?.furnishingStatus === FurnishingStatus.FURNISHED,
              amenities: property.features?.amenities || [],
              price: property.pricing?.rentPrice || 0,
              caution_fee: property.pricing?.cautionFee,
              legal_fee: property.pricing?.legalFee,
              service_charge: property.pricing?.serviceCharge,
              payment_frequency: property.pricing?.paymentCycle === PaymentCycle.YEARLY ? 'yearly' : 'monthly',
              images: property.media?.images?.map(img => img.url) || [],
              video_url: property.media?.videos?.[0]?.url,
              status: 'pending'
            };
            
            const { data, error } = await supabase
              .from('properties')
              .insert(propertyData)
              .select()
              .single();
            
            if (error) {
              console.error('Error creating property:', error);
              // Fall back to local creation
              const newProperty: PropertyOnboarding = {
                id: `prop-${Date.now()}`,
                ownerId: property.ownerId || 'owner-1',
                basicInfo: property.basicInfo || {
                  title: '',
                  propertyType: NigerianPropertyType.THREE_BEDROOM,
                  category: PropertyCategory.RENT,
                  description: '',
                  size: 0,
                  landmarks: []
                },
                location: property.location || {
                  fullAddress: '',
                  state: '',
                  lga: '',
                  accessRoute: ''
                },
                features: property.features || {
                  bedrooms: 1,
                  bathrooms: 1,
                  toilets: 1,
                  kitchenType: KitchenType.CLOSED,
                  parkingSpaces: 0,
                  powerSupply: PowerSupplyType.NEPA_ONLY,
                  waterSource: WaterSource.MAINS,
                  securityFeatures: [],
                  amenities: [],
                  accessibilityOptions: []
                },
                condition: property.condition || {
                  furnishingStatus: FurnishingStatus.UNFURNISHED,
                  buildingCondition: BuildingCondition.GOOD,
                  maintenanceStatus: 'Good'
                },
                media: property.media || { images: [], videos: [] },
                pricing: property.pricing || {
                  rentPrice: 0,
                  paymentCycle: PaymentCycle.YEARLY,
                  negotiable: false
                },
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              set(state => ({
                properties: [...state.properties, newProperty],
                isLoadingProperties: false
              }));
              
              return newProperty;
            }
            
            // Transform returned data to PropertyOnboarding format
            const newProperty: PropertyOnboarding = {
              id: data.id,
              ownerId: data.owner_id,
              basicInfo: {
                title: data.title || '',
                propertyType: data.property_type as NigerianPropertyType || NigerianPropertyType.THREE_BEDROOM,
                category: data.listing_type === 'rent' ? PropertyCategory.RENT : PropertyCategory.SALE,
                description: data.description || '',
                size: data.square_footage || 0,
                landmarks: []
              },
              location: {
                fullAddress: data.address || '',
                state: data.state || '',
                lga: data.lga || '',
                latitude: data.latitude,
                longitude: data.longitude,
                accessRoute: ''
              },
              features: property.features || {
                bedrooms: data.bedrooms || 1,
                bathrooms: data.bathrooms || 1,
                toilets: data.toilets || 1,
                kitchenType: KitchenType.CLOSED,
                parkingSpaces: 0,
                powerSupply: PowerSupplyType.NEPA_ONLY,
                waterSource: WaterSource.MAINS,
                securityFeatures: [],
                amenities: data.amenities || [],
                accessibilityOptions: []
              },
              condition: property.condition || {
                furnishingStatus: data.furnished ? FurnishingStatus.FURNISHED : FurnishingStatus.UNFURNISHED,
                buildingCondition: BuildingCondition.GOOD,
                maintenanceStatus: 'Good'
              },
              media: {
                images: (data.images || []).map((url: string, idx: number) => ({
                  id: `img-${idx}`,
                  url,
                  type: 'image' as const,
                  isPrimary: idx === 0,
                  uploadedAt: new Date()
                })),
                videos: []
              },
              pricing: {
                rentPrice: data.price || 0,
                cautionFee: data.caution_fee,
                legalFee: data.legal_fee,
                serviceCharge: data.service_charge,
                paymentCycle: data.payment_frequency === 'yearly' ? PaymentCycle.YEARLY : PaymentCycle.MONTHLY,
                negotiable: false
              },
              status: data.status || 'pending',
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at)
            };
            
            set(state => ({
              properties: [...state.properties, newProperty],
              isLoadingProperties: false
            }));
            
            return newProperty;
          } catch (err) {
            console.error('Error in createProperty:', err);
            set({ isLoadingProperties: false });
            return null;
          }
        },
        
        updateProperty: async (id: string, data: Partial<PropertyOnboarding>) => {
          set({ isLoadingProperties: true });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            properties: state.properties.map(p => 
              p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
            ),
            isLoadingProperties: false
          }));
        },
        
        deleteProperty: async (id: string) => {
          set({ isLoadingProperties: true });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            properties: state.properties.filter(p => p.id !== id),
            isLoadingProperties: false
          }));
        },
        
        setCurrentProperty: (property: PropertyOnboarding | null) => {
          set({ currentProperty: property });
        },
        
        // Viewing Actions
        fetchViewings: async (_ownerId: string) => {
          set({ isLoadingViewings: true });
          // Return empty array - no mock data
          set({ viewings: [], isLoadingViewings: false });
        },
        
        updateViewingStatus: async (id: string, status: ViewingStatus, notes?: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            viewings: state.viewings.map(v => 
              v.id === id ? { ...v, status, notes: notes || v.notes, updatedAt: new Date() } : v
            )
          }));
        },
        
        generateAccessCode: async (viewingId: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          const code = `VW-${Date.now().toString(36).toUpperCase()}`;
          
          set(state => ({
            viewings: state.viewings.map(v => 
              v.id === viewingId ? { ...v, accessCode: code } : v
            )
          }));
          
          return code;
        },
        
        addViewingFeedback: async (viewingId: string, feedback: ViewingRequest['feedback']) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            viewings: state.viewings.map(v => 
              v.id === viewingId ? { ...v, feedback, updatedAt: new Date() } : v
            )
          }));
        },
        
        // Enquiry Actions
        fetchEnquiries: async (_ownerId: string) => {
          set({ isLoadingEnquiries: true });
          // Return empty array - no mock data
          set({ enquiries: [], isLoadingEnquiries: false });
        },
        
        updateEnquiryStatus: async (id: string, status: EnquiryStatus) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            enquiries: state.enquiries.map(e => 
              e.id === id ? { ...e, status, updatedAt: new Date() } : e
            )
          }));
        },
        
        sendEnquiryReply: async (enquiryId: string, message: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'owner-1',
            senderType: 'owner' as const,
            content: message,
            createdAt: new Date()
          };
          
          set(state => ({
            enquiries: state.enquiries.map(e => 
              e.id === enquiryId 
                ? { ...e, messages: [...e.messages, newMessage], lastContactDate: new Date(), updatedAt: new Date() } 
                : e
            )
          }));
        },
        
        // Application Actions
        fetchApplications: async (_ownerId: string) => {
          set({ isLoadingApplications: true });
          // Return empty array - no mock data
          set({ applications: [], isLoadingApplications: false });
        },
        
        updateApplicationStatus: async (id: string, status: ApplicationStatus, notes?: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            applications: state.applications.map(a => 
              a.id === id ? { ...a, status, notes: notes || a.notes, updatedAt: new Date() } : a
            )
          }));
        },
        
        generateContract: async (applicationId: string) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const contractUrl = `/contracts/contract-${applicationId}.pdf`;
          
          set(state => ({
            applications: state.applications.map(a => 
              a.id === applicationId ? { ...a, contractGenerated: true, updatedAt: new Date() } : a
            )
          }));
          
          return contractUrl;
        },
        
        // Financial Actions
        fetchFinancials: async (_ownerId: string, _period?: { start: Date; end: Date }) => {
          set({ isLoadingFinancials: true });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const payments = generateMockPayments();
          const expenses: Expense[] = [
            {
              id: 'exp-1',
              propertyId: 'prop-1',
              category: 'maintenance',
              description: 'AC Repair',
              amount: 25000,
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            }
          ];
          
          const financialSummary: FinancialSummary = {
            totalRentCollected: 15000000,
            totalOutstanding: 3500000,
            totalExpenses: 25000,
            netIncome: 14975000,
            occupancyRate: 85,
            period: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date()
            }
          };
          
          set({ payments, expenses, financialSummary, isLoadingFinancials: false });
        },
        
        recordPayment: async (payment: Partial<RentPayment>) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newPayment: RentPayment = {
            id: `pay-${Date.now()}`,
            propertyId: payment.propertyId || '',
            propertyTitle: payment.propertyTitle || '',
            tenantId: payment.tenantId || '',
            tenantName: payment.tenantName || '',
            amount: payment.amount || 0,
            dueDate: payment.dueDate || new Date(),
            paidDate: payment.paidDate,
            status: payment.status || PaymentStatus.PENDING,
            paymentMethod: payment.paymentMethod,
            receiptUrl: payment.receiptUrl,
            notes: payment.notes
          };
          
          set(state => ({
            payments: [...state.payments, newPayment]
          }));
        },
        
        addExpense: async (expense: Partial<Expense>) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newExpense: Expense = {
            id: `exp-${Date.now()}`,
            propertyId: expense.propertyId || '',
            category: expense.category || 'other',
            description: expense.description || '',
            amount: expense.amount || 0,
            date: expense.date || new Date(),
            receiptUrl: expense.receiptUrl,
            vendor: expense.vendor
          };
          
          set(state => ({
            expenses: [...state.expenses, newExpense]
          }));
        },
        
        sendPaymentReminder: async (_paymentId: string) => {
          await new Promise(resolve => setTimeout(resolve, 500));
          // In real app, this would send an email/SMS
        },
        
        // Maintenance Actions
        fetchMaintenanceRequests: async (_ownerId: string) => {
          set({ isLoadingMaintenance: true });
          // Return empty array - no mock data
          set({ maintenanceRequests: [], isLoadingMaintenance: false });
        },
        
        updateMaintenanceStatus: async (id: string, status: MaintenanceStatus, data?: Partial<MaintenanceRequest>) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            maintenanceRequests: state.maintenanceRequests.map(m => 
              m.id === id ? { ...m, status, ...data, updatedAt: new Date() } : m
            )
          }));
        },
        
        assignMaintenance: async (id: string, assignedTo: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            maintenanceRequests: state.maintenanceRequests.map(m => 
              m.id === id ? { ...m, assignedTo, status: MaintenanceStatus.ASSIGNED, updatedAt: new Date() } : m
            )
          }));
        },
        
        // Analytics Actions
        fetchAnalytics: async (_ownerId: string) => {
          set({ isLoadingAnalytics: true });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const analytics: PropertyAnalytics[] = [
            {
              propertyId: 'prop-1',
              views: 245,
              enquiries: 18,
              viewings: 8,
              applications: 3,
              conversionRate: 12.5,
              averageTimeToRent: 21,
              tenantSatisfaction: 4.5
            },
            {
              propertyId: 'prop-2',
              views: 189,
              enquiries: 12,
              viewings: 5,
              applications: 2,
              conversionRate: 10.5,
              averageTimeToRent: 28,
              tenantSatisfaction: 4.8
            }
          ];
          
          set({ analytics, isLoadingAnalytics: false });
        },
        
        fetchDashboardStats: async (ownerId: string) => {
          set({ isLoadingAnalytics: true });
          
          try {
            // Fetch real property count from Supabase
            const { data: propertiesData, error: propertiesError } = await supabase
              .from('properties')
              .select('id, status, price')
              .eq('owner_id', ownerId);
            
            if (propertiesError) {
              console.error('Error fetching properties for stats:', propertiesError);
            }
            
            const properties = propertiesData || [];
            const totalProperties = properties.length;
            const activeListings = properties.filter(p => p.status === 'active').length;
            
            // Calculate total revenue from active properties
            const totalRevenue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
            
            const dashboardStats: OwnerDashboardStats = {
              totalProperties,
              activeListings,
              totalTenants: 0,
              occupancyRate: totalProperties > 0 ? Math.round((activeListings / totalProperties) * 100) : 0,
              totalRevenue,
              pendingPayments: 0,
              pendingViewings: 0,
              pendingApplications: 0,
              maintenanceRequests: 0,
              unreadMessages: 0
            };
            
            set({ dashboardStats, isLoadingAnalytics: false });
          } catch (err) {
            console.error('Error in fetchDashboardStats:', err);
            // Set empty stats on error
            const dashboardStats: OwnerDashboardStats = {
              totalProperties: 0,
              activeListings: 0,
              totalTenants: 0,
              occupancyRate: 0,
              totalRevenue: 0,
              pendingPayments: 0,
              pendingViewings: 0,
              pendingApplications: 0,
              maintenanceRequests: 0,
              unreadMessages: 0
            };
            set({ dashboardStats, isLoadingAnalytics: false });
          }
        },
        
        // Notification Actions
        fetchNotifications: async (_ownerId: string) => {
          // Return empty array - no mock data
          set({ notifications: [], unreadCount: 0 });
        },
        
        markNotificationRead: async (id: string) => {
          set(state => {
            const notifications = state.notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            );
            return {
              notifications,
              unreadCount: notifications.filter(n => !n.read).length
            };
          });
        },
        
        markAllNotificationsRead: async () => {
          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
          }));
        }
      }),
      {
        name: 'property-owner-store',
        partialize: (state) => ({
          currentProperty: state.currentProperty
        })
      }
    )
  )
);
