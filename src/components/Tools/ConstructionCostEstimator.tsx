import React, { useState } from 'react';
import {
  IconBuilding,
  IconRuler,
  IconMapPin,
  IconSparkles,
  IconCalculator,
  IconDownload,
  IconChevronRight,
  IconCheck
} from '@tabler/icons-react';
import {
  ConstructionSpecs,
  ConstructionEstimate,
  BuildingType,
  FinishingQuality,
  LocationTier
} from '../../types/construction';
import constructionCostService from '../../services/constructionCostService';

const ConstructionCostEstimator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [estimate, setEstimate] = useState<ConstructionEstimate | null>(null);
  
  const [specs, setSpecs] = useState<ConstructionSpecs>({
    buildingType: BuildingType.BUNGALOW,
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    numberOfFloors: 1,
    totalSquareMeters: 150,
    finishingQuality: FinishingQuality.STANDARD,
    location: {
      state: 'Lagos',
      city: 'Lagos',
      tier: LocationTier.TIER_1
    },
    features: {
      hasSwimmingPool: false,
      hasBQ: false,
      hasGarage: true,
      numberOfParkingSpaces: 2,
      hasFence: true,
      hasGate: true,
      hasGenerator: false,
      hasSolarPanels: false,
      hasWaterTreatment: false,
      hasElevator: false
    },
    utilities: {
      plumbingComplexity: 'standard',
      electricalComplexity: 'standard',
      hvacSystem: false,
      smartHomeFeatures: false
    }
  });

  const nigerianStates = [
    { name: 'Lagos', tier: LocationTier.TIER_1 },
    { name: 'Abuja', tier: LocationTier.TIER_1 },
    { name: 'Port Harcourt', tier: LocationTier.TIER_2 },
    { name: 'Ibadan', tier: LocationTier.TIER_2 },
    { name: 'Kano', tier: LocationTier.TIER_2 },
    { name: 'Enugu', tier: LocationTier.TIER_3 },
    { name: 'Kaduna', tier: LocationTier.TIER_3 },
    { name: 'Benin City', tier: LocationTier.TIER_3 },
    { name: 'Calabar', tier: LocationTier.TIER_3 },
    { name: 'Owerri', tier: LocationTier.TIER_3 }
  ];

  const handleCalculate = () => {
    const result = constructionCostService.calculateEstimate(specs);
    setEstimate(result);
    setCurrentStep(5);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
  };

  const downloadReport = () => {
    if (!estimate) return;

    const reportContent = `
CONSTRUCTION COST ESTIMATE REPORT
Generated: ${new Date().toLocaleDateString()}

PROJECT DETAILS
===============
Building Type: ${estimate.specs.buildingType}
Location: ${estimate.specs.location.city}, ${estimate.specs.location.state}
Total Area: ${estimate.specs.totalSquareMeters} sqm
Bedrooms: ${estimate.specs.numberOfBedrooms}
Bathrooms: ${estimate.specs.numberOfBathrooms}
Floors: ${estimate.specs.numberOfFloors}
Finishing Quality: ${estimate.specs.finishingQuality}

COST SUMMARY
============
Materials: ${formatCurrency(estimate.breakdown.materials)}
Labor: ${formatCurrency(estimate.breakdown.labor)}
Professional Fees: ${formatCurrency(estimate.breakdown.professional)}
Permits & Approvals: ${formatCurrency(estimate.breakdown.permits)}
Contingency (10-15%): ${formatCurrency(estimate.breakdown.contingency)}
VAT (7.5%): ${formatCurrency(estimate.vat)}

GRAND TOTAL: ${formatCurrency(estimate.grandTotal)}
Cost per Square Meter: ${formatCurrency(estimate.costPerSquareMeter)}

Estimated Duration: ${estimate.estimatedDuration.months} months

MATERIAL BREAKDOWN
==================
${estimate.materialCosts.map(item => 
  `${item.description}: ${item.quantity} ${item.unit} @ ${formatCurrency(item.unitCost)} = ${formatCurrency(item.totalCost)}`
).join('\n')}

LABOR BREAKDOWN
===============
${estimate.laborCosts.map(item =>
  `${item.category}: ${item.estimatedDays} days @ ${formatCurrency(item.costPerDay)}/day = ${formatCurrency(item.totalCost)}`
).join('\n')}

PROFESSIONAL FEES
=================
Architect: ${formatCurrency(estimate.professionalFees.architect)}
Engineer: ${formatCurrency(estimate.professionalFees.engineer)}
Surveyor: ${formatCurrency(estimate.professionalFees.surveyor)}
Project Manager: ${formatCurrency(estimate.professionalFees.projectManager)}

PERMITS & APPROVALS
===================
Building Permit: ${formatCurrency(estimate.permits.buildingPermit)}
Environmental Approval: ${formatCurrency(estimate.permits.environmentalApproval)}
Utility Connections: ${formatCurrency(estimate.permits.utilityConnections)}

---
This is an estimate only. Actual costs may vary based on market conditions, 
specific site requirements, and material availability.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `construction-estimate-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Building Type & Size</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Building Type
        </label>
        <select
          value={specs.buildingType}
          onChange={(e) => setSpecs({ ...specs, buildingType: e.target.value as BuildingType })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={BuildingType.BUNGALOW}>Bungalow</option>
          <option value={BuildingType.DUPLEX}>Duplex</option>
          <option value={BuildingType.STOREY_BUILDING}>Storey Building</option>
          <option value={BuildingType.APARTMENT_BLOCK}>Apartment Block</option>
          <option value={BuildingType.COMMERCIAL}>Commercial Building</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Bedrooms
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={specs.numberOfBedrooms}
            onChange={(e) => setSpecs({ ...specs, numberOfBedrooms: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Bathrooms
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={specs.numberOfBathrooms}
            onChange={(e) => setSpecs({ ...specs, numberOfBathrooms: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Floors
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={specs.numberOfFloors}
            onChange={(e) => setSpecs({ ...specs, numberOfFloors: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Area (sqm)
          </label>
          <input
            type="number"
            min="50"
            max="5000"
            value={specs.totalSquareMeters}
            onChange={(e) => setSpecs({ ...specs, totalSquareMeters: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Location</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/City
        </label>
        <select
          value={specs.location.state}
          onChange={(e) => {
            const selected = nigerianStates.find(s => s.name === e.target.value);
            setSpecs({
              ...specs,
              location: {
                state: e.target.value,
                city: e.target.value,
                tier: selected?.tier || LocationTier.TIER_3
              }
            });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {nigerianStates.map(state => (
            <option key={state.name} value={state.name}>
              {state.name} ({state.tier === LocationTier.TIER_1 ? 'Major City' : 
                           state.tier === LocationTier.TIER_2 ? 'Urban' : 'Other'})
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Location affects material and labor costs. Major cities (Lagos, Abuja) have higher costs.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Finishing Quality</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { value: FinishingQuality.BASIC, label: 'Basic', desc: 'Standard materials, simple finishes' },
          { value: FinishingQuality.STANDARD, label: 'Standard', desc: 'Good quality materials, decent finishes' },
          { value: FinishingQuality.PREMIUM, label: 'Premium', desc: 'High-quality materials, excellent finishes' },
          { value: FinishingQuality.LUXURY, label: 'Luxury', desc: 'Top-tier materials, luxury finishes' }
        ].map(quality => (
          <button
            key={quality.value}
            onClick={() => setSpecs({ ...specs, finishingQuality: quality.value })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              specs.finishingQuality === quality.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{quality.label}</div>
                <div className="text-sm text-gray-600">{quality.desc}</div>
              </div>
              {specs.finishingQuality === quality.value && (
                <IconCheck size={24} className="text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Additional Features</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'hasSwimmingPool', label: 'Swimming Pool' },
          { key: 'hasBQ', label: 'Boys Quarters (BQ)' },
          { key: 'hasGarage', label: 'Garage' },
          { key: 'hasFence', label: 'Fence/Perimeter Wall' },
          { key: 'hasGate', label: 'Gate' },
          { key: 'hasGenerator', label: 'Generator' },
          { key: 'hasSolarPanels', label: 'Solar Panels' },
          { key: 'hasWaterTreatment', label: 'Water Treatment' },
          { key: 'hasElevator', label: 'Elevator' }
        ].map(feature => (
          <label key={feature.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={specs.features[feature.key as keyof typeof specs.features] as boolean}
              onChange={(e) => setSpecs({
                ...specs,
                features: { ...specs.features, [feature.key]: e.target.checked }
              })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">{feature.label}</span>
          </label>
        ))}
      </div>

      {specs.features.hasGarage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Parking Spaces
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={specs.features.numberOfParkingSpaces}
            onChange={(e) => setSpecs({
              ...specs,
              features: { ...specs.features, numberOfParkingSpaces: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );

  const renderEstimate = () => {
    if (!estimate) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="text-sm opacity-90 mb-1">Total Estimated Cost</div>
            <div className="text-3xl font-bold">{formatCurrency(estimate.grandTotal)}</div>
            <div className="text-sm opacity-75 mt-2">
              {formatCurrency(estimate.costPerSquareMeter)}/sqm
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="text-sm opacity-90 mb-1">Estimated Duration</div>
            <div className="text-3xl font-bold">{estimate.estimatedDuration.months} months</div>
            <div className="text-sm opacity-75 mt-2">
              Including all phases
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="text-sm opacity-90 mb-1">Building Size</div>
            <div className="text-3xl font-bold">{estimate.specs.totalSquareMeters} sqm</div>
            <div className="text-sm opacity-75 mt-2">
              {estimate.specs.numberOfBedrooms} bed, {estimate.specs.numberOfBathrooms} bath
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            {[
              { label: 'Materials', amount: estimate.breakdown.materials, color: 'blue' },
              { label: 'Labor', amount: estimate.breakdown.labor, color: 'green' },
              { label: 'Professional Fees', amount: estimate.breakdown.professional, color: 'purple' },
              { label: 'Permits & Approvals', amount: estimate.breakdown.permits, color: 'yellow' },
              { label: 'Contingency', amount: estimate.breakdown.contingency, color: 'orange' },
              { label: 'VAT (7.5%)', amount: estimate.vat, color: 'red' }
            ].map(item => {
              const percentage = (item.amount / estimate.grandTotal) * 100;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Material Costs Table */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Material Costs</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estimate.materialCosts.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(item.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {estimate.materialCosts.length > 10 && (
            <p className="text-sm text-gray-500 mt-3">
              Showing 10 of {estimate.materialCosts.length} items. Download full report for complete details.
            </p>
          )}
        </div>

        {/* Professional Fees */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Fees</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Architect</span>
              <span className="font-semibold">{formatCurrency(estimate.professionalFees.architect)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Structural Engineer</span>
              <span className="font-semibold">{formatCurrency(estimate.professionalFees.engineer)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Land Surveyor</span>
              <span className="font-semibold">{formatCurrency(estimate.professionalFees.surveyor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Project Manager</span>
              <span className="font-semibold">{formatCurrency(estimate.professionalFees.projectManager)}</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadReport}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconDownload size={20} className="mr-2" />
          Download Full Report
        </button>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This is an estimate based on average market prices in Nigeria as of 2024. 
            Actual costs may vary based on specific site conditions, material availability, contractor rates, 
            and market fluctuations. Always get multiple quotes from licensed contractors.
          </p>
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, title: 'Building Details', icon: IconBuilding },
    { number: 2, title: 'Location', icon: IconMapPin },
    { number: 3, title: 'Finishing', icon: IconSparkles },
    { number: 4, title: 'Features', icon: IconRuler },
    { number: 5, title: 'Estimate', icon: IconCalculator }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Construction Cost Estimator
          </h1>
          <p className="text-lg text-gray-600">
            Get a detailed estimate for building your property in Nigeria
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <IconCheck size={24} /> : <Icon size={24} />}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderEstimate()}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <IconChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <IconCalculator size={20} className="mr-2" />
                  Calculate Estimate
                </button>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setEstimate(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Start New Estimate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstructionCostEstimator;
