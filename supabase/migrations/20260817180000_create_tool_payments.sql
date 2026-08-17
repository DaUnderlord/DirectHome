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

create index if not exists tool_payments_email_idx
  on public.tool_payments (customer_email);

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
