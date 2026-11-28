-- AtLa/BTS — Job Applications v2: city + role-specific answers + Influencer Community
-- Run this SQL in the Supabase SQL Editor before pushing.

begin;

alter table public.job_applications
  add column if not exists city text,
  add column if not exists answers jsonb not null default '{}'::jsonb;

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
  v_city text := nullif(trim(coalesce(p->>'city', '')), '');
  v_role text := trim(coalesce(p->>'role', ''));
  v_portfolio text := nullif(trim(coalesce(p->>'portfolio_url', '')), '');
  v_note text := nullif(trim(coalesce(p->>'note', '')), '');
  v_answers jsonb := coalesce(p->'answers', '{}'::jsonb);
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
  if v_city is not null and char_length(v_city) > 80 then
    raise exception 'City is too long';
  end if;
  if v_role not in ('Influencer Community','Digital Marketing','Content & Design',
     'Web/App Development','AI Automation','Sales & Partnerships',
     'Academy Trainer','Internship','Other') then
    raise exception 'Please select a valid role';
  end if;
  if v_portfolio is not null and (char_length(v_portfolio) > 500
     or v_portfolio !~* '^https?://') then
    raise exception 'Portfolio or profile URL must start with http:// or https://';
  end if;
  if v_note is not null and char_length(v_note) > 500 then
    raise exception 'Note must be 500 characters or fewer';
  end if;
  if jsonb_typeof(v_answers) <> 'object' or length(v_answers::text) > 5000 then
    raise exception 'Invalid answers';
  end if;
  if v_consent is not true then
    raise exception 'Consent is required';
  end if;

  select count(*) into v_recent_count
  from public.job_applications
  where lower(email) = v_email and created_at > now() - interval '1 hour';
  if v_recent_count >= 3 then
    raise exception 'Too many applications submitted recently. Please try again later.';
  end if;

  insert into public.job_applications
    (full_name, email, phone, city, role, portfolio_url, note, answers, consent, status)
  values (v_name, v_email, v_phone, v_city, v_role, v_portfolio, v_note, v_answers, true, 'new')
  returning id into v_app_id;

  return v_app_id;
end;
$$;

grant execute on function public.submit_job_application(jsonb) to anon, authenticated;

commit;

