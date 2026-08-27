-- Nexora persistent data model
-- Run this SQL in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  email text,
  first_name text not null,
  last_name text not null,
  username text unique not null,
  role text,
  company text,
  birth_date date,
  otp_channel text check (otp_channel in ('sms','whatsapp')) default 'sms',
  verified_phone boolean not null default false,
  profile_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id)
);

create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  query text not null,
  source text not null check (source in ('find','auto-match')),
  created_at timestamptz not null default now()
);

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  external_id text,
  name text not null,
  handle text,
  source text,
  need text,
  display_need text,
  location text,
  profile_url text,
  phone text,
  match_score integer check (match_score between 0 and 100),
  match_reason text,
  search_id uuid references public.searches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(profile_id, external_id)
);

create index if not exists idx_prospects_profile_created on public.prospects(profile_id, created_at desc);
create index if not exists idx_searches_profile_created on public.searches(profile_id, created_at desc);

create table if not exists public.prepared_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete set null,
  message text not null,
  status text not null default 'prepared' check (status in ('prepared','copied')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_profile_created on public.prepared_messages(profile_id, created_at desc);
create index if not exists idx_notifications_profile_created on public.notifications(profile_id, created_at desc);

-- Keep updated_at current without requiring client-side clock logic.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists quiz_profiles_updated_at on public.quiz_profiles;
create trigger quiz_profiles_updated_at before update on public.quiz_profiles
for each row execute function public.set_updated_at();

-- RLS is enabled now; server-side routes will use the service role key.
alter table public.profiles enable row level security;
alter table public.quiz_profiles enable row level security;
alter table public.searches enable row level security;
alter table public.prospects enable row level security;
alter table public.prepared_messages enable row level security;
alter table public.notifications enable row level security;
