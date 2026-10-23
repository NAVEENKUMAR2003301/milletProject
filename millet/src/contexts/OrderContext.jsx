import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs, query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendOrderEmail } from '../utils/email';

const OrderContext = createContext(null);

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

  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => { setFeedback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); },
      (err) => { console.warn('[Feedback] subscription error:', err.message); }
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
        variantId: i.variantId || '',
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
      shippingMethod: order.shippingMethod || 'Standard',
      shippingCost: order.shippingCost || 0,
      total: order.total || 0,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    const ref = await addDoc(collection(db, 'orders'), payload);

    sendOrderEmail(payload).catch((err) => console.warn('[Email] order email failed:', err));
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

  // 🟢 NEW: Delete Feedback Function
  const deleteFeedback = async (id) => {
    await deleteDoc(doc(db, 'feedback', id));
  };

  return (
    <OrderContext.Provider value={{ saveOrder, fetchOrders, updateOrderStatus, fetchFeedback, deleteFeedback, feedback }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}