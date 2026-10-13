import ProductCard from './productCard';
import { SkeletonCard } from '../ui/Loader';

export default function ProductGrid({ products, loading, onOpen }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p, idx) => (
        <div
          key={p.id}
          style={{ animationDelay: `${Math.min(idx, 12) * 40}ms` }}
          className="animate-slide-up opacity-0"
        >
          <ProductCard product={p} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}