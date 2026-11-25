-- ATLABTS — Supabase database schema
create extension if not exists pgcrypto;

create type business_stage as enum ('startup','growing_sme','established','institution','individual');
create type budget_range   as enum ('under_35k','35k_65k','65k_1l','1l_1_5l','above_1_5l','project_based','not_sure');
create type lead_source    as enum ('contact_form','get_started','cocktail_serve','cocktail_negotiate','package_negotiate','ask_atla','practice_enquiry','website_quote','academy');
create type lead_status    as enum ('new','contacted','qualified','proposal_sent','negotiating','won','lost','spam');
create type staff_role     as enum ('admin','sales','viewer');

-- 1. CATALOGUE
create table practices (id text primary key, title text not null, color text not null, icon text not null, tagline text, intro text, ideal_for text[] default '{}', kpis text[] default '{}', sort_order int default 0, is_active boolean default true, updated_at timestamptz default now());
create table practice_sections (id uuid primary key default gen_random_uuid(), practice_id text not null references practices(id) on delete cascade, title text not null, sort_order int default 0);
create table services (id uuid primary key default gen_random_uuid(), practice_id text not null references practices(id) on delete cascade, section_id uuid not null references practice_sections(id) on delete cascade, name text not null, impact text not null, sort_order int default 0, is_active boolean default true, updated_at timestamptz default now());
create index on services (practice_id);
create table cocktail_items (id text primary key, name text not null, monthly_price int not null check (monthly_price >= 0), color text not null, practice_id text references practices(id), sort_order int default 0, is_active boolean default true, updated_at timestamptz default now());
create table packages (id text primary key, name text not null, tier_label text not null, monthly_price int not null check (monthly_price >= 0), motto text, vision text, color text not null, icon text not null, is_topmost boolean default false, sort_order int default 0, is_active boolean default true, updated_at timestamptz default now());
create table package_items (package_id text references packages(id) on delete cascade, cocktail_item_id text references cocktail_items(id) on delete cascade, primary key (package_id, cocktail_item_id));
create table package_benefits (id uuid primary key default gen_random_uuid(), package_id text not null references packages(id) on delete cascade, title text not null, description text not null, sort_order int default 0);

-- 2. CRM
create table companies (id uuid primary key default gen_random_uuid(), name text not null, industry text, business_stage business_stage, team_size text, annual_revenue_range text, years_in_business text, locations_count int, city text, state text, country text default 'India', website_url text, instagram text, linkedin text, facebook text, youtube text, x_handle text, google_business_url text, marketplace_links text[] default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table contacts (id uuid primary key default gen_random_uuid(), company_id uuid references companies(id) on delete set null, full_name text not null, designation text, phone text not null, whatsapp text, email text, preferred_channel text check (preferred_channel in ('whatsapp','call','email')) default 'whatsapp', whatsapp_opt_in boolean default false, created_at timestamptz default now());
create index on contacts (phone); create index on contacts (email);
create table business_profiles (id uuid primary key default gen_random_uuid(), company_id uuid not null references companies(id) on delete cascade, primary_goals text[] default '{}', biggest_challenges text[] default '{}', target_customers text, target_locations text[] default '{}', competitors text, current_tools text[] default '{}', current_marketing text[] default '{}', monthly_marketing_spend text, has_website boolean, has_crm boolean, has_erp boolean, in_house_team text, decision_timeline text, preferred_start_date date, extra_notes text, created_at timestamptz default now());
create table cocktail_quotes (id uuid primary key default gen_random_uuid(), session_id text not null, total_monthly int not null, suggested_package_id text references packages(id), suggestion_type text check (suggestion_type in ('saving','upgrade')), suggested_amount int, created_at timestamptz default now());
create table cocktail_quote_items (quote_id uuid references cocktail_quotes(id) on delete cascade, cocktail_item_id text references cocktail_items(id), name_snapshot text not null, price_snapshot int not null, primary key (quote_id, cocktail_item_id));
create table leads (id uuid primary key default gen_random_uuid(), company_id uuid references companies(id) on delete set null, contact_id uuid references contacts(id) on delete set null, source lead_source not null, status lead_status not null default 'new', interests text[] default '{}', package_id text references packages(id), is_custom_cocktail boolean default false, cocktail_quote_id uuid references cocktail_quotes(id), budget budget_range, message text, ask_atla_question text, academy_track text, wants_free_audit boolean default false, consent boolean not null default false, page_path text, referrer text, utm_source text, utm_medium text, utm_campaign text, session_id text, assigned_to uuid, next_follow_up timestamptz, estimated_value int, created_at timestamptz default now(), updated_at timestamptz default now());
create index on leads (status); create index on leads (source); create index on leads (created_at desc);

-- 3. ACTIVITY
create table ask_atla_conversations (id uuid primary key default gen_random_uuid(), session_id text not null, page_path text, lead_id uuid references leads(id) on delete set null, started_at timestamptz default now());
create table ask_atla_messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references ask_atla_conversations(id) on delete cascade, role text not null check (role in ('user','assistant')), content text not null check (char_length(content) <= 2000), intent text, matched_practice_id text, matched_services text[] default '{}', clicked_item text, created_at timestamptz default now());
create table site_events (id bigint generated always as identity primary key, session_id text not null, event_name text not null check (char_length(event_name) <= 60), page_path text, properties jsonb default '{}', created_at timestamptz default now());
create index on site_events (event_name, created_at desc);

