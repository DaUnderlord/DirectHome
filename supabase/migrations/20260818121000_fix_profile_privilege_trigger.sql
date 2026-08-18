create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Lock privileged columns only when a user JWT is present.
  -- SQL editor / service role can still promote admins.
  if auth.uid() is not null then
    if tg_op = 'UPDATE' then
      new.role := old.role;
      new.account_status := old.account_status;
    elsif tg_op = 'INSERT' and new.role = 'admin'::public.user_role then
      new.role := 'homeseeker'::public.user_role;
    end if;
  end if;
  return new;
end;
$$;
