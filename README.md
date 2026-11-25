# ATLABTS — ATLA Business Transformation System

React + Vite web application for **ATLABTS (ATLA Business Transformation System)**, connected to Supabase for dynamic catalogue pricing, server-side cocktail quotes, CRM lead capture, Ask ATLA logging, analytics events, the 5-step Get Started wizard, and a private `/admin` dashboard.

## Tech Stack

- **React 18** + **Vite 5** (JavaScript)
- **react-router-dom v6** (real URL routes)
- **@supabase/supabase-js** (catalogue, RPCs, Auth, Realtime, CRM)
- **recharts** (Admin insights charts)
- **react-helmet-async** (per-page SEO `<title>` and meta descriptions)
- **@fontsource/sora** & **@fontsource/plus-jakarta-sans** (self-hosted fonts)

## Setup & Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run lint     # Run ESLint
npm run build    # Production build to dist/
npm run preview  # Preview the production build locally
```

## Supabase Configuration

1. Run `reference/atlabts-supabase-schema.sql` and `atlabts-seed-data.sql` in your Supabase SQL Editor.
2. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` — Your Supabase project URL (`https://<project-ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`) — Your Supabase anon / publishable key (**never** put the service role key in browser env vars)
   - `VITE_CONTACT_EMAIL`, `VITE_WHATSAPP_NUMBER`, `VITE_WHATSAPP_DISPLAY`, `VITE_PHONE_TEL`, `VITE_STUDIO_LOCATION`, `VITE_BUSINESS_HOURS`

### Creating an Admin User

1. In Supabase Dashboard, go to **Authentication → Users → Add user** and create a user with your email and password.
2. Run in **SQL Editor**:
   ```sql
   insert into staff_profiles(id, full_name, role)
   select id, 'Your Name', 'admin' from auth.users where email = 'your@email.com';
   ```
3. Visit `/admin/login` to sign in to the private `/admin` console.

## Local Fallback Catalogue Data

`CatalogueContext` loads `practices`, `practice_sections`, `services`, `cocktail_items`, `packages`, `package_items`, and `package_benefits` from Supabase and caches them in `localStorage` for 1 hour. If Supabase is unavailable or empty, it falls back cleanly to `src/data/`:

- `src/data/practices.js` — All 11 practices, 57 sections, and 304 services (`PRACTICES`).
- `src/data/cocktailMenu.js` — The 18 Service Cocktail items (`MENU`).
- `src/data/packages.js` — The 4 monthly packages (`PKGS`: Good, Great, Fantastic, Super).
- `src/data/layers.js`, `src/data/industries.js`, `src/data/askAtla.js`, `src/data/options.js`.

## Deployment (Vercel / Netlify)

Set all `VITE_*` environment variables in your Vercel or Netlify project settings, then deploy `dist/`.

- **Vercel**: Add `vercel.json` at the project root so all routes (including `/get-started` and `/admin`) rewrite to `index.html`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Netlify**: `public/_redirects` is already included (`/* /index.html 200`).
