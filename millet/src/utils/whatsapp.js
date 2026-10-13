import { SHOP } from '../config/shop';

export function buildWhatsAppLink(text) {
  const phone = String(SHOP.phone || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${phone}?text=${encoded}`;

  // TEMP DEBUG
  console.log('[WhatsApp] Phone:', phone);
  console.log('[WhatsApp] URL length:', url.length);

  return url;
}

export function openWhatsApp(text) {
  const url = buildWhatsAppLink(text);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  return win; // null if blocked
}