import { MENU } from './cocktailMenu.js';

export const PKG_THEME = [
  { c: '#14b8a6', e: 'seed' },    // Good — turquoise
  { c: '#3b82f6', e: 'rocket' },  // Great — blue
  { c: '#8b5cf6', e: 'diamond' }, // Fantastic — violet
  { c: '#d4a017', e: 'crown' },   // Super — gold
];

export const PKGS = [
  {
    id: 'good',
    name: 'Good',
    tier: 'Level 01 · Foundation',
    color: '#14b8a6',
    icon: 'seed',
    motto: 'Get seen. Get trusted.',
    vision: 'For businesses ready to look as good online as they are offline.',
    inc: ['smm', 'seo', 'orm', 'bi'],
    lines: [
      ['Social media management', '12 posts + 4 Reels a month on 2 platforms, so you stay visible every week.'],
      ['SEO + AEO foundation', 'Google-ready pages, schema and an optimised Business Profile so customers can find you.'],
      ['Reputation management', 'Review generation and response so new customers choose you with confidence.'],
      ['Monthly analytics dashboard', "Plain-English insight into what's working."],
      ['Monthly strategy call', 'A growth expert in your corner.'],
    ],
  },
  {
    id: 'great',
    name: 'Great',
    tier: 'Level 02 · Growth',
    color: '#3b82f6',
    icon: 'rocket',
    motto: 'Get found. Get leads.',
    vision: 'For businesses that want a predictable flow of qualified leads.',
    inc: ['smm', 'seo', 'orm', 'bi', 'content', 'perf', 'crm'],
    lines: [
      ['Everything in Good', 'Your foundation, kept strong.'],
      ['Content & Reels production', '12 professionally produced Reels a month, built to reach new audiences.'],
      ['Performance ads management', 'Meta, Google & LinkedIn campaigns optimised weekly for cost per lead.'],
      ['CRM & lead automation', 'Every lead captured, scored and followed up on WhatsApp automatically.'],
      ['Conversion landing pages', 'Campaign pages that turn clicks into enquiries.'],
      ['Fortnightly performance reviews', 'Faster decisions and faster growth.'],
    ],
  },
  {
    id: 'fantastic',
    name: 'Fantastic',
    tier: 'Level 03 · Acceleration',
    color: '#8b5cf6',
    icon: 'diamond',
    motto: 'Get chosen.',
    vision: 'For brands ready to become the first name people think of in their market.',
    inc: ['smm', 'seo', 'orm', 'bi', 'content', 'perf', 'crm', 'web', 'agent', 'brand', 'influ'],
    lines: [
      ['Everything in Great', 'Your lead engine, running at full speed.'],
      ['Premium website build & care', 'A fast, conversion-first site built for Google and AI answer engines.'],
      ['GEO: Generative Engine Optimisation', 'Your brand recommended by ChatGPT, Gemini & Perplexity.'],
      ['24×7 AI chat agent', 'Website & WhatsApp leads answered, qualified and booked at any hour.'],
      ['Brand strategy & identity refresh', "Positioning that lets you charge what you're worth."],
      ['Monthly influencer campaign', 'Vetted creators who match your audience, managed end-to-end.'],
      ['Dedicated account strategist', 'One person who knows your business inside out.'],
    ],
  },
  {
    id: 'super',
    name: 'Super',
    tier: 'Level 04 · Transformation',
    color: '#d4a017',
    icon: 'crown',
    motto: 'Become the category.',
    vision: 'For leaders who want one transformation partner across brand, marketing, AI, platforms and people.',
    inc: MENU.map((m) => m.id),
    lines: [
      ['Everything in Fantastic', 'Your entire growth engine, fully fuelled.'],
      ['A storefront that sells 24×7', 'E-commerce store, marketplaces and WhatsApp commerce, connected to your inventory and CRM.'],
      ['Your brand, everywhere that matters', "SEO + AEO + GEO so you're the answer on Google, in AI Overviews and when buyers ask ChatGPT, Gemini or Perplexity."],
      ['An AI workforce that never sleeps', 'Chat & voice agents plus end-to-end workflow automation, so your team stops doing repetitive work.'],
      ['Your business on one platform', 'Custom CRM / ERP modules built and rolled out every quarter, so the spreadsheets go.'],
      ['Decisions at the speed of data', 'Live CXO dashboards across sales, marketing and operations.'],
      ['A founder the industry follows', 'Personal branding, ghostwritten thought leadership and speaking placements.'],
      ['Headlines, not just posts', 'PR features, partnerships, awards and premium brand placement.'],
      ['A fractional CMO at your table', 'Senior strategy leadership with quarterly board-style reviews.'],
      ['A team that thinks in AI', 'ATLA Academy training for your staff every quarter.'],
      ['Creators on your side', 'An always-on influencer & ambassador programme.'],
      ['A dedicated growth pod', 'Strategist, creative, performance, developer & AI engineer, working in weekly sprints.'],
    ],
  },
];

