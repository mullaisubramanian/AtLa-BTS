import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fmt } from '../lib/format';
import { useCatalogue } from '../context/CatalogueContext';
import { useModals } from '../context/ModalContext';
import { track } from '../lib/api';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import FlipCard from '../components/FlipCard';
import './Packages.css';

export default function Packages() {
  const { packages, menu } = useCatalogue();
  const { openQuickEnquiry } = useModals();
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
        <title>Packages — ATLABTS</title>
        <meta
          name="description"
          content="Choose from Good, Great, Fantastic or Super monthly growth packages from ATLABTS — each including everything in the level below it."
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
              const val = p.inc.reduce(
                (a, id) => a + (menu.find((m) => m.id === id)?.p || 0),
                0
              );
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
                        <div className="price">
                          {fmt(p.price)}
                          <small> / month</small>
                        </div>
                      </div>

                      <div className="pk-body">
                        <div className="pk-worth">
                          {p.inc.length} services · worth {fmt(val)}/month
                        </div>
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
                          <b>
                            {p.name} · {fmt(p.price)}/mo
                          </b>
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
                      <button
                        type="button"
                        className="btn btn-primary pk-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickEnquiry({
                            source: 'package_negotiate',
                            title: `Negotiate ${p.name} Package`,
                            packageId: p.id,
                            packageName: p.name,
                            packagePrice: p.price,
                            packageColor: p.color,
                            defaultMessage: `Let's negotiate the ${p.name} package.`,
                          });
                        }}
                      >
                        Let&apos;s negotiate →
                      </button>
                    </>
                  }
                />
              );
            })}
          </div>

          <p className="fineprint">
            Monthly retainers with a 3-month minimum. Ad spend, creator fees and third-party
            licences are paid at actuals. GST extra. Every package can be customised for enterprises
            and multi-location businesses.
          </p>
        </div>
      </div>
    </section>
  );
}
