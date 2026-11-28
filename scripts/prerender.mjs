import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const ssrEntry = path.join(rootDir, 'dist-ssr', 'entry-server.js');

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/service-cocktail',
  '/packages',
  '/academy',
  '/contact',
  '/get-started',
  '/team',
  '/privacy',
  '/terms',
];

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Preserve an un-prerendered client shell for /admin routes
const adminHtml = template.replace(
  '</head>',
  '  <meta name="robots" content="noindex,nofollow" />\n  </head>'
);
fs.writeFileSync(path.join(distDir, 'admin.html'), adminHtml, 'utf8');

const { render } = await import(ssrEntry);

function injectRouteHtml(route, html, helmet) {
  const headTags = [
    helmet?.title?.toString() || '',
    helmet?.meta?.toString() || '',
    helmet?.link?.toString() || '',
    helmet?.script?.toString() || '',
  ]
    .filter(Boolean)
    .join('\n    ');

  let doc = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/i, '')
    .replace('</head>', `    ${headTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  if (route === '/404') {
    fs.writeFileSync(path.join(distDir, '404.html'), doc, 'utf8');
    return;
  }

  if (route === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), doc, 'utf8');
    return;
  }

  const routeDir = path.join(distDir, route.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), doc, 'utf8');
}

for (const route of [...PUBLIC_ROUTES, '/404']) {
  const { appHtml, helmet } = render(route);
  injectRouteHtml(route, appHtml, helmet);
  console.log(`Pre-rendered ${route}`);
}

