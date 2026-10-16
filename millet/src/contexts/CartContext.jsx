import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { getVariants } from '../utils/variants';

const CartContext = createContext(null);
const STORAGE_KEY = 'vp_cart_v2';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((product, variantOrQty, qtyArg) => {
    let variant, qty;
    if (typeof variantOrQty === 'number') {
      qty = variantOrQty;
      variant = getVariants(product)[0];
    } else {
      variant = variantOrQty || getVariants(product)[0];
      qty = qtyArg || 1;
    }
    if (!variant) return;

    const cartId = `${product.id}__${variant.id || 'default'}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: cartId,
          productId: product.id,
          variantId: variant.id || 'default',
          title: product.title || '',
          titleTa: product.titleTa || '',
          weight: variant.weight || '',
          price: variant.price || 0,
          mrp: variant.mrp || variant.price || 0,
          discount: variant.discount || 0,
          imageUrl:
            (Array.isArray(product.images) && product.images[0]) ||
            product.imageUrl ||
            '',
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const totals = useMemo(() => {
    let subtotal = 0;
    let mrpTotal = 0;
    let count = 0;
    for (const i of items) {
      subtotal += (i.price || 0) * (i.qty || 0);
      mrpTotal += (i.mrp || i.price || 0) * (i.qty || 0);
      count += i.qty || 0;
    }
    const savings = Math.max(0, mrpTotal - subtotal);
    const total = subtotal;
    return { subtotal, mrpTotal, savings, total, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}