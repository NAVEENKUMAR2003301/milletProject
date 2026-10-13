import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';

export default function CartItem({ item }) {
  const { lang, t } = useLang();
  const { updateQty, removeItem } = useCart();
  const { play } = useSound();

  const title = lang === 'ta' && item.titleTa ? item.titleTa : item.title;

  const inc = () => {
    play('tick');
    updateQty(item.id, item.qty + 1);
  };
  const dec = () => {
    play('tick');
    if (item.qty > 1) updateQty(item.id, item.qty - 1);
    else remove();
  };
  const remove = () => {
    play('whoosh');
    removeItem(item.id);
  };

  return (
    <div className="flex gap-3 py-3 border-b border-trust-100/60 last:border-0 animate-fade-in">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-trust-50 flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-60">
            🌾
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-ink text-sm line-clamp-2 leading-snug">
          {title}
        </h4>
        {item.weight && (
          <p className="text-[10px] text-ink/50 mt-0.5">{item.weight}</p>
        )}
        <p className="text-sm font-extrabold text-trust-700 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Qty + remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={remove}
          aria-label={t('remove')}
          className="text-ink/40 hover:text-red-500 transition p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>

        <div className="flex items-center rounded-lg bg-white border-2 border-trust-100">
          <button
            onClick={dec}
            className="w-7 h-7 text-trust-700 font-bold hover:bg-trust-50 rounded-l-md transition"
          >
            −
          </button>
          <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
          <button
            onClick={inc}
            className="w-7 h-7 text-trust-700 font-bold hover:bg-trust-50 rounded-r-md transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}