import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countServices } from '../data/practices';
import { useCatalogue } from '../context/CatalogueContext';
import { useModals } from '../context/ModalContext';
import { useFocusTrap } from '../lib/useFocusTrap';
import Icon from './Icon';
import './PracticeModal.css';

export default function PracticeModal() {
  const { practices } = useCatalogue();
  const { practiceModal, closePractice, openQuickEnquiry } = useModals();
  const navigate = useNavigate();

  const { open, practiceId, segmentName } = practiceModal;
  const practice = useMemo(
    () => practices.find((x) => x.id === practiceId) || null,
    [practices, practiceId]
  );

  const [activeTab, setActiveTab] = useState(0);
  const bodyRef = useRef(null);
  const segRefs = useRef([]);
  const tabRefs = useRef([]);
  const trapRef = useFocusTrap(open && Boolean(practice), closePractice);

  useEffect(() => {
    if (!open || !practice) return;
    setActiveTab(0);
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
    if (segmentName) {
      const idx = practice.segs.findIndex((s) => s[0] === segmentName);
      if (idx >= 0) {
        const timer = window.setTimeout(() => {
          scrollToSegment(idx);
        }, 80);
        return () => window.clearTimeout(timer);
      }
    }
  }, [open, practice, segmentName]);

  const scrollToSegment = (index) => {
    const body = bodyRef.current;
    const segEl = segRefs.current[index];
    if (!body || !segEl) return;
    setActiveTab(index);
    body.scrollTo({
      top: segEl.offsetTop - body.offsetTop - 6,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const body = bodyRef.current;
    if (!body || !practice) return;
    let cur = 0;
    practice.segs.forEach((_, i) => {
      const el = segRefs.current[i];
      if (el && el.offsetTop - body.offsetTop - 40 <= body.scrollTop) {
        cur = i;
      }
    });
    setActiveTab((prev) => {
      if (prev !== cur && tabRefs.current[cur]) {
        tabRefs.current[cur].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      return cur;
    });
  };

  if (!open || !practice) return null;

  const totalCount = countServices(practice);
  let itemCounter = 0;

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePractice();
      }}
    >
      <div className="modal-box" ref={trapRef}>
        <div className="m-top">
          <button
            type="button"
            className="close"
            onClick={closePractice}
            aria-label="Close"
          >
            ×
          </button>
          <div className="m-head">
            <div className="ic">
              <Icon name={practice.id} color={practice.c} wrap={false} />
            </div>
            <div>
              <small>Practice · {totalCount} services</small>
              <h2 id="practice-modal-title">{practice.title}</h2>
            </div>
          </div>
          <div className="m-tabs" role="tablist" aria-label="Practice sections">
            {practice.segs.map((s, i) => (
              <button
                key={s[0]}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={activeTab === i}
                className={activeTab === i ? 'on' : undefined}
                onClick={() => scrollToSegment(i)}
              >
                {s[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="m-body" ref={bodyRef} onScroll={handleScroll}>
          <p className="m-intro">{practice.intro}</p>
          <div className="m-meta">
            <div className="glass">
              <h5>Ideal for</h5>
              <div className="tags">
                {practice.who.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>
            <div className="glass">
              <h5>Outcomes we track</h5>
              <div className="tags">
                {practice.kpis.map((k) => (
                  <span key={k}>
                    <Icon name="digital" color="#0fb5ad" wrap={false} /> {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {practice.segs.map((s, i) => (
            <div
              key={s[0]}
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              className="seg"
              style={{ '--c': practice.c }}
            >
              <div className="seg-title">
                {s[0]} <em>{s[1].length}</em>
              </div>
              <div className="svc-grid">
                {s[1].map((item) => {
                  itemCounter += 1;
                  const num = String(itemCounter).padStart(2, '0');
                  return (
                    <div key={item[0]} className="svc" style={{ '--c': practice.c }}>
                      <div className="dot">{num}</div>
                      <div>
                        <b>{item[0]}</b>
                        <p>{item[1]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="m-foot">
          <button
            type="button"
            className="btn btn-neu"
            onClick={() => {
              closePractice();
              navigate('/service-cocktail');
            }}
          >
            <Icon name="cocktail" color="currentColor" /> Mix in a Service Cocktail
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              closePractice();
              openQuickEnquiry({
                source: 'practice_enquiry',
                title: practice.title,
                contextLabel: practice.title,
                interests: [practice.id],
                defaultMessage: `I'd like to discuss ${practice.title} services for my business.`,
              });
            }}
          >
            Talk to us about this →
          </button>
        </div>
      </div>
    </div>
  );
}

