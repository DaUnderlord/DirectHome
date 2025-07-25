import React from 'react';
import { 
  IconShieldCheck, 
  IconMapPin, 
  IconMail, 
  IconPhone, 
  IconClock,
  IconStar,
  IconUsers,
  IconHome
} from '@tabler/icons-react';

// Define the TrustIndicator interface
interface TrustIndicator {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'identity' | 'property' | 'behavior' | 'community';
  score: number;
  isVerified: boolean;
  verifiedAt?: Date;
}

// Mock data for trust indicators with proper typing
const mockTrustIndicators: Record<string, TrustIndicator[]> = {
  'user-1': [
    {
      id: 'trust-1',
      name: 'Identity Verified',
      description: 'Government-issued ID verified',
      iconName: 'shield-check',
      category: 'identity',
      score: 100,
      isVerified: true,
      verifiedAt: new Date('2024-01-15')
    },
    {
      id: 'trust-2',
      name: 'Address Verified',
      description: 'Residential address confirmed',
      iconName: 'map-pin',
      category: 'identity',
      score: 100,
      isVerified: true,
      verifiedAt: new Date('2024-01-15')
    }
  ]
};

interface TrustIndicatorsProps {
  userId: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showScores?: boolean;
  className?: string;
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  userId,
  layout = 'horizontal',
  showScores = false,
  className = ''
}) => {
  // Use mock data instead of store
  const userTrustIndicators = mockTrustIndicators[userId] || [];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'shield-check':
        return IconShieldCheck;
      case 'map-pin':
        return IconMapPin;
      case 'mail':
        return IconMail;
      case 'phone':
        return IconPhone;
      case 'clock':
        return IconClock;
      case 'star':
        return IconStar;
      case 'users':
        return IconUsers;
      case 'home':
        return IconHome;
      default:
        return IconShieldCheck;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col space-y-3';
      case 'grid':
        return 'grid grid-cols-2 gap-3 sm:grid-cols-3';
      default:
        return 'flex flex-wrap gap-2';
    }
  };

  if (userTrustIndicators.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No trust indicators available
      </div>
    );
  }

  const renderIndicator = (indicator: TrustIndicator) => {
    const Icon = getIconComponent(indicator.iconName);
    const scoreColor = getScoreColor(indicator.score);

    if (layout === 'vertical') {
      return (
        <div
          key={indicator.id}
          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${indicator.isVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Icon 
                size={16} 
                className={indicator.isVerified ? 'text-green-600' : 'text-gray-600'} 
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">{indicator.name}</div>
              <div className="text-sm text-gray-500">{indicator.description}</div>
            </div>
          </div>
          {showScores && (
            <div className={`text-sm font-medium ${scoreColor}`}>
              {indicator.score}%
            </div>
          )}
        </div>
      );
    }

    if (layout === 'grid') {
      return (
        <div
          key={indicator.id}
          className="p-3 bg-white border border-gray-200 rounded-lg text-center"
        >
          <div className={`inline-flex p-2 rounded-full mb-2 ${indicator.isVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Icon 
              size={20} 
              className={indicator.isVerified ? 'text-green-600' : 'text-gray-600'} 
            />
          </div>
          <div className="font-medium text-gray-900 text-sm">{indicator.name}</div>
          {showScores && (
            <div className={`text-xs font-medium mt-1 ${scoreColor}`}>
              {indicator.score}%
            </div>
          )}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div
        key={indicator.id}
        className={`
          inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border
          ${indicator.isVerified 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-gray-50 border-gray-200 text-gray-700'
          }
        `}
        title={indicator.description}
      >
        <Icon size={14} className="mr-1.5" />
        <span>{indicator.name}</span>
        {showScores && (
          <span className={`ml-2 text-xs ${scoreColor}`}>
            {indicator.score}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {userTrustIndicators.map((indicator) => renderIndicator(indicator))}
    </div>
  );
};

export default TrustIndicators;