import Eyebrow from './Eyebrow';
import {
  INDIA_DETAIL_PATHS,
  INDIA_PINS,
  INDIA_VIEWBOX,
  WORLD_COUNTRY_PATHS,
  WORLD_INDIA_PATHS,
  WORLD_PINS,
  WORLD_VIEWBOX,
} from '../data/maps';
import './LocationsSection.css';

function pinTextProps(pin) {
  switch (pin.align) {
    case 'top':
      return { dx: 0, dy: -13, anchor: 'middle', subDy: -25 };
    case 'bottom':
      return { dx: 0, dy: 18, anchor: 'middle', subDy: 31 };
    case 'left-top':
      return { dx: -11, dy: -4, anchor: 'end', subDy: 9 };
    case 'left-bottom':
      return { dx: -11, dy: 6, anchor: 'end', subDy: 19 };
    case 'right':
      return { dx: 11, dy: 4, anchor: 'start', subDy: 17 };
    default:
      return { dx: 0, dy: -12, anchor: 'middle', subDy: -24 };
  }
}

export default function LocationsSection() {
  return (
    <section className="section locations-sec" id="locations" aria-labelledby="locations-heading">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Global footprint</Eyebrow>
          <h2 id="locations-heading">
            Clients &amp; <span className="grad">reach</span>
          </h2>
          <p>
            Headquartered in Coimbatore, delivering brand, software and AI systems across India and
            international markets.
          </p>
        </div>

        <div className="loc-grid">
          <div className="loc-card neu" aria-hidden="true">
            <div className="loc-card-head">
              <span className="loc-card-label">Global reach</span>
              <span className="loc-card-sub">US · UK · Europe · India</span>
            </div>
            <svg className="loc-svg loc-svg-world" viewBox={WORLD_VIEWBOX} fill="none">
              <g className="loc-world-base">
                {WORLD_COUNTRY_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
              <g className="loc-india-highlight">
                {WORLD_INDIA_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
              {WORLD_PINS.map((pin) => {
                const { dx, dy, anchor, subDy } = pinTextProps(pin);
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    className={`loc-pin ${pin.home ? 'is-home' : ''}`}
                  >
                    <circle r="10" className="loc-pin-pulse" />
                    <circle r="4.2" className="loc-pin-dot" />
                    <text x={dx} y={dy} textAnchor={anchor} className="loc-pin-label">
                      {pin.label}
                    </text>
                    {pin.sub && (
                      <text x={dx} y={subDy} textAnchor={anchor} className="loc-pin-sub">
                        {pin.sub}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="loc-card neu" aria-hidden="true">
            <div className="loc-card-head">
              <span className="loc-card-label">India hubs</span>
              <span className="loc-card-sub">South India studio &amp; client corridor</span>
            </div>
            <svg className="loc-svg loc-svg-india" viewBox={INDIA_VIEWBOX} fill="none">
              <g className="loc-india-detail">
                {INDIA_DETAIL_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
              {INDIA_PINS.map((pin) => {
                const { dx, dy, anchor, subDy } = pinTextProps(pin);
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    className={`loc-pin ${pin.home ? 'is-home' : ''}`}
                  >
                    <circle r="12" className="loc-pin-pulse" />
                    <circle r="5" className="loc-pin-dot" />
                    <text x={dx} y={dy} textAnchor={anchor} className="loc-pin-label">
                      {pin.label}
                    </text>
                    {pin.sub && (
                      <text x={dx} y={subDy} textAnchor={anchor} className="loc-pin-sub">
                        {pin.sub}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <p className="loc-summary">
          Serving clients in Coimbatore, Chennai, Bangalore, the United States, London, Scotland and
          Germany.
        </p>
      </div>
    </section>
  );
}

