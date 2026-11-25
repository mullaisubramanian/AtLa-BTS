import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fmt } from '../../lib/format';
import { useCatalogue } from '../../context/CatalogueContext';
import { useModals } from '../../context/ModalContext';
import Icon from '../Icon';
import './Bill.css';

export default function Bill({
  items,
  selectedIds,
  hasCalculatedOnce,
  isCalculatedVisible,
  calculating,
  calcError,
  quoteResult,
  onToggle,
  onCalculate,
  onReset,
}) {
  const { menu, packages } = useCatalogue();
  const { openQuickEnquiry } = useModals();
  const [displayTotal, setDisplayTotal] = useState(0);

  const serverTotal = quoteResult?.total ?? 0;

  useEffect(() => {
    if (!isCalculatedVisible || !quoteResult) return;
    let rafId = 0;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      setDisplayTotal(Math.round((serverTotal * e) / 100) * 100);
      if (k < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayTotal(serverTotal);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isCalculatedVisible, quoteResult, serverTotal]);

  const tipInfo = useMemo(() => {
    if (!isCalculatedVisible || !quoteResult?.suggested_package_id || !quoteResult?.suggestion_type) {
      return null;
    }
    const best = packages.find((p) => p.id === quoteResult.suggested_package_id);
    if (!best) return null;

    const extra = best.inc
      .filter((id) => !selectedIds.has(id))
      .map((id) => menu.find((m) => m.id === id))
      .filter(Boolean);

    const val = best.inc.reduce((a, id) => a + (menu.find((m) => m.id === id)?.p || 0), 0);
    const list =
      extra
        .slice(0, 3)
        .map((e) => e.n)
        .join(', ') + (extra.length > 3 ? '…' : '');

    return {
      type: quoteResult.suggestion_type, // 'saving' | 'upgrade'
      amount: quoteResult.suggested_amount,
      best,
      extra,
      val,
      list,
    };
  }, [isCalculatedVisible, quoteResult, packages, selectedIds, menu]);

  const uniqueInterests = useMemo(
    () => [...new Set(items.map((m) => m.practice_id).filter(Boolean))],
    [items]
  );

  const openCocktailModal = (mode) => {
    if (!items.length || !quoteResult) return;
    const isNegotiate = mode === 'negotiate';
    openQuickEnquiry({
      source: isNegotiate ? 'cocktail_negotiate' : 'cocktail_serve',
      title: isNegotiate ? "Let's negotiate your cocktail" : 'Serve my Service Cocktail',
      cocktailItems: items,
      cocktailTotal: quoteResult.total,
      isCustomCocktail: true,
      cocktailQuoteId: quoteResult.quote_id,
      interests: uniqueInterests,
      defaultMessage: isNegotiate
        ? `Let's negotiate my Service Cocktail:\n${items
            .map((m) => `• ${m.n}`)
            .join('\n')}\nCalculated price: ${fmt(quoteResult.total)}/month`
        : `My Service Cocktail:\n${items
            .map((m) => `• ${m.n}`)
            .join('\n')}\nEstimated: ${fmt(quoteResult.total)}/month`,
    });
  };

  const openPackageModal = (pkg) => {
    openQuickEnquiry({
      source: 'package_negotiate',
      title: `Negotiate ${pkg.name} Package`,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: pkg.price,
      packageColor: pkg.color,
      defaultMessage: `Let's negotiate the ${pkg.name} package.`,
    });
  };

  return (
    <div className="bill glass">
      <h4>Your cocktail</h4>
      <div className="bill-count">
        {items.length
          ? `${items.length} service${items.length > 1 ? 's' : ''} in your glass`
          : 'No services selected yet'}
      </div>

      <div className="picked">
        {items.map((m) => (
          <button
            key={m.id}
            type="button"
            className="picked-chip"
            style={{ '--c': m.c }}
            onClick={() => onToggle(m.id)}
            aria-label={`Remove ${m.n}`}
          >
            <i />
            {m.n} ✕
          </button>
        ))}
      </div>

      {!isCalculatedVisible && (
        <button
          type="button"
          className="btn btn-primary calc"
          disabled={!items.length || calculating}
          onClick={onCalculate}
        >
          {calculating ? (
            'Calculating…'
          ) : (
            <>
              <Icon name={hasCalculatedOnce && items.length ? 'refresh' : 'calc'} color="#fff" />{' '}
              {hasCalculatedOnce && items.length
                ? 'Recalculate my cocktail'
                : 'Calculate my cocktail'}
            </>
          )}
        </button>
      )}

      {calcError && (
        <div className="bill-error" role="alert">
          {calcError}
        </div>
      )}

      {isCalculatedVisible && quoteResult && (
        <div className="price-reveal show">
          <small>Your cocktail costs</small>
          <div className="total">{fmt(displayTotal)}</div>
          <span>per month · GST extra</span>
        </div>
      )}

      {isCalculatedVisible && tipInfo && (
        <div className="tip show">
          <span className="tip-ic">
            <Icon name={tipInfo.type === 'saving' ? 'bulb' : 'up'} color="#08514d" wrap={false} />
          </span>
          {tipInfo.type === 'saving' ? (
            <>
              <b>Smarter pour:</b> the <b>{tipInfo.best.name}</b> package covers everything in your
              glass for <b>{fmt(tipInfo.best.price)}</b>. You save{' '}
              <b>{fmt(tipInfo.amount)}/month</b>
              {tipInfo.extra.length > 0 && (
                <>
                  {' '}
                  and also get{' '}
                  <b>
                    {tipInfo.extra.length} extra service{tipInfo.extra.length > 1 ? 's' : ''}
                  </b>{' '}
                  ({tipInfo.list})
                </>
              )}
              .
              <br />
              <Link
                className="btn btn-primary"
                style={{ marginTop: '10px', padding: '9px 16px', fontSize: '.8rem' }}
                to="/packages"
              >
                See {tipInfo.best.name} →
              </Link>{' '}
              <button
                type="button"
                className="btn btn-neu"
                style={{ marginTop: '10px', padding: '9px 16px', fontSize: '.8rem' }}
                onClick={() => openPackageModal(tipInfo.best)}
              >
                Let&apos;s negotiate →
              </button>
            </>
          ) : (
            <>
              <b>Upgrade idea:</b> for just <b>{fmt(tipInfo.amount)}</b> more, the{' '}
              <b>{tipInfo.best.name}</b> package adds{' '}
              <b>
                {tipInfo.extra.length} service{tipInfo.extra.length > 1 ? 's' : ''}
              </b>{' '}
              ({tipInfo.list}), worth <b>{fmt(tipInfo.val)}</b> in total.
              <br />
              <Link
                className="btn btn-neu"
                style={{ marginTop: '10px', padding: '9px 16px', fontSize: '.8rem' }}
                to="/packages"
              >
                Compare packages →
              </Link>{' '}
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '10px', padding: '9px 16px', fontSize: '.8rem' }}
                onClick={() => openPackageModal(tipInfo.best)}
              >
                Let&apos;s negotiate →
              </button>
            </>
          )}
        </div>
      )}

      {isCalculatedVisible && quoteResult && (
        <div className="bill-actions">
          <button type="button" className="btn btn-neu" onClick={onReset}>
            Clear cocktail
          </button>
          <button
            type="button"
            className="btn btn-neu"
            style={{ color: 'var(--deep)' }}
            onClick={() => openCocktailModal('serve')}
          >
            Serve it to me →
          </button>
          <button
            type="button"
            className="btn btn-primary neg-row"
            onClick={() => openCocktailModal('negotiate')}
          >
            Let&apos;s negotiate →
          </button>
        </div>
      )}
    </div>
  );
}
