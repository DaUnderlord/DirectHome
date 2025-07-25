import { useCallback } from 'react';
import { useRentCalculatorStore } from '../store/rentCalculatorStore';
import {
  AdditionalCost,
  PropertyComparisonItem,
  RentPaymentFrequency
} from '../types/rentCalculator';
import { Property } from '../types/property';
import { convertRentFrequency } from '../utils/rentCalculator';

/**
 * Custom hook for rent calculator functionality
 */
export const useRentCalculator = () => {
  const {
    affordabilityInput,
    affordabilityResult,
    propertyCostInput,
    propertyCostResult,
    marketComparisonInput,
    marketComparisonResult,
    comparisonProperties,
    propertyComparisonResult,
    isLoading,
    error,
    setAffordabilityInput,
    calculateAffordability,
    setPropertyCostInput,
    calculatePropertyCost,
    setMarketComparisonInput,
    calculateMarketComparison,
    addComparisonProperty,
    removeComparisonProperty,
    clearComparisonProperties,
    calculatePropertyComparison,
    resetCalculator
  } = useRentCalculatorStore();

  /**
   * Format currency for display
   * @param amount Amount to format
   * @param currency Currency code (default: NGN)
   * @returns Formatted currency string
   */
  const formatCurrency = useCallback((amount: number, currency = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  /**
   * Format percentage for display
   * @param value Percentage value (0-100)
   * @returns Formatted percentage string
   */
  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(1)}%`;
  }, []);

  /**
   * Get payment frequency label
   * @param frequency RentPaymentFrequency enum value
   * @returns Human-readable frequency label
   */
  const getFrequencyLabel = useCallback((frequency: RentPaymentFrequency): string => {
    switch (frequency) {
      case RentPaymentFrequency.MONTHLY:
        return 'Monthly';
      case RentPaymentFrequency.QUARTERLY:
        return 'Quarterly';
      case RentPaymentFrequency.BIANNUALLY:
        return 'Bi-annually';
      case RentPaymentFrequency.ANNUALLY:
        return 'Annually';
      default:
        return 'Monthly';
    }
  }, []);

  /**
   * Convert a property to a comparison item
   * @param property Property object
   * @param additionalCosts Additional costs
   * @returns PropertyComparisonItem
   */
  const convertPropertyToComparisonItem = useCallback((
    property: Property,
    additionalCosts: AdditionalCost[] = []
  ): PropertyComparisonItem => {
    // Calculate total monthly payment
    const paymentFrequency = property.pricing.paymentFrequency as RentPaymentFrequency || RentPaymentFrequency.MONTHLY;
    const monthlyRent = convertRentFrequency(
      property.pricing.price,
      paymentFrequency,
      RentPaymentFrequency.MONTHLY
    );

    // Calculate total additional costs per month
    const monthlyAdditionalCosts = additionalCosts.reduce((total, cost) => {
      const monthlyCost = convertRentFrequency(
        cost.amount,
        cost.frequency,
        RentPaymentFrequency.MONTHLY
      );
      return total + monthlyCost;
    }, 0);

    // Calculate total monthly and annual payments
    const totalMonthlyPayment = monthlyRent + monthlyAdditionalCosts;
    const totalAnnualPayment = totalMonthlyPayment * 12;

    return {
      propertyId: property.id,
      title: property.title,
      baseRent: property.pricing.price,
      paymentFrequency: paymentFrequency,
      additionalCosts,
      totalMonthlyPayment,
      totalAnnualPayment,
      location: property.location.city,
      bedrooms: property.features.bedrooms,
      bathrooms: property.features.bathrooms,
      size: property.features.squareFootage,
      amenities: property.features.amenities
    };
  }, []);

  /**
   * Calculate affordability for a specific rent amount
   * @param rentAmount Monthly rent amount
   * @returns Object with affordability metrics
   */
  const checkAffordabilityForRent = useCallback((rentAmount: number) => {
    const { monthlyIncome } = affordabilityInput;

    // Calculate rent-to-income ratio
    const rentToIncomeRatio = rentAmount / monthlyIncome;

    // Determine if the rent is affordable
    const isAffordable = rentToIncomeRatio <= 0.3;

    // Calculate affordability score (0-100)
    const affordabilityScore = Math.max(0, Math.min(100, 100 - ((rentToIncomeRatio - 0.15) / 0.35) * 100));

    return {
      rentToIncomeRatio,
      isAffordable,
      affordabilityScore,
      affordabilityLabel: getAffordabilityLabel(affordabilityScore)
    };
  }, [affordabilityInput]);

  /**
   * Get affordability label based on score
   * @param score Affordability score (0-100)
   * @returns Affordability label
   */
  const getAffordabilityLabel = (score: number): string => {
    if (score >= 80) return 'Very Affordable';
    if (score >= 60) return 'Affordable';
    if (score >= 40) return 'Moderately Affordable';
    if (score >= 20) return 'Barely Affordable';
    return 'Not Affordable';
  };

  return {
    // State
    affordabilityInput,
    affordabilityResult,
    propertyCostInput,
    propertyCostResult,
    marketComparisonInput,
    marketComparisonResult,
    comparisonProperties,
    propertyComparisonResult,
    isLoading,
    error,

    // Actions
    setAffordabilityInput,
    calculateAffordability,
    setPropertyCostInput,
    calculatePropertyCost,
    setMarketComparisonInput,
    calculateMarketComparison,
    addComparisonProperty,
    removeComparisonProperty,
    clearComparisonProperties,
    calculatePropertyComparison,
    resetCalculator,

    // Helper methods
    formatCurrency,
    formatPercentage,
    getFrequencyLabel,
    convertPropertyToComparisonItem,
    checkAffordabilityForRent
  };
};