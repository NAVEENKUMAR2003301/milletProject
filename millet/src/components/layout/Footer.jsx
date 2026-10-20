import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import { SHOP } from '../../config/shop';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-10 pb-24 md:pb-8 px-3 sm:px-5">
      <div className="glass-dark rounded-3xl p-6 sm:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="/logo.jpeg" alt={SHOP.brand} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-extrabold text-trust-700 text-lg leading-none">{SHOP.brand}</p>
                <p className="text-[10px] text-ink/50 mt-1">{SHOP.name}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink/60 leading-relaxed mb-4">{t('heroTagline')}</p>
            <p className="text-[10px] text-ink/40">FSSAI Lic: {SHOP.fssai}</p>
          </div>

          <div>
            <h4 className="font-bold text-trust-700 mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-ink/70 hover:text-trust-700 transition">Home</Link>
              <Link to="/shop" className="text-ink/70 hover:text-trust-700 transition">Shop All</Link>
              <Link to="/feedback" className="text-ink/70 hover:text-trust-700 transition">Feedback</Link>
              <Link to="/admin" className="text-ink/70 hover:text-trust-700 transition">Admin Login</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-trust-700 mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-ink/70">
              <p>📍 {SHOP.location}</p>
              <a href={`tel:${SHOP.phone}`} className="hover:text-trust-700 transition">📞 +{SHOP.phone}</a>
              <a href={`mailto:${SHOP.email}`} className="hover:text-trust-700 transition">✉️ {SHOP.email}</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-trust-100 text-center text-[10px] sm:text-xs text-ink/40">
          © {new Date().getFullYear()} {SHOP.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}