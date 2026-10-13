import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const OrderContext = createContext(null);

// Recursively strip undefined values (Firestore rejects them)
function cleanUndefined(obj) {
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter((v) => v !== undefined);
  }
  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      out[k] = cleanUndefined(v);
    }
    return out;
  }
  return obj;
}

export function OrderProvider({ children }) {
  const [feedback, setFeedback] = useState([]);

  // Real-time feedback subscription (used by TopReviews on shop page)
  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setFeedback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        // Silent fail — feedback is optional social proof
        console.warn('[Feedback] subscription error:', err.message);
      }
    );
    return () => unsub();
  }, []);

  const saveOrder = async (order) => {
    const payload = cleanUndefined({
      orderId: order.orderId || '',
      customer: {
        name: order.customer?.name || '',
        phone: order.customer?.phone || '',
        address: order.customer?.address || '',
        notes: order.customer?.notes || '',
      },
      items: (order.items || []).map((i) => ({
        productId: i.productId || '',
        title: i.title || '',
        titleTa: i.titleTa || '',
        weight: i.weight || '',
        qty: i.qty || 0,
        price: i.price || 0,
        mrp: i.mrp || 0,
        discount: i.discount || 0,
        subtotal: i.subtotal || 0,
      })),
      subtotal: order.subtotal || 0,
      savings: order.savings || 0,
      total: order.total || 0,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    const ref = await addDoc(collection(db, 'orders'), payload);
    return ref.id;
  };

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const fetchFeedback = async () => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  return (
    <OrderContext.Provider
      value={{
        saveOrder,
        fetchOrders,
        updateOrderStatus,
        fetchFeedback,
        feedback,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}