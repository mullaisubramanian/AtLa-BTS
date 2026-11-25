export const BUSINESS_STAGES = [
  { value: 'startup', label: 'Startup' },
  { value: 'growing_sme', label: 'Growing SME' },
  { value: 'established', label: 'Established business / Enterprise' },
  { value: 'institution', label: 'Institution / Hospital' },
  { value: 'individual', label: 'Individual / Founder' },
];

export const BUDGET_RANGES = [
  { value: 'under_35k', label: 'Under ₹35,000' },
  { value: '35k_65k', label: '₹35,000 – ₹65,000' },
  { value: '65k_1l', label: '₹65,000 – ₹1,00,000' },
  { value: '1l_1_5l', label: '₹1,00,000 – ₹1,50,000' },
  { value: 'above_1_5l', label: '₹1,50,000+' },
  { value: 'project_based', label: 'Project-based (one-time)' },
  { value: 'not_sure', label: 'Not sure yet' },
];

export function budgetForAmount(amount) {
  if (!amount || Number.isNaN(Number(amount))) return 'not_sure';
  const n = Number(amount);
  if (n < 35000) return 'under_35k';
  if (n <= 65000) return '35k_65k';
  if (n <= 100000) return '65k_1l';
  if (n <= 150000) return '1l_1_5l';
  return 'above_1_5l';
}

export const LEAD_SOURCES = [
  { value: 'contact_form', label: 'Contact form', color: '#0fb5ad' },
  { value: 'get_started', label: 'Get Started', color: '#10b981' },
  { value: 'cocktail_serve', label: 'Cocktail Serve', color: '#f97316' },
  { value: 'cocktail_negotiate', label: 'Cocktail Negotiate', color: '#fb923c' },
  { value: 'package_negotiate', label: 'Package Negotiate', color: '#8b5cf6' },
  { value: 'ask_atla', label: 'Ask ATLA', color: '#06b6d4' },
  { value: 'practice_enquiry', label: 'Practice Enquiry', color: '#6366f1' },
  { value: 'website_quote', label: 'Website Quote', color: '#f59e0b' },
  { value: 'academy', label: 'ATLA Academy', color: '#a78bfa' },
];

export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: '#0fb5ad' },
  { value: 'contacted', label: 'Contacted', color: '#0ea5e9' },
  { value: 'qualified', label: 'Qualified', color: '#6366f1' },
  { value: 'proposal_sent', label: 'Proposal sent', color: '#f59e0b' },
  { value: 'negotiating', label: 'Negotiating', color: '#f97316' },
  { value: 'won', label: 'Won', color: '#10b981' },
  { value: 'lost', label: 'Lost', color: '#64748b' },
  { value: 'spam', label: 'Spam', color: '#ef4444' },
];

export const ACADEMY_TRACKS = [
  'AI for Everyone',
  'AI for Marketers & Creators',
  'No-Code Automation & Agents',
  'Team & Leadership Programmes',
  'Future Skills Bootcamps',
  'Founder Growth Lab',
];

export const WIZARD_INDUSTRIES = [
  'Manufacturing',
  'Textiles & Apparel',
  'Healthcare',
  'Education',
  'Retail & D2C',
  'Real Estate',
  'Hospitality',
  'IT & SaaS',
  'Logistics',
  'Professional Services',
  'Finance & Insurance',
  'Startup',
  'Other',
];

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
export const REVENUE_RANGES = [
  '< 1 Cr',
  '1-10 Cr',
  '10-50 Cr',
  '50-100 Cr',
  '100 Cr+',
  'Prefer not to say',
];
export const YEARS_IN_BUSINESS = ['< 1', '1-3', '3-10', '10-25', '25+'];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Outside India',
];

export const MARKETING_CHANNELS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'YouTube',
  'Meta ads',
  'Google ads',
  'SEO',
  'Influencers',
  'WhatsApp broadcasts',
  'Offline only',
  'None',
];

export const MARKETING_SPEND = ['< ₹25k', '₹25k-1L', '₹1L-5L', '₹5L+', 'Not sure'];

export const PRIMARY_GOALS = [
  'More leads',
  'Sell online',
  'Build / refresh brand',
  'Automate operations',
  'Replace Excel / Tally with ERP',
  'Better customer experience',
  'Be found on Google & AI search',
  'Founder visibility',
  'Train my team on AI',
  'Enter new markets',
];

export const BIGGEST_CHALLENGES = [
  'Low enquiries',
  'Leads not converting',
  'No time for marketing',
  'Too much manual work',
  'Data scattered in sheets',
  'Weak online reputation',
  'Outdated website',
  'Hard to hire / train',
  'Competitors ahead online',
];

export const TARGET_LOCATIONS = [
  'Local city',
  'Tamil Nadu',
  'South India',
  'All India',
  'International',
];

export const TOOLS_USED = [
  'Excel / Google Sheets',
  'Tally',
  'Zoho',
  'SAP',
  'Odoo',
  'Shopify',
  'WooCommerce',
  'WhatsApp Business',
  'Custom software',
  'None',
];

export const IN_HOUSE_TEAM = ['None', '1 person', 'Small team', 'Full department'];
export const DECISION_TIMELINES = [
  'Immediately',
  'Within 1 month',
  '1-3 months',
  'Just exploring',
];

