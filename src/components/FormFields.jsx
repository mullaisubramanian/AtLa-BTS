import { stripDefaultIndiaCode } from '../lib/phone';

/**
 * Shared accessible form controls matching src/styles/forms.css.
 */
export function SelectChevron() {
  return (
    <svg
      className="select-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SelectBox({ id, value, onChange, children, className = '', ...rest }) {
  return (
    <div className="select-wrap">
      <select
        id={id}
        className={`select ${className}`.trim()}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {children}
      </select>
      <SelectChevron />
    </div>
  );
}

export function PhoneInput({
  id,
  value,
  onChange,
  placeholder = '98765 43210',
  hasError = false,
  ...rest
}) {
  const displayVal = stripDefaultIndiaCode(value);
  return (
    <div className={`phone-wrap ${hasError ? 'is-error' : ''}`.trim()}>
      <span className="phone-chip" aria-hidden="true">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className="phone-input"
        value={displayVal}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

