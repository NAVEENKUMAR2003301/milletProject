import { useMemo, useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import SearchBar from '../components/product/SearchBar';
import CategoryFilter from '../components/product/CategoryFilter';
import ProductGrid from '../components/product/productGrid';
import ProductModal from '../components/product/productModal';
import TopReviews from '../components/feedback/TopReviews';
import EmptyState from '../components/ui/EmptyState';

export default function Shop() {
  const { t } = useLang();
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('new');
  const [openProduct, setOpenProduct] = useState(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.titleTa || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [products, category, search, sort]);

  return (
    <main className="px-3 sm:px-4 max-w-6xl mx-auto pt-4 sm:pt-6 pb-24 md:pb-6 animate-fade-in">
      {/* Top reviews (social proof) */}
      <TopReviews />

      <div className="mb-6 mt-8 sm:mt-10">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          {t('allProducts')}
        </h1>
        <p className="text-xs sm:text-sm text-ink/50 mt-1">
          {loading ? t('loading') : `${filtered.length} ${t('itemsCount')}`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">
        <SearchBar value={search} onChange={setSearch} />

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 overflow-hidden">
            <CategoryFilter active={category} onChange={setCategory} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field md:w-48 py-2.5 text-sm"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {t('error')}: {error}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title={t('noProducts')}
          subtitle={t('noProductsHint')}
        />
      ) : (
        <ProductGrid
          products={filtered}
          loading={loading}
          onOpen={setOpenProduct}
        />
      )}

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      )}
    </main>
  );
}