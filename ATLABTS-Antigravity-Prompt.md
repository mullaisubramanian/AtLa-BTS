# ATLABTS Website: Antigravity Build Prompt

> **How to use this**
> 1. Create an empty folder, e.g. `atlabts-web`, and open it in Antigravity.
> 2. Copy these two files into that folder:
>    - `reference/atlabts-website.html` (the finished single-file website, used as the design and behaviour reference)
>    - `reference/atlabts-logo.png` (the logo)
> 3. Paste everything below the line into the Antigravity agent as one message.

---

## PROMPT (paste from here)

You are a senior front-end engineer. Rebuild my company website **ATLABTS (ATLA Business Transformation System)** as a production-grade **npm project using React + Vite in JavaScript (not TypeScript)**.

A complete, working single-file prototype is in `reference/atlabts-website.html`. It is the **source of truth** for the design, copy, data and behaviour. **Read the whole file before writing any code.** The new site must look and behave **identically**, but be properly structured into components, pages, data modules and stylesheets. Do not ship the reference HTML file, and do not paste raw HTML strings into the app (no `innerHTML` / `dangerouslySetInnerHTML`). Everything must be React components written in JSX.

### 1. Tech stack (use exactly this)
- **Vite + React 18, JavaScript (.jsx)**: `npm create vite@latest . -- --template react`
- **react-router-dom v6** for pages (real URLs, not hash routes)
- **CSS**: one global `src/styles/tokens.css` with the design variables, plus one `.css` file per component, imported in that component. No Tailwind, and no UI kit.
- **Fonts**: `@fontsource/sora` (400/600/700/800) and `@fontsource/plus-jakarta-sans` (400/500/600/700). No Google Fonts link.
- **Icons**: a single `src/components/Icon.jsx` that renders the line-icon SVG paths. Copy every path from the `ICON` object in the reference file. Do not add an icon library, and **use no emojis anywhere**.
- **SEO**: `react-helmet-async` for per-page `<title>` and meta description.
- No backend for now. Add an ESLint config, and keep `npm run dev`, `npm run build` and `npm run preview` working.

### 2. Folder structure
```
src/
  main.jsx, App.jsx            # router + layout
  styles/tokens.css            # colours, shadows, radii, fonts, keyframes
  data/
    practices.js               # PRACTICES (11 practices, ~300 services) — copy verbatim
    cocktailMenu.js            # MENU (18 items with id, name, monthly price, colour)
    packages.js                # PKGS + PKG_THEME (Good/Great/Fantastic/Super)
    layers.js                  # LAYERS (6 system layers)
    industries.js, askAtla.js  # IND list; SYN, STOP, INTENT, SUGG, PAGES for Ask ATLA
  lib/
    format.js                  # fmt(): ₹ with en-IN grouping
    search.js                  # expand(), search(), compose() for Ask ATLA
  components/
    Layout/ (Header, MobileMenu, Footer, FloatingTalkButton, BackgroundBlobs, Toast)
    Icon.jsx, Logo.jsx, Eyebrow.jsx, Button.jsx
    FlipCard.jsx               # reusable 3D flip card
    PracticeModal.jsx          # practice detail popup (tabs + scroll-spy)
    AskAtla/ (OrbitStage, Composer, AskModal, ChatMessage, ResultCard, PageTile)
    home/ (Hero, CommandCenterDashboard, SystemLayers, WhoWeServe, WebShowcase,
           PracticesGrid, FiveDLoop, FutureOfSearch, WhyUs, CtaBand)
    cocktail/ (MenuChip, CocktailGlass, Bill)
  pages/
    Home.jsx, About.jsx, Services.jsx, Cocktail.jsx, Packages.jsx, Academy.jsx, Contact.jsx, NotFound.jsx
  context/ (ModalContext for PracticeModal + AskModal; ContactPrefillContext)
public/
  logo.png  (copy from reference/atlabts-logo.png), favicon from the same logo
```

### 3. Routes
`/` Home · `/about` · `/services` · `/service-cocktail` · `/packages` · `/academy` · `/contact`. Scroll to the top on every route change. The active nav link uses the inset (pressed) neumorphic style.

