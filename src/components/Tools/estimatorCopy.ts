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
