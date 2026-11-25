import { PRACTICES, ALL_SERVICES } from '../data/practices.js';
import { PKGS, PKG_THEME } from '../data/packages.js';
import { STOP, SYN, INTENT } from '../data/askAtla.js';
import { fmt } from './format.js';

export function expand(q) {
  const words = q
    .toLowerCase()
    .replace(/[^a-z0-9\s\-+]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  const terms = new Set();
  words.forEach((w) => {
    terms.add(w);
    if (w.endsWith('s')) terms.add(w.slice(0, -1));
    (SYN[w] || SYN[w.replace(/s$/, '')] || []).forEach((x) => terms.add(x));
  });
  return [...terms].filter((t) => t.length > 1);
}

export function search(q, servicesList = ALL_SERVICES) {
  const terms = expand(q);
  if (!terms.length) return [];
  return servicesList
    .map((a) => {
      const n = a.n.toLowerCase();
      const d = `${a.d} ${a.seg} ${a.p.title}`.toLowerCase();
      let sc = 0;
      terms.forEach((t) => {
        if (n.includes(t)) sc += 3;
        if (d.includes(t)) sc += 1;
      });
      return { ...a, sc };
    })
    .filter((a) => a.sc > 0)
    .sort((x, y) => y.sc - x.sc);
}

const b = (text) => ({ text, bold: true });

export function compose(q, catalogue = {}) {
  const practices = catalogue.practices || PRACTICES;
  const allServices = catalogue.allServices || ALL_SERVICES;
  const packages = catalogue.packages || PKGS;

  const trimmed = q.trim();
  if (INTENT.hello.test(trimmed) && trimmed.split(/\s+/).length < 4) {
    return {
      intent: 'hello',
      matchedPracticeId: null,
      matchedServices: [],
      p: [
        [
          "Vanakkam! I'm ATLA AI. Tell me about your business and what you'd like to improve, for example more leads, an online store, automation or a stronger brand, and I'll show you the right services.",
        ],
      ],
      pages: ['services', 'cocktail', 'packages', 'contact'],
    };
  }

  if (INTENT.about.test(q)) {
    return {
      intent: 'about',
      matchedPracticeId: null,
      matchedServices: [],
      p: [
        [
          b('ATLABTS'),
          ' is the ',
          b('ATLA Business Transformation System'),
          ': one partner for growth, brand, websites, AI and technology.',
        ],
        [
          `We run a connected six-layer system (Strategy, Brand, Demand, Operations, Intelligence and People) through a repeatable 5D rhythm: Diagnose, Design, Deploy, Drive, Develop. That covers ${practices.length} practices and ${allServices.length} services.`,
        ],
      ],
      list: practices.slice(0, 6).map((p) => ({
        c: p.c,
        ic: p.id,
        top: 'Practice',
        n: p.title,
        d: p.tag,
        act: ['open', p.id],
        go: 'Explore',
      })),
      pages: ['about', 'services', 'packages', 'contact'],
    };
  }

  if (INTENT.price.test(q) && search(q.replace(INTENT.price, ''), allServices).length < 2) {
    return {
      intent: 'price',
      matchedPracticeId: null,
      matchedServices: [],
      p: [
        [
          'We offer four monthly growth packages. Each includes everything in the level below it, and every price is open to negotiation:',
        ],
      ],
      list: packages.map((p, i) => ({
        c: p.color || PKG_THEME[i]?.c || '#14b8a6',
        ic: p.icon || PKG_THEME[i]?.e || 'seed',
        top: p.tier,
        n: `${p.name}: ${fmt(p.price)}/month`,
        d: `${p.motto} ${p.vision}`,
        act: ['go', '/packages'],
        go: 'View',
      })),
      after: [
        [
          'Prefer to choose services yourself? Mix them in the ',
          b('Service Cocktail'),
          ' and tap Calculate.',
        ],
      ],
      pages: ['negotiate', 'packages', 'cocktail', 'contact'],
    };
  }

  if (INTENT.contact.test(q)) {
    return {
      intent: 'contact',
      matchedPracticeId: null,
      matchedServices: [],
      p: [
        [
          'Happy to connect you with a strategist. Share your details on the ',
          b('Talk to us'),
          ' page. We reply within one business day, and your first call includes a free mini audit.',
        ],
      ],
      pages: ['contact', 'packages'],
    };
  }

  const r = search(q, allServices);
  if (!r.length) {
    return {
      intent: 'no_match',
      matchedPracticeId: null,
      matchedServices: [],
      p: [
        [
          'I couldn\'t find an exact match for "',
          b(q),
          '", but there\'s a good chance it\'s something we handle.',
        ],
        [
          'Try describing the outcome you want, like "more enquiries", "sell online" or "automate follow-ups". Or browse below.',
        ],
      ],
      pages: ['services', 'cocktail', 'packages', 'contact'],
    };
  }

  const byP = {};
  r.slice(0, 25).forEach((a) => {
    byP[a.p.id] = (byP[a.p.id] || 0) + a.sc;
  });
  const ranked = Object.entries(byP)
    .sort((a, b) => b[1] - a[1])
    .map((e) => practices.find((p) => p.id === e[0]))
    .filter(Boolean);
  const main = ranked[0];
  const second = ranked[1];

  const picks = [];
  const seen = new Set();
  r.forEach((a) => {
    if (picks.length < 5 && !seen.has(a.n)) {
      seen.add(a.n);
      picks.push(a);
    }
  });

  const pages = ['cocktail', 'packages', 'contact'];
  if (ranked.some((p) => p.id === 'academy')) pages.unshift('academy');

  return {
    intent: 'service_search',
    matchedPracticeId: main.id,
    matchedServices: picks.map((a) => a.n),
    p: [
      [
        'For "',
        b(q),
        '", the strongest fit is our ',
        b(main.title),
        ` practice. ${main.intro.split(/(?<=\.)\s/)[0]}`,
      ],
      ['Here are the most relevant services. Tap any one to see it in full:'],
    ],
    list: picks.map((a) => ({
      c: a.p.c,
      ic: a.p.id,
      top: `${a.p.title} · ${a.seg.split(' (')[0]}`,
      n: a.n,
      d: a.d,
      act: ['open', a.p.id, a.seg],
      go: 'View',
    })),
    practices: ranked.slice(0, 3),
    after:
      second && second.id !== main.id
        ? [['For the full effect, pair it with ', b(second.title), `. ${second.tag}`]]
        : [],
    pages,
  };
}

export function getAtlaAnswer(question, catalogue) {
  return compose(question, catalogue);
}
