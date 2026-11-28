import { useId, useState } from 'react';
import { submitJobApplication } from '../lib/api';
import { useModals } from '../context/ModalContext';
import { PhoneInput, SelectBox } from './FormFields';
import { formatPhoneForSubmit, validatePhoneInput } from '../lib/phone';
import './CareerForm.css';

const CAREER_ROLES = [
  'Digital Marketing',
  'Content & Design',
  'Web/App Development',
  'AI Automation',
  'Sales & Partnerships',
  'Academy Trainer',
  'Internship',
  'Other',
];

const INITIAL_STATE = {
  fullName: '',
  email: '',
  phone: '',
  role: CAREER_ROLES[0],
  portfolioUrl: '',
  note: '',
  consent: false,
  honeypot: '',
};

function validateEmail(raw) {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? '' : 'Enter a valid email address';
}

function validateUrl(raw) {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return '';
  return /^https?:\/\/.+/i.test(cleaned)
    ? ''
    : 'Include http:// or https:// in your link';
}

export default function CareerForm({ compact = false }) {
  const uid = useId();
  const { showSlashPopup } = useModals();
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateSingle = (field, value) => {
    let msg = '';
    if (field === 'fullName') {
      msg = String(value || '').trim() ? '' : 'Full name is required';
    } else if (field === 'email') {
      msg = validateEmail(value);
    } else if (field === 'phone') {
      msg = validatePhoneInput(value, { required: false });
    } else if (field === 'role') {
      msg = CAREER_ROLES.includes(value) ? '' : 'Please select a role';
    } else if (field === 'portfolioUrl') {
      msg = validateUrl(value);
    } else if (field === 'note') {
      msg = String(value || '').length > 500 ? 'Note must be 500 characters or fewer' : '';
    } else if (field === 'consent') {
      msg = value ? '' : 'Consent is required to submit your application';
    }
    setErrors((prev) => ({ ...prev, [field]: msg }));
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (form.honeypot.trim()) {
      const firstName = form.fullName.trim().split(/\s+/)[0] || 'there';
      showSlashPopup(
        `Thanks, ${firstName}! I've received your application. I will ask HR to connect with you.`
      );
      setForm(INITIAL_STATE);
      return;
    }

    const nextErrors = {
      fullName: form.fullName.trim() ? '' : 'Full name is required',
      email: validateEmail(form.email),
      phone: validatePhoneInput(form.phone, { required: false }),
      role: CAREER_ROLES.includes(form.role) ? '' : 'Please select a role',
      portfolioUrl: validateUrl(form.portfolioUrl),
      note: form.note.length > 500 ? 'Note must be 500 characters or fewer' : '',
      consent: form.consent ? '' : 'Consent is required to submit your application',
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const firstName = form.fullName.trim().split(/\s+/)[0] || 'there';
    const formattedPhone = form.phone.trim() ? formatPhoneForSubmit(form.phone) : '';

    setSubmitting(true);
    const { error } = await submitJobApplication({
      full_name: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: formattedPhone || null,
      role: form.role,
      portfolio_url: form.portfolioUrl.trim() || null,
      note: form.note.trim() || null,
      consent: true,
    });
    setSubmitting(false);

    if (error) {
      setServerError(error.message || 'Unable to submit your application right now. Please retry.');
      return;
    }

    setForm(INITIAL_STATE);
    setErrors({});
    showSlashPopup(
      `Thanks, ${firstName}! I've received your application. I will ask HR to connect with you.`
    );
  };

  return (
    <form
      className={`career-form glass ${compact ? 'is-compact' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="text"
        name="career_hp"
        tabIndex={-1}
        autoComplete="off"
        value={form.honeypot}
        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        className="cf-hp"
        aria-hidden="true"
      />

      <div className="cf-grid">
        <div className={`field ${errors.fullName ? 'is-error' : ''}`}>
          <label htmlFor={`${uid}-name`}>
            Full name <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-name`}
            className="input"
            required
            value={form.fullName}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, fullName: val });
              if (errors.fullName) validateSingle('fullName', val);
            }}
            onBlur={(e) => validateSingle('fullName', e.target.value)}
            placeholder="Your full name"
          />
          {errors.fullName && <span className="field-err">{errors.fullName}</span>}
        </div>

        <div className={`field ${errors.email ? 'is-error' : ''}`}>
          <label htmlFor={`${uid}-email`}>
            Email <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, email: val });
              if (errors.email) validateSingle('email', val);
            }}
            onBlur={(e) => validateSingle('email', e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <span className="field-err">{errors.email}</span>}
        </div>

        <div className={`field ${errors.phone ? 'is-error' : ''}`}>
          <label htmlFor={`${uid}-phone`}>Phone (optional)</label>
          <PhoneInput
            id={`${uid}-phone`}
            value={form.phone}
            hasError={Boolean(errors.phone)}
            onChange={(val) => {
              setForm({ ...form, phone: val });
              if (errors.phone) validateSingle('phone', val);
            }}
            onBlur={(e) => validateSingle('phone', e.target.value)}
            placeholder="98765 43210"
          />
          {errors.phone && <span className="field-err">{errors.phone}</span>}
        </div>

        <div className={`field ${errors.role ? 'is-error' : ''}`}>
          <label htmlFor={`${uid}-role`}>
            Role interested in <span className="req" aria-hidden="true">*</span>
          </label>
          <SelectBox
            id={`${uid}-role`}
            value={form.role}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, role: val });
              validateSingle('role', val);
            }}
          >
            {CAREER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </SelectBox>
          {errors.role && <span className="field-err">{errors.role}</span>}
        </div>

        <div className={`field cf-full ${errors.portfolioUrl ? 'is-error' : ''}`}>
          <label htmlFor={`${uid}-url`}>Portfolio / LinkedIn URL</label>
          <input
            id={`${uid}-url`}
            type="url"
            className="input"
            value={form.portfolioUrl}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, portfolioUrl: val });
              if (errors.portfolioUrl) validateSingle('portfolioUrl', val);
            }}
            onBlur={(e) => validateSingle('portfolioUrl', e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
          />
          {errors.portfolioUrl && <span className="field-err">{errors.portfolioUrl}</span>}
        </div>

        <div className={`field cf-full ${errors.note ? 'is-error' : ''}`}>
          <div className="cf-label-row">
            <label htmlFor={`${uid}-note`}>Short note</label>
            <span className="cf-char-count">{form.note.length}/500</span>
          </div>
          <textarea
            id={`${uid}-note`}
            className="textarea"
            maxLength={500}
            value={form.note}
            onChange={(e) => {
              const val = e.target.value.slice(0, 500);
              setForm({ ...form, note: val });
              if (errors.note) validateSingle('note', val);
            }}
            placeholder="Tell us about your strengths, recent work or why you want to join AtLa/BTS."
          />
          {errors.note && <span className="field-err">{errors.note}</span>}
        </div>
      </div>

      <div className="field cf-consent">
        <label className={`check ${errors.consent ? 'is-error' : ''}`}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => {
              const checked = e.target.checked;
              setForm({ ...form, consent: checked });
              if (errors.consent) validateSingle('consent', checked);
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

      {serverError && (
        <div className="cf-error" role="alert">
          {serverError}
        </div>
      )}

      <button type="submit" className="btn btn-primary cf-submit" disabled={submitting}>
        {submitting ? 'Submitting application…' : 'Submit application →'}
      </button>
    </form>
  );
}
