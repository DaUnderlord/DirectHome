import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconRuler, 
  IconHeart,
  IconHeartFilled,
  IconShieldCheck
} from '@tabler/icons-react';
import { Property, PropertyVerificationStatus } from '../../types/property';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  compact?: boolean;
  onView?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'glass' | 'premium';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isFavorite = false,
  onToggleFavorite,
  compact = false,
  onView = false,
  onClick,
  className = '',
  variant = 'default'
}) => {
  const formatPrice = (price: number, currency: string = 'NGN', frequency?: string): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price) + (frequency ? `/${frequency}` : '');
  };

  // Find the primary image
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  const variantClasses = {
    default: 'bg-white shadow-sm border border-gray-200 hover:shadow-md',
    glass: 'glass-card hover:shadow-glass card-interactive',
    premium: 'glass-card hover:shadow-glass card-interactive bg-gradient-to-br from-white/20 to-white/10'
  };

  return (
    <div 
      className={`
        ${variantClasses[variant]} rounded-2xl overflow-hidden 
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''} 
        ${compact ? 'flex' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {/* Property Image */}
      <div 
        className={`block relative ${compact ? 'w-1/3' : 'w-full'}`}
      >
        <Link 
          to={`/property/${property.id}`} 
          className="block"
          onClick={(e) => onClick && e.preventDefault()}
        >
          <img
            src={primaryImage?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={property.title}
            className={`w-full ${compact ? 'h-full' : 'h-48'} object-cover`}
          />
        </Link>
        
        <div className="absolute bottom-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 m-3 text-sm font-bold rounded-xl shadow-lg backdrop-blur-sm">
          {formatPrice(
            property.pricing.price, 
            property.pricing.currency, 
            property.pricing.paymentFrequency
          )}
        </div>
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`
              absolute top-0 right-0 m-3 p-2.5 rounded-full 
              backdrop-blur-md transition-all duration-200 btn-interactive
              ${isFavorite 
                ? 'bg-red-500/20 text-red-500 shadow-glow-sm' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }
            `}
          >
            {isFavorite ? (
              <IconHeartFilled size={18} />
            ) : (
              <IconHeart size={18} />
            )}
          </button>
        )}
        
        {/* Verification Badge */}
        {property.verificationStatus === PropertyVerificationStatus.VERIFIED && (
          <div className="absolute top-0 left-0 m-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full flex items-center shadow-lg">
            <IconShieldCheck size={14} className="mr-1" />
            Verified
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className={`p-4 ${compact ? 'w-2/3' : 'w-full'}`}>
        <Link 
          to={`/property/${property.id}`} 
          className="block"
          onClick={(e) => onClick && e.preventDefault()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <IconMapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
          </div>
          
          {!compact && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
            <div className="flex items-center">
              <IconBed size={16} className="mr-1" />
              <span>{property.features.bedrooms} {property.features.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <IconBath size={16} className="mr-1" />
              <span>{property.features.bathrooms} {property.features.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center">
              <IconRuler size={16} className="mr-1" />
              <span>{property.features.squareFootage} sq ft</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;