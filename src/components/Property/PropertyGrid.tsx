import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconRuler, 
  IconSearch,
  IconAdjustments,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconHeartFilled
} from '@tabler/icons-react';
import { mockDataService } from '../../services/mockData';
import { Property, PropertyType, ListingType } from '../../types/property';
import FilterPanel from './FilterPanel';
import PropertyCard from './PropertyCard';
import Container from '../UI/Container';


interface PropertyGridProps {
  title?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  title = "Properties",
  showFilters = false,
  showPagination = false,
  featuredOnly = false,
  limit
}) => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  
  // Filter states - initialize with URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    furnished: false,
    petsAllowed: false,
    verified: false
  });
  
  const propertiesPerPage = 6;

  useEffect(() => {
    // Simulate API call to fetch properties
    setLoading(true);
    setTimeout(() => {
      let fetchedProperties = featuredOnly 
        ? mockDataService.getFeaturedProperties() 
        : mockDataService.getProperties();
        
      if (limit) {
        fetchedProperties = fetchedProperties.slice(0, limit);
      }
      
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setLoading(false);
    }, 500);
  }, [featuredOnly, limit]);

  useEffect(() => {
    // Apply filters
    let results = [...properties];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.location.city.toLowerCase().includes(searchTerm) ||
        property.location.address.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply property type filter
    if (filters.propertyType) {
      results = results.filter(property => property.propertyType === filters.propertyType);
    }
    
    // Apply listing type filter
    if (filters.listingType) {
      results = results.filter(property => property.listingType === filters.listingType);
    }
    
    // Apply price filters
    if (filters.minPrice) {
      results = results.filter(property => property.pricing.price >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      results = results.filter(property => property.pricing.price <= parseInt(filters.maxPrice));
    }
    
    // Apply bedroom filter
    if (filters.bedrooms) {
      results = results.filter(property => property.features.bedrooms >= parseInt(filters.bedrooms));
    }
    
    // Apply bathroom filter
    if (filters.bathrooms) {
      results = results.filter(property => property.features.bathrooms >= parseInt(filters.bathrooms));
    }
    
    // Apply location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      results = results.filter(property => 
        property.location.city.toLowerCase().includes(locationTerm) ||
        property.location.state.toLowerCase().includes(locationTerm)
      );
    }
    
    // Apply furnished filter
    if (filters.furnished) {
      results = results.filter(property => property.features.furnished);
    }
    
    // Apply pets allowed filter
    if (filters.petsAllowed) {
      results = results.filter(property => property.features.petsAllowed);
    }
    
    // Apply verified filter
    if (filters.verified) {
      results = results.filter(property => property.verificationStatus === 'verified');
    }
    
    setFilteredProperties(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, properties]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFilters(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      furnished: false,
      petsAllowed: false,
      verified: false
    });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Container>
    <div>
      {/* Header and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          
          {showFilters && (
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconSearch size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 px-8 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                <IconAdjustments size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && filtersOpen && (
        <div className="mb-6">
          <FilterPanel 
            filters={filters} 
            onChange={handleFilterChange} 
            onClear={clearFilters} 
          />
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
      </div>
      
      {/* Property Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">
            Try adjusting your search filters to find more properties.
          </p>
          {Object.values(filters).some(value => value !== '' && value !== false) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={() => toggleFavorite(property.id)}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md mr-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronLeft size={16} />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md ml-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronRight size={16} />
            </button>
          </nav>
        </div>
      )}
    </div>
    </Container>
  );
};

export default PropertyGrid;