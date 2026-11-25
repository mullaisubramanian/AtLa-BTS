import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import MobileMenu from './MobileMenu';
import { SITE_CONFIG } from '../../config/site';
import { NAV_ITEMS } from '../../data/nav';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <nav className="nav glass" aria-label="Primary navigation">
        <Link className="brand" to="/">
          <Logo />
          <div className="brand-txt">
            <b>{SITE_CONFIG.brand}</b>
            <span>{SITE_CONFIG.subtitle}</span>
          </div>
        </Link>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link className="btn btn-primary nav-cta" to="/get-started">
          Get Started
        </Link>

        <button
          type="button"
          className="burger"
          aria-label={menuOpen ? 'Close menu' : 'Menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#08514d"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
