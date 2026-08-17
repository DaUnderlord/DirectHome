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
import ToolShell from '../UI/ToolShell';
import ResultPaywall, { useToolUnlock } from '../UI/ResultPaywall';
import NumberField, { toolSelectClass } from '../UI/NumberField';
import plateBuild from '../../assets/plate-build.png';

const BREAKDOWN_BAR_COLORS: Record<string, string> = {
  Materials: 'bg-blue-500',
  Labor: 'bg-green-500',
  'Professional Fees': 'bg-purple-500',
  'Permits & Approvals': 'bg-yellow-500',
  'Add-ons': 'bg-teal-500',
  Contingency: 'bg-orange-500',
  'VAT (7.5%)': 'bg-red-500',
};

const ESTIMATOR_FAQ = [
  {
    question: 'How accurate is this estimate?',
    answer:
      'Estimates use 2024+ Nigerian market prices for materials, labor, and fees. Actual costs vary by site conditions, contractor rates, and material availability — always get multiple quotes.',
  },
  {
    question: 'Which locations are supported?',
    answer:
      'Pricing tiers cover Lagos, Abuja, Port Harcourt, and other states with location multipliers applied automatically.',
  },
  {
    question: 'Does it include professional fees and permits?',
    answer:
      'Yes. The breakdown includes architect and engineering fees (by building type), permits, contingency, and VAT at 7.5%.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'You can fill in every step for free. Unlocking the full estimate and download is ₦399 per session.',
  },
];

const ConstructionCostEstimator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [estimate, setEstimate] = useState<ConstructionEstimate | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { unlocked, unlock } = useToolUnlock('construction-estimator');
  
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
    if (
      !Number.isFinite(specs.numberOfBedrooms) ||
      specs.numberOfBedrooms < 1 ||
      !Number.isFinite(specs.numberOfBathrooms) ||
      specs.numberOfBathrooms < 1 ||
      !Number.isFinite(specs.numberOfFloors) ||
      specs.numberOfFloors < 1 ||
      !Number.isFinite(specs.totalSquareMeters) ||
      specs.totalSquareMeters < 50
    ) {
      setValidationError('Please enter valid building details before calculating.');
      return;
    }

    setValidationError(null);
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
Add-ons: ${formatCurrency(estimate.breakdown.addons)}
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

ADD-ONS
=======
${estimate.addonCosts.length
  ? estimate.addonCosts.map(item =>
      `${item.description}: ${item.quantity} ${item.unit} @ ${formatCurrency(item.unitCost)} = ${formatCurrency(item.totalCost)}`
    ).join('\n')
  : 'None selected'}

LABOR BREAKDOWN
===============
${estimate.laborCosts.map(item =>
  `${item.category}: ${item.estimatedDays} days @ ${formatCurrency(item.costPerDay)}/day = ${formatCurrency(item.totalCost)}`
).join('\n')}

