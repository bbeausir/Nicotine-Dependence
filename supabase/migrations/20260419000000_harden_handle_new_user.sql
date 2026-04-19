-- Move handle_new_user() out of the public schema and harden its search_path.
-- The function runs as security definer, so keeping it in an exposed schema
-- with a permissive search_path widens the blast radius of future edits.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
