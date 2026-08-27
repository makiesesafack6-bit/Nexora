-- Nexora: secure per-user database access for the browser client.
-- Run this once in Supabase SQL Editor after enabling Anonymous Sign-Ins.

revoke all on table public.profiles, public.quiz_profiles, public.searches,
  public.prospects, public.prepared_messages, public.notifications
from anon;

grant select, insert, update, delete on table public.profiles,
  public.quiz_profiles, public.searches, public.prospects,
  public.prepared_messages, public.notifications to authenticated;

-- profiles: the row id is the Supabase Auth user id.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles for delete to authenticated
using ((select auth.uid()) = id);

-- All child records are owned by the authenticated profile.
drop policy if exists "quiz_profiles_own" on public.quiz_profiles;
create policy "quiz_profiles_own"
on public.quiz_profiles for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

drop policy if exists "searches_own" on public.searches;
create policy "searches_own"
on public.searches for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

drop policy if exists "prospects_own" on public.prospects;
create policy "prospects_own"
on public.prospects for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

drop policy if exists "prepared_messages_own" on public.prepared_messages;
create policy "prepared_messages_own"
on public.prepared_messages for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own"
on public.notifications for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);
