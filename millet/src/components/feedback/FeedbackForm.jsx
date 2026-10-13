import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import StarRating from './StarRating';

export default function FeedbackForm() {
  const { t } = useLang();
  const { play } = useSound();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    orderId: '',
    rating: 5,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError(t('requiredName'));
      play('buzz');
      return;
    }
    if (!form.message.trim()) {
      setError(t('yourMessage') + ' required');
      play('buzz');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        name: form.name.trim(),
        phone: form.phone.trim() || '',
        orderId: form.orderId.trim() || '',
        rating: form.rating || 5,
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });
      play('success');
      setDone(true);
      setForm({ name: '', phone: '', orderId: '', rating: 5, message: '' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Submit failed');
      play('buzz');
    } finally {
      setSubmitting(false);
    }
  };

  const label = 'text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block';

  if (done) {
    return (
      <div className="glass-dark rounded-3xl p-8 md:p-12 text-center animate-slide-up">
        <div className="text-6xl mb-4 animate-float-med">🙏</div>
        <h2 className="font-display text-2xl font-extrabold text-trust-700">
          {t('feedbackThanks')}
        </h2>
        <p className="text-sm text-ink/60 mt-2">
          We truly appreciate you taking the time.
        </p>
        <button
          onClick={() => {
            play('click');
            setDone(false);
          }}
          className="btn-secondary mt-6"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up"
    >
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">💬</div>
        <h2 className="font-display text-2xl font-extrabold text-trust-700">
          {t('feedbackTitle')}
        </h2>
        <p className="text-xs text-ink/50 mt-1">{t('feedbackSubtitle')}</p>
      </div>

      {/* Rating */}
      <div className="flex flex-col items-center mb-5">
        <label className={label}>{t('yourRating')}</label>
        <StarRating value={form.rating} onChange={(v) => update('rating', v)} />
        <p className="text-xs text-ink/50 mt-1">
          {form.rating === 5 && '⭐ Excellent!'}
          {form.rating === 4 && '😊 Good'}
          {form.rating === 3 && '🙂 Okay'}
          {form.rating === 2 && '😐 Not great'}
          {form.rating === 1 && '😞 Poor'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className={label}>{t('yourName')} *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={t('namePlaceholder')}
            autoComplete="name"
          />
        </div>

        {/* Phone + Order ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>
              {t('phone')}{' '}
              <span className="text-ink/40 normal-case font-normal">
                {t('addressOptional')}
              </span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="input-field"
              value={form.phone}
              onChange={(e) =>
                update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder={t('phonePlaceholder')}
            />
          </div>
          <div>
            <label className={label}>
              {t('orderId')}{' '}
              <span className="text-ink/40 normal-case font-normal">
                {t('addressOptional')}
              </span>
            </label>
            <input
              className="input-field"
              value={form.orderId}
              onChange={(e) => update('orderId', e.target.value)}
              placeholder="VP-20250115-0001"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={label}>{t('yourMessage')} *</label>
          <textarea
            rows={5}
            className="input-field resize-none"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder={t('messagePlaceholder')}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? t('loading') : `✓ ${t('submitFeedback')}`}
        </button>
      </div>
    </form>
  );
}