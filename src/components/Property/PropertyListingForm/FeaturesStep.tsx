import React, { useState } from 'react';
import { IconBed, IconTrash, IconPlus } from '@tabler/icons-react';

interface FeaturesStepProps {
  formData: {
    bedrooms: number;
    bathrooms: number;
    squareFootage: string;
    furnished: boolean;
    petsAllowed: boolean;
    yearBuilt: string;
    amenities: string[];
  };
  rulesData: {
    smoking: boolean;
    pets: boolean;
    parties: boolean;
    children: boolean;
    additionalRules: string[];
  };
  updateFormData: (data: Partial<FeaturesStepProps['formData']>) => void;
  updateRules: (data: Partial<FeaturesStepProps['rulesData']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({ 
  formData, 
  rulesData,
  updateFormData, 
  updateRules,
  onNext,
  onPrev
}) => {
  const [newRule, setNewRule] = useState('');
  
  // Available amenities
  const availableAmenities = [
    'Air Conditioning', 'Balcony', 'Gym', 'Parking', 'Pool', 'Security', 
    'Elevator', 'Wheelchair Access', 'Laundry', 'Internet', 'TV', 'Kitchen',
    'Garden', 'Heating', 'Dedicated Workspace'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
  };
  
  const handleRuleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateRules({ [name]: checked });
  };

  const handleAmenityToggle = (amenity: string) => {
    const amenities = [...formData.amenities];
    if (amenities.includes(amenity)) {
      updateFormData({ amenities: amenities.filter(a => a !== amenity) });
    } else {
      updateFormData({ amenities: [...amenities, amenity] });
    }
  };
  
  const handleAddRule = () => {
    if (newRule.trim()) {
      updateRules({
        additionalRules: [...rulesData.additionalRules, newRule.trim()]
      });
      setNewRule('');
    }
  };
  
  const handleRemoveRule = (index: number) => {
    updateRules({
      additionalRules: rulesData.additionalRules.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <IconBed className="mr-2" /> Features & Amenities
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms*
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              required
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Bedroom' : 'Bedrooms'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms*
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              required
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Bathroom' : 'Bathrooms'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
              Square Footage
            </label>
            <input
              id="squareFootage"
              name="squareFootage"
              type="number"
              min="0"
              value={formData.squareFootage}
              onChange={handleInputChange}
              placeholder="e.g., 1200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.yearBuilt}
              onChange={handleInputChange}
              placeholder="e.g., 2010"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center">
              <input
                id="furnished"
                name="furnished"
                type="checkbox"
                checked={formData.furnished}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                Furnished
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="petsAllowed"
                name="petsAllowed"
                type="checkbox"
                checked={formData.petsAllowed}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="petsAllowed" className="ml-2 text-sm text-gray-700">
                Pets Allowed
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableAmenities.map(amenity => (
              <div key={amenity} className="flex items-center">
                <input
                  id={`amenity-${amenity}`}
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">House Rules</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="smoking"
                name="smoking"
                type="checkbox"
                checked={rulesData.smoking}
                onChange={handleRuleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="smoking" className="ml-2 text-sm text-gray-700">
                Smoking Allowed
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="pets"
                name="pets"
                type="checkbox"
                checked={rulesData.pets}
                onChange={handleRuleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="pets" className="ml-2 text-sm text-gray-700">
                Pets Allowed
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="parties"
                name="parties"
                type="checkbox"
                checked={rulesData.parties}
                onChange={handleRuleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="parties" className="ml-2 text-sm text-gray-700">
                Parties Allowed
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="children"
                name="children"
                type="checkbox"
                checked={rulesData.children}
                onChange={handleRuleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="children" className="ml-2 text-sm text-gray-700">
                Children Allowed
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="block text-sm font-medium text-gray-700 mb-1">Additional Rules</p>
            <div className="flex">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add a house rule"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <IconPlus size={16} />
              </button>
            </div>
            
            {rulesData.additionalRules.length > 0 && (
              <ul className="mt-2 space-y-1">
                {rulesData.additionalRules.map((rule, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IconTrash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeaturesStep;