import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, LocateFixed, Check, Loader2, X } from 'lucide-react';
import type { Language, GeoLocation } from '@/lib/types';
import { t } from '@/lib/i18n';
import { getPopularLocations, searchLocations, getBrowserLocation, reverseGeocode } from '@/lib/geocode';

interface LocationPickerProps {
  lang: Language;
  location: GeoLocation | null;
  onLocation: (loc: GeoLocation) => void;
}

export default function LocationPicker({ lang, location, onLocation }: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popular = getPopularLocations();

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const r = await searchLocations(query);
      setResults(r);
      setShowResults(true);
      setSearching(false);
    }, 350);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [query]);

  const handleGps = async () => {
    setError(null);
    setDetecting(true);
    try {
      const coords = await getBrowserLocation();
      const name = await reverseGeocode(coords.latitude, coords.longitude);
      onLocation({ ...coords, name });
    } catch (e: any) {
      setError(e.message || t(lang, 'error_location'));
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
          {t(lang, 'location_title')}
        </h2>
        <p className="text-sm text-neutral-500">{t(lang, 'location_subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-warning-50 border border-warning-200 text-warning-700 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {location && (
        <div className="mb-4 flex items-center justify-between gap-3 p-4 rounded-xl bg-primary-50 border border-primary-200 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-primary-700 uppercase tracking-wide">{t(lang, 'location_selected')}</div>
              <div className="font-semibold text-neutral-900 truncate">{location.name}</div>
              <div className="text-xs text-neutral-500">{location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}</div>
            </div>
          </div>
          <button
            onClick={() => { onLocation(null as any); setQuery(''); }}
            className="p-2 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
            aria-label="Clear location"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={t(lang, 'location_search')}
          className="input-field pl-10"
        />
        {searching && (
          <Loader2 className="w-4 h-4 text-primary-500 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
        )}
        {showResults && results.length > 0 && (
          <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl border border-neutral-200 shadow-lg max-h-64 overflow-y-auto animate-fade-in">
            {results.map((r, i) => (
              <button
                key={`${r.latitude}-${r.longitude}-${i}`}
                onClick={() => { onLocation(r); setQuery(''); setShowResults(false); setResults([]); }}
                className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-colors flex items-center gap-2.5 border-b border-neutral-100 last:border-0"
              >
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm text-neutral-900 truncate">{r.name}</div>
                  <div className="text-xs text-neutral-400 truncate">{[r.region, r.country].filter(Boolean).join(', ')}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleGps}
        disabled={detecting}
        className="btn-primary w-full mb-5"
      >
        {detecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t(lang, 'location_detecting')}
          </>
        ) : (
          <>
            <LocateFixed className="w-4 h-4" />
            {t(lang, 'location_use_gps')}
          </>
        )}
      </button>

      <div>
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">{t(lang, 'location_popular')}</div>
        <div className="flex flex-wrap gap-2">
          {popular.slice(0, 10).map((loc) => (
            <button
              key={`${loc.latitude}-${loc.longitude}`}
              onClick={() => onLocation(loc)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${location?.latitude === loc.latitude && location?.longitude === loc.longitude
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:bg-primary-50'}`}
            >
              <MapPin className="w-3 h-3" />
              {loc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
