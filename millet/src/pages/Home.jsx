import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { useSound } from '../hooks/useSound';
import ProductGrid from '../components/product/productGrid'; // 🟢 CHANGED TO LOWERCASE
import ProductModal from '../components/product/productModal'; // 🟢 CHANGED TO LOWERCASE
import EmptyState from '../components/ui/EmptyState';
import { SHOP } from '../config/shop';

export default function Home() {
  const { t } = useLang();
  const { products, loading } = useProducts();
  const { play } = useSound();
  const [openProduct, setOpenProduct] = useState(null);

  const availableProducts = products.filter((p) => p.available);
  const featured = availableProducts.filter((p) => p.featured).slice(0, 4);
  const showcase = featured.length > 0 ? featured : availableProducts.slice(0, 8);

  return (
    <main className="pt-4 sm:pt-8 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative glass-dark rounded-3xl p-5 sm:p-10 md:p-14 overflow-hidden mb-10 sm:mb-16">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 animate-slide-up">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
              <img src="/logo.jpeg" alt={SHOP.brand} className="w-full h-full object-cover" />
            </div>
            <span className="px-3 py-1 rounded-full bg-fresh-100 text-fresh-700 text-[10px] sm:text-xs font-bold tracking-wide uppercase">
              {t('heroTagline')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold leading-[1.1] text-ink tracking-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
            {t('heroTitle')}
          </h1>
          <p className="text-sm sm:text-lg text-ink/70 mt-4 sm:mt-5 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            {t('heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Link to="/shop" onClick={() => play('click')} className="btn-primary py-3 px-6 text-sm sm:text-base">
              🛒 {t('shopNow')}
            </Link>
            <a href="#featured" onClick={() => play('click')} className="btn-secondary py-3 px-6 text-sm sm:text-base">
              {t('learnMore')}
            </a>
          </div>
        </div>

        <div className="hidden md:block absolute -right-10 -bottom-10 opacity-[0.04] animate-float-slow pointer-events-none">
           <div className="text-[250px] leading-none select-none">🌾</div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
              {featured.length > 0 ? t('featured') : t('allProducts')}
            </h2>
            <p className="text-xs text-ink/50 mt-1">Handpicked for you</p>
          </div>
          <Link to="/shop" onClick={() => play('click')} className="text-sm font-bold text-trust-600 hover:text-trust-800 transition">
            View All →
          </Link>
        </div>

        {!loading && showcase.length === 0 ? (
          <EmptyState emoji="🌾" title={t('noProducts')} subtitle="Products will appear here once added by admin." />
        ) : (
          <ProductGrid products={showcase} loading={loading} onOpen={setOpenProduct} />
        )}
      </section>

      {openProduct && <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />}
    </main>
  );
}