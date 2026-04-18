create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One app-owned profile row per Supabase auth user.';

create table public.onboarding_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  result jsonb not null check (jsonb_typeof(result) = 'object'),
  scoring_version text not null check (length(scoring_version) > 0),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.onboarding_profiles is 'One onboarding assessment snapshot per user; not an ongoing tracking table.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_onboarding_profiles_updated_at
before update on public.onboarding_profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.onboarding_profiles enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.onboarding_profiles to authenticated;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can view their own onboarding profile"
on public.onboarding_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own onboarding profile"
on public.onboarding_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own onboarding profile"
on public.onboarding_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