### 4. Design system (copy exactly from the reference `:root` and CSS)
- Colours: `--bg #e7f3f2`, `--tq #0fb5ad`, `--tq2 #19d3c5`, `--deep #08514d`, `--ink #0d2a30`, `--muted #557077`; brand teal from the logo is `#018087`.
- **Neumorphism**: `--neu`, `--neu-sm`, `--neu-in` (raised, small and inset shadows on `--bg`).
- **Glassmorphism**: `rgba(255,255,255,.5)` background, a white translucent border and `backdrop-filter: blur(18px) saturate(140%)`.
- Headings use Sora; body text uses Plus Jakarta Sans.
- Fixed, animated, blurred background blobs (turquoise, aqua, mint, lavender).
- Recreate every keyframe from the reference: `drift, fadeUp, popIn, popIn2, bob, grow, twinkle, spin, pop, tp, rise, pulse`.
- Respect `prefers-reduced-motion`: stop the orbit, rotating words and blob drift when it is set.
- Fully responsive, with breakpoints at 1150px, 960px, 700px and 600px exactly as in the reference. **Test at 390px width (mobile) and at 1400px.**

### 5. Global layout
- **Header**: a sticky glass pill showing the logo tile, then "ATLABTS" with the subtitle "Business Transformation System". Nav: Home, About, Services, Service Cocktail, Packages, Academy, Contact. A "Talk to us" primary button sits at the right. Below 960px it becomes a burger button with a glass dropdown menu.
- **Footer**: a glass panel with brand blurb, a Practices list (each opens its PracticeModal), Explore links and Connect links, plus a copyright line with the current year.
- **Floating round "Talk to us" button** at the bottom right, with a pulse animation.
- **Logo**: use `/logo.png` in the header, footer, Ask ATLA composer, Ask ATLA chat avatar and favicon.

### 6. Home page (sections in this exact order)
1. **Hero**: a dark, immersive rounded panel with a grid overlay and twinkling stars.
   - Eyebrow: "ATLA Business Transformation System".
   - H1: "Build a business that **[rotating word]**". The word cycles every 2.4 s through `grows. automates. sells. scales. leads. lasts.`, with a blur and fade transition.
   - Lead paragraph and two CTAs: "Explore 300+ services" goes to `/services`; "Mix a Service Cocktail" goes to `/service-cocktail`.
   - Audience pills.
   - Right side: a tilted 3D glass **"ATLA Command Center"** dashboard, labelled "Sample client view". It shows 3 KPIs, animated growing bars and a CRM pipeline.
   - The dashboard tilts with mouse parallax. Four floating glass cards sit around it: AI Agent · WhatsApp (with typing dots), Recommended by AI, ERP synced and Influencer Connect.
   - Bottom stats row of 4 tiles. The service count is computed from the data, not hard-coded.
2. **Ask ATLA** (see §10): an orbit of services circling a Claude/ChatGPT-style composer.
3. **The ATLA Business Transformation System**: "Not a list of services. A system for growth."
   - An isometric stack of 6 coloured slabs (SVG) beside 6 layer cards: Strategy, Brand, Demand, Operations, Intelligence and People.
   - Hovering a slab highlights its card, and hovering a card highlights its slab.
   - Clicking either one opens the linked PracticeModal.
   - Closes with a "How the layers compound" glass note.
4. **Who we serve**: 4 glass audience cards (Startups, Growing SMEs, Established businesses, Institutions & healthcare) plus a 12-industry icon grid.
5. **Websites & E-commerce showcase**:
   - Text column with 6 feature tiles and two buttons: open the `web` practice modal, and "Get a website quote", which goes to Contact with that interest pre-ticked.
   - A glass browser mockup of an orange online store with a floating "New order received" toast.
6. **Practices grid**: "Eleven practices. One transformation." Mini glass cards, each opening its PracticeModal.
7. **5D operating rhythm**: an animated SVG circle (Diagnose, Design, Deploy, Drive, Develop) and 5 step cards.
8. **The Future of Search**: SEO / AEO / GEO cards, with the GEO card filled.
9. **Why ATLABTS**: 6 neumorphic cards with line icons.
10. **CTA band**: "Book my free call" goes to `/contact`.

### 7. About page
- Hero with vision and mission glass cards and the "Today → Transformed" bar-chart SVG.
- **"Why 'System'"** section: "A systematic approach to business growth", with 4 principles (Connected, Repeatable, Measurable, Self-improving). A button links to `/#system`, which scrolls to the system section.
- ATLA values: A, T, L, A, +.
- 5-step "How we work" timeline.

### 8. Services page
- A search box filters across **all** services: name, impact, section and practice. The results grid replaces the cards while there is a query. Clicking a result opens that practice's modal at that section.
- **11 flip cards**, one per practice, each in the practice colour:
  - **Front**: a coloured gradient band with a dot pattern, rotating dashed ring, large faint watermark icon, glass icon tile, "01 / 11" number, "N services" pill, two floating featured-service pills, and a shine sweep on hover. Below the band: title, tagline, section chips ("+N more") and a "Tap to flip & preview" round button.
  - **Back**: a coloured header "What you get", 4 key services with their impact line, and an "Explore all N services →" button that opens PracticeModal.
