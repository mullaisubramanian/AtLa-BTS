import { useReducedMotion } from '../../lib/useReducedMotion';
import Eyebrow from '../Eyebrow';
import './FiveDLoop.css';

const STEPS = [
  {
    code: 'D1',
    title: 'Diagnose',
    color: '#0fb5ad',
    desc: 'A 360° audit of brand, digital footprint, operations, technology, data and team capability, delivered as a scorecard.',
  },
  {
    code: 'D2',
    title: 'Design',
    color: '#6366f1',
    desc: 'A growth blueprint: the priority layers, the KPIs for each, a 90-day roadmap and the right package.',
  },
  {
    code: 'D3',
    title: 'Deploy',
    color: '#10b981',
    desc: 'Our pod builds and launches across brand, demand, platforms and AI in weekly sprints.',
  },
  {
    code: 'D4',
    title: 'Drive',
    color: '#06b6d4',
    desc: "Live dashboards and monthly reviews. We scale what works, cut what doesn't, and the system learns.",
  },
  {
    code: 'D5',
    title: 'Develop',
    color: '#a78bfa',
    desc: 'ATLA Academy trains your people so the capability stays inside your business. Then the cycle repeats at a higher level.',
  },
];

export default function FiveDLoop() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="section">
      <div className="wrap loop-grid">
        <svg
          className="loop-svg"
          viewBox="0 0 400 400"
          role="img"
          aria-label="ATLA 5D Operating Rhythm: Diagnose, Design, Deploy, Drive, Develop"
        >
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#19d3c5" />
              <stop offset="1" stopColor="#08514d" />
            </linearGradient>
            <filter id="sh">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="10"
                floodColor="#08514d"
                floodOpacity="0.18"
              />
            </filter>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="url(#ring)"
            strokeWidth="3"
            strokeDasharray="4 10"
          >
            {!reducedMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="40s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle
            cx="200"
            cy="200"
            r="92"
            fill="rgba(255,255,255,.55)"
            stroke="#fff"
            strokeWidth="2"
            filter="url(#sh)"
          />
          <text
            x="200"
            y="192"
            textAnchor="middle"
            fontFamily="Sora"
            fontWeight="800"
            fontSize="22"
            fill="#08514d"
          >
            ATLA
          </text>
          <text
            x="200"
            y="216"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans"
            fontWeight="700"
            fontSize="11"
            letterSpacing="3"
            fill="#0fb5ad"
          >
            5D SYSTEM
          </text>
          {STEPS.map((s, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const x = 200 + 150 * Math.cos(a);
            const y = 200 + 150 * Math.sin(a);
            return (
              <g key={s.code}>
                <g filter="url(#sh)">
                  <circle cx={x} cy={y} r="34" fill="#e7f3f2" />
                  <circle cx={x} cy={y} r="26" fill={s.color} />
                </g>
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontFamily="Sora"
                  fontWeight="700"
                  fontSize="13"
                  fill="#fff"
                >
                  {s.code}
                </text>
                <text
                  x={x}
                  y={y + (y > 200 ? 52 : -42)}
                  textAnchor="middle"
                  fontFamily="Sora"
                  fontWeight="700"
                  fontSize="13"
                  fill="#0d2a30"
                >
                  {s.title}
                </text>
              </g>
            );
          })}
        </svg>

        <div>
          <Eyebrow>How the system runs</Eyebrow>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', margin: '16px 0 22px' }}>
            The <span className="grad">5D operating rhythm</span>
          </h2>
          <div className="steps">
            {STEPS.map((s) => (
              <div key={s.code} className="step glass">
                <div className="num">{s.code}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

