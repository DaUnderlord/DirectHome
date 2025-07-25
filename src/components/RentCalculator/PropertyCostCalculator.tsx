import React, { useState } from 'react';
import { 
  IconBuildingSkyscraper, 
  IconPlus, 
  IconTrash, 
  IconInfoCircle 
} from '@tabler/icons-react';
import { useRentCalculator } from '../../hooks/useRentCalculator';
import { AdditionalCost, RentPaymentFrequency } from '../../types/rentCalculator';

const PropertyCostCalculator: React.FC = () => {
  const {
    propertyCostInput,
    propertyCostResult,
    setPropertyCostInput,
    calculatePropertyCost,
    formatCurrency,
    getFrequencyLabel
  } = useRentCalculator();

  const [showInfo, setShowInfo] = useState(false);
  const [newCost, setNewCost] = useState<Partial<AdditionalCost>>({
    name: '',
    amount: 0,
    frequency: RentPaymentFrequency.MONTHLY,
    isOptional: false,
    description: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setPropertyCostInput({ [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setPropertyCostInput({ [name]: parseFloat(value) || 0 });
    } else {
      setPropertyCostInput({ [name]: value });
    }
  };

  // Handle new cost input changes
  const handleNewCostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setNewCost({ ...newCost, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setNewCost({ ...newCost, [name]: parseFloat(value) || 0 });
    } else {
      setNewCost({ ...newCost, [name]: value });
    }
  };

  // Add new cost
  const handleAddCost = () => {
    if (newCost.name && newCost.amount) {
      const additionalCost: AdditionalCost = {
        name: newCost.name || '',
        amount: newCost.amount || 0,
        frequency: newCost.frequency || RentPaymentFrequency.MONTHLY,
        isOptional: newCost.isOptional || false,
        description: newCost.description
      };
      
      const updatedCosts = [...(propertyCostInput.additionalCosts || []), additionalCost];
      setPropertyCostInput({ additionalCosts: updatedCosts });
      
      // Reset form
      setNewCost({
        name: '',
        amount: 0,
        frequency: RentPaymentFrequency.MONTHLY,
        isOptional: false,
        description: ''
      });
    }
  };

  // Remove cost
  const handleRemoveCost = (index: number) => {
    const updatedCosts = [...(propertyCostInput.additionalCosts || [])];
    updatedCosts.splice(index, 1);
    setPropertyCostInput({ additionalCosts: updatedCosts });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePropertyCost();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Property Cost Calculator</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-gray-700"
        >
          <IconInfoCircle size={20} />
        </button>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">About Property Cost Calculator</h4>
          <p className="text-sm text-blue-800">
            This calculator helps you understand the true cost of renting or buying a property by factoring in all additional costs beyond the base rent or purchase price.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Rent/Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                type="number"
                name="baseRent"
                value={propertyCostInput.baseRent || ''}
                onChange={handleInputChange}
                placeholder="e.g., 200000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Base rent or purchase price</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Frequency
            </label>
            <select
              name="paymentFrequency"
              value={propertyCostInput.paymentFrequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={RentPaymentFrequency.MONTHLY}>Monthly</option>
              <option value={RentPaymentFrequency.QUARTERLY}>Quarterly</option>
              <option value={RentPaymentFrequency.BIANNUALLY}>Bi-annually</option>
              <option value={RentPaymentFrequency.ANNUALLY}>Annually</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">How often you pay the base amount</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                type="number"
                name="securityDeposit"
                value={propertyCostInput.securityDeposit || ''}
                onChange={handleInputChange}
                placeholder="e.g., 400000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Refundable security deposit</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lease Term (months)
            </label>
            <input
              type="number"
              name="leaseTermMonths"
              value={propertyCostInput.leaseTermMonths || ''}
              onChange={handleInputChange}
              placeholder="e.g., 12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <p className="mt-1 text-xs text-gray-500">Length of the lease in months</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includesUtilities"
                name="includesUtilities"
                checked={propertyCostInput.includesUtilities || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includesUtilities" className="ml-2 text-sm text-gray-700">
                Includes Utilities
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includesInternet"
                name="includesInternet"
                checked={propertyCostInput.includesInternet || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includesInternet" className="ml-2 text-sm text-gray-700">
                Includes Internet
              </label>
            </div>
          </div>
        </div>
        
        {/* Additional Costs */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Additional Costs</h4>
            <button
              type="button"
              onClick={() => setNewCost({
                name: '',
                amount: 0,
                frequency: RentPaymentFrequency.MONTHLY,
                isOptional: false,
                description: ''
              })}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <IconPlus size={16} className="mr-1" />
              Add Cost
            </button>
          </div>
          
          {/* New Cost Form */}
          {newCost.name !== undefined && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCost.name || ''}
                    onChange={handleNewCostChange}
                    placeholder="e.g., Service Charge"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₦</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={newCost.amount || ''}
                      onChange={handleNewCostChange}
                      placeholder="e.g., 50000"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={newCost.frequency}
                    onChange={handleNewCostChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={RentPaymentFrequency.MONTHLY}>Monthly</option>
                    <option value={RentPaymentFrequency.QUARTERLY}>Quarterly</option>
                    <option value={RentPaymentFrequency.BIANNUALLY}>Bi-annually</option>
                    <option value={RentPaymentFrequency.ANNUALLY}>Annually</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOptional"
                    name="isOptional"
                    checked={newCost.isOptional || false}
                    onChange={handleNewCostChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isOptional" className="ml-2 text-sm text-gray-700">
                    Optional Cost
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={newCost.description || ''}
                  onChange={handleNewCostChange}
                  placeholder="Brief description of this cost"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewCost({ name: undefined })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newCost.name || !newCost.amount}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          
          {/* Costs List */}
          {propertyCostInput.additionalCosts && propertyCostInput.additionalCosts.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Optional
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {propertyCostInput.additionalCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cost.name}</div>
                        {cost.description && (
                          <div className="text-xs text-gray-500">{cost.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(cost.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getFrequencyLabel(cost.frequency)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cost.isOptional ? 'Yes' : 'No'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveCost(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <IconTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-600">No additional costs added yet.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Calculate Total Cost
          </button>
        </div>
      </form>
      
      {/* Results */}
      {propertyCostResult && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Monthly Cost</h5>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(propertyCostResult.totalMonthlyPayment)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Total monthly payment including all costs
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Annual Cost</h5>
              <div className="text-2xl font-bold text-gray-700">
                {formatCurrency(propertyCostResult.totalAnnualPayment)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Total annual payment including all costs
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Upfront Costs</h5>
              <div className="text-2xl font-bold text-gray-700">
                {formatCurrency(propertyCostResult.upfrontCosts)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Initial payment required (deposit + annual fees)
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Cost Breakdown</h5>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Rent ({getFrequencyLabel(propertyCostInput.paymentFrequency)})</span>
                <span className="font-medium">{formatCurrency(propertyCostResult.breakdown.baseRent)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Rent (Monthly)</span>
                <span className="font-medium">{formatCurrency(propertyCostResult.monthlyRent)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Security Deposit</span>
                <span className="font-medium">{formatCurrency(propertyCostResult.breakdown.securityDeposit)}</span>
              </div>
              
              {Object.entries(propertyCostResult.breakdown.additionalCosts).map(([name, cost], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{name} (Monthly)</span>
                  <span className="font-medium">{formatCurrency(cost.monthly)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Monthly Payment</span>
                  <span className="font-bold text-blue-700">{formatCurrency(propertyCostResult.totalMonthlyPayment)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Effective Monthly Rate</span>
                <span className="font-bold text-blue-700">{formatCurrency(propertyCostResult.effectiveMonthlyRate)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Includes amortized upfront costs over the lease term
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCostCalculator;