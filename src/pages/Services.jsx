import { useMemo, useState } from 'react';
import { countServices } from '../data/practices';
import { useCatalogue } from '../context/CatalogueContext';
import { useModals } from '../context/ModalContext';
import { track } from '../lib/api';
import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import Icon from '../components/Icon';
import FlipCard from '../components/FlipCard';
import './Services.css';

export default function Services() {
  const { practices, allServices } = useCatalogue();
  const { openPractice } = useModals();
  const [query, setQuery] = useState('');
  const [flippedMap, setFlippedMap] = useState({});

  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length >= 2;

  const hits = useMemo(() => {
    if (!isSearching) return [];
    return allServices
      .filter((a) =>
        `${a.n} ${a.d} ${a.seg} ${a.p.title}`.toLowerCase().includes(trimmed)
      )
      .slice(0, 30);
  }, [isSearching, trimmed, allServices]);

  const toggleFlip = (id) => {
    setFlippedMap((prev) => {
      const next = !prev[id];
      if (next) track('service_card_flip', { practiceId: id });
      return { ...prev, [id]: next };
    });
  };

  const servicesSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'AtLa/BTS Services & 11 Practices',
      itemListElement: practices.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Service',
          name: p.title,
          description: p.tag,
          url: `https://www.atlabts.com/services#${p.id}`,
          provider: {
            '@type': 'ProfessionalService',
            name: 'AtLa/BTS',
            url: 'https://www.atlabts.com',
          },
        },
      })),
    }),
    [practices]
  );

  return (
    <section className="page-enter">
      <Seo
        title="Services — AtLa/BTS | 11 Growth Practices"
        description="Explore 11 practices and 300+ services across digital growth, web, AI search (SEO/AEO/GEO), AI agents, ERP/CRM, branding, data and ATLA Academy."
        path="/services"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
        extraSchema={servicesSchema}
      />

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Services</Eyebrow>
            <h1>
              Tap a card. <span className="grad">See your future.</span>
            </h1>
            <p>
              Each card flips to show the main services in that practice. Tap <b>Explore all</b> to
              see every service and the impact it has on your business.
            </p>
          </div>

          <div className="svc-tools">
            <div className="search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0fb5ad"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-5-5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search services"
                placeholder="Search services — e.g. ERP, WhatsApp, GEO, payroll, Reels…"
              />
            </div>
          </div>

          {isSearching ? (
            <div className="results show">
              {hits.length > 0 ? (
                hits.map((h) => (
                  <button
                    key={`${h.p.id}-${h.seg}-${h.n}`}
                    type="button"
                    className="res glass"
                    style={{ '--c': h.p.c }}
                    onClick={() => openPractice(h.p.id, h.seg)}
                  >
                    <small>
                      {h.p.title} · {h.seg}
                    </small>
                    <b>{h.n}</b>
                    <p>{h.d}</p>
                  </button>
                ))
              ) : (
                <div className="res glass" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <b>No exact match. Talk to us; we probably do it.</b>
                </div>
              )}
            </div>
          ) : (
            <div className="flip-grid">
              {practices.map((p, idx) => {
                const total = countServices(p);
                const hl = p.segs.slice(0, 4).map((s) => s[1][0]);
                const sc = p.segs.map((s) => s[0].split(' (')[0].split(':')[0]);
                const pills = [
                  p.segs[0][1][0][0],
                  p.segs[1] ? p.segs[1][1][0][0] : '',
                ]
                  .map((t) => t.split(' (')[0])
                  .filter(Boolean);

                return (
                  <FlipCard
                    key={p.id}
                    className="svc-card"
                    color={p.c}
                    flipped={Boolean(flippedMap[p.id])}
                    onFlip={() => toggleFlip(p.id)}
                    ariaLabel={`${p.title} practice card, tap to flip`}
                    front={
                      <>
                        <div className="sc-hero">
                          <span className="sc-ring r1" />
                          <span className="sc-ring r2" />
                          <div className="sc-mark" aria-hidden="true">
                            <Icon name={p.id} color="#fff" wrap={false} />
                          </div>
                          <span className="sc-num">
                            {String(idx + 1).padStart(2, '0')} /{' '}
                            {String(practices.length).padStart(2, '0')}
                          </span>
                          <span className="sc-count">{total} services</span>
                          <div className="sc-icon">
                            <Icon name={p.id} color="#fff" wrap={false} />
                          </div>
                          <div className="sc-pills">
                            {pills.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </div>

                        <div className="sc-body">
                          <h2>{p.title}</h2>
                          <p>{p.tag}</p>
                          <div className="segchips">
                            {sc.slice(0, 3).map((s) => (
                              <span key={s}>{s}</span>
                            ))}
                            {sc.length > 3 && <span>+{sc.length - 3} more</span>}
                          </div>
                          <div className="sc-foot">
                            Tap to flip &amp; preview{' '}
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
                            <Icon name={p.id} color="#fff" wrap={false} />
                          </div>
                          <div>
                            <small>What you get</small>
                            <b>{p.title}</b>
                          </div>
                        </div>
                        <ul>
                          {hl.map((h) => (
                            <li key={h[0]}>
                              <b>{h[0]}</b>
                              <span>{h[1]}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPractice(p.id);
                          }}
                        >
                          Explore all {total} services →
                        </button>
                      </>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

