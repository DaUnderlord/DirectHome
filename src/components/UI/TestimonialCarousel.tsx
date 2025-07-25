import React from 'react';
import { IconStar, IconQuote } from '@tabler/icons-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  content: string;
  location?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  className?: string;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  title = 'What Our Clients Say',
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <IconStar
        key={index}
        size={16}
        className={`${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div 
      ref={elementRef}
      className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-50 ${className} ${
        isVisible ? 'animate-slide-up' : 'scroll-animate-hidden'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`glass-card p-6 rounded-2xl relative overflow-hidden hover:shadow-glass transition-all duration-300 ${
                isVisible ? `animate-slide-up animate-delay-${Math.min((index + 1) * 100, 600)}` : 'scroll-animate-hidden'
              }`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-4 left-4 text-blue-500/20">
                <IconQuote size={32} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 text-center mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-md"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                    {testimonial.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;