import { Sprout, Heart } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function Footer({ lang }: { lang: Language }) {
  return (
    <footer className="border-t border-primary-200/60" style={{ background: 'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(219,234,254,0.8) 50%, rgba(254,243,199,0.8) 100%)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 flex items-center justify-center shadow-md">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-primary-800 text-sm">CropGuard AI</div>
              <div className="text-xs text-primary-500 font-medium">{t(lang, 'tagline')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Heart className="w-3.5 h-3.5 text-error-400" />
            <span>{t(lang, 'footer_made')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
