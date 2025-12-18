import React from 'react';
import { FurnishingStatus, BuildingCondition } from '../../../types/propertyOwner';

interface ConditionStepProps {
  data: {
    furnishingStatus: FurnishingStatus;
    buildingCondition: BuildingCondition;
    maintenanceStatus: string;
    lastRenovated?: Date;
  };
  errors: Record<string, string>;
  onChange: (data: Partial<ConditionStepProps['data']>) => void;
}

const FURNISHING_OPTIONS = [
  { value: FurnishingStatus.FURNISHED, label: 'Fully Furnished', description: 'Complete with furniture and appliances' },
  { value: FurnishingStatus.SEMI_FURNISHED, label: 'Semi-Furnished', description: 'Basic furniture included' },
  { value: FurnishingStatus.UNFURNISHED, label: 'Unfurnished', description: 'Empty, ready for tenant furnishing' }
];

const BUILDING_CONDITIONS = [
  { value: BuildingCondition.NEWLY_BUILT, label: 'Newly Built', description: 'Less than 2 years old' },
  { value: BuildingCondition.RENOVATED, label: 'Recently Renovated', description: 'Updated within last 2 years' },
  { value: BuildingCondition.GOOD, label: 'Good Condition', description: 'Well maintained' },
  { value: BuildingCondition.FAIR, label: 'Fair Condition', description: 'Minor repairs may be needed' },
  { value: BuildingCondition.NEEDS_RENOVATION, label: 'Needs Renovation', description: 'Requires significant work' }
];

const MAINTENANCE_OPTIONS = ['Excellent', 'Good', 'Fair', 'Needs Attention'];

const ConditionStep: React.FC<ConditionStepProps> = ({ data, errors: _errors, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Condition</h2>
        <p className="text-gray-600">Describe the current state of your property</p>
      </div>

      {/* Furnishing Status */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Furnishing Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FURNISHING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ furnishingStatus: option.value })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                data.furnishingStatus === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block font-semibold text-gray-900 mb-1">{option.label}</span>
              <span className="text-sm text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Building Condition */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Building Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILDING_CONDITIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ buildingCondition: option.value })}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                data.buildingCondition === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block font-semibold text-gray-900 mb-1">{option.label}</span>
              <span className="text-sm text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance Status */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Maintenance Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MAINTENANCE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ maintenanceStatus: option })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                data.maintenanceStatus === option
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Last Renovated */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Last Renovated (Optional)</h3>
        <input
          type="month"
          value={data.lastRenovated ? new Date(data.lastRenovated).toISOString().slice(0, 7) : ''}
          onChange={(e) => onChange({ lastRenovated: e.target.value ? new Date(e.target.value) : undefined })}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          When was the property last renovated or upgraded?
        </p>
      </div>
    </div>
  );
};

export default ConditionStep;