- **PracticeModal** (shared component):
  - A glass and neumorphic popup over a blurred backdrop.
  - Header with icon, title and service count.
  - **Horizontally scrollable section tabs with scroll-spy.**
  - Intro paragraph, then "Ideal for" and "Outcomes we track" glass boxes.
  - Each section lists its services as neumorphic cards: number badge, name, and "Impact → …" line.
  - Footer buttons: "Mix in a Service Cocktail" and "Talk to us about this" (goes to Contact with the practice pre-ticked).
  - Closes on Esc, the × button or a backdrop click, and locks body scroll while open.

### 9. Service Cocktail page (behaviour must match exactly)
- Two columns of 18 menu chips (9 and 9) around a centred **glass tumbler** with a straw and lime.
- **Chips show NO prices**, only a ＋ icon that becomes ✓ when the service is added.
- Add services by **drag-and-drop into the glass (desktop) or tap (mobile)**. Each added service fills the glass with a coloured liquid layer that animates its height, with rising bubbles. The fill level caps at 84%.
- **Bill panel**:
  - "Your cocktail" heading, "N services in your glass", and removable chips for the selected services.
  - A **"Calculate my cocktail"** primary button, disabled while the glass is empty.
  - **Before Calculate**: no price and no action buttons are visible.
  - **After Calculate**:
    - The button hides, and a turquoise price card animates in, counting up to the total: "Your cocktail costs ₹X per month · GST extra".
    - The package tip appears (logic below).
    - An action row appears: **"Clear cocktail"** and **"Serve it to me →"**, with **"Let's negotiate →"** full-width beneath them.
  - **If any service is added or removed after calculating**: hide the price, tip and action row, and change the button to "Recalculate my cocktail".
- **Package tip logic**: find the cheapest package whose `inc` list contains every selected id.
  - If its price is below the total, show "Smarter pour: … You save ₹Y/month and also get N extra services (…)", with "See {pkg}" and "Let's negotiate" buttons.
  - Otherwise, if its price is at most 1.4 × the total and it adds services, show "Upgrade idea: for just ₹Z more …", with "Compare packages" and "Let's negotiate" buttons.
- **"Serve it to me"** goes to `/contact` with package = "Custom Service Cocktail" and the message pre-filled with the service list and estimate.
- **"Let's negotiate"** goes to `/contact`. The message begins "Let's negotiate my Service Cocktail:" and lists the services and calculated price. For the tip's button, it says "Let's negotiate the {pkg} package."
- Fine print under the bar, copied from the reference.

### 10. Ask ATLA (home section 2 + AskModal)
- **OrbitStage**: 18 random service names (12 on mobile) move continuously on an ellipse around the composer using `requestAnimationFrame`.
  - Back-half items are smaller and faded; front-half items are larger and in front.
  - Items fade when they pass behind or over the composer.
  - The orbit pauses on hover.
  - Clicking an item asks "Tell me about {service}".
- **Composer**: a glass card with the logo, "ATLA AI" and "Business growth assistant".
  - An auto-growing textarea. Enter sends; Shift+Enter adds a new line.
  - A round turquoise send button.
  - A horizontally scrollable row of suggestion chips (the SUGG list).
- **On submit, open AskModal** (glass and neumorphic popup, 88vh):
  - Header: logo, "ATLA AI", "New chat" and close buttons.
  - A thread with the user bubble on the right and the bot bubble with avatar on the left.
  - A follow-up composer at the bottom.
  - The bot first shows typing dots for 0.8 s, then types the first paragraph word by word with a caret, then reveals the remaining blocks one after another.
