import React from 'react';
import { IconMapPin } from '@tabler/icons-react';

interface LocationStepProps {
  formData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  updateFormData: (data: Partial<LocationStepProps['formData']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ 
  formData, 
  updateFormData, 
  onNext,
  onPrev
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <IconMapPin className="mr-2" /> Location
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address*
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g., 123 Admiralty Way"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., Lekki"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State*
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              value={formData.state}
              onChange={handleInputChange}
              placeholder="e.g., Lagos"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="e.g., 100001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country*
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={formData.country}
            onChange={handleInputChange}
            placeholder="e.g., Nigeria"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude (optional)
            </label>
            <input
              id="latitude"
              name="latitude"
              type="text"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 6.4281"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude (optional)
            </label>
            <input
              id="longitude"
              name="longitude"
              type="text"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 3.4219"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Map Location</p>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Map integration will be added here</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Drag the marker to pinpoint your property's exact location</p>
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

export default LocationStep;