import React, { useEffect, useState } from 'react';
import { 
  IconPlay, 
  IconPause, 
  IconX, 
  IconRefresh,
  IconTrendingUp,
  IconEye,
  IconMessageCircle,
  IconCalendar,
  IconDots,
  IconEdit,
  IconChartBar
} from '@tabler/icons-react';
import { usePremiumStore } from '../../store/premiumStore';
import { PromotionStatus, PromotionType } from '../../types/premium';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Badge from '../UI/Badge';

interface PromotionManagerProps {
  userId: string;
  className?: string;
}

const PromotionManager: React.FC<PromotionManagerProps> = ({
  userId,
  className = ''
}) => {
  const { 
    userPromotions,
    activePromotions,
    fetchUserPromotions,
    cancelPromotion,
    pausePromotion,
    resumePromotion,
    renewPromotion,
    isLoading 
  } = usePremiumStore();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchUserPromotions(userId);
  }, [fetchUserPromotions, userId]);

  const getStatusColor = (status: PromotionStatus) => {
    switch (status) {
      case PromotionStatus.ACTIVE:
        return 'success';
      case PromotionStatus.PENDING:
        return 'warning';
      case PromotionStatus.EXPIRED:
        return 'secondary';
      case PromotionStatus.CANCELLED:
        return 'error';
      case PromotionStatus.PAUSED:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: PromotionType) => {
    switch (type) {
      case PromotionType.FEATURED:
        return '⭐';
      case PromotionType.PREMIUM:
        return '👑';
      case PromotionType.SPOTLIGHT:
        return '⚡';
      default:
        return '📍';
    }
  };

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleAction = async (action: string, promotionId: string, reason?: string) => {
    setActionLoading(promotionId);
    
    try {
      let success = false;
      
      switch (action) {
        case 'cancel':
          success = await cancelPromotion(promotionId, reason || 'User requested cancellation');
          break;
        case 'pause':
          success = await pausePromotion(promotionId, reason || 'User requested pause');
          break;
        case 'resume':
          success = await resumePromotion(promotionId);
          break;
        case 'renew':
          success = await renewPromotion(promotionId);
          break;
      }
      
      if (success) {
        // Refresh the promotions list
        fetchUserPromotions(userId);
      }
    } finally {
      setActionLoading(null);
      setShowCancelModal(null);
      setCancelReason('');
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (userPromotions.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <IconTrendingUp size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Promotions Yet</h3>
        <p className="text-gray-600 mb-4">
          Start promoting your properties to get more visibility and inquiries.
        </p>
        <Button>Create Your First Promotion</Button>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active promotions summary */}
      {activePromotions.length > 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                {activePromotions.length} Active Promotion{activePromotions.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-green-700">
                Your properties are getting enhanced visibility right now!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">
                {formatPrice(activePromotions.reduce((sum, p) => sum + p.price, 0))}
              </div>
              <div className="text-sm text-green-600">Total investment</div>
            </div>
          </div>
        </Card>
      )}

      {/* Promotions list */}
      <div className="space-y-4">
        {userPromotions.map((promotion) => {
          const daysRemaining = getDaysRemaining(promotion.endDate);
          const isActive = promotion.status === PromotionStatus.ACTIVE;
          const canPause = isActive;
          const canResume = promotion.status === PromotionStatus.PAUSED;
          const canRenew = promotion.status === PromotionStatus.EXPIRED;
          const canCancel = isActive || promotion.status === PromotionStatus.PAUSED;

          return (
            <Card key={promotion.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(promotion.type)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1)} Promotion
                    </h3>
                    <p className="text-sm text-gray-600">
                      Property ID: {promotion.propertyId}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(promotion.status)}>
                  {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <IconEye size={16} className="text-gray-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">1.2K</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <IconMessageCircle size={16} className="text-gray-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">23</div>
                  <div className="text-xs text-gray-600">Inquiries</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <IconCalendar size={16} className="text-gray-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {isActive ? daysRemaining : 0}
                  </div>
                  <div className="text-xs text-gray-600">Days Left</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <IconTrendingUp size={16} className="text-gray-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">+180%</div>
                  <div className="text-xs text-gray-600">Boost</div>
                </div>
              </div>

              {/* Details */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <div>
                  <span>Started: {formatDate(promotion.startDate)}</span>
                  <span className="mx-2">•</span>
                  <span>Ends: {formatDate(promotion.endDate)}</span>
                </div>
                <div className="font-medium text-gray-900">
                  {formatPrice(promotion.price, promotion.currency)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <IconChartBar size={16} />
                  <span>View Analytics</span>
                </Button>

                <div className="flex space-x-2">
                  {canPause && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction('pause', promotion.id)}
                      disabled={actionLoading === promotion.id}
                      className="flex items-center space-x-1"
                    >
                      <IconPause size={16} />
                      <span>Pause</span>
                    </Button>
                  )}

                  {canResume && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction('resume', promotion.id)}
                      disabled={actionLoading === promotion.id}
                      className="flex items-center space-x-1"
                    >
                      <IconPlay size={16} />
                      <span>Resume</span>
                    </Button>
                  )}

                  {canRenew && (
                    <Button
                      size="sm"
                      onClick={() => handleAction('renew', promotion.id)}
                      disabled={actionLoading === promotion.id}
                      className="flex items-center space-x-1"
                    >
                      <IconRefresh size={16} />
                      <span>Renew</span>
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelModal(promotion.id)}
                      disabled={actionLoading === promotion.id}
                      className="flex items-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <IconX size={16} />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Auto-renew indicator */}
              {promotion.autoRenew && isActive && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <IconRefresh size={14} />
                    <span>Auto-renewal enabled - will renew automatically on {formatDate(promotion.endDate)}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Promotion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this promotion? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Let us know why you're cancelling..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(null);
                  setCancelReason('');
                }}
              >
                Keep Promotion
              </Button>
              <Button
                onClick={() => handleAction('cancel', showCancelModal, cancelReason)}
                disabled={actionLoading === showCancelModal}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === showCancelModal ? 'Cancelling...' : 'Cancel Promotion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManager;