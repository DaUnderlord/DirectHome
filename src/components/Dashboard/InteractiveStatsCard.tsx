import React, { useState, useEffect } from 'react';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus,
  IconArrowRight 
} from '@tabler/icons-react';

interface InteractiveStatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
  onClick?: () => void;
  loading?: boolean;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
}

const InteractiveStatsCard: React.FC<InteractiveStatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  onClick,
  loading = false,
  subtitle,
  prefix = '',
  suffix = '',
  animate = true
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate counter for numeric values
  useEffect(() => {
    if (!animate || typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      
      if (step >= steps || current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animate]);

  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-gold-500',
        text: 'text-gold-400',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      },
      green: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-emerald-600',
        text: 'text-emerald-400',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      },
      yellow: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-gold-500',
        text: 'text-gold-400',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      },
      purple: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-charcoal-600',
        text: 'text-stone-200',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      },
      red: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-red-600',
        text: 'text-red-400',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      },
      indigo: {
        bg: 'from-charcoal-800 to-charcoal-900',
        iconBg: 'bg-gold-500',
        text: 'text-gold-400',
        border: 'border-charcoal-700',
        hover: 'hover:from-charcoal-700 hover:to-charcoal-800'
      }
    };
    return colors[color];
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={14} className="text-green-600" />;
      case 'down':
        return <IconTrendingDown size={14} className="text-red-600" />;
      default:
        return <IconMinus size={14} className="text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br ${colorClasses.bg} ${colorClasses.hover}
        border ${colorClasses.border}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full ${colorClasses.iconBg} rounded-full transform translate-x-6 -translate-y-6`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${colorClasses.iconBg} rounded-xl shadow-lg`}>
            <Icon className="text-charcoal-950" size={24} />
          </div>
          
          {onClick && (
            <div className={`
              p-2 rounded-lg transition-all duration-200
              ${isHovered ? 'bg-white/50 shadow-sm' : 'bg-white/20'}
            `}>
              <IconArrowRight 
                size={16} 
                className={`${colorClasses.text} transition-transform duration-200 ${
                  isHovered ? 'translate-x-1' : ''
                }`} 
              />
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-stone-100 mb-1">
                {prefix}{displayValue}{suffix}
              </div>
              <p className="text-sm font-medium text-stone-400">
                {title}
              </p>
            </>
          )}
        </div>

        {/* Trend and Subtitle */}
        <div className="flex items-center justify-between">
          {change !== undefined && (
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
              ${getTrendColor()}
            `}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          
          {subtitle && (
            <p className="text-xs text-gray-500 ml-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 
        transform transition-transform duration-300
        ${isHovered ? 'translate-x-0' : 'translate-x-full'}
      `}></div>
    </div>
  );
};

export default InteractiveStatsCard;