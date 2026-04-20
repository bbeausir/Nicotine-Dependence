alter table public.profiles
  add column display_name text check (
    display_name is null or (char_length(btrim(display_name)) between 1 and 60)
  ),
  add column age_band text check (
    age_band is null or age_band in ('under_18', '18_24', '25_34', '35_44', '45_plus')
  ),
  add column gender text check (
    gender is null or gender in ('female', 'male', 'prefer_not_to_say')
  ),
  add column attribution text check (
    attribution is null or attribution in ('x', 'therapist', 'google', 'facebook', 'instagram', 'tiktok')
  );

comment on column public.profiles.display_name is
  'User-chosen display name collected in Almost There onboarding step.';
comment on column public.profiles.age_band is
  'Optional self-reported age band (research data).';
comment on column public.profiles.gender is
  'Optional self-reported gender (research data).';
comment on column public.profiles.attribution is
  'Optional self-reported acquisition source (research data).';
