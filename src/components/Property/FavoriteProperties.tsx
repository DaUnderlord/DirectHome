import React from 'react';
import { Link } from 'react-router-dom';
import { IconHeart, IconMapPin, IconBed, IconBath } from '@tabler/icons-react';
import Container from '../UI/Container';
import { usePropertyFavorites } from '../../hooks/usePropertyFavorites';

interface FavoritePropertiesProps {
  title?: string;
  description?: string;
  limit?: number;
  showViewAll?: boolean;
  showClearAll?: boolean;
}

const FavoriteProperties: React.FC<FavoritePropertiesProps> = ({
  title = 'My Favorites',
  description,
  limit,
  showViewAll = true,
  showClearAll = true,
}) => {
  const { favorites, clearFavorites, removeFromFavorites } = usePropertyFavorites();
  const displayedProperties = limit ? favorites.slice(0, limit) : favorites;

  const formatPrice = (price: number, currency: string = 'NGN', frequency?: string): string => {
    return (
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(price) + (frequency ? `/${frequency}` : '')
    );
  };

  return (
    <Container size="xl" className="py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

        {showClearAll && favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {description && <p className="text-gray-600 mb-8">{description}</p>}

      {favorites.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <IconHeart size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite properties yet</h3>
          <p className="text-gray-600 mb-6">Save properties you like by clicking the heart icon.</p>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/property/${property.id}`}>
                <div className="relative h-40">
                  <img
                    src={property.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-2 py-1 m-2 text-xs font-semibold rounded">
                    {formatPrice(
                      property.pricing.price,
                      property.pricing.currency,
                      property.pricing.paymentFrequency
                    )}
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <Link to={`/property/${property.id}`} className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <IconMapPin size={14} className="mr-1 shrink-0" />
                      <span className="line-clamp-1">{property.location.city}</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromFavorites(property.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                    aria-label="Remove from favorites"
                  >
                    <IconHeart size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
                  <span className="flex items-center">
                    <IconBed size={14} className="mr-1" />
                    {property.features.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <IconBath size={14} className="mr-1" />
                    {property.features.bathrooms}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showViewAll && limit && favorites.length > limit && (
        <div className="text-center mt-8">
          <Link
            to="/favorites"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Favorites
          </Link>
        </div>
      )}
    </Container>
  );
};

export default FavoriteProperties;
