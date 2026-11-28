-- AtLa/BTS — Job Applications table, RLS policies, and validated RPC
-- Run this SQL in the Supabase SQL Editor after reviewing.

begin;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  role text not null,
  portfolio_url text,
  note text,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed'))
);

create index if not exists idx_job_applications_created_at
  on public.job_applications (created_at desc);

create index if not exists idx_job_applications_email_recent
  on public.job_applications (lower(email), created_at desc);

alter table public.job_applications enable row level security;

revoke all on public.job_applications from anon;
revoke all on public.job_applications from authenticated;
grant select, update (status) on public.job_applications to authenticated;

drop policy if exists "staff read job applications" on public.job_applications;
create policy "staff read job applications"
  on public.job_applications
  for select
  to authenticated
  using (is_staff());

drop policy if exists "staff update job applications" on public.job_applications;
create policy "staff update job applications"
  on public.job_applications
  for update
  to authenticated
  using (is_staff())
  with check (is_staff());

create or replace function public.submit_job_application(p jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(coalesce(p->>'full_name', ''));
  v_email text := lower(trim(coalesce(p->>'email', '')));
  v_phone text := nullif(trim(coalesce(p->>'phone', '')), '');
  v_role text := trim(coalesce(p->>'role', ''));
  v_portfolio text := nullif(trim(coalesce(p->>'portfolio_url', '')), '');
  v_note text := nullif(trim(coalesce(p->>'note', '')), '');
  v_consent boolean := coalesce((p->>'consent')::boolean, false);
  v_recent_count int;
  v_app_id uuid;
begin
  if v_name = '' or char_length(v_name) > 120 then
    raise exception 'Valid full name is required';
  end if;

  if v_email = '' or char_length(v_email) > 200
     or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Valid email address is required';
  end if;

  if v_phone is not null and v_phone !~ '^[0-9+ ()-]{8,20}$' then
    raise exception 'Valid phone number is required';
  end if;

  if v_role not in (
    'Digital Marketing',
    'Content & Design',
    'Web/App Development',
    'AI Automation',
    'Sales & Partnerships',
    'Academy Trainer',
    'Internship',
    'Other'
  ) then
    raise exception 'Please select a valid role';
  end if;

  if v_portfolio is not null and (
    char_length(v_portfolio) > 500
    or v_portfolio !~* '^https?://'
  ) then
    raise exception 'Portfolio or LinkedIn URL must start with http:// or https://';
  end if;

  if v_note is not null and char_length(v_note) > 500 then
    raise exception 'Note must be 500 characters or fewer';
  end if;

  if v_consent is not true then
    raise exception 'Consent is required';
  end if;

  -- Rate limiting per email: max 3 applications per hour
  select count(*)
    into v_recent_count
  from public.job_applications
  where lower(email) = v_email
    and created_at > now() - interval '1 hour';

  if v_recent_count >= 3 then
    raise exception 'Too many applications submitted recently. Please try again later.';
  end if;

  insert into public.job_applications (
    full_name,
    email,
    phone,
    role,
    portfolio_url,
    note,
    consent,
    status
  )
  values (
    v_name,
    v_email,
    v_phone,
    v_role,
    v_portfolio,
    v_note,
    true,
    'new'
  )
  returning id into v_app_id;

  return v_app_id;
end;
$$;

grant execute on function public.submit_job_application(jsonb) to anon, authenticated;

commit;

