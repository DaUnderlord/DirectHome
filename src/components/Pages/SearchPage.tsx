import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSearch,
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler,
  IconHeart,
  IconHeartFilled,
  IconAdjustmentsHorizontal,
  IconGridDots,
  IconList,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconShieldCheck,
  IconStar,
  IconHome,
  IconBuilding,
  IconCurrencyNaira,
  IconFilter,
  IconSortAscending,
  IconMap,
  IconSparkles,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react';
import { mockDataService } from '../../services/mockData';
import { propertyDbService } from '../../services/propertyService';
import { Property, PropertyType, ListingType } from '../../types/property';

// Brand Colors
const brand = {
  navy: '#1e4a6d',
  navyLight: '#2a5f8a',
  navyDark: '#153a55',
  gold: '#c9a962',
  goldLight: '#d4b97a',
  goldDark: '#b8944d',
  sage: '#6b8e6b',
  sageLight: '#7fa37f',
  sageDark: '#5a7a5a',
};

// Hero background images
const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop',
];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('type') || '',
    listingType: searchParams.get('listing') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('beds') || '',
    bathrooms: searchParams.get('baths') || '',
    furnished: searchParams.get('furnished') === 'true',
    verified: searchParams.get('verified') === 'true',
    petsAllowed: searchParams.get('pets') === 'true',
  });

  const propertiesPerPage = 9;

  const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin City', 'Kaduna'];
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: IconBuilding },
    { value: 'house', label: 'House', icon: IconHome },
    { value: 'duplex', label: 'Duplex', icon: IconBuilding },
    { value: 'self-contain', label: 'Self Contain', icon: IconHome },
    { value: 'mini-flat', label: 'Mini Flat', icon: IconBuilding },
  ];

  const priceRanges = [
    { min: '', max: '500000', label: 'Under ₦500K' },
    { min: '500000', max: '1000000', label: '₦500K - ₦1M' },
    { min: '1000000', max: '2000000', label: '₦1M - ₦2M' },
    { min: '2000000', max: '5000000', label: '₦2M - ₦5M' },
    { min: '5000000', max: '', label: 'Above ₦5M' },
  ];

  // Fetch properties from database with fallback to mock data
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Try to fetch from database first
        const response = await propertyDbService.searchProperties({
          search: filters.search,
          location: filters.location,
          propertyType: filters.propertyType,
          listingType: filters.listingType,
          minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
          bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
          bathrooms: filters.bathrooms ? parseInt(filters.bathrooms) : undefined,
          furnished: filters.furnished,
          verified: filters.verified,
          petsAllowed: filters.petsAllowed,
          sortBy,
        });
        
        if (response.success && response.properties.length > 0) {
          setProperties(response.properties);
        } else {
          // Fallback to mock data if database is empty or fails
          const mockProperties = mockDataService.getProperties();
          setProperties(mockProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to mock data on error
        const mockProperties = mockDataService.getProperties();
        setProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [filters.search, filters.location, filters.propertyType, filters.listingType, 
      filters.minPrice, filters.maxPrice, filters.bedrooms, filters.bathrooms,
      filters.furnished, filters.verified, filters.petsAllowed, sortBy]);

  // Apply filters and sorting
  const filteredProperties = useMemo(() => {
    let results = [...properties];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.location.city.toLowerCase().includes(searchTerm) ||
        p.location.address.toLowerCase().includes(searchTerm)
      );
    }

    // Location filter
    if (filters.location) {
      results = results.filter(p =>
        p.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.location.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Property type filter
    if (filters.propertyType) {
      results = results.filter(p => p.propertyType === filters.propertyType);
    }

    // Listing type filter
    if (filters.listingType) {
      results = results.filter(p => p.listingType === filters.listingType);
    }

    // Price filters
    if (filters.minPrice) {
      results = results.filter(p => p.pricing.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.pricing.price <= parseInt(filters.maxPrice));
    }

    // Bedroom filter
    if (filters.bedrooms) {
      results = results.filter(p => p.features.bedrooms >= parseInt(filters.bedrooms));
    }

    // Bathroom filter
    if (filters.bathrooms) {
      results = results.filter(p => p.features.bathrooms >= parseInt(filters.bathrooms));
    }

    // Boolean filters
    if (filters.furnished) {
      results = results.filter(p => p.features.furnished);
    }
    if (filters.verified) {
      results = results.filter(p => p.verificationStatus === 'verified');
    }
    if (filters.petsAllowed) {
      results = results.filter(p => p.features.petsAllowed);
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        results.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case 'price_high':
        results.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        results.sort((a, b) => (b.analytics?.viewCount || 0) - (a.analytics?.viewCount || 0));
        break;
    }

    return results;
  }, [properties, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnished: false,
      verified: false,
      petsAllowed: false,
    });
    setCurrentPage(1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Header with Background Image */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentHeroImage]}
                alt="Properties"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(135deg, ${brand.navyDark}dd 0%, ${brand.navy}cc 50%, ${brand.navyLight}aa 100%)` 
            }}
          />
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${brand.gold} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${brand.sage} 0%, transparent 70%)` }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating Property Cards Preview */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-xl shadow-2xl overflow-hidden w-48"
                style={{
                  top: i * 30,
                  right: i * 20,
                  zIndex: 3 - i,
                  opacity: 1 - i * 0.2
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
              >
                <img
                  src={heroImages[i]}
                  alt=""
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Browse {properties.length.toLocaleString()}+ verified properties across Nigeria
            </p>
          </motion.div>

          {/* Main Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by location, property name..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                />
              </div>

              {/* Location Select */}
              <div className="relative">
                <IconMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                  style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>

              {/* Search Button */}
              <button
                className="py-4 px-8 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                style={{ backgroundColor: brand.navy }}
              >
                <IconSearch size={20} />
                Search
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Quick filters:</span>
              {['Verified Only', 'Furnished', 'Pet Friendly'].map((filter) => {
                const key = filter === 'Verified Only' ? 'verified' : filter === 'Furnished' ? 'furnished' : 'petsAllowed';
                const isActive = filters[key as keyof typeof filters];
                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(key, !isActive)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={isActive ? { backgroundColor: brand.sage } : {}}
                  >
                    {filter}
                  </button>
                );
              })}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ backgroundColor: `${brand.navy}10`, color: brand.navy }}
              >
                <IconAdjustmentsHorizontal size={18} />
                More Filters
                {activeFiltersCount > 0 && (
                  <span 
                    className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: brand.gold }}
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                  >
                    <option value="">All Types</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                  >
                    <option value="">All Properties</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <div className="relative">
                    <IconCurrencyNaira className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <div className="relative">
                    <IconCurrencyNaira className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}+ beds</option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}+ baths</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium hover:underline"
                  style={{ color: brand.navy }}
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: brand.navy }}>
                {filteredProperties.length.toLocaleString()} Properties Found
              </h2>
              {filters.location && (
                <p className="text-gray-600">in {filters.location}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer text-sm"
                  style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <IconSortAscending className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                  }`}
                  style={viewMode === 'grid' ? { color: brand.navy } : { color: '#9ca3af' }}
                >
                  <IconGridDots size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : ''
                  }`}
                  style={viewMode === 'list' ? { color: brand.navy } : { color: '#9ca3af' }}
                >
                  <IconList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div 
                className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mb-4"
                style={{ borderColor: `${brand.navy}30`, borderTopColor: brand.navy }}
              />
              <p className="text-gray-500">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl shadow-sm"
            >
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${brand.navy}10` }}
              >
                <IconHome size={40} style={{ color: brand.navy }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: brand.navy }}>No Properties Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any properties matching your criteria. Try adjusting your filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-white rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: brand.navy }}
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            /* Property Grid/List */
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {currentProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredProperty(property.id)}
                    onMouseLeave={() => setHoveredProperty(null)}
                  >
                    {viewMode === 'grid' ? (
                      /* Grid Card */
                      <Link
                        to={`/property/${property.id}`}
                        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {property.verificationStatus === 'verified' && (
                              <span 
                                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                                style={{ backgroundColor: brand.sage }}
                              >
                                <IconShieldCheck size={14} /> Verified
                              </span>
                            )}
                            {property.featured && (
                              <span 
                                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                                style={{ backgroundColor: brand.gold }}
                              >
                                <IconStar size={14} /> Featured
                              </span>
                            )}
                          </div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(property.id);
                            }}
                            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              favorites.includes(property.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {favorites.includes(property.id) ? (
                              <IconHeartFilled size={20} />
                            ) : (
                              <IconHeart size={20} />
                            )}
                          </button>

                          {/* Price Badge */}
                          <div 
                            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl text-white font-bold"
                            style={{ backgroundColor: brand.navy }}
                          >
                            {formatPrice(property.pricing.price)}
                            <span className="text-xs font-normal opacity-70">
                              /{property.pricing.paymentFrequency || 'year'}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-opacity-80">
                            {property.title}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                            <IconMapPin size={16} style={{ color: brand.gold }} />
                            <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                          </p>
                          
                          {/* Features */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                            <span className="flex items-center gap-1.5">
                              <IconBed size={18} style={{ color: brand.navy }} />
                              {property.features.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-1.5">
                              <IconBath size={18} style={{ color: brand.navy }} />
                              {property.features.bathrooms} Baths
                            </span>
                            <span className="flex items-center gap-1.5">
                              <IconRuler size={18} style={{ color: brand.navy }} />
                              {property.features.squareFootage}m²
                            </span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      /* List Card */
                      <Link
                        to={`/property/${property.id}`}
                        className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        {/* Image */}
                        <div className="relative w-72 h-48 flex-shrink-0 overflow-hidden">
                          <img
                            src={property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {property.verificationStatus === 'verified' && (
                              <span 
                                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                                style={{ backgroundColor: brand.sage }}
                              >
                                <IconShieldCheck size={14} /> Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-opacity-80">
                                {property.title}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavorite(property.id);
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  favorites.includes(property.id)
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                {favorites.includes(property.id) ? (
                                  <IconHeartFilled size={20} />
                                ) : (
                                  <IconHeart size={20} />
                                )}
                              </button>
                            </div>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                              <IconMapPin size={16} style={{ color: brand.gold }} />
                              {property.location.address}, {property.location.city}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {property.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Features */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <IconBed size={18} style={{ color: brand.navy }} />
                                {property.features.bedrooms}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <IconBath size={18} style={{ color: brand.navy }} />
                                {property.features.bathrooms}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <IconRuler size={18} style={{ color: brand.navy }} />
                                {property.features.squareFootage}m²
                              </span>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-2xl font-bold" style={{ color: brand.navy }}>
                                {formatPrice(property.pricing.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                per {property.pricing.paymentFrequency || 'year'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <IconChevronLeft size={20} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all ${
                          currentPage === pageNum
                            ? 'text-white shadow-lg'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                        style={currentPage === pageNum ? { backgroundColor: brand.navy } : {}}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <IconChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyLight} 100%)` }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Can't Find What You're Looking For?
                </h3>
                <p className="text-white/80 max-w-xl">
                  Create a saved search and we'll notify you when new properties matching your criteria are listed.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/auth/register"
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: brand.gold, color: brand.navyDark }}
                >
                  <IconSparkles size={20} />
                  Create Alert
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
