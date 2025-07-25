import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconPhoto } from '@tabler/icons-react';
import { PropertyImage } from '../../../types/property';

interface PropertyGalleryProps {
  images: PropertyImage[];
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  // Find the primary image and make it the first one
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <IconPhoto size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {/* Main Image */}
        <div className="relative h-96 bg-gray-100">
          <img
            src={sortedImages[activeIndex].url}
            alt={sortedImages[activeIndex].caption || `Property image ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onClick={toggleFullscreen}
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
          >
            <IconChevronRight size={24} />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative cursor-pointer flex-shrink-0 ${
                  activeIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.caption || `Property thumbnail ${index + 1}`}
                  className="h-20 w-20 object-cover rounded"
                />
                {image.isPrimary && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={toggleFullscreen}>
          <div className="relative max-w-7xl max-h-screen p-4">
            <img
              src={sortedImages[activeIndex].url}
              alt={sortedImages[activeIndex].caption || `Property image ${activeIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
            >
              <IconChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
            >
              <IconChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;