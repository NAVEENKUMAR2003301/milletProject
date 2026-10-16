import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useSound } from '../hooks/useSound';
import { generateOrderId } from '../utils/orderId';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { buildBillText } from '../utils/bill';
import CheckoutForm from '../components/checkout/CheckoutForm';
import BillPreview from '../components/checkout/BillPreview';
import MagicPopup from '../components/ui/MagicPopup';
import Toast from '../components/ui/Toast';

export default function Checkout() {
  const { t } = useLang();
  const { items, subtotal, savings, total, clearCart } = useCart();
  const { saveOrder } = useOrders();
  const { play } = useSound();
  const navigate = useNavigate();

  const [orderId] = useState(generateOrderId());
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [magic, setMagic] = useState({
    open: false,
    whatsappUrl: '',
    blocked: false,
  });

  useEffect(() => {
    if (items.length === 0 && !submitting && !magic.open) {
      navigate('/shop', { replace: true });
    }
  }, [items.length, submitting, magic.open, navigate]);

  const validate = () => {
    const e = {};
    if (!customer.name.trim()) e.name = t('requiredName');
    if (!/^\d{10}$/.test(customer.phone)) e.phone = t('requiredPhone');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) {
      play('buzz');
      setToast({ type: 'error', message: t('requiredName') });
      return;
    }

    setSubmitting(true);
    try {
      const order = {
        orderId: orderId || '',
        customer: {
          name: customer.name?.trim() || '',
          phone: customer.phone?.trim() || '',
          address: customer.address?.trim() || '',
          notes: customer.notes?.trim() || '',
        },
        items: items.map((i) => ({
          productId: i.productId || '',
          variantId: i.variantId || '',
          title: i.title || '',
          titleTa: i.titleTa || '',
          weight: i.weight || '',
          qty: i.qty || 1,
          price: i.price || 0,
          mrp: i.mrp || i.price || 0,
          discount: i.discount || 0,
          subtotal: (i.qty || 1) * (i.price || 0),
        })),
        subtotal: subtotal || 0,
        savings: savings || 0,
        total: total || 0,
        createdAt: new Date(),
      };

      await saveOrder(order);

      const billText = buildBillText(order);
      const whatsappUrl = buildWhatsAppLink(billText);

      let win = null;
      try {
        win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch {}

      setMagic({ open: true, whatsappUrl, blocked: !win });
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      play('buzz');
      setSubmitting(false);
      setToast({ type: 'error', message: t('error') });
    }
  };

  const handleContinue = () => {
    play('click');
    clearCart();
    setMagic({ open: false, whatsappUrl: '', blocked: false });
    navigate('/', { replace: true });
  };

  const canConfirm = useMemo(
    () => items.length > 0 && !submitting,
    [items.length, submitting]
  );

  return (
    <main className="px-3 sm:px-4 max-w-6xl mx-auto pt-4 sm:pt-6 pb-24 md:pb-6 animate-fade-in">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
          {t('checkoutTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-ink/50 mt-1">
          {items.length} {t('itemsCount')} · {t('total')}: ₹{total || 0}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-3">
          <CheckoutForm value={customer} onChange={setCustomer} errors={errors} />

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                play('click');
                navigate('/shop');
              }}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              ← {t('backToCart')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="btn-primary flex-1"
            >
              {submitting ? t('loading') : `✓ ${t('confirmOrder')}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <BillPreview
            orderId={orderId}
            customer={customer}
            items={items}
            subtotal={subtotal || 0}
            savings={savings || 0}
            total={total || 0}
          />
        </div>
      </div>

      <MagicPopup
        open={magic.open}
        orderId={orderId}
        total={total || 0}
        whatsappUrl={magic.whatsappUrl}
        blocked={magic.blocked}
        onContinue={handleContinue}
      />

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </main>
  );
}