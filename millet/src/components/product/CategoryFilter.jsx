import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';

const catKey = {
  'dosa-mix': 'dosaMix',
  'rice-flour': 'riceFlour',
  malt: 'malt',
  'health-mix': 'healthMix',
};

export default function CategoryFilter({ active, onChange }) {
  const { t } = useLang();
  const { play } = useSound();

  const handle = (id) => {
    play('click');
    onChange(id);
  };

  const base =
    'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border-2 flex-shrink-0';
  const on = 'bg-gradient-to-br from-trust-500 to-fresh-500 text-white border-transparent shadow-md';
  const off = 'bg-white/70 text-trust-700 border-trust-100 hover:border-trust-300';

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full">
      <button
        onClick={() => handle('all')}
        className={`${base} ${active === 'all' ? on : off}`}
      >
        {t('allCategories')}
      </button>
      {SHOP.categories.map((c) => (
        <button
          key={c.id}
          onClick={() => handle(c.id)}
          className={`${base} ${active === c.id ? on : off}`}
        >
          {t(catKey[c.id])}
        </button>
      ))}
    </div>
  );
}