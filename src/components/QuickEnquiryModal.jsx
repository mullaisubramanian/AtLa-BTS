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
import './QuickEnquiryModal.css';

function validatePhone(raw) {
  const cleaned = raw.trim();
  if (!/^[0-9+ ()-]{8,20}$/.test(cleaned)) {
    return 'Valid phone is required';
  }
  const digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith('+91') || (!cleaned.startsWith('+') && digits.length === 10)) {
    const ten = digits.slice(-10);
    if (!/^[6-9]\d{9}$/.test(ten)) {
      return 'Enter a valid 10-digit Indian mobile number or international number with +';
    }
  } else if (digits.length < 8) {
    return 'Valid phone is required';
  }
  return '';
}

export default function QuickEnquiryModal() {
  const { quickEnquiry, closeQuickEnquiry } = useModals();
  const { open } = quickEnquiry;
  const trapRef = useFocusTrap(open, closeQuickEnquiry);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
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
    setPhone('+91 ');
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
    setErrorMsg('');
    setSubmitting(false);
    setSubmittedLeadId(null);
  }, [open, quickEnquiry]);

  if (!open) return null;

  const submitLabel =
    quickEnquiry.source === 'cocktail_negotiate' || quickEnquiry.source === 'package_negotiate'
      ? "Let's negotiate"
      : quickEnquiry.source === 'cocktail_serve'
      ? 'Serve it to me'
      : 'Send enquiry';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot.trim()) {
      setSubmittedLeadId('00000000-honeypot');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Name is required');
      return;
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setErrorMsg(phoneErr);
      return;
    }

    if (!consent) {
      setErrorMsg('Please agree to be contacted by ATLABTS about your enquiry.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await submitLead({
      contact: {
        full_name: fullName,
        phone,
        whatsapp: phone,
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

                <div className="qe-two">
                  <div className="field">
                    <label htmlFor="qe-name">Full name *</label>
                    <input
                      id="qe-name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="qe-phone">Phone / WhatsApp *</label>
                    <input
                      id="qe-phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="qe-two">
                  <div className="field">
                    <label htmlFor="qe-email">Email</label>
                    <input
                      id="qe-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="qe-company">Company name</label>
                    <input
                      id="qe-company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Business / brand name"
                    />
                  </div>
                </div>

                <div className="qe-two">
                  <div className="field">
                    <label htmlFor="qe-stage">Business stage</label>
                    <select
                      id="qe-stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    >
                      {BUSINESS_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="qe-budget">Monthly budget</label>
                    <select
                      id="qe-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {quickEnquiry.source === 'academy' && (
                  <div className="field">
                    <label htmlFor="qe-academy">Which programme?</label>
                    <select
                      id="qe-academy"
                      value={academyTrack}
                      onChange={(e) => setAcademyTrack(e.target.value)}
                    >
                      {ACADEMY_TRACKS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="qe-msg">Message</label>
                  <textarea
                    id="qe-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your goals or questions…"
                  />
                </div>

                <label className="qe-check-row">
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  />
                  <span>Send me updates on WhatsApp</span>
                </label>

                <label className="qe-check-row">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>I agree to be contacted by ATLABTS about my enquiry. *</span>
                </label>

                {errorMsg && (
                  <div className="qe-error" role="alert">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary qe-submit"
                  disabled={submitting}
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

