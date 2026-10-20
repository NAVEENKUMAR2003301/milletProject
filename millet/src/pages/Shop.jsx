import { useMemo, useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import SearchBar from '../components/product/SearchBar';
import CategoryFilter from '../components/product/CategoryFilter';
import ProductGrid from '../components/product/productGrid';
import ProductModal from '../components/product/productModal';
import TopReviews from '../components/feedback/TopReviews';
import EmptyState from '../components/ui/EmptyState';
import ShippingWidget from '../components/shop/ShippingWidget';

export default function Shop() {
  const { t } = useLang();
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('new');
  const [openProduct, setOpenProduct] = useState(null);
  
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.titleTa || '').toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [products, category, search, sort]);

  return (
    <main className="pt-4 sm:pt-6 animate-fade-in pb-10">
      <TopReviews />

      <div className="mb-4 sm:mb-8 mt-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
          {t('allProducts')}
        </h1>
        <p className="text-xs sm:text-sm text-ink/50 mt-1">
          {loading ? t('loading') : `Showing ${filtered.length} items`}
        </p>
      </div>

      <ShippingWidget />

      {/* MOBILE TOGGLE BUTTON */}
      <div className="md:hidden mb-4 sticky top-[76px] z-30">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full glass-dark px-4 py-3 rounded-xl flex items-center justify-between font-bold text-trust-700 shadow-md border-2 border-trust-100 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2">
            <span>🔍 Search & Filter</span>
            {(category !== 'all' || search) && (
               <span className="bg-trust-500 text-white text-[10px] px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>
          <span className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* FILTER BOX */}
      <div 
        className={`glass rounded-2xl p-3 sm:p-4 mb-6 flex-col gap-3 sticky top-[80px] z-20 shadow-sm transition-all duration-300 overflow-hidden
          ${showFilters ? 'flex opacity-100 max-h-[500px]' : 'hidden md:flex md:opacity-100 md:max-h-[500px]'}
        `}
      >
        <div className="w-full">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="flex-1 w-full overflow-x-auto no-scrollbar">
            <CategoryFilter active={category} onChange={setCategory} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-full sm:w-44 py-2 text-sm bg-white shrink-0 shadow-sm border-trust-100"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
          {error}
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
