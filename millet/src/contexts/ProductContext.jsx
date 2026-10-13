import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[Products]', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const addProduct = async (data) => {
    const payload = {
      title: '',
      titleTa: '',
      description: '',
      descriptionTa: '',
      ingredients: [],
      preparation: '',
      weight: '',
      category: 'dosa-mix',
      price: 0,
      mrp: 0,
      discount: 0,
      imageUrl: '',
      available: true,
      featured: false,
      ...data,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'products'), payload);
    return ref.id;
  };

  const updateProduct = async (id, data) => {
    await updateDoc(doc(db, 'products', id), data);
  };

  const removeProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, error, addProduct, updateProduct, removeProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}