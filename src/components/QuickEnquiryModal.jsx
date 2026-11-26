import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useModals } from '../context/ModalContext';
import { useFocusTrap } from '../lib/useFocusTrap';
import { submitLead } from '../lib/api';
import { fmt } from '../lib/format';
import { waLink } from '../config/site';
import {
  ACADEMY_TRACKS,
  BUDGET_RANGES,
  BUSINESS_STAGES,
  budgetForAmount,
} from '../data/options';
import Icon from './Icon';
import { PhoneInput, SelectBox } from './FormFields';
import { formatPhoneForSubmit, isValidTenDigitPhone, validatePhoneInput } from '../lib/phone';
import './QuickEnquiryModal.css';

function validateEmail(raw) {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? '' : 'Enter a valid email address';
}

export default function QuickEnquiryModal() {
  const { quickEnquiry, closeQuickEnquiry } = useModals();
  const { open } = quickEnquiry;
  const trapRef = useFocusTrap(open, closeQuickEnquiry);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [stage, setStage] = useState('growing_sme');
  const [budget, setBudget] = useState('not_sure');
  const [academyTrack, setAcademyTrack] = useState(ACADEMY_TRACKS[0]);
  const [message, setMessage] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  useEffect(() => {
    if (!open) return;
    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setStage('growing_sme');
    const knownAmount = quickEnquiry.packagePrice || quickEnquiry.cocktailTotal;
    setBudget(knownAmount ? budgetForAmount(knownAmount) : 'not_sure');
    setAcademyTrack(quickEnquiry.academyTrack || ACADEMY_TRACKS[0]);
    setMessage(quickEnquiry.defaultMessage || '');
    setWhatsappOptIn(true);
    setConsent(false);
    setHoneypot('');
    setFieldErrors({});
    setErrorMsg('');
    setSubmitting(false);
    setSubmittedLeadId(null);
  }, [open, quickEnquiry]);

  const [fieldErrors, setFieldErrors] = useState({});

  if (!open) return null;

  const submitLabel =
    quickEnquiry.source === 'cocktail_negotiate' || quickEnquiry.source === 'package_negotiate'
      ? "Let's negotiate"
      : quickEnquiry.source === 'cocktail_serve'
      ? 'Serve it to me'
      : 'Send enquiry';

  const isServeMode = quickEnquiry.source === 'cocktail_serve';
  const isServeReady =
    Boolean(fullName.trim()) && isValidTenDigitPhone(phone) && Boolean(consent);

  const validateSingleField = (field, value) => {
    let msg = '';
    if (field === 'fullName') {
      msg = String(value || '').trim() ? '' : 'Name is required';
    } else if (field === 'phone') {
      msg = validatePhoneInput(value);
    } else if (field === 'email') {
      msg = validateEmail(value);
    } else if (field === 'consent') {
      msg = value ? '' : 'Please agree to be contacted by ATLABTS about your enquiry.';
    }
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot.trim()) {
      setSubmittedLeadId('00000000-honeypot');
      return;
    }

    const nextErrors = {
      fullName: fullName.trim() ? '' : 'Name is required',
      phone: validatePhoneInput(phone),
      email: validateEmail(email),
      consent: consent ? '' : 'Please agree to be contacted by ATLABTS about your enquiry.',
    };
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const formattedPhone = formatPhoneForSubmit(phone);
    setSubmitting(true);
    const { data, error } = await submitLead({
      contact: {
        full_name: fullName,
        phone: formattedPhone,
        whatsapp: formattedPhone,
        email,
        preferred_channel: 'whatsapp',
        whatsapp_opt_in: whatsappOptIn,
      },
      company: companyName.trim()
        ? {
            name: companyName,
            business_stage: stage,
          }
        : {},
      lead: {
        source: quickEnquiry.source || 'contact_form',
        interests: quickEnquiry.interests || [],
        package_id: quickEnquiry.packageId || null,
        is_custom_cocktail: Boolean(quickEnquiry.isCustomCocktail),
        cocktail_quote_id: quickEnquiry.cocktailQuoteId || null,
        budget,
        message,
        ask_atla_question: quickEnquiry.askQuestion || null,
        ask_atla_conversation_id: quickEnquiry.askConversationId || null,
        academy_track: quickEnquiry.source === 'academy' ? academyTrack : null,
        consent: true,
      },
    });
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || 'Unable to submit enquiry right now. Please retry.');
      return;
    }

    setSubmittedLeadId(data || `ATLA${Date.now().toString(36).toUpperCase()}`);
  };

  const refCode = submittedLeadId ? String(submittedLeadId).slice(0, 8).toUpperCase() : '';
  const waHref = waLink(`Hi ATLABTS, my enquiry reference is ${refCode}.`);

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-enquiry-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeQuickEnquiry();
      }}
    >
      <div className="qe-box" ref={trapRef}>
        <div className="qe-head">
          <div>
            <small className="qe-eyebrow">Quick Enquiry</small>
            <h2 id="quick-enquiry-title">{quickEnquiry.title || 'Talk to ATLABTS'}</h2>
          </div>
          <button
            type="button"
            className="close"
            onClick={closeQuickEnquiry}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="qe-body">
          {submittedLeadId ? (
            <div className="qe-success">
              <div className="qe-check">
                <Icon name="check" color="#fff" wrap={false} />
              </div>
              <h3>We&apos;ll call you within one business day</h3>
              <p>
                Your enquiry has been saved. Reference number:{' '}
                <strong className="qe-ref">{refCode}</strong>
              </p>
              <div className="qe-success-acts">
                <a
                  className="btn btn-primary"
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp now →
                </a>
                <Link
                  className="btn btn-neu"
                  to={`/get-started?ref=${encodeURIComponent(submittedLeadId)}`}
                  onClick={closeQuickEnquiry}
                >
                  Complete your business profile (2 min)
                </Link>
              </div>
            </div>
          ) : (
            <>
              {(quickEnquiry.cocktailItems?.length > 0 ||
                quickEnquiry.packageName ||
                quickEnquiry.askQuestion ||
                quickEnquiry.contextLabel) && (
                <div
                  className="qe-summary glass"
                  style={
                    quickEnquiry.packageColor
                      ? { borderLeft: `4px solid ${quickEnquiry.packageColor}` }
                      : undefined
                  }
                >
                  {quickEnquiry.cocktailItems?.length > 0 && (
                    <div>
                      <div className="qe-sum-head">
                        <b>Your Service Cocktail</b>
                        <span>{fmt(quickEnquiry.cocktailTotal || 0)}/month</span>
                      </div>
                      <div className="qe-sum-pills">
                        {quickEnquiry.cocktailItems.map((m) => (
                          <span key={m.id}>{m.n}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {quickEnquiry.packageName && (
                    <div className="qe-sum-head">
                      <div>
                        <small>Selected Package</small>
                        <b>{quickEnquiry.packageName}</b>
                      </div>
                      {quickEnquiry.packagePrice && (
                        <span>{fmt(quickEnquiry.packagePrice)}/month</span>
                      )}
                    </div>
                  )}

                  {quickEnquiry.askQuestion && (
                    <div>
                      <small>Your question to ATLA AI</small>
                      <b>&quot;{quickEnquiry.askQuestion}&quot;</b>
                    </div>
                  )}

                  {!quickEnquiry.cocktailItems?.length &&
                    !quickEnquiry.packageName &&
                    !quickEnquiry.askQuestion &&
                    quickEnquiry.contextLabel && (
                      <div>
                        <small>Selected Focus</small>
                        <b>{quickEnquiry.contextLabel}</b>
                      </div>
                    )}
                </div>
              )}

              <form className="qe-form" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="qe-hp"
                  aria-hidden="true"
                />

                <div className="form-grid">
                  <div className={`field ${fieldErrors.fullName ? 'is-error' : ''}`}>
                    <label htmlFor="qe-name">
                      Full name <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="qe-name"
                      className="input"
                      required
                      value={fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFullName(val);
                        if (fieldErrors.fullName) validateSingleField('fullName', val);
                      }}
                      onBlur={(e) => validateSingleField('fullName', e.target.value)}
                      placeholder="Your full name"
                    />
                    {fieldErrors.fullName && (
                      <span className="field-err">{fieldErrors.fullName}</span>
                    )}
                  </div>

                  <div className={`field ${fieldErrors.phone ? 'is-error' : ''}`}>
                    <label htmlFor="qe-phone">
                      Phone / WhatsApp <span className="req" aria-hidden="true">*</span>
                    </label>
                    <PhoneInput
                      id="qe-phone"
                      required
                      value={phone}
                      hasError={Boolean(fieldErrors.phone)}
                      onChange={(val) => {
                        setPhone(val);
                        if (fieldErrors.phone) validateSingleField('phone', val);
                      }}
                      onBlur={(e) => validateSingleField('phone', e.target.value)}
                      placeholder="98765 43210"
                    />
                    {fieldErrors.phone && (
                      <span className="field-err">{fieldErrors.phone}</span>
                    )}
                  </div>

                  <div className={`field ${fieldErrors.email ? 'is-error' : ''}`}>
                    <label htmlFor="qe-email">Email</label>
                    <input
                      id="qe-email"
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        if (fieldErrors.email) validateSingleField('email', val);
                      }}
                      onBlur={(e) => validateSingleField('email', e.target.value)}
                      placeholder="you@company.com"
                    />
                    {fieldErrors.email && (
                      <span className="field-err">{fieldErrors.email}</span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="qe-company">Company name</label>
                    <input
                      id="qe-company"
                      className="input"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Business / brand name"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="qe-stage">Business stage</label>
                    <SelectBox
                      id="qe-stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    >
                      {BUSINESS_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </SelectBox>
                  </div>

                  <div className="field">
                    <label htmlFor="qe-budget">Monthly budget</label>
                    <SelectBox
                      id="qe-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </SelectBox>
                  </div>

                  {quickEnquiry.source === 'academy' && (
                    <div className="field field-full">
                      <label htmlFor="qe-academy">Which programme?</label>
                      <SelectBox
                        id="qe-academy"
                        value={academyTrack}
                        onChange={(e) => setAcademyTrack(e.target.value)}
                      >
                        {ACADEMY_TRACKS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </SelectBox>
                    </div>
                  )}

                  <div className="field field-full">
                    <label htmlFor="qe-msg">Message</label>
                    <textarea
                      id="qe-msg"
                      className="textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your goals or questions…"
                    />
                  </div>
                </div>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  />
                  <span>Send me updates on WhatsApp</span>
                </label>

                <div className="field">
                  <label className={`check ${fieldErrors.consent ? 'is-error' : ''}`}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setConsent(checked);
                        if (fieldErrors.consent) validateSingleField('consent', checked);
                      }}
                    />
                    <span>
                      I agree to be contacted by ATLABTS about my enquiry.{' '}
                      <span className="req" aria-hidden="true">*</span>
                    </span>
                  </label>
                  {fieldErrors.consent && (
                    <span className="field-err">{fieldErrors.consent}</span>
                  )}
                </div>

                {errorMsg && (
                  <div className="qe-error" role="alert">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary qe-submit"
                  disabled={submitting || (isServeMode && !isServeReady)}
                >
                  {submitting ? (
                    <>
                      <span className="qe-spinner" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    `${submitLabel} →`
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

