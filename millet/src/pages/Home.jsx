import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { useSound } from '../hooks/useSound';
import ProductGrid from '../components/product/ProductGrid';
import ProductModal from '../components/product/ProductModal';
import EmptyState from '../components/ui/EmptyState';
import { SHOP } from '../config/shop';

export default function Home() {
  const { t } = useLang();
  const { products, loading } = useProducts();
  const { play } = useSound();
  const [openProduct, setOpenProduct] = useState(null);

  const featured = products.filter((p) => p.featured && p.available).slice(0, 4);
  const recent = products.filter((p) => p.available).slice(0, 8);
  const showcase = featured.length > 0 ? featured : recent;

  return (
    <main className="px-3 sm:px-4 max-w-6xl mx-auto pt-4 sm:pt-6 pb-24 md:pb-6">
      {/* HERO */}
      <section className="relative glass-dark rounded-3xl p-5 sm:p-6 md:p-12 overflow-hidden animate-slide-up">
        <div className="relative z-10 max-w-2xl">
          {/* Brand logo row */}
          <div className="flex items-center gap-3 mb-5">
            <img
              src="/logo.jpeg"
              alt={SHOP.brand}
              className="w-11 h-11 md:w-14 md:h-14 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-extrabold text-trust-700 text-base md:text-lg leading-none truncate">
                {SHOP.brand}
              </p>
              <p className="text-[10px] md:text-[11px] text-ink/50 mt-1 truncate">
                {SHOP.name}
              </p>
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-fresh-100 text-fresh-700 text-xs font-bold mb-4">
            {t('heroTagline')}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] text-ink tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-sm md:text-base text-ink/70 mt-4 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" onClick={() => play('click')} className="btn-primary">
              🛒 {t('shopNow')}
            </Link>
            <a href="#featured" onClick={() => play('click')} className="btn-secondary">
              {t('learnMore')}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-white/70 border border-trust-100 text-trust-700 font-semibold">
              🌱 100% Natural
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/70 border border-trust-100 text-trust-700 font-semibold">
              🚫 No Preservatives
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/70 border border-trust-100 text-trust-700 font-semibold">
              🇮🇳 Made in Tamil Nadu
            </span>
          </div>
        </div>

        {/* Faded logo watermark */}
        <div className="hidden md:block absolute -right-8 -bottom-10 opacity-[0.06] animate-float-slow select-none pointer-events-none">
          <img
            src="/logo.jpeg"
            alt=""
            className="w-72 h-72 object-contain rounded-full"
          />
        </div>
      </section>

      {/* FEATURED / RECENT */}
      <section id="featured" className="mt-10 sm:mt-12">
        <div className="flex items-end justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-ink tracking-tight">
              {featured.length > 0 ? t('featured') : t('allProducts')}
            </h2>
            <p className="text-xs text-ink/50 mt-1">{SHOP.name}</p>
          </div>
          <Link
            to="/shop"
            onClick={() => play('click')}
            className="btn-ghost text-sm"
          >
            {t('shop')} →
          </Link>
        </div>

        {!loading && showcase.length === 0 ? (
          <EmptyState
            emoji="🌾"
            title={t('noProducts')}
            subtitle="Products will appear here once the shop owner adds them via the admin panel."
          />
        ) : (
          <ProductGrid
            products={showcase}
            loading={loading}
            onOpen={setOpenProduct}
          />
        )}
      </section>

      {/* WHY US */}
      <section className="mt-12 sm:mt-14 grid md:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: '🌿',
            title: 'Naturally Sourced',
            desc: 'Millets & grains handpicked from trusted farms.',
          },
          {
            icon: '⚙️',
            title: 'Stone-Ground',
            desc: 'Traditional grinding preserves nutrients & taste.',
          },
          {
            icon: '📦',
            title: 'Fresh Packing',
            desc: 'Sealed for freshness, no preservatives added.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="card animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-ink">{f.title}</h3>
            <p className="text-sm text-ink/60 mt-1">{f.desc}</p>
          </div>
        ))}
      </section>

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      )}
    </main>
  );
}