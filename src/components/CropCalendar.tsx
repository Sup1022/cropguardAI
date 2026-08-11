import { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';
import { CROPS, SEASON_INFO, type CropInfo } from '@/lib/crops';

type Season = 'all' | 'kharif' | 'rabi' | 'zaid';

export default function CropCalendar({ lang }: { lang: Language }) {
  const [season, setSeason] = useState<Season>('all');

  const filtered = season === 'all' ? CROPS : CROPS.filter((c) => c.seasons.includes(season as any));

  const seasons: { key: Season; label: string }[] = [
    { key: 'all', label: t(lang, 'calendar_all') },
    { key: 'kharif', label: t(lang, 'calendar_kharif') },
    { key: 'rabi', label: t(lang, 'calendar_rabi') },
    { key: 'zaid', label: t(lang, 'calendar_zaid') },
  ];

  return (
    <section id="calendar" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #15803d 0%, #1d4ed8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {t(lang, 'calendar_title')}
        </h2>
        <p className="text-sm text-neutral-500">{t(lang, 'calendar_subtitle')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {seasons.map((s) => (
          <button
            key={s.key}
            onClick={() => setSeason(s.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${season === s.key
                ? 'text-white shadow-md'
                : 'text-neutral-600 border hover:text-primary-700'}`}
            style={season === s.key ? { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: '1px solid #16a34a' } : { background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(187,247,208,0.7)' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {season !== 'all' && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <div className="font-semibold text-primary-800 mb-1">{SEASON_INFO[season as 'kharif' | 'rabi' | 'zaid'].name}</div>
          <div className="text-sm text-primary-600 mb-1">{SEASON_INFO[season as 'kharif' | 'rabi' | 'zaid'].months}</div>
          <div className="text-sm text-neutral-600">{SEASON_INFO[season as 'kharif' | 'rabi' | 'zaid'].desc}</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((crop) => (
          <CropCard key={crop.name} crop={crop} lang={lang} />
        ))}
      </div>
    </section>
  );
}

function CropCard({ crop, lang }: { crop: CropInfo; lang: Language }) {
  const IconComp = (Lucide as any)[crop.icon] ?? Lucide.Sprout;
  const waterColor = crop.waterNeed === 'high' ? 'text-accent-600' : crop.waterNeed === 'medium' ? 'text-primary-600' : 'text-secondary-600';

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${crop.color} flex items-center justify-center shrink-0 shadow-sm`}>
          <IconComp className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-neutral-900 leading-tight">{crop.name}</h3>
          <p className="text-xs text-neutral-400 italic">{crop.scientificName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {crop.seasons.map((s) => (
          <span key={s} className="badge bg-primary-50 text-primary-700 border border-primary-100">
            {SEASON_INFO[s].name.split(' ')[0]}
          </span>
        ))}
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Sowing</span>
          <span className="font-medium text-neutral-700">{crop.sowingTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Harvest</span>
          <span className="font-medium text-neutral-700">{crop.harvestTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Ideal temp</span>
          <span className="font-medium text-neutral-700">{crop.idealTemp}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Water need</span>
          <span className={`font-medium capitalize ${waterColor}`}>{crop.waterNeed}</span>
        </div>
      </div>

      <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100 leading-relaxed">{crop.notes}</p>
    </div>
  );
}
