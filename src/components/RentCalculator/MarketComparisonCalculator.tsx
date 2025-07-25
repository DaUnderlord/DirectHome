import React, { useState } from 'react';
import { 
  IconInfoCircle, 
  IconChartBar, 
  IconArrowUp, 
  IconArrowDown, 
  IconMinus 
} from '@tabler/icons-react';
import { useRentCalculator } from '../../hooks/useRentCalculator';

const MarketComparisonCalculator: React.FC = () => {
  const {
    marketComparisonInput,
    marketComparisonResult,
    setMarketComparisonInput,
    calculateMarketComparison,
    formatCurrency
  } = useRentCalculator();

  const [showInfo, setShowInfo] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setMarketComparisonInput({ [name]: parseFloat(value) || 0 });
    } else {
      setMarketComparisonInput({ [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMarketComparison();
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <IconArrowUp size={16} className="text-red-500" />;
      case 'falling':
        return <IconArrowDown size={16} className="text-green-500" />;
      default:
        return <IconMinus size={16} className="text-gray-500" />;
    }
  };

  // Get trend text
  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'Rising (prices increasing)';
      case 'falling':
        return 'Falling (prices decreasing)';
      default:
        return 'Stable (prices steady)';
    }
  };

  // Get trend color
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-red-500';
      case 'falling':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Market Comparison Calculator</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-gray-700"
        >
          <IconInfoCircle size={20} />
        </button>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">About Market Comparison</h4>
          <p className="text-sm text-blue-800">
            This calculator helps you compare property prices with the current market rates in your desired location.
            It provides insights on average rents, price ranges, and market trends to help you make informed decisions.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              name="propertyType"
              value={marketComparisonInput.propertyType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Duplex">Duplex</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Studio">Studio</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              name="location"
              value={marketComparisonInput.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Location</option>
              <option value="Lekki">Lekki</option>
              <option value="Victoria Island">Victoria Island</option>
              <option value="Ikoyi">Ikoyi</option>
              <option value="Ikeja">Ikeja</option>
              <option value="Yaba">Yaba</option>
              <option value="Surulere">Surulere</option>
              <option value="Ajah">Ajah</option>
              <option value="Gbagada">Gbagada</option>
              <option value="Magodo">Magodo</option>
              <option value="Maryland">Maryland</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Bedrooms
            </label>
            <select
              name="bedrooms"
              value={marketComparisonInput.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Bedrooms</option>
              <option value="0">Studio (0 bedroom)</option>
              <option value="1">1 bedroom</option>
              <option value="2">2 bedrooms</option>
              <option value="3">3 bedrooms</option>
              <option value="4">4 bedrooms</option>
              <option value="5">5+ bedrooms</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Size (sq.m)
            </label>
            <input
              type="number"
              name="size"
              value={marketComparisonInput.size || ''}
              onChange={handleInputChange}
              placeholder="e.g., 80"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Optional, used to calculate price per square meter</p>
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!marketComparisonInput.propertyType || !marketComparisonInput.location || !marketComparisonInput.bedrooms}
            >
              Compare with Market
            </button>
          </div>
        </div>
      </form>
      
      {/* Results */}
      {marketComparisonResult && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Market Comparison Results</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Average Rent</h5>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(marketComparisonResult.averageRent)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Average monthly rent for similar properties
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Rent Range</h5>
              <div className="text-lg font-medium text-gray-700">
                {formatCurrency(marketComparisonResult.rentRange.min)} - {formatCurrency(marketComparisonResult.rentRange.max)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Typical price range in this area
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Market Trend</h5>
              <div className="flex items-center text-lg font-medium">
                {getTrendIcon(marketComparisonResult.marketTrend)}
                <span className={`ml-2 ${getTrendColor(marketComparisonResult.marketTrend)}`}>
                  {getTrendText(marketComparisonResult.marketTrend)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Current market direction in this area
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Similar Properties</h5>
              <div className="text-lg font-medium text-gray-700">
                {marketComparisonResult.similarProperties.count} properties found
              </div>
              <p className="text-sm text-gray-600">
                Average rent: {formatCurrency(marketComparisonResult.similarProperties.averageRent)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Properties with similar features in this location
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Price per Square Meter</h5>
              <div className="text-lg font-medium text-gray-700">
                {marketComparisonResult.pricePerSquareMeter > 0
                  ? formatCurrency(marketComparisonResult.pricePerSquareMeter) + '/sq.m'
                  : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {marketComparisonResult.pricePerSquareMeter > 0
                  ? 'Average monthly cost per square meter'
                  : 'Property size required for this calculation'}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Market Position</h5>
            
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Lowest</span>
                <span>Average</span>
                <span>Highest</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-2 bg-blue-500 rounded-full"
                  style={{ 
                    left: '0%', 
                    width: `${marketComparisonResult.percentile}%` 
                  }}
                ></div>
                <div 
                  className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 transform -translate-x-1/2"
                  style={{ 
                    left: `${marketComparisonResult.percentile}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              The average rent for this type of property in {marketComparisonInput.location} is in the 
              <span className="font-medium"> {marketComparisonResult.percentile.toFixed(0)}th percentile </span> 
              of the market. This means it's 
              {marketComparisonResult.percentile < 25 ? ' lower than most similar properties.' : 
               marketComparisonResult.percentile < 50 ? ' below average compared to similar properties.' :
               marketComparisonResult.percentile < 75 ? ' above average compared to similar properties.' :
               ' higher than most similar properties.'}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h6 className="text-sm font-medium text-gray-900 mb-2">Market Insights</h6>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {marketComparisonResult.marketTrend === 'rising' ? (
                    <span>Prices in this area are trending upward. Consider securing a longer lease term to lock in current rates.</span>
                  ) : marketComparisonResult.marketTrend === 'falling' ? (
                    <span>Prices in this area are trending downward. You may have room to negotiate better rates.</span>
                  ) : (
                    <span>Prices in this area are relatively stable. This suggests a balanced market.</span>
                  )}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    {marketComparisonInput.propertyType} properties with {marketComparisonInput.bedrooms} bedroom(s) in {marketComparisonInput.location} typically rent for {formatCurrency(marketComparisonResult.averageRent)} per month.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    The price range for similar properties is between {formatCurrency(marketComparisonResult.rentRange.min)} and {formatCurrency(marketComparisonResult.rentRange.max)} per month.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketComparisonCalculator;