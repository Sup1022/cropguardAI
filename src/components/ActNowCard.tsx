import {
  CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck,
  ThumbsUp, ThumbsDown, CalendarClock,
} from 'lucide-react';
import type { Language, ActionTiming } from '@/lib/types';
import { t } from '@/lib/i18n';

interface ActNowCardProps {
  lang: Language;
  timing: ActionTiming;
}

const riskConfig = {
  low: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', label: 'risk_low' },
  moderate: { color: 'text-secondary-600', bg: 'bg-secondary-50', border: 'border-secondary-200', label: 'risk_moderate' },
  high: { color: 'text-error-600', bg: 'bg-error-50', border: 'border-error-200', label: 'risk_high' },
  severe: { color: 'text-error-700', bg: 'bg-error-100', border: 'border-error-300', label: 'risk_severe' },
};

export default function ActNowCard({ lang, timing }: ActNowCardProps) {
  const risk = riskConfig[timing.riskLevel];

  return (
    <div className={`rounded-2xl border-2 p-6 sm:p-8 animate-fade-in-up ${timing.canActNow ? 'border-success-300 bg-gradient-to-br from-success-50 to-white' : 'border-error-300 bg-gradient-to-br from-error-50 to-white'}`}>
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${timing.canActNow ? 'bg-success-500' : 'bg-error-500'}`}>
          {timing.canActNow ? <CheckCircle2 className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{t(lang, 'actnow_title')}</div>
          <h2 className={`font-display text-xl sm:text-2xl font-bold leading-tight ${timing.canActNow ? 'text-success-700' : 'text-error-700'}`}>
            {timing.canActNow ? t(lang, 'actnow_yes') : t(lang, 'actnow_no')}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-white/70 border border-neutral-200 p-4">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1">{t(lang, 'actnow_reason')}</div>
          <p className="text-sm text-neutral-700 leading-relaxed">{timing.reason}</p>
        </div>

        <div className={`rounded-xl ${risk.bg} ${risk.border} border p-4`}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={`w-4 h-4 ${risk.color}`} />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{t(lang, 'actnow_risk')}</span>
          </div>
          <div className={`text-lg font-bold ${risk.color}`}>{t(lang, risk.label)}</div>
          {timing.riskFactors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {timing.riskFactors.map((rf, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${risk.color.replace('text', 'bg')} mt-1.5 shrink-0`} />
                  <span>{rf}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-white/70 border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{t(lang, 'actnow_recommendation')}</span>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">{timing.recommendation}</p>
        </div>

        <div className="rounded-xl bg-accent-50 border border-accent-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="w-4 h-4 text-accent-600" />
            <span className="text-xs font-bold text-accent-600 uppercase tracking-wide">{t(lang, 'actnow_window')}</span>
          </div>
          <div className="text-base font-bold text-accent-800">{timing.nextWindow}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-success-50 border border-success-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-success-600" />
              <span className="text-xs font-bold text-success-700 uppercase tracking-wide">{t(lang, 'actnow_safe')}</span>
            </div>
            <ul className="space-y-1.5">
              {timing.safeActions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {timing.unsafeActions.length > 0 && (
            <div className="rounded-xl bg-error-50 border border-error-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-4 h-4 text-error-600" />
                <span className="text-xs font-bold text-error-700 uppercase tracking-wide">{t(lang, 'actnow_unsafe')}</span>
              </div>
              <ul className="space-y-1.5">
                {timing.unsafeActions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <XCircle className="w-3.5 h-3.5 text-error-500 mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
