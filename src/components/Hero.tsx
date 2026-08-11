import { Camera, MapPin, Sparkles, ArrowRight, Leaf } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface HeroProps {
  lang: Language;
  onStart: () => void;
}

export default function Hero({ lang, onStart }: HeroProps) {
  const steps = [
    { icon: Camera, key: 'step_upload', descKey: 'step_upload_desc', color: 'from-primary-500 to-primary-700' },
    { icon: MapPin, key: 'step_location', descKey: 'step_location_desc', color: 'from-accent-500 to-accent-700' },
    { icon: Sparkles, key: 'step_diagnose', descKey: 'step_diagnose_desc', color: 'from-secondary-500 to-secondary-700' },
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #dbeafe 35%, #fef3c7 70%, #dcfce7 100%)' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-300/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-secondary-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(34,197,94,0.3)', color: '#15803d' }}>
            <Leaf className="w-3.5 h-3.5" />
            AI-Powered Crop Disease Advisory
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-4 animate-fade-in-up text-balance" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 30%, #1d4ed8 70%, #1e40af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t(lang, 'hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t(lang, 'hero_subtitle')}
          </p>

          <p className="text-sm font-semibold italic mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s', color: '#16a34a' }}>
            "{t(lang, 'tagline')}"
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onStart} className="btn-primary text-base px-7 py-3.5">
              {t(lang, 'hero_cta')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#how" className="btn-secondary text-base px-7 py-3.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(219,234,254,0.8) 100%)', border: '1px solid rgba(59,130,246,0.3)', color: '#1d4ed8' }}>
              {t(lang, 'hero_learn')}
            </a>
          </div>
        </div>

        <div id="how" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className="card card-hover p-5 animate-fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: i === 0 ? '#16a34a' : i === 1 ? '#2563eb' : '#d97706' }}>STEP {i + 1}</div>
                <h3 className="font-semibold text-neutral-800 mb-1">{t(lang, step.key)}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{t(lang, step.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
