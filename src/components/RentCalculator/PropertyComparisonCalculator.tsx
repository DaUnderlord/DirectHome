import React, { useState, useEffect } from 'react';
import { 
  IconPlus, 
  IconTrash, 
  IconInfoCircle, 
  IconBuildingSkyscraper,
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler,
  IconCurrencyNaira,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { useRentCalculator } from '../../hooks/useRentCalculator';
import { PropertyComparisonItem, RentPaymentFrequency } from '../../types/rentCalculator';

interface PropertyComparisonCalculatorProps {
  compact?: boolean;
}

const PropertyComparisonCalculator: React.FC<PropertyComparisonCalculatorProps> = ({ 
  compact = false 
}) => {
  const {
    comparisonProperties,
    propertyComparisonResult,
    isLoading,
    error,
    addComparisonProperty,
    removeComparisonProperty,
    clearComparisonProperties,
    calculatePropertyComparison,
    formatCurrency,
    getFrequencyLabel
  } = useRentCalculator();

  const [newProperty, setNewProperty] = useState<Partial<PropertyComparisonItem>>({
    propertyId: '',
    title: '',
    baseRent: 0,
    paymentFrequency: RentPaymentFrequency.MONTHLY,
    additionalCosts: [],
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    amenities: []
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  // Reset form when closing
  const resetForm = () => {
    setNewProperty({
      propertyId: '',
      title: '',
      baseRent: 0,
      paymentFrequency: RentPaymentFrequency.MONTHLY,
      additionalCosts: [],
      location: '',
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      amenities: []
    });
    setAmenityInput('');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewProperty({
        ...newProperty,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewProperty({
        ...newProperty,
        [name]: value
      });
    }
  };

  // Add amenity to the list
  const handleAddAmenity = () => {
    if (amenityInput.trim() && newProperty.amenities) {
      setNewProperty({
        ...newProperty,
        amenities: [...newProperty.amenities, amenityInput.trim()]
      });
      setAmenityInput('');
    }
  };

  // Remove amenity from the list
  const handleRemoveAmenity = (index: number) => {
    if (newProperty.amenities) {
      setNewProperty({
        ...newProperty,
        amenities: newProperty.amenities.filter((_, i) => i !== index)
      });
    }
  };

  // Add new property to comparison
  const handleAddProperty = () => {
    // Generate a unique ID if not provided
    const propertyId = newProperty.propertyId || `property-${Date.now()}`;
    
    // Calculate total monthly and annual payments
    const baseRentMonthly = newProperty.paymentFrequency === RentPaymentFrequency.MONTHLY 
      ? newProperty.baseRent || 0
      : newProperty.paymentFrequency === RentPaymentFrequency.QUARTERLY 
        ? (newProperty.baseRent || 0) / 3
        : newProperty.paymentFrequency === RentPaymentFrequency.BIANNUALLY 
          ? (newProperty.baseRent || 0) / 6
          : (newProperty.baseRent || 0) / 12;
    
    const totalMonthlyPayment = baseRentMonthly;
    const totalAnnualPayment = totalMonthlyPayment * 12;
    
    const property: PropertyComparisonItem = {
      propertyId,
      title: newProperty.title || `Property ${comparisonProperties.length + 1}`,
      baseRent: newProperty.baseRent || 0,
      paymentFrequency: newProperty.paymentFrequency || RentPaymentFrequency.MONTHLY,
      additionalCosts: newProperty.additionalCosts || [],
      totalMonthlyPayment,
      totalAnnualPayment,
      location: newProperty.location || 'Unknown',
      bedrooms: newProperty.bedrooms || 0,
      bathrooms: newProperty.bathrooms || 0,
      size: newProperty.size,
      amenities: newProperty.amenities || []
    };
    
    addComparisonProperty(property);
    setShowAddForm(false);
    resetForm();
  };

  // Run comparison when properties change
  useEffect(() => {
    if (comparisonProperties.length >= 2) {
      calculatePropertyComparison();
    }
  }, [comparisonProperties, calculatePropertyComparison]);

  // Compact version for embedding in property pages
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconBuildingSkyscraper size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Property Comparison</h4>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Compare multiple properties to find the best value.</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowAddForm(true)}
            >
              Add Property
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Property Comparison Calculator</h3>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={() => setShowAddForm(true)}
          >
            <IconPlus size={18} className="mr-1" />
            Add Property
          </button>
          {comparisonProperties.length > 0 && (
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={clearComparisonProperties}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Add Property Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Add Property for Comparison</h4>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
            >
              <IconX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <input
                type="text"
                name="title"
                value={newProperty.title || ''}
                onChange={handleInputChange}
                placeholder="e.g., Lekki Apartment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={newProperty.location || ''}
                onChange={handleInputChange}
                placeholder="e.g., Lekki"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Rent
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₦</span>
                </div>
                <input
                  type="number"
                  name="baseRent"
                  value={newProperty.baseRent || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 150000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                name="paymentFrequency"
                value={newProperty.paymentFrequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={RentPaymentFrequency.MONTHLY}>Monthly</option>
                <option value={RentPaymentFrequency.QUARTERLY}>Quarterly</option>
                <option value={RentPaymentFrequency.BIANNUALLY}>Bi-annually</option>
                <option value={RentPaymentFrequency.ANNUALLY}>Annually</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (sq.m)
              </label>
              <input
                type="number"
                name="size"
                value={newProperty.size || ''}
                onChange={handleInputChange}
                placeholder="e.g., 80"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={newProperty.bedrooms || ''}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={newProperty.bathrooms || ''}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="flex">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., Swimming Pool"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {newProperty.amenities && newProperty.amenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newProperty.amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddProperty}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!newProperty.title || !newProperty.baseRent}
            >
              Add to Comparison
            </button>
          </div>
        </div>
      )}
      
      {/* Properties List */}
      {comparisonProperties.length > 0 ? (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Properties to Compare</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonProperties.map((property) => (
                  <tr key={property.propertyId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {property.bedrooms} bed • {property.bathrooms} bath • {property.size ? `${property.size} sq.m` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(property.baseRent)}/{getFrequencyLabel(property.paymentFrequency).toLowerCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(property.totalMonthlyPayment)}/month
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeComparisonProperty(property.propertyId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-6">
          <IconBuildingSkyscraper size={48} className="mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Properties Added</h4>
          <p className="text-gray-600 mb-4">
            Add at least two properties to compare and find the best value.
          </p>
          {!showAddForm && (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowAddForm(true)}
            >
              Add Property
            </button>
          )}
        </div>
      )}
      
      {/* Comparison Results */}
      {propertyComparisonResult && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-blue-900">Comparison Results</h4>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <IconCheck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Best Value</h5>
                    <p className="text-lg font-semibold text-green-700">
                      {comparisonProperties.find(p => p.propertyId === propertyComparisonResult.bestValue)?.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on price, amenities, and location
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <IconCurrencyNaira size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Lowest Cost</h5>
                    <p className="text-lg font-semibold text-blue-700">
                      {comparisonProperties.find(p => p.propertyId === propertyComparisonResult.lowestTotalCost)?.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on total monthly payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/sq.m
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amenities
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonProperties.map((property) => (
                    <tr 
                      key={property.propertyId}
                      className={
                        property.propertyId === propertyComparisonResult.bestValue
                          ? 'bg-green-50'
                          : property.propertyId === propertyComparisonResult.lowestTotalCost
                            ? 'bg-blue-50'
                            : ''
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(property.totalMonthlyPayment)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(property.totalAnnualPayment)}/year
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.size 
                            ? formatCurrency(property.totalMonthlyPayment / property.size) 
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {property.amenities.length} amenities
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {property.amenities.slice(0, 3).join(', ')}
                          {property.amenities.length > 3 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {propertyComparisonResult.comparisonFactors.valueScore[property.propertyId].toFixed(1)}
                        </div>
                        {property.propertyId === propertyComparisonResult.bestValue && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Best Value
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonCalculator;