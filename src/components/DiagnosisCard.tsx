import {
  Sparkles, AlertTriangle, CheckCircle2, Leaf, TrendingUp,
  Microscope, ShieldAlert, Info,
} from 'lucide-react';
import type { Language, DiagnosisResult } from '@/lib/types';
import { t } from '@/lib/i18n';

interface DiagnosisCardProps {
  lang: Language;
  diagnosis: DiagnosisResult;
}

const severityConfig = {
  low: { color: 'bg-success-100 text-success-700 border-success-200', bar: 'bg-success-500', desc: 'severity_low_desc' },
  moderate: { color: 'bg-secondary-100 text-secondary-700 border-secondary-200', bar: 'bg-secondary-500', desc: 'severity_moderate_desc' },
  high: { color: 'bg-error-100 text-error-700 border-error-200', bar: 'bg-error-500', desc: 'severity_high_desc' },
  severe: { color: 'bg-error-100 text-error-700 border-error-200', bar: 'bg-error-600', desc: 'severity_high_desc' },
};

export default function DiagnosisCard({ lang, diagnosis }: DiagnosisCardProps) {
  const sev = severityConfig[diagnosis.severity];
  const sevKey = `diagnosis_severity_${diagnosis.severity}`;

  return (
    <div className="card p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
            <Microscope className="w-6 h-6 text-primary-600" />
            {t(lang, 'diagnosis_title')}
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full bg-secondary-50 border border-secondary-200 text-secondary-700 text-xs font-semibold">
            <Info className="w-3 h-3" />
            {t(lang, 'diagnosis_assisted')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-4">
          <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">{t(lang, 'diagnosis_likely')}</div>
          <div className="text-lg font-bold text-neutral-900 leading-tight">{diagnosis.diseaseName}</div>
        </div>
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">{t(lang, 'diagnosis_crop')}</div>
          <div className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary-500" />
            {diagnosis.cropGuess}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-700">{t(lang, 'diagnosis_confidence')}</span>
          <span className="text-sm font-bold text-primary-700">{diagnosis.confidence}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out"
            style={{ width: `${diagnosis.confidence}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-700">{t(lang, 'diagnosis_severity')}</span>
          <span className={`badge border ${sev.color}`}>
            <span className={`w-2 h-2 rounded-full ${sev.bar}`} />
            {t(lang, sevKey)}
          </span>
        </div>
        <p className="text-xs text-neutral-500">{t(lang, sev.desc)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-secondary-500" />
          {t(lang, 'diagnosis_symptoms')}
        </h3>
        <div className="space-y-2">
          {diagnosis.symptoms.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm text-neutral-900">{s.label}</div>
                <div className="text-sm text-neutral-500">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" />
          {t(lang, 'diagnosis_causes')}
        </h3>
        <ul className="space-y-2">
          {diagnosis.causes.map((c, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-neutral-600">
              <span className="w-5 h-5 rounded-full bg-accent-100 text-accent-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-warning-50 border border-warning-200 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-sm text-warning-800 mb-0.5">{t(lang, 'diagnosis_spread')}</div>
            <p className="text-sm text-warning-700">{diagnosis.spreadRisk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
