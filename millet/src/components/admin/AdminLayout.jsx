import { useAdmin } from '../../contexts/AdminContext';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';

const TABS = [
  { id: 'products', label: 'manageProducts', icon: '📦' },
  { id: 'orders', label: 'viewOrders', icon: '🧾' },
  { id: 'feedback', label: 'feedback', icon: '💬' },
];

export default function AdminLayout({ children, activeTab, onTabChange }) {
  const { t } = useLang();
  const { logout } = useAdmin();
  const { play } = useSound();

  return (
    <div className="px-3 sm:px-4 max-w-6xl mx-auto pt-4 sm:pt-6 pb-24 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="glass-dark rounded-2xl px-4 md:px-5 py-4 flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Icon inside gradient circle — always visible */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-trust-500 to-fresh-500 flex items-center justify-center text-lg md:text-2xl shadow-md flex-shrink-0">
            🛠️
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-trust-700 text-base md:text-lg leading-none truncate">
              {t('dashboard')}
            </h1>
            <p className="text-[10px] md:text-[11px] text-ink/50 mt-1 truncate">
              {SHOP.brand} · {t('admin')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            play('click');
            logout();
          }}
          className="flex-shrink-0 px-3 py-2 rounded-xl bg-white/70 border-2 border-trust-100 text-trust-700 text-xs font-bold hover:border-trust-300 hover:bg-trust-50 transition active:scale-95"
        >
          🚪 <span className="hidden sm:inline">{t('logout')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              play('click');
              onTabChange(tab.id);
            }}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-trust-500 to-fresh-500 text-white border-transparent shadow-md'
                : 'bg-white/70 text-trust-700 border-trust-100 hover:border-trust-300'
            }`}
          >
            {tab.icon} {t(tab.label)}
          </button>
        ))}
      </div>

      {children}
    </div>
  );
}