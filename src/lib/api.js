import { supabase } from './supabase.js';
import { getSessionId, getTracking } from './session.js';

export async function getCatalogue() {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const [
      practicesRes,
      sectionsRes,
      servicesRes,
      cocktailRes,
      packagesRes,
      pkgItemsRes,
      pkgBenefitsRes,
    ] = await Promise.all([
      supabase
        .from('practices')
        .select('id, title, color, icon, tagline, intro, ideal_for, kpis, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('practice_sections')
        .select('id, practice_id, title, sort_order')
        .order('sort_order', { ascending: true }),
      supabase
        .from('services')
        .select('id, practice_id, section_id, name, impact, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cocktail_items')
        .select('id, name, color, practice_id, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('packages')
        .select('id, name, tier_label, motto, vision, color, icon, is_topmost, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase.from('package_items').select('package_id, cocktail_item_id'),
      supabase
        .from('package_benefits')
        .select('id, package_id, title, description, sort_order')
        .order('sort_order', { ascending: true }),
    ]);

    const firstError =
      practicesRes.error ||
      sectionsRes.error ||
      servicesRes.error ||
      cocktailRes.error ||
      packagesRes.error ||
      pkgItemsRes.error ||
      pkgBenefitsRes.error;

    if (firstError) {
      return { data: null, error: firstError };
    }

    if (
      !practicesRes.data?.length ||
      !servicesRes.data?.length ||
      !cocktailRes.data?.length ||
      !packagesRes.data?.length
    ) {
      return { data: null, error: new Error('Supabase catalogue tables are empty') };
    }

    const sectionsByPractice = new Map();
    (sectionsRes.data || []).forEach((sec) => {
      if (!sectionsByPractice.has(sec.practice_id)) {
        sectionsByPractice.set(sec.practice_id, []);
      }
      sectionsByPractice.get(sec.practice_id).push(sec);
    });

    const servicesBySection = new Map();
    (servicesRes.data || []).forEach((svc) => {
      if (!servicesBySection.has(svc.section_id)) {
        servicesBySection.set(svc.section_id, []);
      }
      servicesBySection.get(svc.section_id).push(svc);
    });

    const practices = practicesRes.data.map((p) => {
      const secs = (sectionsByPractice.get(p.id) || [])
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((sec) => {
          const svcs = (servicesBySection.get(sec.id) || [])
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((s) => [s.name, s.impact]);
          return [sec.title, svcs];
        })
        .filter((sec) => sec[1].length > 0);

      return {
        id: p.id,
        title: p.title,
        c: p.color,
        icon: p.icon || p.id,
        tag: p.tagline || '',
        intro: p.intro || '',
        who: p.ideal_for || [],
        kpis: p.kpis || [],
        segs: secs,
      };
    });

    const menu = cocktailRes.data.map((m) => ({
      id: m.id,
      n: m.name,
      c: m.color,
      practice_id: m.practice_id,
      sort_order: m.sort_order,
    }));

    const itemsByPkg = new Map();
    (pkgItemsRes.data || []).forEach((pi) => {
      if (!itemsByPkg.has(pi.package_id)) itemsByPkg.set(pi.package_id, []);
      itemsByPkg.get(pi.package_id).push(pi.cocktail_item_id);
    });

    const benefitsByPkg = new Map();
    (pkgBenefitsRes.data || []).forEach((b) => {
      if (!benefitsByPkg.has(b.package_id)) benefitsByPkg.set(b.package_id, []);
      benefitsByPkg.get(b.package_id).push(b);
    });

    const packages = packagesRes.data.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier_label,
      motto: pkg.motto || '',
      vision: pkg.vision || '',
      color: pkg.color,
      icon: pkg.icon,
      is_topmost: Boolean(pkg.is_topmost),
      inc: itemsByPkg.get(pkg.id) || [],
      lines: (benefitsByPkg.get(pkg.id) || [])
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((b) => [b.title, b.description]),
    }));

    return {
      data: { practices, menu, packages, source: 'supabase' },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function saveCocktailQuote(itemIds) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase.rpc('save_cocktail_quote', {
      p_session_id: getSessionId(),
      p_item_ids: itemIds,
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

function cleanString(v) {
  return typeof v === 'string' ? v.trim() : v;
}

export async function submitLead(payload) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  const tracking = getTracking();
  const c = payload.contact || {};
  const co = payload.company || {};
  const pr = payload.profile || null;
  const l = payload.lead || {};

  const sanitized = {
    contact: {
      ...c,
      full_name: cleanString(c.full_name || ''),
      designation: cleanString(c.designation || '') || null,
      phone: cleanString(c.phone || '') || '--------',
      whatsapp: cleanString(c.whatsapp || '') || null,
      email: c.email ? cleanString(c.email).toLowerCase() : null,
      preferred_channel: c.preferred_channel || 'email',
      whatsapp_opt_in: Boolean(c.whatsapp_opt_in),
    },
    company: co.name
      ? {
          ...co,
          name: cleanString(co.name),
          city: cleanString(co.city || '') || null,
          website_url: cleanString(co.website_url || '') || null,
          instagram: cleanString(co.instagram || '') || null,
          linkedin: cleanString(co.linkedin || '') || null,
          facebook: cleanString(co.facebook || '') || null,
          youtube: cleanString(co.youtube || '') || null,
          x_handle: cleanString(co.x_handle || '') || null,
          google_business_url: cleanString(co.google_business_url || '') || null,
          marketplace_links: (co.marketplace_links || [])
            .map((x) => cleanString(x))
            .filter(Boolean),
        }
      : {},
    profile: pr,
    lead: {
      ...l,
      message: cleanString(l.message || '') || null,
      ask_atla_question: cleanString(l.ask_atla_question || '') || null,
      academy_track: cleanString(l.academy_track || '') || null,
      consent: Boolean(l.consent),
      page_path: l.page_path || tracking.page_path,
      referrer: l.referrer ?? tracking.referrer,
      utm_source: l.utm_source ?? tracking.utm_source,
      utm_medium: l.utm_medium ?? tracking.utm_medium,
      utm_campaign: l.utm_campaign ?? tracking.utm_campaign,
      session_id: l.session_id || tracking.session_id,
    },
  };

  try {
    const { data, error } = await supabase.rpc('submit_lead', { p: sanitized });
    if (!error) {
      track('lead_submitted', {
        source: sanitized.lead.source,
        package_id: sanitized.lead.package_id || null,
      });
    }
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function submitJobApplication(payload = {}) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  const sanitized = {
    full_name: cleanString(payload.full_name || ''),
    email: cleanString(payload.email || '').toLowerCase(),
    phone: cleanString(payload.phone || '') || null,
    city: cleanString(payload.city || '') || null,
    role: cleanString(payload.role || ''),
    portfolio_url: cleanString(payload.portfolio_url || '') || null,
    note: cleanString(payload.note || '') || null,
    answers:
      payload.answers && typeof payload.answers === 'object' && !Array.isArray(payload.answers)
        ? payload.answers
        : {},
    consent: Boolean(payload.consent),
  };

  try {
    const { data, error } = await supabase.rpc('submit_job_application', { p: sanitized });
    if (!error) {
      track('job_application_submitted', { role: sanitized.role });
    }
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function logAsk({
  conversationId = null,
  page,
  role,
  content,
  intent = null,
  practice = null,
  services = [],
  clicked = null,
}) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  const tracking = getTracking();
  try {
    const { data, error } = await supabase.rpc('log_ask_atla', {
      p_conversation_id: conversationId || null,
      p_session_id: tracking.session_id,
      p_page: page || tracking.page_path,
      p_role: role,
      p_content: (content || '').slice(0, 2000),
      p_intent: intent || null,
      p_practice: practice || null,
      p_services: services || [],
      p_clicked: clicked || null,
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export function track(eventName, properties = {}) {
  if (!supabase) return;
  try {
    const tracking = getTracking();
    supabase
      .from('site_events')
      .insert([
        {
          session_id: tracking.session_id,
          event_name: String(eventName).slice(0, 60),
          page_path: tracking.page_path,
          properties,
        },
      ])
      .then(() => {})
      .catch(() => {});
  } catch {
    // fire-and-forget: never block UI or surface errors
  }
}

