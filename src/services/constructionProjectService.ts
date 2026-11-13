import type { ConstructionEstimate, ConstructionSpecs } from '../types/construction';
import { abandonUnreachableAuthSession, isAuthNetworkFailure, supabase } from '../lib/supabase';

export type ConstructionProjectStatus = 'awaiting_payment' | 'paid';

export interface ConstructionProjectSummary {
  id: string;
  title: string;
  status: ConstructionProjectStatus;
  created_at: string;
  paid_at?: string | null;
  preview_granted?: boolean;
  /** Package price in NGN for this project's building type (from the server). */
  price?: number;
  /** Freemium: true while the paywall is off — estimate and PDF are free. */
  free_access?: boolean;
  specs: Partial<ConstructionSpecs> & {
    location?: { city?: string | null; state?: string | null };
  };
  estimate?: ConstructionEstimate;
  accessToken?: string;
}

const ACCESS_KEY = 'dh-construction-access-tokens';
const FREE_PREVIEW_KEY = 'dh-estimator-free-preview-used';
const PREVIEW_CACHE_KEY = 'dh-estimator-preview-cache';
const LEAD_KEY = 'dh-estimator-lead-v1';

export type LeadPersona = 'homeowner' | 'diaspora' | 'developer' | 'contractor' | 'other';

/** Details a visitor leaves before seeing a free estimate (freemium lead capture). */
export interface EstimatorLead {
  fullName: string;
  email: string;
  phone: string;
  persona: LeadPersona | '';
  state: string;
  marketingConsent: boolean;
}

/** The lead submitted earlier on this device, so repeat visitors are not asked again. */
export function loadSavedLead(): EstimatorLead | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EstimatorLead>;
    if (!parsed.email || !parsed.fullName) return null;
    return {
      fullName: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone || '',
      persona: (parsed.persona as LeadPersona) || '',
      state: parsed.state || '',
      marketingConsent: Boolean(parsed.marketingConsent),
    };
  } catch {
    return null;
  }
}

export function saveLeadLocally(lead: EstimatorLead): void {
  try {
    localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  } catch {
    /* ignore */
  }
}

export function clearSavedLead(): void {
  try {
    localStorage.removeItem(LEAD_KEY);
  } catch {
    /* ignore */
  }
}

function readAccessMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function rememberProjectAccess(projectId: string, accessToken: string): void {
  try {
    const next = readAccessMap();
    next[projectId] = accessToken;
    localStorage.setItem(ACCESS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function loadProjectAccess(projectId: string): string {
  return readAccessMap()[projectId] || '';
}

export function hasUsedFreePreview(): boolean {
  try {
    return localStorage.getItem(FREE_PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

export function markFreePreviewUsed(): void {
  try {
    localStorage.setItem(FREE_PREVIEW_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function savePreviewCache(projectId: string, specs: ConstructionSpecs): void {
  try {
    localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify({ projectId, specs }));
  } catch {
    /* ignore */
  }
}

export function loadPreviewCache(projectId: string): ConstructionSpecs | null {
  try {
    const raw = localStorage.getItem(PREVIEW_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { projectId?: string; specs?: ConstructionSpecs };
    if (parsed.projectId !== projectId || !parsed.specs) return null;
    return parsed.specs;
  } catch {
    return null;
  }
}

function buildTitle(specs: ConstructionSpecs): string {
  const type = specs.buildingType.replace(/_/g, ' ');
  const city = specs.location.city || specs.location.state;
  const size =
    specs.buildingType === 'commercial' && specs.commercial
      ? `${specs.commercial.numberOfRooms}-room`
      : `${specs.numberOfBedrooms}-bed`;
  return `${size} ${type} · ${specs.totalSquareMeters} sqm · ${city}`.slice(0, 200);
}

async function authHeader(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && isAuthNetworkFailure(error)) {
      await abandonUnreachableAuthSession(error);
      return {};
    }
    const token = data.session?.access_token || localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    if (isAuthNetworkFailure(error)) {
      await abandonUnreachableAuthSession(error);
    }
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export async function createConstructionProject(params: {
  specs: ConstructionSpecs;
  title?: string;
  claimFreePreview?: boolean;
  lead?: EstimatorLead | null;
}): Promise<{
  ok: boolean;
  project?: {
    id: string;
    status: ConstructionProjectStatus;
    accessToken?: string;
    preview_granted?: boolean;
    free_access?: boolean;
  };
  error?: string;
  /** 'lead_required' when the server needs the visitor's details first. */
  code?: string;
}> {
  const response = await fetch('/api/construction-projects/create', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
    },
    body: JSON.stringify({
      title: params.title || buildTitle(params.specs),
      specs: params.specs,
      claimFreePreview: Boolean(params.claimFreePreview),
      ...(params.lead ? { lead: params.lead } : {}),
    }),
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    project?: {
      id: string;
      status: ConstructionProjectStatus;
      accessToken?: string;
      preview_granted?: boolean;
      free_access?: boolean;
    };
    error?: string;
    code?: string;
  } | null;
  if (!response.ok || !payload?.ok || !payload.project?.id) {
    return { ok: false, error: payload?.error || 'Could not save project.', code: payload?.code };
  }
  if (payload.project.accessToken) {
    rememberProjectAccess(payload.project.id, payload.project.accessToken);
  }
  return { ok: true, project: payload.project };
}

export async function fetchConstructionProject(params: {
  projectId: string;
}): Promise<{ ok: boolean; project?: ConstructionProjectSummary; error?: string }> {
  const search = new URLSearchParams({ id: params.projectId });
  const accessToken = loadProjectAccess(params.projectId);
  const headers: Record<string, string> = { ...(await authHeader()) };
  if (accessToken) headers['X-Project-Access'] = accessToken;

  const response = await fetch(`/api/construction-projects/get?${search}`, {
    credentials: 'same-origin',
    headers,
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    project?: ConstructionProjectSummary;
    error?: string;
  } | null;
  if (!response.ok || !payload?.ok || !payload.project) {
    return { ok: false, error: payload?.error || 'Project not found.' };
  }
  return { ok: true, project: payload.project };
}

export async function listMyConstructionProjects(): Promise<{
  ok: boolean;
  projects?: ConstructionProjectSummary[];
  error?: string;
}> {
  const response = await fetch('/api/construction-projects/list', {
    headers: await authHeader(),
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    projects?: ConstructionProjectSummary[];
    error?: string;
  } | null;
  if (!response.ok || !payload?.ok) {
    return { ok: false, error: payload?.error || 'Could not load projects.' };
  }
  return { ok: true, projects: payload.projects || [] };
}

export async function claimGuestConstructionProjects(
  authToken?: string
): Promise<{ ok: boolean; claimed?: number; error?: string }> {
  const headers = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : await authHeader();
  const response = await fetch('/api/construction-projects/claim', {
    method: 'POST',
    headers,
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    claimed?: number;
    error?: string;
  } | null;
  if (!response.ok || !payload?.ok) {
    return { ok: false, error: payload?.error || 'Could not claim projects.' };
  }
  return { ok: true, claimed: payload.claimed || 0 };
}

export function projectRoute(projectId: string): string {
  return `/construction-estimator/projects/${projectId}`;
}
