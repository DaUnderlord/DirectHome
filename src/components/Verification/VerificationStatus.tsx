import React from 'react';
import { 
  IconShieldCheck, 
  IconShieldX, 
  IconClock, 
  IconShield
} from '@tabler/icons-react';
import { VerificationLevel } from '../../types/verification';
import VerificationBadge from './VerificationBadge';

// Mock data
const mockUserVerifications = {
  'user-1': {
    userId: 'user-1',
    identityVerified: true,
    addressVerified: true,
    phoneVerified: true,
    emailVerified: true,
    documentsVerified: true,
    verificationLevel: VerificationLevel.STANDARD,
    trustScore: 85,
    verifiedSince: new Date('2024-01-15'),
    lastVerificationUpdate: new Date('2024-01-15'),
    verificationBadges: ['verified-identity', 'verified-address', 'trusted-member'],
    activeVerificationRequests: [],
    completedVerificationRequests: []
  }
};

interface VerificationStatusProps {
  userId: string;
  layout?: 'compact' | 'detailed' | 'badges';
  showLevel?: boolean;
  showProgress?: boolean;
  className?: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  userId,
  layout = 'compact',
  showLevel = true,
  showProgress = false,
  className = ''
}) => {
  // Use mock data instead of store
  const userVerification = mockUserVerifications[userId as keyof typeof mockUserVerifications];

  const getVerificationLevelInfo = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.NONE:
        return {
          label: 'Not Verified',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: IconShieldX
        };
      case VerificationLevel.BASIC:
        return {
          label: 'Basic Verified',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: IconShield
        };
      case VerificationLevel.STANDARD:
        return {
          label: 'Standard Verified',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: IconShieldCheck
        };
      case VerificationLevel.ADVANCED:
        return {
          label: 'Advanced Verified',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          icon: IconShieldCheck
        };
      case VerificationLevel.PREMIUM:
        return {
          label: 'Premium Verified',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          icon: IconShieldCheck
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: IconShieldX
        };
    }
  };

  const calculateVerificationProgress = () => {
    if (!userVerification) return 0;
    
    const checks = [
      userVerification.emailVerified,
      userVerification.phoneVerified,
      userVerification.identityVerified,
      userVerification.addressVerified,
      userVerification.documentsVerified
    ];
    
    const completedChecks = checks.filter(Boolean).length;
    return (completedChecks / checks.length) * 100;
  };

  if (!userVerification) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <IconShieldX size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">Verification status unavailable</span>
      </div>
    );
  }

  const levelInfo = getVerificationLevelInfo(userVerification.verificationLevel);
  const progress = calculateVerificationProgress();

  if (layout === 'badges') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {userVerification.emailVerified && (
          <VerificationBadge type="email" size="sm" />
        )}
        {userVerification.phoneVerified && (
          <VerificationBadge type="phone" size="sm" />
        )}
        {userVerification.identityVerified && (
          <VerificationBadge type="identity" size="sm" />
        )}
        {userVerification.addressVerified && (
          <VerificationBadge type="address" size="sm" />
        )}
        {userVerification.verificationLevel === VerificationLevel.PREMIUM && (
          <VerificationBadge type="premium" size="sm" />
        )}
        {userVerification.verificationLevel === VerificationLevel.ADVANCED && (
          <VerificationBadge type="trusted" size="sm" />
        )}
      </div>
    );
  }

  if (layout === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Overall status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${levelInfo.bgColor}`}>
              <levelInfo.icon size={20} className={levelInfo.color} />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {levelInfo.label}
              </div>
              {userVerification.verifiedSince && (
                <div className="text-sm text-gray-500">
                  Verified since {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short'
                  }).format(new Date(userVerification.verifiedSince))}
                </div>
              )}
            </div>
          </div>
          {showLevel && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.bgColor} ${levelInfo.color}`}>
              Level {Object.values(VerificationLevel).indexOf(userVerification.verificationLevel)}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Verification Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Individual verification items */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className={`flex items-center space-x-2 ${userVerification.emailVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <IconShieldCheck size={14} />
              <span>Email</span>
            </div>
            <div className={`flex items-center space-x-2 ${userVerification.phoneVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <IconShieldCheck size={14} />
              <span>Phone</span>
            </div>
            <div className={`flex items-center space-x-2 ${userVerification.identityVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <IconShieldCheck size={14} />
              <span>Identity</span>
            </div>
            <div className={`flex items-center space-x-2 ${userVerification.addressVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <IconShieldCheck size={14} />
              <span>Address</span>
            </div>
          </div>
        </div>

        {/* Active verification requests */}
        {userVerification.activeVerificationRequests.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
            <IconClock size={14} />
            <span>
              {userVerification.activeVerificationRequests.length} verification request(s) pending
            </span>
          </div>
        )}
      </div>
    );
  }

  // Compact layout (default)
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <levelInfo.icon size={16} className={levelInfo.color} />
      <span className={`text-sm font-medium ${levelInfo.color}`}>
        {levelInfo.label}
      </span>
      {userVerification.activeVerificationRequests.length > 0 && (
        <div className="flex items-center space-x-1">
          <IconClock size={12} className="text-orange-500" />
          <span className="text-xs text-orange-600">Pending</span>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;