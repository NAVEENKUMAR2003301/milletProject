import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const { t } = useLang();
  const { count, openCart } = useCart();
  const { play } = useSound();

  const desktopLink = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      isActive ? 'bg-trust-500 text-white shadow-md' : 'text-trust-700 hover:bg-trust-50'
    }`;

  const mobileTab = ({ isActive }) =>
    `flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition-all ${
      isActive ? 'text-trust-600 bg-trust-50' : 'text-ink/60 hover:text-trust-600'
    }`;

  return (
    <header className="sticky top-0 z-50 pt-safe">
      <div className="px-3 sm:px-5 py-2">
        <nav className="glass-dark max-w-7xl mx-auto rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 shadow-sm">
          
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={() => play('click')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <img src="/logo.jpeg" alt={SHOP.brand} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div className="leading-tight min-w-0 pr-2">
              <p className="font-display font-extrabold text-trust-700 text-sm sm:text-base truncate">{SHOP.brand}</p>
              <p className="text-[10px] text-ink/50 hidden sm:block truncate">{SHOP.name}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={desktopLink} end onClick={() => play('click')}>{t('home')}</NavLink>
            <NavLink to="/shop" className={desktopLink} onClick={() => play('click')}>{t('shop')}</NavLink>
            <NavLink to="/feedback" className={desktopLink} onClick={() => play('click')}>{t('feedback')}</NavLink>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <LanguageToggle />
            
            <button onClick={() => { play('whoosh'); openCart(); }} className="relative p-2 rounded-xl bg-white border-2 border-trust-100 text-trust-700 hover:border-trust-300 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {count > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce-in shadow-sm">{count}</span>}
            </button>
            
            <Link to="/admin" className="p-2 rounded-xl bg-white border-2 border-trust-100 text-trust-700 hover:border-trust-300 transition-all active:scale-95" onClick={() => play('click')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="glass-dark border-t border-white/50 px-2 pt-1.5 pb-1.5 grid grid-cols-4 gap-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl mx-2 mb-2">
          <NavLink to="/" end className={mobileTab} onClick={() => play('click')}>
            <span className="text-lg mb-0.5">🏠</span>{t('home')}
          </NavLink>
          <NavLink to="/shop" className={mobileTab} onClick={() => play('click')}>
            <span className="text-lg mb-0.5">🛒</span>{t('shop')}
          </NavLink>
          <NavLink to="/feedback" className={mobileTab} onClick={() => play('click')}>
            <span className="text-lg mb-0.5">💬</span>{t('feedback')}
          </NavLink>
          <NavLink to="/admin" className={mobileTab} onClick={() => play('click')}>
            <span className="text-lg mb-0.5">🛠️</span>{t('admin')}
          </NavLink>
        </div>
      </div>
    </header>
  );
}