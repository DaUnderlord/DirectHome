import React, { useEffect, useState } from 'react';
import {
  IconBuilding,
  IconRuler,
  IconMapPin,
  IconSparkles,
  IconCalculator,
  IconChevronRight,
  IconCheck,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ConstructionSpecs,
  BuildingType,
  FinishingQuality,
  LocationTier,
  RoofingChoice,
} from '../../types/construction';
import {
  archiveAndClear,
  loadDraft,
  loadHistory,
  saveDraft,
  type SavedEstimateResult,
} from '../../services/estimateStorage';
import {
  createConstructionProject,
  projectRoute,
} from '../../services/constructionProjectService';
import { useAuth } from '../../context/AuthContext';
import ToolShell from '../UI/ToolShell';
import NumberField, { toolSelectClass } from '../UI/NumberField';
import plateBuild from '../../assets/plate-build.png';
import { BUILDING_LABELS, QUALITY_LABELS } from './estimatorCopy';

const ESTIMATOR_FAQ = [
  {
    question: 'How accurate is this estimate?',
    answer:
      'The total is driven mainly by floor area, city, and finishing. Unit rates are DirectHome’s client-reviewed Nigerian market rates as of August 2026. Site conditions and contractor quotes will differ — always get more than one quote.',
  },
  {
    question: 'Which locations are supported?',
    answer:
      'Lagos and Abuja use major-city rates. Port Harcourt, Ibadan, and Kano use urban rates. Other listed cities and a rural/peri-urban option use lower multipliers.',
  },
  {
    question: 'What do I get for ₦399?',
    answer:
      'You can fill every step for free. Unlocking is ₦399 per build project and reveals the total, finishing comparison, bill of quantities, labour, staged cash calendar, and a print-ready PDF for that project.',
  },
  {
    question: 'Does it include professional fees and permits?',
    answer:
      'Yes. Architect and engineering fees (by building type), permits, contingency, and VAT at 7.5% are in the unlocked report.',
  },
];

const DEFAULT_SPECS: ConstructionSpecs = {
  buildingType: BuildingType.BUNGALOW,
  numberOfBedrooms: 3,
  numberOfBathrooms: 2,
  numberOfFloors: 1,
  totalSquareMeters: 150,
  finishingQuality: FinishingQuality.STANDARD,
  roofing: RoofingChoice.AUTO,
  plotSquareMeters: 0,
  location: {
    state: 'Lagos',
    city: 'Lagos',
    tier: LocationTier.TIER_1,
  },
  features: {
    hasSwimmingPool: false,
    hasBQ: false,
    hasGarage: false,
    numberOfParkingSpaces: 2,
    hasFence: true,
    hasGate: false,
    hasGenerator: false,
    hasSolarPanels: false,
    hasWaterTreatment: false,
    hasElevator: false,
  },
  utilities: {
    plumbingComplexity: 'standard',
    electricalComplexity: 'standard',
    hvacSystem: false,
    smartHomeFeatures: false,
  },
};

function floorsForType(type: BuildingType, current: number): number {
  switch (type) {
    case BuildingType.BUNGALOW:
      return 1;
    case BuildingType.DUPLEX:
      return 2;
    case BuildingType.STOREY_BUILDING:
    case BuildingType.APARTMENT_BLOCK:
      return Math.max(current, 3);
    case BuildingType.COMMERCIAL:
      return current < 2 ? 2 : current;
    default:
      return current;
  }
}

function normalizeSpecs(input?: Partial<ConstructionSpecs> | null): ConstructionSpecs {
  const specs = input || {};
  const floors = specs.numberOfFloors ?? DEFAULT_SPECS.numberOfFloors;
  return {
    ...DEFAULT_SPECS,
    ...specs,
    roofing: specs.roofing ?? RoofingChoice.AUTO,
    plotSquareMeters: specs.plotSquareMeters ?? 0,
    location: { ...DEFAULT_SPECS.location, ...specs.location },
    features: { ...DEFAULT_SPECS.features, ...specs.features },
    utilities: { ...DEFAULT_SPECS.utilities, ...specs.utilities },
    numberOfFloors: floors,
  };
}

