-- =====================================================================
--  ATLABTS — SEED DATA (generated from src/data/*.js)
--  11 practices · 57 sections · 304 services · 18 cocktail items · 4 packages
--  Run AFTER atlabts-supabase-schema.sql. Safe to run again (it refreshes everything).
-- =====================================================================
begin;

-- 1. PRACTICES
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('digital','Digital Growth & Experience','#0fb5ad','digital','Social, content, ads and retention working as one revenue engine.','Your digital presence should work as your best salesperson. We run social media, content, performance marketing, websites and customer retention as one connected system that turns attention into revenue, for brands launching today and for established names that need to stay relevant.',array['Startups','Growing SMEs','Established brands','Institutions','D2C & retail']::text[],array['Qualified leads','Cost per lead','Engagement rate','Website conversion','Repeat purchase']::text[],1,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('web','Websites & E-commerce','#f97316','web','Websites, online stores and marketplaces built to rank, convert and sell around the clock.','Your website is your hardest-working employee, and your online store is a shop that never closes. We design, build and run corporate websites, D2C stores, B2B ordering portals and marketplace channels. Each one is fast, mobile-first, ready for SEO and AI search, and connected to your payments, shipping, CRM and ERP.',array['Established businesses','D2C & retail brands','Manufacturers & wholesalers','Institutions & hospitals','Startups']::text[],array['Website conversion rate','Online revenue','Average order value','Cart abandonment','Page speed']::text[],2,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('search','AI Search & Visibility','#0d9488','search','SEO, AEO & GEO: be the answer on Google and in ChatGPT, Gemini & Perplexity.','Buyers no longer just search; they ask AI. We make sure your brand ranks on Google, gets quoted in AI Overviews and answer boxes, and is recommended by ChatGPT, Gemini, Perplexity and other AI assistants when your customers ask for the best option.',array['Established brands','B2B companies','Healthcare & education','E-commerce','Professional services']::text[],array['Organic traffic','Keyword rankings','AI answer mentions','Share of voice','Organic leads']::text[],3,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('ai','AI Automation','#06b6d4','ai','AI agents and workflows that work around the clock without adding headcount.','We find the repetitive, slow and error-prone work across sales, support, operations, finance and HR, and hand it to AI agents and automated workflows. Your people get time back for growth, customers and decisions. We connect it all to the tools you already use, from Tally and Zoho to SAP and Google Workspace.',array['Growing SMEs','Established enterprises','Manufacturing','Healthcare','Institutions']::text[],array['Hours saved','Response time','Cost per transaction','Error rate','Lead-to-sale speed']::text[],4,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('product','Products & Platforms','#10b981','product','SaaS, ERP, CRM, HRMS, apps and AI products that run and scale your business.','From a startup''s first SaaS product to an established company replacing spreadsheets and ageing software, we design, build and maintain the platforms your business runs on. Custom ERP, CRM, HRMS, portals, mobile apps and AI-powered products are built around how you actually work, not how off-the-shelf software assumes you do.',array['Established businesses','Manufacturers & distributors','Startups (SaaS)','Institutions & hospitals','Multi-branch businesses']::text[],array['Process cycle time','Data accuracy','User adoption','Cost savings','New digital revenue']::text[],5,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('brand','Brand Establishment','#6366f1','brand','Positioning, identity and placement that make you the obvious choice.','A strong brand lets you charge more, sell faster and hire better. For new businesses we build the brand from scratch. For established ones we refresh decades of goodwill for a new generation of buyers. Then we place the brand where your market will notice it.',array['Established businesses','Family businesses','Startups','Institutions','Product launches']::text[],array['Brand awareness','Price premium','Share of search','Brand recall','Enquiry quality']::text[],6,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('personal','Personal Branding','#f59e0b','personal','Turn founders, CXOs and experts into trusted voices in their industry.','People buy from people. We build the reputation of founders, CXOs, doctors, educators, consultants and professionals so their name opens doors, attracts deals and talent, and lifts the organisation behind them.',array['Founders & CXOs','Doctors & specialists','Educators & academics','Consultants & coaches','Second-generation business leaders']::text[],array['Profile reach','Inbound opportunities','Speaking invites','Media mentions','Follower quality']::text[],7,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('influencer','Influencer Connect','#fb7185','influencer','The right creators, managed end-to-end, measured by results.','We connect brands with creators whose audiences match their customers, then manage everything from briefs to contracts to payments to reporting, so influence turns into measurable growth. We also offer influencer management as a service for creators who want professional deal flow.',array['D2C & consumer brands','Institutions','Healthcare','Real estate & retail','Creators']::text[],array['Reach','Engagement rate','Cost per engagement','Promo-code sales','Content reuse value']::text[],8,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('data','Data & Intelligence','#0ea5e9','data','Dashboards, analytics and market intelligence for faster, better decisions.','Most businesses are rich in data and poor in insight. We bring your sales, marketing, operations and finance data together into live dashboards and predictive models, so leaders decide with facts instead of feel.',array['Established businesses','Leadership teams','Multi-branch operations','Institutions','Investors & boards']::text[],array['Decision speed','Forecast accuracy','Reporting hours saved','Margin improvement']::text[],9,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('consult','Transformation Consulting','#0284c7','consult','Strategy and leadership to redesign how your business runs and grows.','Before tools and tactics comes direction. We work alongside promoters and leadership teams, especially in established and family-run businesses, to redesign strategy, processes, structure and technology for the next decade of growth.',array['Established & family businesses','Growing SMEs','Institutions','Startups raising capital']::text[],array['Revenue growth','EBITDA margin','Process efficiency','Market share','Team productivity']::text[],10,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;
insert into practices (id,title,color,icon,tagline,intro,ideal_for,kpis,sort_order,is_active) values ('academy','ATLA Academy','#a78bfa','academy','Learn AI, digital growth and branding from the people who do it.','Transformation sticks when people grow too. ATLA Academy trains individuals, corporate teams, faculty, students and institutions in the skills we use every day: AI, automation, digital marketing and branding.',array['Corporate teams','Leaders','Students','Faculty & institutions','Professionals & creators']::text[],array['Skills certified','Productivity gain','AI adoption rate','Placement outcomes']::text[],11,true)
on conflict (id) do update set title=excluded.title,color=excluded.color,icon=excluded.icon,tagline=excluded.tagline,intro=excluded.intro,ideal_for=excluded.ideal_for,kpis=excluded.kpis,sort_order=excluded.sort_order,is_active=true;

-- 2. SECTIONS & SERVICES (cleared and re-inserted so this file can be re-run)
delete from services where practice_id in ('digital','web','search','ai','product','brand','personal','influencer','data','consult','academy');
delete from practice_sections where practice_id in ('digital','web','search','ai','product','brand','personal','influencer','data','consult','academy');

-- Digital Growth & Experience
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('digital','Social Media Management',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'digital', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Social media profile setup & optimisation','Profiles that look premium and convert visitors into followers and enquiries.',1),
  ('Social media profile maintenance','A consistently active, on-brand presence that earns trust before the first conversation.',2),
  ('Platform-specific strategy (Instagram, LinkedIn, YouTube, Facebook, X)','The right message on the right platform, without one-size-fits-all posting.',3),
  ('Monthly content calendar & campaign themes','Every post has a job to do, so your feed works as a sales funnel.',4),
  ('LinkedIn company page growth','B2B credibility that helps close deals and attract senior talent.',5),
  ('Community & DM management','No lead goes cold. Every comment and message gets a reply that builds the relationship.',6),
  ('Social listening & trend tracking','You hear what customers say about you and competitors before it becomes a trend.',7),
  ('Social commerce (Instagram & WhatsApp shops)','Customers buy straight from your feed with fewer steps and more sales.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('digital','Content Production Studio',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'digital', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Reels & YouTube Shorts production','Scroll-stopping video that multiplies organic reach for a fraction of ad costs.',1),
  ('YouTube long-form & video series','Builds deep trust and an asset that brings in leads for years.',2),
  ('Product & brand photography','Visuals that justify premium pricing.',3),
  ('Motion graphics & explainer videos','Complex offerings understood in 60 seconds, so sales cycles get shorter.',4),
  ('Carousels, infographics & creatives','Highly saveable, shareable content that positions you as the expert.',5),
  ('Corporate films & brand documentaries','Your story told in a way that moves investors, clients and recruits.',6),
  ('AI-generated visuals, avatars & voiceovers','Studio-quality content at a fraction of the time and cost.',7),
  ('Podcast production & distribution','A loyal audience that knows, likes and trusts your leadership.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('digital','Performance Marketing',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'digital', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Meta (Facebook & Instagram) ads','Budget goes where it returns, with every rupee traced to a lead or sale.',1),
  ('Google Search, Display & Performance Max','Capture buyers at the moment they search for what you sell.',2),
  ('YouTube video advertising','Mass awareness with measurable recall and retargeting pools.',3),
  ('LinkedIn B2B ads & lead-gen forms','Reach decision makers by title, industry and company size.',4),
  ('Lead generation campaigns','A predictable daily flow of enquiries your sales team can plan around.',5),
  ('E-commerce, catalogue & shopping ads','More sales from your product catalogue at a healthy ROAS.',6),
  ('Retargeting & lookalike audiences','Win back warm visitors and find more people who look like your best customers.',7),
  ('Conversion-rate optimisation (CRO) & A/B testing','More revenue from the same traffic. Results compound every month.',8),
  ('Attribution & budget modelling','Know which channel deserves the next rupee, with no guesswork.',9)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('digital','Lifecycle, Retention & CX',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'digital', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Email marketing & newsletters','A direct channel to customers that no algorithm can take away.',1),
  ('WhatsApp Business API campaigns','Open rates far above email, so offers and updates actually get seen.',2),
  ('SMS & RCS messaging','Instant reach for reminders, offers and alerts.',3),
  ('Marketing automation journeys','The right message reaches each customer at the right moment, automatically.',4),
  ('Loyalty, referral & membership programmes','Customers come back more often and bring their friends.',5),
  ('Win-back & re-engagement campaigns','Revenue recovered from customers you''d already lost.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('digital','Local, Reputation & Events',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'digital', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Google Business Profile management','Rank at the top of Maps for "near me" searches that turn into same-day customers.',1),
  ('Review generation & response','Strong ratings make choosing you the easy decision.',2),
  ('Online reputation & crisis management','Protect years of goodwill when something goes wrong online.',3),
  ('Local listings (Justdial, IndiaMART, directories)','Show up wherever local buyers look.',4),
  ('Product & brand launch campaigns','Make noise on day one across every channel.',5),
  ('Event marketing (pre, live & post)','Events trend online and keep bringing in leads afterwards.',6),
  ('Webinars & virtual events','Generate high-intent B2B leads at scale.',7)
) as v(name,impact,ord);

-- Websites & E-commerce
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','Website Design & Development',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Corporate & business websites','A credible, premium first impression that turns visitors into enquiries.',1),
  ('Startup & product websites','Explain what you do in five seconds and capture early users.',2),
  ('Institutional websites (colleges, schools, hospitals)','Admissions and appointments come straight from the website.',3),
  ('Landing pages & microsites','Launch campaigns in days, each with a page built to convert.',4),
  ('Portfolio & personal websites','A professional home for your work and reputation.',5),
  ('Multilingual websites (English, Tamil, Hindi & more)','Reach regional customers in the language they trust.',6),
  ('CMS websites (WordPress, Webflow, headless)','Update content yourself without calling a developer.',7),
  ('Website redesign & migration','Modernise an outdated site without losing rankings or data.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','E-commerce & D2C Stores',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Shopify store design & setup','A beautiful store live in weeks, built to sell.',1),
  ('WooCommerce stores','Full control of your store on WordPress.',2),
  ('Custom e-commerce platforms','Unique buying journeys that off-the-shelf tools can''t offer.',3),
  ('B2B wholesale & dealer ordering portals','Dealers and bulk buyers order 24×7 without phone calls.',4),
  ('Payment gateways (UPI, cards, wallets, COD)','Customers pay the way they prefer, so fewer abandon at checkout.',5),
  ('Shipping & logistics integration','Automated shipping labels, tracking and returns.',6),
  ('Inventory & ERP sync','Online and offline stock always match, so you never oversell.',7),
  ('Subscriptions, bundles & gift cards','Recurring revenue and higher order values.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','Marketplaces & Omnichannel',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Amazon, Flipkart & Meesho onboarding','Reach millions of buyers where they already shop.',1),
  ('ONDC onboarding','Join India''s open commerce network early.',2),
  ('Marketplace listing & catalogue management','Listings that rank in marketplace search and convert.',3),
  ('Marketplace ads & account management','Profitable growth on every marketplace.',4),
  ('WhatsApp & Instagram commerce','Sell inside the chats and feeds customers already use.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','Store Growth & Conversion',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Store management (listings, pricing, offers)','Your store stays fresh and competitive without daily effort from you.',1),
  ('Product photography & listing content','Product pages that answer every question and close the sale.',2),
  ('Checkout & conversion optimisation (CRO)','More orders from the same traffic.',3),
  ('Abandoned-cart recovery (WhatsApp & email)','Recover sales that were almost lost.',4),
  ('Reviews, ratings & UGC on product pages','Social proof that removes buying hesitation.',5),
  ('Upsell, cross-sell & recommendations','Higher average order value on every visit.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','Experience, Speed & Search-readiness',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('UX / UI design & audit','Remove the hidden friction that quietly makes customers leave.',1),
  ('Mobile-first & PWA experience','Most of your buyers are on phones, and the site is built for them first.',2),
  ('Speed & Core Web Vitals','Faster pages rank higher and sell more.',3),
  ('Accessibility (WCAG)','A site everyone can use, including people with disabilities.',4),
  ('SEO, AEO & GEO-ready architecture','Built from day one to be found on Google and recommended by AI.',5),
  ('Booking, chat & WhatsApp integrations','Visitors can book, ask or buy without leaving the site.',6),
  ('Analytics & conversion tracking (GA4, Meta Pixel)','Know exactly which visitors and campaigns turn into revenue.',7)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('web','Hosting, Security & Care',6) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'web', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Domain, hosting & business email','Professional setup done right the first time.',1),
  ('SSL, security & daily backups','Protected from hacks, malware and data loss.',2),
  ('Website AMC & content updates','Your site keeps improving every month.',3),
  ('Uptime monitoring & support','Problems are fixed before customers notice them.',4)
) as v(name,impact,ord);

-- AI Search & Visibility
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('search','SEO: Search Engine Optimisation',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'search', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Technical SEO audit & fixes','Remove the hidden issues stopping Google from ranking you.',1),
  ('On-page SEO & content optimisation','Every page targets the searches your buyers actually make.',2),
  ('Local SEO (multi-location)','Each branch ranks in its own neighbourhood.',3),
  ('E-commerce & product SEO','Product pages that win organic sales without ad spend.',4),
  ('Content SEO & topic clusters','Become the authority site for your industry''s questions.',5),
  ('Link building & digital PR','Authoritative backlinks that lift your entire domain.',6),
  ('International & multilingual SEO','Rank in new countries and languages as you expand.',7)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('search','AEO: Answer Engine Optimisation',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'search', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Google AI Overviews optimisation','Your brand becomes the answer at the very top of Google.',1),
  ('Featured snippets & People Also Ask','Win position zero, above every competitor.',2),
  ('Voice search optimisation','Be the answer when people ask Siri, Alexa or Google Assistant.',3),
  ('FAQ & answer-ready content architecture','Content structured the way AI and search engines prefer to quote.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('search','GEO: Generative Engine Optimisation',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'search', sec.id, v.name, v.impact, v.ord from sec, (values
  ('AI visibility audit (ChatGPT, Gemini, Perplexity, Claude, Copilot)','See exactly how AI assistants describe you today, and where they don''t mention you.',1),
  ('Brand entity & knowledge panel optimisation','AI systems recognise your brand as a trusted, distinct entity.',2),
  ('Citation building on trusted sources','Get mentioned in the sources AI models rely on.',3),
  ('LLM-friendly content & llms.txt','Your facts, pricing and offerings read correctly by AI crawlers.',4),
  ('AI share-of-voice vs competitors','Know who AI recommends in your category, and take their place.',5),
  ('AI answer monitoring & correction','Catch wrong or outdated AI answers about your brand and fix the source.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('search','Structured Data & Measurement',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'search', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Schema markup & structured data','Search engines and AI understand your business precisely.',1),
  ('Site architecture & internal linking','Authority flows to the pages that make money.',2),
  ('Rank + AI-mention tracking dashboard','One view of your visibility across Google and AI assistants.',3)
) as v(name,impact,ord);

-- AI Automation
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','AI Agents',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Website AI chatbot','Visitors get instant answers and become qualified leads, even at midnight.',1),
  ('WhatsApp AI agent','Customers are served where they already are, 24×7, in their language.',2),
  ('AI voice agent (inbound & outbound)','Calls, reminders and follow-ups handled automatically, with no extra hiring.',3),
  ('AI receptionist & appointment booking','Zero missed calls and a fuller calendar.',4),
  ('AI sales agent (SDR)','Every lead is contacted within minutes, which is when conversion is highest.',5),
  ('AI customer support agent with human hand-off','Most queries resolved instantly, and complex ones escalated with full context.',6),
  ('Internal HR & IT helpdesk bot','Employees get answers without waiting on a team.',7),
  ('Knowledge assistant on your documents (RAG)','Your team gets instant answers from your own SOPs, policies and data.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','Sales & Marketing Automation',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Lead capture → CRM automation','Every enquiry from every channel lands in one place, tagged and assigned.',1),
  ('AI lead scoring','Sales focuses on the leads most likely to buy.',2),
  ('Automated follow-up sequences','No lead is forgotten. Persistence runs on autopilot.',3),
  ('Quotation & proposal generation','Proposals go out in minutes instead of days.',4),
  ('AI content engine in your brand voice','Ten times the content without ten times the team.',5),
  ('Personalised outreach at scale','Every prospect feels personally addressed, even at thousands a week.',6),
  ('Review & referral request automation','A steady stream of reviews and referrals without anyone chasing them.',7)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','Operations Automation',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Document, invoice & PO processing (AI OCR)','Hours of data entry shrink to minutes, with fewer errors.',1),
  ('Approval & operations workflows (n8n, Make, Zapier, Power Automate)','Processes run on their own, so managers manage instead of chasing.',2),
  ('Inventory & reorder alerts','Fewer stock-outs and less cash tied up in excess stock.',3),
  ('Automated MIS & reporting','Reports build themselves and arrive on time, every time.',4),
  ('Email triage & smart inbox','Important mail gets handled first, and routine mail answers itself.',5),
  ('Meeting notes, minutes & action tracking','Every meeting ends with clear owners and deadlines.',6),
  ('RPA for legacy systems','Automate even old software that has no API.',7),
  ('Tally, Zoho, SAP & Google Workspace integration','Your systems finally talk to each other, so you have one version of the truth.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','Finance & HR Automation',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Payment reminders & collections','Faster cash flow with fewer awkward calls.',1),
  ('Expense claims & reimbursements','Same-day approvals and fewer disputes.',2),
  ('Resume screening & interview scheduling','Hire faster and shortlist better candidates.',3),
  ('Employee onboarding workflows','New hires are productive from day one.',4),
  ('Payroll inputs & attendance sync','Error-free payroll without month-end chaos.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','Customer Experience Automation',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Order & service status updates','Fewer "where is my order?" calls and happier customers.',1),
  ('Feedback, NPS & survey automation','Measure satisfaction continuously and act on it quickly.',2),
  ('Support ticket routing & SLA alerts','The right person on every issue, on time.',3),
  ('Appointment & renewal reminders','Fewer no-shows and more renewals.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('ai','AI Strategy & Governance',6) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'ai', sec.id, v.name, v.impact, v.ord from sec, (values
  ('AI-readiness audit & roadmap','A clear map of where AI saves money first, so you can invest with confidence.',1),
  ('Use-case discovery workshops','Your team identifies the highest-value AI opportunities.',2),
  ('AI ROI modelling','Every AI investment backed by a business case.',3),
  ('Custom GPTs & LLM integration','AI that knows your business, inside the tools you already use.',4),
  ('AI policy, data privacy & DPDP compliance','Adopt AI without risking customer data or your reputation.',5),
  ('Change management & adoption','People actually use the new systems, and the investment pays back.',6)
) as v(name,impact,ord);

-- Products & Platforms
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','ERP & Operations Platforms',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Custom ERP (finance, inventory, purchase, sales, production)','One system runs the whole business, with no more disconnected spreadsheets.',1),
  ('Inventory & warehouse management','Real-time stock across locations, with less leakage and fewer stock-outs.',2),
  ('Procurement & vendor portal','Better pricing, faster purchasing and full audit trails.',3),
  ('Production planning & MRP (manufacturing)','Plan capacity, materials and orders so deliveries happen on time.',4),
  ('Billing, invoicing & GST-ready accounting integration','Faster billing, accurate taxes and clean books.',5),
  ('Multi-branch & franchise management','Run 50 locations with the control you have over one.',6),
  ('Asset & maintenance management','Less downtime and longer machine life.',7),
  ('Quality control & compliance tracking','Fewer defects and audit-ready documentation.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','CRM & Sales Platforms',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Custom CRM','Every customer, deal and conversation in one place, so nothing slips.',1),
  ('Sales pipeline & field-sales mobile app','Managers see every deal live, and reps sell more and do less admin.',2),
  ('Dealer & distributor management (DMS)','Channel partners order, track and get paid seamlessly.',3),
  ('Customer portal & self-service','Customers serve themselves, with fewer calls and more satisfaction.',4),
  ('Quotation, pricing & CPQ engine','Accurate quotes in minutes, every time.',5),
  ('Helpdesk & ticketing system','Every issue tracked to resolution within SLA.',6),
  ('Loyalty & membership platform','Repeat business designed in, not hoped for.',7),
  ('Admissions / patient / customer CRM for institutions','No enquiry is lost between the first call and enrolment.',8)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','People Platforms (HR)',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('HRMS & payroll integration','Accurate, compliant HR at the click of a button.',1),
  ('Recruitment & applicant tracking (ATS)','Hire the right people faster.',2),
  ('Attendance, leave & field-force tracking','Know who is where and productive, without micromanaging.',3),
  ('Performance management (KPI / OKR)','Clear goals and fair reviews drive a high-performance culture.',4),
  ('LMS & training portal','Train every employee consistently, at scale.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','SaaS Product Development',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('SaaS architecture & multi-tenant build','Sell one product to thousands of customers profitably.',1),
  ('Subscription billing & payments (Razorpay, Stripe)','Recurring revenue collected automatically.',2),
  ('Admin console & analytics','Run and grow your SaaS from one command centre.',3),
  ('APIs & third-party integrations','Your product plugs into the ecosystem customers already use.',4),
  ('White-label platforms','Launch your own branded software quickly.',5),
  ('Marketplaces & multi-vendor platforms','Build a platform business with network effects.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','Industry Solutions',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Hospital & clinic management (HMS)','Smooth patient flow, billing and records for better care.',1),
  ('School & college ERP','Admissions, academics, fees and exams on one platform.',2),
  ('Real-estate CRM & site-visit tracking','More site visits turn into bookings.',3),
  ('Retail POS & omnichannel commerce','One view of stock and customers across store and online.',4),
  ('Restaurant & hospitality operations','Faster service, controlled costs and loyal guests.',5),
  ('Logistics & fleet tracking','On-time deliveries and lower fuel and idle costs.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','Web & Mobile Apps',6) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Mobile apps for iOS & Android (Flutter / React Native)','Your brand on every customer''s home screen.',1),
  ('Progressive web apps (PWA)','App-like experience without app-store friction.',2),
  ('Booking & appointment platforms','Customers self-book 24×7.',3),
  ('Customer & partner portals','Secure, branded access for everyone you work with.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','AI-Powered Products',7) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('AI copilots inside your software','Users get things done faster with AI built into the product.',1),
  ('Document AI & intelligent search','Find anything in thousands of documents in seconds.',2),
  ('Recommendation & personalisation engines','More upsells and higher order values.',3),
  ('Computer vision (quality inspection, attendance, safety)','Machines spot defects and risks humans miss.',4),
  ('Demand forecasting & predictive models','Plan inventory and staffing based on what will happen.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('product','Build, Launch & Support',8) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'product', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Product discovery & validation','Confirm people will pay before you spend on building.',1),
  ('UI/UX design & clickable prototypes','See and test the product before code is written.',2),
  ('MVP development','Launch in weeks and learn from real users.',3),
  ('QA, testing & security audits','Software that works on launch day, and safely.',4),
  ('Cloud hosting & DevOps (AWS, GCP, Azure)','Fast, secure and able to scale with demand.',5),
  ('Legacy modernisation & data migration (Excel / Tally / old systems → cloud)','Move off outdated systems without losing data or momentum.',6),
  ('Annual maintenance & support (AMC)','Your platform keeps improving, with a team on call.',7)
) as v(name,impact,ord);

-- Brand Establishment
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('brand','Research & Strategy',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'brand', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Brand audit & perception research','See exactly how the market perceives you today, and where the gaps are.',1),
  ('Customer & market research','Decisions grounded in what buyers actually think.',2),
  ('Competitor mapping & white-space analysis','Find the space competitors have left open, and claim it.',3),
  ('Brand positioning & value proposition','Own one clear idea in the customer''s mind, so you stop competing on price.',4),
  ('Brand architecture (master, sub & product brands)','A clear structure so the portfolio reads as one.',5),
  ('Naming & tagline development','A name and line people remember and repeat.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('brand','Identity & Design',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'brand', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Logo & visual identity system','Instant recognition on every screen, shelf and signboard.',1),
  ('Brand guidelines & design toolkit','Stay consistent as you scale across teams, agencies and cities.',2),
  ('Packaging design','Win the moment of choice on the shelf.',3),
  ('Corporate collateral & stationery','Every handout feels premium and credible.',4),
  ('Office, retail & signage branding','Physical spaces that reinforce the brand promise.',5),
  ('Merchandise & gifting design','Branded items people keep, use and photograph.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('brand','Messaging & Storytelling',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'brand', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Brand voice & messaging framework','Everyone in the company tells the same compelling story.',1),
  ('Brand story & founder narrative','An origin story that builds emotional connection.',2),
  ('Corporate profile, brochure & pitch decks','Sales tools that win meetings and close deals.',3),
  ('Website & campaign copywriting','Words that persuade, rank and convert.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('brand','Brand Placement',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'brand', sec.id, v.name, v.impact, v.ord from sec, (values
  ('PR & media features','Third-party credibility that advertising can''t buy.',1),
  ('Strategic partnerships & co-branding','Borrow trust and reach from brands your audience already loves.',2),
  ('Event, exhibition & sponsorship placement','Be visible wherever your industry gathers and decides.',3),
  ('Awards & recognition strategy','Visible proof of excellence that wins trust.',4),
  ('Outdoor, transit & OOH advertising','Own the physical spaces your customers pass every day.',5),
  ('Product placement in content & films','Appear naturally inside the content your customers already watch.',6),
  ('Retail & shelf placement strategy','Prime visibility where purchase decisions happen.',7)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('brand','Brand Experience & Evolution',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'brand', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Customer journey & touchpoint design','Every interaction feels intentional, from the first ad to after-sales.',1),
  ('Employer branding','Attract better talent who want to work for you, at lower hiring cost.',2),
  ('Internal branding & culture','Employees who live the brand deliver its promise.',3),
  ('Rebranding & brand refresh','Modernise without losing the equity you''ve built.',4),
  ('Brand health tracking','Measure brand strength quarterly, like any other business asset.',5)
) as v(name,impact,ord);

-- Personal Branding
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('personal','Audit & Strategy',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'personal', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Personal brand audit','See how the world sees you today, online and in AI answers.',1),
  ('Positioning & niche definition','Be known for one powerful thing.',2),
  ('Content pillars & voice','A recognisable point of view people follow.',3)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('personal','Profile & Presence',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'personal', sec.id, v.name, v.impact, v.ord from sec, (values
  ('LinkedIn profile makeover','A profile that works as a pitch deck, turning visits into conversations.',1),
  ('Instagram / YouTube personal presence','Reach the next generation of clients and talent.',2),
  ('Personal website & portfolio','One credible home for your story, work and media.',3),
  ('Professional photo & video direction','Visuals that signal authority before you say a word.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('personal','Content & Thought Leadership',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'personal', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Ghostwritten LinkedIn posts & articles','Consistent, insightful content in your voice, without taking your time.',1),
  ('Founder video & podcast series','A following that trusts you and buys from your company.',2),
  ('LinkedIn & email newsletter','An audience you own that hears from you every week.',3),
  ('Opinion pieces & industry columns','Recognised as a thought leader in your field.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('personal','Stage & Media',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'personal', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Speaking engagements & TEDx-style talks','Stage time that positions you as the expert in the room.',1),
  ('Media interviews & features','Credibility anyone can verify in one search.',2),
  ('Podcast guest placements','Reach new audiences through trusted hosts.',3),
  ('Panel & conference positioning','Be in the rooms where deals happen.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('personal','Authority Assets & Reputation',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'personal', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Book / whitepaper development','The ultimate authority asset, which keeps working for years.',1),
  ('Awards & recognition','Visible proof of excellence.',2),
  ('Personal reputation & search monitoring','Your name searches clean and strong on Google and in AI tools.',3),
  ('Strategic networking & community building','The right rooms, the right people and opportunities that compound.',4)
) as v(name,impact,ord);

-- Influencer Connect
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('influencer','Discovery & Matching',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'influencer', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Influencer discovery & vetting','Partner only with authentic creators. We audit for fake followers and engagement.',1),
  ('Audience-fit matching (age, city, interests)','Your message reaches people likely to buy, not just scroll.',2),
  ('Micro & nano creator networks','Hyper-local trust at scale, often with better ROI than celebrities.',3),
  ('Celebrity & macro-influencer access','Mass reach for big launches.',4),
  ('Regional language creators','Win hearts in Tamil Nadu, South India and beyond.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('influencer','Campaign Management',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'influencer', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Influencer campaign strategy','Campaigns built around a business goal, not just likes.',1),
  ('Creative briefs & content guidelines','Creators stay on-message while sounding like themselves.',2),
  ('Negotiation, contracts & payments','Fair rates, clear deliverables and no admin headaches.',3),
  ('Content approvals & ASCI compliance','Every post is brand-safe and properly disclosed.',4),
  ('Whitelisting & creator ads','Turn top creator content into high-performing ads.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('influencer','Creator Programmes',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'influencer', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Brand ambassador programmes','Long-term advocates who keep talking about you.',1),
  ('UGC content production','Authentic content to reuse in ads, which usually beats studio creative.',2),
  ('Campus & community creator clubs','A network that amplifies every launch and event.',3),
  ('Event influencer activation','Your event trends online while it''s still happening.',4),
  ('Employee & customer advocacy','Your own people become your most credible voices.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('influencer','Influencer Management as a Service (for creators)',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'influencer', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Brand-deal sourcing','Creators get steady, relevant collaborations.',1),
  ('Media kit & rate card','Get paid what your audience is worth.',2),
  ('Contract & payment management','Get paid on time, every time.',3),
  ('Content & growth strategy','Grow an audience brands want to work with.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('influencer','Measurement',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'influencer', sec.id, v.name, v.impact, v.ord from sec, (values
  ('ROI tracking (reach, engagement, codes, links)','Know exactly which creator drove which sale.',1),
  ('Creator performance dashboard','Re-invest in top performers and drop the rest, based on data.',2)
) as v(name,impact,ord);

-- Data & Intelligence
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('data','Business Intelligence',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'data', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Executive & CXO dashboards (Power BI, Looker Studio)','The whole business on one screen, updated live.',1),
  ('Sales & marketing analytics','See which campaigns and reps actually drive revenue.',2),
  ('Operations & production dashboards','Spot bottlenecks before they cost money.',3),
  ('Finance & cash-flow dashboards','Never be surprised by a cash crunch.',4),
  ('KPI scorecards for every team','Everyone knows the number they own.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('data','Data Foundations',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'data', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Data cleanup, de-duplication & migration','Trustworthy data you can build decisions on.',1),
  ('Data warehouse & integration','All your systems feed one source of truth.',2),
  ('Google Sheets / Excel automation','Your existing sheets become live, automated reports.',3)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('data','Advanced Analytics',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'data', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Sales & demand forecasting','Plan inventory, cash and staffing ahead of time.',1),
  ('Customer segmentation & lifetime value','Spend more on the customers worth the most.',2),
  ('Churn & retention prediction','Save customers before they leave.',3),
  ('Pricing analytics','Find the price point that maximises profit.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('data','Market Intelligence',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'data', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Market research & sizing','Know the size of the prize before you chase it.',1),
  ('Competitor intelligence tracking','Always know what competitors are doing.',2),
  ('Survey & feedback analytics','Turn customer voice into clear action items.',3)
) as v(name,impact,ord);

-- Transformation Consulting
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('consult','Strategy',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'consult', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Business transformation roadmap (12–36 months)','A clear plan connecting today''s reality to tomorrow''s ambition.',1),
  ('Growth & market-expansion strategy','Enter new cities, segments or exports with less risk.',2),
  ('New business model & revenue streams','Find the next engine of growth.',3),
  ('Go-to-market strategy','Launch products and enter markets with precision.',4),
  ('OKR & KPI design','Everyone works towards the numbers that matter.',5)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('consult','Operations & Process',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'consult', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Process mapping & re-engineering','Cut cost and delay from the way work gets done.',1),
  ('SOP documentation & standardisation','Consistent quality that doesn''t depend on individuals.',2),
  ('Lean & cost-optimisation programmes','Margin gains that go straight to the bottom line.',3),
  ('Technology & tool-stack selection','The right software, chosen objectively.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('consult','Sales & Customer',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'consult', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Sales process & team design','A repeatable sales machine instead of hero dependency.',1),
  ('Pricing & packaging strategy','Capture the value you create.',2),
  ('Customer experience (CX) management','Customers who return, refer and review.',3),
  ('Channel & distribution strategy','Reach more customers through the right partners.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('consult','Organisation & People',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'consult', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Organisation structure & role design','Clear accountability as you scale.',1),
  ('Second-line leadership development','A business that runs without the founder in every decision.',2),
  ('Family business governance & succession','Continuity and harmony across generations.',3),
  ('Culture & change management','Teams that embrace transformation instead of resisting it.',4)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('consult','Leadership on Demand & Funding',5) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'consult', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Fractional CMO / Growth Head','Senior marketing leadership without a full-time C-suite salary.',1),
  ('Fractional CTO / AI Lead','Make confident technology decisions with an expert alongside you.',2),
  ('Quarterly board-style strategy reviews','Course-correct early with an outside view.',3),
  ('Investor pitch deck & financial storytelling','Raise capital with a story investors back.',4),
  ('Government schemes, grants & incubation support','Access non-dilutive funding and ecosystem support.',5)
) as v(name,impact,ord);

-- ATLA Academy
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('academy','AI for Everyone',1) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'academy', sec.id, v.name, v.impact, v.ord from sec, (values
  ('AI fundamentals','Remove the fear and the hype, and start using AI with confidence.',1),
  ('Prompt engineering','Expert-level output from AI tools in a fraction of the time.',2),
  ('AI productivity toolkit','Win back 5–10 hours a week on routine work.',3)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('academy','Professional Tracks',2) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'academy', sec.id, v.name, v.impact, v.ord from sec, (values
  ('AI for marketers & creators','Run a modern content and campaign engine on your own.',1),
  ('SEO, AEO & GEO masterclass','Get your own brand found by Google and AI.',2),
  ('No-code automation & AI agents','Build automations that save money from week one.',3),
  ('AI video & image creation','Studio-grade visuals without a studio.',4),
  ('Personal branding masterclass','A professional reputation that attracts opportunity.',5),
  ('Data analytics & dashboards','Turn spreadsheets into decisions.',6)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('academy','Corporate Programmes',3) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'academy', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Department-wise AI upskilling (sales, HR, finance, ops)','A workforce that adopts AI instead of resisting it.',1),
  ('Leadership AI briefings','Leaders who make informed AI investment decisions.',2),
  ('Custom in-house bootcamps','Training built around your tools, data and goals.',3)
) as v(name,impact,ord);
with sec as (insert into practice_sections (practice_id,title,sort_order) values ('academy','Students & Institutions',4) returning id)
insert into services (practice_id,section_id,name,impact,sort_order) select 'academy', sec.id, v.name, v.impact, v.ord from sec, (values
  ('Design thinking bootcamps','Students who solve real problems creatively.',1),
  ('Hackathons & product challenges','Hands-on experience that builds portfolios and placements.',2),
  ('Faculty development programmes (FDPs)','Faculty confident in teaching with and about AI.',3),
  ('Certification programmes','Industry-recognised proof of future-ready skills.',4)
) as v(name,impact,ord);

-- 3. COCKTAIL ITEMS (monthly prices in INR)
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('smm','Social Media Management',18000,'#0fb5ad','digital',1,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('content','Content & Reels Production',22000,'#14b8a6','digital',2,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('perf','Performance Ads Management',15000,'#2dd4bf','digital',3,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('seo','SEO + AEO + GEO',20000,'#0d9488','search',4,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('web','Website Design & Build',15000,'#fb923c','web',5,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('ecom','E-commerce Store & Management',30000,'#f97316','web',6,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('crm','CRM & Lead Automation',18000,'#06b6d4','ai',7,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('agent','AI Chat / Voice Agent',25000,'#0891b2','ai',8,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('flow','Workflow Automation',20000,'#38bdf8','ai',9,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('erp','Custom ERP / SaaS Platform',45000,'#10b981','product',10,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('bi','BI Dashboards & Analytics',12000,'#0ea5e9','data',11,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('brand','Brand Strategy & Identity',25000,'#6366f1','brand',12,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('pr','PR & Brand Placement',22000,'#818cf8','brand',13,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('personal','Founder Personal Branding',20000,'#f59e0b','personal',14,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('influ','Influencer Connect',20000,'#fb7185','influencer',15,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('orm','Reputation Management',10000,'#5eead4','digital',16,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('consult','Fractional CMO / Strategy',30000,'#0284c7','consult',17,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;
insert into cocktail_items (id,name,monthly_price,color,practice_id,sort_order,is_active) values ('learn','Team AI Academy',15000,'#a78bfa','academy',18,true)
on conflict (id) do update set name=excluded.name,monthly_price=excluded.monthly_price,color=excluded.color,practice_id=excluded.practice_id,sort_order=excluded.sort_order,is_active=true;

-- 4. PACKAGES
insert into packages (id,name,tier_label,monthly_price,motto,vision,color,icon,is_topmost,sort_order,is_active) values ('good','Good','Level 01 · Foundation',35000,'Get seen. Get trusted.','For businesses ready to look as good online as they are offline.','#14b8a6','seed',false,1,true)
on conflict (id) do update set name=excluded.name,tier_label=excluded.tier_label,monthly_price=excluded.monthly_price,motto=excluded.motto,vision=excluded.vision,color=excluded.color,icon=excluded.icon,is_topmost=excluded.is_topmost,sort_order=excluded.sort_order,is_active=true;
insert into packages (id,name,tier_label,monthly_price,motto,vision,color,icon,is_topmost,sort_order,is_active) values ('great','Great','Level 02 · Growth',65000,'Get found. Get leads.','For businesses that want a predictable flow of qualified leads.','#3b82f6','rocket',false,2,true)
on conflict (id) do update set name=excluded.name,tier_label=excluded.tier_label,monthly_price=excluded.monthly_price,motto=excluded.motto,vision=excluded.vision,color=excluded.color,icon=excluded.icon,is_topmost=excluded.is_topmost,sort_order=excluded.sort_order,is_active=true;
insert into packages (id,name,tier_label,monthly_price,motto,vision,color,icon,is_topmost,sort_order,is_active) values ('fantastic','Fantastic','Level 03 · Acceleration',99000,'Get chosen.','For brands ready to become the first name people think of in their market.','#8b5cf6','diamond',false,3,true)
on conflict (id) do update set name=excluded.name,tier_label=excluded.tier_label,monthly_price=excluded.monthly_price,motto=excluded.motto,vision=excluded.vision,color=excluded.color,icon=excluded.icon,is_topmost=excluded.is_topmost,sort_order=excluded.sort_order,is_active=true;
insert into packages (id,name,tier_label,monthly_price,motto,vision,color,icon,is_topmost,sort_order,is_active) values ('super','Super','Level 04 · Transformation',150000,'Become the category.','For leaders who want one transformation partner across brand, marketing, AI, platforms and people.','#d4a017','crown',true,4,true)
on conflict (id) do update set name=excluded.name,tier_label=excluded.tier_label,monthly_price=excluded.monthly_price,motto=excluded.motto,vision=excluded.vision,color=excluded.color,icon=excluded.icon,is_topmost=excluded.is_topmost,sort_order=excluded.sort_order,is_active=true;

-- 5. PACKAGE ITEMS
delete from package_items where package_id in ('good','great','fantastic','super');
insert into package_items (package_id,cocktail_item_id) values ('good','smm'),('good','seo'),('good','orm'),('good','bi');
insert into package_items (package_id,cocktail_item_id) values ('great','smm'),('great','seo'),('great','orm'),('great','bi'),('great','content'),('great','perf'),('great','crm');
insert into package_items (package_id,cocktail_item_id) values ('fantastic','smm'),('fantastic','seo'),('fantastic','orm'),('fantastic','bi'),('fantastic','content'),('fantastic','perf'),('fantastic','crm'),('fantastic','web'),('fantastic','agent'),('fantastic','brand'),('fantastic','influ');
insert into package_items (package_id,cocktail_item_id) values ('super','smm'),('super','content'),('super','perf'),('super','seo'),('super','web'),('super','ecom'),('super','crm'),('super','agent'),('super','flow'),('super','erp'),('super','bi'),('super','brand'),('super','pr'),('super','personal'),('super','influ'),('super','orm'),('super','consult'),('super','learn');

-- 6. PACKAGE BENEFITS
delete from package_benefits where package_id in ('good','great','fantastic','super');
insert into package_benefits (package_id,title,description,sort_order) values
  ('good','Social media management','12 posts + 4 Reels a month on 2 platforms, so you stay visible every week.',1),
  ('good','SEO + AEO foundation','Google-ready pages, schema and an optimised Business Profile so customers can find you.',2),
  ('good','Reputation management','Review generation and response so new customers choose you with confidence.',3),
  ('good','Monthly analytics dashboard','Plain-English insight into what''s working.',4),
  ('good','Monthly strategy call','A growth expert in your corner.',5);
insert into package_benefits (package_id,title,description,sort_order) values
  ('great','Everything in Good','Your foundation, kept strong.',1),
  ('great','Content & Reels production','12 professionally produced Reels a month, built to reach new audiences.',2),
  ('great','Performance ads management','Meta, Google & LinkedIn campaigns optimised weekly for cost per lead.',3),
  ('great','CRM & lead automation','Every lead captured, scored and followed up on WhatsApp automatically.',4),
  ('great','Conversion landing pages','Campaign pages that turn clicks into enquiries.',5),
  ('great','Fortnightly performance reviews','Faster decisions and faster growth.',6);
insert into package_benefits (package_id,title,description,sort_order) values
  ('fantastic','Everything in Great','Your lead engine, running at full speed.',1),
  ('fantastic','Premium website build & care','A fast, conversion-first site built for Google and AI answer engines.',2),
  ('fantastic','GEO: Generative Engine Optimisation','Your brand recommended by ChatGPT, Gemini & Perplexity.',3),
  ('fantastic','24×7 AI chat agent','Website & WhatsApp leads answered, qualified and booked at any hour.',4),
  ('fantastic','Brand strategy & identity refresh','Positioning that lets you charge what you''re worth.',5),
  ('fantastic','Monthly influencer campaign','Vetted creators who match your audience, managed end-to-end.',6),
  ('fantastic','Dedicated account strategist','One person who knows your business inside out.',7);
insert into package_benefits (package_id,title,description,sort_order) values
  ('super','Everything in Fantastic','Your entire growth engine, fully fuelled.',1),
  ('super','A storefront that sells 24×7','E-commerce store, marketplaces and WhatsApp commerce, connected to your inventory and CRM.',2),
  ('super','Your brand, everywhere that matters','SEO + AEO + GEO so you''re the answer on Google, in AI Overviews and when buyers ask ChatGPT, Gemini or Perplexity.',3),
  ('super','An AI workforce that never sleeps','Chat & voice agents plus end-to-end workflow automation, so your team stops doing repetitive work.',4),
  ('super','Your business on one platform','Custom CRM / ERP modules built and rolled out every quarter, so the spreadsheets go.',5),
  ('super','Decisions at the speed of data','Live CXO dashboards across sales, marketing and operations.',6),
  ('super','A founder the industry follows','Personal branding, ghostwritten thought leadership and speaking placements.',7),
  ('super','Headlines, not just posts','PR features, partnerships, awards and premium brand placement.',8),
  ('super','A fractional CMO at your table','Senior strategy leadership with quarterly board-style reviews.',9),
  ('super','A team that thinks in AI','ATLA Academy training for your staff every quarter.',10),
  ('super','Creators on your side','An always-on influencer & ambassador programme.',11),
  ('super','A dedicated growth pod','Strategist, creative, performance, developer & AI engineer, working in weekly sprints.',12);

commit;

-- 7. CHECK (should show 11 practices and the counts above)
select p.title, count(distinct s.id) as sections, count(v.id) as services
from practices p left join practice_sections s on s.practice_id=p.id left join services v on v.section_id=s.id
group by p.title, p.sort_order order by p.sort_order;
