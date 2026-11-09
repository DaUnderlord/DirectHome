import { BuildingType } from '../types/construction';

/** Legacy flat price — still used for tools that are not priced per building type. */
export const TOOL_REPORT_PRICE_NGN = 399;

/**
 * Per-project estimator price by building type (package tiers).
 * Keep in sync with server/estimatorPricing.js — the server is what Flutterwave amounts are checked against.
 */
export const ESTIMATOR_PRICE_NGN: Record<BuildingType, number> = {
  [BuildingType.BUNGALOW]: 399,
  [BuildingType.DUPLEX]: 599,
  [BuildingType.STOREY_BUILDING]: 642,
  [BuildingType.APARTMENT_BLOCK]: 979,
  [BuildingType.COMMERCIAL]: 979,
};

export function estimatorPriceFor(buildingType?: BuildingType | string | null): number {
  if (buildingType && buildingType in ESTIMATOR_PRICE_NGN) {
    return ESTIMATOR_PRICE_NGN[buildingType as BuildingType];
  }
  return TOOL_REPORT_PRICE_NGN;
}

export const ESTIMATOR_MIN_PRICE_NGN = Math.min(...Object.values(ESTIMATOR_PRICE_NGN));

export type PaidToolId = 'construction-estimator' | 'rent-calculator';

export const TOOL_LABELS: Record<PaidToolId, string> = {
  'construction-estimator': 'Construction Cost Estimator',
  'rent-calculator': 'Legacy rent tool',
};

const storageKey = (toolId: PaidToolId) => `dh-paid-${toolId}`;

export function isToolUnlocked(toolId: PaidToolId): boolean {
  try {
    return sessionStorage.getItem(storageKey(toolId)) === '1';
  } catch {
    return false;
  }
}

export function unlockTool(toolId: PaidToolId): void {
  try {
    sessionStorage.setItem(storageKey(toolId), '1');
  } catch {
    /* ignore */
  }
}
