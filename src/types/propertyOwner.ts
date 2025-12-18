// Property Owner Dashboard Types

// Property Types specific to Nigerian market
export enum NigerianPropertyType {
  SELF_CON = 'self_con',
  MINI_FLAT = 'mini_flat',
  ONE_BEDROOM = '1_bedroom',
  TWO_BEDROOM = '2_bedroom',
  THREE_BEDROOM = '3_bedroom',
  FOUR_BEDROOM = '4_bedroom',
  FIVE_BEDROOM = '5_bedroom',
  DUPLEX = 'duplex',
  PENTHOUSE = 'penthouse',
  BUNGALOW = 'bungalow',
  TERRACE = 'terrace',
  DETACHED = 'detached',
  SEMI_DETACHED = 'semi_detached',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

export enum PropertyCategory {
  RENT = 'rent',
  SALE = 'sale',
  SHORT_STAY = 'short_stay',
  LEASE = 'lease'
}

export enum PaymentCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUALLY = 'biannually',
  YEARLY = 'yearly',
  PER_NIGHT = 'per_night'
}

export enum PowerSupplyType {
  NEPA_ONLY = 'nepa_only',
  NEPA_WITH_GEN = 'nepa_with_gen',
  SOLAR = 'solar',
  INVERTER = 'inverter',
  FULL_POWER = 'full_power'
}

export enum WaterSource {
  BOREHOLE = 'borehole',
  WELL = 'well',
  MAINS = 'mains',
  TANKER = 'tanker',
  MULTIPLE = 'multiple'
}

export enum KitchenType {
  OPEN = 'open',
  CLOSED = 'closed',
  SEMI_OPEN = 'semi_open'
}

export enum FurnishingStatus {
  FURNISHED = 'furnished',
  SEMI_FURNISHED = 'semi_furnished',
  UNFURNISHED = 'unfurnished'
}

export enum BuildingCondition {
  NEWLY_BUILT = 'newly_built',
  RENOVATED = 'renovated',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_RENOVATION = 'needs_renovation'
}

// Property Onboarding Interface
export interface PropertyOnboarding {
  id?: string;
  ownerId: string;
  
  // Basic Information
  basicInfo: {
    title: string;
    propertyType: NigerianPropertyType;
    category: PropertyCategory;
    description: string;
    size: number; // sqm
    landmarks: string[];
  };
  
  // Location Details
  location: {
    fullAddress: string;
    state: string;
    lga: string;
    latitude?: number;
    longitude?: number;
    accessRoute: string;
  };
  
  // Property Features
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    kitchenType: KitchenType;
    parkingSpaces: number;
    powerSupply: PowerSupplyType;
    nepaHours?: number;
    waterSource: WaterSource;
    securityFeatures: string[];
    amenities: string[];
    accessibilityOptions: string[];
  };
  
  // Property Condition
  condition: {
    furnishingStatus: FurnishingStatus;
    buildingCondition: BuildingCondition;
    maintenanceStatus: string;
    lastRenovated?: Date;
  };
  
  // Media
  media: {
    images: PropertyMedia[];
    videos: PropertyMedia[];
    virtualTour?: string;
  };
  
  // Pricing & Payment
  pricing: {
    rentPrice: number;
    cautionFee?: number;
    legalFee?: number;
    serviceCharge?: number;
    agencyFee?: number;
    paymentCycle: PaymentCycle;
    negotiable: boolean;
  };
  
  status: 'draft' | 'pending_review' | 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | '360';
  caption?: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

// Viewing Management
export enum ViewingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  seekerId: string;
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  requestedDate: Date;
  requestedTime: string;
  status: ViewingStatus;
  accessCode?: string;
  notes?: string;
  feedback?: ViewingFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewingFeedback {
  rating: number;
  interested: boolean;
  comments: string;
  followUpRequired: boolean;
}

