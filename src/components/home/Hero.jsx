import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../../context/CatalogueContext';
import { useReducedMotion } from '../../lib/useReducedMotion';
import Eyebrow from '../Eyebrow';
import Icon from '../Icon';
import CommandCenterDashboard from './CommandCenterDashboard';
import './Hero.css';

const ROTATING_WORDS = ['grows.', 'automates.', 'sells.', 'scales.', 'leads.', 'lasts.'];

export default function Hero() {
  const { allServices } = useCatalogue();
  const [wordIndex, setWordIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const reducedMotion = useReducedMotion();

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${((i * 37 + 13) % 97) + 1}%`,
        top: `${((i * 53 + 7) % 95) + 2}%`,
        delay: `${-((i * 0.43) % 4).toFixed(2)}s`,
      })),
    []
  );

  useEffect(() => {
    if (reducedMotion) return;
    let swapTimer = null;
    const interval = window.setInterval(() => {
      setFadingOut(true);
      swapTimer = window.setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setFadingOut(false);
      }, 420);
    }, 2400);

    return () => {
      window.clearInterval(interval);
      if (swapTimer) window.clearTimeout(swapTimer);
    };
  }, [reducedMotion]);

  return (
    <div className="hero">
      <div className="stars" aria-hidden="true">
        {stars.map((s) => (
          <span
            key={s.id}
            style={{ left: s.left, top: s.top, animationDelay: s.delay }}
          />
        ))}
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <Eyebrow>AtLa/BTS</Eyebrow>
            <h1>
              Build a business that
              <br />
              <span className={`rot ${fadingOut ? 'out' : ''}`}>
                {ROTATING_WORDS[wordIndex]}
              </span>
            </h1>
            <p className="lead">
              One partner for growth, brand, websites, AI and technology. Whether you&apos;re a
              startup finding traction, a growing SME that needs systems, or an established
              enterprise ready for its next leap, we handle the strategy, the build and the running
              of it.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" to="/get-started">
                Get Started →
              </Link>
              <Link className="btn btn-neu" to="/services">
                Explore 300+ services
              </Link>
              <Link className="btn btn-neu" to="/service-cocktail">
                <Icon name="cocktail" color="currentColor" /> Mix a Service Cocktail
              </Link>
            </div>
            <div className="aud">
              <span>Startups</span>
              <span>Growing SMEs</span>
              <span>Established enterprises</span>
              <span>Institutions</span>
              <span>Founders &amp; leaders</span>
            </div>
          </div>

          <CommandCenterDashboard />
        </div>

        <div className="hero-foot">
          <div>
            <b>6 layers</b>
            <span>One growth system, 11 practices</span>
          </div>
          <div>
            <b>{allServices.length}</b>
            <span>Services, each tied to an outcome</span>
          </div>
          <div>
            <b>SEO · AEO · GEO</b>
            <span>Visible on Google and in AI answers</span>
          </div>
          <div>
            <b>SaaS · ERP · CRM</b>
            <span>Custom platforms that run your business</span>
          </div>
        </div>
      </div>
    </div>
  );
}

