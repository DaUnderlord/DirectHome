-- Per-project construction estimates (pay per build project)
-- Estimate JSON is stored server-side and must never be returned until status = paid.

create table if not exists public.construction_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  access_token uuid not null default gen_random_uuid(),
  title text not null,
  specs jsonb not null,
  estimate jsonb not null default '{}'::jsonb,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment', 'paid')),
  paid_at timestamptz,
  tx_ref text,
  flutterwave_transaction_id text
);

alter table public.construction_projects
  add column if not exists access_token uuid;

update public.construction_projects
  set access_token = gen_random_uuid()
  where access_token is null;

alter table public.construction_projects
  alter column access_token set default gen_random_uuid();

create unique index if not exists construction_projects_access_token_idx
  on public.construction_projects (access_token);

create index if not exists construction_projects_user_id_idx
  on public.construction_projects (user_id, created_at desc);

create index if not exists construction_projects_guest_email_idx
  on public.construction_projects (lower(guest_email))
  where guest_email is not null;

create index if not exists construction_projects_status_idx
  on public.construction_projects (status, created_at desc);

alter table public.construction_projects enable row level security;

drop policy if exists "Users read own construction projects" on public.construction_projects;
create policy "Users read own construction projects"
  on public.construction_projects
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users insert own construction projects" on public.construction_projects;
create policy "Users insert own construction projects"
  on public.construction_projects
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users update own awaiting projects" on public.construction_projects;
create policy "Users update own awaiting projects"
  on public.construction_projects
  for update
  to authenticated
  using (user_id = auth.uid() and status = 'awaiting_payment')
  with check (user_id = auth.uid());

alter table public.tool_payments
  add column if not exists project_id uuid references public.construction_projects(id) on delete set null;

create index if not exists tool_payments_project_id_idx
  on public.tool_payments (project_id)
  where project_id is not null;
