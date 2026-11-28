import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.atlabts.com';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const BASE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AtLa/BTS',
  url: SITE_URL,
  email: 'hello@atlabts.com',
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  areaServed: [
    { '@type': 'City', name: 'Coimbatore' },
    { '@type': 'State', name: 'Tamil Nadu' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: ['https://www.instagram.com/atla_bts/'],
};

export default function Seo({
  title,
  description,
  path = '/',
  breadcrumbs = null,
  extraSchema = null,
  noIndex = false,
}) {
  const normalizedPath = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;

  const schemas = [BASE_SCHEMA];

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: `${SITE_URL}${item.path === '/' ? '/' : item.path}`,
      })),
    });
  }

  if (Array.isArray(extraSchema)) {
    schemas.push(...extraSchema);
  } else if (extraSchema) {
    schemas.push(extraSchema);
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <link rel="canonical" href={canonicalUrl} />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AtLa/BTS" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {!noIndex && (
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      )}
    </Helmet>
  );
}
