import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { 
  IconX, 
  IconHeart, 
  IconHeartFilled,
  IconBed, 
  IconBath, 
  IconRuler,
  IconMapPin,
  IconCalendar,
  IconMessage,
  IconPhone,
  IconEye,
  IconShare,
  IconStar,
  IconWifi,
  IconCar,
  IconShield,
  IconCheck
} from '@tabler/icons-react';

export interface PropertyDetailsPanelProps {
  property: Property | null;
  onClose: () => void;
  onFavoriteToggle?: (propertyId: string) => void;
  onScheduleViewing?: (propertyId: string) => void;
  onContactOwner?: (propertyId: string) => void;
  isFavorite?: boolean;
  className?: string;
  isMobile?: boolean;
}

const PropertyDetailsPanel: React.FC<PropertyDetailsPanelProps> = ({
  property,
  onClose,
  onFavoriteToggle,
  onScheduleViewing,
  onContactOwner,
  isFavorite = false,
  className = '',
  isMobile = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return IconWifi;
    } else if (amenityLower.includes('parking') || amenityLower.includes('garage')) {
      return IconCar;
    } else if (amenityLower.includes('security') || amenityLower.includes('guard')) {
      return IconShield;
    } else {
      return IconCheck;
    }
  };

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className={`bg-white ${isMobile ? 'rounded-t-xl' : 'rounded-xl'} shadow-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>Property Details</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close property details"
        >
          <IconX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className={`${isMobile ? 'max-h-[80vh]' : 'max-h-[600px]'} overflow-y-auto`}>
        {/* Image Gallery */}
        <div className="relative">
          {property.images.length > 0 ? (
            <>
              <img
                src={property.images[currentImageIndex]?.url || 'https://via.placeholder.com/400x250'}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        {/* Property Content */}
        <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-4`}>
          {/* Title and Price */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-1`}>{property.title}</h4>
              <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-2`}>
                <IconMapPin className="w-4 h-4 mr-1" />
                <span>{property.location.address}, {property.location.city}</span>
              </div>
            </div>
            <button
              onClick={() => onFavoriteToggle?.(property.id)}
              className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 rounded-lg transition-colors`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <IconHeartFilled className="w-5 h-5 text-red-500" />
              ) : (
                <IconHeart className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Price and Type */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.pricing.price)}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {property.listingType === 'rent' ? '/month' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {property.type}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                For {property.listingType}
              </span>
            </div>
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <IconBed className="w-4 h-4 mr-1" />
              <span>{property.features.bedrooms} bed{property.features.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <IconBath className="w-4 h-4 mr-1" />
              <span>{property.features.bathrooms} bath{property.features.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <IconRuler className="w-4 h-4 mr-1" />
              <span>{property.features.area} sqft</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Description</h5>
            <p className="text-sm text-gray-600 line-clamp-3">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.features.amenities && property.features.amenities.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
              <div className="grid grid-cols-2 gap-2">
                {property.features.amenities.slice(0, 6).map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <IconComponent className="w-4 h-4 mr-2 text-green-500" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  );
                })}
                {property.features.amenities.length > 6 && (
                  <div className="text-sm text-gray-500 col-span-2">
                    +{property.features.amenities.length - 6} more amenities
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Stats */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <IconEye className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm font-medium text-gray-900">Views</span>
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {property.stats?.views || 0}
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <IconCalendar className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm font-medium text-gray-900">Listed</span>
              </div>
              <span className="text-sm text-gray-600">
                {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              to={`/properties/${property.id}`}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
            >
              View Full Details
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onScheduleViewing?.(property.id)}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <IconCalendar className="w-4 h-4 mr-1" />
                Schedule Tour
              </button>
              
              <button
                onClick={() => onContactOwner?.(property.id)}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <IconMessage className="w-4 h-4 mr-1" />
                Contact
              </button>
            </div>
          </div>

          {/* Owner Info */}
          {property.owner && (
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-2">Listed by</h5>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {property.owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{property.owner.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <IconStar className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{property.owner.rating || 'No rating'}</span>
                  </div>
                </div>
                <button
                  onClick={() => onContactOwner?.(property.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <IconPhone className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="border-t pt-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    text: `Check out this property: ${property.title}`,
                    url: window.location.origin + `/properties/${property.id}`
                  });
                } else {
                  // Fallback to clipboard
                  navigator.clipboard.writeText(
                    window.location.origin + `/properties/${property.id}`
                  );
                }
              }}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <IconShare className="w-4 h-4 mr-2" />
              Share Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPanel;