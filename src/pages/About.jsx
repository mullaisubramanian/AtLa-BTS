import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import './About.css';

const PRINCIPLES = [
  [
    'link',
    'Connected',
    'Strategy, brand, demand, operations, data and people are designed together, so every layer strengthens the others.',
  ],
  [
    'repeat',
    'Repeatable',
    'Every engagement runs on the same 5D rhythm (Diagnose, Design, Deploy, Drive, Develop), refined across industries.',
  ],
  [
    'ruler',
    'Measurable',
    "Each layer has its own KPIs on a live dashboard. If it can't be measured, it isn't in the plan.",
  ],
  [
    'refresh',
    'Self-improving',
    'Results feed back into the next cycle, and your team is trained to run it, so the system keeps getting better even after we step back.',
  ],
];

const VALUES = [
  ['A', 'Ambition', 'We aim for category leadership, not just presence.'],
  ['T', 'Trust', 'Transparent pricing, honest reporting, no vanity metrics.'],
  ['L', 'Learning', 'We teach what we do, so your capability grows with you.'],
  ['A', 'Automation', 'Machines do the repetitive work; people do the creative work.'],
  ['+', 'Impact', "If it doesn't move a business metric, we don't do it."],
];

const TIMELINE = [
  [
    '01',
    'Transformation Call (free)',
    'We learn your goals, constraints and market, and share quick wins straight away.',
  ],
  [
    '02',
    '360° Audit',
    'Brand, digital footprint, technology stack, AI-readiness and competitor benchmarking, delivered as a clear scorecard.',
  ],
  [
    '03',
    'Growth Blueprint',
    'A 90-day roadmap with priorities, KPIs and the right package or custom Service Cocktail.',
  ],
  [
    '04',
    'Build & Launch',
    'Our pod executes across brand, digital, platforms and AI in weekly sprints.',
  ],
  [
    '05',
    'Measure, Learn, Scale',
    "Live dashboards and monthly strategy reviews. We double down on what works and drop what doesn't.",
  ],
];

const BARS = [70, 120, 170, 230, 290];

export default function About() {
  return (
    <section className="page-enter">
      <Helmet>
        <title>About ATLABTS — ATLA Business Transformation System</title>
        <meta
          name="description"
          content="Learn how ATLABTS replaces luck with a repeatable, measurable 6-layer Business Transformation System for startups, SMEs, enterprises and institutions."
        />
      </Helmet>

      <div className="section">
        <div className="wrap about-hero">
          <div>
            <Eyebrow>About ATLABTS</Eyebrow>
            <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '18px 0' }}>
              We turn businesses into <span className="grad">future-ready brands.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
              ATLABTS (ATLA Business Transformation System) is a growth and transformation partner
              for startups, growing SMEs, established enterprises, institutions and leaders. We
              combine strategy, creativity, software engineering and AI so the businesses we work
              with can compete with, and beat, brands ten times their size.
            </p>
            <div className="mv">
              <div className="glass">
                <h4>
                  <Icon name="eye" /> Our Vision
                </h4>
                <p>
                  A world where every ambitious business, new or established, has access to
                  enterprise-grade brand, technology and AI.
                </p>
              </div>
              <div className="glass">
                <h4>
                  <Icon name="rocket" /> Our Mission
                </h4>
                <p>
                  To design, build and run the growth systems that make our clients more visible,
                  more efficient and more valuable every quarter.
                </p>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '460px', margin: 'auto', width: '100%' }}>
            <svg viewBox="0 0 400 400" width="100%" role="img" aria-label="Today to Transformed growth chart">
              <defs>
                <linearGradient id="ag" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#08514d" />
                  <stop offset="1" stopColor="#19d3c5" />
                </linearGradient>
              </defs>
              <rect
                x="40"
                y="40"
                width="320"
                height="320"
                rx="40"
                fill="rgba(255,255,255,.5)"
                stroke="#fff"
                strokeWidth="2"
              />
              {BARS.map((g, i) => (
                <rect
                  key={g}
                  x={78 + i * 52}
                  y={320 - g}
                  width="34"
                  height={g}
                  rx="10"
                  fill="url(#ag)"
                  opacity={0.45 + i * 0.12}
                />
              ))}
              <path
                d="M80 250 C140 230 170 190 220 150 S310 70 330 60"
                fill="none"
                stroke="#fb7185"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="330" cy="60" r="9" fill="#fb7185" />
              <text x="70" y="78" fontFamily="Sora" fontWeight="700" fontSize="16" fill="#08514d">
                Today → Transformed
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Why &quot;System&quot;</Eyebrow>
            <h2>
              A <span className="grad">systematic approach</span> to business growth
            </h2>
            <p>
              Growth that depends on one viral post, one star salesperson or one founder working
              16-hour days isn&apos;t growth. It&apos;s luck. We named ATLABTS the{' '}
              <b>
                Business Transformation <u>System</u>
              </b>{' '}
              because we replace luck with a repeatable, measurable method.
            </p>
          </div>

          <div className="principles">
            {PRINCIPLES.map(([icon, title, desc]) => (
              <div key={title} className="principle neu">
                <div className="em">
                  <Icon name={icon} />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link className="btn btn-neu" to="/#system">
              See the six layers of the system →
            </Link>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>What we stand for</Eyebrow>
            <h2>
              The <span className="grad">ATLA</span> values
            </h2>
          </div>

          <div className="values">
            {VALUES.map(([letter, title, desc]) => (
              <div key={title} className="value neu">
                <div className="big grad">{letter}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>How we work</Eyebrow>
            <h2>
              From first call to <span className="grad">compounding growth</span>
            </h2>
          </div>

          <div className="timeline">
            {TIMELINE.map(([num, title, desc]) => (
              <div key={num} className="tl">
                <div className="n">{num}</div>
                <div className="glass">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

