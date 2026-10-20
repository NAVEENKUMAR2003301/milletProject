import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useShipping } from '../../contexts/ShippingContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';
import CartItem from './CartItem';
import EmptyState from '../ui/EmptyState';

export default function CartDrawer() {
  const { t } = useLang();
  const { items, isOpen, closeCart, clearCart, subtotal, savings, count } = useCart();
  const { shippingMethods } = useShipping();
  const { play } = useSound();
  const navigate = useNavigate();

  const defaultShipping = shippingMethods.find(m => m.id === 'standard') || shippingMethods[0];
  const shippingCost = defaultShipping ? (defaultShipping.freeAbove && subtotal >= defaultShipping.freeAbove ? 0 : defaultShipping.cost) : 0;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" onClick={closeCart}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" />
      
      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[100vw] sm:max-w-md h-[100dvh] bg-white shadow-2xl animate-slide-in-right flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-trust-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="font-display font-extrabold text-trust-700 text-lg">{t('yourCart')} ({count})</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-full bg-trust-50 text-ink/60 hover:bg-trust-100 transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4">
          {items.length === 0 ? (
            <EmptyState emoji="🛒" title={t('emptyCart')} subtitle={t('emptyCartHint')} action={<button onClick={() => { closeCart(); navigate('/shop'); }} className="btn-primary py-2 text-sm">{t('shopNow')}</button>} />
          ) : (
            <div className="divide-y divide-trust-100/50">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-trust-100 px-5 py-4 bg-trust-50/80 backdrop-blur-md pb-safe">
            <div className="flex justify-between text-sm mb-1"><span className="text-ink/60">{t('subtotal')}</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
            {savings > 0 && <div className="flex justify-between text-sm mb-1 text-fresh-600"><span>{t('savings')}</span><span className="font-bold">− {formatPrice(savings)}</span></div>}
            {defaultShipping && <div className="flex justify-between text-sm mb-2 text-trust-700 font-semibold"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>}
            <div className="flex justify-between text-lg mt-2 pt-3 border-t-2 border-dashed border-trust-200"><span className="font-bold">{t('total')}</span><span className="font-extrabold text-trust-700">{formatPrice(grandTotal)}</span></div>
            
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => { play('click'); closeCart(); navigate('/checkout'); }} className="btn-primary w-full py-3">{t('checkout')} →</button>
              <button onClick={() => { play('whoosh'); clearCart(); }} className="btn-ghost text-xs w-full text-red-500 hover:bg-red-50">{t('clearCart')}</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}