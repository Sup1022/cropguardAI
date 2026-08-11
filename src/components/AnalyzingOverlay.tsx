import { Loader2, ScanLine, CloudSun, Brain, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface AnalyzingOverlayProps {
  lang: Language;
}

const STEPS = [
  { icon: ScanLine, label: 'Reading leaf patterns...' },
  { icon: Brain, label: 'Matching symptoms against disease library...' },
  { icon: CloudSun, label: 'Cross-checking with live weather...' },
  { icon: CheckCircle2, label: 'Building your advisory...' },
];

export default function AnalyzingOverlay({ lang }: AnalyzingOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((p) => Math.min(p + 1, STEPS.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center max-w-sm px-6">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-60" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-neutral-900 mb-1">{t(lang, 'analyzing')}</h2>
        <p className="text-sm text-neutral-500 mb-6">{t(lang, 'analyzing_desc')}</p>

        <div className="space-y-2.5 text-left">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors
                  ${done ? 'bg-success-500' : active ? 'bg-primary-500' : 'bg-neutral-200'}`}>
                  {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 text-white ${active ? 'animate-pulse' : ''}`} />}
                </div>
                <span className={`text-sm ${active ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
