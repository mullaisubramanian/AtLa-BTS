import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useCatalogue } from '../../context/CatalogueContext';
import { useModals } from '../../context/ModalContext';

export default function CatalogueManager() {
  const { clearCatalogueCache } = useCatalogue();
  const { showToast } = useModals();

  const [tab, setTab] = useState('cocktail');
  const [cocktailItems, setCocktailItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [practices, setPractices] = useState([]);
  const [sections, setSections] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState('digital');
  const [newSvc, setNewSvc] = useState({ section_id: '', name: '', impact: '' });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!supabase) return;
    setLoading(true);
    const [cRes, pRes, bRes, prRes, secRes, svcRes] = await Promise.all([
      supabase.from('cocktail_items').select('*').order('sort_order'),
      supabase.from('packages').select('*').order('sort_order'),
      supabase.from('package_benefits').select('*').order('sort_order'),
      supabase.from('practices').select('*').order('sort_order'),
      supabase.from('practice_sections').select('*').order('sort_order'),
      supabase.from('services').select('*').order('sort_order'),
    ]);

    setCocktailItems(cRes.data || []);
    setPackages(pRes.data || []);
    setBenefits(bRes.data || []);
    setPractices(prRes.data || []);
    setSections(secRes.data || []);
    setServices(svcRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleClearCache = async () => {
    await clearCatalogueCache();
    showToast('Catalogue cache cleared and reloaded from Supabase.');
  };

  const saveCocktailItem = async (item) => {
    const { error } = await supabase
      .from('cocktail_items')
      .update({
        name: item.name,
        monthly_price: Number(item.monthly_price),
        sort_order: Number(item.sort_order),
        is_active: item.is_active,
      })
      .eq('id', item.id);
    if (error) showToast(error.message);
    else showToast(`Saved ${item.name}`);
  };

  const savePackage = async (pkg) => {
    const { error } = await supabase
      .from('packages')
      .update({
        monthly_price: Number(pkg.monthly_price),
        motto: pkg.motto,
        vision: pkg.vision,
      })
      .eq('id', pkg.id);
    if (error) showToast(error.message);
    else showToast(`Saved ${pkg.name} package`);
  };

  const saveBenefit = async (b) => {
    const { error } = await supabase
      .from('package_benefits')
      .update({ title: b.title, description: b.description })
      .eq('id', b.id);
    if (error) showToast(error.message);
    else showToast('Saved benefit');
  };

  const savePractice = async (pr) => {
    const { error } = await supabase
      .from('practices')
      .update({ title: pr.title, tagline: pr.tagline, intro: pr.intro })
      .eq('id', pr.id);
    if (error) showToast(error.message);
    else showToast(`Saved ${pr.title}`);
  };

  const saveService = async (svc) => {
    const { error } = await supabase
      .from('services')
      .update({
        name: svc.name,
        impact: svc.impact,
        is_active: svc.is_active,
      })
      .eq('id', svc.id);
    if (error) showToast(error.message);
    else showToast('Saved service');
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newSvc.section_id || !newSvc.name.trim() || !newSvc.impact.trim()) return;
    const { error } = await supabase.from('services').insert([
      {
        practice_id: selectedPractice,
        section_id: newSvc.section_id,
        name: newSvc.name.trim(),
        impact: newSvc.impact.trim(),
        sort_order: 99,
        is_active: true,
      },
    ]);
    if (error) {
      showToast(error.message);
      return;
    }
    setNewSvc({ section_id: '', name: '', impact: '' });
    showToast('Service added');
    loadAll();
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading catalogue…</p>;

  const practiceSections = sections.filter((s) => s.practice_id === selectedPractice);
  const practiceServices = services.filter((s) => s.practice_id === selectedPractice);
  const activePractice = practices.find((p) => p.id === selectedPractice);

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div className="adm-topbar glass" style={{ padding: '14px 18px' }}>
        <div className="adm-tabs">
          {[
            ['cocktail', 'Cocktail items'],
            ['packages', 'Packages & benefits'],
            ['services', 'Practices & services'],
          ].map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              className={`adm-tab ${tab === k ? 'on' : ''}`}
              onClick={() => setTab(k)}
            >
              {lbl}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleClearCache} style={{ padding: '9px 16px', fontSize: '0.82rem' }}>
          Clear cache
        </button>
      </div>

      {tab === 'cocktail' && (
        <div className="glass" style={{ padding: '18px', display: 'grid', gap: '10px' }}>
          {cocktailItems.map((item, idx) => (
            <div key={item.id} className="adm-cat-row">
              <input
                value={item.name}
                onChange={(e) => {
                  const next = [...cocktailItems];
                  next[idx] = { ...item, name: e.target.value };
                  setCocktailItems(next);
                }}
                aria-label="Cocktail item name"
              />
              <input
                type="number"
                value={item.monthly_price}
                onChange={(e) => {
                  const next = [...cocktailItems];
                  next[idx] = { ...item, monthly_price: e.target.value };
                  setCocktailItems(next);
                }}
                aria-label="Monthly price"
              />
              <input
                type="number"
                value={item.sort_order}
                onChange={(e) => {
                  const next = [...cocktailItems];
                  next[idx] = { ...item, sort_order: e.target.value };
                  setCocktailItems(next);
                }}
                aria-label="Sort order"
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.76rem', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => {
                      const next = [...cocktailItems];
                      next[idx] = { ...item, is_active: e.target.checked };
                      setCocktailItems(next);
                    }}
                  />
                  Active
                </label>
                <button
                  type="button"
                  className="btn btn-neu"
                  style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                  onClick={() => saveCocktailItem(cocktailItems[idx])}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'packages' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {packages.map((pkg, idx) => {
            const pkgBenefits = benefits.filter((b) => b.package_id === pkg.id);
            return (
              <div key={pkg.id} className="glass" style={{ padding: '18px', display: 'grid', gap: '10px' }}>
                <div className="adm-cat-row">
                  <input value={pkg.name} disabled aria-label="Package name" />
                  <input
                    type="number"
                    value={pkg.monthly_price}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx] = { ...pkg, monthly_price: e.target.value };
                      setPackages(next);
                    }}
                    aria-label="Package monthly price"
                  />
                  <input
                    value={pkg.motto || ''}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx] = { ...pkg, motto: e.target.value };
                      setPackages(next);
                    }}
                    aria-label="Package motto"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    onClick={() => savePackage(packages[idx])}
                  >
                    Save package
                  </button>
                </div>
                <textarea
                  value={pkg.vision || ''}
                  onChange={(e) => {
                    const next = [...packages];
                    next[idx] = { ...pkg, vision: e.target.value };
                    setPackages(next);
                  }}
                  style={{ padding: '8px 10px', borderRadius: '10px', border: 'none', background: '#fff' }}
                  aria-label="Package vision"
                />

                <div style={{ display: 'grid', gap: '6px', marginTop: '6px' }}>
                  <small style={{ fontWeight: 700, color: 'var(--deep)' }}>Benefits</small>
                  {pkgBenefits.map((b) => (
                    <div key={b.id} className="adm-cat-row" style={{ gridTemplateColumns: '1fr 1.6fr auto' }}>
                      <input
                        value={b.title}
                        onChange={(e) =>
                          setBenefits((prev) =>
                            prev.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x))
                          )
                        }
                      />
                      <input
                        value={b.description}
                        onChange={(e) =>
                          setBenefits((prev) =>
                            prev.map((x) =>
                              x.id === b.id ? { ...x, description: e.target.value } : x
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-neu"
                        style={{ padding: '7px 12px', fontSize: '0.76rem' }}
                        onClick={() => saveBenefit(benefits.find((x) => x.id === b.id))}
                      >
                        Save
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'services' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="adm-tabs">
            {practices.map((pr) => (
              <button
                key={pr.id}
                type="button"
                className={`adm-tab ${selectedPractice === pr.id ? 'on' : ''}`}
                onClick={() => setSelectedPractice(pr.id)}
              >
                {pr.title}
              </button>
            ))}
          </div>

          {activePractice && (
            <div className="glass" style={{ padding: '18px', display: 'grid', gap: '10px' }}>
              <h4>Practice details</h4>
              <div className="adm-cat-row" style={{ gridTemplateColumns: '1fr 1.6fr auto' }}>
                <input
                  value={activePractice.title}
                  onChange={(e) =>
                    setPractices((prev) =>
                      prev.map((p) =>
                        p.id === activePractice.id ? { ...p, title: e.target.value } : p
                      )
                    )
                  }
                />
                <input
                  value={activePractice.tagline || ''}
                  onChange={(e) =>
                    setPractices((prev) =>
                      prev.map((p) =>
                        p.id === activePractice.id ? { ...p, tagline: e.target.value } : p
                      )
                    )
                  }
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                  onClick={() =>
                    savePractice(practices.find((p) => p.id === activePractice.id))
                  }
                >
                  Save practice
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={addService}
            className="glass"
            style={{ padding: '18px', display: 'grid', gap: '10px' }}
          >
            <h4>Add service to {activePractice?.title}</h4>
            <div className="adm-cat-row" style={{ gridTemplateColumns: '1fr 1fr 1.4fr auto' }}>
              <select
                value={newSvc.section_id}
                onChange={(e) => setNewSvc({ ...newSvc, section_id: e.target.value })}
                style={{ padding: '8px', borderRadius: '10px', border: 'none', background: '#fff' }}
              >
                <option value="">Select section…</option>
                {practiceSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
              <input
                placeholder="Service name"
                value={newSvc.name}
                onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })}
              />
              <input
                placeholder="Impact line"
                value={newSvc.impact}
                onChange={(e) => setNewSvc({ ...newSvc, impact: e.target.value })}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                Add service
              </button>
            </div>
          </form>

          <div className="glass" style={{ padding: '18px', display: 'grid', gap: '8px' }}>
            {practiceServices.map((svc) => (
              <div key={svc.id} className="adm-cat-row" style={{ gridTemplateColumns: '1fr 1.4fr auto auto' }}>
                <input
                  value={svc.name}
                  onChange={(e) =>
                    setServices((prev) =>
                      prev.map((x) => (x.id === svc.id ? { ...x, name: e.target.value } : x))
                    )
                  }
                />
                <input
                  value={svc.impact}
                  onChange={(e) =>
                    setServices((prev) =>
                      prev.map((x) => (x.id === svc.id ? { ...x, impact: e.target.value } : x))
                    )
                  }
                />
                <label style={{ fontSize: '0.76rem', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={svc.is_active}
                    onChange={(e) =>
                      setServices((prev) =>
                        prev.map((x) =>
                          x.id === svc.id ? { ...x, is_active: e.target.checked } : x
                        )
                      )
                    }
                  />
                  Visible
                </label>
                <button
                  type="button"
                  className="btn btn-neu"
                  style={{ padding: '7px 12px', fontSize: '0.76rem' }}
                  onClick={() => saveService(services.find((x) => x.id === svc.id))}
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

