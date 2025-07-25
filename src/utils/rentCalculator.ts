import {
  AdditionalCost,
  MarketComparisonInput,
  MarketComparisonResult,
  PropertyComparisonItem,
  PropertyComparisonResult,
  PropertyCostInput,
  PropertyCostResult,
  RentAffordabilityInput,
  RentAffordabilityResult,
  RentPaymentFrequency
} from '../types/rentCalculator';

/**
 * Calculate rent affordability based on income and expenses
 * @param input RentAffordabilityInput
 * @returns RentAffordabilityResult
 */
export const calculateRentAffordability = (input: RentAffordabilityInput): RentAffordabilityResult => {
  const {
    monthlyIncome,
    otherMonthlyExpenses,
    desiredSavingsRate = 20, // Default to 20% savings rate
    dependents = 0,
    additionalIncomeSource = 0
  } = input;

  // Calculate total income
  const totalIncome = monthlyIncome + additionalIncomeSource;

  // Calculate expenses excluding rent
  const totalExpenses = otherMonthlyExpenses;

  // Calculate savings budget
  const savingsBudget = (totalIncome * desiredSavingsRate) / 100;

  // Calculate disposable income after expenses and savings
  const disposableIncome = totalIncome - totalExpenses - savingsBudget;

  // Calculate maximum affordable rent (30% of total income)
  const maxAffordableRent = totalIncome * 0.3;

  // Calculate recommended rent based on disposable income and dependents
  // Adjust for dependents: reduce recommended rent by 5% per dependent
  const dependentAdjustment = 1 - (dependents * 0.05);
  const recommendedRent = Math.min(disposableIncome * 0.7 * dependentAdjustment, maxAffordableRent);

  // Calculate rent-to-income ratio
  const rentToIncomeRatio = recommendedRent / totalIncome;

  // Determine if the rent is affordable
  const isAffordable = rentToIncomeRatio <= 0.3;

  // Calculate affordability score (0-100)
  // Score is 100 when rent is 15% of income, 0 when rent is 50% of income
  const affordabilityScore = Math.max(0, Math.min(100, 100 - ((rentToIncomeRatio - 0.15) / 0.35) * 100));

  // Calculate savings impact
  const savingsImpact = savingsBudget - (recommendedRent > disposableIncome ? recommendedRent - disposableIncome : 0);

  return {
    maxAffordableRent,
    recommendedRent,
    rentToIncomeRatio,
    isAffordable,
    affordabilityScore,
    savingsImpact,
    disposableIncome,
    affordabilityBreakdown: {
      totalIncome,
      totalExpenses,
      rentBudget: recommendedRent,
      savingsBudget,
      otherExpenses: totalExpenses
    }
  };
};

/**
 * Convert rent amount from one frequency to another
 * @param amount The rent amount
 * @param fromFrequency The current frequency
 * @param toFrequency The target frequency
 * @returns The converted amount
 */
export const convertRentFrequency = (
  amount: number,
  fromFrequency: RentPaymentFrequency,
  toFrequency: RentPaymentFrequency
): number => {
  // Convert to monthly first
  let monthlyAmount: number;

  switch (fromFrequency) {
    case RentPaymentFrequency.MONTHLY:
      monthlyAmount = amount;
      break;
    case RentPaymentFrequency.QUARTERLY:
      monthlyAmount = amount / 3;
      break;
    case RentPaymentFrequency.BIANNUALLY:
      monthlyAmount = amount / 6;
      break;
    case RentPaymentFrequency.ANNUALLY:
      monthlyAmount = amount / 12;
      break;
    default:
      monthlyAmount = amount;
  }

  // Convert from monthly to target frequency
  switch (toFrequency) {
    case RentPaymentFrequency.MONTHLY:
      return monthlyAmount;
    case RentPaymentFrequency.QUARTERLY:
      return monthlyAmount * 3;
    case RentPaymentFrequency.BIANNUALLY:
      return monthlyAmount * 6;
    case RentPaymentFrequency.ANNUALLY:
      return monthlyAmount * 12;
    default:
      return monthlyAmount;
  }
};

/**
 * Calculate the total cost of a property including additional costs
 * @param input PropertyCostInput
 * @returns PropertyCostResult
 */
export const calculatePropertyCost = (input: PropertyCostInput): PropertyCostResult => {
  const {
    baseRent,
    paymentFrequency,
    securityDeposit = 0,
    additionalCosts = [],
    leaseTermMonths = 12,
    includesUtilities = false,
    includesInternet = false
  } = input;

  // Convert base rent to monthly and annual
  const monthlyRent = convertRentFrequency(baseRent, paymentFrequency, RentPaymentFrequency.MONTHLY);
  const annualRent = monthlyRent * 12;

  // Calculate upfront costs
  let upfrontCosts = securityDeposit;

  // Calculate additional costs
  const additionalCostsBreakdown: Record<string, { monthly: number; annual: number; upfront: number }> = {};
  let totalMonthlyAdditionalCosts = 0;

  // Add standard utilities if not included
  if (!includesUtilities) {
    const utilitiesCost = {
      name: 'Utilities',
      amount: 20000, // ₦20,000
      frequency: RentPaymentFrequency.MONTHLY,
      isOptional: false,
      description: 'Estimated cost for electricity, water, and waste management'
    };
    additionalCosts.push(utilitiesCost);
  }

  // Add internet if not included
  if (!includesInternet) {
    const internetCost = {
      name: 'Internet',
      amount: 15000, // ₦15,000
      frequency: RentPaymentFrequency.MONTHLY,
      isOptional: false,
      description: 'Estimated cost for internet service'
    };
    additionalCosts.push(internetCost);
  }

  // Process all additional costs
  additionalCosts.forEach(cost => {
    const monthlyCost = convertRentFrequency(cost.amount, cost.frequency, RentPaymentFrequency.MONTHLY);
    const annualCost = monthlyCost * 12;
    
    // Some costs might be paid upfront (e.g., service charge for the year)
    let upfrontCost = 0;
    if (cost.frequency === RentPaymentFrequency.ANNUALLY) {
      upfrontCost = cost.amount;
    } else if (cost.frequency === RentPaymentFrequency.BIANNUALLY) {
      upfrontCost = cost.amount;
    }

    additionalCostsBreakdown[cost.name] = {
      monthly: monthlyCost,
      annual: annualCost,
      upfront: upfrontCost
    };

    totalMonthlyAdditionalCosts += monthlyCost;
    upfrontCosts += upfrontCost;
  });

  // Calculate total monthly and annual payments
  const totalMonthlyPayment = monthlyRent + totalMonthlyAdditionalCosts;
  const totalAnnualPayment = totalMonthlyPayment * 12;

  // Calculate effective monthly rate (including amortized upfront costs)
  const amortizedUpfrontCosts = upfrontCosts / leaseTermMonths;
  const effectiveMonthlyRate = monthlyRent + amortizedUpfrontCosts;

  return {
    monthlyRent,
    annualRent,
    upfrontCosts,
    totalMonthlyPayment,
    totalAnnualPayment,
    effectiveMonthlyRate,
    breakdown: {
      baseRent,
      securityDeposit,
      additionalCosts: additionalCostsBreakdown
    }
  };
};

/**
 * Calculate market comparison data for a property
 * @param input MarketComparisonInput
 * @returns MarketComparisonResult
 */
export const calculateMarketComparison = (input: MarketComparisonInput): MarketComparisonResult => {
  const { propertyType, bedrooms, location, size } = input;

  // In a real app, this would fetch data from an API or database
  // For now, we'll use mock data based on the input parameters

  // Mock market data based on location and property type
  const marketData = getMockMarketData(location, propertyType, bedrooms);

  // Calculate where this property falls in the market
  const percentile = calculatePercentile(marketData.rents, marketData.averageRent);

  // Calculate price per square meter if size is provided
  const pricePerSquareMeter = size ? marketData.averageRent / size : 0;

  return {
    averageRent: marketData.averageRent,
    medianRent: marketData.medianRent,
    rentRange: {
      min: marketData.minRent,
      max: marketData.maxRent
    },
    percentile,
    similarProperties: {
      count: marketData.count,
      averageRent: marketData.averageRent
    },
    pricePerSquareMeter,
    marketTrend: marketData.trend
  };
};

/**
 * Compare multiple properties to find the best value
 * @param properties Array of PropertyComparisonItem
 * @returns PropertyComparisonResult
 */
