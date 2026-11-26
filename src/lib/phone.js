/**
 * Helpers for +91 phone inputs where "+91" is displayed as a fixed prefix chip
 * and the input stores only the subscriber number (or an explicit +... number).
 */

export function stripDefaultIndiaCode(raw = '') {
  const trimmed = String(raw).trim();
  if (trimmed === '+91') return '';
  if (trimmed.startsWith('+91 ')) return trimmed.slice(4);
  if (trimmed.startsWith('+91')) return trimmed.slice(3);
  return raw;
}

export function formatPhoneForSubmit(raw = '') {
  const cleaned = String(raw).trim();
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return cleaned;
  return `+91 ${cleaned}`;
}

export function isValidTenDigitPhone(raw = '') {
  const digits = String(raw).replace(/\D/g, '');
  if (String(raw).trim().startsWith('+')) {
    return digits.length >= 10 && digits.length <= 15;
  }
  return /^[6-9]\d{9}$/.test(digits);
}

export function validatePhoneInput(raw = '', { required = true } = {}) {
  const cleaned = String(raw).trim();
  if (!cleaned) {
    return required ? 'Phone number is required' : '';
  }
  const full = formatPhoneForSubmit(cleaned);
  if (!/^[0-9+ ()-]{8,20}$/.test(full)) {
    return 'Enter a valid 10-digit mobile number';
  }
  const digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith('+')) {
    if (cleaned.startsWith('+91')) {
      const ten = digits.slice(-10);
      if (!/^[6-9]\d{9}$/.test(ten)) {
        return 'Enter a valid 10-digit Indian mobile number';
      }
      return '';
    }
    if (digits.length < 8) {
      return 'Enter a valid international phone number';
    }
    return '';
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return 'Enter a valid 10-digit mobile number';
  }
  return '';
}

