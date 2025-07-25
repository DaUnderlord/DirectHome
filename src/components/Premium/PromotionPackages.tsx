import React, { useEffect } from 'react';
import { 
  IconStar, 
  IconTrendingUp, 
  IconEye, 
  IconHeart,
  IconShare,
  IconCheck,
  IconCrown,
  IconZap
} from '@tabler/icons-react';
import { usePremiumStore } from '../../store/premiumStore';
import { PromotionType } from '../../types/premium';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface PromotionPackagesProps {
  propertyId?: string;
  onSelectPackage?: (packageId: string) => void;
  showRecommendation?: boolean;
  className?: string;
}

const PromotionPackages: React.FC<PromotionPackagesProps> = ({
  propertyId,
  onSelectPackage,
  showRecommendation = true,
  className = ''
}) => {
  const { 
    promotionPackages, 
    recommendations,
    fetchPromotionPackages, 
    fetchPromotionRecommendations,
    isLoading 
  } = usePremiumStore();

  const recommendation = propertyId ? recommendations[propertyId] : null;

  useEffect(() => {
    fetchPromotionPackages();
    if (propertyId && showRecommendation) {
      fetchPromotionRecommendations(propertyId);
    }
  }, [fetchPromotionPackages, fetchPromotionRecommendations, propertyId, showRecommendation]);

  const getPackageIcon = (type: PromotionType) => {
    switch (type) {
      case PromotionType.FEATURED:
        return IconStar;
      case PromotionType.PREMIUM:
        return IconCrown;
      case PromotionType.SPOTLIGHT:
        return IconZap;
      default:
        return IconStar;
    }
  };

  const getPackageColor = (type: PromotionType) => {
    switch (type) {
      case PromotionType.FEATURED:
        return 'blue';
      case PromotionType.PREMIUM:
        return 'purple';
      case PromotionType.SPOTLIGHT:
        return 'orange';
      default:
        return 'gray';
    }
  };

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recommendation banner */}
      {recommendation && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <IconTrendingUp size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Recommended for You</h4>
              <p className="text-sm text-blue-700 mb-2">{recommendation.reason}</p>
              <div className="flex items-center space-x-4 text-xs text-blue-600">
                <span>+{recommendation.expectedBenefits.viewsIncrease}% views</span>
                <span>+{recommendation.expectedBenefits.inquiriesIncrease}% inquiries</span>
                <span>{recommendation.expectedBenefits.roi}x ROI</span>
              </div>
            </div>
            <div className="text-xs text-blue-600 font-medium">
              {recommendation.confidence}% match
            </div>
          </div>
        </Card>
      )}

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotionPackages.map((pkg) => {
          const Icon = getPackageIcon(pkg.type);
          const color = getPackageColor(pkg.type);
          const isRecommended = recommendation?.recommendedPackage.id === pkg.id;
          
          const colorClasses = {
            blue: 'border-blue-200 bg-blue-50 text-blue-600',
            purple: 'border-purple-200 bg-purple-50 text-purple-600',
            orange: 'border-orange-200 bg-orange-50 text-orange-600',
            gray: 'border-gray-200 bg-gray-50 text-gray-600'
          };

          return (
            <div
              key={pkg.id}
              className={`
                relative bg-white border rounded-lg p-6 transition-all duration-200 hover:shadow-lg
                ${isRecommended ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}
              `}
            >
              {/* Recommended badge */}
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </div>
                </div>
              )}

              {/* Package header */}
              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full mb-3 ${colorClasses[color]}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(pkg.price, pkg.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  for {pkg.duration} days
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <IconCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Benefits preview */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                {pkg.benefits.featuredPlacement && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconStar size={12} />
                    <span>Featured</span>
                  </div>
                )}
                {pkg.benefits.topSearchResults && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconTrendingUp size={12} />
                    <span>Top Results</span>
                  </div>
                )}
                {pkg.benefits.detailedAnalytics && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconEye size={12} />
                    <span>Analytics</span>
                  </div>
                )}
                {pkg.benefits.socialMediaPromotion && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconShare size={12} />
                    <span>Social Media</span>
                  </div>
                )}
              </div>

              {/* Action button */}
              <Button
                onClick={() => onSelectPackage?.(pkg.id)}
                className={`w-full ${
                  isRecommended 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isRecommended ? 'Get Recommended' : 'Select Package'}
              </Button>

              {/* Popular badge for premium */}
              {pkg.type === PromotionType.PREMIUM && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison note */}
      <div className="text-center text-sm text-gray-500">
        <p>All packages include basic listing features. Upgrade anytime for better visibility.</p>
      </div>
    </div>
  );
};

export default PromotionPackages;