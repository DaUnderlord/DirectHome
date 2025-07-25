import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
import {
  calculateMarketComparison,
  calculatePropertyCost,
  calculateRentAffordability,
  compareProperties
} from '../utils/rentCalculator';

interface RentCalculatorState {
  // Affordability
  affordabilityInput: RentAffordabilityInput;
  affordabilityResult: RentAffordabilityResult | null;
  
  // Property Cost
  propertyCostInput: PropertyCostInput;
  propertyCostResult: PropertyCostResult | null;
  
  // Market Comparison
  marketComparisonInput: MarketComparisonInput;
  marketComparisonResult: MarketComparisonResult | null;
  
  // Property Comparison
  comparisonProperties: PropertyComparisonItem[];
  propertyComparisonResult: PropertyComparisonResult | null;
  
  // Common
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAffordabilityInput: (input: Partial<RentAffordabilityInput>) => void;
  calculateAffordability: () => void;
  
  setPropertyCostInput: (input: Partial<PropertyCostInput>) => void;
  calculatePropertyCost: () => void;
  
  setMarketComparisonInput: (input: Partial<MarketComparisonInput>) => void;
  calculateMarketComparison: () => void;
  
  addComparisonProperty: (property: PropertyComparisonItem) => void;
  removeComparisonProperty: (propertyId: string) => void;
  clearComparisonProperties: () => void;
  calculatePropertyComparison: () => void;
  
  resetCalculator: () => void;
}

// Default values
const defaultAffordabilityInput: RentAffordabilityInput = {
  monthlyIncome: 300000, // ₦300,000
  otherMonthlyExpenses: 100000, // ₦100,000
  desiredSavingsRate: 20,
  dependents: 0,
  additionalIncomeSource: 0
};

const defaultPropertyCostInput: PropertyCostInput = {
  baseRent: 200000, // ₦200,000
  paymentFrequency: RentPaymentFrequency.MONTHLY,
  securityDeposit: 400000, // ₦400,000 (2 months rent)
  additionalCosts: [
    {
      name: 'Service Charge',
      amount: 50000, // ₦50,000
      frequency: RentPaymentFrequency.ANNUALLY,
      isOptional: false,
      description: 'Annual service charge for maintenance of common areas'
    },
    {
      name: 'Agent Fee',
      amount: 200000, // ₦200,000
      frequency: RentPaymentFrequency.ANNUALLY,
      isOptional: false,
      description: 'One-time agent fee (10% of annual rent)'
    }
  ],
  leaseTermMonths: 12,
  includesUtilities: false,
  includesInternet: false
};

const defaultMarketComparisonInput: MarketComparisonInput = {
  propertyType: 'Apartment',
  bedrooms: 2,
  location: 'Lekki',
  size: 80 // 80 square meters
};

export const useRentCalculatorStore = create<RentCalculatorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        affordabilityInput: { ...defaultAffordabilityInput },
        affordabilityResult: null,
        
        propertyCostInput: { ...defaultPropertyCostInput },
        propertyCostResult: null,
        
        marketComparisonInput: { ...defaultMarketComparisonInput },
        marketComparisonResult: null,
        
        comparisonProperties: [],
        propertyComparisonResult: null,
        
        isLoading: false,
        error: null,
        
        // Actions
        setAffordabilityInput: (input) => {
          set({
            affordabilityInput: { ...get().affordabilityInput, ...input },
            affordabilityResult: null // Reset result when input changes
          });
        },
        
        calculateAffordability: () => {
          try {
            set({ isLoading: true, error: null });
            
            const result = calculateRentAffordability(get().affordabilityInput);
            
            set({
              affordabilityResult: result,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to calculate affordability',
              isLoading: false
            });
          }
        },
        
        setPropertyCostInput: (input) => {
          set({
            propertyCostInput: { ...get().propertyCostInput, ...input },
            propertyCostResult: null // Reset result when input changes
          });
        },
        
        calculatePropertyCost: () => {
          try {
            set({ isLoading: true, error: null });
            
            const result = calculatePropertyCost(get().propertyCostInput);
            
            set({
              propertyCostResult: result,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to calculate property cost',
              isLoading: false
            });
          }
        },
        
        setMarketComparisonInput: (input) => {
          set({
            marketComparisonInput: { ...get().marketComparisonInput, ...input },
            marketComparisonResult: null // Reset result when input changes
          });
        },
        
        calculateMarketComparison: () => {
          try {
            set({ isLoading: true, error: null });
            
            const result = calculateMarketComparison(get().marketComparisonInput);
            
            set({
              marketComparisonResult: result,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to calculate market comparison',
              isLoading: false
            });
          }
        },
        
        addComparisonProperty: (property) => {
          // Check if property already exists
          const exists = get().comparisonProperties.some(p => p.propertyId === property.propertyId);
          
          if (!exists) {
            set({
              comparisonProperties: [...get().comparisonProperties, property],
              propertyComparisonResult: null // Reset result when properties change
            });
          }
        },
        
        removeComparisonProperty: (propertyId) => {
          set({
            comparisonProperties: get().comparisonProperties.filter(p => p.propertyId !== propertyId),
            propertyComparisonResult: null // Reset result when properties change
          });
        },
        
        clearComparisonProperties: () => {
          set({
            comparisonProperties: [],
            propertyComparisonResult: null
          });
        },
        
        calculatePropertyComparison: () => {
          try {
            set({ isLoading: true, error: null });
            
            const { comparisonProperties } = get();
            
            if (comparisonProperties.length < 2) {
              throw new Error('At least two properties are required for comparison');
            }
            
            const result = compareProperties(comparisonProperties);
            
            set({
              propertyComparisonResult: result,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to compare properties',
              isLoading: false
            });
          }
        },
        
        resetCalculator: () => {
          set({
            affordabilityInput: { ...defaultAffordabilityInput },
            affordabilityResult: null,
            propertyCostInput: { ...defaultPropertyCostInput },
            propertyCostResult: null,
            marketComparisonInput: { ...defaultMarketComparisonInput },
            marketComparisonResult: null,
            comparisonProperties: [],
            propertyComparisonResult: null,
            isLoading: false,
            error: null
          });
        }
      }),
      {
        name: 'rent-calculator-store',
        partialize: (state) => ({
          // Only persist these fields
          affordabilityInput: state.affordabilityInput,
          propertyCostInput: state.propertyCostInput,
          marketComparisonInput: state.marketComparisonInput,
          comparisonProperties: state.comparisonProperties
        })
      }
    )
  )
);