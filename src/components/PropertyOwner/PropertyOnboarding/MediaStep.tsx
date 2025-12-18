import React, { useCallback } from 'react';
import { IconPhoto, IconVideo, IconX, IconUpload, IconStar } from '@tabler/icons-react';
import { PropertyMedia } from '../../../types/propertyOwner';

interface MediaStepProps {
  data: {
    images: PropertyMedia[];
    videos: PropertyMedia[];
    virtualTour?: string;
  };
  errors: Record<string, string>;
  onChange: (data: Partial<MediaStepProps['data']>) => void;
}

const MediaStep: React.FC<MediaStepProps> = ({ data, errors, onChange }) => {
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PropertyMedia[] = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      type: 'image' as const,
      isPrimary: data.images.length === 0 && index === 0,
      uploadedAt: new Date()
    }));

    onChange({ images: [...data.images, ...newImages] });
  }, [data.images, onChange]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newVideos: PropertyMedia[] = Array.from(files).map((file, index) => ({
      id: `vid-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      type: 'video' as const,
      isPrimary: false,
      uploadedAt: new Date()
    }));

    onChange({ videos: [...data.videos, ...newVideos] });
  }, [data.videos, onChange]);

  const removeImage = (id: string) => {
    const updatedImages = data.images.filter(img => img.id !== id);
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    onChange({ images: updatedImages });
  };

  const removeVideo = (id: string) => {
    onChange({ videos: data.videos.filter(vid => vid.id !== id) });
  };

  const setPrimaryImage = (id: string) => {
    onChange({
      images: data.images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Media</h2>
        <p className="text-gray-600">Upload high-quality images and videos of your property</p>
      </div>

      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
            <p className="text-sm text-gray-500">Upload at least 3 images (recommended: 8+)</p>
          </div>
          <span className={`text-sm font-medium ${data.images.length >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
            {data.images.length} / 3 minimum
          </span>
        </div>

        {errors['media.images'] && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors['media.images']}
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {data.images.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <img
                src={image.url}
                alt="Property"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setPrimaryImage(image.id)}
                  className={`p-2 rounded-full mr-2 ${
                    image.isPrimary ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-yellow-100'
                  }`}
                  title={image.isPrimary ? 'Primary image' : 'Set as primary'}
                >
                  <IconStar size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="p-2 bg-white text-red-600 rounded-full hover:bg-red-100"
                  title="Remove image"
                >
                  <IconX size={16} />
                </button>
              </div>
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}

          {/* Upload Button */}
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <IconUpload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for great photos:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use natural lighting when possible</li>
            <li>• Capture all rooms including kitchen and bathrooms</li>
            <li>• Show the exterior and any outdoor spaces</li>
            <li>• Keep spaces clean and decluttered</li>
          </ul>
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Property Video (Optional)</h3>
            <p className="text-sm text-gray-500">A walkthrough video can increase interest by 40%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.videos.map((video) => (
            <div key={video.id} className="relative group">
              <video
                src={video.url}
                className="w-full h-48 object-cover rounded-xl"
                controls
              />
              <button
                type="button"
                onClick={() => removeVideo(video.id)}
                className="absolute top-2 right-2 p-2 bg-white text-red-600 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX size={16} />
              </button>
            </div>
          ))}

          {data.videos.length === 0 && (
            <label className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
              <IconVideo size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Video</span>
              <span className="text-xs text-gray-400 mt-1">MP4, MOV (max 100MB)</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Virtual Tour */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">360° Virtual Tour (Optional)</h3>
        <p className="text-sm text-gray-500 mb-4">Add a link to your virtual tour if available</p>
        <input
          type="url"
          value={data.virtualTour || ''}
          onChange={(e) => onChange({ virtualTour: e.target.value })}
          placeholder="https://my360tour.com/property-tour"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default MediaStep;
