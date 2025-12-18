import React from 'react';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import { PropertyOnboarding, PropertyCategory } from '../../../types/propertyOwner';

interface ReviewStepProps {
  formData: Partial<PropertyOnboarding>;
  onEdit: (step: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onEdit }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const Section = ({ 
    title, 
    step, 
    children 
  }: { 
    title: string; 
    step: number; 
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <IconEdit size={16} className="mr-1" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Listing</h2>
        <p className="text-gray-600">Please review all information before submitting</p>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information" step={1}>
        <div className="space-y-1">
          <InfoRow label="Property Title" value={formData.basicInfo?.title} />
          <InfoRow label="Property Type" value={formData.basicInfo?.propertyType?.replace(/_/g, ' ')} />
          <InfoRow label="Category" value={formData.basicInfo?.category?.replace(/_/g, ' ')} />
          <InfoRow label="Size" value={formData.basicInfo?.size ? `${formData.basicInfo.size} sqm` : undefined} />
          <InfoRow 
            label="Landmarks" 
            value={formData.basicInfo?.landmarks?.length ? formData.basicInfo.landmarks.join(', ') : undefined} 
          />
        </div>
        {formData.basicInfo?.description && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.basicInfo.description}</p>
          </div>
        )}
      </Section>

      {/* Location */}
      <Section title="Location" step={2}>
        <div className="space-y-1">
          <InfoRow label="Address" value={formData.location?.fullAddress} />
          <InfoRow label="State" value={formData.location?.state} />
          <InfoRow label="LGA" value={formData.location?.lga} />
          <InfoRow label="Access Route" value={formData.location?.accessRoute} />
        </div>
      </Section>

      {/* Features */}
      <Section title="Property Features" step={3}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InfoRow label="Bedrooms" value={formData.features?.bedrooms} />
          <InfoRow label="Bathrooms" value={formData.features?.bathrooms} />
          <InfoRow label="Toilets" value={formData.features?.toilets} />
          <InfoRow label="Parking" value={formData.features?.parkingSpaces} />
          <InfoRow label="Kitchen" value={formData.features?.kitchenType?.replace(/_/g, ' ')} />
          <InfoRow label="Power Supply" value={formData.features?.powerSupply?.replace(/_/g, ' ')} />
          <InfoRow label="Water Source" value={formData.features?.waterSource?.replace(/_/g, ' ')} />
        </div>
        
        {formData.features?.securityFeatures && formData.features.securityFeatures.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Security Features:</p>
            <div className="flex flex-wrap gap-2">
              {formData.features.securityFeatures.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.features?.amenities && formData.features.amenities.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {formData.features.amenities.map((amenity, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Condition */}
      <Section title="Property Condition" step={4}>
        <div className="space-y-1">
          <InfoRow label="Furnishing" value={formData.condition?.furnishingStatus?.replace(/_/g, ' ')} />
          <InfoRow label="Building Condition" value={formData.condition?.buildingCondition?.replace(/_/g, ' ')} />
          <InfoRow label="Maintenance Status" value={formData.condition?.maintenanceStatus} />
        </div>
      </Section>

      {/* Media */}
      <Section title="Media" step={5}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Images: {formData.media?.images?.length || 0} uploaded
            </p>
            {formData.media?.images && formData.media.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {formData.media.images.slice(0, 8).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Property ${i + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
          <InfoRow label="Videos" value={`${formData.media?.videos?.length || 0} uploaded`} />
          <InfoRow label="Virtual Tour" value={formData.media?.virtualTour ? 'Added' : 'Not added'} />
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing" step={6}>
        <div className="space-y-1">
          <InfoRow 
            label={formData.basicInfo?.category === PropertyCategory.SALE ? 'Sale Price' : 'Rent Price'} 
            value={formData.pricing?.rentPrice ? formatCurrency(formData.pricing.rentPrice) : undefined} 
          />
          <InfoRow label="Payment Cycle" value={formData.pricing?.paymentCycle?.replace(/_/g, ' ')} />
          {formData.pricing?.cautionFee && (
            <InfoRow label="Caution Fee" value={formatCurrency(formData.pricing.cautionFee)} />
          )}
          {formData.pricing?.legalFee && (
            <InfoRow label="Legal Fee" value={formatCurrency(formData.pricing.legalFee)} />
          )}
          {formData.pricing?.serviceCharge && (
            <InfoRow label="Service Charge" value={formatCurrency(formData.pricing.serviceCharge)} />
          )}
          {formData.pricing?.agencyFee && (
            <InfoRow label="Agency Fee" value={formatCurrency(formData.pricing.agencyFee)} />
          )}
          <InfoRow label="Negotiable" value={formData.pricing?.negotiable ? 'Yes' : 'No'} />
        </div>
      </Section>

      {/* Submission Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <IconCheck size={24} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Ready to Submit?</h4>
            <p className="text-sm text-gray-600">
              Once submitted, your property will be reviewed by our team within 24-48 hours. 
              You'll receive a notification when it's approved and live on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
