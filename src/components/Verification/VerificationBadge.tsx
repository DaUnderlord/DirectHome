import React from 'react';
import { 
  IconShieldCheck, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconId, 
  IconCrown, 
  IconBuildingBank
} from '@tabler/icons-react';

interface VerificationBadgeProps {
  type: 'verified' | 'identity' | 'address' | 'email' | 'phone' | 'premium' | 'trusted' | 'business';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const getBadgeInfo = () => {
    switch (type) {
      case 'verified':
        return {
          icon: IconShieldCheck,
          label: 'Verified',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'identity':
        return {
          icon: IconId,
          label: 'ID Verified',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'address':
        return {
          icon: IconMapPin,
          label: 'Address Verified',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          borderColor: 'border-indigo-200'
        };
      case 'email':
        return {
          icon: IconMail,
          label: 'Email Verified',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-200'
        };
      case 'phone':
        return {
          icon: IconPhone,
          label: 'Phone Verified',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-100',
          borderColor: 'border-cyan-200'
        };
      case 'premium':
        return {
          icon: IconCrown,
          label: 'Premium',
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-200'
        };
      case 'trusted':
        return {
          icon: IconShieldCheck,
          label: 'Trusted',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-200'
        };
      case 'business':
        return {
          icon: IconBuildingBank,
          label: 'Business Verified',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: IconShieldCheck,
          label: 'Verified',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-2 py-0.5',
          text: 'text-xs',
          icon: 12
        };
      case 'lg':
        return {
          padding: 'px-3 py-1.5',
          text: 'text-base',
          icon: 18
        };
      default:
        return {
          padding: 'px-2.5 py-1',
          text: 'text-sm',
          icon: 14
        };
    }
  };

  const badgeInfo = getBadgeInfo();
  const sizeInfo = getSizeClasses();
  const Icon = badgeInfo.icon;

  return (
    <div 
      className={`
        inline-flex items-center rounded-full border
        ${badgeInfo.bgColor} ${badgeInfo.color} ${badgeInfo.borderColor}
        ${sizeInfo.padding} ${sizeInfo.text} font-medium
        ${className}
      `}
    >
      <Icon size={sizeInfo.icon} className="mr-1" />
      {showLabel && <span>{badgeInfo.label}</span>}
    </div>
  );
};

export default VerificationBadge;