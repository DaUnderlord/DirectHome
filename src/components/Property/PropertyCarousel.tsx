import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';

interface PropertyCarouselProps {
  properties: Property[];
  title?: string;
  autoRotate?: boolean;
  rotateInterval?: number;
  showControls?: boolean;
  className?: string;
}

const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
  properties,
  title = 'Featured Properties',
  autoRotate = true,
  rotateInterval = 4000,
  showControls = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || isHovered || properties.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === properties.length - 1 ? 0 : prevIndex + 1
      );
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, isHovered, properties.length, rotateInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? properties.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === properties.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>
      )}

      <div 
        className="relative overflow-hidden rounded-2xl fade-carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fade overlays */}
        <div className="gradient-fade-left"></div>
        <div className="gradient-fade-right"></div>
        {/* Carousel Container */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {properties.map((property, index) => (
            <div key={property.id} className="w-full flex-shrink-0 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Show 3 properties per slide on desktop, 1 on mobile */}
                {properties.slice(index, index + 3).map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    variant="glass"
                    className="animate-fade-in"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && properties.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-card p-3 rounded-full text-gray-700 hover:text-blue-600 transition-all duration-200 btn-interactive"
              aria-label="Previous properties"
            >
              <IconChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-card p-3 rounded-full text-gray-700 hover:text-blue-600 transition-all duration-200 btn-interactive"
              aria-label="Next properties"
            >
              <IconChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {properties.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-600 shadow-glow-sm'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyCarousel;