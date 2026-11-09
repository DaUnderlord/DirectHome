import {
  BuildingType,
  FinishingQuality,
  MaterialCategory,
  RoofingChoice,
} from '../../types/construction';

export const QUALITY_LABELS: Record<FinishingQuality, string> = {
  [FinishingQuality.ECONOMY]: 'Economy',
  [FinishingQuality.STANDARD]: 'Standard',
  [FinishingQuality.PREMIUM]: 'Premium',
  [FinishingQuality.LUXURY]: 'Luxury',
};

export const BUILDING_LABELS: Record<BuildingType, string> = {
  [BuildingType.BUNGALOW]: 'Bungalow',
  [BuildingType.DUPLEX]: 'Duplex',
  [BuildingType.STOREY_BUILDING]: 'Storey building',
  [BuildingType.APARTMENT_BLOCK]: 'Apartment block',
  [BuildingType.COMMERCIAL]: 'Commercial building',
};

/** Package tiers shown to users, in display order. Prices come from ESTIMATOR_PRICE_NGN. */
export const ESTIMATOR_PACKAGE_ORDER: BuildingType[] = [
  BuildingType.BUNGALOW,
  BuildingType.DUPLEX,
  BuildingType.STOREY_BUILDING,
  BuildingType.APARTMENT_BLOCK,
  BuildingType.COMMERCIAL,
];

/** Footnote on the estimate result screen and the BOQ / PDF report. */
export const PROFESSIONAL_SERVICES_NOTE =
  'This is a planning estimate, not a tender document. For full construction drawings, a detailed bill of quantities (BOQ) for tender, and engineering drawings, contact DirectHome and our team will prepare them for your project.';

export const PROFESSIONAL_SERVICES_PATH = '/contact';

export const ROOFING_LABELS: Record<RoofingChoice, string> = {
  [RoofingChoice.AUTO]: 'Matches finishing quality',
  [RoofingChoice.LONGSPAN]: 'Long-span aluminium',
  [RoofingChoice.STONE_COATED]: 'Stone-coated sheets',
};

export const CATEGORY_LABELS: Record<string, string> = {
  [MaterialCategory.FOUNDATION]: 'Foundation',
  [MaterialCategory.STRUCTURE]: 'Structure',
  [MaterialCategory.WALLS]: 'Walls',
  [MaterialCategory.ROOFING]: 'Roofing',
  [MaterialCategory.FLOORING]: 'Flooring',
  [MaterialCategory.PLUMBING]: 'Plumbing',
  [MaterialCategory.ELECTRICAL]: 'Electrical',
  [MaterialCategory.DOORS_WINDOWS]: 'Doors & windows',
  [MaterialCategory.FINISHING]: 'Finishing',
  [MaterialCategory.PAINTING]: 'Painting',
  [MaterialCategory.FIXTURES]: 'Fixtures',
};

export const BREAKDOWN_BAR: Record<string, string> = {
  Materials: 'bg-courtyard-700',
  Labour: 'bg-brass-500',
  'Professional fees': 'bg-ink-800',
  'Permits & approvals': 'bg-ink-400',
  'Site extras': 'bg-courtyard-500',
  Contingency: 'bg-laterite-500',
  'VAT (7.5%)': 'bg-paper-400',
};
