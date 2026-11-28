import { useMemo } from 'react';
import { Link } from 'react-router-dom';
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

  // Suggest the package covering the most services in the glass (prefer lowest tier on ties)
  const tipInfo = useMemo(() => {
    if (!isCalculatedVisible || !quoteResult || !items.length || !packages.length) {
      return null;
    }

    let best = null;
    let bestCount = -1;

    packages.forEach((pkg) => {
      const coveredCount = items.reduce(
        (count, m) => (pkg.inc.includes(m.id) ? count + 1 : count),
        0
      );
      if (coveredCount > bestCount) {
        bestCount = coveredCount;
        best = pkg;
      }
    });

    if (!best || bestCount <= 0) return null;

    const extra = best.inc
      .filter((id) => !selectedIds.has(id))
      .map((id) => menu.find((m) => m.id === id))
      .filter(Boolean);

    const list =
      extra
        .slice(0, 3)
        .map((e) => e.n)
        .join(', ') + (extra.length > 3 ? '…' : '');

    return {
      best,
      coveredCount: bestCount,
      allCovered: bestCount === items.length,
      extra,
      list,
    };
  }, [isCalculatedVisible, quoteResult, items, packages, selectedIds, menu]);

  const uniqueInterests = useMemo(
    () => [...new Set(items.map((m) => m.practice_id).filter(Boolean))],
    [items]
  );

  const openCocktailModal = () => {
    if (!items.length || !quoteResult) return;
    openQuickEnquiry({
      source: 'cocktail_serve',
      title: 'Serve my Service Cocktail',
      cocktailItems: items,
      isCustomCocktail: true,
      cocktailQuoteId: quoteResult.quote_id,
      interests: uniqueInterests,
      defaultMessage: `My Service Cocktail:\n${items.map((m) => `• ${m.n}`).join('\n')}`,
    });
  };

  return (
    <div className="bill glass">
      <h2>Your cocktail</h2>
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
          <div className="total">Your cocktail is ready</div>
          <p className="reveal-line">
            {items.length} {items.length === 1 ? 'service' : 'services'} in your glass. Pricing is
            tailored to your business.
          </p>
          <span>Let&apos;s talk and build the right plan for you.</span>
        </div>
      )}

      {isCalculatedVisible && tipInfo && (
        <div className="tip show">
          <span className="tip-ic">
            <Icon name="bulb" color="#08514d" wrap={false} />
          </span>
          <b>Package match:</b> the <b>{tipInfo.best.name}</b> package covers{' '}
          {tipInfo.allCovered ? (
            <>all {items.length} services in your glass</>
          ) : (
            <>
              <b>{tipInfo.coveredCount}</b> of your <b>{items.length}</b> selected services
            </>
          )}
          {tipInfo.extra.length > 0 && (
            <>
              {' '}
              and also includes{' '}
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
            onClick={() =>
              openQuickEnquiry({
                source: 'package_negotiate',
                title: "Let's negotiate",
                packageId: tipInfo.best.id,
                packageName: tipInfo.best.name,
                packageColor: tipInfo.best.color,
                cocktailItems: items,
                isCustomCocktail: true,
                cocktailQuoteId: quoteResult?.quote_id || null,
                interests: uniqueInterests,
                defaultMessage: `Let's negotiate the ${tipInfo.best.name} package with my Service Cocktail:\n${items.map((m) => `• ${m.n}`).join('\n')}`,
              })
            }
          >
            Let&apos;s negotiate →
          </button>
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
            onClick={openCocktailModal}
          >
            Serve it to me →
          </button>
          <button
            type="button"
            className="btn btn-primary neg-row"
            onClick={() =>
              openQuickEnquiry({
                source: 'cocktail_negotiate',
                title: "Let's negotiate",
                cocktailItems: items,
                isCustomCocktail: true,
                cocktailQuoteId: quoteResult?.quote_id || null,
                interests: uniqueInterests,
                defaultMessage: `Let's negotiate my Service Cocktail:\n${items.map((m) => `• ${m.n}`).join('\n')}`,
              })
            }
          >
            Let&apos;s negotiate →
          </button>
        </div>
      )}
    </div>
  );
}
