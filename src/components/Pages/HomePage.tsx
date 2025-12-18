import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSearch,
  IconMapPin,
  IconArrowRight,
  IconHome,
  IconShieldCheck,
  IconClock,
  IconUsers,
  IconStar,
  IconBed,
  IconBath,
  IconRuler,
  IconChevronDown,
  IconSparkles,
  IconBuildingSkyscraper,
  IconKey,
  IconHeartHandshake,
  IconTrendingUp,
  IconPlayerPlay,
  IconX,
  IconHeart,
  IconCheck,
  IconQuote,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { mockPropertyService } from '../../services/mockPropertyData';
import { propertyDbService } from '../../services/propertyService';
import { Property } from '../../types/property';

// Brand Colors extracted from DirectHome logo
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

// Hero property images for the mosaic
const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        // Try to fetch from database first
        const dbResponse = await propertyDbService.getFeaturedProperties(6);
        if (dbResponse.success && dbResponse.properties.length > 0) {
          setFeaturedProperties(dbResponse.properties);
        } else {
          // Fallback to mock data
          const response = await mockPropertyService.getFeaturedProperties();
          if (response.success) {
            setFeaturedProperties(response.properties.slice(0, 6));
          }
        }
      } catch (error) {
        console.error('Error loading featured properties:', error);
        // Fallback to mock data on error
        try {
          const response = await mockPropertyService.getFeaturedProperties();
          if (response.success) {
            setFeaturedProperties(response.properties.slice(0, 6));
          }
        } catch (e) {
          console.error('Mock data fallback also failed:', e);
        }
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProperties();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    if (propertyType) params.set('type', propertyType);
    navigate(`/search?${params.toString()}`);
  };

  const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];
  const propertyTypes = ['Apartment', 'Duplex', 'Bungalow', 'Self-Contain', 'Mini Flat'];

  const testimonials = [
    {
      id: 1,
      name: 'Adebayo Johnson',
      role: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Found my dream apartment in Lekki within 2 days. No agent wahala, no hidden fees. DirectHome is a game changer!',
      location: 'Lagos',
      saved: '₦450,000',
      propertyImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Chioma Okafor',
      role: 'Medical Doctor',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
      content: 'As a busy professional, I needed a hassle-free way to find accommodation. DirectHome delivered beyond expectations.',
      location: 'Abuja',
      saved: '₦380,000',
      propertyImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Emeka Nwosu',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Listed my properties and got quality tenants directly. The verification system gives me peace of mind.',
      location: 'Port Harcourt',
      saved: '₦520,000',
      propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Amina Bello',
      role: 'Fashion Designer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      content: 'I was skeptical at first, but DirectHome proved me wrong. Found a beautiful studio apartment in VI within my budget!',
      location: 'Lagos',
      saved: '₦290,000',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Verified Properties', icon: IconBuildingSkyscraper },
    { value: '₦2.5B+', label: 'Agent Fees Saved', icon: IconTrendingUp },
    { value: '15,000+', label: 'Happy Tenants', icon: IconUsers },
    { value: '98%', label: 'Success Rate', icon: IconShieldCheck }
  ];

  const features = [
    {
      icon: IconShieldCheck,
      title: 'Verified Properties',
      description: 'Every listing is verified by our team. No fake properties, no scams.',
      color: brand.sage,
      image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop'
    },
    {
      icon: IconKey,
      title: 'Direct Access',
      description: 'Connect directly with property owners. Cut out the middlemen completely.',
      color: brand.navy,
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop'
    },
    {
      icon: IconHeartHandshake,
      title: 'Zero Agent Fees',
      description: 'Save hundreds of thousands in agent commissions. Pay only for your rent.',
      color: brand.gold,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop'
    },
    {
      icon: IconClock,
      title: '24hr Response',
      description: 'Get responses within 24 hours. Move into your new home faster.',
      color: brand.goldDark,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentHeroImage]}
                alt="Luxury Property"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradient Overlay - Reduced opacity for better image visibility */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(135deg, ${brand.navyDark}cc 0%, ${brand.navy}aa 40%, ${brand.navyLight}77 100%)` 
            }}
          />
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${brand.gold} 0%, transparent 70%)` }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full opacity-15"
              style={{ background: `radial-gradient(circle, ${brand.sage} 0%, transparent 70%)` }}
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: `${brand.gold}30`, border: `1px solid ${brand.gold}50` }}
              >
                <IconSparkles size={18} style={{ color: brand.gold }} />
                <span className="text-white font-medium">Nigeria's #1 No-Agent Platform</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Your Dream Home,
                <br />
                <span 
                  className="relative inline-block"
                  style={{ color: brand.gold }}
                >
                  Zero Agent Fees
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C80 2 220 2 298 10" stroke={brand.sage} strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                Connect directly with verified property owners across Nigeria. 
                Save up to <span className="font-bold text-white">₦500,000</span> in agent commissions 
                and find your perfect home faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: brand.gold, color: brand.navy }}
                >
                  <IconSearch size={18} />
                  Browse Properties
                </Link>
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/30 text-white hover:bg-white/10"
                  style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                >
                  <IconPlayerPlay size={18} />
                  Watch How It Works
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/40?img=${i + 10}`}
                        alt=""
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="text-white">
                    <span className="font-bold">15,000+</span>
                    <span className="text-white/70 text-sm block">Happy Tenants</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} size={18} className="fill-current" style={{ color: brand.gold }} />
                    ))}
                  </div>
                  <span className="text-white font-medium">4.9/5 Rating</span>
                </div>
              </div>

              {/* Search Box */}
              <div className="bg-white/95 rounded-2xl p-2 shadow-2xl max-w-xl border border-white/40">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Area, landmark, or keyword"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                      style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex-1 relative">
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none cursor-pointer text-sm"
                      style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                    >
                      <option value="">Location</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  <div className="flex-1 relative">
                    <IconHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none cursor-pointer text-sm"
                      style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                    >
                      <option value="">Type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyLight} 100%)` }}
                  >
                    <IconSearch size={20} />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-white/50 text-sm">Popular:</span>
                {['Lekki', 'Ikeja', 'VI', 'Yaba'].map((area) => (
                  <button
                    key={area}
                    onClick={() => { setSelectedLocation('Lagos'); setSearchQuery(area); handleSearch(); }}
                    className="px-3 py-1 rounded-full text-white/80 text-sm transition-all hover:bg-white/20 border border-white/20"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Property Cards Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative h-[550px]">
                {/* Background Cards */}
                <motion.div 
                  className="absolute top-16 left-8 w-64 h-72 rounded-3xl overflow-hidden shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold">₦1.8M/year</p>
                    <p className="text-sm opacity-80">3 Bed • Lekki</p>
                  </div>
                </motion.div>

                {/* Main Featured Card */}
                <motion.div 
                  className="absolute top-0 right-0 w-72 bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" 
                      alt="" 
                      className="w-full h-48 object-cover"
                    />
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1"
                      style={{ backgroundColor: brand.sage }}
                    >
                      <IconShieldCheck size={14} /> Verified
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <IconHeart size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold" style={{ color: brand.navy }}>₦2.4M</span>
                      <span className="text-gray-500 text-sm">/year</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Modern 4 Bedroom Duplex</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                      <IconMapPin size={14} /> Ikoyi, Lagos
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 pt-3 border-t">
                      <span className="flex items-center gap-1"><IconBed size={16} /> 4</span>
                      <span className="flex items-center gap-1"><IconBath size={16} /> 3</span>
                      <span className="flex items-center gap-1"><IconRuler size={16} /> 280m²</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Card */}
                <motion.div 
                  className="absolute bottom-0 left-16 w-56 h-64 rounded-3xl overflow-hidden shadow-2xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold">₦950K/year</p>
                    <p className="text-sm opacity-80">2 Bed • Yaba</p>
                  </div>
                </motion.div>

                {/* Floating Stats Badge */}
                <motion.div 
                  className="absolute bottom-20 right-4 bg-white rounded-2xl p-4 shadow-xl z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${brand.gold}20` }}
                    >
                      <IconTrendingUp size={24} style={{ color: brand.gold }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">₦2.5B+</p>
                      <p className="text-xs text-gray-500">Agent fees saved</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentHeroImage ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 bg-white relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100 relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: brand.gold }}
            />
            <div 
              className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: brand.sage }}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div 
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                    style={{ background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyLight} 100%)` }}
                  >
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: brand.navy }}>{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PARTNERS/TRUST BADGES ==================== */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-6">Trusted by leading organizations across Nigeria</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['GTBank', 'Dangote', 'MTN', 'Access Bank', 'Flutterwave'].map((partner) => (
              <div key={partner} className="text-xl md:text-2xl font-bold text-gray-400">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: `${brand.sage}20`, color: brand.sage }}
            >
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: brand.navy }}>
              How DirectHome Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your new home. No agents, no stress, no hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                title: 'Search', 
                desc: 'Browse thousands of verified properties. Filter by location, price, and amenities.',
                icon: IconSearch, 
                color: brand.gold,
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
              },
              { 
                step: 2, 
                title: 'Connect', 
                desc: 'Contact property owners directly. Schedule viewings at your convenience.',
                icon: IconUsers, 
                color: brand.sage,
                image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=300&fit=crop'
              },
              { 
                step: 3, 
                title: 'Move In', 
                desc: 'Agree on terms, sign your lease, and move into your new home.',
                icon: IconKey, 
                color: brand.navy,
                image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div 
                      className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.step}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon size={24} style={{ color: item.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: brand.navy }}>{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES WITH IMAGES ==================== */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: brand.navy }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: `${brand.gold}30`, color: brand.gold }}
            >
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The DirectHome Advantage
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We're revolutionizing how Nigerians find homes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:bg-white/15 transition-all duration-300 flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Content */}
                  <div className="md:w-3/5 p-6 flex flex-col justify-center">
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                      style={{ backgroundColor: `${feature.color}30` }}
                    >
                      <feature.icon size={24} style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PROPERTIES ==================== */}
      {!loading && featuredProperties.length > 0 && (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
            >
              <div>
                <span 
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  style={{ backgroundColor: `${brand.gold}20`, color: brand.goldDark }}
                >
                  Featured Listings
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ color: brand.navy }}>
                  Trending Properties
                </h2>
                <p className="text-lg text-gray-600 max-w-xl">
                  Hand-picked properties getting the most attention right now.
                </p>
              </div>
              <Link
                to="/search"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 font-semibold transition-colors hover:gap-3"
                style={{ color: brand.navy }}
              >
                View All <IconArrowRight size={20} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/property/${property.id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span 
                            className="px-2 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                            style={{ backgroundColor: brand.sage }}
                          >
                            <IconShieldCheck size={12} /> Verified
                          </span>
                        </div>
                        <button 
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <IconHeart size={16} className="text-gray-600" />
                        </button>
                        <div 
                          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-white font-bold"
                          style={{ backgroundColor: brand.navy }}
                        >
                          {formatCurrency(property.pricing.price)}
                          <span className="text-xs font-normal opacity-70">/{property.pricing.paymentFrequency}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-opacity-80">
                          {property.title}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                          <IconMapPin size={14} style={{ color: brand.gold }} />
                          <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
                          <span className="flex items-center gap-1"><IconBed size={16} /> {property.features.bedrooms}</span>
                          <span className="flex items-center gap-1"><IconBath size={16} /> {property.features.bathrooms}</span>
                          <span className="flex items-center gap-1"><IconRuler size={16} /> {property.features.squareFootage}m²</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== TESTIMONIALS - REDESIGNED ==================== */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-1/3 h-full opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: `${brand.sage}20`, color: brand.sage }}
            >
              Success Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: brand.navy }}>
              Real People, Real Homes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of Nigerians who found their perfect homes through DirectHome.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Featured Testimonial */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={testimonials[activeTestimonial].propertyImage}
                  alt="Property"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Testimonial Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <IconQuote size={32} style={{ color: brand.gold }} className="mb-3 opacity-80" />
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-white text-lg leading-relaxed mb-4"
                    >
                      "{testimonials[activeTestimonial].content}"
                    </motion.p>
                  </AnimatePresence>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-14 h-14 rounded-full border-2 border-white object-cover"
                    />
                    <div>
                      <h4 className="text-white font-bold">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-white/70 text-sm">{testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeTestimonial ? 'w-8' : 'w-2'
                      }`}
                      style={{ backgroundColor: index === activeTestimonial ? brand.navy : `${brand.navy}30` }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <IconChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                    style={{ backgroundColor: brand.navy }}
                  >
                    <IconChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right - Stats & Mini Testimonials */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Savings Highlight */}
              <div 
                className="rounded-2xl p-6"
                style={{ backgroundColor: `${brand.gold}10`, border: `1px solid ${brand.gold}30` }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${brand.gold}20` }}
                  >
                    <IconTrendingUp size={32} style={{ color: brand.gold }} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: brand.navy }}>₦2.5B+</p>
                    <p className="text-gray-600">Total agent fees saved by our users</p>
                  </div>
                </div>
              </div>

              {/* Mini Testimonial Cards */}
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-4 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 ${
                    activeTestimonial === index ? 'ring-2' : ''
                  }`}
                  style={{ '--tw-ring-color': brand.navy } as React.CSSProperties}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <IconStar key={i} size={14} className="fill-current" style={{ color: brand.gold }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: `${brand.sage}15`, color: brand.sage }}
                    >
                      Saved {testimonial.saved}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== APP DOWNLOAD / NEWSLETTER ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${brand.sage}15 0%, ${brand.gold}10 100%)` }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span 
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  style={{ backgroundColor: `${brand.navy}15`, color: brand.navy }}
                >
                  Stay Updated
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: brand.navy }}>
                  Get New Listings in Your Inbox
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to know about new properties that match your preferences. No spam, just great homes.
                </p>
                <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': brand.gold } as React.CSSProperties}
                  />
                  <button 
                    className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: brand.navy }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div 
                    className="w-64 h-64 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${brand.navy}20 0%, ${brand.gold}20 100%)` }}
                  >
                    <div className="text-center">
                      <IconHome size={64} style={{ color: brand.navy }} className="mx-auto mb-2" />
                      <p className="font-bold text-lg" style={{ color: brand.navy }}>10,000+</p>
                      <p className="text-gray-600 text-sm">Properties Listed</p>
                    </div>
                  </div>
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <IconCheck size={24} style={{ color: brand.sage }} />
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <IconShieldCheck size={24} style={{ color: brand.gold }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=800&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${brand.navyDark}f0 0%, ${brand.navy}e0 100%)` }}
          />
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Find Your
              <br />
              <span style={{ color: brand.gold }}>Dream Home?</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join over 15,000 Nigerians who have found their perfect homes without paying agent fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="group px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
                style={{ backgroundColor: brand.gold, color: brand.navyDark }}
              >
                Start Searching Now
                <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/owner/properties/new"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                List Your Property
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== VIDEO MODAL ==================== */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-10"
              >
                <IconX size={24} />
              </button>
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <IconPlayerPlay size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Video coming soon</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