PROFESSIONAL FEES
=================
Architect: ${formatCurrency(estimate.professionalFees.architect)}
${estimate.professionalFees.structuralEngineer > 0 ? `Structural Engineer: ${formatCurrency(estimate.professionalFees.structuralEngineer)}\n` : ''}Electrical Engineer: ${formatCurrency(estimate.professionalFees.electricalEngineer)}
${estimate.professionalFees.mechanicalEngineer > 0 ? `Mechanical Engineer: ${formatCurrency(estimate.professionalFees.mechanicalEngineer)}\n` : ''}Project Manager: ${formatCurrency(estimate.professionalFees.projectManager)}

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
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-ink-950">Building type & size</h3>

      <label className="block">
        <span className="block text-sm font-medium text-ink-800 mb-2">Building Type</span>
        <select
          value={specs.buildingType}
          onChange={(e) => setSpecs({ ...specs, buildingType: e.target.value as BuildingType })}
          className={toolSelectClass}
        >
          <option value={BuildingType.BUNGALOW}>Bungalow</option>
          <option value={BuildingType.DUPLEX}>Duplex</option>
          <option value={BuildingType.STOREY_BUILDING}>Storey Building</option>
          <option value={BuildingType.APARTMENT_BLOCK}>Apartment Block</option>
          <option value={BuildingType.COMMERCIAL}>Commercial Building</option>
        </select>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          label="Number of Bedrooms"
          value={specs.numberOfBedrooms}
          min={1}
          max={20}
          onChange={(numberOfBedrooms) => setSpecs({ ...specs, numberOfBedrooms })}
        />
        <NumberField
          label="Number of Bathrooms"
          value={specs.numberOfBathrooms}
          min={1}
          max={20}
          onChange={(numberOfBathrooms) => setSpecs({ ...specs, numberOfBathrooms })}
        />
        <NumberField
          label="Number of Floors"
          value={specs.numberOfFloors}
          min={1}
          max={10}
          onChange={(floors) =>
            setSpecs({
              ...specs,
              numberOfFloors: floors,
              features: floors < 3 ? { ...specs.features, hasElevator: false } : specs.features,
            })
          }
        />
        <NumberField
          label="Total Area"
          value={specs.totalSquareMeters}
          min={50}
          max={5000}
          suffix="sqm"
          hint="You can type freely — the value is checked when you leave the field."
          onChange={(totalSquareMeters) => setSpecs({ ...specs, totalSquareMeters })}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-100">Location</h3>
      
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-2">
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
          className={toolSelectClass}
        >
          {nigerianStates.map(state => (
            <option key={state.name} value={state.name}>
              {state.name} ({state.tier === LocationTier.TIER_1 ? 'Major City' : 
                           state.tier === LocationTier.TIER_2 ? 'Urban' : 'Other'})
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-stone-500">
          Location affects material and labor costs. Major cities (Lagos, Abuja) have higher costs.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-100">Finishing Quality</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { value: FinishingQuality.ECONOMY, label: 'Economy', desc: 'Budget materials, simple finishes' },
          { value: FinishingQuality.STANDARD, label: 'Standard', desc: 'Good quality materials, decent finishes' },
          { value: FinishingQuality.PREMIUM, label: 'Premium', desc: 'High-quality materials, excellent finishes' },
          { value: FinishingQuality.LUXURY, label: 'Luxury', desc: 'Top-tier materials, luxury finishes' }
        ].map(quality => (
          <button
            key={quality.value}
            onClick={() => setSpecs({ ...specs, finishingQuality: quality.value })}
            className={`p-4 min-h-[4.5rem] border-2 rounded-sm text-left transition-all ${
              specs.finishingQuality === quality.value
                ? 'border-gold-500 bg-gold-500/10'
                : 'border-charcoal-600 hover:border-charcoal-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-stone-100">{quality.label}</div>
                <div className="text-sm text-stone-400">{quality.desc}</div>
              </div>
              {specs.finishingQuality === quality.value && (
                <IconCheck size={24} className="text-gold-400" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const optionalFeatures = [
      { key: 'hasSwimmingPool', label: 'Swimming Pool' },
      { key: 'hasBQ', label: 'Boys Quarters (BQ)' },
      { key: 'hasGarage', label: 'Garage' },
      { key: 'hasFence', label: 'Fence/Perimeter Wall' },
      { key: 'hasGate', label: 'Gate' },
      { key: 'hasGenerator', label: 'Generator' },
      { key: 'hasSolarPanels', label: 'Solar Panels' },
      { key: 'hasWaterTreatment', label: 'Water Treatment' },
      ...(specs.numberOfFloors >= 3 ? [{ key: 'hasElevator', label: 'Elevator' }] : [])
    ];

    return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-100">Additional Features</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {optionalFeatures.map(feature => (
          <label key={feature.key} className="flex items-center space-x-3 p-3 min-h-12 border border-paper-300 rounded-sm hover:bg-paper-100 cursor-pointer">
            <input
              type="checkbox"
              checked={specs.features[feature.key as keyof typeof specs.features] as boolean}
              onChange={(e) => setSpecs({
                ...specs,
                features: { ...specs.features, [feature.key]: e.target.checked }
              })}
              className="w-5 h-5 text-gold-500 rounded focus:ring-2 focus:ring-gold-500 bg-charcoal-800 border-charcoal-600"
            />
            <span className="text-sm font-medium text-stone-300">{feature.label}</span>
          </label>
        ))}
      </div>

      {specs.features.hasGarage && (
        <div>
          <NumberField
            label="Number of Parking Spaces"
            value={specs.features.numberOfParkingSpaces}
            min={1}
            max={10}
            onChange={(numberOfParkingSpaces) =>
              setSpecs({
                ...specs,
                features: { ...specs.features, numberOfParkingSpaces },
              })
            }
          />
        </div>
      )}
    </div>
    );
  };

  const renderEstimate = () => {
    if (!estimate) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gold-600 to-gold-500 text-charcoal-950 p-6 rounded-lg">
            <div className="text-sm opacity-80 mb-1">Total Estimated Cost</div>
            <div className="text-3xl font-bold">{formatCurrency(estimate.grandTotal)}</div>
            <div className="text-sm opacity-70 mt-2">
              {formatCurrency(estimate.costPerSquareMeter)}/sqm
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white p-6 rounded-lg">
            <div className="text-sm opacity-90 mb-1">Estimated Duration</div>
            <div className="text-3xl font-bold">{estimate.estimatedDuration.months} months</div>
            <div className="text-sm opacity-75 mt-2">
              Including all phases
            </div>
          </div>

          <div className="bg-gradient-to-br from-charcoal-700 to-charcoal-800 text-stone-100 p-6 rounded-lg border border-charcoal-600">
            <div className="text-sm opacity-90 mb-1">Building Size</div>
            <div className="text-3xl font-bold">{estimate.specs.totalSquareMeters} sqm</div>
            <div className="text-sm opacity-75 mt-2">
              {estimate.specs.numberOfBedrooms} bed, {estimate.specs.numberOfBathrooms} bath
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-charcoal-800/50 p-6 rounded-lg border border-charcoal-700">
          <h4 className="text-lg font-semibold text-stone-100 mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            {[
              { label: 'Materials', amount: estimate.breakdown.materials },
              { label: 'Labor', amount: estimate.breakdown.labor },
              { label: 'Professional Fees', amount: estimate.breakdown.professional },
              { label: 'Permits & Approvals', amount: estimate.breakdown.permits },
              ...(estimate.breakdown.addons > 0
                ? [{ label: 'Add-ons', amount: estimate.breakdown.addons }]
                : []),
              { label: 'Contingency', amount: estimate.breakdown.contingency },
              { label: 'VAT (7.5%)', amount: estimate.vat }
            ].map(item => {
              const percentage = (item.amount / estimate.grandTotal) * 100;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-400">{item.label}</span>
                    <span className="font-semibold text-stone-100">
                      {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-charcoal-700 rounded-full h-2">
                    <div
                      className={`${BREAKDOWN_BAR_COLORS[item.label] || 'bg-blue-500'} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Material Costs Table */}
        <div className="bg-charcoal-800/50 p-6 rounded-lg border border-charcoal-700">
          <h4 className="text-lg font-semibold text-stone-100 mb-4">Material Costs</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-charcoal-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-stone-500 uppercase">Item</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">Unit Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700">
                {estimate.materialCosts.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-stone-200">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-stone-400 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-2 text-sm text-stone-400 text-right">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-stone-100 text-right">
                      {formatCurrency(item.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {estimate.materialCosts.length > 10 && (
            <p className="text-sm text-stone-500 mt-3">
              Showing 10 of {estimate.materialCosts.length} items. Download full report for complete details.
            </p>
          )}
        </div>

        {estimate.addonCosts.length > 0 && (
          <div className="bg-charcoal-800/50 p-6 rounded-lg border border-charcoal-700">
            <h4 className="text-lg font-semibold text-stone-100 mb-4">Add-ons</h4>
            <div className="space-y-2">
              {estimate.addonCosts.map((item) => (
                <div key={item.description} className="flex justify-between">
                  <span className="text-stone-400">{item.description}</span>
                  <span className="font-semibold text-stone-100">{formatCurrency(item.totalCost)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Fees */}
        <div className="bg-charcoal-800/50 p-6 rounded-lg border border-charcoal-700">
          <h4 className="text-lg font-semibold text-stone-100 mb-4">Professional Fees</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-400">Architect</span>
              <span className="font-semibold text-stone-100">{formatCurrency(estimate.professionalFees.architect)}</span>
            </div>
            {estimate.professionalFees.structuralEngineer > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-400">Structural Engineer</span>
                <span className="font-semibold text-stone-100">{formatCurrency(estimate.professionalFees.structuralEngineer)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-400">Electrical Engineer</span>
              <span className="font-semibold text-stone-100">{formatCurrency(estimate.professionalFees.electricalEngineer)}</span>
            </div>
            {estimate.professionalFees.mechanicalEngineer > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-400">Mechanical Engineer</span>
                <span className="font-semibold text-stone-100">{formatCurrency(estimate.professionalFees.mechanicalEngineer)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-400">Project Manager</span>
              <span className="font-semibold text-stone-100">{formatCurrency(estimate.professionalFees.projectManager)}</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadReport}
          className="w-full flex items-center justify-center px-6 py-3 bg-gold-500 text-charcoal-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <IconDownload size={20} className="mr-2" />
          Download Full Report
        </button>

        {/* Disclaimer */}
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
          <p className="text-sm text-gold-200/90">
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
    <ToolShell
      meta={{
        title: 'Construction Cost Estimator Nigeria — Build Budget Tool',
        description:
          'Construction cost estimator for Nigeria. Get detailed build estimates for bungalows, duplexes, and apartments with materials, labor, fees, and VAT. Unlock results for ₦399.',
        path: '/construction-estimator',
      }}
      eyebrow="₦399 to unlock results"
      heroTitle={
        <>
          Construction Cost Estimator for{' '}
          <span className="italic text-courtyard-700">Nigeria</span>
        </>
      }
      heroSubtitle="Step-by-step estimate for materials, labor, professional fees, permits, add-ons, and VAT — based on current Nigerian market prices."
      heroImage={plateBuild}
      faq={ESTIMATOR_FAQ}
    >
        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="md:hidden">
            <p className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold">
              Step {Math.min(currentStep, 4)} of 4
            </p>
            <p className="font-display text-xl font-semibold text-ink-950 mt-1">
              {steps[currentStep - 1]?.title}
            </p>
            <div className="flex gap-1.5 mt-3">
              {steps.slice(0, 4).map((step) => (
                <span
                  key={step.number}
                  className={`h-1 flex-1 rounded-full ${
                    currentStep >= step.number ? 'bg-courtyard-700' : 'bg-paper-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-between">
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
                          ? 'bg-gold-500 text-charcoal-950'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-charcoal-700 text-stone-500'
                      }`}
                    >
                      {isCompleted ? <IconCheck size={24} /> : <Icon size={24} />}
                    </div>
                    <span className="text-xs mt-2 text-stone-400">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-emerald-600' : 'bg-charcoal-700'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && (
            unlocked ? renderEstimate() : (
              <ResultPaywall
                toolId="construction-estimator"
                title="Unlock your construction estimate"
                onUnlocked={unlock}
              />
            )
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="mt-8 sticky bottom-0 -mx-4 px-4 py-4 bg-paper-50/95 backdrop-blur-sm border-t border-paper-200 sm:static sm:mx-0 sm:px-0 sm:py-0 sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
              {validationError && (
                <div className="mb-4 rounded-sm border border-laterite-500/30 bg-laterite-500/10 px-4 py-3 text-sm text-laterite-600">
                  {validationError}
                </div>
              )}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex-1 sm:flex-none min-h-12 px-6 py-3 border border-paper-300 rounded-sm text-ink-800 hover:bg-paper-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 sm:flex-none min-h-12 flex items-center justify-center px-6 py-3 bg-gold-500 text-charcoal-950 font-semibold rounded-sm hover:bg-gold-400"
                >
                  Next
                  <IconChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  className="flex-1 sm:flex-none min-h-12 flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-sm hover:bg-emerald-500"
                >
                  <IconCalculator size={20} className="mr-2" />
                  Calculate
                </button>
              )}
            </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setEstimate(null);
                }}
                className="px-6 py-2 border border-charcoal-600 rounded-lg text-stone-300 hover:bg-charcoal-800"
              >
                Start New Estimate
              </button>
            </div>
          )}
        </div>
    </ToolShell>
  );
};

export default ConstructionCostEstimator;
