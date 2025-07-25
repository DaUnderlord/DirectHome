import React from 'react';
import { PropertyType, ListingType } from '../../types/property';

interface FilterPanelProps {
  filters?: {
    search: string;
    propertyType: string;
    listingType: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    bathrooms: string;
    location: string;
    furnished: boolean;
    petsAllowed: boolean;
    verified: boolean;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClear?: () => void;
  onApplyFilters?: () => void;
  compact?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters = {
    search: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    furnished: false,
    petsAllowed: false,
    verified: false
  }, 
  onChange = () => {}, 
  onClear = () => {},
  onApplyFilters = () => {},
  compact = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClear}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value={PropertyType.APARTMENT}>Apartment</option>
            <option value={PropertyType.HOUSE}>House</option>
            <option value={PropertyType.CONDO}>Condo</option>
            <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
            <option value={PropertyType.LAND}>Land</option>
            <option value={PropertyType.COMMERCIAL}>Commercial</option>
          </select>
        </div>
        
        {/* Listing Type */}
        <div>
          <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-1">
            Listing Type
          </label>
          <select
            id="listingType"
            name="listingType"
            value={filters.listingType}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Listings</option>
            <option value={ListingType.RENT}>For Rent</option>
            <option value={ListingType.SALE}>For Sale</option>
          </select>
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={onChange}
            placeholder="City or state"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Price Range */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            placeholder="Min price"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            placeholder="Max price"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="0">Studio</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        
        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>
      
      {/* Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="furnished"
            name="furnished"
            checked={filters.furnished}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
            Furnished Only
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="petsAllowed"
            name="petsAllowed"
            checked={filters.petsAllowed}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="petsAllowed" className="ml-2 text-sm text-gray-700">
            Pets Allowed
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            name="verified"
            checked={filters.verified}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
            Verified Properties
          </label>
        </div>
      </div>
      
      {/* Apply Filters Button */}
      <div className="mt-6">
        <button
          onClick={onApplyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;