-- 4. STAFF
create table staff_profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, role staff_role not null default 'sales', created_at timestamptz default now());
alter table leads add constraint leads_assigned_fk foreign key (assigned_to) references staff_profiles(id) on delete set null;
create table lead_activities (id uuid primary key default gen_random_uuid(), lead_id uuid not null references leads(id) on delete cascade, staff_id uuid references staff_profiles(id) on delete set null, type text not null check (type in ('note','call','whatsapp','email','meeting','status_change','proposal')), content text, created_at timestamptz default now());

-- 5. HELPERS & TRIGGERS
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from staff_profiles where id = auth.uid()); $$;
create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from staff_profiles where id = auth.uid() and role = 'admin'); $$;
create or replace function set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger trg_companies_upd before update on companies for each row execute function set_updated_at();
create trigger trg_leads_upd before update on leads for each row execute function set_updated_at();
create trigger trg_services_upd before update on services for each row execute function set_updated_at();
create trigger trg_cocktail_upd before update on cocktail_items for each row execute function set_updated_at();
create trigger trg_packages_upd before update on packages for each row execute function set_updated_at();
create trigger trg_practices_upd before update on practices for each row execute function set_updated_at();
create or replace function log_lead_status() returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    insert into lead_activities(lead_id, staff_id, type, content) values (new.id, auth.uid(), 'status_change', old.status || ' → ' || new.status);
  end if;
  return new;
end $$;
create trigger trg_lead_status after update on leads for each row execute function log_lead_status();

