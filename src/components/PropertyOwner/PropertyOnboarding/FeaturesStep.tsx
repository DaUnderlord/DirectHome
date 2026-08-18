import React from 'react';
import {
  PowerSupplyType,
  WaterSource,
  KitchenType,
  COMMON_AMENITIES,
  SECURITY_FEATURES,
  ACCESSIBILITY_OPTIONS
} from '../../../types/propertyOwner';
import NumberField from '../../UI/NumberField';

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

const FeaturesStep: React.FC<FeaturesStepProps> = ({ data, onChange }) => {
  const toggleArrayItem = (field: 'securityFeatures' | 'amenities' | 'accessibilityOptions', item: string) => {
    const currentArray = data[field];
    if (currentArray.includes(item)) {
      onChange({ [field]: currentArray.filter(i => i !== item) });
    } else {
      onChange({ [field]: [...currentArray, item] });
    }
  };

  const choiceClass = (selected: boolean) =>
    `p-3 sm:p-4 min-h-12 rounded-sm border text-center transition-colors ${
      selected
        ? 'border-courtyard-700 bg-paper-50 text-ink-950'
        : 'border-paper-300 bg-paper-50 text-ink-800 hover:border-courtyard-500'
    }`;

  const chipClass = (selected: boolean) =>
    `px-4 py-2 rounded-sm border text-sm transition-colors ${
      selected
        ? 'border-courtyard-700 bg-courtyard-700 text-paper-50'
        : 'border-paper-300 text-ink-700 hover:border-courtyard-500'
    }`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg sm:text-xl font-semibold text-ink-950 mb-2">Property Features</h2>
        <p className="text-ink-600 text-sm sm:text-base">Describe the features and amenities of your property</p>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Room Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Bedrooms" value={data.bedrooms} min={0} max={20} onChange={(bedrooms) => onChange({ bedrooms })} />
          <NumberField label="Bathrooms" value={data.bathrooms} min={0} max={20} onChange={(bathrooms) => onChange({ bathrooms })} />
          <NumberField label="Toilets" value={data.toilets} min={0} max={20} onChange={(toilets) => onChange({ toilets })} />
          <NumberField label="Parking Spaces" value={data.parkingSpaces} min={0} max={20} onChange={(parkingSpaces) => onChange({ parkingSpaces })} />
        </div>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Kitchen Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KITCHEN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ kitchenType: option.value })}
              className={choiceClass(data.kitchenType === option.value)}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Power Supply</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {POWER_SUPPLY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ powerSupply: option.value })}
              className={choiceClass(data.powerSupply === option.value)}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        {(data.powerSupply === PowerSupplyType.NEPA_ONLY || data.powerSupply === PowerSupplyType.NEPA_WITH_GEN) && (
          <NumberField
            label="Average NEPA Hours per Day"
            value={data.nepaHours || 0}
            min={0}
            max={24}
            suffix="hrs"
            placeholder="12"
            onChange={(nepaHours) => onChange({ nepaHours })}
          />
        )}
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Water Source</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {WATER_SOURCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ waterSource: option.value })}
              className={choiceClass(data.waterSource === option.value)}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Security Features</h3>
        <div className="flex flex-wrap gap-2">
          {SECURITY_FEATURES.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleArrayItem('securityFeatures', feature)}
              className={chipClass(data.securityFeatures.includes(feature))}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleArrayItem('amenities', amenity)}
              className={chipClass(data.amenities.includes(amenity))}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-ink-950 mb-4">Accessibility Options</h3>
        <div className="flex flex-wrap gap-2">
          {ACCESSIBILITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleArrayItem('accessibilityOptions', option)}
              className={chipClass(data.accessibilityOptions.includes(option))}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesStep;
