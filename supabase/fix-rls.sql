-- Nexora Supabase permissions/RLS repair
-- Run this once in Supabase SQL Editor.
-- It matches the current Nexora schema and browser auth flow.

-- Ensure the browser-authenticated role can use the tables.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table
  public.profiles,
  public.quiz_profiles,
  public.searches,
  public.prospects,
  public.prepared_messages,
  public.notifications
to authenticated;

-- Remove any incomplete policies from earlier attempts.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

drop policy if exists "quiz_profiles_own" on public.quiz_profiles;
drop policy if exists "searches_own" on public.searches;
drop policy if exists "prospects_own" on public.prospects;
drop policy if exists "prepared_messages_own" on public.prepared_messages;
drop policy if exists "notifications_own" on public.notifications;

-- Profiles are owned by the current Supabase Auth user.
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (id = (select auth.uid()));

-- Quiz data belongs to the same authenticated profile.
create policy "quiz_profiles_own"
on public.quiz_profiles
for all
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

-- Searches belong to the authenticated profile.
create policy "searches_own"
on public.searches
for all
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

-- Prospects belong to the authenticated profile.
create policy "prospects_own"
on public.prospects
for all
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

-- Prepared messages belong to the authenticated profile.
create policy "prepared_messages_own"
on public.prepared_messages
for all
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

-- Notifications belong to the authenticated profile.
create policy "notifications_own"
on public.notifications
for all
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

-- Ensure RLS is actually enabled.
alter table public.profiles enable row level security;
alter table public.quiz_profiles enable row level security;
alter table public.searches enable row level security;
alter table public.prospects enable row level security;
alter table public.prepared_messages enable row level security;
alter table public.notifications enable row level security;
