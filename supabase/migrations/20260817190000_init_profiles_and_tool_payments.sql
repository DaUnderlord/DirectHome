-- DirectHome launch schema: auth profiles + tool payments

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('homeowner', 'homeseeker', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.account_status as enum ('active', 'suspended', 'deactivated', 'deleted');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  role public.user_role not null default 'homeseeker',
  account_status public.account_status not null default 'active',
  verification_status public.verification_status not null default 'unverified',
  email_verified boolean default false,
  phone_verified boolean default false,
  avatar_url text,
  bio text,
  notification_preferences jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    case new.raw_user_meta_data->>'role'
      when 'homeowner' then 'homeowner'::public.user_role
      else 'homeseeker'::public.user_role
    end,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.tool_payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text,
  customer_email text not null,
  customer_phone text,
  amount numeric not null,
  currency text not null default 'NGN',
  tool_id text not null,
  status text not null default 'completed',
  tx_ref text not null,
  flutterwave_transaction_id text not null,
  payment_type text,
  user_id uuid references public.profiles(id) on delete set null
);

create unique index if not exists tool_payments_tx_ref_uidx
  on public.tool_payments (tx_ref);
create unique index if not exists tool_payments_flw_id_uidx
  on public.tool_payments (flutterwave_transaction_id);
create index if not exists tool_payments_created_at_idx
  on public.tool_payments (created_at desc);

alter table public.tool_payments enable row level security;

drop policy if exists "Admins can read tool payments" on public.tool_payments;
create policy "Admins can read tool payments"
  on public.tool_payments
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role::text = 'admin'
    )
  );
