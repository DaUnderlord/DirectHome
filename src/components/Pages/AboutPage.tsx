import React from 'react';
import { 
  IconShieldCheck, 
  IconCoin, 
  IconUsers, 
  IconTrendingUp,
  IconAward,
  IconHeart,
  IconTarget,
  IconBulb,
  IconQuote
} from '@tabler/icons-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Team members data
const teamMembers = [
  {
    name: 'Segun Owele',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Licensed Architect with 10+ years of experience providing homes for growing families and Nigerians in diaspora.'
  },
  {
    name: 'Abiodun Owele',
    role: 'Business analyst & Co-founder',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Co-founder focused on leveraging data and strategy to scale Nigeria’s most trusted rental platform.'
  },
  {
    name: 'Dennis Ogi',
    role: 'CTO/Head of IT',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Key member of the team supporting our mission to connect renters directly with homeowners.'
  }
];

// Company stats
const stats = [
  { value: '50,000+', label: 'Happy Users', icon: IconUsers },
  { value: '₦2B+', label: 'Saved in Fees', icon: IconCoin },
  { value: '15,000+', label: 'Properties Listed', icon: IconTrendingUp },
  { value: '98%', label: 'Success Rate', icon: IconAward }
];

// Core values
const values = [
  {
    icon: IconShieldCheck,
    title: 'Trust & Transparency',
    description: 'We believe in complete honesty in all property listings and transactions, ensuring what you see is what you get.'
  },
  {
    icon: IconCoin,
    title: 'Cost Efficiency',
    description: 'By eliminating middlemen, we help users save thousands while maintaining the highest quality of service.'
  },
  {
    icon: IconHeart,
    title: 'User-Centric',
    description: 'Every feature we build is designed with our users in mind, prioritizing their needs and experiences.'
  },
  {
    icon: IconBulb,
    title: 'Innovation',
    description: 'We continuously innovate to provide cutting-edge solutions that simplify property transactions.'
  }
];

// Milestones
const milestones = [
  {
    year: '2023',
    title: 'Company Founded',
    description: 'DirectHome was established with a vision to revolutionize Nigeria\'s real estate market.'
  },
  {
    year: '2023',
    title: 'First 1,000 Users',
    description: 'Reached our first milestone of 1,000 registered users within 3 months of launch.'
  },
  {
    year: '2024',
    title: 'Major Expansion',
    description: 'Expanded to cover all major cities in Nigeria with over 10,000 verified properties.'
  },
  {
    year: '2024',
    title: 'Industry Recognition',
    description: 'Received the "Best PropTech Innovation" award from the Nigerian Real Estate Association.'
  }
];

const AboutPage: React.FC = () => {
  // Animation hooks for different sections
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: missionRef, isVisible: missionVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: missionImageRef, isVisible: missionImageVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: valuesRef, isVisible: valuesVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: timelineRef, isVisible: timelineVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div 
            ref={heroRef}
            className={`max-w-4xl mx-auto text-center ${
              heroVisible ? 'animate-slide-up' : 'scroll-animate-hidden'
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revolutionizing Real Estate in Nigeria
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              We are on a mission to connect rental property seekers directly with homeowners, eliminating house agents (middlemen) and creating a transparent, efficient marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Our Story
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={statsRef}
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${
              statsVisible ? 'animate-slide-up' : 'scroll-animate-hidden'
            }`}
          >
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center ${
                  statsVisible ? `animate-slide-up animate-delay-${Math.min((index + 1) * 100, 400)}` : 'scroll-animate-hidden'
                }`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                ref={missionRef}
                className={`${
                  missionVisible ? 'animate-slide-in-left' : 'scroll-animate-hidden'
                }`}
              >
                <div className="flex items-center mb-6">
                  <IconTarget className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To democratize access to quality rental housing by creating a transparent, efficient, and cost-effective platform that connects rental property seekers directly with homeowners across Nigeria — effectively cutting off house agents.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe everyone deserves access to quality housing without the burden of excessive fees and opaque processes that have plagued the traditional real estate market.
                </p>
              </div>
              <div 
                ref={missionImageRef}
                className={`relative ${
                  missionImageVisible ? 'animate-slide-in-right' : 'scroll-animate-hidden'
                }`}
              >
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern home interior"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                  <IconHeart className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div 
              ref={valuesRef}
              className={`text-center mb-16 ${
                valuesVisible ? 'animate-slide-up' : 'scroll-animate-hidden'
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape how we serve our community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow ${
                    valuesVisible ? `animate-slide-up animate-delay-${Math.min((index + 1) * 100, 400)}` : 'scroll-animate-hidden'
                  }`}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Timeline */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div 
              ref={timelineRef}
              className={`text-center mb-16 ${
                timelineVisible ? 'animate-slide-up' : 'scroll-animate-hidden'
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-xl text-gray-600">
                From a simple idea to transforming Nigeria's real estate landscape
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-start mb-12 ${
                    timelineVisible ? `animate-slide-in-left animate-delay-${Math.min((index + 1) * 200, 600)}` : 'scroll-animate-hidden'
                  }`}
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="ml-8">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Passionate professionals united by the vision of transforming Nigeria's real estate market
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <IconQuote className="w-16 h-16 text-blue-600 mx-auto mb-8" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
              "DirectHome has completely transformed how we think about property transactions in Nigeria. 
              Their commitment to transparency and user experience is unmatched."
            </blockquote>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                alt="Industry Expert"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Dr. Amina Hassan</div>
                <div className="text-gray-600">Real Estate Industry Expert</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Whether you're looking for your dream home or want to list your property, 
              we're here to make your real estate journey seamless and affordable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Start Searching
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;