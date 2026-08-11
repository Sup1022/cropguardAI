import { useState } from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface DisclaimerProps {
  lang: Language;
  onAck: () => void;
}

export default function Disclaimer({ lang, onAck }: DisclaimerProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-warning-500 to-warning-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="font-display text-lg font-bold">{t(lang, 'disclaimer_title')}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">{t(lang, 'disclaimer_body')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { onAck(); setOpen(false); }}
              className="btn-primary flex-1"
            >
              <Check className="w-4 h-4" />
              {t(lang, 'disclaimer_ack')}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="btn-secondary"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
