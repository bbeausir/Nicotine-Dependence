-- Add 'word_of_mouth' to the allowed attribution values.
-- The original migration created an unnamed column-level check constraint;
-- we locate it dynamically rather than hardcoding an auto-generated name.
do $$
declare
  con_name text;
begin
  select c.conname
    into con_name
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
   where n.nspname = 'public'
     and t.relname = 'profiles'
     and c.contype = 'c'
     and pg_get_constraintdef(c.oid) ilike '%attribution%in%';
  if con_name is not null then
    execute format('alter table public.profiles drop constraint %I', con_name);
  end if;
end $$;

alter table public.profiles
  add constraint profiles_attribution_check
  check (
    attribution is null
    or attribution in (
      'x',
      'therapist',
      'google',
      'facebook',
      'instagram',
      'tiktok',
      'word_of_mouth'
    )
  );
