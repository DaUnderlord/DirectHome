// Construction Cost Estimator Types for Nigeria

export interface ConstructionMaterial {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: MaterialCategory;
  description?: string;
}

export enum MaterialCategory {
  FOUNDATION = 'foundation',
  STRUCTURE = 'structure',
  ROOFING = 'roofing',
  WALLS = 'walls',
  FLOORING = 'flooring',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  DOORS_WINDOWS = 'doors_windows',
  FINISHING = 'finishing',
  PAINTING = 'painting',
  FIXTURES = 'fixtures'
}

export enum BuildingType {
  BUNGALOW = 'bungalow',
  DUPLEX = 'duplex',
  STOREY_BUILDING = 'storey_building',
  APARTMENT_BLOCK = 'apartment_block',
  COMMERCIAL = 'commercial'
}

export enum FinishingQuality {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  LUXURY = 'luxury'
}

export enum LocationTier {
  TIER_1 = 'tier_1', // Lagos, Abuja
  TIER_2 = 'tier_2', // Port Harcourt, Ibadan, Kano
  TIER_3 = 'tier_3', // Other cities
  RURAL = 'rural'
}

export interface ConstructionSpecs {
  buildingType: BuildingType;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfFloors: number;
  totalSquareMeters: number;
  finishingQuality: FinishingQuality;
  location: {
    state: string;
    city: string;
    tier: LocationTier;
  };
  features: {
    hasSwimmingPool: boolean;
    hasBQ: boolean; // Boys Quarters
    hasGarage: boolean;
    numberOfParkingSpaces: number;
    hasFence: boolean;
    hasGate: boolean;
    hasGenerator: boolean;
    hasSolarPanels: boolean;
    hasWaterTreatment: boolean;
    hasElevator: boolean;
  };
  utilities: {
    plumbingComplexity: 'basic' | 'standard' | 'advanced';
    electricalComplexity: 'basic' | 'standard' | 'advanced';
    hvacSystem: boolean;
    smartHomeFeatures: boolean;
  };
}

export interface CostBreakdown {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  percentage: number;
}

export interface LaborCost {
  category: string;
  description: string;
  estimatedDays: number;
  costPerDay: number;
  totalCost: number;
}

export interface ConstructionEstimate {
  specs: ConstructionSpecs;
  materialCosts: CostBreakdown[];
  laborCosts: LaborCost[];
  professionalFees: {
    architect: number;
    engineer: number;
    surveyor: number;
    projectManager: number;
    total: number;
  };
  permits: {
    buildingPermit: number;
    environmentalApproval: number;
    utilityConnections: number;
    total: number;
  };
  contingency: number;
  subtotal: number;
  vat: number;
  grandTotal: number;
  costPerSquareMeter: number;
  estimatedDuration: {
    months: number;
    description: string;
  };
  breakdown: {
    materials: number;
    labor: number;
    professional: number;
    permits: number;
    contingency: number;
  };
}

export interface MaterialPriceDatabase {
  [key: string]: {
    name: string;
    unit: string;
    prices: {
      [key in LocationTier]: number;
    };
    category: MaterialCategory;
  };
}
