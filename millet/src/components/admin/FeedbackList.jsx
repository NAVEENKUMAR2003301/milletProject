import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useOrders } from '../../contexts/OrderContext';
import { useSound } from '../../hooks/useSound';
import { formatDateTime } from '../../utils/format';
import { SHOP } from '../../config/shop';
import EmptyState from '../ui/EmptyState';

export default function FeedbackList() {
  const { t } = useLang();
  const { fetchFeedback, deleteFeedback } = useOrders(); // 🟢 Added deleteFeedback
  const { play } = useSound();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchFeedback();
      setItems(data);
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

  const filtered = filter === 0 ? items : items.filter((f) => f.rating === filter);

  const avg = items.length > 0
    ? (items.reduce((s, f) => s + (f.rating || 0), 0) / items.length).toFixed(1)
    : '—';

  const replyOnWhatsApp = (fb) => {
    play('click');
    if (!fb.phone) {
      alert('No phone number provided with this feedback.');
      return;
    }
    let digits = String(fb.phone).replace(/\D/g, '');
    if (digits.length === 10) digits = '91' + digits;
    const greeting = fb.name ? `Hi ${fb.name}!` : 'Hi!';
    const msg = `${greeting} 🙏\n\nThank you so much for your ${fb.rating}★ feedback on ${SHOP.brand}.\n\n${fb.orderId ? `Regarding your order ${fb.orderId}:\n\n` : ''}We truly appreciate you taking the time to share your experience.\n\n— ${SHOP.brand}, ${SHOP.name}`;
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 🟢 NEW: Delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      play('whoosh');
      try {
        await deleteFeedback(id);
        setItems((prev) => prev.filter((f) => f.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete feedback. Check your Firebase Rules.');
        play('buzz');
      }
    }
  };

  if (loading) {
    return <div className="glass rounded-2xl p-6 text-center text-sm text-ink/60">{t('loading')}</div>;
  }

  if (!items.length) {
    return (
      <div className="glass-dark rounded-3xl">
        <EmptyState emoji="💬" title={t('feedback')} subtitle="No feedback yet. It will appear here when customers submit it." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Summary + Filter */}
      <div className="glass-dark rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-display font-extrabold text-amber-500">{avg}</div>
          <div>
            <p className="text-xs font-bold text-trust-700 uppercase tracking-wide">Average Rating</p>
            <p className="text-[11px] text-ink/50">From {items.length} {items.length === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {[0, 5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => { play('click'); setFilter(r); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border-2 ${
                filter === r ? 'bg-trust-500 text-white border-transparent' : 'bg-white/70 text-trust-700 border-trust-100 hover:border-trust-300'
              }`}
            >
              {r === 0 ? 'All' : `${'★'.repeat(r)} (${items.filter((f) => f.rating === r).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Cards */}
      {filtered.map((f) => (
        <div key={f.id} className="glass rounded-2xl p-4 animate-fade-in">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-sm">{f.name || 'Anonymous'}</p>
              <p className="text-[11px] text-ink/50">
                {f.createdAt?.seconds ? formatDateTime(new Date(f.createdAt.seconds * 1000)) : ''}
                {f.phone ? ` · 📞 ${f.phone}` : ''}
              </p>
              {f.orderId && <p className="text-[11px] text-trust-700 font-semibold mt-0.5">🧾 {f.orderId}</p>}
            </div>
            <div className="text-amber-500 text-lg whitespace-nowrap">
              {'★'.repeat(f.rating || 0)}
              <span className="text-ink/20">{'★'.repeat(5 - (f.rating || 0))}</span>
            </div>
          </div>
          
          <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line mb-3">
            {f.message}
          </p>

          {/* Actions */}
          <div className="pt-3 border-t border-trust-100/60 flex flex-wrap gap-2">
            <button
              onClick={() => replyOnWhatsApp(f)}
              disabled={!f.phone}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                f.phone ? 'bg-gradient-to-br from-fresh-500 to-trust-500 text-white hover:shadow-md active:scale-95' : 'bg-trust-50 text-ink/40 cursor-not-allowed'
              }`}
            >
              💬 Reply on WhatsApp
            </button>
            
            {f.phone && (
              <a href={`tel:${f.phone}`} onClick={() => play('click')} className="px-3 py-2 rounded-xl bg-white border-2 border-trust-100 text-trust-700 text-xs font-bold hover:border-trust-300 transition active:scale-95 flex items-center justify-center" aria-label="Call customer">
                📞
              </a>
            )}

            {/* 🟢 DELETE BUTTON */}
            <button
              onClick={() => handleDelete(f.id)}
              className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border-2 border-red-100 text-xs font-bold hover:bg-red-100 transition active:scale-95 flex items-center justify-center gap-1"
              title="Delete Feedback"
            >
              🗑️ <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}