import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../config/site';
import { useCatalogue } from '../context/CatalogueContext';
import { track } from '../lib/api';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import FlipCard from '../components/FlipCard';
import './Packages.css';

export default function Packages() {
  const { packages } = useCatalogue();
  const [flippedMap, setFlippedMap] = useState({});

  const toggleFlip = (pkg) => {
    setFlippedMap((prev) => {
      const next = !prev[pkg.id];
      if (next) track('package_flip', { packageId: pkg.id });
      return { ...prev, [pkg.id]: next };
    });
  };

  return (
    <section className="page-enter">
      <Helmet>
        <title>Packages — AtLa/BTS</title>
        <meta property="og:title" content="Packages — AtLa/BTS" />
        <meta
          name="description"
          content="Choose from Good, Great, Fantastic or Super monthly growth packages from AtLa/BTS — each including everything in the level below it."
        />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Growth Packages</Eyebrow>
            <h2>
              Four levels. <span className="grad">One direction: up.</span>
            </h2>
            <p>
              Tap a package to flip it and see what&apos;s included. Each level includes everything
              in the level below it.
            </p>
          </div>

          <div className="pkg-grid">
            {packages.map((p, i) => {
              const isTop = Boolean(p.is_topmost || i === 3);

              return (
                <FlipCard
                  key={p.id}
                  className={`pkg ${isTop ? 'top' : ''}`}
                  color={p.color}
                  flipped={Boolean(flippedMap[p.id])}
                  onFlip={() => toggleFlip(p)}
                  ariaLabel={`${p.name} package card, tap to flip`}
                  front={
                    <>
                      <div className="pk-hero">
                        <span className="sc-ring r1" />
                        <span className="sc-ring r2" />
                        <span className="pk-em" aria-hidden="true">
                          <Icon
                            name={p.icon}
                            color={isTop ? '#f5c451' : '#fff'}
                            wrap={false}
                          />
                        </span>
                        {isTop && (
                          <span className="crown">
                            <Icon name="crown" color="#3a2a00" wrap={false} /> TOPMOST
                          </span>
                        )}
                        <span className="tier">{p.tier}</span>
                        <h3>{p.name}</h3>
                        <div className="motto">{p.motto}</div>
                        <div className="price">Custom pricing</div>
                      </div>

                      <div className="pk-body">
                        <div className="pk-worth">{p.inc.length} services included</div>
                        <p className="vision">{p.vision}</p>
                        <div className="meter" aria-hidden="true">
                          {[0, 1, 2, 3].map((k) => (
                            <i key={k} className={k <= i ? 'f' : undefined} />
                          ))}
                        </div>
                        <div className="sc-foot">
                          Tap to see your future{' '}
                          <i>
                            <Icon name="refresh" color="#fff" wrap={false} />
                          </i>
                        </div>
                      </div>
                    </>
                  }
                  back={
                    <>
                      <div className="sc-bhead">
                        <div className="mi">
                          <Icon
                            name={p.icon}
                            color={isTop ? '#f5c451' : '#fff'}
                            wrap={false}
                          />
                        </div>
                        <div>
                          <small>{p.tier}</small>
                          <b>{p.name}</b>
                        </div>
                      </div>
                      <ul>
                        {p.lines.map((l) => (
                          <li key={l[0]}>
                            <b>{l[0]}</b>
                            <span>{l[1]}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        className="btn btn-primary pk-btn"
                        href={SITE_CONFIG.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          track('negotiate_click', {
                            source: 'package_negotiate',
                            package_id: p.id,
                          });
                        }}
                      >
                        Let&apos;s negotiate →
                      </a>
                    </>
                  }
                />
              );
            })}
          </div>

          <p className="fineprint">
            Every package can be tailored for startups, SMEs, enterprises and multi-location
            businesses.
          </p>
        </div>
      </div>
    </section>
  );
}
