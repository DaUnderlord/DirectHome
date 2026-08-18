-- Listings foundation + auth hardening for DirectHome

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'::public.user_role
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (
    auth.uid() = id
    and role <> 'admin'::public.user_role
  );

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and auth.role() <> 'service_role' then
    new.role := old.role;
    new.account_status := old.account_status;
  end if;
  if tg_op = 'INSERT' and new.role = 'admin'::public.user_role and auth.role() <> 'service_role' then
    new.role := 'homeseeker'::public.user_role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
  before insert or update on public.profiles
  for each row execute function public.protect_profile_privileges();

do $$ begin
  create type public.listing_type as enum ('rent', 'sale');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.property_status as enum (
    'draft', 'pending', 'active', 'inactive', 'rejected', 'rented', 'sold'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.property_verification_status as enum (
    'unverified', 'pending', 'verified', 'rejected'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  property_type text not null default 'apartment',
  listing_type public.listing_type not null default 'rent',
  status public.property_status not null default 'pending',
  verification_status public.property_verification_status not null default 'pending',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  lga text,
  zip_code text,
  country text not null default 'Nigeria',
  latitude double precision,
  longitude double precision,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  toilets integer not null default 0,
  square_footage integer,
  year_built integer,
  furnished boolean not null default false,
  pets_allowed boolean not null default false,
  amenities text[] not null default '{}',
  price numeric not null default 0,
  currency text not null default 'NGN',
  payment_frequency text,
  caution_fee numeric,
  legal_fee numeric,
  service_charge numeric,
  agency_fee numeric,
  security_deposit numeric,
  negotiable boolean not null default true,
  available_from timestamptz,
  minimum_stay integer,
  maximum_stay integer,
  smoking_allowed boolean not null default false,
  parties_allowed boolean not null default false,
  children_allowed boolean not null default true,
  additional_rules text[] not null default '{}',
  featured boolean not null default false,
  view_count integer not null default 0,
  favorite_count integer not null default 0,
  inquiry_count integer not null default 0,
  admin_notes text,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_owner_id_idx on public.properties (owner_id);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_created_at_idx on public.properties (created_at desc);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  is_primary boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists property_images_property_id_idx on public.property_images (property_id);

alter table public.properties enable row level security;
alter table public.property_images enable row level security;

drop policy if exists "Owners can read own properties" on public.properties;
create policy "Owners can read own properties"
  on public.properties for select
  to authenticated
  using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Public can read live listings" on public.properties;
create policy "Public can read live listings"
  on public.properties for select
  to anon, authenticated
  using (status = 'active'::public.property_status);

drop policy if exists "Owners can insert own properties" on public.properties;
create policy "Owners can insert own properties"
  on public.properties for insert
  to authenticated
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Owners can update own properties" on public.properties;
create policy "Owners can update own properties"
  on public.properties for update
  to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Owners can delete own properties" on public.properties;
create policy "Owners can delete own properties"
  on public.properties for delete
  to authenticated
  using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Read images for visible properties" on public.property_images;
create policy "Read images for visible properties"
  on public.property_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (
          p.status = 'active'::public.property_status
          or p.owner_id = auth.uid()
          or public.is_admin()
        )
    )
  );

drop policy if exists "Owners insert property images" on public.property_images;
create policy "Owners insert property images"
  on public.property_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners update property images" on public.property_images;
create policy "Owners update property images"
  on public.property_images for update
  to authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Owners delete property images" on public.property_images;
create policy "Owners delete property images"
  on public.property_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and (p.owner_id = auth.uid() or public.is_admin())
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media',
  'property-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
on conflict (id) do nothing;

drop policy if exists "Public read property media" on storage.objects;
create policy "Public read property media"
  on storage.objects for select
  to public
  using (bucket_id = 'property-media');

drop policy if exists "Users upload own property media" on storage.objects;
create policy "Users upload own property media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own property media" on storage.objects;
create policy "Users update own property media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own property media" on storage.objects;
create policy "Users delete own property media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

grant select, insert, update, delete on public.properties to authenticated;
grant select on public.properties to anon;
grant select, insert, update, delete on public.property_images to authenticated;
grant select on public.property_images to anon;
