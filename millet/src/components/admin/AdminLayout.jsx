import { useAdmin } from '../../contexts/AdminContext';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';

const TABS = [
  { id: 'products', label: 'manageProducts', icon: '📦' },
  { id: 'orders', label: 'viewOrders', icon: '🧾' },
  { id: 'feedback', label: 'feedback', icon: '💬' },
  { id: 'shipping', label: 'Shipping', icon: '🚚' },
];

export default function AdminLayout({ children, activeTab, onTabChange }) {
  const { t } = useLang();
  const { logout } = useAdmin();
  const { play } = useSound();

  return (
    <div className="pt-4 sm:pt-6 animate-fade-in">
      <div className="glass-dark rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-trust-500 to-fresh-500 flex items-center justify-center text-xl sm:text-2xl shadow-md">🛠️</div>
          <div>
            <h1 className="font-display font-extrabold text-trust-700 text-lg sm:text-xl">{t('dashboard')}</h1>
            <p className="text-[10px] sm:text-xs text-ink/50">{SHOP.brand} Admin Panel</p>
          </div>
        </div>
        <button onClick={() => { play('click'); logout(); }} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs sm:text-sm font-bold hover:bg-red-100 transition w-full sm:w-auto">
          Logout
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { play('click'); onTabChange(tab.id); }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-trust-500 text-white border-trust-500 shadow-md'
                : 'bg-white text-trust-700 border-trust-100 hover:border-trust-300'
            }`}
          >
            {tab.icon} {tab.label === 'Shipping' ? 'Shipping' : t(tab.label)}
          </button>
        ))}
      </div>

      <div className="pb-10">{children}</div>
    </div>
  );
}