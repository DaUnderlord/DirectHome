import React from 'react';
import {
  IconHome,
  IconSearch,
  IconCoin,
  IconShieldCheck,
  IconArrowRight,
  IconMapPin,
  IconBuildingSkyscraper,
  IconBed,
  IconBath,
  IconStar,
  IconChevronRight,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconHeartFilled,
  IconMessage,
  IconDashboard
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';
import { useAuth } from '../../context/AuthContext';

// Mock featured properties
const featuredProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Lekki',
    location: 'Lekki Phase 1, Lagos',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    bedrooms: 3,
    bathrooms: 2,
    type: 'Apartment'
  },
  {
    id: '2',
    title: 'Spacious Family Home in Ikeja',
    location: 'Ikeja GRA, Lagos',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    bedrooms: 4,
    bathrooms: 3,
    type: 'House'
  },
  {
    id: '3',
    title: 'Luxury Studio in Victoria Island',
    location: 'Victoria Island, Lagos',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    bedrooms: 1,
    bathrooms: 1,
    type: 'Studio'
  }
];

// Mock testimonials
const testimonials = [
  {
    id: 1,
    content: "This platform made finding my dream apartment incredibly easy. No agent fees meant I saved over ₦200,000!",
    author: "Chioma Okafor",
    position: "Home Seeker",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
  },
  {
    id: 2,
    content: "As a property owner, I've found reliable tenants faster than ever before. The verification system gives me peace of mind.",
    author: "Emmanuel Adeyemi",
    position: "Property Owner",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
  },
  {
    id: 3,
    content: "The transparency on this platform is refreshing. What you see is what you get, and the direct communication with owners is invaluable.",
    author: "Amina Ibrahim",
    position: "Home Seeker",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
  }
];

// Stats
const stats = [
  { value: '5,000+', label: 'Active Listings' },
  { value: '₦500M+', label: 'Saved in Fees' },
  { value: '15,000+', label: 'Happy Users' },
  { value: '98%', label: 'Verified Properties' }
];

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[600px] md:h-[700px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Your Perfect Home in Nigeria
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Connect directly with homeowners. No middlemen, no extra fees.
              Save thousands while finding your dream home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <IconSearch className="w-5 h-5 mr-2" />
                Find Properties
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                >
                  <IconDashboard className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth/login?redirect=list-property"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                >
                  <IconHome className="w-5 h-5 mr-2" />
                  List Your Property
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <IconCoin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Money</h3>
              <p className="text-gray-600 leading-relaxed">
                No agent fees or commissions. Deal directly with property owners and save thousands on your next home.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <IconShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Listings</h3>
              <p className="text-gray-600 leading-relaxed">
                All properties are verified for authenticity. What you see is what you get, with no surprises when you visit.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <IconSearch className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find your perfect home with our advanced search filters and interactive map. Filter by location, price, and amenities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
            <Link
              to="/search"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Properties
              <IconArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200">
                    <IconHeartFilled className="w-5 h-5 text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
                    {formatCurrency(property.price)}/month
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <IconMapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm line-clamp-1">{property.location}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <IconBuildingSkyscraper className="w-3 h-3 mr-1" />
                        {property.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <IconBed className="w-3 h-3 mr-1" />
                        {property.bedrooms} Beds
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <IconBath className="w-3 h-3 mr-1" />
                        {property.bathrooms} Baths
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
                  >
                    View Details
                    <IconChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>      {/*
 Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className="w-5 h-5 text-blue-600 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconSearch className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse verified properties with detailed information and high-quality photos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconMessage className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Message homeowners directly to ask questions and schedule viewings.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconHome className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Move In</h3>
              <p className="text-gray-600 leading-relaxed">
                Finalize details directly with the owner and move into your new home.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Ready to Find Your Perfect Home?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Join thousands of Nigerians who have found their dream homes without paying agent fees.
                  Start your search today or list your property to connect directly with interested buyers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/search"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Start Searching
                  </Link>
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/auth/login?redirect=list-property"
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      List Your Property
                    </Link>
                  )}
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80"
                  alt="Modern living room"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;