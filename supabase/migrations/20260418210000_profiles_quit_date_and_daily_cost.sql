alter table public.profiles
  add column quit_date date,
  add column daily_cost numeric(6, 2) check (daily_cost is null or daily_cost >= 0);

comment on column public.profiles.quit_date is
  'User-set quit date (null = pre-quit; future date = countdown; past date = days-free).';
comment on column public.profiles.daily_cost is
  'Self-reported daily nicotine spend in user currency, used to derive money-saved.';
