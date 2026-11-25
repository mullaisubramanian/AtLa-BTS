import { Link } from 'react-router-dom';
import './FloatingTalkButton.css';

export default function FloatingTalkButton() {
  return (
    <Link className="fab" to="/contact" aria-label="Talk to us">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-5A8 8 0 1121 12z" />
        <path d="M8.5 11h7M8.5 14h4" />
      </svg>
    </Link>
  );
}

