import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';

export default function productModal({ product, onClose }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { play } = useSound();
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  // Build image array (supports both new `images[]` and legacy `imageUrl`)
  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.imageUrl
      ? [product.imageUrl]
      : [];

  useEffect(() => {
    if (!product) return;
    setQty(1);
    setImgIndex(0);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const title = lang === 'ta' && product.titleTa ? product.titleTa : product.title;
  const description =
    lang === 'ta' && product.descriptionTa ? product.descriptionTa : product.description;
  const price = product.price || 0;
  const mrp = product.mrp || price;
  const discount =
    product.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  const handleAdd = () => {
    if (!product.available) {
      play('buzz');
      return;
    }
    addItem(product, qty);
    play('pop');
    onClose();
  };

  const nextImg = () => {
    if (images.length < 2) return;
    play('tick');
    setImgIndex((i) => (i + 1) % images.length);
  };
  const prevImg = () => {
    if (images.length < 2) return;
    play('tick');
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const currentImg = images[imgIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto
                   glass-dark rounded-t-3xl md:rounded-3xl p-5 md:p-7
                   animate-slide-up shadow-glass-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 text-ink/60
                     hover:text-ink hover:bg-white transition"
          aria-label={t('close')}
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-trust-50">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl opacity-60">
                  🌾
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-white/90 backdrop-blur-sm text-trust-700 font-bold
                               hover:bg-white shadow-md transition active:scale-95"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-white/90 backdrop-blur-sm text-trust-700 font-bold
                               hover:bg-white shadow-md transition active:scale-95"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-ink/70 backdrop-blur-sm text-white text-[10px] font-bold">
                    {imgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {images.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => {
                      play('tick');
                      setImgIndex(i);
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === imgIndex
                        ? 'border-trust-500 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-display font-extrabold text-ink leading-tight">
              {title}
            </h2>

            {product.weight && (
              <p className="text-xs text-ink/50 mt-1">{product.weight}</p>
            )}

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-trust-700">
                {formatPrice(price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-ink/40 line-through">
                    {formatPrice(mrp)}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-[11px] font-bold">
                    {discount}% {t('discount')}
                  </span>
                </>
              )}
            </div>

            {description && (
              <p className="text-sm text-ink/70 mt-4 leading-relaxed">{description}</p>
            )}

            {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5">
                  {t('ingredients')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-trust-50 text-trust-700 text-[11px] font-medium border border-trust-100"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.preparation && (
              <div className="mt-4">
                <p className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1">
                  {t('preparation')}
                </p>
                <p className="text-xs text-ink/70 leading-relaxed whitespace-pre-line">
                  {product.preparation}
                </p>
              </div>
            )}

            {/* Qty + Add */}
            <div className="mt-5 pt-4 border-t border-trust-100/60 flex items-center gap-3 mt-auto">
              <div className="flex items-center rounded-xl bg-white border-2 border-trust-100">
                <button
                  onClick={() => {
                    play('tick');
                    setQty((q) => Math.max(1, q - 1));
                  }}
                  className="w-10 h-10 text-trust-700 font-bold text-lg hover:bg-trust-50 rounded-l-xl transition"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => {
                    play('tick');
                    setQty((q) => q + 1);
                  }}
                  className="w-10 h-10 text-trust-700 font-bold text-lg hover:bg-trust-50 rounded-r-xl transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!product.available}
                className="btn-primary flex-1"
              >
                {product.available
                  ? `${t('addToCart')} — ${formatPrice(price * qty)}`
                  : t('outOfStock')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}