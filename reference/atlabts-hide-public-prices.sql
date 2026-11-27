-- ATLABTS — Hide price columns and quote amounts from the public anon role
-- Run in Supabase SQL Editor. Keeps full price access for authenticated staff/admin
-- and preserves server-side quote calculation for Admin CRM.

begin;

-- 1. Hide cocktail_items.monthly_price from anon (authenticated staff/admin keep full select)
revoke select on public.cocktail_items from anon;
grant select (id, name, color, practice_id, sort_order, is_active, updated_at)
  on public.cocktail_items to anon;

-- 2. Hide packages.monthly_price from anon (authenticated staff/admin keep full select)
revoke select on public.packages from anon;
grant select (id, name, tier_label, motto, vision, color, icon, is_topmost, sort_order, is_active, updated_at)
  on public.packages to anon;

-- 3. Keep save_cocktail_quote calculating & storing prices server-side for Admin CRM,
--    but stop returning total or suggested_amount to the public browser.
create or replace function public.save_cocktail_quote(p_session_id text, p_item_ids text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_total int;
  v_quote uuid;
  v_pkg record;
  v_type text;
  v_amount int;
begin
  if p_item_ids is null or array_length(p_item_ids, 1) is null then
    raise exception 'No services selected';
  end if;

  select coalesce(sum(monthly_price), 0)
    into v_total
  from cocktail_items
  where id = any(p_item_ids) and is_active;

  select p.*
    into v_pkg
  from packages p
  where p.is_active
    and not exists (
      select 1
      from unnest(p_item_ids) s(id)
      where s.id not in (
        select cocktail_item_id from package_items where package_id = p.id
      )
    )
  order by p.monthly_price asc
  limit 1;

  if v_pkg.id is not null then
    if v_pkg.monthly_price < v_total then
      v_type := 'saving';
      v_amount := v_total - v_pkg.monthly_price;
    elsif v_pkg.monthly_price <= v_total * 1.4 then
      v_type := 'upgrade';
      v_amount := v_pkg.monthly_price - v_total;
    end if;
  end if;

  insert into cocktail_quotes (session_id, total_monthly, suggested_package_id, suggestion_type, suggested_amount)
  values (left(p_session_id, 64), v_total, case when v_type is not null then v_pkg.id end, v_type, v_amount)
  returning id into v_quote;

  insert into cocktail_quote_items (quote_id, cocktail_item_id, name_snapshot, price_snapshot)
  select v_quote, id, name, monthly_price
  from cocktail_items
  where id = any(p_item_ids) and is_active;

  return jsonb_build_object(
    'quote_id', v_quote,
    'suggested_package_id', case when v_pkg.id is not null then v_pkg.id end
  );
end $$;

commit;

