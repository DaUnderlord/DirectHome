import React, { useEffect, useState } from 'react';
import { 
  IconCheck, 
  IconX, 
  IconCrown, 
  IconRocket,
  IconBuildingSkyscraper,
  IconHome
} from '@tabler/icons-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { BillingInterval, SubscriptionTier } from '../../types/subscription';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string, billingInterval: BillingInterval) => void;
  currentPlanId?: string;
  className?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onSelectPlan,
  currentPlanId,
  className = ''
}) => {
  const { 
    subscriptionPlans, 
    fetchSubscriptionPlans, 
    isLoading 
  } = useSubscriptionStore();

  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [fetchSubscriptionPlans]);

  const getPlanIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE:
        return IconHome;
      case SubscriptionTier.BASIC:
        return IconRocket;
      case SubscriptionTier.PROFESSIONAL:
        return IconCrown;
      case SubscriptionTier.ENTERPRISE:
        return IconBuildingSkyscraper;
      default:
        return IconHome;
    }
  };

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getIntervalLabel = (interval: BillingInterval) => {
    switch (interval) {
      case BillingInterval.MONTHLY:
        return 'Monthly';
      case BillingInterval.QUARTERLY:
        return 'Quarterly';
      case BillingInterval.YEARLY:
        return 'Yearly';
      default:
        return 'Monthly';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Billing interval toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          {[BillingInterval.MONTHLY, BillingInterval.YEARLY].map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedInterval === interval
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getIntervalLabel(interval)}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan) => {
          const Icon = getPlanIcon(plan.tier);
          const pricing = plan.pricing.find(p => p.interval === selectedInterval) || plan.pricing[0];
          const isCurrentPlan = plan.id === currentPlanId;
          const discount = pricing.discount;
          
          return (
            <Card
              key={plan.id}
              className={`p-6 ${
                plan.isPopular ? 'border-blue-300 ring-2 ring-blue-100' : ''
              } ${isCurrentPlan ? 'border-green-300 ring-2 ring-green-100' : ''}`}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Current plan badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-3">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                {plan.tagline && (
                  <p className="text-sm text-gray-600">{plan.tagline}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(pricing.price, pricing.currency)}
                  <span className="text-sm font-normal text-gray-500">
                    /{selectedInterval === BillingInterval.MONTHLY ? 'mo' : 'yr'}
                  </span>
                </div>
                {discount && (
                  <div className="text-sm text-green-600 font-medium">
                    {discount.description} ({discount.percentage}% off)
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    {feature.included ? (
                      <IconCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <IconX size={16} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm text-gray-700">{feature.name}</span>
                      {feature.limit && (
                        <span className="text-xs text-gray-500 block">
                          {feature.limit} {feature.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action button */}
              <Button
                onClick={() => onSelectPlan?.(plan.id, selectedInterval)}
                disabled={isCurrentPlan}
                className={`w-full ${
                  plan.isPopular && !isCurrentPlan
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isCurrentPlan
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Comparison note */}
      <div className="text-center text-sm text-gray-500">
        <p>All plans include basic listing features. Need help choosing? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a></p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;