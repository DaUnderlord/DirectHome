-- Signup trigger on auth.users runs as supabase_auth_admin.
-- Revoking EXECUTE from public/anon/authenticated also blocked that role,
-- so every sign-up rolled back with "Database error saving new user".
grant execute on function public.handle_new_user() to supabase_auth_admin;
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;
