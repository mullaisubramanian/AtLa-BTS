import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import {
  WORLD_COUNTRY_PATHS,
  WORLD_INDIA_PATHS,
  WORLD_PINS,
  WORLD_VIEWBOX,
} from '../data/maps';
import './LocationsSection.css';

function computeArc(home, target) {
  const dx = target.x - home.x;
  const dy = target.y - home.y;
  const dist = Math.hypot(dx, dy);
  const mx = (home.x + target.x) * 0.5;
  const my = (home.y + target.y) * 0.5;
  // Lift long arcs upward cleanly; arch India domestic hops outward nicely
  const lift =
    target.id === 'chennai'
      ? -18
      : target.id === 'bangalore'
      ? -14
      : Math.min(82, Math.max(24, dist * 0.24));
  const cx =
    target.id === 'chennai'
      ? mx + 12
      : target.id === 'bangalore'
      ? mx - 12
      : mx;
  const cy = my - lift;
  return `M ${home.x} ${home.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${target.x} ${target.y}`;
}

export default function LocationsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      return;
    }
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const homePin = useMemo(
    () => WORLD_PINS.find((p) => p.home) || WORLD_PINS[WORLD_PINS.length - 1],
    []
  );
  const targetPins = useMemo(() => WORLD_PINS.filter((p) => !p.home), []);

  return (
    <section
      ref={sectionRef}
      className="section locations-sec"
      id="locations"
      aria-labelledby="locations-heading"
    >
      <div className="wrap">
        <div className="sec-head">
          <h2 id="locations-heading">
            Global <span className="grad">footprint</span>
          </h2>
          <p>
            Headquartered in Coimbatore, connecting strategy, engineering and AI delivery across
            India and international markets.
          </p>
        </div>

        <div className="loc-card loc-card-full neu" aria-hidden="true">
          <svg className="loc-svg loc-svg-world" viewBox={WORLD_VIEWBOX} fill="none">
            <g className="loc-world-base">
              {WORLD_COUNTRY_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>

            {/* India always drawn after neighbors using official Survey of India composite outline */}
            <g className="loc-india-highlight">
              {WORLD_INDIA_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>

            {/* Curved connection arcs from Coimbatore to every pin */}
            <g className={`loc-arcs ${inView ? 'is-drawn' : ''} ${reducedMotion ? 'is-reduced' : ''}`}>
              {targetPins.map((target, idx) => (
                <path
                  key={target.id}
                  d={computeArc(homePin, target)}
                  className="loc-arc"
                  style={{ '--arc-delay': `${idx * 110}ms` }}
                />
              ))}
            </g>

            {WORLD_PINS.map((pin) => {
              const labelX = pin.lx || 0;
              const labelY = pin.ly || -12;
              return (
                <g
                  key={pin.id}
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className={`loc-pin ${pin.home ? 'is-home' : ''}`}
                >
                  {pin.leader && (
                    <line
                      x1="0"
                      y1="0"
                      x2={labelX * 0.85}
                      y2={labelY * 0.85}
                      className="loc-leader"
                    />
                  )}
                  <circle r={pin.home ? 13 : 9} className="loc-pin-pulse" />
                  <circle r={pin.home ? 5.8 : 3.6} className="loc-pin-dot" />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={pin.anchor || 'middle'}
                    className={`loc-pin-label ${pin.home ? 'is-home' : ''}`}
                  >
                    {pin.label}
                  </text>
                  {pin.sub && (
                    <text
                      x={labelX}
                      y={labelY + 11.5}
                      textAnchor={pin.anchor || 'middle'}
                      className="loc-pin-sub"
                    >
                      {pin.sub}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <p className="loc-summary">
          Serving clients in Coimbatore, Chennai, Bangalore, the United States, London, Scotland and
          Germany.
        </p>
      </div>
    </section>
  );
}
