import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCatalogue } from '../context/CatalogueContext';
import { saveCocktailQuote, track } from '../lib/api';
import Eyebrow from '../components/Eyebrow';
import MenuChip from '../components/cocktail/MenuChip';
import CocktailGlass from '../components/cocktail/CocktailGlass';
import Bill from '../components/cocktail/Bill';
import './Cocktail.css';

export default function Cocktail() {
  const { menu } = useCatalogue();
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);
  const [isCalculatedVisible, setIsCalculatedVisible] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');
  const [quoteResult, setQuoteResult] = useState(null);

  const selectedItems = useMemo(
    () => menu.filter((m) => selectedIds.has(m.id)),
    [menu, selectedIds]
  );

  const toggle = (id) => {
    const removing = selectedIds.has(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    track(removing ? 'cocktail_remove' : 'cocktail_add', { itemId: id });
    setIsCalculatedVisible(false);
    setCalcError('');
  };

  const handleDropId = (id) => {
    if (!menu.some((m) => m.id === id)) return;
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      track('cocktail_add', { itemId: id });
      return next;
    });
    setIsCalculatedVisible(false);
    setCalcError('');
  };

  const handleCalculate = async () => {
    if (!selectedIds.size || calculating) return;
    setCalculating(true);
    setCalcError('');
    const ids = [...selectedIds];
    const { data, error } = await saveCocktailQuote(ids);
    setCalculating(false);

    if (error || !data) {
      setCalcError(
        error?.message || 'Could not calculate your cocktail on the server. Please retry.'
      );
      return;
    }

    setQuoteResult(data);
    setHasCalculatedOnce(true);
    setIsCalculatedVisible(true);
    track('cocktail_calculate', {
      total: data.total,
      quote_id: data.quote_id,
      count: ids.length,
    });
  };

  const handleReset = () => {
    setSelectedIds(new Set());
    setHasCalculatedOnce(false);
    setIsCalculatedVisible(false);
    setQuoteResult(null);
    setCalcError('');
  };

  const splitIndex = Math.ceil(menu.length / 2);
  const leftItems = menu.slice(0, splitIndex);
  const rightItems = menu.slice(splitIndex);

  return (
    <section className="page-enter">
      <Helmet>
        <title>Service Cocktail — ATLABTS</title>
        <meta
          name="description"
          content="Mix your own custom ATLABTS growth recipe. Drag or tap services into the glass and calculate your monthly estimate or compare with packages."
        />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>Service Cocktail</Eyebrow>
            <h2>
              Mix your own <span className="grad">growth recipe</span>
            </h2>
            <p>
              Drag services into the glass, or tap them. When your mix is ready, hit{' '}
              <b>Calculate</b> to see what it costs, and whether a package gives you more for less.
            </p>
          </div>

          <div className="bar">
            <div className="menu-col">
              {leftItems.map((item) => (
                <MenuChip
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  onToggle={toggle}
                />
              ))}
            </div>

            <div className="glass-stage">
              <CocktailGlass items={selectedItems} onDropId={handleDropId} />
              <Bill
                items={selectedItems}
                selectedIds={selectedIds}
                hasCalculatedOnce={hasCalculatedOnce}
                isCalculatedVisible={isCalculatedVisible}
                calculating={calculating}
                calcError={calcError}
                quoteResult={quoteResult}
                onToggle={toggle}
                onCalculate={handleCalculate}
                onReset={handleReset}
              />
            </div>

            <div className="menu-col">
              {rightItems.map((item) => (
                <MenuChip
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  onToggle={toggle}
                />
              ))}
            </div>
          </div>

          <p className="fineprint">
            Indicative monthly retainers. One-time builds (websites, CRM/ERP) are spread over a
            12-month engagement. Ad spend, creator fees and third-party licences are paid at
            actuals. GST extra.
          </p>
        </div>
      </div>
    </section>
  );
}
