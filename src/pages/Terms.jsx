import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import { SITE_CONFIG } from '../config/site';
import './Legal.css';

export default function Terms() {
  return (
    <section className="page-enter">
      <Seo
        title="Terms of Use — AtLa/BTS"
        description="Terms for using the AtLa/BTS website, Service Cocktail, Ask ATLA and enquiry forms."
        path="/terms"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Use', path: '/terms' },
        ]}
      />

      <div className="section">
        <div className="wrap legal-wrap">
          <article className="legal-card glass">
            <Eyebrow>Legal</Eyebrow>
            <h1>Terms of Use</h1>
            <p className="legal-updated">Last updated: 28 November 2026</p>

            <p>
              These terms apply to your use of www.atlabts.com, including Ask ATLA, the chat
              assistant, the Service Cocktail and our enquiry forms. The website is operated by Atla
              Ventures (Udyam Registration No. UDYAM-TN-03-0359417), Coimbatore, Tamil Nadu, India,
              under the brand AtLa/BTS. By using the website you agree to these terms.
            </p>

            <h2>1. About the website</h2>
            <p>
              The website describes the services offered by AtLa/BTS: digital growth, branding, AI
              automation, websites and e-commerce, product and software development, consulting and
              training through ATLA Academy. Content is for general information and may change without
              notice.
            </p>

            <h2>2. Pricing, quotes and engagements</h2>
            <p>
              Our pricing is customised to each business. Nothing on the website — including the
              Service Cocktail, package descriptions, Ask ATLA or chat replies — is an offer, price
              or binding commitment. A project starts only when both parties sign a written proposal
              or agreement that sets out the scope, fees, timelines and payment terms. If that
              agreement conflicts with these terms, the agreement prevails.
            </p>

            <h2>3. Ask ATLA and the chat assistant</h2>
            <p>
              Ask ATLA and the chat assistant suggest services based on what you type. Their answers
              are automated, general guidance — not professional, legal, financial or tax advice —
              and may be incomplete. Please confirm any decision with our team.
            </p>

            <h2>4. Your responsibilities</h2>
            <p>When you use the website you agree:</p>
            <ul>
              <li>to give accurate information in our forms</li>
              <li>not to submit someone else&apos;s personal data without their permission</li>
              <li>
                not to misuse the site — for example by sending spam, attempting to hack or overload
                it, scraping it at scale, or uploading harmful code
              </li>
              <li>not to use the site for any unlawful purpose</li>
            </ul>

            <h2>5. Intellectual property</h2>
            <p>
              The AtLa/BTS name, logo, website design, text, graphics, the &quot;Business
              Transformation System&quot; method, the Service Cocktail concept and other content
              belong to Atla Ventures or its licensors. You may view and share links to our pages,
              but you may not copy, reproduce or reuse our content or branding for commercial
              purposes without written permission.
            </p>

            <h2>6. Results and case examples</h2>
            <p>
              Any examples, sample dashboards or figures shown on the website are illustrative.
              Results depend on each business, its market and its execution, and we do not
              guarantee specific outcomes unless stated in a signed agreement.
            </p>

            <h2>7. Third-party links and tools</h2>
            <p>
              The website may link to or use third-party services (such as Instagram). We are not
              responsible for their content, availability or practices.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
              The website is provided &quot;as is&quot;. To the extent permitted by law, Atla
              Ventures is not liable for any indirect or consequential loss, or loss of profit, data
              or business, arising from use of the website or reliance on its content. Nothing in
              these terms limits liability that cannot be limited under Indian law.
            </p>

            <h2>9. Privacy</h2>
            <p>
              Our{' '}
              <Link className="legal-link" to="/privacy">
                Privacy Policy
              </Link>{' '}
              explains how we handle personal data collected through the website.
            </p>

            <h2>10. Changes</h2>
            <p>
              We may update these terms. The &quot;Last updated&quot; date shows the current
              version. Continuing to use the website after changes means you accept them.
            </p>

            <h2>11. Governing law and jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Courts in Coimbatore, Tamil Nadu have
              exclusive jurisdiction over any dispute arising from them.
            </p>

            <h2>12. Contact</h2>
            <div className="legal-contact-box">
              <div>
                Email:{' '}
                <a className="legal-link" href={`mailto:${SITE_CONFIG.email}`}>
                  {SITE_CONFIG.email}
                </a>
              </div>
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
              <div>Location: Coimbatore, Tamil Nadu, India</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
