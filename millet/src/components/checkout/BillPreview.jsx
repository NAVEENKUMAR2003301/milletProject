import { useLang } from '../../contexts/LanguageContext';
import { SHOP } from '../../config/shop';
import { formatPrice, formatDateTime } from '../../utils/format';

export default function BillPreview({
  orderId,
  customer,
  items,
  subtotal,
  savings,
  total,
}) {
  const { lang, t } = useLang();

  return (
    <div className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up sticky top-24">
      <div className="text-center pb-4 border-b-2 border-dashed border-trust-100">
        <div className="text-3xl mb-1">🌾</div>
        <h3 className="font-display text-xl font-extrabold text-trust-700">
          {SHOP.brand}
        </h3>
        <p className="text-[11px] text-ink/60">{SHOP.name}</p>
        <p className="text-[10px] text-ink/40 mt-0.5">{SHOP.location}</p>
        <p className="text-[10px] text-ink/40">
          {t('fssaiLic')} {SHOP.fssai}
        </p>
      </div>

      <div className="py-3 border-b border-dashed border-trust-100 flex justify-between text-xs">
        <span className="text-ink/50">{t('orderId')}</span>
        <span className="font-bold text-trust-700">{orderId}</span>
      </div>

      <div className="py-3 border-b border-dashed border-trust-100 flex justify-between text-xs">
        <span className="text-ink/50">{t('date')}</span>
        <span className="font-semibold">{formatDateTime(new Date())}</span>
      </div>

      {(customer.name || customer.phone) && (
        <div className="py-3 border-b border-dashed border-trust-100 text-xs">
          {customer.name && (
            <div className="flex justify-between">
              <span className="text-ink/50">{t('yourName')}</span>
              <span className="font-semibold">{customer.name}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex justify-between mt-1">
              <span className="text-ink/50">{t('phone')}</span>
              <span className="font-semibold">{customer.phone}</span>
            </div>
          )}
          {customer.address && (
            <div className="mt-1">
              <span className="text-ink/50">{t('address')}:</span>
              <p className="font-medium text-ink/70 mt-0.5">{customer.address}</p>
            </div>
          )}
        </div>
      )}

      <div className="py-3">
        <p className="text-[11px] font-bold text-trust-700 uppercase tracking-wide mb-2">
          {t('billPreview')}
        </p>
        {items.length === 0 ? (
          <p className="text-xs text-ink/40 text-center py-4">{t('emptyCart')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((i) => {
              const title = lang === 'ta' && i.titleTa ? i.titleTa : i.title;
              return (
                <div key={i.id} className="text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-ink line-clamp-1 flex-1">
                      {title}
                    </span>
                    <span className="font-bold text-ink whitespace-nowrap">
                      {formatPrice(i.qty * i.price)}
                    </span>
                  </div>
                  <div className="text-ink/50 text-[10px]">
                    {i.weight && (
                      <span className="font-bold text-trust-600 mr-1">
                        [{i.weight}]
                      </span>
                    )}
                    {i.qty} × {formatPrice(i.price)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t-2 border-dashed border-trust-100">
        <div className="flex justify-between text-xs py-1">
          <span className="text-ink/60">{t('subtotal')}</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-xs py-1 text-fresh-600">
            <span>{t('savings')}</span>
            <span className="font-bold">− {formatPrice(savings)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg pt-2 mt-1 border-t border-trust-100">
          <span className="font-bold">{t('total')}</span>
          <span className="font-extrabold text-trust-700">{formatPrice(total)}</span>
        </div>
      </div>

      <p className="text-[10px] text-center text-ink/40 mt-4">
        {t('orderSuccessMsg')}
      </p>
    </div>
  );
}