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
}

const RentCalculator: React.FC<RentCalculatorProps> = ({ 
  property,
  initialTab = 'affordability',
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3">
          <IconCalculator size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Rent Calculator</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Calculate rent affordability, property costs, and compare options to make informed decisions.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('affordability')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'affordability'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconCurrencyDollar size={18} className="mr-2" />
              Affordability
            </button>
            
            <button
              onClick={() => setActiveTab('property-cost')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'property-cost'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconBuildingSkyscraper size={18} className="mr-2" />
              Property Cost
            </button>
            
            <button
              onClick={() => setActiveTab('property-comparison')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'property-comparison'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconChartBar size={18} className="mr-2" />
              Property Comparison
            </button>
            
            <button
              onClick={() => setActiveTab('market-comparison')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'market-comparison'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconInfoCircle size={18} className="mr-2" />
              Market Comparison
            </button>
            
            <button
              onClick={() => setActiveTab('market-map')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'market-map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconMap size={18} className="mr-2" />
              Market Map
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'affordability' && (
            <AffordabilityCalculator property={property} />
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