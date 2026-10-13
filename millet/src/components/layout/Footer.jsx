import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import { SHOP } from '../../config/shop';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-16 pb-24 md:pb-8 px-4">
      <div className="glass-dark rounded-3xl p-6 md:p-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🌾</span>
              <div>
                <p className="font-extrabold text-trust-700 text-lg">{SHOP.brand}</p>
                <p className="text-xs text-ink/50">{SHOP.name}</p>
              </div>
            </div>
            <p className="text-sm text-ink/60">
              {t('heroTagline')}
            </p>
            <p className="text-xs text-ink/40 mt-3">
              {t('fssaiLic')} {SHOP.fssai}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-trust-700 mb-3 text-sm uppercase tracking-wide">
              {t('quickLinks')}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-ink/70 hover:text-trust-700 transition">
                {t('home')}
              </Link>
              <Link to="/shop" className="text-ink/70 hover:text-trust-700 transition">
                {t('shop')}
              </Link>
              <Link to="/feedback" className="text-ink/70 hover:text-trust-700 transition">
                {t('feedback')}
              </Link>
              <Link to="/admin" className="text-ink/70 hover:text-trust-700 transition">
                {t('admin')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-trust-700 mb-3 text-sm uppercase tracking-wide">
              {t('contactUs')}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-ink/70">
              <p>📍 {SHOP.location}</p>
              <a
                href={`tel:${SHOP.phone}`}
                className="hover:text-trust-700 transition"
              >
                📞 +{SHOP.phone}
              </a>
              <a
                href={`mailto:${SHOP.email}`}
                className="hover:text-trust-700 transition break-all"
              >
                ✉️ {SHOP.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-trust-100/60 text-center text-xs text-ink/50">
          © {new Date().getFullYear()} {SHOP.name}. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
}