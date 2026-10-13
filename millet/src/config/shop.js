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
};