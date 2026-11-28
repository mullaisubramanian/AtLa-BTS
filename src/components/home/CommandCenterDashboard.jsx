import { useRef, useState } from 'react';
import { useReducedMotion } from '../../lib/useReducedMotion';
import Icon from '../Icon';
import './CommandCenterDashboard.css';

const BARS = [
  { height: '35%', delay: '0.6s' },
  { height: '48%', delay: '0.7s' },
  { height: '42%', delay: '0.8s' },
  { height: '60%', delay: '0.9s' },
  { height: '56%', delay: '1s' },
  { height: '74%', delay: '1.1s' },
  { height: '88%', delay: '1.2s' },
];

export default function CommandCenterDashboard() {
  const sceneRef = useRef(null);
  const [tilt, setTilt] = useState('');
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reducedMotion || !sceneRef.current) return;
    const r = sceneRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`rotateY(${-14 + x * 16}deg) rotateX(${7 - y * 12}deg)`);
  };

  return (
    <div
      className="scene"
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt('')}
    >
      <div className="dash" style={tilt ? { transform: tilt } : undefined}>
        <div className="side" aria-hidden="true">
          <i className="a" />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="dmain">
          <div className="dtop">
            <div>
              <b>AtLa/BTS Command Center</b>
              <br />
              Illustrative example
            </div>
            <div className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="kpis">
            <div className="kpi">
              <small>Qualified leads</small>
              <b>1,284</b>
              <em>▲</em>
            </div>
            <div className="kpi">
              <small>Tasks automated</small>
              <b>9,410</b>
              <em>▲</em>
            </div>
            <div className="kpi">
              <small>AI search mentions</small>
              <b>312</b>
              <em>▲</em>
            </div>
          </div>

          <div className="charts">
            <div className="panel">
              Revenue pipeline
              <div className="bars">
                {BARS.map((bar, idx) => (
                  <i
                    key={idx}
                    style={{ height: bar.height, animationDelay: bar.delay }}
                  />
                ))}
              </div>
            </div>
            <div className="panel">
              CRM · Deals
              <div className="pipe" aria-hidden="true">
                <div>
                  <span className="h" />
                  <span />
                  <span />
                  <span />
                </div>
                <div>
                  <span />
                  <span className="h" />
                  <span />
                </div>
                <div>
                  <span className="h" />
                  <span className="h" />
                </div>
              </div>
              <svg viewBox="0 0 100 34" style={{ marginTop: 'auto' }} aria-hidden="true">
                <path
                  d="M0 30 C15 28 25 22 40 22 S65 10 80 9 S95 3 100 2"
                  fill="none"
                  stroke="#5ff3e6"
                  strokeWidth="2.4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="fl f1">
        <b>
          <span className="live" />
          AI Agent · WhatsApp
        </b>
        &quot;Your demo is booked for 4 PM.&quot;
        <span className="typing" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="fl f2">
        <b>
          <Icon name="search" /> Recommended by AI
        </b>
        ChatGPT · Gemini · Perplexity
      </div>
      <div className="fl f3">
        <b>
          <Icon name="product" /> ERP synced
        </b>
        Inventory · Billing · GST
      </div>
      <div className="fl f4">
        <b>
          <Icon name="influencer" /> Influencer Connect
        </b>
        12 creators live this week
      </div>
    </div>
  );
}

