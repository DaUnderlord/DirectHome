import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconSearch,
  IconMapPin,
  IconPhone,
  IconArrowRight,
  IconPlayerPlay,
  IconStar,
  IconBed,
  IconBath,
  IconRuler
} from '@tabler/icons-react';

import WhyChooseSection from '../UI/WhyChooseSection';
import TestimonialCarousel from '../UI/TestimonialCarousel';
import AnimatedCounter from '../UI/AnimatedCounter';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { mockPropertyService } from '../../services/mockPropertyData';
import { Property } from '../../types/property';

const HomePage: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Animation hooks for CTA section
  const { elementRef: ctaTextRef, isVisible: ctaTextVisible } = useScrollAnimation();
  const { elementRef: ctaImageRef, isVisible: ctaImageVisible } = useScrollAnimation();

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const response = await mockPropertyService.getFeaturedProperties();
        if (response.success) {
          setFeaturedProperties(response.properties.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };



  const testimonials = [
    {
      id: '1',
      name: 'Adebayo Johnson',
      role: 'Property Investor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'DirectHome made finding my dream property incredibly easy. The platform is intuitive and the support team is exceptional.',
      location: 'Lagos, Nigeria'
    },
    {
      id: '2',
      name: 'Fatima Abdullahi',
      role: 'First-time Buyer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'As a first-time buyer, I was nervous about the process. DirectHome guided me every step of the way. Highly recommended!',
      location: 'Abuja, Nigeria'
    },
    {
      id: '3',
      name: 'Chinedu Okafor',
      role: 'Real Estate Agent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'The best platform for real estate in Nigeria. Great features, reliable service, and excellent customer support.',
      location: 'Port Harcourt, Nigeria'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-blue-900/20 to-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Find Your
              <span className="block text-blue-600">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover premium properties across Nigeria with our trusted real estate platform.
              Your perfect home is just a search away.
            </p>

            {/* Search Bar */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <IconMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter location, property type, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 bg-white/90 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 btn-interactive shadow-lg hover:shadow-glow flex items-center justify-center space-x-2"
                >
                  <IconSearch size={20} />
                  <span className="font-semibold">Search</span>
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/search"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 btn-interactive shadow-lg hover:shadow-glow flex items-center space-x-2"
              >
                <span className="font-semibold">Explore Properties</span>
                <IconArrowRight size={20} />
              </Link>
              <button
                onClick={() => {
                  // List property functionality - redirect to auth or property listing
                  window.location.href = '/auth/login?redirect=list-property';
                }}
                className="px-8 py-4 glass-card text-white rounded-xl hover:bg-white/20 transition-all duration-200 btn-interactive flex items-center space-x-2"
              >
                
                <span className="font-semibold">+ List Property</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="glass-dark p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-gray-300">Properties Listed</p>
            </div>
            <div className="glass-dark p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={5000} suffix="+" />
              </div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="glass-dark p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <p className="text-gray-300">Cities Covered</p>
            </div>
            <div className="glass-dark p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-gray-300">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN → PROMISE BRIDGE Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Your Journey Made Simple</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">We've streamlined the housing process to just three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line - visible on md+ screens */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-y-1/2 z-0"></div>
            
            {/* Step 1: Search */}
            <div className="glass-dark p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 relative z-10 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
              <div className="text-center pt-6">
                <IconSearch size={48} className="mx-auto text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Search</h3>
                <p className="text-gray-300 mb-4">Browse verified properties that match your exact needs</p>
                <div className="bg-white/10 rounded-lg p-3 text-sm text-blue-100">
                  <span className="font-medium">No hidden fees</span> • What you see is what you pay
                </div>
              </div>
            </div>
            
            {/* Step 2: Book */}
            <div className="glass-dark p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 relative z-10 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
              <div className="text-center pt-6">
                <IconPhone size={48} className="mx-auto text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Book</h3>
                <p className="text-gray-300 mb-4">Schedule viewings directly with property owners</p>
                <div className="bg-white/10 rounded-lg p-3 text-sm text-blue-100">
                  <span className="font-medium">24h approval</span> • Quick response guaranteed
                </div>
              </div>
            </div>
            
            {/* Step 3: Move-in */}
            <div className="glass-dark p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 relative z-10 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
              <div className="text-center pt-6">
                <IconArrowRight size={48} className="mx-auto text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Move-in</h3>
                <p className="text-gray-300 mb-4">Sign your agreement and move into your new home</p>
                <div className="bg-white/10 rounded-lg p-3 text-sm text-blue-100">
                  <span className="font-medium">Secure process</span> • Verified properties only
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Continuous Scroll */}
      {!loading && featuredProperties.length > 0 && (
        <section className="py-20 overflow-hidden relative fade-carousel">
          {/* Extended Fade overlays - Hidden on mobile */}
          <div className="gradient-fade-left-extended hidden md:block"></div>
          <div className="gradient-fade-right-extended hidden md:block"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>

          <div className="flex animate-scroll-left space-x-6 pl-4">
            {/* Duplicate properties for seamless loop */}
            {[...featuredProperties, ...featuredProperties].map((property, index) => (
              <div key={`${property.id}-${index}`} className="flex-shrink-0 w-80">
                <div className="glass-card rounded-2xl overflow-hidden card-interactive hover:shadow-glass transition-all duration-300">
                  <div className="relative">
                    <img
                      src={property.images[0]?.url || 'https://via.placeholder.com/320x200'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 m-3 text-sm font-bold rounded-xl shadow-lg">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        maximumFractionDigits: 0,
                      }).format(property.pricing.price)}
                      {property.pricing.paymentFrequency && `/${property.pricing.paymentFrequency}`}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <IconMapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose DirectHome Section */}
      <WhyChooseSection />

      {/* Testimonials */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div 
              ref={ctaTextRef}
              className={`${
                ctaTextVisible ? 'animate-slide-in-left' : 'scroll-animate-hidden'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Find Your
                <span className="block text-blue-400">Perfect Home?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of satisfied customers who have found their dream properties through DirectHome.
                Start your journey today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 btn-interactive shadow-lg hover:shadow-glow flex items-center justify-center space-x-2"
                >
                  <span className="font-semibold">Get Started Free</span>
                  <IconArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 glass-card text-white rounded-xl hover:bg-white/20 transition-all duration-200 btn-interactive flex items-center justify-center space-x-2"
                >
                  <IconPhone size={20} />
                  <span className="font-semibold">Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div 
              ref={ctaImageRef}
              className={`relative ${
                ctaImageVisible ? 'animate-slide-in-right' : 'scroll-animate-hidden'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Modern luxury home"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-2xl">
                <div className="flex items-center space-x-2 text-white">
                  <IconStar className="text-yellow-400 fill-current" size={20} />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <p className="text-sm text-gray-300">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;