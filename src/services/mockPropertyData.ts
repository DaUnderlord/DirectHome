import {
  Property,
  PropertyType,
  ListingType,
  PropertyStatus,
  PropertyVerificationStatus
} from '../types/property';

// Real house images from Unsplash for realistic property listings
const houseImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop',
];

/**
 * Generate a collection of mock properties for development and testing
 * @param count Number of properties to generate
 * @returns Array of mock properties
 */
export const generateMockProperties = (count: number = 10): Property[] => {
  const properties: Property[] = [];

  const propertyTypes = Object.values(PropertyType);
  const listingTypes = Object.values(ListingType);
  const statuses = [PropertyStatus.ACTIVE, PropertyStatus.PENDING];
  const verificationStatuses = [
    PropertyVerificationStatus.VERIFIED,
    PropertyVerificationStatus.UNVERIFIED,
    PropertyVerificationStatus.PENDING
  ];

  const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];
  const states = ['Lagos', 'FCT', 'Rivers', 'Oyo', 'Kano', 'Enugu'];

  const amenities = [
    'Swimming Pool',
    'Gym',
    'Security',
    'Parking',
    'Backup Power',
    'Air Conditioning',
    'Furnished',
    'Internet',
    'Cable TV',
    'Balcony'
  ];

  for (let i = 0; i < count; i++) {
    const id = `prop-${i + 1}`;
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const listingType = listingTypes[Math.floor(Math.random() * listingTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const verificationStatus = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)];

    const cityIndex = Math.floor(Math.random() * cities.length);
    const city = cities[cityIndex];
    const state = states[cityIndex];

    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = Math.floor(Math.random() * 4) + 1;
    const squareFootage = Math.floor(Math.random() * 2000) + 500;

    // Generate random price based on property type and listing type
    let basePrice = 0;
    if (propertyType === PropertyType.HOUSE) {
      basePrice = 150000;
    } else if (propertyType === PropertyType.APARTMENT) {
      basePrice = 100000;
    } else if (propertyType === PropertyType.CONDO) {
      basePrice = 120000;
    } else if (propertyType === PropertyType.TOWNHOUSE) {
      basePrice = 130000;
    } else {
      basePrice = 80000;
    }

    // Adjust price based on listing type
    const price = listingType === ListingType.SALE
      ? basePrice + Math.floor(Math.random() * 100000)
      : Math.floor(basePrice / 200) + Math.floor(Math.random() * 1000);

    // Select random amenities
    const propertyAmenities: string[] = [];
    const amenityCount = Math.floor(Math.random() * 6) + 2;
    for (let j = 0; j < amenityCount; j++) {
      const amenity = amenities[Math.floor(Math.random() * amenities.length)];
      if (!propertyAmenities.includes(amenity)) {
        propertyAmenities.push(amenity);
      }
    }

    // Create property
    const property: Property = {
      id,
      title: `${bedrooms} Bedroom ${propertyType} in ${city}`,
      description: `Beautiful ${bedrooms} bedroom ${propertyType} located in a serene environment in ${city}. Features include ${bathrooms} bathrooms, ${propertyAmenities.join(', ')}, and more.`,
      ownerId: `user-${Math.floor(Math.random() * 10) + 1}`,
      propertyType,
      listingType,
      status,
      verificationStatus,
      location: {
        address: `${Math.floor(Math.random() * 100) + 1} Sample Street`,
        city,
        state,
        zipCode: `${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}`,
        country: 'Nigeria',
        latitude: 6.5244 + (Math.random() * 0.1),
        longitude: 3.3792 + (Math.random() * 0.1),
      },
      features: {
        bedrooms,
        bathrooms,
        squareFootage,
        yearBuilt: 2000 + Math.floor(Math.random() * 23),
        furnished: Math.random() > 0.5,
        petsAllowed: Math.random() > 0.7,
        amenities: propertyAmenities,
      },
      images: [
        {
          id: `img-${id}-1`,
          url: houseImages[(i * 3) % houseImages.length],
          thumbnailUrl: houseImages[(i * 3) % houseImages.length],
          isPrimary: true,
          order: 1,
          uploadedAt: new Date(),
        },
        {
          id: `img-${id}-2`,
          url: houseImages[(i * 3 + 1) % houseImages.length],
          thumbnailUrl: houseImages[(i * 3 + 1) % houseImages.length],
          isPrimary: false,
          order: 2,
          uploadedAt: new Date(),
        },
        {
          id: `img-${id}-3`,
          url: houseImages[(i * 3 + 2) % houseImages.length],
          thumbnailUrl: houseImages[(i * 3 + 2) % houseImages.length],
          isPrimary: false,
          order: 3,
          uploadedAt: new Date(),
        },
      ],
      pricing: {
        price,
        currency: 'NGN',
        paymentFrequency: listingType === ListingType.RENT ? 'monthly' : 'one-time',
        securityDeposit: listingType === ListingType.RENT ? price : undefined,
        negotiable: Math.random() > 0.3,
      },
      availability: {
        availableFrom: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        minimumStay: listingType === ListingType.RENT ? Math.floor(Math.random() * 12) + 1 : undefined,
      },
      rules: {
        smoking: Math.random() > 0.7,
        pets: Math.random() > 0.5,
        parties: Math.random() > 0.8,
        children: true,
        additionalRules: [],
      },
      analytics: {
        viewCount: Math.floor(Math.random() * 1000),
        favoriteCount: Math.floor(Math.random() * 100),
        inquiryCount: Math.floor(Math.random() * 50),
      },
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    properties.push(property);
  }

  return properties;
};

