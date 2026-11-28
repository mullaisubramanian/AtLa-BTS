import { useId, useMemo, useRef, useState } from 'react';
import { TEAM_ROLES, ROLE_QUESTIONS } from '../data/teamRoles';
import { submitJobApplication } from '../lib/api';
import { useModals } from '../context/ModalContext';
import { PhoneInput, SelectBox } from './FormFields';
import { formatPhoneForSubmit, validatePhoneInput } from '../lib/phone';
import './TeamScorecardForm.css';

function validateEmail(raw) {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? '' : 'Enter a valid email address';
}

function validateHttpUrl(raw, required) {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return required ? 'This link is required' : '';
  return /^https?:\/\/.+\..+/i.test(cleaned)
    ? ''
    : 'Enter a valid URL starting with http:// or https://';
}

export default function TeamScorecardForm({ onSubmitted }) {
  const uid = useId();
  const { showSlashPopup } = useModals();
  const stepHeadingRef = useRef(null);

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState(TEAM_ROLES[0]);
  const [answers, setAnswers] = useState({});
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const questions = useMemo(() => ROLE_QUESTIONS[role] || [], [role]);

  // Compute dynamic Profile Strength % across base + role questions + step 3
  const strength = useMemo(() => {
    const checks = [
      Boolean(fullName.trim()),
      !validateEmail(email),
      Boolean(phone.trim()),
      Boolean(city.trim()),
      Boolean(role),
    ];
    questions.forEach((q) => {
      const val = answers[q.key];
      if (Array.isArray(val)) {
        checks.push(val.length > 0);
      } else {
        checks.push(Boolean(String(val ?? '').trim()));
      }
    });
    checks.push(Boolean(note.trim()));
    checks.push(Boolean(consent));
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / Math.max(1, checks.length)) * 100);
  }, [fullName, email, phone, city, role, questions, answers, note, consent]);

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const toggleMultiOption = (key, option) => {
    const current = Array.isArray(answers[key]) ? answers[key] : [];
    const next = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setAnswer(key, next);
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setAnswers({});
    setErrors({});
  };

  const validateStep1 = () => {
    const next = {
      fullName: fullName.trim() ? '' : 'Full name is required',
      email: validateEmail(email),
      phone: validatePhoneInput(phone, { required: false }),
      city: city.length > 80 ? 'City must be 80 characters or fewer' : '',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const validateStep2 = () => {
    const next = {
      role: TEAM_ROLES.includes(role) ? '' : 'Please choose a role',
    };
    questions.forEach((q) => {
      const val = String(answers[q.key] ?? '').trim();
      if (q.type === 'url') {
        next[q.key] = validateHttpUrl(val, q.required);
      } else if (q.required && !val) {
        next[q.key] = `${q.label} is required`;
      }
    });
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const validateStep3 = () => {
    const next = {
      note: note.length > 500 ? 'Note must be 500 characters or fewer' : '',
      consent: consent ? '' : 'Consent is required to submit your interest',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const goToStep = (nextStep) => {
    setStep(nextStep);
    window.setTimeout(() => {
      stepHeadingRef.current?.focus();
    }, 20);
  };

  const handleNext = () => {
    setServerError('');
    if (step === 1 && validateStep1()) goToStep(2);
    if (step === 2 && validateStep2()) goToStep(3);
  };

  const extractPortfolioUrl = () => {
    for (const q of questions) {
      if (q.isPortfolioCandidate) {
        const val = String(answers[q.key] || '').trim();
        if (/^https?:\/\//i.test(val)) return val;
      }
    }
    return null;
  };

  const resetAll = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setCity('');
    setRole(TEAM_ROLES[0]);
    setAnswers({});
    setNote('');
    setConsent(false);
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (step < 3) {
      handleNext();
      return;
    }

    if (!validateStep1()) {
      goToStep(1);
      return;
    }
    if (!validateStep2()) {
      goToStep(2);
      return;
    }
    if (!validateStep3()) return;

    const firstName = fullName.trim().split(/\s+/)[0] || 'there';

    if (honeypot.trim()) {
      resetAll();
      showSlashPopup(
        `Thanks, ${firstName}! I've received your interest. I will ask HR to connect with you.`
      );
      return;
    }

    // Build clean non-empty answers map
    const cleanAnswers = {};
    questions.forEach((q) => {
      const val = answers[q.key];
      if (Array.isArray(val) && val.length > 0) {
        cleanAnswers[q.key] = val;
      } else if (typeof val === 'string' && val.trim()) {
        cleanAnswers[q.key] = val.trim();
      }
    });

    const formattedPhone = phone.trim() ? formatPhoneForSubmit(phone) : '';

    setSubmitting(true);
    const { error } = await submitJobApplication({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone || null,
      city: city.trim() || null,
      role,
      portfolio_url: extractPortfolioUrl(),
      note: note.trim() || null,
      answers: cleanAnswers,
      consent: true,
    });
    setSubmitting(false);

    if (error) {
      setServerError(error.message || 'Unable to submit right now. Please retry.');
      return;
    }

    resetAll();
    onSubmitted?.();
    showSlashPopup(
      `Thanks, ${firstName}! I've received your interest. I will ask HR to connect with you.`
    );
  };

  const ringRadius = 22;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc * (1 - strength / 100);

  return (
    <form className="scorecard-form glass" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="team_hp"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="sc-hp"
        aria-hidden="true"
      />

      <div className="sc-grad-head">
        <div className="sc-head-copy">
          <span className="sc-step-badge">Step {step} of 3</span>
          <h3 ref={stepHeadingRef} tabIndex={-1}>
            {step === 1 && 'About you'}
            {step === 2 && 'Choose your role'}
            {step === 3 && 'Final note & consent'}
          </h3>
          <div className="sc-prog-track" aria-hidden="true">
            <div className="sc-prog-fill" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <div className="sc-ring-box" aria-label={`Profile strength ${strength}%`}>
          <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
            <circle cx="28" cy="28" r={ringRadius} className="sc-ring-bg" />
            <circle
              cx="28"
              cy="28"
              r={ringRadius}
              className="sc-ring-val"
              strokeDasharray={ringCirc.toFixed(1)}
              strokeDashoffset={ringOffset.toFixed(1)}
            />
          </svg>
          <span>{strength}%</span>
        </div>
      </div>

      <div className="sc-form-body">
        {step === 1 && (
          <div className="sc-grid">
            <div className={`field ${errors.fullName ? 'is-error' : ''}`}>
              <label htmlFor={`${uid}-name`}>
                Full name <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-name`}
                name="full_name"
                className="input"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${uid}-name-err` : undefined}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' }));
                }}
                placeholder="Your full name"
              />
              {errors.fullName && (
                <span id={`${uid}-name-err`} className="field-err">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className={`field ${errors.email ? 'is-error' : ''}`}>
              <label htmlFor={`${uid}-email`}>
                Email <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                className="input"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                }}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span id={`${uid}-email-err`} className="field-err">
                  {errors.email}
                </span>
              )}
            </div>

            <div className={`field ${errors.phone ? 'is-error' : ''}`}>
              <label htmlFor={`${uid}-phone`}>Phone (optional)</label>
              <PhoneInput
                id={`${uid}-phone`}
                value={phone}
                hasError={Boolean(errors.phone)}
                onChange={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors((p) => ({ ...p, phone: validatePhoneInput(val, { required: false }) }));
                }}
                onBlur={(e) => setErrors((p) => ({ ...p, phone: validatePhoneInput(e.target.value, { required: false }) }))}
                placeholder="98765 43210"
              />
              {errors.phone && <span className="field-err">{errors.phone}</span>}
            </div>

            <div className={`field ${errors.city ? 'is-error' : ''}`}>
              <label htmlFor={`${uid}-city`}>City</label>
              <input
                id={`${uid}-city`}
                name="city"
                className="input"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Coimbatore, Chennai, Bangalore"
              />
              {errors.city && <span className="field-err">{errors.city}</span>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="sc-grid">
            <div className={`field sc-full ${errors.role ? 'is-error' : ''}`}>
              <label htmlFor={`${uid}-role`}>
                Role interested in <span className="req" aria-hidden="true">*</span>
              </label>
              <SelectBox
                id={`${uid}-role`}
                name="role"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {TEAM_ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectBox>
              {errors.role && <span className="field-err">{errors.role}</span>}
            </div>

            {questions.map((q) => {
              const fieldId = `${uid}-q-${q.key}`;
              const errMsg = errors[q.key];

              if (q.type === 'select') {
                return (
                  <div key={q.key} className={`field ${errMsg ? 'is-error' : ''}`}>
                    <label htmlFor={fieldId}>
                      {q.label} {q.required && <span className="req" aria-hidden="true">*</span>}
                    </label>
                    <SelectBox
                      id={fieldId}
                      value={answers[q.key] || ''}
                      onChange={(e) => setAnswer(q.key, e.target.value)}
                    >
                      <option value="">Select {q.label.toLowerCase()}</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </SelectBox>
                    {errMsg && <span className="field-err">{errMsg}</span>}
                  </div>
                );
              }

              if (q.type === 'checkbox-group') {
                const selected = Array.isArray(answers[q.key]) ? answers[q.key] : [];
                return (
                  <fieldset key={q.key} className="field sc-full sc-fieldset">
                    <legend>{q.label}</legend>
                    <div className="sc-chip-row">
                      {q.options.map((opt) => {
                        const checked = selected.includes(opt);
                        return (
                          <label key={opt} className={`sc-chip ${checked ? 'is-on' : ''}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMultiOption(q.key, opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              }

              if (q.type === 'radio') {
                const current = answers[q.key] || '';
                return (
                  <fieldset key={q.key} className="field sc-full sc-fieldset">
                    <legend>{q.label}</legend>
                    <div className="sc-chip-row">
                      {q.options.map((opt) => {
                        const checked = current === opt;
                        return (
                          <label key={opt} className={`sc-chip ${checked ? 'is-on' : ''}`}>
                            <input
                              type="radio"
                              name={`${uid}-${q.key}`}
                              value={opt}
                              checked={checked}
                              onChange={() => setAnswer(q.key, opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              }

              if (q.type === 'textarea') {
                return (
                  <div key={q.key} className={`field sc-full ${errMsg ? 'is-error' : ''}`}>
                    <label htmlFor={fieldId}>
                      {q.label} {q.required && <span className="req" aria-hidden="true">*</span>}
                    </label>
                    <textarea
                      id={fieldId}
                      className="textarea"
                      required={q.required}
                      value={answers[q.key] || ''}
                      onChange={(e) => setAnswer(q.key, e.target.value)}
                      placeholder={q.placeholder || ''}
                    />
                    {errMsg && <span className="field-err">{errMsg}</span>}
                  </div>
                );
              }

              return (
                <div
                  key={q.key}
                  className={`field ${q.key === 'best_automation' ? 'sc-full' : ''} ${errMsg ? 'is-error' : ''}`}
                >
                  <label htmlFor={fieldId}>
                    {q.label} {q.required && <span className="req" aria-hidden="true">*</span>}
                  </label>
                  <input
                    id={fieldId}
                    type={q.type === 'url' ? 'url' : q.type === 'date' ? 'date' : q.type === 'number' ? 'text' : 'text'}
                    inputMode={q.type === 'number' ? 'numeric' : undefined}
                    autoCapitalize={q.type === 'url' ? 'none' : undefined}
                    spellCheck={q.type === 'url' ? 'false' : undefined}
                    className="input"
                    required={q.required}
                    aria-invalid={Boolean(errMsg)}
                    value={answers[q.key] || ''}
                    onChange={(e) => setAnswer(q.key, e.target.value)}
                    placeholder={q.placeholder || ''}
                  />
                  {errMsg && <span className="field-err">{errMsg}</span>}
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div className="sc-grid">
            <div className={`field sc-full ${errors.note ? 'is-error' : ''}`}>
              <div className="sc-label-row">
                <label htmlFor={`${uid}-note`}>Short note</label>
                <span className="sc-char-count">{note.length}/500</span>
              </div>
              <textarea
                id={`${uid}-note`}
                className="textarea"
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Share any context, wins or availability you want us to see."
              />
              {errors.note && <span className="field-err">{errors.note}</span>}
            </div>

            <div className={`field sc-full ${errors.consent ? 'is-error' : ''}`}>
              <label className={`check ${errors.consent ? 'is-error' : ''}`}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setConsent(checked);
                    if (errors.consent) setErrors((p) => ({ ...p, consent: '' }));
                  }}
                />
                <span>
                  I agree AtLa/BTS may store my details to review my application, as per the{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                  . <span className="req" aria-hidden="true">*</span>
                </span>
              </label>
              {errors.consent && <span className="field-err">{errors.consent}</span>}
            </div>
          </div>
        )}

        {serverError && (
          <div className="sc-error" role="alert">
            {serverError}
          </div>
        )}

        <div className="sc-actions">
          {step > 1 && (
            <button type="button" className="btn btn-neu" onClick={() => goToStep(step - 1)}>
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next step →
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Express interest'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

