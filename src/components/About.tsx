import { Info, Heart, Target } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function About({ lang }: { lang: Language }) {
  return (
    <section id="about" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 flex items-center justify-center gap-2">
          <Info className="w-7 h-7 text-primary-600" />
          {t(lang, 'about_title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(220,252,231,0.8) 100%)' }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-3 shadow-sm">
            <Info className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">{t(lang, 'about_body')}</p>
        </div>
        <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(254,243,199,0.9) 0%, rgba(254,252,232,0.8) 100%)' }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center mb-3 shadow-sm">
            <Target className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">{t(lang, 'about_mission')}</p>
        </div>
      </div>

      <div className="card p-6 mt-4" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.1) 50%, rgba(245,158,11,0.1) 100%)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <div className="flex items-center justify-center gap-2" style={{ color: '#15803d' }}>
          <Heart className="w-5 h-5" />
          <span className="text-sm font-semibold">{t(lang, 'footer_made')}</span>
        </div>
      </div>
    </section>
  );
}
