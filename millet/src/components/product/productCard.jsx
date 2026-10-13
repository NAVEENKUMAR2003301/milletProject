import { useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';

export default function ProductCard({ product, onOpen }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { play } = useSound();
  const [added, setAdded] = useState(false);

  const title = lang === 'ta' && product.titleTa ? product.titleTa : product.title;
  const price = product.price || 0;
  const mrp = product.mrp || price;
  const discount =
    product.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  // Main image — supports both new `images[]` and legacy `imageUrl`
  const mainImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.imageUrl ||
    '';
  const imageCount = Array.isArray(product.images) ? product.images.length : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.available) {
      play('buzz');
      return;
    }
    addItem(product, 1);
    play('pop');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpen?.(product)}
      className="card cursor-pointer group overflow-hidden relative hover:-translate-y-1 hover:shadow-glass-lg transition-all duration-300"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-trust-50 mb-3">
        {mainImage ? (
          <img
            src={mainImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-60">
            🌾
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-extrabold shadow-md">
            {discount}% {t('discount')}
          </div>
        )}

        {product.featured && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-fresh-500 text-white text-[10px] font-extrabold shadow-md">
            ⭐ {t('featured')}
          </div>
        )}

        {/* Multi-image badge */}
        {imageCount > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-ink/70 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
            📷 {imageCount}
          </div>
        )}

        {!product.available && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-xl bg-ink/80 text-white text-xs font-bold">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-bold text-ink text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>
        {product.weight && (
          <p className="text-[11px] text-ink/50 mt-0.5">{product.weight}</p>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-trust-700">
            {formatPrice(price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-ink/40 line-through">
              {formatPrice(mrp)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.available}
          className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            added
              ? 'bg-fresh-500 text-white scale-105'
              : 'bg-gradient-to-br from-trust-500 to-fresh-500 text-white hover:shadow-lg active:scale-95'
          } ${!product.available ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {added ? `✓ ${t('addedToCart')}` : t('addToCart')}
        </button>
      </div>
    </div>
  );
}