/**
 * Mock property data service
 */
export const mockPropertyService = {
  /**
   * Get all properties with optional filtering
   */
  getProperties: async (filters?: any) => {
    // Generate mock properties
    let properties = generateMockProperties(20);

    // Apply filters if provided
    if (filters) {
      if (filters.propertyType) {
        properties = properties.filter(p =>
          Array.isArray(filters.propertyType)
            ? filters.propertyType.includes(p.propertyType)
            : p.propertyType === filters.propertyType
        );
      }

      if (filters.listingType) {
        properties = properties.filter(p => p.listingType === filters.listingType);
      }

      if (filters.minPrice) {
        properties = properties.filter(p => p.pricing.price >= filters.minPrice);
      }

      if (filters.maxPrice) {
        properties = properties.filter(p => p.pricing.price <= filters.maxPrice);
      }

      if (filters.minBedrooms) {
        properties = properties.filter(p => p.features.bedrooms >= filters.minBedrooms);
      }

      if (filters.city) {
        properties = properties.filter(p =>
          p.location.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      if (filters.featured) {
        properties = properties.filter(p => p.featured);
      }

      // Sort properties
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            properties.sort((a, b) => a.pricing.price - b.pricing.price);
            break;
          case 'price_desc':
            properties.sort((a, b) => b.pricing.price - a.pricing.price);
            break;
          case 'date_newest':
            properties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case 'date_oldest':
            properties.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            break;
        }
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProperties = properties.slice(startIndex, endIndex);

      return {
        properties: paginatedProperties,
        success: true,
        pagination: {
          total: properties.length,
          page,
          limit,
          totalPages: Math.ceil(properties.length / limit),
        },
      };
    }

    return {
      properties,
      success: true,
    };
  },

  /**
   * Get a single property by ID
   */
  getProperty: async (id: string) => {
    const properties = generateMockProperties(20);
    const property = properties.find(p => p.id === id) || properties[0];

    return {
      property,
      success: true,
    };
  },

  /**
   * Get featured properties
   */
  getFeaturedProperties: async () => {
    const properties = generateMockProperties(20).filter(p => p.featured);

    return {
      properties,
      success: true,
    };
  },

  /**
   * Get similar properties
   */
  getSimilarProperties: async (id: string, limit: number = 4) => {
    const properties = generateMockProperties(limit);

    return {
      properties,
      success: true,
    };
  },
};