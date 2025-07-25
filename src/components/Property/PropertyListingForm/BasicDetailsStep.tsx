import React from 'react';
import { IconHome } from '@tabler/icons-react';
import { PropertyType, ListingType } from '../../../types/property';

interface BasicDetailsStepProps {
  formData: {
    title: string;
    description: string;
    propertyType: PropertyType;
    listingType: ListingType;
    price: string;
    currency: string;
    paymentFrequency: string;
    negotiable: boolean;
  };
  updateFormData: (data: Partial<BasicDetailsStepProps['formData']>) => void;
  onNext: () => void;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ 
  formData, 
  updateFormData, 
  onNext 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <IconHome className="mr-2" /> Basic Information
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Property Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Spacious 3 Bedroom Apartment in Lekki"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your property in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type*
            </label>
            <select
              id="propertyType"
              name="propertyType"
              required
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={PropertyType.APARTMENT}>Apartment</option>
              <option value={PropertyType.HOUSE}>House</option>
              <option value={PropertyType.CONDO}>Condo</option>
              <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
              <option value={PropertyType.LAND}>Land</option>
              <option value={PropertyType.COMMERCIAL}>Commercial</option>
              <option value={PropertyType.OTHER}>Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-1">
              Listing Type*
            </label>
            <select
              id="listingType"
              name="listingType"
              required
              value={formData.listingType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ListingType.RENT}>For Rent</option>
              <option value={ListingType.SALE}>For Sale</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 150000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {formData.listingType === ListingType.RENT && (
            <div>
              <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                id="paymentFrequency"
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="negotiable"
            name="negotiable"
            type="checkbox"
            checked={formData.negotiable}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="negotiable" className="ml-2 text-sm text-gray-700">
            Price is negotiable
          </label>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
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

export default BasicDetailsStep;