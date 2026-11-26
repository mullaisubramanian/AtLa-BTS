import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fmt } from '../lib/format';
import { SITE_CONFIG, waLink } from '../config/site';
import { submitLead } from '../lib/api';
import { useCatalogue } from '../context/CatalogueContext';
import { useContactPrefill } from '../context/ContactPrefillContext';
import { useModals } from '../context/ModalContext';
import { BUDGET_RANGES, BUSINESS_STAGES } from '../data/options';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import { PhoneInput, SelectBox } from '../components/FormFields';
import { formatPhoneForSubmit, validatePhoneInput } from '../lib/phone';
import './Contact.css';

const INITIAL_FORM = {
  name: '',
  company: '',
  phone: '',
  email: '',
  stage: 'startup',
  budget: 'under_35k',
  interests: [],
  packageId: '',
  msg: '',
  consent: true,
  honeypot: '',
};

export default function Contact() {
  const { practices, packages } = useCatalogue();
  const { prefill, clearContactPrefill } = useContactPrefill();
  const { showToast } = useModals();
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!prefill.version) return;
    setForm((prev) => ({
      ...prev,
      interests: prefill.interests?.length ? prefill.interests : prev.interests,
      packageId: prefill.packageName ? prefill.packageName.toLowerCase() : prev.packageId,
      msg: prefill.message || prev.msg,
    }));
  }, [prefill]);

  const toggleInterest = (id) => {
    setForm((prev) => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((x) => x !== id)
          : [...prev.interests, id],
      };
    });
  };

  const validateField = (key, value) => {
    let msg = '';
    if (key === 'name') {
      msg = String(value || '').trim() ? '' : 'Name is required';
    } else if (key === 'phone') {
      msg = validatePhoneInput(value);
    } else if (key === 'email') {
      const cleaned = String(value || '').trim();
      msg = !cleaned || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)
        ? ''
        : 'Enter a valid email address';
    } else if (key === 'consent') {
      msg = value ? '' : 'Please agree to be contacted by ATLABTS about your enquiry.';
    }
    setFieldErrors((prev) => ({ ...prev, [key]: msg }));
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.honeypot.trim()) {
      showToast('Thank you! We will get back to you within one business day.');
      setForm(INITIAL_FORM);
      setFieldErrors({});
      return;
    }

    const cleanedEmail = form.email.trim();
    const nextErrors = {
      name: form.name.trim() ? '' : 'Name is required',
      phone: validatePhoneInput(form.phone),
      email:
        !cleanedEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)
          ? ''
          : 'Enter a valid email address',
      consent: form.consent
        ? ''
        : 'Please agree to be contacted by ATLABTS about your enquiry.',
    };
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const formattedPhone = formatPhoneForSubmit(form.phone);
    setSubmitting(true);
    const isCocktail = form.packageId === 'custom_cocktail';
    const isProject = form.packageId === 'project';
    const { data, error } = await submitLead({
      contact: {
        full_name: form.name,
        phone: formattedPhone,
        whatsapp: formattedPhone,
        email: form.email,
        preferred_channel: 'whatsapp',
        whatsapp_opt_in: true,
      },
      company: form.company.trim()
        ? {
            name: form.company,
            business_stage: form.stage,
          }
        : {},
      lead: {
        source: 'contact_form',
        interests: form.interests,
        package_id: !isCocktail && !isProject && form.packageId ? form.packageId : null,
        is_custom_cocktail: isCocktail,
        budget: isProject ? 'project_based' : form.budget,
        message: form.msg,
        consent: true,
      },
    });
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || 'Unable to submit enquiry. Please retry.');
      return;
    }

    const ref = data ? ` (Ref: ${String(data).slice(0, 8).toUpperCase()})` : '';
    showToast(`Thank you! We will get back to you within one business day.${ref}`);
    setForm(INITIAL_FORM);
    clearContactPrefill();
  };

  return (
    <section className="page-enter">
      <Helmet>
        <title>Talk to us — ATLABTS</title>
        <meta
          name="description"
          content="Book a free 30-minute transformation call with ATLABTS and receive a mini audit of your social media, website, AI-search visibility and automation opportunities."
        />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Talk to us</Eyebrow>
            <h2>
              Let&apos;s design your <span className="grad">next chapter</span>
            </h2>
            <p>Tell us where you are and where you want to be. We reply within one business day.</p>
          </div>

          <div className="contact-grid">
            <div className="c-info neu">
              <h3>Direct line to the team</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
                No sales scripts. You speak directly with a strategist.
              </p>

              <a
                className="c-row"
                href={waLink()}
                target="_blank"
                rel="noreferrer"
              >
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0fb5ad" strokeWidth="2" aria-hidden="true">
                    <path d="M21 12a9 9 0 01-13.5 7.8L3 21l1.3-4.4A9 9 0 1121 12z" />
                  </svg>
                </div>
                <div>
                  <small>WhatsApp</small>
                  <b>{SITE_CONFIG.whatsappDisplay}</b>
                </div>
              </a>

              <a className="c-row" href={`tel:${SITE_CONFIG.phoneTel}`}>
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0fb5ad" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.7a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.4 1.8.6 2.7.7a2 2 0 011.9 2.2z" />
                  </svg>
                </div>
                <div>
                  <small>Phone</small>
                  <b>{SITE_CONFIG.whatsappDisplay}</b>
                </div>
              </a>

              <a className="c-row" href={`mailto:${SITE_CONFIG.email}`}>
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0fb5ad" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <div>
                  <small>Email</small>
                  <b>{SITE_CONFIG.email}</b>
                </div>
              </a>

              <div className="c-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0fb5ad" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div>
                  <small>Studio</small>
                  <b>{SITE_CONFIG.studioLocation}</b>
                </div>
              </div>

              <div className="c-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0fb5ad" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <div>
                  <small>Hours</small>
                  <b>{SITE_CONFIG.hours}</b>
                </div>
              </div>

              <Link
                to="/get-started"
                className="glass"
                style={{ padding: '18px', marginTop: 'auto', display: 'block' }}
              >
                <b>
                  <Icon name="gift" /> Free with every first call
                </b>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)' }}>
                  A mini audit of your social media, website, AI-search visibility and automation
                  opportunities. Start the 2-minute profile →
                </p>
              </Link>
            </div>

            <form className="form glass" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                aria-hidden="true"
              />

              <div className="form-grid">
                <div className={`field ${fieldErrors.name ? 'is-error' : ''}`}>
                  <label htmlFor="c-name">
                    Your name <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="c-name"
                    className="input"
                    required
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, name: val });
                      if (fieldErrors.name) validateField('name', val);
                    }}
                    onBlur={(e) => validateField('name', e.target.value)}
                  />
                  {fieldErrors.name && <span className="field-err">{fieldErrors.name}</span>}
                </div>

                <div className="field">
                  <label htmlFor="c-company">Company / Brand</label>
                  <input
                    id="c-company"
                    className="input"
                    name="company"
                    placeholder="Business name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>

                <div className={`field ${fieldErrors.phone ? 'is-error' : ''}`}>
                  <label htmlFor="c-phone">
                    Phone / WhatsApp <span className="req" aria-hidden="true">*</span>
                  </label>
                  <PhoneInput
                    id="c-phone"
                    required
                    name="phone"
                    value={form.phone}
                    hasError={Boolean(fieldErrors.phone)}
                    onChange={(val) => {
                      setForm({ ...form, phone: val });
                      if (fieldErrors.phone) validateField('phone', val);
                    }}
                    onBlur={(e) => validateField('phone', e.target.value)}
                    placeholder="98765 43210"
                  />
                  {fieldErrors.phone && <span className="field-err">{fieldErrors.phone}</span>}
                </div>

                <div className={`field ${fieldErrors.email ? 'is-error' : ''}`}>
                  <label htmlFor="c-email">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    className="input"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, email: val });
                      if (fieldErrors.email) validateField('email', val);
                    }}
                    onBlur={(e) => validateField('email', e.target.value)}
                  />
                  {fieldErrors.email && <span className="field-err">{fieldErrors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="c-stage">Business stage</label>
                  <SelectBox
                    id="c-stage"
                    name="stage"
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  >
                    {BUSINESS_STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </SelectBox>
                </div>

                <div className="field">
                  <label htmlFor="c-budget">Monthly budget</label>
                  <SelectBox
                    id="c-budget"
                    name="budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </SelectBox>
                </div>

                <div className="field field-full">
                  <label>I&apos;m interested in</label>
                  <div className="interest">
                    {practices.map((p) => (
                      <label key={p.id}>
                        <input
                          type="checkbox"
                          name="interest"
                          value={p.id}
                          checked={form.interests.includes(p.id)}
                          onChange={() => toggleInterest(p.id)}
                        />
                        <span>{p.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field field-full">
                  <label htmlFor="c-pkg">Package</label>
                  <SelectBox
                    id="c-pkg"
                    name="package"
                    value={form.packageId}
                    onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                  >
                    <option value="">Not sure yet, advise me</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {fmt(p.price)}/month
                      </option>
                    ))}
                    <option value="custom_cocktail">Custom Service Cocktail</option>
                    <option value="project">One-time project (ERP / CRM / SaaS / website)</option>
                  </SelectBox>
                </div>

                <div className="field field-full">
                  <label htmlFor="c-msg">Tell us about your goals</label>
                  <textarea
                    id="c-msg"
                    className="textarea"
                    name="msg"
                    placeholder="Where is your business today, and where do you want it in 12 months?"
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label className={`check ${fieldErrors.consent ? 'is-error' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm({ ...form, consent: checked });
                      if (fieldErrors.consent) validateField('consent', checked);
                    }}
                  />
                  <span>
                    I agree to be contacted by ATLABTS about my enquiry.{' '}
                    <span className="req" aria-hidden="true">*</span>
                  </span>
                </label>
                {fieldErrors.consent && <span className="field-err">{fieldErrors.consent}</span>}
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#991b1b',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={submitting}
                style={{ justifyContent: 'center' }}
              >
                {submitting ? 'Sending…' : 'Send & book my free call →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
