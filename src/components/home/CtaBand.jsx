import { Link } from 'react-router-dom';
import './CtaBand.css';

export default function CtaBand() {
  return (
    <div className="wrap">
      <div className="cta-band">
        <h2>Ready to see your business&apos;s next version?</h2>
        <p>
          Book a free 30-minute transformation call. You&apos;ll leave with three quick wins,
          whether or not we work together.
        </p>
        <Link className="btn btn-neu" to="/get-started">
          Get your free growth audit →
        </Link>
      </div>
    </div>
  );
}

