import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRACTICES as FALLBACK_PRACTICES } from '../data/practices';
import { MENU as FALLBACK_MENU } from '../data/cocktailMenu';
import { PKGS as FALLBACK_PKGS, PKG_THEME } from '../data/packages';
import { getCatalogue } from '../lib/api';

const CACHE_KEY = 'atlabts_catalogue_cache_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function normalizePackages(pkgs) {
  return pkgs.map((p, i) => ({
    ...p,
    id: p.id || p.name.toLowerCase(),
    color: p.color || PKG_THEME[i]?.c || '#14b8a6',
    icon: p.icon || PKG_THEME[i]?.e || 'seed',
    is_topmost: p.is_topmost ?? i === pkgs.length - 1,
  }));
}

function getFallbackCatalogue() {
  return {
    practices: FALLBACK_PRACTICES,
    menu: FALLBACK_MENU,
    packages: normalizePackages(FALLBACK_PKGS),
    source: 'fallback',
  };
}

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || Date.now() - parsed.ts > CACHE_TTL_MS) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }
    if (
      !parsed.data?.practices?.length ||
      !parsed.data?.menu?.length ||
      !parsed.data?.packages?.length ||
      parsed.data.packages.some((x) => x.price !== undefined) ||
      parsed.data.menu.some((x) => x.p !== undefined)
    ) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore storage quota errors
  }
}

const CatalogueContext = createContext(null);

export function CatalogueProvider({ children }) {
  const [catalogue, setCatalogue] = useState(() => readCache() || getFallbackCatalogue());
  const [loading, setLoading] = useState(false);

  const loadFromSupabase = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setCatalogue(cached);
        return cached;
      }
    }
    setLoading(true);
    const { data } = await getCatalogue();
    setLoading(false);
    if (data) {
      const normalized = {
        ...data,
        packages: normalizePackages(data.packages),
      };
      setCatalogue(normalized);
      writeCache(normalized);
      return normalized;
    }
    return null;
  }, []);

  useEffect(() => {
    loadFromSupabase(false);
  }, [loadFromSupabase]);

  const clearCatalogueCache = useCallback(async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CACHE_KEY);
    }
    const fresh = await loadFromSupabase(true);
    if (!fresh) {
      setCatalogue(getFallbackCatalogue());
    }
    return fresh;
  }, [loadFromSupabase]);

  const allServices = useMemo(
    () =>
      catalogue.practices.flatMap((p) =>
        p.segs.flatMap((s) => s[1].map((i) => ({ p, seg: s[0], n: i[0], d: i[1] })))
      ),
    [catalogue.practices]
  );

  return (
    <CatalogueContext.Provider
      value={{
        practices: catalogue.practices,
        menu: catalogue.menu,
        packages: catalogue.packages,
        allServices,
        source: catalogue.source,
        loading,
        refreshCatalogue: () => loadFromSupabase(true),
        clearCatalogueCache,
      }}
    >
      {children}
    </CatalogueContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalogue() {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used inside CatalogueProvider');
  return ctx;
}

