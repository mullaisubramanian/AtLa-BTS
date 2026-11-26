import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { submitLead, track } from '../lib/api';
import { SITE_CONFIG } from '../config/site';
import {
  BIGGEST_CHALLENGES,
  BUDGET_RANGES,
  BUSINESS_STAGES,
  DECISION_TIMELINES,
  INDIAN_STATES,
  IN_HOUSE_TEAM,
  MARKETING_CHANNELS,
  MARKETING_SPEND,
  PRIMARY_GOALS,
  REVENUE_RANGES,
  TARGET_LOCATIONS,
  TEAM_SIZES,
  TOOLS_USED,
  WIZARD_INDUSTRIES,
  YEARS_IN_BUSINESS,
} from '../data/options';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import { PhoneInput, SelectBox } from '../components/FormFields';
import {
  formatPhoneForSubmit,
  stripDefaultIndiaCode,
  validatePhoneInput,
} from '../lib/phone';
import './GetStarted.css';

const DRAFT_KEY = 'atlabts_get_started_draft_v1';

const INITIAL_DATA = {
  // Step 1: About you
  full_name: '',
  designation: '',
  phone: '',
  email: '',
  preferred_channel: 'email',
  // Step 2: Your business
  company_name: '',
  industry: '',
  business_stage: '',
  team_size: '11-50',
  annual_revenue_range: '1-10 Cr',
  years_in_business: '3-10',
  locations_count: '1',
  city: '',
  state: 'Tamil Nadu',
  // Step 3: Online presence
  has_website: true,
  website_url: '',
  instagram: '',
  linkedin: '',
  facebook: '',
  youtube: '',
  x_handle: '',
  google_business_url: '',
  marketplace_links: [''],
  current_marketing: [],
  monthly_marketing_spend: '< ₹25k',
  // Step 4: Goals & setup
  primary_goals: [],
  biggest_challenges: [],
  target_customers: '',
  target_locations: [],
  competitors: '',
  current_tools: [],
  has_crm: false,
  has_erp: false,
  in_house_team: 'Small team',
  // Step 5: What you need
  interests: [],
  package_id: '',
  budget: '',
  decision_timeline: '',
  preferred_start_date: '',
  extra_notes: '',
  wants_free_audit: true,
  consent: false,
};

const STEP_LABELS = [
  'About you',
  'Your business',
  'Online presence',
  'Goals & setup',
  'What you need',
  'Review',
];

function loadDraft() {
  if (typeof window === 'undefined') return { step: 0, form: INITIAL_DATA };
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return { step: 0, form: INITIAL_DATA };
    const parsed = JSON.parse(raw);
    return {
      step: typeof parsed.step === 'number' ? Math.min(5, Math.max(0, parsed.step)) : 0,
      form: { ...INITIAL_DATA, ...(parsed.form || {}) },
    };
  } catch {
    return { step: 0, form: INITIAL_DATA };
  }
}

export default function GetStarted() {
  const { practices, packages } = useCatalogue();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get('ref');

  const [initial] = useState(loadDraft);
  const [step, setStep] = useState(initial.step);
  const [form, setForm] = useState(() => ({
    ...initial.form,
    phone: stripDefaultIndiaCode(initial.form.phone),
    preferred_channel:
      initial.form.preferred_channel === 'whatsapp'
        ? 'email'
        : initial.form.preferred_channel || 'email',
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [stepError, setStepError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  useEffect(() => {
    if (submittedLeadId) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, form }));
    } catch {
      // ignore storage errors
    }
  }, [step, form, submittedLeadId]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
    setStepError('');
  };

  const toggleMulti = (key, value, max = null) => {
    setForm((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      if (max && current.length >= max) {
        setStepError(`You can choose up to ${max} primary goals.`);
        return prev;
      }
      setStepError('');
      return { ...prev, [key]: [...current, value] };
    });
  };

  const collectStepErrors = (s) => {
    const errors = {};
    if (s === 0) {
      if (!form.full_name.trim()) errors.full_name = 'Full name is required.';
      const phoneErr = validatePhoneInput(form.phone, { required: false });
      if (phoneErr) errors.phone = phoneErr;
      const cleanedEmail = form.email.trim();
      if (cleanedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
        errors.email = 'Enter a valid email address.';
      }
    }
    if (s === 1) {
      if (!form.company_name.trim()) errors.company_name = 'Company name is required.';
      if (!form.industry) errors.industry = 'Please select your industry.';
      if (!form.business_stage) errors.business_stage = 'Please select your business stage.';
    }
    if (s === 4) {
      if (!form.budget) errors.budget = 'Please select your monthly budget.';
      if (!form.decision_timeline) errors.decision_timeline = 'Please select your decision timeline.';
      if (!form.consent) {
        errors.consent = 'Please agree to be contacted by AtLa/BTS about your enquiry.';
      }
    }
    return errors;
  };

  const handleNext = () => {
    const errors = collectStepErrors(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStepError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});
    setStepError('');
    const next = Math.min(5, step + 1);
    setStep(next);
    track('get_started_step', { step: next + 1, label: STEP_LABELS[next] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setFieldErrors({});
    setStepError('');
    setStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const errors = collectStepErrors(4);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStepError(Object.values(errors)[0]);
      setStep(4);
      return;
    }
    setSubmitting(true);
    setFieldErrors({});
    setStepError('');

    const isCocktail = form.package_id === 'custom_cocktail';
    const message = refParam
      ? `Profile completed for enquiry ${refParam}`
      : form.extra_notes.trim() || 'Completed 5-step Get Started growth audit profile.';

    const formattedPhone = form.phone.trim() ? formatPhoneForSubmit(form.phone) : '';

    const { data, error } = await submitLead({
      contact: {
        full_name: form.full_name,
        designation: form.designation,
        phone: formattedPhone,
        whatsapp: '',
        email: form.email,
        preferred_channel: form.preferred_channel,
        whatsapp_opt_in: false,
      },
      company: {
        name: form.company_name,
        industry: form.industry,
        business_stage: form.business_stage,
        team_size: form.team_size,
        annual_revenue_range: form.annual_revenue_range,
        years_in_business: form.years_in_business,
        locations_count: form.locations_count,
        city: form.city,
        state: form.state,
        country: 'India',
        website_url: form.has_website ? form.website_url : null,
        instagram: form.instagram,
        linkedin: form.linkedin,
        facebook: form.facebook,
        youtube: form.youtube,
        x_handle: form.x_handle,
        google_business_url: form.google_business_url,
        marketplace_links: form.marketplace_links.filter((x) => x.trim()),
      },
      profile: {
        primary_goals: form.primary_goals,
        biggest_challenges: form.biggest_challenges,
        target_customers: form.target_customers,
        target_locations: form.target_locations,
        competitors: form.competitors,
        current_tools: form.current_tools,
        current_marketing: form.current_marketing,
        monthly_marketing_spend: form.monthly_marketing_spend,
        has_website: Boolean(form.has_website),
        has_crm: Boolean(form.has_crm),
        has_erp: Boolean(form.has_erp),
        in_house_team: form.in_house_team,
        decision_timeline: form.decision_timeline,
        preferred_start_date: form.preferred_start_date || null,
        extra_notes: form.extra_notes,
      },
      lead: {
        source: 'get_started',
        interests: form.interests,
        package_id: !isCocktail && form.package_id ? form.package_id : null,
        is_custom_cocktail: isCocktail,
        budget: form.budget,
        message,
        wants_free_audit: Boolean(form.wants_free_audit),
        consent: true,
      },
    });
    setSubmitting(false);

    if (error) {
      setStepError(error.message || 'Could not submit your profile. Please retry.');
      return;
    }

    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setSubmittedLeadId(data || `ATLA${Date.now().toString(36).toUpperCase()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submittedLeadId) {
    const refCode = String(submittedLeadId).slice(0, 8).toUpperCase();
    return (
      <section className="page-enter">
        <Helmet>
          <title>Get your free growth audit — AtLa/BTS</title>
          <meta property="og:title" content="Get your free growth audit — AtLa/BTS" />
        </Helmet>
        <div className="section">
          <div className="wrap">
            <div className="wiz-card glass wiz-success">
              <div className="qe-check">
                <Icon name="check" color="#fff" wrap={false} />
              </div>
              <h2>We&apos;ll reply within one business day</h2>
              <p>
                Your business profile and free audit request are saved. Reference number:{' '}
                <strong className="qe-ref">{refCode}</strong>
              </p>
              <div className="qe-success-acts">
                <a
                  className="btn btn-primary"
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{ display: 'inline-flex', width: '18px', height: '18px', flexShrink: 0 }}>
                    <Icon name="instagram" color="currentColor" wrap={false} />
                  </span>
                  DM us on Instagram ({SITE_CONFIG.instagramHandle}) →
                </a>
                <Link className="btn btn-neu" to="/">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-enter">
      <Helmet>
        <title>Get your free growth audit — AtLa/BTS</title>
        <meta property="og:title" content="Get your free growth audit — AtLa/BTS" />
        <meta
          name="description"
          content="Complete a 2-minute business profile to receive your free AtLa/BTS 360° digital, website, AI-search and automation mini audit."
        />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Get Started</Eyebrow>
            <h2>
              Get your <span className="grad">free growth audit</span>
            </h2>
            <p>
              Tell us about your business in five quick steps. Your answers are auto-saved so you
              won&apos;t lose progress, and we&apos;ll prepare a custom audit before our call.
            </p>
          </div>

          <div className="wiz-card glass">
            <div className="wiz-progress" role="tablist" aria-label="Onboarding steps">
              {STEP_LABELS.map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={step === idx}
                  className={`wiz-step-pill ${step === idx ? 'on' : idx < step ? 'done' : ''}`}
                  onClick={() => {
                    if (idx <= step) setStep(idx);
                  }}
                >
                  <span>{idx + 1}</span>
                  <em>{label}</em>
                </button>
              ))}
            </div>

            <div className="wiz-bar-track" aria-hidden="true">
              <div
                className="wiz-bar-fill"
                style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
              />
            </div>

            {step === 0 && (
              <div className="wiz-panel">
                <h3>Step 1 · About you</h3>
                <div className="form-grid">
                  <div className={`field ${fieldErrors.full_name ? 'is-error' : ''}`}>
                    <label htmlFor="gs-name">
                      Full name <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="gs-name"
                      className="input"
                      value={form.full_name}
                      onChange={(e) => update('full_name', e.target.value)}
                      placeholder="Your full name"
                    />
                    {fieldErrors.full_name && (
                      <span className="field-err">{fieldErrors.full_name}</span>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="gs-role">Designation</label>
                    <input
                      id="gs-role"
                      className="input"
                      value={form.designation}
                      onChange={(e) => update('designation', e.target.value)}
                      placeholder="Founder, Director, Marketing Head…"
                    />
                  </div>
                  <div className={`field ${fieldErrors.phone ? 'is-error' : ''}`}>
                    <label htmlFor="gs-phone">Phone (optional)</label>
                    <PhoneInput
                      id="gs-phone"
                      value={form.phone}
                      hasError={Boolean(fieldErrors.phone)}
                      onChange={(val) => update('phone', val)}
                      placeholder="98765 43210"
                    />
                    {fieldErrors.phone && (
                      <span className="field-err">{fieldErrors.phone}</span>
                    )}
                  </div>
                  <div className={`field ${fieldErrors.email ? 'is-error' : ''}`}>
                    <label htmlFor="gs-email">Email</label>
                    <input
                      id="gs-email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@company.com"
                    />
                    {fieldErrors.email && (
                      <span className="field-err">{fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label>Preferred contact</label>
                  <div className="wiz-chips">
                    {[
                      ['email', 'Email'],
                      ['call', 'Phone call'],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        className={`wiz-chip ${form.preferred_channel === val ? 'on' : ''}`}
                        onClick={() => update('preferred_channel', val)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="wiz-panel">
                <h3>Step 2 · Your business</h3>
                <div className="form-grid">
                  <div className={`field ${fieldErrors.company_name ? 'is-error' : ''}`}>
                    <label htmlFor="gs-co">
                      Company name <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="gs-co"
                      className="input"
                      value={form.company_name}
                      onChange={(e) => update('company_name', e.target.value)}
                      placeholder="Registered or brand name"
                    />
                    {fieldErrors.company_name && (
                      <span className="field-err">{fieldErrors.company_name}</span>
                    )}
                  </div>
                  <div className={`field ${fieldErrors.industry ? 'is-error' : ''}`}>
                    <label htmlFor="gs-ind">
                      Industry <span className="req" aria-hidden="true">*</span>
                    </label>
                    <SelectBox
                      id="gs-ind"
                      value={form.industry}
                      onChange={(e) => update('industry', e.target.value)}
                    >
                      <option value="">Select industry…</option>
                      {WIZARD_INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </SelectBox>
                    {fieldErrors.industry && (
                      <span className="field-err">{fieldErrors.industry}</span>
                    )}
                  </div>
                  <div className={`field ${fieldErrors.business_stage ? 'is-error' : ''}`}>
                    <label htmlFor="gs-stage">
                      Business stage <span className="req" aria-hidden="true">*</span>
                    </label>
                    <SelectBox
                      id="gs-stage"
                      value={form.business_stage}
                      onChange={(e) => update('business_stage', e.target.value)}
                    >
                      <option value="">Select stage…</option>
                      {BUSINESS_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </SelectBox>
                    {fieldErrors.business_stage && (
                      <span className="field-err">{fieldErrors.business_stage}</span>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="gs-team">Team size</label>
                    <SelectBox
                      id="gs-team"
                      value={form.team_size}
                      onChange={(e) => update('team_size', e.target.value)}
                    >
                      {TEAM_SIZES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                  <div className="field">
                    <label htmlFor="gs-rev">Annual revenue</label>
                    <SelectBox
                      id="gs-rev"
                      value={form.annual_revenue_range}
                      onChange={(e) => update('annual_revenue_range', e.target.value)}
                    >
                      {REVENUE_RANGES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                  <div className="field">
                    <label htmlFor="gs-yrs">Years in business</label>
                    <SelectBox
                      id="gs-yrs"
                      value={form.years_in_business}
                      onChange={(e) => update('years_in_business', e.target.value)}
                    >
                      {YEARS_IN_BUSINESS.map((y) => (
                        <option key={y} value={y}>
                          {y} years
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                </div>

                <div className="wiz-three">
                  <div className="field">
                    <label htmlFor="gs-loc">Number of locations</label>
                    <input
                      id="gs-loc"
                      type="number"
                      className="input"
                      min="1"
                      value={form.locations_count}
                      onChange={(e) => update('locations_count', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-city">City</label>
                    <input
                      id="gs-city"
                      className="input"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="Coimbatore, Chennai, Bengaluru…"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-state">State</label>
                    <SelectBox
                      id="gs-state"
                      value={form.state}
                      onChange={(e) => update('state', e.target.value)}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="wiz-panel">
                <h3>Step 3 · Online presence</h3>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={!form.has_website}
                    onChange={(e) => update('has_website', !e.target.checked)}
                  />
                  <span>No website yet</span>
                </label>

                {form.has_website && (
                  <div className="field">
                    <label htmlFor="gs-web">Website URL</label>
                    <input
                      id="gs-web"
                      className="input"
                      value={form.website_url}
                      onChange={(e) => update('website_url', e.target.value)}
                      placeholder="https://yourbrand.com"
                    />
                  </div>
                )}

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="gs-ig">Instagram handle</label>
                    <input
                      id="gs-ig"
                      className="input"
                      value={form.instagram}
                      onChange={(e) => update('instagram', e.target.value)}
                      placeholder="@yourbrand"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-li">LinkedIn</label>
                    <input
                      id="gs-li"
                      className="input"
                      value={form.linkedin}
                      onChange={(e) => update('linkedin', e.target.value)}
                      placeholder="linkedin.com/company/..."
                    />
                  </div>
                </div>

                <div className="wiz-three">
                  <div className="field">
                    <label htmlFor="gs-fb">Facebook</label>
                    <input
                      id="gs-fb"
                      className="input"
                      value={form.facebook}
                      onChange={(e) => update('facebook', e.target.value)}
                      placeholder="Facebook page URL"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-yt">YouTube</label>
                    <input
                      id="gs-yt"
                      className="input"
                      value={form.youtube}
                      onChange={(e) => update('youtube', e.target.value)}
                      placeholder="Channel handle or URL"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-x">X handle</label>
                    <input
                      id="gs-x"
                      className="input"
                      value={form.x_handle}
                      onChange={(e) => update('x_handle', e.target.value)}
                      placeholder="@yourbrand"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="gs-gbp">Google Business Profile link</label>
                  <input
                    id="gs-gbp"
                    className="input"
                    value={form.google_business_url}
                    onChange={(e) => update('google_business_url', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="field">
                  <label>Marketplace store links (Amazon, Flipkart, Meesho)</label>
                  <div className="wiz-repeat">
                    {form.marketplace_links.map((link, idx) => (
                      <div key={idx} className="wiz-repeat-row">
                        <input
                          className="input"
                          value={link}
                          onChange={(e) => {
                            const next = [...form.marketplace_links];
                            next[idx] = e.target.value;
                            update('marketplace_links', next);
                          }}
                          placeholder="https://amazon.in/..."
                        />
                        {form.marketplace_links.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-neu"
                            style={{ padding: '10px 14px' }}
                            onClick={() =>
                              update(
                                'marketplace_links',
                                form.marketplace_links.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-neu"
                      style={{ alignSelf: 'flex-start', padding: '9px 16px', fontSize: '0.82rem' }}
                      onClick={() =>
                        update('marketplace_links', [...form.marketplace_links, ''])
                      }
                    >
                      + Add marketplace link
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>Current marketing</label>
                  <div className="wiz-chips">
                    {MARKETING_CHANNELS.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        className={`wiz-chip ${
                          form.current_marketing.includes(ch) ? 'on' : ''
                        }`}
                        onClick={() => toggleMulti('current_marketing', ch)}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="gs-spend">Monthly marketing spend</label>
                  <SelectBox
                    id="gs-spend"
                    value={form.monthly_marketing_spend}
                    onChange={(e) => update('monthly_marketing_spend', e.target.value)}
                  >
                    {MARKETING_SPEND.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </SelectBox>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="wiz-panel">
                <h3>Step 4 · Goals &amp; current setup</h3>
                <div className="field">
                  <label>Primary goals (choose up to 3)</label>
                  <div className="wiz-chips">
                    {PRIMARY_GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`wiz-chip ${form.primary_goals.includes(g) ? 'on' : ''}`}
                        onClick={() => toggleMulti('primary_goals', g, 3)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Biggest challenges</label>
                  <div className="wiz-chips">
                    {BIGGEST_CHALLENGES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`wiz-chip ${
                          form.biggest_challenges.includes(c) ? 'on' : ''
                        }`}
                        onClick={() => toggleMulti('biggest_challenges', c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="gs-cust">Who are your customers?</label>
                    <input
                      id="gs-cust"
                      className="input"
                      value={form.target_customers}
                      onChange={(e) => update('target_customers', e.target.value)}
                      placeholder="e.g. D2C shoppers, B2B factories, hospitals…"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gs-comp">Top competitors</label>
                    <input
                      id="gs-comp"
                      className="input"
                      value={form.competitors}
                      onChange={(e) => update('competitors', e.target.value)}
                      placeholder="Names or websites"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Target locations</label>
                  <div className="wiz-chips">
                    {TARGET_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className={`wiz-chip ${
                          form.target_locations.includes(loc) ? 'on' : ''
                        }`}
                        onClick={() => toggleMulti('target_locations', loc)}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Tools you use</label>
                  <div className="wiz-chips">
                    {TOOLS_USED.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`wiz-chip ${form.current_tools.includes(t) ? 'on' : ''}`}
                        onClick={() => toggleMulti('current_tools', t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="wiz-three">
                  <div className="field">
                    <label>Has CRM?</label>
                    <div className="wiz-chips">
                      {[
                        [true, 'Yes'],
                        [false, 'No'],
                      ].map(([val, lbl]) => (
                        <button
                          key={lbl}
                          type="button"
                          className={`wiz-chip ${form.has_crm === val ? 'on' : ''}`}
                          onClick={() => update('has_crm', val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Has ERP?</label>
                    <div className="wiz-chips">
                      {[
                        [true, 'Yes'],
                        [false, 'No'],
                      ].map(([val, lbl]) => (
                        <button
                          key={lbl}
                          type="button"
                          className={`wiz-chip ${form.has_erp === val ? 'on' : ''}`}
                          onClick={() => update('has_erp', val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="gs-inhouse">In-house marketing/tech team</label>
                    <SelectBox
                      id="gs-inhouse"
                      value={form.in_house_team}
                      onChange={(e) => update('in_house_team', e.target.value)}
                    >
                      {IN_HOUSE_TEAM.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="wiz-panel">
                <h3>Step 5 · What you need</h3>
                <div className="field">
                  <label>Interested practices</label>
                  <div className="wiz-chips">
                    {practices.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`wiz-chip ${form.interests.includes(p.id) ? 'on' : ''}`}
                        onClick={() => toggleMulti('interests', p.id)}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="gs-pkg">Package</label>
                    <SelectBox
                      id="gs-pkg"
                      value={form.package_id}
                      onChange={(e) => update('package_id', e.target.value)}
                    >
                      <option value="">Not sure</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                      <option value="custom_cocktail">Custom Service Cocktail</option>
                    </SelectBox>
                  </div>
                  <div className={`field ${fieldErrors.budget ? 'is-error' : ''}`}>
                    <label htmlFor="gs-budget">
                      Monthly budget <span className="req" aria-hidden="true">*</span>
                    </label>
                    <SelectBox
                      id="gs-budget"
                      value={form.budget}
                      onChange={(e) => update('budget', e.target.value)}
                    >
                      <option value="">Select budget…</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </SelectBox>
                    {fieldErrors.budget && (
                      <span className="field-err">{fieldErrors.budget}</span>
                    )}
                  </div>
                  <div className={`field ${fieldErrors.decision_timeline ? 'is-error' : ''}`}>
                    <label htmlFor="gs-timeline">
                      Decision timeline <span className="req" aria-hidden="true">*</span>
                    </label>
                    <SelectBox
                      id="gs-timeline"
                      value={form.decision_timeline}
                      onChange={(e) => update('decision_timeline', e.target.value)}
                    >
                      <option value="">Select timeline…</option>
                      {DECISION_TIMELINES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </SelectBox>
                    {fieldErrors.decision_timeline && (
                      <span className="field-err">{fieldErrors.decision_timeline}</span>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="gs-date">Preferred start date</label>
                    <input
                      id="gs-date"
                      type="date"
                      className="input"
                      value={form.preferred_start_date}
                      onChange={(e) => update('preferred_start_date', e.target.value)}
                    />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="gs-notes">Anything else</label>
                    <textarea
                      id="gs-notes"
                      className="textarea"
                      value={form.extra_notes}
                      onChange={(e) => update('extra_notes', e.target.value)}
                      placeholder="Any context, links or questions for our strategy team…"
                    />
                  </div>
                </div>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.wants_free_audit}
                    onChange={(e) => update('wants_free_audit', e.target.checked)}
                  />
                  <span>Yes, I want the free mini audit</span>
                </label>

                <div className="field">
                  <label className={`check ${fieldErrors.consent ? 'is-error' : ''}`}>
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                    />
                    <span>
                      I agree to be contacted by AtLa/BTS about my enquiry.{' '}
                      <span className="req" aria-hidden="true">*</span>
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <span className="field-err">{fieldErrors.consent}</span>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="wiz-panel">
                <h3>Review your profile</h3>
                <div className="wiz-review">
                  <div className="wiz-rev-card neu">
                    <div className="wiz-rev-head">
                      <b>1. About you</b>
                      <button type="button" onClick={() => setStep(0)}>
                        Edit
                      </button>
                    </div>
                    <p>
                      {form.full_name}
                      {form.designation ? ` (${form.designation})` : ''}
                      {form.phone.trim() ? ` · ${formatPhoneForSubmit(form.phone)}` : ''}
                      {form.email ? ` · ${form.email}` : ''} · Preferred: {form.preferred_channel}
                    </p>
                  </div>

                  <div className="wiz-rev-card neu">
                    <div className="wiz-rev-head">
                      <b>2. Your business</b>
                      <button type="button" onClick={() => setStep(1)}>
                        Edit
                      </button>
                    </div>
                    <p>
                      {form.company_name} · {form.industry} ·{' '}
                      {BUSINESS_STAGES.find((s) => s.value === form.business_stage)?.label} ·{' '}
                      {form.team_size} team · {form.city ? `${form.city}, ` : ''}
                      {form.state}
                    </p>
                  </div>

                  <div className="wiz-rev-card neu">
                    <div className="wiz-rev-head">
                      <b>3. Online presence</b>
                      <button type="button" onClick={() => setStep(2)}>
                        Edit
                      </button>
                    </div>
                    <p>
                      {form.has_website ? form.website_url || 'Website provided' : 'No website yet'} ·{' '}
                      Marketing: {form.current_marketing.join(', ') || 'None specified'} · Spend:{' '}
                      {form.monthly_marketing_spend}
                    </p>
                  </div>

                  <div className="wiz-rev-card neu">
                    <div className="wiz-rev-head">
                      <b>4. Goals &amp; setup</b>
                      <button type="button" onClick={() => setStep(3)}>
                        Edit
                      </button>
                    </div>
                    <p>
                      Goals: {form.primary_goals.join(', ') || 'None selected'} · Challenges:{' '}
                      {form.biggest_challenges.join(', ') || 'None selected'} · CRM:{' '}
                      {form.has_crm ? 'Yes' : 'No'} · ERP: {form.has_erp ? 'Yes' : 'No'}
                    </p>
                  </div>

                  <div className="wiz-rev-card neu">
                    <div className="wiz-rev-head">
                      <b>5. What you need</b>
                      <button type="button" onClick={() => setStep(4)}>
                        Edit
                      </button>
                    </div>
                    <p>
                      Practices:{' '}
                      {form.interests
                        .map((id) => practices.find((p) => p.id === id)?.title || id)
                        .join(', ') || 'Open'}
                      {' · '}
                      Budget: {BUDGET_RANGES.find((b) => b.value === form.budget)?.label} ·
                      Timeline: {form.decision_timeline} · Free audit:{' '}
                      {form.wants_free_audit ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stepError && (
              <div className="qe-error" role="alert" style={{ marginTop: '14px' }}>
                {stepError}
              </div>
            )}

            <div className="wiz-nav">
              {step > 0 ? (
                <button type="button" className="btn btn-neu" onClick={handleBack}>
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {step < 5 ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  {step === 4 ? 'Review answers →' : 'Next →'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Submitting…' : 'Submit & get my free audit →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

