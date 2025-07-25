import { 
  Property, 
  PropertyType, 
  ListingType, 
  PropertyStatus, 
  PropertyVerificationStatus 
} from '../types/property';
import { User, UserRole, VerificationStatus, AccountStatus } from '../types/auth';
import { AppointmentStatus, AppointmentType, Appointment } from '../types/appointment';
import { SubscriptionTier, SubscriptionStatus } from '../types/subscription';
import { Conversation, Message, ConversationStatus } from '../types/messaging';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'homeowner@example.com',
    phone: '+2348012345678',
    firstName: 'John',
    lastName: 'Owner',
    role: UserRole.HOME_OWNER,
    emailVerified: true,
    phoneVerified: true,
    verificationStatus: VerificationStatus.VERIFIED,
    accountStatus: AccountStatus.ACTIVE,
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    profile: {
      userId: 'user-1',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'Property owner with multiple listings in Lagos',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        newMessages: true,
        appointmentReminders: true,
        marketingUpdates: false,
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }
  },
  {
    id: 'user-2',
    email: 'homeseeker@example.com',
    phone: '+2348023456789',
    firstName: 'Sarah',
    lastName: 'Seeker',
    role: UserRole.HOME_SEEKER,
    emailVerified: true,
    phoneVerified: true,
    verificationStatus: VerificationStatus.VERIFIED,
    accountStatus: AccountStatus.ACTIVE,
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    profile: {
      userId: 'user-2',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      bio: 'Looking for a nice apartment in Lagos',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        newMessages: true,
        appointmentReminders: true,
        marketingUpdates: false,
      },
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }
  },
  {
    id: 'user-3',
    email: 'admin@example.com',
    phone: '+2348034567890',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    emailVerified: true,
    phoneVerified: true,
    verificationStatus: VerificationStatus.VERIFIED,
    accountStatus: AccountStatus.ACTIVE,
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    profile: {
      userId: 'user-3',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        newMessages: true,
        appointmentReminders: true,
        marketingUpdates: true,
      },
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }
  }
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    title: '3 Bedroom Apartment in Lekki Phase 1',
    description: 'Beautiful 3 bedroom apartment with modern amenities in a secure estate.',
    propertyType: PropertyType.APARTMENT,
    listingType: ListingType.RENT,
    location: {
      address: '123 Admiralty Way',
      city: 'Lekki',
      state: 'Lagos',
      zipCode: '100001',
      country: 'Nigeria',
      latitude: 6.4281,
      longitude: 3.4219
    },
    pricing: {
      price: 1500000,
      currency: 'NGN',
      paymentFrequency: 'monthly',
      negotiable: true
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      squareFootage: 1500,
      furnished: true,
      petsAllowed: false,
      yearBuilt: 2018,
      amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Backup Power']
    },
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        isPrimary: false,
        order: 1,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-12-01'),
      minimumStay: 12,
      maximumStay: 24
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: true,
      additionalRules: ['No loud music after 10 PM', 'No subletting']
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.VERIFIED,
    featured: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: 'prop-2',
    title: '2 Bedroom Flat in Ikeja GRA',
    description: 'Spacious 2 bedroom flat in a serene environment with 24/7 power supply.',
    propertyType: PropertyType.APARTMENT,
    listingType: ListingType.RENT,
    location: {
      address: '45 Isaac John Street',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100281',
      country: 'Nigeria',
      latitude: 6.5744,
      longitude: 3.3548
    },
    pricing: {
      price: 1200000,
      currency: 'NGN',
      paymentFrequency: 'monthly',
      negotiable: false
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      furnished: false,
      petsAllowed: true,
      yearBuilt: 2015,
      amenities: ['24/7 Security', 'Parking', 'Backup Power']
    },
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-12-15'),
      minimumStay: 6,
      maximumStay: undefined
    },
    rules: {
      smoking: false,
      pets: true,
      parties: false,
      children: true,
      additionalRules: []
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.PENDING,
    featured: false,
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10')
  },
  {
    id: 'prop-3',
    title: '4 Bedroom Duplex in Ikoyi',
    description: 'Luxurious 4 bedroom duplex with swimming pool and garden in a prime location.',
    propertyType: PropertyType.HOUSE,
    listingType: ListingType.SALE,
    location: {
      address: '10 Bourdillon Road',
      city: 'Ikoyi',
      state: 'Lagos',
      zipCode: '101233',
      country: 'Nigeria',
      latitude: 6.4500,
      longitude: 3.4333
    },
    pricing: {
      price: 250000000,
      currency: 'NGN',
      negotiable: true
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      squareFootage: 3500,
      furnished: true,
      petsAllowed: true,
      yearBuilt: 2020,
      amenities: ['Swimming Pool', 'Garden', 'Gym', '24/7 Security', 'Parking', 'Backup Power']
    },
    images: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      },
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        isPrimary: false,
        order: 1,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-11-30')
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: true,
      additionalRules: []
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.VERIFIED,
    featured: true,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05')
  },
  {
    id: 'prop-4',
    title: 'Studio Apartment in Yaba',
    description: 'Cozy studio apartment perfect for students or young professionals.',
    propertyType: PropertyType.APARTMENT,
    listingType: ListingType.RENT,
    location: {
      address: '7 Herbert Macaulay Way',
      city: 'Yaba',
      state: 'Lagos',
      zipCode: '101212',
      country: 'Nigeria',
      latitude: 6.5143,
      longitude: 3.3842
    },
    pricing: {
      price: 600000,
      currency: 'NGN',
      paymentFrequency: 'monthly',
      negotiable: true
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      squareFootage: 450,
      furnished: true,
      petsAllowed: false,
      yearBuilt: 2017,
      amenities: ['24/7 Security', 'Backup Power', 'Internet']
    },
    images: [
      {
        id: 'img-6',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-12-01'),
      minimumStay: 6,
      maximumStay: 12
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: false,
      additionalRules: ['No overnight guests']
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.VERIFIED,
    featured: false,
    createdAt: new Date('2023-11-12'),
    updatedAt: new Date('2023-11-12')
  },
  {
    id: 'prop-5',
    title: 'Commercial Space in Victoria Island',
    description: 'Prime commercial space suitable for office or retail in the heart of Victoria Island.',
    propertyType: PropertyType.COMMERCIAL,
    listingType: ListingType.RENT,
    location: {
      address: '1420 Adeola Hopewell Street',
      city: 'Victoria Island',
      state: 'Lagos',
      zipCode: '101241',
      country: 'Nigeria',
      latitude: 6.4281,
      longitude: 3.4219
    },
    pricing: {
      price: 5000000,
      currency: 'NGN',
      paymentFrequency: 'annually',
      negotiable: true
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      squareFootage: 2000,
      furnished: false,
      petsAllowed: false,
      yearBuilt: 2010,
      amenities: ['24/7 Security', 'Parking', 'Backup Power', 'Elevator']
    },
    images: [
      {
        id: 'img-7',
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-12-01')
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: true,
      additionalRules: []
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.VERIFIED,
    featured: true,
    createdAt: new Date('2023-11-08'),
    updatedAt: new Date('2023-11-08')
  },
  {
    id: 'prop-6',
    title: 'Land for Sale in Ajah',
    description: '500 sqm land with C of O in a developing area with good road access.',
    propertyType: PropertyType.LAND,
    listingType: ListingType.SALE,
    location: {
      address: 'Okun-Ajah Road',
      city: 'Ajah',
      state: 'Lagos',
      zipCode: '100001',
      country: 'Nigeria',
      latitude: 6.4698,
      longitude: 3.5852
    },
    pricing: {
      price: 25000000,
      currency: 'NGN',
      negotiable: true
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 500,
      furnished: false,
      petsAllowed: false,
      yearBuilt: undefined,
      amenities: []
    },
    images: [
      {
        id: 'img-8',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        isPrimary: true,
        order: 0,
        uploadedAt: new Date()
      }
    ],
    availability: {
      availableFrom: new Date('2023-11-01')
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: true,
      additionalRules: []
    },
    ownerId: 'user-1',
    status: PropertyStatus.ACTIVE,
    verificationStatus: PropertyVerificationStatus.PENDING,
    featured: false,
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01')
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    propertyId: 'prop-1',
    property: mockProperties[0],
    hostId: 'user-1',
    attendeeId: 'user-2',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    type: AppointmentType.VIEWING,
    status: AppointmentStatus.CONFIRMED,
    notes: 'Looking forward to seeing the property',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'appt-2',
    propertyId: 'prop-3',
    property: mockProperties[2],
    hostId: 'user-1',
    attendeeId: 'user-2',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    type: AppointmentType.VIEWING,
    status: AppointmentStatus.PENDING,
    notes: 'Interested in this property for my family',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'appt-3',
    propertyId: 'prop-2',
    property: mockProperties[1],
    hostId: 'user-1',
    attendeeId: 'user-2',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    type: AppointmentType.VIEWING,
    status: AppointmentStatus.COMPLETED,
    notes: 'Liked the property but need to think about it',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Hello, I am interested in your 3 bedroom apartment in Lekki. Is it still available?',
    type: 'text',
    readBy: {
      'user-1': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Yes, it is still available. Would you like to schedule a viewing?',
    type: 'text',
    readBy: {
      'user-2': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'That would be great. I am available this weekend.',
    type: 'text',
    readBy: {
      'user-1': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Perfect. How about Saturday at 10 AM?',
    type: 'text',
    readBy: {
      'user-2': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Saturday at 10 AM works for me. See you then!',
    type: 'text',
    readBy: {
      'user-1': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    property: mockProperties[0],
    participants: ['user-1', 'user-2'],
    lastMessage: mockMessages[4],
    unreadCount: {
      'user-1': 0,
      'user-2': 0
    },
    status: ConversationStatus.ACTIVE,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
  },
  {
    id: 'conv-2',
    propertyId: 'prop-3',
    property: mockProperties[2],
    participants: ['user-1', 'user-2'],
    lastMessage: {
      id: 'msg-6',
      conversationId: 'conv-2',
      senderId: 'user-2',
      content: 'I am interested in your 4 bedroom duplex in Ikoyi. What is the best price you can offer?',
      type: 'text',
      readBy: {},
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    unreadCount: {
      'user-1': 1,
      'user-2': 0
    },
    status: ConversationStatus.ACTIVE,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Mock Subscriptions
export const mockSubscriptions = [
  {
    id: 'sub-1',
    userId: 'user-1',
    plan: SubscriptionTier.PROFESSIONAL,
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    paymentMethod: {
      type: 'card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    },
    features: [
      'Featured listings',
      'Priority support',
      'Advanced analytics',
      'Unlimited listings',
      'Virtual tours'
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
];

// Mock Favorites
export const mockFavorites = [
  {
    id: 'fav-1',
    userId: 'user-2',
    propertyId: 'prop-1',
    property: mockProperties[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'fav-2',
    userId: 'user-2',
    propertyId: 'prop-3',
    property: mockProperties[2],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
];

// Mock Recently Viewed
export const mockRecentlyViewed = [
  {
    id: 'view-1',
    userId: 'user-2',
    propertyId: 'prop-1',
    property: mockProperties[0],
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'view-2',
    userId: 'user-2',
    propertyId: 'prop-3',
    property: mockProperties[2],
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'view-3',
    userId: 'user-2',
    propertyId: 'prop-2',
    property: mockProperties[1],
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
];

// Mock Verification Data
export const mockVerificationData = [
  {
    userId: 'user-1',
    identityVerified: true,
    addressVerified: true,
    phoneVerified: true,
    emailVerified: true,
    documentsVerified: true,
    verificationScore: 95,
    verificationBadges: ['identity', 'address', 'phone', 'email', 'documents'],
    verificationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
    userRating: 4.8,
    reviewCount: 15,
    responseRate: 98,
    responseTime: 'within 1 hour'
  },
  {
    userId: 'user-2',
    identityVerified: true,
    addressVerified: true,
    phoneVerified: true,
    emailVerified: true,
    documentsVerified: false,
    verificationScore: 85,
    verificationBadges: ['identity', 'address', 'phone', 'email'],
    verificationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
    userRating: 4.5,
    reviewCount: 3,
    responseRate: 100,
    responseTime: 'within 3 hours'
  }
];

// Mock Data Service
export const mockDataService = {
  getUsers: () => mockUsers,
  getUser: (id: string) => mockUsers.find(user => user.id === id),
  getProperties: () => mockProperties,
  getProperty: (id: string) => mockProperties.find(prop => prop.id === id),
  getFeaturedProperties: () => mockProperties.filter(prop => prop.featured),
  getAppointments: (userId: string) => mockAppointments.filter(
    appt => appt.attendeeId === userId || appt.hostId === userId
  ),
  getMessages: (conversationId: string) => mockMessages.filter(
    msg => msg.conversationId === conversationId
  ),
  getConversations: (userId: string) => mockConversations.filter(
    conv => conv.participants.includes(userId)
  ),
  getSubscription: (userId: string) => mockSubscriptions.find(
    sub => sub.userId === userId
  ),
  getFavorites: (userId: string) => mockFavorites.filter(
    fav => fav.userId === userId
  ),
  getRecentlyViewed: (userId: string) => mockRecentlyViewed.filter(
    view => view.userId === userId
  ),
  getVerificationData: (userId: string) => mockVerificationData.find(
    data => data.userId === userId
  )
};