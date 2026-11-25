const SESSION_KEY = 'atlabts_session_id';
const TRACKING_KEY = 'atlabts_first_touch';

export function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = window.localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function initTracking() {
  if (typeof window === 'undefined') return null;
  const existing = window.sessionStorage.getItem(TRACKING_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // fall through and re-capture
    }
  }
  const params = new URLSearchParams(window.location.search);
  const data = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    referrer: document.referrer || '',
    landing_page: window.location.pathname + window.location.search,
  };
  window.sessionStorage.setItem(TRACKING_KEY, JSON.stringify(data));
  return data;
}

export function getTracking() {
  const session_id = getSessionId();
  const touch = initTracking() || {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    referrer: '',
    landing_page: '/',
  };
  return {
    session_id,
    page_path:
      typeof window !== 'undefined' ? window.location.pathname : touch.landing_page,
    ...touch,
  };
}