// Enquiries & Communication
export enum EnquiryStatus {
  OPEN = 'open',
  ACTIVE = 'active',
  CLOSED = 'closed',
  CONVERTED = 'converted'
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  seekerId: string;
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  message: string;
  status: EnquiryStatus;
  lastContactDate: Date;
  messages: EnquiryMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EnquiryMessage {
  id: string;
  senderId: string;
  senderType: 'owner' | 'seeker';
  content: string;
  attachments?: string[];
  readAt?: Date;
  createdAt: Date;
}

// Tenant Application
export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  DOCUMENTS_REQUESTED = 'documents_requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface TenantApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  
  // Personal Info
  occupation: string;
  employer?: string;
  monthlyIncome?: number;
  
  // Documents
  documents: ApplicationDocument[];
  
  // Guarantor
  guarantor?: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
    address: string;
    occupation: string;
  };
  
  status: ApplicationStatus;
  verificationStatus: 'pending' | 'verified' | 'failed';
  notes?: string;
  
  // Contract
  contractGenerated: boolean;
  contractSignedByTenant: boolean;
  contractSignedByOwner: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationDocument {
  id: string;
  type: 'id_card' | 'employment_letter' | 'bank_statement' | 'guarantor_id' | 'other';
  name: string;
  url: string;
  verified: boolean;
  uploadedAt: Date;
}

// Payments & Financial Records
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial'
}

export interface RentPayment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: 'repairs' | 'maintenance' | 'cleaning' | 'utilities' | 'insurance' | 'taxes' | 'other';
  description: string;
  amount: number;
  date: Date;
  receiptUrl?: string;
  vendor?: string;
}

export interface FinancialSummary {
  totalRentCollected: number;
  totalOutstanding: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  period: {
    start: Date;
    end: Date;
  };
}

// Maintenance
export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId?: string;
  tenantName?: string;
  title: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  images?: string[];
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics
export interface PropertyAnalytics {
  propertyId: string;
  views: number;
  enquiries: number;
  viewings: number;
  applications: number;
  conversionRate: number;
  averageTimeToRent: number; // days
  tenantSatisfaction: number; // 1-5
}

export interface OwnerDashboardStats {
  totalProperties: number;
  activeListings: number;
  totalTenants: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingPayments: number;
  pendingViewings: number;
  pendingApplications: number;
  maintenanceRequests: number;
  unreadMessages: number;
}

// Notifications
export enum NotificationType {
  NEW_ENQUIRY = 'new_enquiry',
  VIEWING_REQUEST = 'viewing_request',
  VIEWING_REMINDER = 'viewing_reminder',
  APPLICATION_RECEIVED = 'application_received',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_OVERDUE = 'payment_overdue',
  MAINTENANCE_REQUEST = 'maintenance_request',
  CONTRACT_EXPIRING = 'contract_expiring',
  DOCUMENT_EXPIRING = 'document_expiring',
  SYSTEM_ALERT = 'system_alert'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  propertyId?: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

// Nigerian States and LGAs
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const LAGOS_LGAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry',
  'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu',
  'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo',
  'Shomolu', 'Surulere'
];

// Common Amenities
export const COMMON_AMENITIES = [
  'Air Conditioning', 'WiFi', 'Wardrobe', 'POP Ceiling', 'Tiles', 'Marble Floor',
  'Balcony', 'Swimming Pool', 'Gym', 'Garden', 'Boys Quarter', 'Store Room',
  'Laundry Room', 'Prepaid Meter', 'Water Heater', 'Bathtub', 'Walk-in Closet',
  'Smart Home', 'Intercom', 'Elevator', 'Rooftop', 'Terrace'
];

// Security Features
export const SECURITY_FEATURES = [
  'Gatehouse', 'Security Guard', 'CCTV', 'Electric Fence', 'Burglar Proof',
  'Security Door', 'Alarm System', 'Estate Security', 'Perimeter Wall',
  'Access Control', 'Fire Extinguisher', 'Smoke Detector'
];

// Accessibility Options
export const ACCESSIBILITY_OPTIONS = [
  'Wheelchair Ramp', 'Elevator', 'Ground Floor', 'Wide Doorways',
  'Grab Bars', 'Accessible Bathroom', 'No Steps'
];
