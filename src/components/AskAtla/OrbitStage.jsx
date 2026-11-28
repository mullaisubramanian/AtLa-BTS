import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { useModals } from '../../context/ModalContext';
import { useReducedMotion } from '../../lib/useReducedMotion';
import Composer from './Composer';
import './OrbitStage.css';

function pickOrbitItems(allServices) {
  const candidates = allServices
    .map((a) => ({
      label: a.n.split(' (')[0],
      color: a.p.c,
    }))
    .filter((item) => item.label.length < 34);

  const step = Math.max(1, Math.floor(candidates.length / 18));
  const picked = [];
  for (let i = 0; i < candidates.length && picked.length < 18; i += step) {
    picked.push(candidates[i]);
  }
  return picked;
}

export default function OrbitStage() {
  const { allServices } = useCatalogue();
  const { askAtla } = useModals();
  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const orbRefs = useRef([]);
  const pausedRef = useRef(false);
  const offRef = useRef(0);
  const [items] = useState(() => pickOrbitItems(allServices));

  const orbItems = useMemo(() => items, [items]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let rafId = 0;
    let last = performance.now();

    const positionOrbs = (now) => {
      if (!pausedRef.current && !reducedMotion) {
        offRef.current += (now - last) * 0.00006;
      }
      last = now;

      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const mob = W < 700;
      const rx = W * (mob ? 0.4 : 0.45);
      const ry = H * (mob ? 0.44 : 0.42);
      const cx = W / 2;
      const cy = H / 2;
      const N = mob ? 12 : orbItems.length;

      orbItems.forEach((_, i) => {
        const el = orbRefs.current[i];
        if (!el) return;
        if (mob && i >= 12) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        const a2 = offRef.current * Math.PI * 2 + (i / N) * Math.PI * 2;
        const w = el.offsetWidth || 120;
        const h = el.offsetHeight || 34;
        const x = Math.max(4, Math.min(W - w - 4, cx + rx * Math.cos(a2) - w / 2));
        const y = cy + ry * Math.sin(a2) - h / 2;
        const s2 = Math.sin(a2);
        const depth = (s2 + 1) / 2;
        const sc = 0.78 + 0.22 * depth;
        let op = 0.45 + 0.55 * depth;

        if (mob) {
          op = Math.min(op, Math.max(0, (Math.abs(s2) - 0.55) * 3));
        } else {
          const inside = Math.abs(x + w / 2 - cx) < 350 && Math.abs(y + h / 2 - cy) < 110;
          if (inside) op = Math.min(op, 0.08);
        }

        el.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
        el.style.opacity = String(op);
        el.style.zIndex = s2 > 0 ? '15' : '5';
        el.style.pointerEvents = op < 0.3 ? 'none' : 'auto';
      });

      if (!reducedMotion) {
        rafId = requestAnimationFrame(positionOrbs);
      }
    };

    positionOrbs(last);
    if (reducedMotion) {
      const onResize = () => positionOrbs(performance.now());
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    return () => cancelAnimationFrame(rafId);
  }, [orbItems, reducedMotion]);

  return (
    <div
      className="orbit-stage"
      ref={stageRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="orbit-ring" aria-hidden="true" />
      {orbItems.map((item, i) => (
        <button
          key={`${item.label}-${i}`}
          ref={(el) => {
            orbRefs.current[i] = el;
          }}
          type="button"
          className="orb"
          style={{ '--c': item.color }}
          onClick={() => askAtla(`Tell me about ${item.label}`)}
        >
          {item.label}
        </button>
      ))}
      <Composer />
    </div>
  );
}

