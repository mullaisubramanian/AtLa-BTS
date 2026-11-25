import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/nav';
import './MobileMenu.css';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <ul id="mobile-nav-menu" className="mobile-menu open" role="menu">
      {NAV_ITEMS.map((item) => (
        <li key={item.to} role="none">
          <NavLink
            to={item.to}
            end={item.end}
            role="menuitem"
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
