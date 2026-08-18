-- Home-seeker favorites and search history, scoped to the signed-in user

create table if not exists public.seeker_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

create index if not exists seeker_favorites_user_id_idx on public.seeker_favorites (user_id, created_at desc);

create table if not exists public.seeker_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  query text not null,
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists seeker_searches_user_id_idx on public.seeker_searches (user_id, created_at desc);

alter table public.seeker_favorites enable row level security;
alter table public.seeker_searches enable row level security;

drop policy if exists "Seekers read own favorites" on public.seeker_favorites;
create policy "Seekers read own favorites"
  on public.seeker_favorites for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Seekers insert own favorites" on public.seeker_favorites;
create policy "Seekers insert own favorites"
  on public.seeker_favorites for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Seekers delete own favorites" on public.seeker_favorites;
create policy "Seekers delete own favorites"
  on public.seeker_favorites for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Seekers read own searches" on public.seeker_searches;
create policy "Seekers read own searches"
  on public.seeker_searches for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Seekers insert own searches" on public.seeker_searches;
create policy "Seekers insert own searches"
  on public.seeker_searches for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Seekers delete own searches" on public.seeker_searches;
create policy "Seekers delete own searches"
  on public.seeker_searches for delete
  to authenticated
  using (user_id = auth.uid());

grant select, insert, delete on public.seeker_favorites to authenticated;
grant select, insert, delete on public.seeker_searches to authenticated;
