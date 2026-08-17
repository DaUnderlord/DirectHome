export const TOOL_REPORT_PRICE_NGN = 399;

export type PaidToolId = 'construction-estimator' | 'rent-calculator';

export const TOOL_LABELS: Record<PaidToolId, string> = {
  'construction-estimator': 'Construction Cost Estimator',
  'rent-calculator': 'Rent Calculator',
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
