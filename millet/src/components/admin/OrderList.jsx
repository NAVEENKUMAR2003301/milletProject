import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useOrders } from '../../contexts/OrderContext';
import { useSound } from '../../hooks/useSound';
import { formatPrice, formatDateTime } from '../../utils/format';
import EmptyState from '../ui/EmptyState';

export default function OrderList() {
  const { t } = useLang();
  const { fetchOrders, updateOrderStatus } = useOrders();
  const { play } = useSound();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = orders.filter((o) =>
    filter === 'all' ? true : o.status === filter
  );

  const handleMarkDelivered = async (id) => {
    play('success');
    await updateOrderStatus(id, 'delivered');
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'delivered' } : o))
    );
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-trust-100 text-trust-700',
    delivered: 'bg-fresh-100 text-fresh-700',
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-sm text-ink/60">
        {t('loading')}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="glass-dark rounded-3xl">
        <EmptyState emoji="🧾" title={t('noOrders')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter */}
      <div className="flex gap-2 mb-1 overflow-x-auto no-scrollbar">
        {['all', 'pending', 'delivered'].map((f) => (
          <button
            key={f}
            onClick={() => {
              play('click');
              setFilter(f);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-2 ${
              filter === f
                ? 'bg-trust-500 text-white border-transparent'
                : 'bg-white/70 text-trust-700 border-trust-100 hover:border-trust-300'
            }`}
          >
            {f} ({f === 'all' ? orders.length : orders.filter((o) => o.status === f).length})
          </button>
        ))}
      </div>

      {filtered.map((o) => {
        const isOpen = expanded === o.id;
        return (
          <div key={o.id} className="glass rounded-2xl overflow-hidden animate-fade-in">
            {/* Header row */}
            <button
              onClick={() => {
                play('tick');
                setExpanded(isOpen ? null : o.id);
              }}
              className="w-full p-3 text-left flex items-center gap-3 hover:bg-white/50 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-trust-700 text-sm">{o.orderId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                      statusColors[o.status] || statusColors.pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-ink/60 mt-0.5 truncate">
                  {o.customer?.name} · {o.customer?.phone}
                </p>
                <p className="text-[10px] text-ink/40 mt-0.5">
                  {o.createdAt?.seconds
                    ? formatDateTime(new Date(o.createdAt.seconds * 1000))
                    : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-trust-700">{formatPrice(o.total)}</p>
                <p className="text-[10px] text-ink/50">
                  {o.items?.length || 0} items
                </p>
              </div>
              <span className="text-ink/40 ml-1">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Expanded */}
            {isOpen && (
              <div className="border-t border-trust-100 px-3 py-3 bg-white/40 animate-fade-in">
                {o.customer?.address && (
                  <p className="text-xs text-ink/70 mb-2">
                    📍 {o.customer.address}
                  </p>
                )}
                {o.customer?.notes && (
                  <p className="text-xs text-ink/70 mb-2">
                    📝 {o.customer.notes}
                  </p>
                )}

                <div className="flex flex-col gap-1 mb-3">
                  {o.items?.map((i, idx) => (
                    <div key={idx} className="text-xs flex justify-between gap-2">
                      <span className="truncate">
                        {i.qty} × {i.title} {i.weight ? `(${i.weight})` : ''}
                      </span>
                      <span className="font-bold whitespace-nowrap">
                        {formatPrice(i.qty * i.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs flex justify-between text-ink/60">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(o.subtotal)}</span>
                </div>
                {o.savings > 0 && (
                  <div className="text-xs flex justify-between text-fresh-600">
                    <span>{t('savings')}</span>
                    <span>− {formatPrice(o.savings)}</span>
                  </div>
                )}
                <div className="text-sm flex justify-between font-extrabold text-trust-700 mt-1 pt-1 border-t border-trust-100">
                  <span>{t('total')}</span>
                  <span>{formatPrice(o.total)}</span>
                </div>

                {o.status !== 'delivered' && (
                  <button
                    onClick={() => handleMarkDelivered(o.id)}
                    className="mt-3 w-full btn-primary text-xs py-2"
                  >
                    ✓ {t('markDelivered')}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}