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

  const link = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-trust-500 text-white shadow-md'
        : 'text-trust-700 hover:bg-trust-50'
    }`;

  const tabClass = ({ isActive }) =>
    `py-2 rounded-xl text-[10px] font-semibold text-center transition-colors leading-tight ${
      isActive ? 'bg-trust-500 text-white' : 'text-trust-700'
    }`;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <nav className="glass-dark rounded-2xl px-3 sm:px-4 py-3 flex items-center justify-between shadow-glass-lg gap-2">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group min-w-0 flex-shrink-0"
          onClick={() => play('click')}
        >
          <img
            src="/logo.jpeg"
            alt={SHOP.brand}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0"
          />
          <div className="leading-tight min-w-0">
            <p className="font-display font-extrabold text-trust-700 text-sm sm:text-base tracking-tight truncate">
              {SHOP.brand}
            </p>
            <p className="text-[10px] text-ink/50 hidden sm:block truncate">
              {SHOP.name}
            </p>
          </div>
        </Link>

        {/* Center links (desktop only) */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={link} end onClick={() => play('click')}>
            {t('home')}
          </NavLink>
          <NavLink to="/shop" className={link} onClick={() => play('click')}>
            {t('shop')}
          </NavLink>
          <NavLink to="/feedback" className={link} onClick={() => play('click')}>
            {t('feedback')}
          </NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <LanguageToggle />

          {/* Cart */}
          <button
            onClick={() => {
              play('whoosh');
              openCart();
            }}
            aria-label={t('cart')}
            className="relative p-2 sm:p-2.5 rounded-xl bg-white/70 border-2 border-trust-100
                       text-trust-700 hover:border-trust-300 hover:bg-trust-50
                       transition-all active:scale-95 flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span
                key={count}
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1
                           rounded-full bg-gradient-to-br from-amber-500 to-amber-600
                           text-white text-[10px] font-bold flex items-center justify-center
                           animate-bounce-in shadow-md"
              >
                {count}
              </span>
            )}
          </button>

          {/* Admin — visible on ALL screens now */}
          <Link
            to="/admin"
            aria-label={t('admin')}
            className="inline-flex p-2 sm:p-2.5 rounded-xl bg-white/70 border-2 border-trust-100
                       text-trust-700 hover:border-trust-300 hover:bg-trust-50
                       transition-all active:scale-95 flex-shrink-0"
            onClick={() => play('click')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile bottom tab bar — 4 tabs */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="glass-dark rounded-2xl px-2 py-2 grid grid-cols-4 shadow-glass-lg gap-1">
          <NavLink to="/" end className={tabClass} onClick={() => play('click')}>
            <span className="block text-base leading-none mb-0.5">🏠</span>
            {t('home')}
          </NavLink>
          <NavLink to="/shop" className={tabClass} onClick={() => play('click')}>
            <span className="block text-base leading-none mb-0.5">🛒</span>
            {t('shop')}
          </NavLink>
          <NavLink to="/feedback" className={tabClass} onClick={() => play('click')}>
            <span className="block text-base leading-none mb-0.5">💬</span>
            {t('feedback')}
          </NavLink>
          <NavLink to="/admin" className={tabClass} onClick={() => play('click')}>
            <span className="block text-base leading-none mb-0.5">🛠️</span>
            {t('admin')}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