-- 6. PUBLIC RPC FUNCTIONS
create or replace function save_cocktail_quote(p_session_id text, p_item_ids text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_total int; v_quote uuid; v_pkg record; v_type text; v_amount int;
begin
  if p_item_ids is null or array_length(p_item_ids,1) is null then raise exception 'No services selected'; end if;
  select coalesce(sum(monthly_price),0) into v_total from cocktail_items where id = any(p_item_ids) and is_active;
  select p.* into v_pkg from packages p where p.is_active
    and not exists (select 1 from unnest(p_item_ids) s(id) where s.id not in (select cocktail_item_id from package_items where package_id = p.id))
  order by p.monthly_price asc limit 1;
  if v_pkg.id is not null then
    if v_pkg.monthly_price < v_total then v_type := 'saving'; v_amount := v_total - v_pkg.monthly_price;
    elsif v_pkg.monthly_price <= v_total * 1.4 then v_type := 'upgrade'; v_amount := v_pkg.monthly_price - v_total;
    end if;
  end if;
  insert into cocktail_quotes(session_id, total_monthly, suggested_package_id, suggestion_type, suggested_amount)
  values (left(p_session_id,64), v_total, case when v_type is not null then v_pkg.id end, v_type, v_amount) returning id into v_quote;
  insert into cocktail_quote_items(quote_id, cocktail_item_id, name_snapshot, price_snapshot)
  select v_quote, id, name, monthly_price from cocktail_items where id = any(p_item_ids) and is_active;
  return jsonb_build_object('quote_id', v_quote, 'total', v_total, 'suggested_package_id', case when v_type is not null then v_pkg.id end, 'suggestion_type', v_type, 'suggested_amount', v_amount);
end $$;

create or replace function submit_lead(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare c jsonb := coalesce(p->'contact','{}'); co jsonb := coalesce(p->'company','{}'); pr jsonb := p->'profile'; l jsonb := coalesce(p->'lead','{}');
  v_company uuid; v_contact uuid; v_lead uuid;
begin
  if coalesce(trim(c->>'full_name'),'') = '' then raise exception 'Name is required'; end if;
  if coalesce(trim(c->>'phone'),'') !~ '^[0-9+ ()-]{8,20}$' then raise exception 'Valid phone is required'; end if;
  if (l->>'consent')::boolean is not true then raise exception 'Consent is required'; end if;
  if char_length(coalesce(l->>'message','')) > 5000 then raise exception 'Message too long'; end if;
  if coalesce(trim(co->>'name'),'') <> '' then
    insert into companies(name, industry, business_stage, team_size, annual_revenue_range, years_in_business, locations_count, city, state, country, website_url, instagram, linkedin, facebook, youtube, x_handle, google_business_url, marketplace_links)
    values (trim(co->>'name'), co->>'industry', (co->>'business_stage')::business_stage, co->>'team_size', co->>'annual_revenue_range', co->>'years_in_business', nullif(co->>'locations_count','')::int, co->>'city', co->>'state', coalesce(co->>'country','India'), co->>'website_url', co->>'instagram', co->>'linkedin', co->>'facebook', co->>'youtube', co->>'x_handle', co->>'google_business_url', coalesce(array(select jsonb_array_elements_text(co->'marketplace_links')),'{}'))
    returning id into v_company;
  end if;
  insert into contacts(company_id, full_name, designation, phone, whatsapp, email, preferred_channel, whatsapp_opt_in)
  values (v_company, trim(c->>'full_name'), c->>'designation', trim(c->>'phone'), coalesce(c->>'whatsapp', c->>'phone'), nullif(lower(trim(c->>'email')),''), coalesce(c->>'preferred_channel','whatsapp'), coalesce((c->>'whatsapp_opt_in')::boolean,false))
  returning id into v_contact;
  if pr is not null and v_company is not null then
    insert into business_profiles(company_id, primary_goals, biggest_challenges, target_customers, target_locations, competitors, current_tools, current_marketing, monthly_marketing_spend, has_website, has_crm, has_erp, in_house_team, decision_timeline, preferred_start_date, extra_notes)
    values (v_company, coalesce(array(select jsonb_array_elements_text(pr->'primary_goals')),'{}'), coalesce(array(select jsonb_array_elements_text(pr->'biggest_challenges')),'{}'), pr->>'target_customers', coalesce(array(select jsonb_array_elements_text(pr->'target_locations')),'{}'), pr->>'competitors', coalesce(array(select jsonb_array_elements_text(pr->'current_tools')),'{}'), coalesce(array(select jsonb_array_elements_text(pr->'current_marketing')),'{}'), pr->>'monthly_marketing_spend', (pr->>'has_website')::boolean, (pr->>'has_crm')::boolean, (pr->>'has_erp')::boolean, pr->>'in_house_team', pr->>'decision_timeline', nullif(pr->>'preferred_start_date','')::date, pr->>'extra_notes');
  end if;
  insert into leads(company_id, contact_id, source, interests, package_id, is_custom_cocktail, cocktail_quote_id, budget, message, ask_atla_question, academy_track, wants_free_audit, consent, page_path, referrer, utm_source, utm_medium, utm_campaign, session_id)
  values (v_company, v_contact, (l->>'source')::lead_source, coalesce(array(select jsonb_array_elements_text(l->'interests')),'{}'), nullif(l->>'package_id',''), coalesce((l->>'is_custom_cocktail')::boolean,false), nullif(l->>'cocktail_quote_id','')::uuid, nullif(l->>'budget','')::budget_range, l->>'message', l->>'ask_atla_question', l->>'academy_track', coalesce((l->>'wants_free_audit')::boolean,false), true, l->>'page_path', l->>'referrer', l->>'utm_source', l->>'utm_medium', l->>'utm_campaign', l->>'session_id')
  returning id into v_lead;
  if nullif(l->>'ask_atla_conversation_id','') is not null then
    update ask_atla_conversations set lead_id = v_lead where id = (l->>'ask_atla_conversation_id')::uuid;
  end if;
  return v_lead;
end $$;

create or replace function log_ask_atla(p_conversation_id uuid, p_session_id text, p_page text, p_role text, p_content text, p_intent text default null, p_practice text default null, p_services text[] default '{}', p_clicked text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_conv uuid := p_conversation_id;
begin
  if v_conv is null then insert into ask_atla_conversations(session_id, page_path) values (left(p_session_id,64), p_page) returning id into v_conv; end if;
  insert into ask_atla_messages(conversation_id, role, content, intent, matched_practice_id, matched_services, clicked_item) values (v_conv, p_role, left(p_content,2000), p_intent, p_practice, p_services, p_clicked);
  return v_conv;
end $$;

grant execute on function save_cocktail_quote(text, text[]) to anon, authenticated;
grant execute on function submit_lead(jsonb) to anon, authenticated;
grant execute on function log_ask_atla(uuid,text,text,text,text,text,text,text[],text) to anon, authenticated;

-- 7. ROW LEVEL SECURITY
alter table practices enable row level security; alter table practice_sections enable row level security; alter table services enable row level security;
alter table cocktail_items enable row level security; alter table packages enable row level security; alter table package_items enable row level security; alter table package_benefits enable row level security;
alter table companies enable row level security; alter table contacts enable row level security; alter table business_profiles enable row level security; alter table leads enable row level security;
alter table cocktail_quotes enable row level security; alter table cocktail_quote_items enable row level security; alter table ask_atla_conversations enable row level security;
alter table ask_atla_messages enable row level security; alter table site_events enable row level security; alter table staff_profiles enable row level security; alter table lead_activities enable row level security;
create policy "public read practices" on practices for select using (is_active or is_staff());
create policy "public read sections" on practice_sections for select using (true);
create policy "public read services" on services for select using (is_active or is_staff());
create policy "public read cocktail" on cocktail_items for select using (is_active or is_staff());
create policy "public read packages" on packages for select using (is_active or is_staff());
create policy "public read pkg items" on package_items for select using (true);
create policy "public read pkg benefit" on package_benefits for select using (true);
create policy "admin write practices" on practices for all using (is_admin()) with check (is_admin());
create policy "admin write sections" on practice_sections for all using (is_admin()) with check (is_admin());
create policy "admin write services" on services for all using (is_admin()) with check (is_admin());
create policy "admin write cocktail" on cocktail_items for all using (is_admin()) with check (is_admin());
create policy "admin write packages" on packages for all using (is_admin()) with check (is_admin());
create policy "admin write pkg items" on package_items for all using (is_admin()) with check (is_admin());
create policy "admin write pkg benefit" on package_benefits for all using (is_admin()) with check (is_admin());
create policy "staff all companies" on companies for all using (is_staff()) with check (is_staff());
create policy "staff all contacts" on contacts for all using (is_staff()) with check (is_staff());
create policy "staff all profiles" on business_profiles for all using (is_staff()) with check (is_staff());
create policy "staff all leads" on leads for all using (is_staff()) with check (is_staff());
create policy "staff read quotes" on cocktail_quotes for select using (is_staff());
create policy "staff read quote item" on cocktail_quote_items for select using (is_staff());
create policy "staff read ask conv" on ask_atla_conversations for select using (is_staff());
create policy "staff read ask msg" on ask_atla_messages for select using (is_staff());
create policy "staff read events" on site_events for select using (is_staff());
create policy "staff all activities" on lead_activities for all using (is_staff()) with check (is_staff());
grant select on practices, practice_sections, services, cocktail_items, packages, package_items, package_benefits to anon, authenticated;
grant insert on site_events to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
create policy "anon insert events" on site_events for insert to anon, authenticated with check (char_length(session_id) <= 64);
create policy "staff read staff" on staff_profiles for select using (is_staff());
create policy "admin write staff" on staff_profiles for all using (is_admin()) with check (is_admin());

-- 8. ADMIN VIEWS
create or replace view v_lead_inbox with (security_invoker = true) as
select l.id, l.created_at, l.source, l.status, l.budget, l.package_id, l.is_custom_cocktail, q.total_monthly as cocktail_total, l.interests, l.message, l.ask_atla_question,
       ct.full_name, ct.phone, ct.email, ct.designation, co.name as company, co.industry, co.business_stage, co.city, sp.full_name as assigned_to_name, l.next_follow_up
from leads l left join contacts ct on ct.id = l.contact_id left join companies co on co.id = l.company_id
left join cocktail_quotes q on q.id = l.cocktail_quote_id left join staff_profiles sp on sp.id = l.assigned_to;
create or replace view v_top_ask_atla_topics with (security_invoker = true) as
select matched_practice_id, count(*) as questions, max(created_at) as last_asked from ask_atla_messages where role = 'user' group by matched_practice_id order by questions desc;
create or replace view v_popular_cocktail_items with (security_invoker = true) as
select qi.cocktail_item_id, qi.name_snapshot, count(*) as times_selected from cocktail_quote_items qi group by 1,2 order by times_selected desc;

-- 9. Catalogue data is loaded by atlabts-seed-data.sql
-- Admin login: Authentication → Users → Add user, then:
--   insert into staff_profiles(id, full_name, role) select id, 'Arun Raaj', 'admin' from auth.users where email = 'YOUR_EMAIL';
