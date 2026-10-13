import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice } from '../../utils/format';
import EmptyState from '../ui/EmptyState';

export default function ProductList({ products, loading, onEdit, onDelete }) {
  const { lang, t } = useLang();
  const { play } = useSound();

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-sm text-ink/60">
        {t('loading')}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="glass-dark rounded-3xl">
        <EmptyState
          emoji="📦"
          title={t('noProducts')}
          subtitle="Add your first product to get started."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((p) => {
        const title = lang === 'ta' && p.titleTa ? p.titleTa : p.title;
        return (
          <div
            key={p.id}
            className="glass rounded-2xl p-3 flex items-center gap-3 animate-fade-in"
          >
            {/* Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-trust-50 flex-shrink-0">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl opacity-60">
                  🌾
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-ink text-sm truncate">{title}</h3>
                {p.featured && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">
                    ⭐
                  </span>
                )}
                {!p.available && (
                  <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                    {t('unavailable')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink/50 mt-0.5">
                {t('category')}: {p.category}
                {p.weight ? ` · ${p.weight}` : ''}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-extrabold text-trust-700">
                  {formatPrice(p.price)}
                </span>
                {p.discount > 0 && (
                  <span className="text-[10px] text-amber-600 font-bold">
                    {p.discount}% off
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  play('click');
                  onEdit(p);
                }}
                className="px-3 py-1.5 rounded-lg bg-trust-50 text-trust-700 text-xs font-bold hover:bg-trust-100 transition"
              >
                ✏️ {t('edit')}
              </button>
              <button
                onClick={() => {
                  play('click');
                  if (confirm(t('confirmDelete'))) {
                    play('whoosh');
                    onDelete(p.id);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition"
              >
                🗑️ {t('delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}