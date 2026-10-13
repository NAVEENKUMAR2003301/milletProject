import { useAdmin } from '../../contexts/AdminContext';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';

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
    <div className="px-4 max-w-6xl mx-auto pt-6 animate-fade-in">
      {/* Header */}
      <div className="glass-dark rounded-2xl px-5 py-4 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛠️</span>
          <div>
            <h1 className="font-display font-extrabold text-trust-700 text-lg leading-none">
              {t('dashboard')}
            </h1>
            <p className="text-[11px] text-ink/50 mt-1">{t('admin')}</p>
          </div>
        </div>

        <button
          onClick={() => {
            play('click');
            logout();
          }}
          className="btn-ghost text-xs"
        >
          🚪 {t('logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              play('click');
              onTabChange(tab.id);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 ${
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