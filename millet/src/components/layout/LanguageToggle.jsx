import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  const { play } = useSound();

  return (
    <button
      onClick={() => {
        play('click');
        toggleLang();
      }}
      aria-label="Toggle language"
      className="relative inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold
                 bg-white/70 border-2 border-trust-100 text-trust-700
                 hover:border-trust-300 hover:bg-trust-50 transition-all active:scale-95"
    >
      <span className={lang === 'en' ? 'text-trust-700' : 'text-ink/40'}>EN</span>
      <span className="text-ink/20">|</span>
      <span className={lang === 'ta' ? 'text-trust-700' : 'text-ink/40'}>த</span>
    </button>
  );
}