- **Answer engine**: port `expand / search / compose` from the reference **exactly**, including the STOP words, SYN synonyms and INTENT regexes (hello, about, price, contact). Do not call any external API.
- Every result is **clickable**:
  - **Service result cards**: practice icon, "PRACTICE · SECTION" label, service name, impact line and a "View →" pill. Clicking closes AskModal and opens PracticeModal at that section.
  - **Related practice tiles**: open PracticeModal.
  - **"Go to" page tiles** (Service Cocktail, Packages, Academy, About, Talk to us, Let's negotiate): navigate to that page. Contact and Negotiate pre-fill the message with `I asked ATLA AI: "{question}"`.
  - **Price intent**: lists the 4 packages as cards that link to `/packages`.
- After the reveal, scroll the thread so the start of the latest answer is visible. Esc, the × button or a backdrop click closes the modal.
- Keep `compose()` behind a single function, `getAtlaAnswer(question)`, so it can later be swapped for a real LLM API call.

### 11. Packages page
- 4 **flip cards** bottom-aligned in a row. The top tier card is taller. Each package has its own colour and line icon:
  - **Good**: turquoise `#14b8a6`, seedling icon, ₹35,000/month
  - **Great**: blue `#3b82f6`, rocket icon, ₹65,000/month
  - **Fantastic**: violet `#8b5cf6`, diamond icon, ₹99,000/month
  - **Super**: **dark teal and gold**, crown icon, a gold "TOPMOST" strip, a gold gradient name and price and a gold ring, ₹1,50,000/month
- **Front**: a coloured hero band with tier pill, name, motto and price, plus the large icon. Below: an "N services · worth ₹X/month" pill (computed from MENU), the vision line, a 4-step level meter, and "Tap to see your future" with a round flip button. **No negotiate button on the front.**
- **Back** (only after flip): a coloured header (tier, name and price), the list of inclusions written as future outcomes, and **"Let's negotiate →"**. That button goes to `/contact` with the package selected and the message "Let's negotiate the {pkg} package."
- Fine print copied from the reference.

### 12. Academy page
6 neumorphic track cards (level label, title, bullet list, "You walk out:" outcome), then an "Enquire about a programme" button that goes to Contact with ATLA Academy pre-ticked.

### 13. Contact page
- **Left neumorphic panel**: WhatsApp, email, studio (Coimbatore, Tamil Nadu, India) and hours rows, plus a "Free with every first call" glass note.
- **Right glass form**: name*, company, phone*, email, business stage, monthly budget, "I'm interested in" toggle chips (one per practice), package select (4 packages, Custom Service Cocktail, One-time project) and a goals textarea.
- Pre-fill from `ContactPrefillContext` when arriving from Negotiate, Serve, Ask ATLA or a modal.
- On submit:
  - Validate the form.
  - Open a `mailto:` with all fields for now.
  - Show a toast and reset the form.
  - Put the contact details and email in `src/config/site.js`, using `VITE_` env variables where needed. Prepare a `submitLead()` function so a form backend (Formspree or our own API) can be added later.

### 14. Quality bar
- No emojis anywhere; line icons only.
- Every button and link must be keyboard accessible, with visible focus states and `aria-label`s on icon buttons. Modals trap focus and restore it when they close.
- No console errors. Lighthouse 90+ on Performance, Accessibility, Best Practices and SEO.
- Lazy-load the non-home pages with `React.lazy`.
- All copy, service names, impact lines, prices and package inclusions must match the reference **exactly**. Do not shorten or rewrite them.
- Write a `README.md` with setup steps, how to edit services, prices and packages in `src/data/`, and how to deploy (Vercel or Netlify, including a SPA redirect so routes work on refresh).

### 15. Working method
1. Read `reference/atlabts-website.html` completely, then show me a short plan of the components and data files.
2. Scaffold the project, install the dependencies and set up the tokens and layout.
3. Build the pages in this order: Home → Services (+PracticeModal) → Service Cocktail → Packages → Ask ATLA → About → Academy → Contact.
4. After each page, run the dev server, open it in the browser and compare it side by side with the reference file at 390px and 1400px widths. Fix any differences before moving on.
5. Finish with `npm run build` and `npm run preview`, then walk through the acceptance checklist below and confirm each item.

### 16. Acceptance checklist
- [ ] All 7 routes work, including refreshing any page.
- [ ] The rotating hero word, dashboard parallax and floating cards animate.
- [ ] The Ask ATLA orbit circles the composer; Enter opens the popup with typed answer, clickable service cards, related practices and page tiles.
- [ ] A service card in Ask ATLA opens the right practice modal at the right section.
- [ ] Services search works; flip cards flip; PracticeModal tabs scroll-spy.
- [ ] The cocktail shows no prices on chips. Calculate reveals the price, tip, Clear cocktail, Serve it to me and Let's negotiate. Any change hides them again.
- [ ] Packages show each colour correctly, and "Let's negotiate" appears only on the flipped back.
- [ ] Every negotiate and serve button lands on Contact with the correct pre-filled package and message.
- [ ] The logo appears in the header, footer, composer, chat avatar and favicon.
- [ ] Looks correct at 390px and 1400px; no emojis; no console errors.
