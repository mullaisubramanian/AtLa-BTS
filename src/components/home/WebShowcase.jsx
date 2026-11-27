import { useModals } from '../../context/ModalContext';
import Eyebrow from '../Eyebrow';
import Icon from '../Icon';
import './WebShowcase.css';

const FEATURES = [
  ['web', 'Business & corporate websites'],
  ['bag', 'Shopify, WooCommerce & custom stores'],
  ['briefcase', 'B2B wholesale & dealer portals'],
  ['truck', 'Payments, shipping & ERP sync'],
  ['rocket', 'Amazon, Flipkart & ONDC onboarding'],
  ['search', 'SEO, AEO & GEO-ready architecture'],
];

export default function WebShowcase() {
  const { openPractice, openQuickEnquiry } = useModals();

  return (
    <div className="section" style={{ paddingTop: '10px' }}>
      <div className="wrap web-grid">
        <div>
          <Eyebrow>Websites &amp; E-commerce</Eyebrow>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', margin: '16px 0 14px' }}>
            Websites that win trust. <span className="grad">Stores that sell while you sleep.</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
            From a corporate website to a full D2C store, a B2B dealer portal or Amazon and
            Flipkart channels, we design, build and run it, and connect it to your payments,
            shipping, CRM and ERP.
          </p>
          <div className="web-feats">
            {FEATURES.map(([icon, label]) => (
              <div key={label} className="glass">
                <Icon name={icon} />
                <b>{label}</b>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openPractice('web')}
            >
              See all website &amp; e-commerce services →
            </button>
            <button
              type="button"
              className="btn btn-neu"
              onClick={() =>
                openQuickEnquiry({
                  source: 'website_quote',
                  title: 'Get a website quote',
                  contextLabel: 'Websites & E-commerce',
                  interests: ['web'],
                  defaultMessage:
                    'I would like a quote for a website or e-commerce store.',
                })
              }
            >
              Get a website quote
            </button>
          </div>
        </div>

        <div className="browser glass" aria-label="Online store mockup">
          <div className="b-bar">
            <span />
            <span />
            <span />
            <div className="b-url">yourbrand.com/shop</div>
          </div>
          <div className="b-hero">
            <div>
              <small>NEW COLLECTION</small>
              <b>
                Crafted in Tamil Nadu.
                <br />
                Delivered across India.
              </b>
              <em>Shop now</em>
            </div>
            <div className="b-art" />
          </div>
          <div className="b-prods">
            <div>
              <i style={{ '--h': '#5ff3e6' }} />
              <b>Product</b>
              <span>Featured</span>
            </div>
            <div>
              <i style={{ '--h': '#fdba74' }} />
              <b>Product</b>
              <span>Bestseller</span>
            </div>
            <div>
              <i style={{ '--h': '#c4b5fd' }} />
              <b>Product</b>
              <span>New arrival</span>
            </div>
          </div>
          <div className="b-toast">
            <Icon name="bag" />
            <div>
              <b>New order received</b>
              <span>UPI · Shipping label created</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

