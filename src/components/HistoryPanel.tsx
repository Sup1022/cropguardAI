import { useEffect, useState } from 'react';
import { History, Loader2, Trash2, ChevronRight, ImageIcon, MapPin, Calendar } from 'lucide-react';
import type { Language, Advisory } from '@/lib/types';
import { t } from '@/lib/i18n';
import { loadAdvisories, deleteAdvisory } from '@/lib/history';

interface HistoryPanelProps {
  lang: Language;
  refreshKey: number;
  onView: (advisory: Advisory) => void;
}

export default function HistoryPanel({ lang, refreshKey, onView }: HistoryPanelProps) {
  const [items, setItems] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await loadAdvisories();
      if (active) { setItems(data); setLoading(false); }
    })();
    return () => { active = false; };
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    await deleteAdvisory(id);
  };

  return (
    <section id="history" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #15803d 0%, #1d4ed8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          <History className="w-7 h-7 text-primary-600" style={{ WebkitTextFillColor: '#16a34a' }} />
          {t(lang, 'history_title')}
        </h2>
        <p className="text-sm text-neutral-500">{t(lang, 'history_subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-sm text-neutral-500">{t(lang, 'history_load')}</span>
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(240,253,244,0.8) 0%, rgba(219,234,254,0.7) 100%)' }}>
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(187,247,208,0.6) 0%, rgba(147,197,253,0.4) 100%)' }}>
            <History className="w-8 h-8 text-primary-400" />
          </div>
          <p className="text-neutral-500">{t(lang, 'history_empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                {a.image_url ? (
                  <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-neutral-900 truncate">{a.diagnosis ?? 'Unknown'}</div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 flex-wrap">
                  {a.location_name && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {a.location_name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {a.confidence != null && (
                    <span className="badge bg-primary-50 text-primary-700">{a.confidence}%</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onView(a)}
                  className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                  aria-label={t(lang, 'history_view')}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors"
                  aria-label={t(lang, 'history_delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
