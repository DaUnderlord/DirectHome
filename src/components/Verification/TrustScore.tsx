import React from 'react';
import { IconShield } from '@tabler/icons-react';

// Mock data
const mockTrustScores = {
  'user-1': 85
};

interface TrustScoreProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

const TrustScore: React.FC<TrustScoreProps> = ({
  userId,
  size = 'md',
  showLabel = true,
  showIcon = true,
  className = ''
}) => {
  // Use mock data instead of store
  const score = mockTrustScores[userId as keyof typeof mockTrustScores] || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs h-5 w-5';
      case 'lg':
        return 'text-lg h-10 w-10';
      default:
        return 'text-sm h-7 w-7';
    }
  };

  const scoreColor = getScoreColor(score);
  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <IconShield size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} className={scoreColor.split(' ')[0]} />
      )}
      <div className={`flex items-center ${showLabel ? 'space-x-1' : ''}`}>
        <div className={`${sizeClasses} rounded-full ${scoreColor} flex items-center justify-center font-medium`}>
          {score}
        </div>
        {showLabel && (
          <span className="text-gray-600 text-sm">Trust Score</span>
        )}
      </div>
    </div>
  );
};

export default TrustScore;