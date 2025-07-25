import React from 'react';
import VerificationStatus from './VerificationStatus';
import TrustScore from './TrustScore';
import UserRating from './UserRating';
import TrustIndicators from './TrustIndicators';

interface VerificationProfileProps {
  userId: string;
  showRating?: boolean;
  showTrustScore?: boolean;
  showTrustIndicators?: boolean;
  className?: string;
}

const VerificationProfile: React.FC<VerificationProfileProps> = ({
  userId,
  showRating = true,
  showTrustScore = true,
  showTrustIndicators = true,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <VerificationStatus userId={userId} layout="detailed" showProgress={true} />

      <div className="flex items-center justify-between">
        {showTrustScore && (
          <TrustScore userId={userId} size="md" />
        )}

        {showRating && (
          <UserRating userId={userId} size="md" />
        )}
      </div>

      {showTrustIndicators && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Trust Indicators</h4>
          <TrustIndicators userId={userId} layout="horizontal" />
        </div>
      )}
    </div>
  );
};

export default VerificationProfile;