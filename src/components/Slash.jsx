import './Slash.css';

export default function Slash({
  size = 76,
  animated = true,
  className = '',
  label = 'Slash, AI Success Manager',
}) {
  return (
    <span
      className={`slash-bot ${animated ? 'is-animated' : ''} ${className}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="slash-shell" x1="16" y1="16" x2="80" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8fbfa" />
            <stop offset="100%" stopColor="#bfeff0" />
          </linearGradient>
          <linearGradient id="slash-visor" x1="24" y1="36" x2="72" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#08514d" />
            <stop offset="100%" stopColor="#018087" />
          </linearGradient>
          <linearGradient id="slash-accent" x1="30" y1="24" x2="66" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#19d3c5" />
            <stop offset="100%" stopColor="#0fb5ad" />
          </linearGradient>
        </defs>

        {/* Subtle signal halo & antenna */}
        <path
          d="M48 11v9"
          stroke="#0fb5ad"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="48" cy="9" r="3.2" fill="#19d3c5" stroke="#08514d" strokeWidth="1.8" />
        <path
          d="M36 16c3.4-2.8 7.5-4.2 12-4.2s8.6 1.4 12 4.2"
          stroke="#0fb5ad"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Side ear pods */}
        <rect
          x="10"
          y="42"
          width="8"
          height="20"
          rx="4"
          fill="url(#slash-accent)"
          stroke="#08514d"
          strokeWidth="2.2"
        />
        <rect
          x="78"
          y="42"
          width="8"
          height="20"
          rx="4"
          fill="url(#slash-accent)"
          stroke="#08514d"
          strokeWidth="2.2"
        />

        {/* Rounded orb head */}
        <rect
          x="18"
          y="22"
          width="60"
          height="58"
          rx="26"
          fill="url(#slash-shell)"
          stroke="#08514d"
          strokeWidth="2.4"
        />

        {/* Angled slash-inspired visor */}
        <path
          d="M27 42.5C27 36.7 31.7 32 37.5 32h21C64.3 32 69 36.7 69 42.5v13C69 61.3 64.3 66 58.5 66h-21C31.7 66 27 61.3 27 55.5v-13z"
          fill="url(#slash-visor)"
          stroke="#08514d"
          strokeWidth="2"
        />

        {/* Signature AtLa/BTS slash gleam across visor */}
        <path
          d="M53.5 35.5L42.5 62.5"
          stroke="#19d3c5"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Friendly AI eyes */}
        <circle cx="38" cy="49" r="3.6" fill="#ffffff" />
        <circle cx="58" cy="49" r="3.6" fill="#ffffff" />
        <circle cx="39" cy="48" r="1.2" fill="#19d3c5" />
        <circle cx="59" cy="48" r="1.2" fill="#19d3c5" />

        {/* Warm smile & collar base */}
        <path
          d="M42.5 72.5c3.2 2 7.8 2 11 0"
          stroke="#018087"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M35 84h26"
          stroke="#0fb5ad"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}

