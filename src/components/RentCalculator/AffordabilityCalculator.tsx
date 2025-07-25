import React, { useState } from 'react';
import {
  IconInfoCircle,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { useRentCalculator } from '../../hooks/useRentCalculator';
import { Property } from '../../types/property';

interface AffordabilityCalculatorProps {
  property?: Property;
  compact?: boolean;
}

const AffordabilityCalculator: React.FC<AffordabilityCalculatorProps> = ({
  property,
  compact = false
}) => {
  const {
    affordabilityInput,
    affordabilityResult,
    setAffordabilityInput,
    calculateAffordability,
    formatCurrency,
    formatPercentage,
    checkAffordabilityForRent
  } = useRentCalculator();

  const [showInfo, setShowInfo] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAffordabilityInput({ [name]: parseFloat(value) || 0 });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAffordability();
  };

  // Get affordability color based on score
  const getAffordabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-600';
  };

  // Get affordability background color based on score
  const getAffordabilityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-green-50';
    if (score >= 40) return 'bg-yellow-50';
    if (score >= 20) return 'bg-orange-50';
    return 'bg-red-50';
  };

  // Compact version for embedding in property pages
  if (compact) {
    // If property is provided, show quick affordability check
    if (property && property.pricing) {
      const monthlyRent = property.pricing.paymentFrequency === 'monthly'
        ? property.pricing.price
        : property.pricing.paymentFrequency === 'quarterly'
          ? property.pricing.price / 3
          : property.pricing.paymentFrequency === 'annually'
            ? property.pricing.price / 12
            : property.pricing.price;

      return (
        <div className="p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Check Affordability</h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Monthly Income
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                type="number"
                name="monthlyIncome"
                value={affordabilityInput.monthlyIncome || ''}
                onChange={handleInputChange}
                placeholder="e.g., 300000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Monthly income"
              />
            </div>
          </div>

          {affordabilityInput.monthlyIncome > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly Rent:</span>
                <span className="font-semibold">{formatCurrency(monthlyRent)}</span>
              </div>

              {(() => {
                const result = checkAffordabilityForRent(monthlyRent);
                return (
                  <div className={`p-3 rounded-md ${getAffordabilityBgColor(result.affordabilityScore)}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Affordability:</span>
                      <span className={`font-semibold ${getAffordabilityColor(result.affordabilityScore)}`}>
                        {result.affordabilityLabel}
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2.5" role="progressbar" aria-valuenow={result.affordabilityScore} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className={`h-2.5 rounded-full ${result.affordabilityScore >= 60 ? 'bg-green-500' :
                            result.affordabilityScore >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                          }`}
                        style={{ width: `${result.affordabilityScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      This rent is {formatPercentage(result.rentToIncomeRatio * 100)} of your income.
                      {result.rentToIncomeRatio > 0.3 && ' Experts recommend keeping rent below 30% of income.'}
                    </p>

                    {result.rentToIncomeRatio > 0.4 && (
                      <p className="text-xs mt-1 text-red-600 font-medium">
                        Warning: This rent is significantly above the recommended threshold.
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/calculator'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  aria-label="Open full calculator"
                >
                  Full Calculator
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // If no property, show simple form
    return (
      <div className="p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Rent Affordability Calculator</h4>
        <p className="text-gray-600 mb-4">
          Calculate how much rent you can afford based on your income and expenses.
        </p>
        <button
          onClick={() => window.location.href = '/calculator'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Open calculator"
        >
          Open Calculator
        </button>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Rent Affordability Calculator</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-gray-700"
          aria-label={showInfo ? "Hide information" : "Show information"}
          aria-expanded={showInfo}
        >
          <IconInfoCircle size={20} />
        </button>
      </div>

      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">About Rent Affordability</h4>
          <p className="text-sm text-blue-800">
            Financial experts typically recommend spending no more than 30% of your gross monthly income on rent.
            This calculator helps you determine how much rent you can afford based on your income and expenses.
          </p>
          <p className="text-sm text-blue-800 mt-2">
            The calculator considers your income, expenses, savings goals, and dependents to provide a personalized recommendation.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Income
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                id="monthlyIncome"
                type="number"
                name="monthlyIncome"
                value={affordabilityInput.monthlyIncome || ''}
                onChange={handleInputChange}
                placeholder="e.g., 300000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-describedby="monthlyIncome-description"
              />
            </div>
            <p id="monthlyIncome-description" className="mt-1 text-xs text-gray-500">Your total monthly income before taxes</p>
          </div>

          <div>
            <label htmlFor="otherMonthlyExpenses" className="block text-sm font-medium text-gray-700 mb-1">
              Other Monthly Expenses
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                id="otherMonthlyExpenses"
                type="number"
                name="otherMonthlyExpenses"
                value={affordabilityInput.otherMonthlyExpenses || ''}
                onChange={handleInputChange}
                placeholder="e.g., 100000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-describedby="otherMonthlyExpenses-description"
              />
            </div>
            <p id="otherMonthlyExpenses-description" className="mt-1 text-xs text-gray-500">All other monthly expenses excluding rent</p>
          </div>

          <div>
            <label htmlFor="desiredSavingsRate" className="block text-sm font-medium text-gray-700 mb-1">
              Desired Savings Rate (%)
            </label>
            <input
              id="desiredSavingsRate"
              type="number"
              name="desiredSavingsRate"
              value={affordabilityInput.desiredSavingsRate || ''}
              onChange={handleInputChange}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
              aria-describedby="desiredSavingsRate-description"
            />
            <p id="desiredSavingsRate-description" className="mt-1 text-xs text-gray-500">Percentage of income you want to save monthly</p>
          </div>

          <div>
            <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Dependents
            </label>
            <input
              id="dependents"
              type="number"
              name="dependents"
              value={affordabilityInput.dependents || ''}
              onChange={handleInputChange}
              placeholder="e.g., 0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              aria-describedby="dependents-description"
            />
            <p id="dependents-description" className="mt-1 text-xs text-gray-500">Number of people financially dependent on you</p>
          </div>

          <div>
            <label htmlFor="additionalIncomeSource" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Monthly Income
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                id="additionalIncomeSource"
                type="number"
                name="additionalIncomeSource"
                value={affordabilityInput.additionalIncomeSource || ''}
                onChange={handleInputChange}
                placeholder="e.g., 0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                aria-describedby="additionalIncomeSource-description"
              />
            </div>
            <p id="additionalIncomeSource-description" className="mt-1 text-xs text-gray-500">Any additional monthly income (optional)</p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Calculate rent affordability"
            >
              Calculate Affordability
            </button>
          </div>
        </div>
      </form>

      {affordabilityResult && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Affordability Results</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Monthly Rent</h5>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(affordabilityResult.recommendedRent)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Based on your income, expenses, and savings goals
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Maximum Affordable Rent</h5>
              <div className="text-2xl font-bold text-gray-700">
                {formatCurrency(affordabilityResult.maxAffordableRent)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                30% of your total monthly income
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Affordability Score</h5>
            <div className="flex items-center mb-2">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${affordabilityResult.affordabilityScore >= 60 ? 'bg-green-500' :
                        affordabilityResult.affordabilityScore >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                      }`}
                    style={{ width: `${affordabilityResult.affordabilityScore}%` }}
                    role="progressbar"
                    aria-valuenow={affordabilityResult.affordabilityScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              <div className="ml-4 min-w-[60px] text-right">
                <span className={`font-medium ${getAffordabilityColor(affordabilityResult.affordabilityScore)}`}>
                  {affordabilityResult.affordabilityScore.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not Affordable</span>
              <span>Very Affordable</span>
            </div>

            {affordabilityResult.affordabilityScore < 40 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>Warning:</strong> This rent level may put significant strain on your finances. Consider looking for more affordable options.
              </div>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Monthly Budget Breakdown</h5>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Income</span>
                <span className="font-medium">{formatCurrency(affordabilityResult.affordabilityBreakdown.totalIncome)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Other Expenses</span>
                <span className="font-medium">- {formatCurrency(affordabilityResult.affordabilityBreakdown.otherExpenses)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Savings</span>
                <span className="font-medium">- {formatCurrency(affordabilityResult.affordabilityBreakdown.savingsBudget)}</span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Rent Budget</span>
                  <span className="font-bold text-blue-700">{formatCurrency(affordabilityResult.recommendedRent)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Rent-to-Income Ratio</div>
                <div className="flex items-center">
                  <span className="text-lg font-medium">
                    {formatPercentage(affordabilityResult.rentToIncomeRatio * 100)}
                  </span>
                  <div className="ml-2">
                    {affordabilityResult.rentToIncomeRatio <= 0.3 ? (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <IconCheck size={12} className="mr-1" />
                        Good
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <IconX size={12} className="mr-1" />
                        High
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Experts recommend keeping this below 30%
                </p>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Disposable Income</div>
                <div className="text-lg font-medium">
                  {formatCurrency(affordabilityResult.disposableIncome)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Income after expenses and savings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-900 mb-3">Recommendations</h5>

            <ul className="space-y-2 text-sm text-blue-800">
              {affordabilityResult.rentToIncomeRatio > 0.3 && (
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider properties with lower rent to improve your financial stability.</span>
                </li>
              )}

              {affordabilityResult.disposableIncome < affordabilityResult.affordabilityBreakdown.totalIncome * 0.1 && (
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Your disposable income is low. Consider reducing expenses or finding additional income sources.</span>
                </li>
              )}

              {affordabilityResult.recommendedRent < affordabilityResult.maxAffordableRent * 0.7 && (
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>You have room in your budget for a higher quality property if desired.</span>
                </li>
              )}

              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Remember to account for potential rent increases when signing a long-term lease.</span>
              </li>
            </ul>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Print results"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffordabilityCalculator;