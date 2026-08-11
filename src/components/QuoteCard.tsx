import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';
import { QUOTES, randomQuote } from '@/lib/quotes';

export default function QuoteCard({ lang }: { lang: Language }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    setIdx(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const quote = QUOTES[idx % QUOTES.length];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <QuoteIcon className="w-10 h-10 text-primary-300 mb-4" />
          <blockquote className="text-lg sm:text-xl font-medium leading-relaxed mb-4 text-balance">
            "{quote.text}"
          </blockquote>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <cite className="text-primary-200 text-sm font-semibold not-italic">— {quote.author}</cite>
            <button
              onClick={() => setIdx((p) => {
                let n = Math.floor(Math.random() * QUOTES.length);
                if (n === p) n = (n + 1) % QUOTES.length;
                return n;
              })}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t(lang, 'quote_next')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
