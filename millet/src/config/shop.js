export const SHOP = {
  name: import.meta.env.VITE_SHOP_NAME || 'VP Food Products',
  brand: import.meta.env.VITE_BRAND_NAME || "Priya's",
  fssai: import.meta.env.VITE_FSSAI || '',
  phone: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  email: import.meta.env.VITE_SHOP_EMAIL || '',
  location: import.meta.env.VITE_SHOP_LOCATION || '',
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'admin',
  currency: '₹',
  categories: [
    { id: 'dosa-mix',    en: 'Dosa Mix',     ta: 'தோசை மாவு' },
    { id: 'rice-flour',  en: 'Rice Flour',   ta: 'அரிசி மாவு' },
    { id: 'malt',        en: 'Malt Drinks',  ta: 'மால்ட் பானங்கள்' },
    { id: 'health-mix',  en: 'Health Mix',   ta: 'ஹெல்த் மிக்ஸ்' },
  ],
  // 🚚 SHIPPING METHODS
  shippingMethods: [
    {
      id: 'standard',
      name: 'Standard Delivery',
      desc: 'Delivered in 3-5 days',
      cost: 40,
      freeAbove: 500, // Free if cart subtotal >= 500
    },
    {
      id: 'express',
      name: 'Express Delivery',
      desc: 'Delivered in 1-2 days',
      cost: 100,
      freeAbove: null,
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      desc: 'Pick up from our Panruti store',
      cost: 0,
      freeAbove: null,
    },
  ],
};