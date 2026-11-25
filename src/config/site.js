const envWa = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export const SITE_CONFIG = {
  brand: 'ATLABTS',
  subtitle: 'Business Transformation System',
  fullName: 'ATLA Business Transformation System',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'hello@atlabts.com',
  whatsappNumber: envWa || '916379333379',
  whatsappDisplay: import.meta.env.VITE_WHATSAPP_DISPLAY?.trim() || '+91 63793 33379',
  phoneTel: import.meta.env.VITE_PHONE_TEL?.trim() || '+916379333379',
  studioLocation: import.meta.env.VITE_STUDIO_LOCATION?.trim() || 'Coimbatore, Tamil Nadu, India',
  hours: import.meta.env.VITE_BUSINESS_HOURS?.trim() || 'Mon–Sat · 9:30 AM – 7:00 PM IST',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL?.trim() || '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL?.trim() || '',
};

export function waLink(message = '') {
  const num = (SITE_CONFIG.whatsappNumber || '').replace(/\D/g, '') || '916379333379';
  if (message) {
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${num}`;
}
