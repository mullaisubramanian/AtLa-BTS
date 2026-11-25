import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Eyebrow from '../components/Eyebrow';

export default function NotFound() {
  return (
    <section className="page-enter">
      <Helmet>
        <title>Page Not Found — ATLABTS</title>
        <meta name="description" content="The requested page could not be found." />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="neu" style={{ padding: '56px 32px', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <Eyebrow>404</Eyebrow>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', margin: '18px 0 12px' }}>
              Page not <span className="grad">found</span>
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '26px' }}>
              That route doesn&apos;t exist in the ATLA Business Transformation System. Head back
              home or explore our 11 practices.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to="/">
                Back to Home →
              </Link>
              <Link className="btn btn-neu" to="/services">
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

