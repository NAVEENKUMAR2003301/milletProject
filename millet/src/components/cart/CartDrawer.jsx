import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';
import CartItem from './CartItem';
import EmptyState from '../ui/EmptyState';

export default function CartDrawer() {
  const { t } = useLang();
  const {
    items,
    isOpen,
    closeCart,
    clearCart,
    subtotal,
    savings,
    total,
    count,
  } = useCart();
  const { play } = useSound();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart();
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    play('click');
    closeCart();
    navigate('/checkout');
  };

  const handleClear = () => {
    play('whoosh');
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={closeCart}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" />

      {/* Drawer */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white
                   shadow-2xl animate-slide-in-right flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-trust-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="font-display font-extrabold text-trust-700 text-lg leading-none">
                {t('yourCart')}
              </h2>
              <p className="text-xs text-ink/50 mt-1">
                {count} {t('itemsCount')}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label={t('close')}
            className="p-2 rounded-xl text-ink/50 hover:bg-trust-50 hover:text-ink transition"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyState
              emoji="🛒"
              title={t('emptyCart')}
              subtitle={t('emptyCartHint')}
              action={
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="btn-primary"
                >
                  {t('shopNow')}
                </button>
              }
            />
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-trust-100 px-5 py-4 bg-trust-50/50">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-ink/60">{t('subtotal')}</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm mb-1 text-fresh-600">
                <span>{t('savings')}</span>
                <span className="font-bold">− {formatPrice(savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg mt-2 pt-2 border-t border-trust-100">
              <span className="font-bold">{t('total')}</span>
              <span className="font-extrabold text-trust-700">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={handleCheckout} className="btn-primary w-full">
                {t('checkout')} →
              </button>
              <button onClick={handleClear} className="btn-ghost text-xs w-full">
                {t('clearCart')}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}