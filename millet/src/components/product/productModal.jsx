import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';
import { getVariants } from '../../utils/variants';

export default function ProductModal({ product, onClose }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { play } = useSound();
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [variantId, setVariantId] = useState(null);

  const variants = useMemo(() => getVariants(product), [product]);
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    return product.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setQty(1);
    setImgIndex(0);
    setVariantId(variants[0]?.id || null);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose, variants]);

  if (!product) return null;

  const selectedVariant = variants.find((v) => v.id === variantId) || variants[0];
  const title = lang === 'ta' && product.titleTa ? product.titleTa : product.title;
  const description = lang === 'ta' && product.descriptionTa ? product.descriptionTa : product.description;
  
  const price = selectedVariant?.price || 0;
  const mrp = selectedVariant?.mrp || price;
  const discount = selectedVariant?.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  const handleAdd = () => {
    if (!product.available) { play('buzz'); return; }
    if (!selectedVariant) return;
    addItem(product, selectedVariant, qty);
    play('pop');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white md:glass-dark rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] md:max-h-[85vh] animate-slide-up overflow-hidden"
      >
        <div className="md:hidden w-12 h-1.5 bg-ink/20 rounded-full mx-auto mt-3 flex-shrink-0" />

        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-ink/60 hover:text-ink shadow-sm backdrop-blur-md transition active:scale-95">✕</button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-4 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            {/* Images */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-trust-50 border border-trust-100/50 shadow-sm">
                {images[imgIndex] ? (
                  <img src={images[imgIndex]} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl opacity-40">🌾</div>
                )}

                {images.length > 1 && (
                  <>
                    <button onClick={() => { play('tick'); setImgIndex((i) => (i - 1 + images.length) % images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-md text-trust-700 font-bold flex items-center justify-center shadow-md hover:bg-white transition active:scale-95">‹</button>
                    <button onClick={() => { play('tick'); setImgIndex((i) => (i + 1) % images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-md text-trust-700 font-bold flex items-center justify-center shadow-md hover:bg-white transition active:scale-95">›</button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-ink/60 backdrop-blur-md text-white text-[10px] font-bold">{imgIndex + 1} / {images.length}</div>
                  </>
                )}

                {discount > 0 && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-extrabold shadow-md">{discount}% OFF</div>}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((url, i) => (
                    <button key={url + i} onClick={() => { play('tick'); setImgIndex(i); }} className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === imgIndex ? 'border-trust-500 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-ink leading-tight mb-2">{title}</h2>

              <div className="flex items-baseline gap-2.5 mb-5">
                <span className="text-3xl md:text-4xl font-extrabold text-trust-700">{formatPrice(price)}</span>
                {discount > 0 && <span className="text-sm md:text-base text-ink/40 line-through font-semibold">{formatPrice(mrp)}</span>}
              </div>

              {variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-2.5">Select Weight</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => (
                      <button key={v.id} onClick={() => { play('tick'); setVariantId(v.id); }} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${v.id === selectedVariant?.id ? 'bg-trust-500 text-white border-trust-500 shadow-md' : 'bg-white text-trust-700 border-trust-100 hover:border-trust-300'}`}>
                        <span>{v.weight || 'Standard'}</span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${v.id === selectedVariant?.id ? 'bg-white/20' : 'bg-trust-50 text-trust-600'}`}>₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {description && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-ink/70 leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-trust-100 p-4 md:p-6 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex items-center rounded-xl bg-white border-2 border-trust-100 h-12">
              <button onClick={() => { play('tick'); setQty((q) => Math.max(1, q - 1)); }} className="w-10 h-full text-trust-700 font-bold text-xl hover:bg-trust-50 rounded-l-xl transition">−</button>
              <span className="w-8 text-center font-bold text-ink">{qty}</span>
              <button onClick={() => { play('tick'); setQty((q) => q + 1); }} className="w-10 h-full text-trust-700 font-bold text-xl hover:bg-trust-50 rounded-r-xl transition">+</button>
            </div>

            <button onClick={handleAdd} disabled={!product.available} className="btn-primary flex-1 h-12 text-base md:text-lg font-bold shadow-lg">
              {product.available ? `Add to Cart — ${formatPrice(price * qty)}` : t('outOfStock')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}