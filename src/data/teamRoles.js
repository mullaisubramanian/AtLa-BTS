export const TEAM_ROLES = [
  'Influencer Community',
  'Digital Marketing',
  'Content & Design',
  'Web/App Development',
  'AI Automation',
  'Sales & Partnerships',
  'Academy Trainer',
  'Internship',
  'Other',
];

export const FOLLOWER_COUNTS = [
  '<1K',
  '1K–10K',
  '10K–50K',
  '50K–100K',
  '100K–500K',
  '500K+',
];

export const INFLUENCER_NICHES = [
  'Fashion',
  'Food',
  'Tech',
  'Education',
  'Lifestyle',
  'Travel',
  'Fitness',
  'Other',
];

export const ROLE_QUESTIONS = {
  'Influencer Community': [
    {
      key: 'instagram_profile',
      label: 'Instagram profile link',
      type: 'url',
      required: true,
      placeholder: 'https://instagram.com/yourhandle',
      isPortfolioCandidate: true,
    },
    {
      key: 'follower_count',
      label: 'Follower count',
      type: 'select',
      required: true,
      options: FOLLOWER_COUNTS,
    },
    {
      key: 'niche',
      label: 'Niche',
      type: 'select',
      required: true,
      options: INFLUENCER_NICHES,
    },
    {
      key: 'avg_reel_views',
      label: 'Average reel views',
      type: 'number',
      required: false,
      placeholder: 'e.g. 12000',
    },
    {
      key: 'other_platforms',
      label: 'Other platforms (YouTube link)',
      type: 'url',
      required: false,
      placeholder: 'https://youtube.com/@yourchannel',
    },
    {
      key: 'paid_collaborations',
      label: 'Open to paid collaborations?',
      type: 'radio',
      required: false,
      options: ['Yes', 'No'],
    },
  ],
  'Digital Marketing': [
    {
      key: 'years_experience',
      label: 'Years of experience',
      type: 'text',
      required: true,
      placeholder: 'e.g. 3 years',
    },
    {
      key: 'platforms',
      label: 'Platforms you manage',
      type: 'checkbox-group',
      required: false,
      options: ['Meta Ads', 'Google Ads', 'LinkedIn', 'SEO', 'Email'],
    },
    {
      key: 'best_campaign_result',
      label: 'Best campaign result',
      type: 'text',
      required: false,
      placeholder: 'e.g. 4.2x ROAS for a D2C skincare launch',
    },
  ],
  'Content & Design': [
    {
      key: 'portfolio_link',
      label: 'Portfolio link (Behance / Drive / Instagram)',
      type: 'url',
      required: true,
      placeholder: 'https://behance.net/yourportfolio',
      isPortfolioCandidate: true,
    },
    {
      key: 'tools',
      label: 'Tools',
      type: 'checkbox-group',
      required: false,
      options: ['Figma', 'Canva', 'Photoshop', 'Premiere Pro', 'After Effects', 'AI video tools'],
    },
    {
      key: 'reels_link',
      label: 'Reels you have made',
      type: 'url',
      required: false,
      placeholder: 'https://instagram.com/reel/...',
    },
  ],
  'Web/App Development': [
    {
      key: 'github_portfolio',
      label: 'GitHub or portfolio link',
      type: 'url',
      required: true,
      placeholder: 'https://github.com/yourhandle',
      isPortfolioCandidate: true,
    },
    {
      key: 'stack',
      label: 'Stack',
      type: 'checkbox-group',
      required: false,
      options: ['React', 'Node', 'Python', 'Supabase', 'Flutter', 'WordPress', 'Shopify'],
    },
    {
      key: 'years_experience',
      label: 'Years of experience',
      type: 'text',
      required: true,
      placeholder: 'e.g. 2.5 years',
    },
  ],
  'AI Automation': [
    {
      key: 'tools',
      label: 'Tools you use',
      type: 'checkbox-group',
      required: false,
      options: ['n8n', 'Make', 'Zapier', 'OpenAI/Claude APIs', 'LangChain', 'Python'],
    },
    {
      key: 'best_automation',
      label: 'Best automation you built',
      type: 'text',
      required: true,
      placeholder: 'e.g. WhatsApp lead qualifier synced to Zoho CRM',
    },
  ],
  'Sales & Partnerships': [
    {
      key: 'years_b2b_sales',
      label: 'Years in B2B sales',
      type: 'text',
      required: true,
      placeholder: 'e.g. 4 years',
    },
    {
      key: 'industries',
      label: 'Industries you have sold to',
      type: 'text',
      required: false,
      placeholder: 'e.g. SaaS, D2C, Healthcare, Manufacturing',
    },
    {
      key: 'linkedin_profile',
      label: 'LinkedIn profile',
      type: 'url',
      required: true,
      placeholder: 'https://linkedin.com/in/yourprofile',
      isPortfolioCandidate: true,
    },
  ],
  'Academy Trainer': [
    {
      key: 'subjects',
      label: 'Subjects you can teach',
      type: 'text',
      required: true,
      placeholder: 'e.g. AI productivity, Performance Marketing, No-code',
    },
    {
      key: 'training_experience_years',
      label: 'Training experience (years)',
      type: 'text',
      required: true,
      placeholder: 'e.g. 3 years',
    },
    {
      key: 'sample_or_linkedin',
      label: 'Sample session or LinkedIn link',
      type: 'url',
      required: false,
      placeholder: 'https://linkedin.com/in/yourprofile',
      isPortfolioCandidate: true,
    },
  ],
  Internship: [
    {
      key: 'college_course',
      label: 'College & course',
      type: 'text',
      required: true,
      placeholder: 'e.g. B.Tech CSE, PSG Tech',
    },
    {
      key: 'year_of_study',
      label: 'Year of study',
      type: 'text',
      required: true,
      placeholder: 'e.g. Final year / 3rd year',
    },
    {
      key: 'area_of_interest',
      label: 'Area of interest',
      type: 'text',
      required: true,
      placeholder: 'e.g. Frontend Engineering, Content, AI Agents',
    },
    {
      key: 'available_from',
      label: 'Available from',
      type: 'date',
      required: false,
    },
  ],
  Other: [
    {
      key: 'contribution',
      label: 'Tell us how you would contribute',
      type: 'textarea',
      required: true,
      placeholder: 'Share what you love building or leading and how it fits AtLa/BTS.',
    },
  ],
};

export function formatAnswerLabel(key) {
  for (const questions of Object.values(ROLE_QUESTIONS)) {
    const found = questions.find((q) => q.key === key);
    if (found) return found.label;
  }
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

