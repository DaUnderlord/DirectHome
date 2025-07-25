import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  IconCheck, 
  IconX, 
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler2,
  IconCalendar,
  IconPhoto,
  IconStar
} from '@tabler/icons-react';
import { PropertyType, ListingType } from '../../../types/property';

interface ReviewStepProps {
  form: UseFormReturn<any>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const { watch, setValue } = form;
  
  // Get form data
  const basicDetails = watch('basicDetails');
  const location = watch('location');
  const features = watch('features');
  const media = watch('media');
  const availability = watch('availability');
  const rules = watch('rules');
  
  // Format price
  const formatPrice = (price: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get property type label
  const getPropertyTypeLabel = (type: PropertyType): string => {
    switch (type) {
      case PropertyType.HOUSE:
        return 'House';
      case PropertyType.APARTMENT:
        return 'Apartment';
      case PropertyType.CONDO:
        return 'Condo';
      case PropertyType.TOWNHOUSE:
        return 'Townhouse';
      default:
        return type;
    }
  };
  
  // Get listing type label
  const getListingTypeLabel = (type: ListingType): string => {
    return type === ListingType.RENT ? 'For Rent' : 'For Sale';
  };
  
  // Get payment frequency label
  const getPaymentFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'annually':
        return 'Annually';
      case 'one-time':
        return 'One-time';
      default:
        return frequency;
    }
  };
  
  // Handle terms acceptance
  const handleTermsAcceptance = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('termsAccepted', event.target.checked);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium text-gray-700">
        Please review your property listing details before submitting.
      </p>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{basicDetails.title}</h2>
        
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            basicDetails.listingType === ListingType.RENT ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {getListingTypeLabel(basicDetails.listingType)}
          </span>
          
          <div className="text-xl font-bold text-blue-700">
            {formatPrice(basicDetails.price, basicDetails.currency)}
            {basicDetails.listingType === ListingType.RENT && (
              <span className="text-sm font-normal text-gray-500">
                /{getPaymentFrequencyLabel(basicDetails.paymentFrequency)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <IconMapPin size={16} className="mr-1" />
          <span className="text-sm">
            {location.address}, {location.city}, {location.state}
            {location.zipCode && `, ${location.zipCode}`}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <IconBed size={16} className="mr-1 text-gray-500" />
            <span className="text-sm">{features.bedrooms} {features.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          
          <div className="flex items-center">
            <IconBath size={16} className="mr-1 text-gray-500" />
            <span className="text-sm">{features.bathrooms} {features.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          
          <div className="flex items-center">
            <IconRuler2 size={16} className="mr-1 text-gray-500" />
            <span className="text-sm">{features.squareFootage} sq ft</span>
          </div>
          
          {features.yearBuilt && (
            <div className="flex items-center">
              <IconCalendar size={16} className="mr-1 text-gray-500" />
              <span className="text-sm">Built in {features.yearBuilt}</span>
            </div>
          )}
        </div>
        
        <hr className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-900 mb-2">Property Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500 block">Property Type</span>
            <span className="text-sm">{getPropertyTypeLabel(basicDetails.propertyType)}</span>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block">Price Negotiable</span>
            <span className="text-sm">{basicDetails.negotiable ? 'Yes' : 'No'}</span>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block">Furnished</span>
            <span className="text-sm">{features.furnished ? 'Yes' : 'No'}</span>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block">Pets Allowed</span>
            <span className="text-sm">{features.petsAllowed ? 'Yes' : 'No'}</span>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block">Available From</span>
            <span className="text-sm">{formatDate(availability.availableFrom)}</span>
          </div>
          
          {availability.minimumStay && (
            <div>
              <span className="text-xs text-gray-500 block">Minimum Stay</span>
              <span className="text-sm">{availability.minimumStay} months</span>
            </div>
          )}
        </div>
        
        <hr className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
        <p className="text-sm text-gray-700 mb-4">{basicDetails.description}</p>
        
        <hr className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-900 mb-2">Amenities</h3>
        {features.amenities && features.amenities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {features.amenities.map((amenity: string) => (
              <div key={amenity} className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <IconCheck size={10} className="text-blue-600" />
                </div>
                <span className="text-sm">{amenity.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No amenities specified</p>
        )}
        
        <hr className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-900 mb-2">Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${rules.smoking ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-2`}>
              {rules.smoking ? (
                <IconCheck size={10} className="text-green-600" />
              ) : (
                <IconX size={10} className="text-red-600" />
              )}
            </div>
            <span className="text-sm">Smoking {rules.smoking ? 'allowed' : 'not allowed'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${rules.pets ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-2`}>
              {rules.pets ? (
                <IconCheck size={10} className="text-green-600" />
              ) : (
                <IconX size={10} className="text-red-600" />
              )}
            </div>
            <span className="text-sm">Pets {rules.pets ? 'allowed' : 'not allowed'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${rules.parties ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-2`}>
              {rules.parties ? (
                <IconCheck size={10} className="text-green-600" />
              ) : (
                <IconX size={10} className="text-red-600" />
              )}
            </div>
            <span className="text-sm">Parties {rules.parties ? 'allowed' : 'not allowed'}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${rules.children ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-2`}>
              {rules.children ? (
                <IconCheck size={10} className="text-green-600" />
              ) : (
                <IconX size={10} className="text-red-600" />
              )}
            </div>
            <span className="text-sm">Children {rules.children ? 'allowed' : 'not allowed'}</span>
          </div>
        </div>
        
        {rules.additionalRules && rules.additionalRules.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-gray-800 mt-2 mb-1">Additional Rules</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {rules.additionalRules.map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </>
        )}
        
        <hr className="my-4" />
        
        <h3 className="text-sm font-medium text-gray-900 mb-2">Images ({media.images.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {media.images.map((image: any, index: number) => (
            <div key={image.id} className="relative">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption || `Property image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              
              {image.isPrimary && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <IconStar size={12} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={watch('termsAccepted') || false}
          onChange={handleTermsAcceptance}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          required
        />
        <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
          I confirm that all the information provided is accurate and I have the right to list this property.
          I agree to the terms and conditions of this platform.
        </label>
      </div>
    </div>
  );
};

export default ReviewStep;