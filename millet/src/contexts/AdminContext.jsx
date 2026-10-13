import { createContext, useContext, useEffect, useState } from 'react';
import { SHOP } from '../config/shop';

const AdminContext = createContext(null);
const STORAGE_KEY = 'vp_admin_session';

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAdmin) sessionStorage.setItem(STORAGE_KEY, 'true');
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [isAdmin]);

  const login = (password) => {
    if (password === SHOP.adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}