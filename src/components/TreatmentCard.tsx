import { FlaskConical, Zap, CalendarClock, ShieldCheck } from 'lucide-react';
import type { Language, TreatmentStep } from '@/lib/types';
import { t } from '@/lib/i18n';

interface TreatmentCardProps {
  lang: Language;
  steps: TreatmentStep[];
}

const priorityConfig = {
  immediate: { icon: Zap, color: 'border-error-200 bg-error-50', badge: 'bg-error-100 text-error-700', key: 'treatment_immediate' },
  'short-term': { icon: CalendarClock, color: 'border-secondary-200 bg-secondary-50', badge: 'bg-secondary-100 text-secondary-700', key: 'treatment_short' },
  preventive: { icon: ShieldCheck, color: 'border-primary-200 bg-primary-50', badge: 'bg-primary-100 text-primary-700', key: 'treatment_preventive' },
};

export default function TreatmentCard({ lang, steps }: TreatmentCardProps) {
  const ordered = ['immediate', 'short-term', 'preventive'] as const;
  const grouped = ordered.map((p) => ({ priority: p, items: steps.filter((s) => s.priority === p) })).filter((g) => g.items.length > 0);

  return (
    <div className="card p-6 sm:p-8 animate-fade-in-up">
      <div className="mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary-600" />
          {t(lang, 'treatment_title')}
        </h2>
        <p className="text-sm text-neutral-500">{t(lang, 'treatment_subtitle')}</p>
      </div>

      <div className="space-y-5">
        {grouped.map((group) => {
          const cfg = priorityConfig[group.priority];
          const Icon = cfg.icon;
          return (
            <div key={group.priority}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge ${cfg.badge}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t(lang, cfg.key)}
                </span>
              </div>
              <div className="space-y-2">
                {group.items.map((step, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${cfg.color}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 text-neutral-700 text-sm font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 mb-0.5">{step.title}</div>
                        <p className="text-sm text-neutral-600 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
