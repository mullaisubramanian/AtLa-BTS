-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/ixzyumbtgkqcsgtdhomj/sql/new)
-- to create the leads table and allow public form submissions via RLS.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text default '',
  phone text not null,
  email text default '',
  stage text default '',
  budget text default '',
  interests text[] not null default '{}',
  package text default '',
  message text default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Allow website visitors (anon role using publishable key) to insert leads,
-- without exposing existing leads via SELECT.
drop policy if exists "Allow public lead inserts" on public.leads;
create policy "Allow public lead inserts"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) > 0
    and char_length(trim(phone)) > 0
  );

