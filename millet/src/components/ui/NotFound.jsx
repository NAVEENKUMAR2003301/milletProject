import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLang();

  return (
    <main className="px-4 max-w-2xl mx-auto py-16 text-center animate-fade-in">
      <div className="glass-dark rounded-3xl p-10 md:p-14">
        <div className="text-7xl mb-4 animate-float-med">🌾</div>
        <h1 className="font-display text-5xl font-extrabold text-trust-700">404</h1>
        <p className="text-sm text-ink/60 mt-3">
          This page wandered off like a millet seed in the wind.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            🏠 {t('home')}
          </Link>
          <Link to="/shop" className="btn-secondary">
            🛒 {t('shop')}
          </Link>
        </div>
      </div>
    </main>
  );
}