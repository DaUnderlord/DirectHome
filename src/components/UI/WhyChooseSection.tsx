import React, { useState, useEffect, useRef } from 'react';
import {
  IconDatabase,
  IconBell,
  IconScale,
  IconCreditCard,
  IconShieldCheck,
  IconUsers
} from '@tabler/icons-react';
import AnimatedCounter from './AnimatedCounter';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  statistic: {
    value: number;
    suffix: string;
    label: string;
  };
  gradient: string;
}

interface WhyChooseSectionProps {
  className?: string;
}

const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ className = '' }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const benefits: Benefit[] = [
    {
      id: '1',
      title: 'Largest Property Database',
      description: 'Access over 50,000 verified listings updated daily across Nigeria. Find exactly what you\'re looking for with our comprehensive property database.',
      icon: <IconDatabase size={40} />,
      statistic: {
        value: 10000,
        suffix: '+',
        label: 'Properties Listed'
      },
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      title: 'Instant Property Alerts',
      description: 'Never miss your dream property with real-time notifications. Set custom search criteria and get instant alerts when matching properties become available.',
      icon: <IconBell size={40} />,
      statistic: {
        value: 95,
        suffix: '%',
        label: 'Alert Accuracy'
      },
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: '3',
      title: 'Smart Rent Calculator',
      description: 'Make informed rental decisions with our advanced calculator tools. Analyze affordability, compare properties, and get market insights to find the perfect rental within your budget.',
      icon: <IconScale size={40} />,
      statistic: {
        value: 92,
        suffix: '%',
        label: 'Budget Accuracy'
      },
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: '4',
      title: 'Financing Assistance',
      description: 'Access mortgage partnerships and pre-approval services with competitive rates. We help make your property dreams financially achievable.',
      icon: <IconCreditCard size={40} />,
      statistic: {
        value: 85,
        suffix: '%',
        label: 'Approval Rate'
      },
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]));
            }, index * 300);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section className={`py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            Why Choose DirectHome
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience Nigeria's most trusted real estate platform with cutting-edge features designed to make your property journey seamless and successful.
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-10 rounded-full"></div>
        </div>

        {/* Benefits List - Clean Layout */}
        <div className="space-y-24">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              ref={el => { itemRefs.current[index] = el; }}
              className={`
                flex flex-col lg:flex-row items-center gap-16
                transition-all duration-1000 ease-out
                ${visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
                }
                ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
              `}
            >
              {/* Icon and Statistic Side */}
              <div className="flex-1 text-center lg:text-left">
                <div className={`
                  inline-flex items-center justify-center
                  w-32 h-32 rounded-full mb-8
                  bg-gradient-to-br ${benefit.gradient}
                  shadow-2xl transform hover:scale-105 transition-all duration-500
                  relative
                `}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${benefit.gradient} opacity-20 blur-xl scale-110`}></div>
                </div>

                <div className="mb-6">
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    <AnimatedCounter
                      end={benefit.statistic.value}
                      suffix={benefit.statistic.suffix}
                    />
                  </div>
                  <p className="text-xl text-gray-600 font-semibold">
                    {benefit.statistic.label}
                  </p>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-2xl text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-32 pt-20 border-t border-gray-300">
          <div className="flex flex-wrap justify-center items-center gap-16 text-gray-600">
            <div className="flex items-center space-x-4">
              <IconShieldCheck size={28} className="text-green-500" />
              <span className="text-xl font-semibold">Verified & Secure</span>
            </div>
            <div className="flex items-center space-x-4">
              <IconUsers size={28} className="text-blue-500" />
              <span className="text-xl font-semibold">5,000+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">★</span>
              </div>
              <span className="text-xl font-semibold">4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;