import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Icon from '../Icon';
import { useCatalogue } from '../../context/CatalogueContext';
import { useModals } from '../../context/ModalContext';
import { SITE_CONFIG } from '../../config/site';
import './Footer.css';

export default function Footer() {
  const { practices } = useCatalogue();
  const { openPractice } = useModals();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot glass">
          <div>
            <Link className="brand" to="/" style={{ marginBottom: '14px' }}>
              <Logo lazy />
              <div className="brand-txt">
                <b>{SITE_CONFIG.brand}</b>
                <span>{SITE_CONFIG.subtitle}</span>
              </div>
            </Link>
            <p className="foot-blurb">
              AtLa/BTS: growth, brand, AI, platforms and learning under one roof, for startups, SMEs,
              enterprises and institutions.
            </p>
          </div>

          <div>
            <h2 className="foot-heading">Practices</h2>
            <div className="foot-links">
              {practices.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="foot-link-btn"
                  onClick={() => openPractice(p.id)}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="foot-heading">Explore</h2>
            <Link to="/about">About us</Link>
            <Link to="/services">All services</Link>
            <Link to="/service-cocktail">Service Cocktail</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/academy">ATLA Academy</Link>
          </div>

          <div>
            <h2 className="foot-heading">Connect</h2>
            <Link to="/contact">Contact</Link>
            <a
              className="foot-ig"
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="instagram" color="var(--brand-teal)" wrap={false} />
              <span>
                DM us on Instagram · <b>{SITE_CONFIG.instagramHandle}</b>
              </span>
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
          </div>
        </div>
        <p className="copy">
          © {year} AtLa/BTS · Business Transformation System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
