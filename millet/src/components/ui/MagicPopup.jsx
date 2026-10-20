import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { useConfetti } from '../../hooks/useConfetti';

export default function MagicPopup({ open, orderId, total, whatsappUrl, blocked, onContinue }) {
  const { t } = useLang();
  const { play } = useSound();
  const fireConfetti = useConfetti();
  const [stage, setStage] = useState(0); 

  useEffect(() => {
    if (!open) { setStage(0); return; }
    setStage(1);
    play('success');
    fireConfetti({ duration: 4000, count: 200 });

    const t1 = setTimeout(() => { setStage(2); play('sparkle'); }, 600);
    return () => clearTimeout(t1);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fade-in" />

      {stage >= 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-fresh-400 animate-ring-pulse" />
          <div className="absolute inset-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-amber-400 animate-ring-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      )}

      <div className="relative glass-dark rounded-[2rem] p-6 sm:p-10 max-w-sm sm:max-w-md w-full text-center animate-magic-pop shadow-2xl border-2 border-white/80">
        <span className="absolute -top-3 -left-3 text-3xl animate-sparkle">✨</span>
        <span className="absolute -top-2 -right-4 text-2xl animate-sparkle" style={{ animationDelay: '0.4s' }}>✨</span>
        <span className="absolute -bottom-3 -left-4 text-2xl animate-sparkle" style={{ animationDelay: '0.8s' }}>⭐</span>
        <span className="absolute -bottom-2 -right-3 text-3xl animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</span>

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-fresh-400 to-trust-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 27 L23 36 L38 18" className="animate-draw-check" />
            </svg>
          </div>
        </div>

        <h2 className="font-display text-3xl font-extrabold text-trust-700">{t('orderSuccess')}</h2>

        {stage >= 2 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-trust-50 border border-trust-100">
              <span className="text-[10px] font-bold text-trust-700 uppercase">Order ID:</span>
              <span className="text-sm font-extrabold text-ink">{orderId}</span>
            </div>
            <div className="text-sm font-bold text-fresh-600">Total: ₹{total}</div>
          </div>
        )}

        <p className="text-sm text-ink/70 mt-4 leading-relaxed">
          {blocked ? 'Tap below to open WhatsApp and confirm your order.' : 'Opening WhatsApp to confirm your order...'}
        </p>

        {stage >= 2 && (
          <div className="mt-6 flex flex-col gap-2">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => play('click')} className="btn-primary w-full py-3">💬 {t('openWhatsapp')}</a>
            <button onClick={onContinue} className="btn-ghost w-full text-xs">{t('continueShopping')}</button>
          </div>
        )}
      </div>
    </div>
  );
}