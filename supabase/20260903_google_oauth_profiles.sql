-- Allow OAuth-only accounts that do not have a mobile number.
-- Run this once in Supabase SQL Editor.
alter table public.profiles alter column phone drop not null;

-- Phone remains unique when present; multiple NULL values are allowed by PostgreSQL.
