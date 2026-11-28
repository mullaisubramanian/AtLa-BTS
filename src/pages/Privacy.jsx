import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import { SITE_CONFIG } from '../config/site';
import './Legal.css';

export default function Privacy() {
  return (
    <section className="page-enter">
      <Seo
        title="Privacy Policy — AtLa/BTS"
        description="How AtLa/BTS (Atla Ventures) collects, uses and protects personal data under India's DPDP Act, 2023."
        path="/privacy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />

      <div className="section">
        <div className="wrap legal-wrap">
          <article className="legal-card glass">
            <Eyebrow>Legal</Eyebrow>
            <h1>Privacy Policy</h1>
            <p className="legal-updated">Last updated: 28 November 2026</p>

            <p>
              AtLa/BTS (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a brand of Atla Ventures,
              a proprietorship registered with the Government of India&apos;s Ministry of MSME
              (Udyam Registration No. UDYAM-TN-03-0359417).
            </p>
            <p>Based in Coimbatore, Tamil Nadu, India.</p>
            <p>
              This policy explains what personal data we collect through www.atlabts.com, why we
              collect it, and the choices and rights you have under India&apos;s Digital Personal
              Data Protection Act, 2023 (&quot;DPDP Act&quot;). For the purposes of the DPDP Act,
              Atla Ventures is the Data Fiduciary.
            </p>

            <h2>1. What we collect</h2>
            <p>
              When you use our forms (Quick Enquiry, Get Started / Free Growth Audit, Contact), we
              collect what you choose to give us:
            </p>
            <ul>
              <li>Name, email address and phone number (phone is optional)</li>
              <li>Company name, business stage, industry and monthly budget range</li>
              <li>The services you add to your Service Cocktail and your message</li>
            </ul>
            <p>
              When you use Ask ATLA or the chat assistant, we store the questions you type so we can
              improve answers. Please do not enter sensitive personal information in the chat.
            </p>
            <p>
              If you apply to join our team, we collect your name, contact details, city, role of
              interest and the role-specific details you choose to share (for example portfolio,
              social profile links or follower range), and use them only to review your application.
              We keep applications for up to 12 months.
            </p>
            <p>
              When you browse the site, we record basic usage events (for example, pages viewed and
              buttons clicked) together with technical details such as browser type and an
              anonymous session identifier. We do not use advertising cookies, and we do not sell
              your data.
            </p>

            <h2>2. Why we use it</h2>
            <ul>
              <li>To reply to your enquiry and prepare a proposal or growth audit</li>
              <li>
                To contact you about the enquiry you made (by email, phone or Instagram, as you
                prefer)
              </li>
              <li>To keep records of enquiries and proposals</li>
              <li>To understand which pages and services are useful and improve the site</li>
              <li>To prevent spam and misuse of our forms</li>
              <li>To meet legal, tax and accounting obligations</li>
            </ul>
            <p>
              We use your data only for these purposes. We will ask for fresh consent before using
              it for anything else, such as a marketing newsletter.
            </p>

            <h2>3. Legal basis</h2>
            <p>
              We process your personal data on the basis of the consent you give when you tick the
              consent box and submit a form, and for legitimate uses permitted under the DPDP Act
              (such as responding to a request you initiated). You may withdraw consent at any time
              (see section 7). Withdrawing consent does not affect processing already carried out.
            </p>

            <h2>4. Who we share it with</h2>
            <p>
              We do not sell or rent personal data. We share it only with service providers that
              help us run the website, each acting on our instructions:
            </p>
            <ul>
              <li>Supabase — secure database for enquiries and site data</li>
              <li>Vercel — website hosting</li>
              <li>Zoho — business email</li>
            </ul>
            <p>
              Some of these providers may store data on servers outside India. Where that happens,
              we rely on their security commitments and transfer data only as permitted under the
              DPDP Act and any rules notified by the Government of India.
            </p>
            <p>
              We may disclose data if required by law, court order or a government authority.
            </p>

            <h2>5. How long we keep it</h2>
            <ul>
              <li>
                Enquiries that do not become projects: up to 24 months after our last contact, then
                deleted or anonymised
              </li>
              <li>
                Client records: for the duration of the engagement and as long as required by tax and
                accounting law
              </li>
              <li>
                Chat questions and usage events: up to 12 months, then deleted or anonymised
              </li>
            </ul>

            <h2>6. How we protect it</h2>
            <p>
              Data is sent over HTTPS, stored in an access-controlled database, and only authorised
              AtLa/BTS staff can view enquiries. No system is completely secure; if a personal data
              breach occurs, we will inform affected users and the Data Protection Board of India as
              required by law.
            </p>

            <h2>7. Your rights</h2>
            <p>Under the DPDP Act you can:</p>
            <ul>
              <li>Ask for a summary of the personal data we hold about you</li>
              <li>Ask us to correct, complete or update it</li>
              <li>Ask us to erase it (unless we must keep it by law)</li>
              <li>Withdraw your consent</li>
              <li>Nominate another person to exercise these rights on your behalf</li>
              <li>
                Raise a grievance with us, and if not resolved, with the Data Protection Board of
                India
              </li>
            </ul>
            <p>
              To use any of these rights, email{' '}
              <a className="legal-link" href={`mailto:${SITE_CONFIG.email}`}>
                {SITE_CONFIG.email}
              </a>{' '}
              with the subject &quot;Data request&quot;. We will respond within 30 days.
            </p>

            <h2>8. Children</h2>
            <p>
              Our services are meant for businesses and adults. We do not knowingly collect personal
              data from anyone under 18. If you believe a child has shared data with us, contact us
              and we will delete it.
            </p>

            <h2>9. Links to other sites</h2>
            <p>
              Our site links to Instagram and other third-party sites. Their privacy practices are
              their own; please read their policies.
            </p>

            <h2>10. Changes to this policy</h2>
            <p>
              We may update this policy. The &quot;Last updated&quot; date above shows the latest
              version. Significant changes will be highlighted on the website.
            </p>

            <h2>11. Grievance Officer and contact</h2>
            <div className="legal-contact-box">
              <div>Grievance Officer: Mullai S, Proprietor, Atla Ventures</div>
              <div>
                Email:{' '}
                <a className="legal-link" href={`mailto:${SITE_CONFIG.email}`}>
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div>Location: Coimbatore, Tamil Nadu, India</div>
              <div>
                Instagram:{' '}
                <a
                  className="legal-link"
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE_CONFIG.instagramHandle}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

