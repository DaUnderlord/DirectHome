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
  BuildingCondition,
  PropertyMedia
} from '../types/propertyOwner';

async function uploadOwnerMedia(ownerId: string, items: PropertyMedia[] = []) {
  const rows: { url: string; is_primary: boolean; display_order: number }[] = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.file) {
      const ext = (item.file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('property-media').upload(path, item.file, {
        upsert: false,
        contentType: item.file.type || undefined,
      });
      if (error) {
        throw new Error(error.message);
      }
      const { data } = supabase.storage.from('property-media').getPublicUrl(path);
      rows.push({ url: data.publicUrl, is_primary: Boolean(item.isPrimary), display_order: i });
    } else if (item.url && !item.url.startsWith('blob:')) {
      rows.push({ url: item.url, is_primary: Boolean(item.isPrimary), display_order: i });
    }
  }

  return rows;
}

function asNumber(value: unknown, fallback = 0) {
  const next = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function mapOwnerProperty(p: Record<string, any>, extras?: Partial<PropertyOnboarding>): PropertyOnboarding {
  const images = Array.isArray(p.property_images) ? p.property_images : [];
  const listingType = p.listing_type === 'sale' ? PropertyCategory.SALE : PropertyCategory.RENT;
  const rawStatus = String(p.status || 'draft');
  const status = (
    rawStatus === 'pending' ? 'pending_review' : rawStatus
  ) as PropertyOnboarding['status'];

  return {
    id: p.id,
    ownerId: p.owner_id,
    basicInfo: {
      title: p.title || '',
      propertyType: (p.property_type as NigerianPropertyType) || NigerianPropertyType.THREE_BEDROOM,
      category: listingType,
      description: p.description || '',
      size: asNumber(p.square_footage),
      landmarks: [],
    },
    location: {
      fullAddress: p.address || '',
      state: p.state || '',
      lga: p.lga || p.city || '',
      latitude: p.latitude ?? undefined,
      longitude: p.longitude ?? undefined,
      accessRoute: '',
    },
    features: extras?.features || {
      bedrooms: asNumber(p.bedrooms, 1),
      bathrooms: asNumber(p.bathrooms, 1),
      toilets: asNumber(p.toilets, 1),
      kitchenType: KitchenType.CLOSED,
      parkingSpaces: 0,
      powerSupply: PowerSupplyType.NEPA_ONLY,
      waterSource: WaterSource.MAINS,
      securityFeatures: [],
      amenities: Array.isArray(p.amenities) ? p.amenities : [],
      accessibilityOptions: [],
    },
    condition: extras?.condition || {
      furnishingStatus: p.furnished ? FurnishingStatus.FURNISHED : FurnishingStatus.UNFURNISHED,
      buildingCondition: BuildingCondition.GOOD,
      maintenanceStatus: 'Good',
    },
    media: {
      images: images.map((img: { id?: string; url?: string; is_primary?: boolean; created_at?: string }) => ({
        id: img.id || img.url || crypto.randomUUID(),
        url: img.url || '',
        type: 'image' as const,
        isPrimary: Boolean(img.is_primary),
        uploadedAt: new Date(img.created_at || Date.now()),
      })).filter((img: { url: string }) => Boolean(img.url)),
      videos: [],
    },
    pricing: {
      rentPrice: asNumber(p.price),
      cautionFee: p.caution_fee == null ? undefined : asNumber(p.caution_fee),
      legalFee: p.legal_fee == null ? undefined : asNumber(p.legal_fee),
      serviceCharge: p.service_charge == null ? undefined : asNumber(p.service_charge),
      agencyFee: p.agency_fee == null ? undefined : asNumber(p.agency_fee),
      paymentCycle: p.payment_frequency === 'yearly' ? PaymentCycle.YEARLY : PaymentCycle.MONTHLY,
      negotiable: Boolean(p.negotiable),
    },
    status,
    createdAt: new Date(p.created_at || Date.now()),
    updatedAt: new Date(p.updated_at || Date.now()),
  };
}

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
          if (!ownerId) {
            set({ isLoadingProperties: false });
            return;
          }

          set({ isLoadingProperties: true });
          try {
            const { data, error } = await supabase
              .from('properties')
              .select('*')
              .eq('owner_id', ownerId)
              .order('created_at', { ascending: false });

            if (error) {
              console.error('Error fetching properties:', error);
              set({ isLoadingProperties: false });
              return;
            }

            const rows = data || [];
            const ids = rows.map((row) => row.id).filter(Boolean);
            let imagesByProperty = new Map<string, { id: string; url: string; is_primary?: boolean; created_at?: string }[]>();

            if (ids.length > 0) {
              const { data: imageRows } = await supabase
                .from('property_images')
                .select('id, url, is_primary, created_at, property_id')
                .in('property_id', ids);

              if (Array.isArray(imageRows)) {
                imagesByProperty = imageRows.reduce((map, image) => {
                  const list = map.get(image.property_id) || [];
                  list.push(image);
                  map.set(image.property_id, list);
                  return map;
                }, new Map<string, { id: string; url: string; is_primary?: boolean; created_at?: string }[]>());
              }
            }

            const properties = rows.map((row) =>
              mapOwnerProperty({
                ...row,
                property_images: imagesByProperty.get(row.id) || [],
              })
            );

            set({ properties, isLoadingProperties: false });
          } catch (err) {
            console.error('Error in fetchProperties:', err);
            set({ isLoadingProperties: false });
          }
        },
        
        createProperty: async (property: Partial<PropertyOnboarding>) => {
          set({ isLoadingProperties: true });

          try {
            if (!property.ownerId) {
              throw new Error('You must be signed in to list a property.');
            }

            const listingType =
              property.basicInfo?.category === PropertyCategory.SALE ? 'sale' : 'rent';

            const propertyData: any = {
              owner_id: property.ownerId,
              title: property.basicInfo?.title || '',
              description: property.basicInfo?.description || '',
              property_type: property.basicInfo?.propertyType || 'apartment',
              listing_type: listingType,
              address: property.location?.fullAddress || '',
              city: property.location?.lga || '',
              state: property.location?.state || '',
              lga: property.location?.lga || '',
              country: 'Nigeria',
              latitude: property.location?.latitude ?? null,
              longitude: property.location?.longitude ?? null,
              bedrooms: property.features?.bedrooms || 1,
              bathrooms: property.features?.bathrooms || 1,
              toilets: property.features?.toilets || 1,
              square_footage: property.basicInfo?.size || 0,
              furnished: property.condition?.furnishingStatus === FurnishingStatus.FURNISHED,
              amenities: property.features?.amenities || [],
              price: property.pricing?.rentPrice || 0,
              currency: 'NGN',
              caution_fee: property.pricing?.cautionFee ?? null,
              legal_fee: property.pricing?.legalFee ?? null,
              service_charge: property.pricing?.serviceCharge ?? null,
              agency_fee: property.pricing?.agencyFee ?? null,
              payment_frequency: property.pricing?.paymentCycle === PaymentCycle.YEARLY ? 'yearly' : 'monthly',
              negotiable: property.pricing?.negotiable ?? true,
              status: 'pending',
              verification_status: 'pending',
            };

            const { data, error } = await supabase
              .from('properties')
              .insert(propertyData)
              .select()
              .single();

            if (error) {
              throw new Error(error.message || 'Failed to create property. Please try again.');
            }

            const uploaded = await uploadOwnerMedia(
              property.ownerId,
              [
                ...(property.media?.images || []),
                ...(property.media?.videos || []),
              ]
            );

            if (uploaded.length > 0) {
              const { error: imageError } = await supabase.from('property_images').insert(
                uploaded.map((row) => ({
                  property_id: data.id,
                  url: row.url,
                  thumbnail_url: row.url,
                  is_primary: row.is_primary,
                  display_order: row.display_order,
                }))
              );
              if (imageError) {
                console.error('Property created but images failed to save:', imageError);
              }
            }

            const newProperty = mapOwnerProperty(data, {
              features: property.features,
              condition: property.condition,
            });
            newProperty.media = {
              images: uploaded.map((row, idx) => ({
                id: `img-${idx}`,
                url: row.url,
                type: 'image' as const,
                isPrimary: row.is_primary,
                uploadedAt: new Date(),
              })),
              videos: [],
            };

            set((state) => ({
              properties: [newProperty, ...state.properties.filter((item) => item.id !== newProperty.id)],
              isLoadingProperties: false,
            }));

            return newProperty;
          } catch (err) {
            console.error('Error in createProperty:', err);
            set({ isLoadingProperties: false });
            throw err;
          }
        },
        
        updateProperty: async (id: string, data: Partial<PropertyOnboarding>) => {
          set({ isLoadingProperties: true });
          try {
            // Update the record in Supabase
            // Extract the fields we want to update
            const updateData: any = { updated_at: new Date().toISOString() };
            if (data.basicInfo?.title) updateData.title = data.basicInfo.title;
            if (data.basicInfo?.description) updateData.description = data.basicInfo.description;
            if (data.pricing?.rentPrice) updateData.price = data.pricing.rentPrice;
            if (data.status) updateData.status = data.status;
            // (You can add more mappings here later as needed)
            
            const { error } = await supabase
              .from('properties')
              .update(updateData)
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              properties: state.properties.map(p => 
                p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
              ),
              isLoadingProperties: false
            }));
          } catch (error) {
            console.error('Error updating property:', error);
            set({ isLoadingProperties: false });
          }
        },
        
        deleteProperty: async (id: string) => {
          set({ isLoadingProperties: true });
          try {
            const { error } = await supabase
              .from('properties')
              .delete()
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              properties: state.properties.filter(p => p.id !== id),
              isLoadingProperties: false
            }));
          } catch (error) {
            console.error('Error deleting property:', error);
            set({ isLoadingProperties: false });
          }
        },
        
        setCurrentProperty: (property: PropertyOnboarding | null) => {
          set({ currentProperty: property });
        },
        
        // Viewing Actions
        fetchViewings: async (ownerId: string) => {
          set({ isLoadingViewings: true });
          try {
            const { data, error } = await supabase
              .from('property_viewings')
              .select(`
                *,
                properties:property_id(title),
                seeker:profiles!property_viewings_seeker_id_fkey(first_name, last_name, phone, email)
              `)
              .eq('owner_id', ownerId);
              
            if (error) {
              console.error('Error fetching viewings:', error);
              set({ viewings: [], isLoadingViewings: false });
              return;
            }
            
            const viewings: ViewingRequest[] = (data || []).map((v: any) => ({
              id: v.id,
              propertyId: v.property_id,
              propertyTitle: v.properties?.title || 'Unknown Property',
              seekerId: v.seeker_id,
              seekerName: v.seeker ? `${v.seeker.first_name || ''} ${v.seeker.last_name || ''}`.trim() : 'Unknown User',
              seekerPhone: v.seeker?.phone || '',
              seekerEmail: v.seeker?.email || '',
              requestedDate: new Date(v.scheduled_date),
              requestedTime: v.scheduled_time,
              status: v.status as ViewingStatus,
              notes: v.notes,
              feedback: v.seeker_feedback ? JSON.parse(v.seeker_feedback) : undefined,
              createdAt: new Date(v.created_at),
              updatedAt: new Date(v.updated_at)
            }));
            
            set({ viewings, isLoadingViewings: false });
          } catch (err) {
            console.error('Error fetching viewings:', err);
            set({ viewings: [], isLoadingViewings: false });
          }
        },
        
        updateViewingStatus: async (id: string, status: ViewingStatus, notes?: string) => {
          try {
            const updateData: any = { status: status as any, updated_at: new Date().toISOString() };
            if (notes) updateData.notes = notes;
            
            const { error } = await supabase
              .from('property_viewings')
              .update(updateData)
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              viewings: state.viewings.map(v => 
                v.id === id ? { ...v, status, notes: notes || v.notes, updatedAt: new Date() } : v
              )
            }));
          } catch (error) {
            console.error('Error updating viewing status:', error);
          }
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
        fetchEnquiries: async (ownerId: string) => {
          set({ isLoadingEnquiries: true });
          try {
            const { data, error } = await supabase
              .from('property_enquiries')
              .select(`
                *,
                properties:property_id(title),
                seeker:profiles!property_enquiries_seeker_id_fkey(first_name, last_name, phone, email)
              `)
              .eq('owner_id', ownerId);
              
            if (error) throw error;
            
            const enquiries: Enquiry[] = (data || []).map((e: any) => ({
              id: e.id,
              propertyId: e.property_id,
              propertyTitle: e.properties?.title || 'Unknown Property',
              seekerId: e.seeker_id,
              seekerName: e.seeker ? `${e.seeker.first_name || ''} ${e.seeker.last_name || ''}`.trim() : 'Unknown User',
              seekerPhone: e.seeker?.phone || '',
              seekerEmail: e.seeker?.email || '',
              message: e.message,
              status: e.status as EnquiryStatus,
              lastContactDate: new Date(e.updated_at),
              messages: [], // We might need a separate query for messages if needed, keeping empty for now
              createdAt: new Date(e.created_at),
              updatedAt: new Date(e.updated_at)
            }));
            
            set({ enquiries, isLoadingEnquiries: false });
          } catch (err) {
            console.error('Error fetching enquiries:', err);
            set({ enquiries: [], isLoadingEnquiries: false });
          }
        },
        
        updateEnquiryStatus: async (id: string, status: EnquiryStatus) => {
          try {
            const { error } = await supabase
              .from('property_enquiries')
              .update({ status: status as any, updated_at: new Date().toISOString() })
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              enquiries: state.enquiries.map(e => 
                e.id === id ? { ...e, status, updatedAt: new Date() } : e
              )
            }));
          } catch (error) {
            console.error('Error updating enquiry status:', error);
          }
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
        fetchApplications: async (ownerId: string) => {
          set({ isLoadingApplications: true });
          try {
            const { data, error } = await supabase
              .from('tenant_applications')
              .select(`
                *,
                properties:property_id(title),
                applicant:profiles!tenant_applications_applicant_id_fkey(first_name, last_name, phone, email)
              `)
              .eq('owner_id', ownerId);
              
            if (error) throw error;
            
            const applications: TenantApplication[] = (data || []).map((a: any) => ({
              id: a.id,
              propertyId: a.property_id,
              propertyTitle: a.properties?.title || 'Unknown Property',
              applicantId: a.applicant_id,
              applicantName: a.applicant ? `${a.applicant.first_name || ''} ${a.applicant.last_name || ''}`.trim() : 'Unknown User',
              applicantPhone: a.applicant?.phone || '',
              applicantEmail: a.applicant?.email || '',
              occupation: a.employment_status || '',
              employer: a.employer_name || '',
              monthlyIncome: a.monthly_income || 0,
              documents: a.documents || [],
              status: a.status as ApplicationStatus,
              verificationStatus: 'pending',
              notes: a.review_notes,
              contractGenerated: false,
              contractSignedByTenant: false,
              contractSignedByOwner: false,
              createdAt: new Date(a.created_at),
              updatedAt: new Date(a.updated_at)
            }));
            
            set({ applications, isLoadingApplications: false });
          } catch (err) {
            console.error('Error fetching applications:', err);
            set({ applications: [], isLoadingApplications: false });
          }
        },
        
        updateApplicationStatus: async (id: string, status: ApplicationStatus, notes?: string) => {
          try {
            const updateData: any = { status: status as any, updated_at: new Date().toISOString() };
            if (notes) updateData.review_notes = notes;
            
            const { error } = await supabase
              .from('tenant_applications')
              .update(updateData)
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              applications: state.applications.map(a => 
                a.id === id ? { ...a, status, notes: notes || a.notes, updatedAt: new Date() } : a
              )
            }));
          } catch (error) {
            console.error('Error updating application status:', error);
          }
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
        fetchFinancials: async (ownerId: string, _period?: { start: Date; end: Date }) => {
          set({ isLoadingFinancials: true });

          const emptySummary = (occupancyRate = 0): FinancialSummary => ({
            totalRentCollected: 0,
            totalOutstanding: 0,
            totalExpenses: 0,
            netIncome: 0,
            occupancyRate,
            period: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date()
            }
          });
          
          try {
            const { data: listingRows } = await supabase
              .from('properties')
              .select('id, status')
              .eq('owner_id', ownerId);
            const listings = listingRows || [];
            const liveCount = listings.filter((row: { status?: string }) => row.status === 'active').length;
            const occupancyRate = listings.length ? Math.round((liveCount / listings.length) * 100) : 0;

            const { data, error } = await supabase
              .from('payments')
              .select(`
                *,
                properties:property_id(title),
                tenant:profiles!payments_payer_id_fkey(first_name, last_name)
              `)
              .eq('recipient_id', ownerId);

            if (error || !data) {
              set({ payments: [], expenses: [], financialSummary: emptySummary(occupancyRate), isLoadingFinancials: false });
              return;
            }
            
            const payments = data.map((p: any) => ({
              id: p.id,
              propertyId: p.property_id || '',
              propertyTitle: p.properties?.title || 'Unknown Property',
              tenantId: p.payer_id || '',
              tenantName: p.tenant ? `${p.tenant.first_name || ''} ${p.tenant.last_name || ''}`.trim() : 'Unknown Tenant',
              amount: p.amount || 0,
              dueDate: p.due_date ? new Date(p.due_date) : new Date(),
              paidDate: p.payment_date ? new Date(p.payment_date) : undefined,
              status: p.status as PaymentStatus,
              paymentMethod: p.payment_method,
              receiptUrl: p.receipt_url,
              notes: p.notes
            }));
            
            const expenses: Expense[] = [];
            const totalRentCollected = payments.filter((p: any) => p.status === PaymentStatus.PAID).reduce((acc: number, curr: any) => acc + curr.amount, 0);
            const totalOutstanding = payments.filter((p: any) => p.status !== PaymentStatus.PAID).reduce((acc: number, curr: any) => acc + curr.amount, 0);

            set({
              payments,
              expenses,
              financialSummary: {
                totalRentCollected,
                totalOutstanding,
                totalExpenses: 0,
                netIncome: totalRentCollected,
                occupancyRate,
                period: {
                  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  end: new Date()
                }
              },
              isLoadingFinancials: false
            });
          } catch (err) {
            console.error('Error fetching financials:', err);
            set({ payments: [], expenses: [], financialSummary: emptySummary(), isLoadingFinancials: false });
          }
        },
        
        recordPayment: async (payment: Partial<RentPayment>) => {
          try {
            // Get current session to link the owner
            const { data: { session } } = await supabase.auth.getSession();
            const recipientId = session?.user?.id;
            
            const insertData = {
              property_id: payment.propertyId,
              payer_id: payment.tenantId,
              recipient_id: recipientId,
              amount: payment.amount,
              type: 'rent',
              due_date: payment.dueDate ? payment.dueDate.toISOString().split('T')[0] : null,
              payment_date: payment.paidDate ? payment.paidDate.toISOString() : null,
              status: payment.status as any,
              payment_method: payment.paymentMethod,
              notes: payment.notes
            };
            
            const { error, data } = await supabase
              .from('payments')
              .insert(insertData as any)
              .select('id')
              .single();
              
            if (error) throw error;
            
            const newPayment: RentPayment = {
              id: data.id,
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
          } catch (err) {
            console.error('Error recording payment:', err);
          }
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
        fetchMaintenanceRequests: async (ownerId: string) => {
          set({ isLoadingMaintenance: true });
          try {
            const { data, error } = await supabase
              .from('maintenance_requests')
              .select(`
                *,
                tenant:profiles!maintenance_requests_tenant_id_fkey(first_name, last_name)
              `)
              .eq('owner_id', ownerId);
              
            if (error) throw error;
            
            const maintenanceRequests: MaintenanceRequest[] = (data || []).map((m: any) => ({
              id: m.id,
              propertyId: m.property_id,
              propertyTitle: 'Property', // Might need to join properties to get real title
              tenantId: m.tenant_id,
              tenantName: m.tenant ? `${m.tenant.first_name || ''} ${m.tenant.last_name || ''}`.trim() : 'Unknown Tenant',
              title: m.title,
              description: m.description,
              category: m.category,
              priority: m.priority as MaintenancePriority,
              status: m.status as MaintenanceStatus,
              images: m.images,
              assignedTo: m.assigned_to,
              estimatedCost: m.estimated_cost,
              actualCost: m.actual_cost,
              completedAt: m.completed_at ? new Date(m.completed_at) : undefined,
              createdAt: new Date(m.created_at),
              updatedAt: new Date(m.updated_at)
            }));
            
            set({ maintenanceRequests, isLoadingMaintenance: false });
          } catch (err) {
            console.error('Error fetching maintenance requests:', err);
            set({ maintenanceRequests: [], isLoadingMaintenance: false });
          }
        },
        
        updateMaintenanceStatus: async (id: string, status: MaintenanceStatus, data?: Partial<MaintenanceRequest>) => {
          try {
            const updateData: any = { status: status as any, updated_at: new Date().toISOString() };
            if (data?.assignedTo) updateData.assigned_to = data.assignedTo;
            if (data?.estimatedCost) updateData.estimated_cost = data.estimatedCost;
            if (data?.actualCost) updateData.actual_cost = data.actualCost;
            if (status === MaintenanceStatus.COMPLETED) updateData.completed_at = new Date().toISOString();
            
            const { error } = await supabase
              .from('maintenance_requests')
              .update(updateData)
              .eq('id', id);
              
            if (error) throw error;
            
            set(state => ({
              maintenanceRequests: state.maintenanceRequests.map(m => 
                m.id === id ? { ...m, status, ...data, updatedAt: new Date() } : m
              )
            }));
          } catch (error) {
            console.error('Error updating maintenance request:', error);
          }
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
        fetchAnalytics: async (ownerId: string) => {
          set({ isLoadingAnalytics: true });
          try {
            const { data, error } = await supabase
              .from('properties')
              .select('id, view_count, inquiry_count, favorite_count, status, created_at')
              .eq('owner_id', ownerId);

            if (error) {
              console.error('Error fetching analytics:', error);
              set({ analytics: [], isLoadingAnalytics: false });
              return;
            }

            const analytics: PropertyAnalytics[] = (data || []).map((row) => {
              const views = Number(row.view_count || 0);
              const enquiries = Number(row.inquiry_count || 0);
              return {
                propertyId: row.id,
                views,
                enquiries,
                viewings: 0,
                applications: 0,
                conversionRate: views > 0 ? Math.round((enquiries / views) * 1000) / 10 : 0,
                averageTimeToRent: 0,
                tenantSatisfaction: 0,
              };
            });

            set({ analytics, isLoadingAnalytics: false });
          } catch (err) {
            console.error('Error in fetchAnalytics:', err);
            set({ analytics: [], isLoadingAnalytics: false });
          }
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
            const totalRevenue = properties.reduce((sum, p) => sum + asNumber(p.price), 0);
            
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
        fetchNotifications: async (ownerId: string) => {
          try {
            const { data, error } = await supabase
              .from('properties')
              .select('id, title, status, created_at, updated_at')
              .eq('owner_id', ownerId)
              .order('updated_at', { ascending: false });

            if (error) {
              set({ notifications: [], unreadCount: 0 });
              return;
            }

            const notifications: Notification[] = (data || []).map((row: {
              id: string;
              title?: string;
              status?: string;
              created_at?: string;
              updated_at?: string;
            }) => {
              const title = row.title || 'Untitled listing';
              const status = row.status || 'draft';
              const createdAt = new Date(row.updated_at || row.created_at || Date.now());
              const actionUrl = `/owner/properties/${row.id}`;

              if (status === 'pending' || status === 'pending_review') {
                return {
                  id: `listing-review-${row.id}`,
                  type: NotificationType.SYSTEM_ALERT,
                  title: 'Listing in review',
                  message: `"${title}" is with DirectHome for review. We'll update you when it goes live.`,
                  propertyId: row.id,
                  actionUrl,
                  read: false,
                  createdAt,
                };
              }
              if (status === 'active') {
                return {
                  id: `listing-live-${row.id}`,
                  type: NotificationType.SYSTEM_ALERT,
                  title: 'Listing is live',
                  message: `"${title}" is published. Seekers can contact you when marketplace messaging opens.`,
                  propertyId: row.id,
                  actionUrl,
                  read: true,
                  createdAt,
                };
              }
              if (status === 'rejected') {
                return {
                  id: `listing-rejected-${row.id}`,
                  type: NotificationType.SYSTEM_ALERT,
                  title: 'Listing needs changes',
                  message: `"${title}" was not approved. Open the listing to review the details.`,
                  propertyId: row.id,
                  actionUrl,
                  read: false,
                  createdAt,
                };
              }
              return {
                id: `listing-draft-${row.id}`,
                type: NotificationType.SYSTEM_ALERT,
                title: 'Draft listing saved',
                message: `"${title}" is saved as a draft.`,
                propertyId: row.id,
                actionUrl,
                read: true,
                createdAt,
              };
            });

            set({
              notifications,
              unreadCount: notifications.filter((item) => !item.read).length,
            });
          } catch {
            set({ notifications: [], unreadCount: 0 });
          }
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
        version: 2,
        partialize: (state) => ({
          currentProperty: state.currentProperty
            ? {
                ...state.currentProperty,
                media: { images: [], videos: [] },
              }
            : null,
        }),
        merge: (persistedState, currentState) => {
          const persisted = (persistedState || {}) as { currentProperty?: PropertyOnboarding | null };
          return {
            ...currentState,
            currentProperty: persisted.currentProperty ?? currentState.currentProperty,
          };
        },
        migrate: (persistedState) => {
          const persisted = (persistedState || {}) as { currentProperty?: PropertyOnboarding | null };
          return { currentProperty: persisted.currentProperty ?? null };
        },
      }
    )
  )
);
