import React from 'react';
import {
  PowerSupplyType,
  WaterSource,
  KitchenType,
  COMMON_AMENITIES,
  SECURITY_FEATURES,
  ACCESSIBILITY_OPTIONS
} from '../../../types/propertyOwner';

interface FeaturesStepProps {
  data: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    kitchenType: KitchenType;
    parkingSpaces: number;
    powerSupply: PowerSupplyType;
    nepaHours?: number;
    waterSource: WaterSource;
    securityFeatures: string[];
    amenities: string[];
    accessibilityOptions: string[];
  };
  errors: Record<string, string>;
  onChange: (data: Partial<FeaturesStepProps['data']>) => void;
}

const POWER_SUPPLY_OPTIONS = [
  { value: PowerSupplyType.NEPA_ONLY, label: 'NEPA Only' },
  { value: PowerSupplyType.NEPA_WITH_GEN, label: 'NEPA + Generator' },
  { value: PowerSupplyType.SOLAR, label: 'Solar Power' },
  { value: PowerSupplyType.INVERTER, label: 'Inverter Backup' },
  { value: PowerSupplyType.FULL_POWER, label: '24/7 Power Supply' }
];

const WATER_SOURCE_OPTIONS = [
  { value: WaterSource.BOREHOLE, label: 'Borehole' },
  { value: WaterSource.WELL, label: 'Well' },
  { value: WaterSource.MAINS, label: 'Public Mains' },
  { value: WaterSource.TANKER, label: 'Water Tanker' },
  { value: WaterSource.MULTIPLE, label: 'Multiple Sources' }
];

const KITCHEN_OPTIONS = [
  { value: KitchenType.OPEN, label: 'Open Kitchen' },
  { value: KitchenType.CLOSED, label: 'Closed Kitchen' },
  { value: KitchenType.SEMI_OPEN, label: 'Semi-Open Kitchen' }
];

const FeaturesStep: React.FC<FeaturesStepProps> = ({ data, errors, onChange }) => {
  const toggleArrayItem = (field: 'securityFeatures' | 'amenities' | 'accessibilityOptions', item: string) => {
    const currentArray = data[field];
    if (currentArray.includes(item)) {
      onChange({ [field]: currentArray.filter(i => i !== item) });
    } else {
      onChange({ [field]: [...currentArray, item] });
    }
  };

  const NumberInput = ({ 
    label, 
    value, 
    field, 
    min = 0, 
    max = 20 
  }: { 
    label: string; 
    value: number; 
    field: string; 
    min?: number; 
    max?: number;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange({ [field]: Math.max(min, value - 1) })}
          className="w-10 h-10 rounded-l-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange({ [field]: Math.min(max, Math.max(min, parseInt(e.target.value) || 0)) })}
          className="w-16 h-10 border-t border-b border-gray-300 text-center"
          min={min}
          max={max}
        />
        <button
          type="button"
          onClick={() => onChange({ [field]: Math.min(max, value + 1) })}
          className="w-10 h-10 rounded-r-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Features</h2>
        <p className="text-gray-600">Describe the features and amenities of your property</p>
      </div>

      {/* Room Configuration */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Room Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NumberInput label="Bedrooms" value={data.bedrooms} field="bedrooms" />
          <NumberInput label="Bathrooms" value={data.bathrooms} field="bathrooms" />
          <NumberInput label="Toilets" value={data.toilets} field="toilets" />
          <NumberInput label="Parking Spaces" value={data.parkingSpaces} field="parkingSpaces" />
        </div>
      </div>

      {/* Kitchen Type */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kitchen Type</h3>
        <div className="grid grid-cols-3 gap-4">
          {KITCHEN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ kitchenType: option.value })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.kitchenType === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Power Supply */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Power Supply</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {POWER_SUPPLY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ powerSupply: option.value })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.powerSupply === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
        {(data.powerSupply === PowerSupplyType.NEPA_ONLY || data.powerSupply === PowerSupplyType.NEPA_WITH_GEN) && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average NEPA Hours per Day
            </label>
            <input
              type="number"
              value={data.nepaHours || ''}
              onChange={(e) => onChange({ nepaHours: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 12"
              min="0"
              max="24"
              className="w-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-500">hours</span>
          </div>
        )}
      </div>

      {/* Water Source */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Water Source</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {WATER_SOURCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ waterSource: option.value })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.waterSource === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Features</h3>
        <div className="flex flex-wrap gap-3">
          {SECURITY_FEATURES.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleArrayItem('securityFeatures', feature)}
              className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                data.securityFeatures.includes(feature)
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {data.securityFeatures.includes(feature) && '✓ '}
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
        <div className="flex flex-wrap gap-3">
          {COMMON_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleArrayItem('amenities', amenity)}
              className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                data.amenities.includes(amenity)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {data.amenities.includes(amenity) && '✓ '}
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibility Options</h3>
        <div className="flex flex-wrap gap-3">
          {ACCESSIBILITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleArrayItem('accessibilityOptions', option)}
              className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                data.accessibilityOptions.includes(option)
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {data.accessibilityOptions.includes(option) && '✓ '}
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesStep;
