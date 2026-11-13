-- Freemium launch: estimator users leave their details before seeing results.
-- One row per email address; repeat estimates update the row.
-- Only the server (service role) reads or writes this table. RLS is on with no
-- policies, so the anon/authenticated API keys cannot see anyone's details.

create table if not exists public.estimator_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  full_name text not null,
  phone text,
  persona text check (persona in ('homeowner', 'diaspora', 'developer', 'contractor', 'other')),
  state text,
  marketing_consent boolean not null default false,
  consent_at timestamptz,
  user_id uuid references public.profiles(id) on delete set null,
  source text not null default 'estimator',
  estimate_count integer not null default 0,
  last_estimate_at timestamptz,
  last_building_type text,
  last_build_city text,
  last_project_id uuid references public.construction_projects(id) on delete set null
);

create unique index if not exists estimator_leads_email_idx
  on public.estimator_leads (lower(email));

create index if not exists estimator_leads_created_idx
  on public.estimator_leads (created_at desc);

alter table public.estimator_leads enable row level security;

alter table public.construction_projects
  add column if not exists lead_id uuid references public.estimator_leads(id) on delete set null;

create index if not exists construction_projects_lead_id_idx
  on public.construction_projects (lead_id)
  where lead_id is not null;
