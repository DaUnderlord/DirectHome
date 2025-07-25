import React from 'react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

// Mock data
const mockRatings = {
  'user-1': {
    userId: 'user-1',
    averageRating: 4.5,
    totalRatings: 12
  }
};

interface UserRatingProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showSummary?: boolean;
  className?: string;
}

const UserRating: React.FC<UserRatingProps> = ({
  userId,
  size = 'md',
  showSummary = true,
  className = ''
}) => {
  // Use mock data instead of store
  const ratingData = mockRatings[userId as keyof typeof mockRatings];
  
  if (!ratingData) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No ratings yet
      </div>
    );
  }

  const { averageRating, totalRatings } = ratingData;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 20;
      default:
        return 16;
    }
  };

  const sizeClasses = getSizeClasses();
  const starSize = getStarSize();

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconStarFilled key={`full-${i}`} size={starSize} className="text-yellow-400" />
      );
    }

    // Half star (simplified to just show full or none)
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <IconStarFilled key="half" size={starSize} className="text-yellow-400" />
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconStar key={`empty-${i}`} size={starSize} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {renderStars()}
      </div>
      {showSummary && (
        <div className={`ml-2 ${sizeClasses} text-gray-600`}>
          ({totalRatings})
        </div>
      )}
    </div>
  );
};

export default UserRating;