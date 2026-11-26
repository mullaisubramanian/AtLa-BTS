export const SITE_CONFIG = {
  brand: 'AtLa/BTS',
  subtitle: 'Business Transformation System',
  fullName: 'AtLa/BTS',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'hello@atlabts.com',
  studioLocation: import.meta.env.VITE_STUDIO_LOCATION?.trim() || 'Coimbatore, Tamil Nadu, India',
  hours: import.meta.env.VITE_BUSINESS_HOURS?.trim() || 'Mon–Sat · 9:30 AM – 7:00 PM IST',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL?.trim() || '',
  instagramHandle: '@atla_bts',
  instagramUrl:
    import.meta.env.VITE_INSTAGRAM_URL?.trim() || 'https://www.instagram.com/atla_bts/',
};
