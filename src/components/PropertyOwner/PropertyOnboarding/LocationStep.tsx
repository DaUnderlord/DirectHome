import React from 'react';
import { IconMapPin } from '@tabler/icons-react';
import { NIGERIAN_STATES, LAGOS_LGAS } from '../../../types/propertyOwner';

interface LocationStepProps {
  data: {
    fullAddress: string;
    state: string;
    lga: string;
    latitude?: number;
    longitude?: number;
    accessRoute: string;
  };
  errors: Record<string, string>;
  onChange: (data: Partial<LocationStepProps['data']>) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ data, errors, onChange }) => {
  const getLGAsForState = (state: string): string[] => {
    if (state === 'Lagos') return LAGOS_LGAS;
    return [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Location</h2>
        <p className="text-gray-600">Help tenants find your property easily</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.fullAddress}
          onChange={(e) => onChange({ fullAddress: e.target.value })}
          placeholder="e.g., 15 Admiralty Way, Lekki Phase 1"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors['location.fullAddress'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['location.fullAddress'] && (
          <p className="mt-1 text-sm text-red-500">{errors['location.fullAddress']}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value, lga: '' })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors['location.state'] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors['location.state'] && (
            <p className="mt-1 text-sm text-red-500">{errors['location.state']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local Government Area <span className="text-red-500">*</span>
          </label>
          <select
            value={data.lga}
            onChange={(e) => onChange({ lga: e.target.value })}
            disabled={!data.state}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              errors['location.lga'] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select LGA</option>
            {getLGAsForState(data.state).map((lga) => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
          {errors['location.lga'] && (
            <p className="mt-1 text-sm text-red-500">{errors['location.lga']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Route Description
        </label>
        <textarea
          value={data.accessRoute}
          onChange={(e) => onChange({ accessRoute: e.target.value })}
          placeholder="Describe how to get to the property from a major landmark..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Help visitors find your property with clear directions
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start">
          <IconMapPin size={24} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Map Location (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pin your exact location on the map for better visibility
            </p>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Map integration coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep;
