import { useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';

export default function CheckoutForm({ value, onChange, errors }) {
  const { t } = useLang();
  const { play } = useSound();

  const update = (key, val) => onChange({ ...value, [key]: val });

  const handlePhone = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    update('phone', digits);
  };

  return (
    <div className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up">
      <h2 className="font-display text-2xl font-extrabold text-ink mb-1">
        {t('customerDetails')}
      </h2>
      <p className="text-xs text-ink/50 mb-5">
        {t('checkoutTitle')} · {t('orderId')} *
      </p>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block">
            {t('yourName')} *
          </label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => update('name', e.target.value)}
            onFocus={() => play('tick')}
            placeholder={t('namePlaceholder')}
            className={`input-field ${errors.name ? 'border-red-300' : ''}`}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block">
            {t('phone')} *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={value.phone}
            onChange={(e) => handlePhone(e.target.value)}
            onFocus={() => play('tick')}
            placeholder={t('phonePlaceholder')}
            className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
            autoComplete="tel"
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block">
            {t('address')}{' '}
            <span className="text-ink/40 normal-case font-normal">
              {t('addressOptional')}
            </span>
          </label>
          <textarea
            value={value.address}
            onChange={(e) => update('address', e.target.value)}
            onFocus={() => play('tick')}
            placeholder={t('addressPlaceholder')}
            rows={3}
            className="input-field resize-none"
            autoComplete="street-address"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block">
            {t('notes')}{' '}
            <span className="text-ink/40 normal-case font-normal">
              {t('notesOptional')}
            </span>
          </label>
          <textarea
            value={value.notes}
            onChange={(e) => update('notes', e.target.value)}
            onFocus={() => play('tick')}
            placeholder={t('notesPlaceholder')}
            rows={2}
            className="input-field resize-none"
          />
        </div>
      </div>
    </div>
  );
}