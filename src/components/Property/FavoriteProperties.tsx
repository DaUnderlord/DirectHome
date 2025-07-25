import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../UI/Container';

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
  // Mock favorites data for now - in real implementation this would come from usePropertyFavorites hook
  const favorites: any[] = [];
  const clearFavorites = () => {
    // Mock function - in real implementation this would clear favorites
    console.log('Clear favorites');
  };
  
  // Apply limit if specified
  const displayedProperties = limit ? favorites.slice(0, limit) : favorites;

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
      
      {description && (
        <p className="text-gray-600 mb-8">{description}</p>
      )}
      
      {favorites.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-gray-600">Property Card Placeholder</p>
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