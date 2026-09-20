-- First estimator generation can be viewed for free; PDF still requires payment.

alter table public.construction_projects
  add column if not exists preview_granted boolean not null default false;

create index if not exists construction_projects_preview_granted_idx
  on public.construction_projects (user_id)
  where preview_granted = true;
