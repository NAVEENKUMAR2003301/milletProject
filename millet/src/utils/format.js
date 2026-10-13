import { SHOP } from '../config/shop';

export const formatPrice = (n) => `${SHOP.currency}${Number(n || 0).toFixed(0)}`;

export const formatPriceDecimal = (n) => `${SHOP.currency}${Number(n || 0).toFixed(2)}`;

export const formatDate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');