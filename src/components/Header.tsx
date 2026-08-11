import { Sprout, Globe } from 'lucide-react';
import type { Language } from '@/lib/types';
import { languageNames, t } from '@/lib/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  onNav: (id: string) => void;
}

const NAV_ITEMS = [
  { id: 'analyze', key: 'nav_analyze' },
  { id: 'calendar', key: 'nav_crops' },
  { id: 'history', key: 'nav_history' },
  { id: 'about', key: 'nav_about' },
];

export default function Header({ lang, setLang, onNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary-200/60" style={{ background: 'linear-gradient(90deg, rgba(240,253,244,0.9) 0%, rgba(219,234,254,0.85) 50%, rgba(254,243,199,0.85) 100%)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => onNav('top')}
          className="flex items-center gap-2.5 group"
          aria-label="CropGuard AI home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="text-left leading-tight">
            <div className="font-display font-bold text-primary-800 text-base sm:text-lg">CropGuard AI</div>
            <div className="hidden sm:block text-[10px] text-primary-500 font-semibold uppercase tracking-wider">
              Smart Crop Advisory
            </div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 hover:text-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all"
            >
              {t(lang, item.key)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Globe className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="appearance-none pl-8 pr-7 py-2 rounded-lg bg-white/70 border border-primary-200 text-sm font-medium text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              aria-label={t(lang, 'lang_label')}
            >
              {(Object.keys(languageNames) as Language[]).map((l) => (
                <option key={l} value={l}>
                  {languageNames[l].flag} {languageNames[l].native}
                </option>
              ))}
            </select>
            <svg className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <nav className="md:hidden border-t border-primary-100 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-hide" style={{ background: 'linear-gradient(90deg, rgba(240,253,244,0.6) 0%, rgba(219,234,254,0.5) 100%)' }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-700 hover:text-white hover:bg-primary-500 transition-all whitespace-nowrap"
          >
            {t(lang, item.key)}
          </button>
        ))}
      </nav>
    </header>
  );
}
