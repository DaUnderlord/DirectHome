import React from 'react';
import { Property, PropertyVerificationStatus } from '../../../types/property';
import { IconCalendarEvent, IconShieldCheck, IconAlertCircle } from '@tabler/icons-react';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Verification Status */}
      <div className="flex items-start">
        {property.verificationStatus === PropertyVerificationStatus.VERIFIED ? (
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <IconShieldCheck size={20} className="text-green-600" />
          </div>
        ) : property.verificationStatus === PropertyVerificationStatus.PENDING ? (
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <IconAlertCircle size={20} className="text-yellow-600" />
          </div>
        ) : (
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <IconAlertCircle size={20} className="text-red-600" />
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium text-gray-900">Verification Status</h4>
          <p className="text-sm text-gray-500">
            {property.verificationStatus === PropertyVerificationStatus.VERIFIED
              ? 'This property has been verified by our team'
              : property.verificationStatus === PropertyVerificationStatus.PENDING
              ? 'Verification in progress'
              : 'Not verified'}
          </p>
        </div>
      </div>

      {/* Available From */}
      <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <IconCalendarEvent size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">Available From</h4>
          <p className="text-sm text-gray-500">
            {formatDate(property.availability.availableFrom)}
          </p>
        </div>
      </div>

      {/* Minimum Stay */}
      {property.availability.minimumStay && (
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <IconCalendarEvent size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Minimum Stay</h4>
            <p className="text-sm text-gray-500">
              {property.availability.minimumStay} {property.availability.minimumStay === 1 ? 'month' : 'months'}
            </p>
          </div>
        </div>
      )}

      {/* Maximum Stay */}
      {property.availability.maximumStay && (
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <IconCalendarEvent size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Maximum Stay</h4>
            <p className="text-sm text-gray-500">
              {property.availability.maximumStay} {property.availability.maximumStay === 1 ? 'month' : 'months'}
            </p>
          </div>
        </div>
      )}

      {/* Property ID */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Property ID: <span className="font-mono">{property.id}</span>
        </p>
        <p className="text-xs text-gray-500">
          Listed on: {formatDate(property.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PropertyInfo;