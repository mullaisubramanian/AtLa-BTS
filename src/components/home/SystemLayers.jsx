import { useState } from 'react';
import { LAYERS } from '../../data/layers';
import { useModals } from '../../context/ModalContext';
import Eyebrow from '../Eyebrow';
import './SystemLayers.css';

export default function SystemLayers() {
  const [hovered, setHovered] = useState(-1);
  const { openPractice } = useModals();

  const reversedLayers = [...LAYERS].reverse();

  return (
    <div className="section" id="system">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>The ATLA Business Transformation System</Eyebrow>
          <h2>
            Not a list of services. <span className="grad">A system for growth.</span>
          </h2>
          <p>
            BTS stands for <b>Business Transformation System</b>. Most businesses buy marketing
            from one agency, software from another and training from a third, and the pieces never
            connect. Our system links six layers so every action feeds the next.
          </p>
        </div>

        <div className="sys-grid">
          <svg
            className="sys-svg"
            viewBox="0 0 320 420"
            role="img"
            aria-label="ATLA 6-layer isometric system diagram"
          >
            <defs>
              <filter id="ssh">
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="8"
                  floodColor="#08514d"
                  floodOpacity="0.22"
                />
              </filter>
              <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {reversedLayers.map((l, ri) => {
              const i = LAYERS.length - 1 - ri;
              const y = 56 + i * 64;
              return (
                <g
                  key={l.n}
                  className={`slab ${hovered === i ? 'hl' : ''}`}
                  filter="url(#ssh)"
                  role="button"
                  tabIndex={0}
                  aria-label={`Layer ${i + 1}: ${l.n}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => openPractice(l.p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openPractice(l.p);
                    }
                  }}
                >
                  <path
                    d={`M40 ${y} L160 ${y + 30} L160 ${y + 46} L40 ${y + 16}Z`}
                    fill={l.c}
                    opacity="0.75"
                  />
                  <path
                    d={`M160 ${y + 30} L280 ${y} L280 ${y + 16} L160 ${y + 46}Z`}
                    fill={l.c}
                  />
                  <path
                    d={`M160 ${y - 30} L280 ${y} L160 ${y + 30} L40 ${y}Z`}
                    fill={l.c}
                    opacity="0.92"
                  />
                  <path
                    d={`M160 ${y - 30} L280 ${y} L160 ${y + 30} L40 ${y}Z`}
                    fill="url(#shine)"
                  />
                  <text
                    x="160"
                    y={y + 5}
                    textAnchor="middle"
                    fontFamily="Sora"
                    fontWeight="700"
                    fontSize="13"
                    fill="#fff"
                  >
                    L{i + 1} · {l.n}
                  </text>
                </g>
              );
            })}
          </svg>

          <div>
            <div className="layers">
              {LAYERS.map((l, i) => (
                <button
                  key={l.n}
                  type="button"
                  className={`layer-card glass ${hovered === i ? 'hl' : ''}`}
                  style={{ '--c': l.c }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => openPractice(l.p)}
                >
                  <span className="ln">L{i + 1}</span>
                  <div>
                    <h4>{l.n} Layer</h4>
                    <p>{l.d}</p>
                    <small>{l.k} →</small>
                  </div>
                </button>
              ))}
            </div>
            <div className="sys-quote glass">
              <b>How the layers compound:</b> a sharper brand makes ads cheaper. Automation makes
              more leads convert. Data shows where to invest next. Training makes the gains stick.
              That&apos;s growth by system, not by chance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

