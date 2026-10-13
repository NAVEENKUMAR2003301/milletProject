import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { useConfetti } from '../../hooks/useConfetti';

export default function MagicPopup({
  open,
  orderId,
  total,
  whatsappUrl,
  blocked,
  onContinue,
}) {
  const { t } = useLang();
  const { play } = useSound();
  const fireConfetti = useConfetti();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!open) {
      setStage(0);
      return;
    }

    setStage(1);
    play('success');
    fireConfetti({ duration: 3200, count: 160 });

    const t1 = setTimeout(() => {
      setStage(2);
      play('sparkle');
    }, 700);

    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleManualOpen = () => {
    play('click');
    if (whatsappUrl) {
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-xl animate-fade-in" />

      {stage >= 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-40 h-40 rounded-full border-4 border-fresh-400 animate-ring-pulse" />
          <div
            className="absolute inset-0 w-40 h-40 rounded-full border-4 border-amber-400 animate-ring-pulse"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      )}

      <div className="relative glass-dark rounded-3xl p-7 md:p-10 max-w-md w-full text-center animate-magic-pop shadow-2xl border-2 border-white/80">
        <span className="absolute -top-2 -left-2 text-2xl animate-sparkle">✨</span>
        <span
          className="absolute -top-1 -right-3 text-xl animate-sparkle"
          style={{ animationDelay: '0.4s' }}
        >
          ✨
        </span>
        <span
          className="absolute -bottom-2 -left-3 text-xl animate-sparkle"
          style={{ animationDelay: '0.8s' }}
        >
          ⭐
        </span>
        <span
          className="absolute -bottom-1 -right-2 text-2xl animate-sparkle"
          style={{ animationDelay: '0.6s' }}
        >
          ✨
        </span>

        <div className="flex justify-center mb-5">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-fresh-400 to-trust-500 flex items-center justify-center animate-glow-pulse">
            <svg
              viewBox="0 0 52 52"
              className="w-14 h-14"
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 27 L23 36 L38 18" className="animate-draw-check" />
            </svg>
          </div>
        </div>

        <h2 className="font-display text-3xl font-extrabold text-trust-700 animate-float-up">
          {t('orderSuccess')}
        </h2>

        {stage >= 2 && (
          <div className="mt-3 flex flex-col items-center gap-2 animate-float-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-trust-50 border border-trust-100">
              <span className="text-[11px] font-bold text-trust-700 uppercase tracking-wide">
                {t('orderId')}
              </span>
              <span className="text-sm font-extrabold text-ink">{orderId}</span>
            </div>
            {typeof total === 'number' && total > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-fresh-50 border border-fresh-200">
                <span className="text-[11px] font-bold text-fresh-700 uppercase tracking-wide">
                  {t('total')}
                </span>
                <span className="text-sm font-extrabold text-fresh-700">
                  ₹{total}
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-ink/70 mt-4 leading-relaxed animate-float-up">
          {blocked
            ? 'Tap the button below to open WhatsApp and confirm your order.'
            : t('orderSuccessMsg')}
        </p>

        {stage >= 2 && (
          <div className="mt-6 flex flex-col gap-2 animate-float-up">
            <button onClick={handleManualOpen} className="btn-primary w-full">
              💬 {t('openWhatsapp')}
            </button>
            <button onClick={onContinue} className="btn-ghost w-full text-xs">
              {t('continueShopping')}
            </button>
          </div>
        )}

        <p className="text-[10px] text-ink/40 mt-5">🌾 {t('thankYou')}</p>
      </div>
    </div>
  );
}