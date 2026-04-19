create table public.cravings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  logged_at  timestamptz not null default now(),
  intensity  smallint not null check (intensity between 1 and 10),
  triggers   text[] not null default '{}',
  notes      text
);

alter table public.cravings enable row level security;

create policy "users manage own cravings"
  on public.cravings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index cravings_user_logged_at_idx
  on public.cravings (user_id, logged_at desc);
