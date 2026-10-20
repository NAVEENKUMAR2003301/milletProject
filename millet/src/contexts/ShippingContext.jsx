import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { SHOP } from '../config/shop';

const ShippingContext = createContext(null);

export function ShippingProvider({ children }) {
  const [shippingMethods, setShippingMethods] = useState(SHOP.shippingMethods || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'shipping');
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists() && snap.data().methods) {
          setShippingMethods(snap.data().methods);
        } else {
          // Fallback to shop.js if DB is empty
          setShippingMethods(SHOP.shippingMethods);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('[Shipping] error:', err.message);
        setShippingMethods(SHOP.shippingMethods);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const updateShippingMethods = async (newMethods) => {
    const docRef = doc(db, 'settings', 'shipping');
    await setDoc(docRef, { methods: newMethods }, { merge: true });
  };

  return (
    <ShippingContext.Provider value={{ shippingMethods, updateShippingMethods, loading }}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) throw new Error('useShipping must be used within ShippingProvider');
  return ctx;
}