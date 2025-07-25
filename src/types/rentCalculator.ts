/**
 * Enum for rent payment frequency
 */
export enum RentPaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUALLY = 'biannually',
  ANNUALLY = 'annually'
}

/**
 * Interface for additional costs
 */
export interface AdditionalCost {
  name: string;
  amount: number;
  frequency: RentPaymentFrequency;
  isOptional: boolean;
  description?: string;
}

/**
 * Interface for rent affordability input
 */
export interface RentAffordabilityInput {
  monthlyIncome: number;
  otherMonthlyExpenses: number;
  desiredSavingsRate?: number; // Percentage of income to save
  dependents?: number;
  additionalIncomeSource?: number;
}

/**
 * Interface for rent affordability result
 */
export interface RentAffordabilityResult {
  maxAffordableRent: number;
  recommendedRent: number;
  rentToIncomeRatio: number;
  isAffordable: boolean;
  affordabilityScore: number; // 0-100 score
  savingsImpact: number;
  disposableIncome: number;
  affordabilityBreakdown: {
    totalIncome: number;
    totalExpenses: number;
    rentBudget: number;
    savingsBudget: number;
    otherExpenses: number;
  };
}

/**
 * Interface for property cost calculation input
 */
export interface PropertyCostInput {
  baseRent: number;
  paymentFrequency: RentPaymentFrequency;
  securityDeposit?: number;
  additionalCosts?: AdditionalCost[];
  leaseTermMonths?: number;
  includesUtilities?: boolean;
  includesInternet?: boolean;
}

/**
 * Interface for property cost calculation result
 */
export interface PropertyCostResult {
  monthlyRent: number;
  annualRent: number;
  upfrontCosts: number;
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
  effectiveMonthlyRate: number;
  breakdown: {
    baseRent: number;
    securityDeposit: number;
    additionalCosts: {
      [key: string]: {
        monthly: number;
        annual: number;
        upfront: number;
      };
    };
  };
}

/**
 * Interface for market comparison input
 */
export interface MarketComparisonInput {
  propertyType: string;
  bedrooms: number;
  location: string;
  size?: number; // in square meters
}

/**
 * Interface for market comparison result
 */
export interface MarketComparisonResult {
  averageRent: number;
  medianRent: number;
  rentRange: {
    min: number;
    max: number;
  };
  percentile: number; // where the current property falls in the market
  similarProperties: {
    count: number;
    averageRent: number;
  };
  pricePerSquareMeter: number;
  marketTrend: 'rising' | 'stable' | 'falling';
}

/**
 * Interface for property comparison item
 */
export interface PropertyComparisonItem {
  propertyId: string;
  title: string;
  baseRent: number;
  paymentFrequency: RentPaymentFrequency;
  additionalCosts: AdditionalCost[];
  totalMonthlyPayment: number;
  totalAnnualPayment: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size?: number; // in square meters
  amenities: string[];
}

/**
 * Interface for property comparison result
 */
export interface PropertyComparisonResult {
  properties: PropertyComparisonItem[];
  bestValue: string; // propertyId of the best value property
  lowestTotalCost: string; // propertyId of the lowest total cost property
  comparisonFactors: {
    rentPerSquareMeter: Record<string, number>;
    totalAmenities: Record<string, number>;
    locationScore: Record<string, number>;
    valueScore: Record<string, number>;
  };
}