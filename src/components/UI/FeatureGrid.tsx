import React, { useState, useEffect, useRef } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  title = 'Why Choose DirectHome',
  subtitle = 'Experience the difference with our premium real estate platform',
  columns = 3,
  className = ''
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]));
            }, index * 100); // Staggered animation
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [features.length]);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={el => itemRefs.current[index] = el}
              className={`
                glass-card p-8 rounded-2xl card-interactive group
                transition-all duration-500 ease-out
                ${visibleItems.has(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                ${feature.gradient || 'bg-gradient-to-br from-blue-500 to-blue-600'}
                shadow-lg group-hover:shadow-glow transition-all duration-300
                group-hover:scale-110
              `}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;