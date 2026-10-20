import { useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';
import { getVariants, getLowestPrice, hasMultipleVariants } from '../../utils/variants';

export default function ProductCard({ product, onOpen }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { play } = useSound();
  const [added, setAdded] = useState(false);

  const title = lang === 'ta' && product.titleTa ? product.titleTa : product.title;
  const variants = getVariants(product);
  const multi = hasMultipleVariants(product);
  const lowestPrice = getLowestPrice(product);
  const firstVariant = variants[0] || {};
  const mrp = firstVariant.mrp || lowestPrice;
  const discount = firstVariant.discount || (mrp > lowestPrice ? Math.round(((mrp - lowestPrice) / mrp) * 100) : 0);
  const mainImage = (Array.isArray(product.images) && product.images[0]) || product.imageUrl || '';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.available) { play('buzz'); return; }
    if (multi) { onOpen?.(product); return; }
    const v = variants[0];
    if (!v) return;
    addItem(product, v, 1);
    play('pop');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div onClick={() => onOpen?.(product)} className="group cursor-pointer h-full flex flex-col bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-trust-50">
        {mainImage ? (
          <img src={mainImage} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🌾</div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
            {discount}% OFF
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-xl bg-ink/80 text-white text-xs font-bold">{t('outOfStock')}</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-ink text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-trust-600 transition-colors">
          {title}
        </h3>
        <p className="text-[10px] text-ink/50 mt-0.5 mb-2">
          {multi ? `${variants.length} Weights` : variants[0]?.weight || ''}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap mb-3">
            {multi && <span className="text-[10px] text-ink/50 font-semibold">From</span>}
            <span className="text-base sm:text-lg font-extrabold text-trust-700">{formatPrice(lowestPrice)}</span>
            {discount > 0 && <span className="text-[10px] text-ink/40 line-through">{formatPrice(mrp)}</span>}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`w-full py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 ${
              added ? 'bg-fresh-500 text-white scale-95' : 'bg-trust-50 text-trust-700 hover:bg-trust-500 hover:text-white active:scale-95'
            } ${!product.available ? 'opacity-50' : ''}`}
          >
            {added ? `✓ ${t('addedToCart')}` : multi ? `+ ${t('selectVariant')}` : `+ ${t('addToCart')}`}
          </button>
        </div>
      </div>
    </div>
  );
}