import React, { useState } from 'react';
import { 
  IconCalculator, 
  IconCurrencyDollar, 
  IconBuildingSkyscraper, 
  IconChartBar,
  IconInfoCircle,
  IconMap
} from '@tabler/icons-react';
import { Property } from '../../types/property';
import AffordabilityCalculator from './AffordabilityCalculator';
import PropertyCostCalculator from './PropertyCostCalculator';
import PropertyComparisonCalculator from './PropertyComparisonCalculator';
import MarketComparisonCalculator from './MarketComparisonCalculator';
import MarketMapCalculator from './MarketMapCalculator';

interface RentCalculatorProps {
  property?: Property;
  initialTab?: string;
  compact?: boolean;
  variant?: 'light' | 'dark';
}

const RentCalculator: React.FC<RentCalculatorProps> = ({ 
  property,
  initialTab = 'affordability',
  compact = false,
  variant = 'light',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const isDark = variant === 'dark';
  
  const tabActive = isDark
    ? 'border-gold-500 text-gold-400'
    : 'border-blue-500 text-blue-600';
  const tabInactive = isDark
    ? 'border-transparent text-stone-400 hover:text-stone-200 hover:border-charcoal-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  const shellClass = isDark ? '' : 'max-w-7xl mx-auto px-4 py-12';
  const cardClass = isDark
    ? 'rounded-xl border border-charcoal-700/50 overflow-hidden'
    : 'bg-white border border-gray-200 rounded-lg overflow-hidden';
  const tabBarClass = isDark
    ? 'border-b border-charcoal-700/50'
    : 'border-b border-gray-200';
  const contentClass = isDark ? 'p-4 md:p-6' : 'p-6';
  
  // Compact version for embedding in property pages
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconCalculator size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Rent Calculator</h4>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <AffordabilityCalculator property={property} compact={true} />
        </div>
      </div>
    );
  }
  
  // Full version for dedicated calculator page
  return (
    <div className={shellClass}>
      {!isDark && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <IconCalculator size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Rent Calculator</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Calculate rent affordability, property costs, and compare options to make informed decisions.
          </p>
        </div>
      )}
      
      <div className={cardClass}>
        <div className={tabBarClass}>
          <div className="flex flex-wrap -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('affordability')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'affordability' ? tabActive : tabInactive
              }`}
            >
              <IconCurrencyDollar size={18} className="mr-2" />
              Affordability
            </button>
            
            <button
              onClick={() => setActiveTab('property-cost')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'property-cost' ? tabActive : tabInactive
              }`}
            >
              <IconBuildingSkyscraper size={18} className="mr-2" />
              Property Cost
            </button>
            
            <button
              onClick={() => setActiveTab('property-comparison')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'property-comparison' ? tabActive : tabInactive
              }`}
            >
              <IconChartBar size={18} className="mr-2" />
              Property Comparison
            </button>
            
            <button
              onClick={() => setActiveTab('market-comparison')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'market-comparison' ? tabActive : tabInactive
              }`}
            >
              <IconInfoCircle size={18} className="mr-2" />
              Market Comparison
            </button>
            
            <button
              onClick={() => setActiveTab('market-map')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'market-map' ? tabActive : tabInactive
              }`}
            >
              <IconMap size={18} className="mr-2" />
              Market Map
            </button>
          </div>
        </div>
        
        <div className={contentClass}>
          {activeTab === 'affordability' && (
            <AffordabilityCalculator property={property} variant={variant} />
          )}
          
          {activeTab === 'property-cost' && (
            <PropertyCostCalculator />
          )}
          
          {activeTab === 'property-comparison' && (
            <PropertyComparisonCalculator />
          )}
          
          {activeTab === 'market-comparison' && (
            <MarketComparisonCalculator />
          )}
          
          {activeTab === 'market-map' && (
            <MarketMapCalculator 
              initialProperty={property}
              onPropertySelect={(selectedProperty) => {
                // Handle property selection from map
                console.log('Property selected from map:', selectedProperty);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RentCalculator;