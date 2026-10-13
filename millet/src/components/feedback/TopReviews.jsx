import { useMemo, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useOrders } from '../../contexts/OrderContext';
import { useSound } from '../../hooks/useSound';

export default function TopReviews() {
  const { lang, t } = useLang();
  const { feedback } = useOrders();
  const { play } = useSound();
  const [index, setIndex] = useState(0);

  // Top reviews: 4-5 stars only, newest first, max 6
  const top = useMemo(() => {
    return (feedback || [])
      .filter((f) => (f.rating || 0) >= 4 && f.message?.trim())
      .slice(0, 6);
  }, [feedback]);

  const avg = useMemo(() => {
    if (!feedback?.length) return 0;
    return (
      feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length
    ).toFixed(1);
  }, [feedback]);

  // Hide whole section if no reviews
  if (!top.length) return null;

  const current = top[index];

  const next = () => {
    play('tick');
    setIndex((i) => (i + 1) % top.length);
  };

  const prev = () => {
    play('tick');
    setIndex((i) => (i - 1 + top.length) % top.length);
  };

  return (
    <section className="mt-10 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink">
            ⭐ {t('feedback')}
          </h2>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-xs font-bold text-amber-700">{avg}</span>
            <span className="text-[10px] text-amber-600">
              ({feedback.length})
            </span>
          </div>
        </div>

        {top.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-8 h-8 rounded-lg bg-white/70 border-2 border-trust-100 text-trust-700 hover:border-trust-300 transition active:scale-95"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="w-8 h-8 rounded-lg bg-white/70 border-2 border-trust-100 text-trust-700 hover:border-trust-300 transition active:scale-95"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        key={current.id}
        className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up relative overflow-hidden"
      >
        {/* Big quote mark */}
        <div className="absolute -top-4 left-4 text-[80px] text-trust-100/40 font-serif leading-none select-none pointer-events-none">
          &ldquo;
        </div>

        <div className="relative">
          {/* Stars */}
          <div className="text-amber-500 text-lg mb-2">
            {'★'.repeat(current.rating || 0)}
            <span className="text-ink/20">
              {'★'.repeat(5 - (current.rating || 0))}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm md:text-base text-ink/80 leading-relaxed whitespace-pre-line line-clamp-3">
            {current.message}
          </p>

          {/* Name + date */}
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trust-500 to-fresh-500 flex items-center justify-center text-white text-xs font-bold">
                {(current.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-ink">
                  {current.name || 'Anonymous'}
                </p>
                {current.orderId && (
                  <p className="text-[10px] text-trust-700 font-semibold">
                    🧾 {current.orderId}
                  </p>
                )}
              </div>
            </div>

            {/* Dots */}
            <div className="flex gap-1">
              {top.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    play('tick');
                    setIndex(i);
                  }}
                  aria-label={`Review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-trust-500' : 'w-1.5 bg-ink/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}