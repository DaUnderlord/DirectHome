import type { ConstructionEstimate, ConstructionSpecs } from '../types/construction';

const DRAFT_KEY = 'dh-construction-draft-v1';
const RESULT_KEY = 'dh-construction-result-v1';
const HISTORY_KEY = 'dh-construction-history-v1';

export interface SavedEstimateResult {
  specs: ConstructionSpecs;
  estimate: ConstructionEstimate;
  savedAt: string;
}

export interface SavedDraft {
  specs: ConstructionSpecs;
  step: number;
}

export function loadDraft(): SavedDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SavedDraft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(specs: ConstructionSpecs, step: number): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ specs, step }));
  } catch {
    /* ignore */
  }
}

export function loadResult(): SavedEstimateResult | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as SavedEstimateResult) : null;
  } catch {
    return null;
  }
}

export function saveResult(specs: ConstructionSpecs, estimate: ConstructionEstimate): void {
  const payload: SavedEstimateResult = {
    specs,
    estimate,
    savedAt: new Date().toISOString(),
  };
  try {
    const previous = loadResult();
    if (previous) {
      const history = loadHistory();
      const next = [previous, ...history.filter((item) => item.savedAt !== previous.savedAt)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    }
    localStorage.setItem(RESULT_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadHistory(): SavedEstimateResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SavedEstimateResult[]) : [];
  } catch {
    return [];
  }
}

export function archiveAndClear(): void {
  try {
    const current = loadResult();
    if (current) {
      const history = loadHistory();
      const next = [current, ...history.filter((item) => item.savedAt !== current.savedAt)].slice(
        0,
        5
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    }
    sessionStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(RESULT_KEY);
  } catch {
    /* ignore */
  }
}
