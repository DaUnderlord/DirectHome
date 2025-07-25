import React, { useState } from 'react';
import { IconPhoto, IconTrash } from '@tabler/icons-react';

interface MediaStepProps {
  formData: {
    images: Array<{
      id: string;
      url: string;
      file: File;
      isPrimary: boolean;
    }>;
  };
  updateFormData: (data: Partial<MediaStepProps['formData']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MediaStep: React.FC<MediaStepProps> = ({ 
  formData, 
  updateFormData, 
  onNext,
  onPrev
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 10 images
      if (formData.images.length + newFiles.length > 10) {
        alert('You can upload a maximum of 10 images');
        return;
      }
      
      // Create new image objects
      const newImages = newFiles.map(file => ({
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        file,
        isPrimary: formData.images.length === 0 // First image is primary by default
      }));
      
      updateFormData({
        images: [...formData.images, ...newImages]
      });
    }
  };
  
  const handleRemoveImage = (id: string) => {
    const imageToRemove = formData.images.find(img => img.id === id);
    if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    const updatedImages = formData.images.filter(img => img.id !== id);
    
    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    updateFormData({
      images: updatedImages
    });
  };
  
  const handleSetPrimary = (id: string) => {
    const updatedImages = formData.images.map(img => ({
      ...img,
      isPrimary: img.id === id
    }));
    
    updateFormData({
      images: updatedImages
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <IconPhoto className="mr-2" /> Property Photos
      </h2>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="images"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <IconPhoto size={48} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Click to upload photos</p>
            <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
          </label>
        </div>
        
        {formData.images.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Uploaded Photos ({formData.images.length}/10)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`Property preview`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="bg-red-500 text-white rounded-full p-1 mx-1"
                    >
                      <IconTrash size={14} />
                    </button>
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(image.id)}
                        className="bg-blue-500 text-white rounded-full p-1 mx-1 text-xs"
                      >
                        Set as Main
                      </button>
                    )}
                  </div>
                  {image.isPrimary && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MediaStep;