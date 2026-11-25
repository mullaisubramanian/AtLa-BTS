import { useEffect, useState } from 'react';
import './CocktailGlass.css';

const BUBBLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${30 + i * 9}%`,
  delay: `${i * 0.45}s`,
  size: `${5 + (i % 3) * 3}px`,
}));

export default function CocktailGlass({ items, onDropId }) {
  const [dragOver, setDragOver] = useState(false);
  const [mountedIds, setMountedIds] = useState({});

  const fill = items.length ? Math.min(84, 14 + items.length * 4.2) : 0;
  const each = items.length ? fill / items.length : 0;

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const next = {};
      items.forEach((m) => {
        next[m.id] = true;
      });
      setMountedIds(next);
    });
    return () => cancelAnimationFrame(raf);
  }, [items]);

  return (
    <div
      className={`drop ${dragOver ? 'over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onDropId(id);
      }}
    >
      <div className="liquid">
        {items.map((m) => (
          <div
            key={m.id}
            className="layer"
            style={{
              '--c': m.c,
              height: mountedIds[m.id] ? `${each}%` : '0%',
            }}
          />
        ))}
      </div>

      {items.length > 0 && (
        <div aria-hidden="true">
          {BUBBLES.map((b) => (
            <span
              key={b.id}
              className="bubble"
              style={{
                left: b.left,
                animationDelay: b.delay,
                width: b.size,
                height: b.size,
              }}
            />
          ))}
        </div>
      )}

      {items.length === 0 && <div className="drop-hint">Drop services here</div>}

      <svg className="glass-svg" viewBox="0 0 220 300" aria-hidden="true">
        <defs>
          <linearGradient id="gl" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".7" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".05" />
            <stop offset=".85" stopColor="#fff" stopOpacity=".05" />
            <stop offset="1" stopColor="#fff" stopOpacity=".5" />
          </linearGradient>
        </defs>
        <line
          x1="150"
          y1="2"
          x2="122"
          y2="160"
          stroke="#0fb5ad"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="150"
          y1="2"
          x2="122"
          y2="160"
          stroke="#fff"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />
        <path
          d="M20 24 H200 L180 285 H40 Z"
          fill="url(#gl)"
          stroke="rgba(8,81,77,.55)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M34 40 L50 270"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".75"
        />
        <ellipse
          cx="110"
          cy="24"
          rx="90"
          ry="7"
          fill="none"
          stroke="rgba(8,81,77,.4)"
          strokeWidth="2"
        />
        <circle cx="196" cy="26" r="22" fill="#d9f99d" stroke="#84cc16" strokeWidth="3" />
        <path
          d="M196 4v44M174 26h44M181 11l30 30M211 11l-30 30"
          stroke="#84cc16"
          strokeWidth="1.5"
          opacity=".7"
        />
      </svg>
    </div>
  );
}