export const compareProperties = (properties: PropertyComparisonItem[]): PropertyComparisonResult => {
  if (properties.length === 0) {
    throw new Error('No properties provided for comparison');
  }

  // Calculate rent per square meter for each property
  const rentPerSquareMeter: Record<string, number> = {};
  properties.forEach(property => {
    if (property.size) {
      rentPerSquareMeter[property.propertyId] = property.totalMonthlyPayment / property.size;
    } else {
      rentPerSquareMeter[property.propertyId] = property.totalMonthlyPayment;
    }
  });

  // Calculate total amenities for each property
  const totalAmenities: Record<string, number> = {};
  properties.forEach(property => {
    totalAmenities[property.propertyId] = property.amenities.length;
  });

  // Assign location scores (in a real app, this would be based on data)
  const locationScore: Record<string, number> = {};
  properties.forEach(property => {
    // Mock location scores based on location names
    if (property.location.includes('Lekki') || property.location.includes('Victoria Island')) {
      locationScore[property.propertyId] = 90;
    } else if (property.location.includes('Ikeja') || property.location.includes('Ikoyi')) {
      locationScore[property.propertyId] = 80;
    } else if (property.location.includes('Yaba') || property.location.includes('Surulere')) {
      locationScore[property.propertyId] = 70;
    } else {
      locationScore[property.propertyId] = 60;
    }
  });

  // Calculate value score for each property
  const valueScore: Record<string, number> = {};
  properties.forEach(property => {
    // Value score is based on:
    // - Lower rent per square meter (40%)
    // - More amenities (30%)
    // - Better location (30%)
    
    // Normalize rent per square meter (lower is better)
    const maxRentPerSqm = Math.max(...Object.values(rentPerSquareMeter));
    const normalizedRentScore = 100 - ((rentPerSquareMeter[property.propertyId] / maxRentPerSqm) * 100);
    
    // Normalize amenities (higher is better)
    const maxAmenities = Math.max(...Object.values(totalAmenities));
    const normalizedAmenitiesScore = maxAmenities > 0 
      ? (totalAmenities[property.propertyId] / maxAmenities) * 100 
      : 0;
    
    // Location score is already normalized
    
    // Calculate weighted score
    valueScore[property.propertyId] = (
      (normalizedRentScore * 0.4) +
      (normalizedAmenitiesScore * 0.3) +
      (locationScore[property.propertyId] * 0.3)
    );
  });

  // Find the best value property
  const bestValue = Object.entries(valueScore)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Find the lowest total cost property
  const lowestTotalCost = properties
    .sort((a, b) => a.totalMonthlyPayment - b.totalMonthlyPayment)[0]
    .propertyId;

  return {
    properties,
    bestValue,
    lowestTotalCost,
    comparisonFactors: {
      rentPerSquareMeter,
      totalAmenities,
      locationScore,
      valueScore
    }
  };
};

/**
 * Helper function to get mock market data
 * @param location Location name
 * @param propertyType Property type
 * @param bedrooms Number of bedrooms
 * @returns Mock market data
 */
function getMockMarketData(location: string, propertyType: string, bedrooms: number) {
  // Base rent values for different locations
  const locationMultiplier: Record<string, number> = {
    'Lekki': 1.5,
    'Victoria Island': 1.8,
    'Ikoyi': 2.0,
    'Ikeja': 1.2,
    'Yaba': 1.0,
    'Surulere': 0.9,
    'Ajah': 0.8,
    'Gbagada': 0.85,
    'Magodo': 1.1,
    'Maryland': 1.0
  };

  // Base rent values for different property types
  const propertyTypeMultiplier: Record<string, number> = {
    'Apartment': 1.0,
    'House': 1.3,
    'Duplex': 1.5,
    'Bungalow': 1.2,
    'Studio': 0.7,
    'Penthouse': 2.0,
    'Townhouse': 1.4
  };

  // Base rent values for different bedroom counts
  const bedroomMultiplier: Record<number, number> = {
    0: 0.6, // Studio
    1: 0.8,
    2: 1.0,
    3: 1.3,
    4: 1.6,
    5: 2.0
  };

  // Get multipliers
  const locMult = locationMultiplier[location] || 1.0;
  const propMult = propertyTypeMultiplier[propertyType] || 1.0;
  const bedMult = bedroomMultiplier[bedrooms] || 1.0;

  // Base monthly rent in Naira
  const baseRent = 150000; // ₦150,000

  // Calculate average rent
  const averageRent = baseRent * locMult * propMult * bedMult;

  // Generate a range of rents around the average
  const minRent = averageRent * 0.8;
  const maxRent = averageRent * 1.2;
  const medianRent = averageRent * 0.95;

  // Generate mock rents for similar properties
  const rents = Array.from({ length: 10 }, (_, i) => {
    const variance = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    return averageRent * variance;
  });

  // Determine market trend
  let trend: 'rising' | 'stable' | 'falling';
  if (location === 'Lekki' || location === 'Victoria Island' || location === 'Ikoyi') {
    trend = 'rising';
  } else if (location === 'Ikeja' || location === 'Yaba') {
    trend = 'stable';
  } else {
    trend = 'falling';
  }

  return {
    averageRent,
    medianRent,
    minRent,
    maxRent,
    count: rents.length,
    rents,
    trend
  };
}

/**
 * Helper function to calculate percentile
 * @param values Array of values
 * @param value Value to find percentile for
 * @returns Percentile (0-100)
 */
function calculatePercentile(values: number[], value: number): number {
  const sortedValues = [...values].sort((a, b) => a - b);
  const index = sortedValues.findIndex(v => v >= value);
  
  if (index === -1) {
    return 100; // Value is higher than all values in the array
  }
  
  return (index / sortedValues.length) * 100;
}