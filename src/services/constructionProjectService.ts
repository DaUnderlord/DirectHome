import type { ConstructionEstimate, ConstructionSpecs } from '../types/construction';
import { supabase } from '../lib/supabase';

export type ConstructionProjectStatus = 'awaiting_payment' | 'paid';

export interface ConstructionProjectSummary {
  id: string;
  title: string;
  status: ConstructionProjectStatus;
  created_at: string;
  paid_at?: string | null;
  specs: Partial<ConstructionSpecs> & {
    location?: { city?: string | null; state?: string | null };
  };
  estimate?: ConstructionEstimate;
  accessToken?: string;
}

const ACCESS_KEY = 'dh-construction-access-tokens';

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

function buildTitle(specs: ConstructionSpecs): string {
  const beds = specs.numberOfBedrooms;
  const type = specs.buildingType.replace(/_/g, ' ');
  const city = specs.location.city || specs.location.state;
  return `${beds}-bed ${type} · ${specs.totalSquareMeters} sqm · ${city}`.slice(0, 200);
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createConstructionProject(params: {
  specs: ConstructionSpecs;
  title?: string;
}): Promise<{
  ok: boolean;
  project?: { id: string; status: ConstructionProjectStatus; accessToken?: string };
  error?: string;
}> {
  const response = await fetch('/api/construction-projects/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
    },
    body: JSON.stringify({
      title: params.title || buildTitle(params.specs),
      specs: params.specs,
    }),
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    project?: { id: string; status: ConstructionProjectStatus; accessToken?: string };
    error?: string;
  } | null;
  if (!response.ok || !payload?.ok || !payload.project?.id) {
    return { ok: false, error: payload?.error || 'Could not save project.' };
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

  const response = await fetch(`/api/construction-projects/get?${search}`, { headers });
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
