-- 1. Complimentary estimator access per account (set by admins via SQL / service role only).
-- 2. Let users switch between homeowner and homeseeker from the dashboard, through one
--    narrow security-definer function instead of opening `role` to direct updates.

alter table public.profiles
  add column if not exists estimator_full_access boolean not null default false;

-- Lock privileged columns when a user JWT is present. Role changes are only allowed
-- homeowner <-> homeseeker, and only inside public.switch_profile_role().
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    if tg_op = 'UPDATE' then
      if not (
        coalesce(current_setting('directhome.allow_role_switch', true), '') = 'on'
        and old.role in ('homeowner'::public.user_role, 'homeseeker'::public.user_role)
        and new.role in ('homeowner'::public.user_role, 'homeseeker'::public.user_role)
      ) then
        new.role := old.role;
      end if;
      new.account_status := old.account_status;
      new.estimator_full_access := old.estimator_full_access;
    elsif tg_op = 'INSERT' then
      if new.role = 'admin'::public.user_role then
        new.role := 'homeseeker'::public.user_role;
      end if;
      new.estimator_full_access := false;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.switch_profile_role(target_role text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  current_role_value public.user_role;
begin
  if uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;
  if target_role not in ('homeowner', 'homeseeker') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;

  select role into current_role_value from public.profiles where id = uid;
  if current_role_value is null then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;
  if current_role_value = 'admin'::public.user_role then
    raise exception 'Admin accounts cannot switch role' using errcode = '42501';
  end if;

  perform set_config('directhome.allow_role_switch', 'on', true);
  update public.profiles
    set role = target_role::public.user_role,
        updated_at = now()
    where id = uid;
  perform set_config('directhome.allow_role_switch', 'off', true);

  return target_role;
end;
$$;

revoke all on function public.switch_profile_role(text) from public;
revoke all on function public.switch_profile_role(text) from anon;
grant execute on function public.switch_profile_role(text) to authenticated;
