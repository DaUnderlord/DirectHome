import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertyType } from '../../../types/property';
import { mockDataService } from '../../../services/mockData';
import { propertyDbService } from '../../../services/propertyService';
import { allowMockDataFallback } from '../../../utils/env';
import { IconMapPin, IconBed, IconBath } from '@tabler/icons-react';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  propertyType: PropertyType;
  city: string;
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentPropertyId,
  propertyType,
  city,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSimilar = async () => {
      setLoading(true);

      try {
        const response = await propertyDbService.searchProperties({
          location: city,
          propertyType,
          limit: 6,
        });

        if (cancelled) return;

        let similar = response.properties.filter((property) => property.id !== currentPropertyId);

        if (similar.length === 0 && allowMockDataFallback) {
          similar = mockDataService
            .getProperties()
            .filter(
              (property) =>
                property.id !== currentPropertyId &&
                property.propertyType === propertyType &&
                property.location.city.toLowerCase() === city.toLowerCase()
            );
        }

        setProperties(similar.slice(0, 3));
      } catch (error) {
        console.error('Error loading similar properties:', error);
        if (!cancelled) {
          if (allowMockDataFallback) {
            const fallback = mockDataService
              .getProperties()
              .filter(
                (property) =>
                  property.id !== currentPropertyId &&
                  property.propertyType === propertyType &&
                  property.location.city.toLowerCase() === city.toLowerCase()
              )
              .slice(0, 3);
            setProperties(fallback);
          } else {
            setProperties([]);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSimilar();

    return () => {
      cancelled = true;
    };
  }, [currentPropertyId, propertyType, city]);

  const formatPrice = (price: number, currency: string = 'NGN', frequency?: string): string => {
    return (
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(price) + (frequency ? `/${frequency}` : '')
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No similar properties found in this area.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link
          key={property.id}
          to={`/property/${property.id}`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48">
            <img
              src={property.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 m-2 text-sm font-semibold rounded">
              {formatPrice(
                property.pricing.price,
                property.pricing.currency,
                property.pricing.paymentFrequency
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <IconMapPin size={14} className="mr-1" />
              <span className="line-clamp-1">
                {property.location.address}, {property.location.city}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
              <div className="flex items-center">
                <IconBed size={16} className="mr-1" />
                <span>
                  {property.features.bedrooms} {property.features.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
              <div className="flex items-center">
                <IconBath size={16} className="mr-1" />
                <span>
                  {property.features.bathrooms}{' '}
                  {property.features.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
              <div>
                <span>{property.features.squareFootage} sq ft</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SimilarProperties;
