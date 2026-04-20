-- The original cravings migration set up RLS policies but never granted basic
-- table access to the `authenticated` role, so policy evaluation never ran —
-- signed-in users hit `permission denied for table cravings` before RLS.
-- Delete is included so users can remove mis-logged cravings; row ownership is
-- still enforced by the "users manage own cravings" policy.
grant select, insert, update, delete on public.cravings to authenticated;
