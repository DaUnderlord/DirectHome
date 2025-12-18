import React from 'react';
import {
  NigerianPropertyType,
  PropertyCategory
} from '../../../types/propertyOwner';

interface BasicInfoStepProps {
  data: {
    title: string;
    propertyType: NigerianPropertyType;
    category: PropertyCategory;
    description: string;
    size: number;
    landmarks: string[];
  };
  errors: Record<string, string>;
  onChange: (data: Partial<BasicInfoStepProps['data']>) => void;
}

const PROPERTY_TYPES = [
  { value: NigerianPropertyType.SELF_CON, label: 'Self Contain' },
  { value: NigerianPropertyType.MINI_FLAT, label: 'Mini Flat' },
  { value: NigerianPropertyType.ONE_BEDROOM, label: '1 Bedroom' },
  { value: NigerianPropertyType.TWO_BEDROOM, label: '2 Bedroom' },
  { value: NigerianPropertyType.THREE_BEDROOM, label: '3 Bedroom' },
  { value: NigerianPropertyType.FOUR_BEDROOM, label: '4 Bedroom' },
  { value: NigerianPropertyType.FIVE_BEDROOM, label: '5 Bedroom' },
  { value: NigerianPropertyType.DUPLEX, label: 'Duplex' },
  { value: NigerianPropertyType.PENTHOUSE, label: 'Penthouse' },
  { value: NigerianPropertyType.BUNGALOW, label: 'Bungalow' },
  { value: NigerianPropertyType.TERRACE, label: 'Terrace' },
  { value: NigerianPropertyType.DETACHED, label: 'Detached House' },
  { value: NigerianPropertyType.SEMI_DETACHED, label: 'Semi-Detached' },
  { value: NigerianPropertyType.COMMERCIAL, label: 'Commercial Space' },
  { value: NigerianPropertyType.LAND, label: 'Land' }
];

const CATEGORIES = [
  { value: PropertyCategory.RENT, label: 'For Rent', description: 'Long-term rental' },
  { value: PropertyCategory.SALE, label: 'For Sale', description: 'Property for sale' },
  { value: PropertyCategory.SHORT_STAY, label: 'Short Stay', description: 'Daily/weekly rentals' },
  { value: PropertyCategory.LEASE, label: 'For Lease', description: 'Commercial lease' }
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, errors, onChange }) => {
  const [newLandmark, setNewLandmark] = React.useState('');

  const addLandmark = () => {
    if (newLandmark.trim() && !data.landmarks.includes(newLandmark.trim())) {
      onChange({ landmarks: [...data.landmarks, newLandmark.trim()] });
      setNewLandmark('');
    }
  };

  const removeLandmark = (landmark: string) => {
    onChange({ landmarks: data.landmarks.filter(l => l !== landmark) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Property Information</h2>
        <p className="text-gray-600">Tell us about your property</p>
      </div>

      {/* Property Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Spacious 3 Bedroom Flat in Lekki Phase 1"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors['basicInfo.title'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['basicInfo.title'] && (
          <p className="mt-1 text-sm text-red-500">{errors['basicInfo.title']}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          A clear, descriptive title helps attract the right tenants
        </p>
      </div>

      {/* Property Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange({ category: category.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.category === category.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block font-medium text-gray-900">{category.label}</span>
              <span className="text-xs text-gray-500">{category.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          value={data.propertyType}
          onChange={(e) => onChange({ propertyType: e.target.value as NigerianPropertyType })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Property Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Size (sqm) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.size || ''}
          onChange={(e) => onChange({ size: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 150"
          min="0"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors['basicInfo.size'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['basicInfo.size'] && (
          <p className="mt-1 text-sm text-red-500">{errors['basicInfo.size']}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe your property in detail. Include unique features, nearby amenities, and what makes it special..."
          rows={5}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors['basicInfo.description'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['basicInfo.description'] && (
          <p className="mt-1 text-sm text-red-500">{errors['basicInfo.description']}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {data.description.length}/1000 characters
        </p>
      </div>

      {/* Landmarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nearby Landmarks
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newLandmark}
            onChange={(e) => setNewLandmark(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLandmark())}
            placeholder="e.g., Lekki Phase 1 Mall, Chevron Drive"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addLandmark}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        {data.landmarks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.landmarks.map((landmark, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {landmark}
                <button
                  type="button"
                  onClick={() => removeLandmark(landmark)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Add nearby landmarks to help tenants find your property easily
        </p>
      </div>
    </div>
  );
};

export default BasicInfoStep;