function suggestedSqm(beds: number, type: BuildingType): number {
  const base = beds <= 2 ? 90 : beds === 3 ? 150 : beds === 4 ? 220 : 280;
  if (type === BuildingType.DUPLEX) return Math.round(base * 1.35);
  if (type === BuildingType.APARTMENT_BLOCK) return Math.round(base * 1.6);
  if (type === BuildingType.COMMERCIAL) return Math.round(base * 1.4);
  return base;
}

const ConstructionCostEstimator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const restoredDraft = loadDraft();
  const [currentStep, setCurrentStep] = useState(() =>
    restoredDraft?.step && restoredDraft.step < 5 ? restoredDraft.step : 1
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedEstimateResult[]>(() => loadHistory());
  const [creating, setCreating] = useState(false);

  const [specs, setSpecs] = useState<ConstructionSpecs>(() =>
    normalizeSpecs(restoredDraft?.specs)
  );

  useEffect(() => {
    if (currentStep < 5) saveDraft(specs, currentStep);
  }, [specs, currentStep]);

  const nigerianStates = [
    { name: 'Lagos', tier: LocationTier.TIER_1, label: 'Major city' },
    { name: 'Abuja', tier: LocationTier.TIER_1, label: 'Major city' },
    { name: 'Port Harcourt', tier: LocationTier.TIER_2, label: 'Urban' },
    { name: 'Ibadan', tier: LocationTier.TIER_2, label: 'Urban' },
    { name: 'Kano', tier: LocationTier.TIER_2, label: 'Urban' },
    { name: 'Enugu', tier: LocationTier.TIER_3, label: 'Other' },
    { name: 'Kaduna', tier: LocationTier.TIER_3, label: 'Other' },
    { name: 'Benin City', tier: LocationTier.TIER_3, label: 'Other' },
    { name: 'Calabar', tier: LocationTier.TIER_3, label: 'Other' },
    { name: 'Owerri', tier: LocationTier.TIER_3, label: 'Other' },
    { name: 'Rural / peri-urban', tier: LocationTier.RURAL, label: 'Rural' },
  ];

  const handleCalculate = async () => {
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
    setCreating(true);

    try {
      const normalized = normalizeSpecs(specs);
      const saved = await createConstructionProject({
        specs: normalized,
      });

      if (!saved.ok || !saved.project?.id) {
        setValidationError(saved.error || 'Could not save project. Try again.');
        return;
      }

      archiveAndClear();
      navigate(projectRoute(saved.project.id));
    } finally {
      setCreating(false);
    }
  };

  const typicalSqm = suggestedSqm(specs.numberOfBedrooms, specs.buildingType);

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-ink-950">Building type & size</h3>

      <label className="block">
        <span className="block text-sm font-medium text-ink-800 mb-2">Building Type</span>
        <select
          value={specs.buildingType}
          onChange={(e) => {
            const buildingType = e.target.value as BuildingType;
            const floors = floorsForType(buildingType, specs.numberOfFloors);
            setSpecs({
              ...specs,
              buildingType,
              numberOfFloors: floors,
              features: floors < 3 ? { ...specs.features, hasElevator: false } : specs.features,
            });
          }}
          className={toolSelectClass}
        >
          {Object.values(BuildingType).map((type) => (
            <option key={type} value={type}>
              {BUILDING_LABELS[type]}
            </option>
          ))}
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
        <div>
          <NumberField
            label="Total Area"
            value={specs.totalSquareMeters}
            min={50}
            max={5000}
            suffix="sqm"
            onChange={(totalSquareMeters) => setSpecs({ ...specs, totalSquareMeters })}
          />
          <button
            type="button"
            onClick={() => setSpecs({ ...specs, totalSquareMeters: typicalSqm })}
            className="mt-2 text-sm text-courtyard-700 hover:text-courtyard-600"
          >
            Typical {specs.numberOfBedrooms}-bed {BUILDING_LABELS[specs.buildingType].toLowerCase()}:{' '}
            {typicalSqm} sqm
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink-950">Location & plot</h3>

      <label className="block">
        <span className="block text-sm font-medium text-ink-800 mb-2">City</span>
        <select
          value={specs.location.state}
          onChange={(e) => {
            const selected = nigerianStates.find((s) => s.name === e.target.value);
            setSpecs({
              ...specs,
              location: {
                state: e.target.value,
                city: e.target.value,
                tier: selected?.tier || LocationTier.TIER_3,
              },
            });
          }}
          className={toolSelectClass}
        >
          {nigerianStates.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name} ({state.label})
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-ink-600">
          Major cities cost more for materials, labour, and permits. Floor area, city, and finishing
          drive most of the total.
        </p>
      </label>

      <NumberField
        label="Plot size (optional)"
        value={specs.plotSquareMeters}
        min={0}
        max={20000}
        suffix="sqm"
        hint="Used for fence length. Leave 0 to estimate from the building footprint."
        onChange={(plotSquareMeters) => setSpecs({ ...specs, plotSquareMeters })}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold text-ink-950">Finishing & roof</h3>

      <div className="grid grid-cols-1 gap-3">
        {[
          { value: FinishingQuality.ECONOMY, desc: 'Budget materials, simple finishes' },
          { value: FinishingQuality.STANDARD, desc: 'Good quality materials, decent finishes' },
          { value: FinishingQuality.PREMIUM, desc: 'High-quality materials, excellent finishes' },
          { value: FinishingQuality.LUXURY, desc: 'Top-tier materials, luxury finishes' },
        ].map((quality) => (
          <button
            key={quality.value}
            type="button"
            onClick={() => setSpecs({ ...specs, finishingQuality: quality.value })}
            className={`p-4 min-h-[4.5rem] border text-left transition-all ${
              specs.finishingQuality === quality.value
                ? 'border-courtyard-700 bg-courtyard-50'
                : 'border-paper-300 hover:border-courtyard-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-ink-950">{QUALITY_LABELS[quality.value]}</div>
                <div className="text-sm text-ink-600">{quality.desc}</div>
              </div>
              {specs.finishingQuality === quality.value && (
                <IconCheck size={22} className="text-courtyard-700" />
              )}
            </div>
          </button>
        ))}
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-ink-800 mb-2">Roof type</span>
        <select
          value={specs.roofing}
          onChange={(e) => setSpecs({ ...specs, roofing: e.target.value as RoofingChoice })}
          className={toolSelectClass}
        >
          <option value={RoofingChoice.AUTO}>Match finishing quality</option>
          <option value={RoofingChoice.LONGSPAN}>Long-span aluminium</option>
          <option value={RoofingChoice.STONE_COATED}>Stone-coated sheets</option>
        </select>
      </label>
    </div>
  );

  const renderStep4 = () => {
    const optionalFeatures = [
      { key: 'hasSwimmingPool', label: 'Swimming Pool' },
      { key: 'hasBQ', label: 'Boys Quarters (BQ)' },
      { key: 'hasGarage', label: 'Covered garage' },
      { key: 'hasFence', label: 'Fence / perimeter wall' },
      { key: 'hasGate', label: 'Entrance gate' },
      { key: 'hasGenerator', label: 'Generator' },
      { key: 'hasSolarPanels', label: 'Solar Panels' },
      { key: 'hasWaterTreatment', label: 'Water treatment' },
      ...(specs.numberOfFloors >= 3 ? [{ key: 'hasElevator', label: 'Elevator' }] : []),
    ];

    return (
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-ink-950">Additional features</h3>
        <p className="text-sm text-ink-600">
          Each option is costed in the report. Untick anything you will not build in this phase.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {optionalFeatures.map((feature) => (
            <label
              key={feature.key}
              className="flex items-center space-x-3 p-3 min-h-12 border border-paper-300 hover:bg-paper-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={specs.features[feature.key as keyof typeof specs.features] as boolean}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    features: { ...specs.features, [feature.key]: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-courtyard-700"
              />
              <span className="text-sm font-medium text-ink-800">{feature.label}</span>
            </label>
          ))}
        </div>

        {specs.features.hasGarage && (
          <NumberField
            label="Number of parking bays"
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
        )}
      </div>
    );
  };

  const steps = [
    { number: 1, title: 'Building Details', icon: IconBuilding },
    { number: 2, title: 'Location', icon: IconMapPin },
    { number: 3, title: 'Finishing', icon: IconSparkles },
    { number: 4, title: 'Features', icon: IconRuler },
  ];

  return (
    <ToolShell
      meta={{
        title: 'Construction Cost Estimator Nigeria — Build Budget Tool',
        description:
          'Construction cost estimator for Nigeria. Get a staged build budget for bungalows, duplexes, and apartments with materials, labour, fees, and VAT. Unlock the full report for ₦399.',
        path: '/construction-estimator',
      }}
      eyebrow="₦399 per build project"
      heroTitle={
        <>
          Build cost estimator
          <br />
          <span className="italic text-courtyard-700">for Nigeria.</span>
        </>
      }
      heroSubtitle="Step-by-step estimate for materials, labour, professional fees, permits, extras, and VAT — with a cash calendar you can fund in phases."
      heroImage={plateBuild}
      faq={ESTIMATOR_FAQ}
    >
      <div className="mb-6 md:mb-8">
        <div className="md:hidden">
          <p className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold">
            Step {currentStep} of 4
          </p>
          <p className="font-display text-xl font-semibold text-ink-950 mt-1">
            {steps[currentStep - 1]?.title}
          </p>
          <div className="flex gap-1.5 mt-3">
            {steps.slice(0, 4).map((step) => (
              <span
                key={step.number}
                className={`h-1 flex-1 ${
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
                    className={`w-12 h-12 flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-courtyard-700 text-paper-50'
                        : isCompleted
                          ? 'bg-courtyard-500 text-paper-50'
                          : 'bg-paper-200 text-ink-400'
                    }`}
                  >
                    {isCompleted ? <IconCheck size={22} /> : <Icon size={22} />}
                  </div>
                  <span className="text-xs mt-2 text-ink-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 ${isCompleted ? 'bg-courtyard-500' : 'bg-paper-300'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {currentStep === 1 && history.length > 0 && (
          <div className="mt-8 border border-paper-200 bg-paper-100 p-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-courtyard-700 font-semibold mb-2">
              Recent on this device
            </p>
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <button
                  key={item.savedAt}
                  type="button"
                  onClick={() => {
                    setSpecs(normalizeSpecs(item.specs));
                    setCurrentStep(1);
                  }}
                  className="w-full text-left text-sm text-ink-600 hover:text-courtyard-700"
                >
                  {new Date(item.savedAt).toLocaleDateString()} ·{' '}
                  {BUILDING_LABELS[item.specs.buildingType]} · {item.specs.totalSquareMeters} sqm
                </button>
              ))}
            </div>
            {user && (
              <Link
                to="/profile"
                className="inline-block mt-3 text-sm text-courtyard-700 hover:text-courtyard-600"
              >
                View paid projects in your profile →
              </Link>
            )}
          </div>
        )}

        {currentStep <= 4 && (
          <div className="mt-8 sticky bottom-0 -mx-4 px-4 py-4 bg-paper-50/95 backdrop-blur-sm border-t border-paper-200 sm:static sm:mx-0 sm:px-0 sm:py-0 sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
            {validationError && (
              <div className="mb-4 border border-laterite-500/30 bg-laterite-500/10 px-4 py-3 text-sm text-laterite-600">
                {validationError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex-1 sm:flex-none min-h-12 px-6 py-3 border border-paper-300 text-ink-800 hover:bg-paper-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 sm:flex-none min-h-12 flex items-center justify-center px-6 py-3 bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600"
                >
                  Next
                  <IconChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleCalculate()}
                  disabled={creating}
                  className="flex-1 sm:flex-none min-h-12 flex items-center justify-center px-6 py-3 bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600 disabled:opacity-50"
                >
                  <IconCalculator size={20} className="mr-2" />
                  {creating ? 'Saving project…' : 'Calculate'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default ConstructionCostEstimator;
