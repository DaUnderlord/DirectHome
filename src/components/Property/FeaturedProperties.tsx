import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../UI/Container';

interface FeaturedPropertiesProps {
  title?: string;
  description?: string;
  limit?: number;
  showViewAll?: boolean;
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  title = 'Featured Properties',
  description,
  limit = 3,
  showViewAll = true,
}) => {
  // Mock data for now - in real implementation this would fetch from propertyService
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Container size="xl" className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      {description && <p className="text-gray-600 mb-8">{description}</p>}
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {!isLoading && !error && properties.length === 0 && (
        <p className="text-gray-500 text-center py-12">No featured properties available at the moment.</p>
      )}
      
      {!isLoading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-gray-600">Property Card Placeholder</p>
            </div>
          ))}
        </div>
      )}
      
      {showViewAll && properties.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            to="/search?featured=true" 
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Featured Properties
          </Link>
        </div>
      )}
    </Container>
  );
};

export default FeaturedProperties;