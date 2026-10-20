import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useShipping } from '../contexts/ShippingContext';
import { useOrders } from '../contexts/OrderContext';
import { useSound } from '../hooks/useSound';
import { generateOrderId } from '../utils/orderId';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { buildBillText } from '../utils/bill';
import CheckoutForm from '../components/checkout/CheckoutForm';
import BillPreview from '../components/checkout/BillPreview';
import MagicPopup from '../components/ui/MagicPopup';
import Toast from '../components/ui/Toast';
import { formatPrice } from '../utils/format';

export default function Checkout() {
  const { t } = useLang();
  const { items, subtotal, savings, clearCart } = useCart();
  const { shippingMethods } = useShipping();
  const { saveOrder } = useOrders();
  const { play } = useSound();
  const navigate = useNavigate();

  const [orderId] = useState(generateOrderId());
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [magic, setMagic] = useState({ open: false, whatsappUrl: '', blocked: false });
  const [shippingId, setShippingId] = useState('standard');

  const selectedShipping = shippingMethods.find((m) => m.id === shippingId) || shippingMethods[0];
  const shippingCost = (selectedShipping?.freeAbove && subtotal >= selectedShipping.freeAbove) ? 0 : (selectedShipping?.cost || 0);
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    if (items.length === 0 && !submitting && !magic.open) navigate('/shop', { replace: true });
  }, [items.length, submitting, magic.open, navigate]);

  const validate = () => {
    const e = {};
    if (!customer.name.trim()) e.name = t('requiredName');
    if (!/^\d{10}$/.test(customer.phone)) e.phone = t('requiredPhone');
    if (shippingId !== 'pickup' && !customer.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) { play('buzz'); setToast({ type: 'error', message: 'Please fill all required fields.' }); return; }
    setSubmitting(true);
    try {
      const order = {
        orderId, customer: { ...customer }, items,
        subtotal, savings, shippingMethod: selectedShipping?.name || 'Standard', shippingCost, total: grandTotal, createdAt: new Date(),
      };
      await saveOrder(order);
      const whatsappUrl = buildWhatsAppLink(buildBillText(order));
      let win = null;
      try { win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer'); } catch {}
      setMagic({ open: true, whatsappUrl, blocked: !win });
      setSubmitting(false);
    } catch (err) { play('buzz'); setSubmitting(false); setToast({ type: 'error', message: t('error') }); }
  };

  const handleContinue = () => { play('click'); clearCart(); setMagic({ open: false, whatsappUrl: '', blocked: false }); navigate('/', { replace: true }); };
  const canConfirm = useMemo(() => items.length > 0 && !submitting, [items.length, submitting]);

  return (
    <main className="pt-4 sm:pt-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{t('checkoutTitle')}</h1>
        <p className="text-sm text-ink/50 mt-1">{items.length} items · Total: {formatPrice(grandTotal)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* Left Form Area */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
          <CheckoutForm value={customer} onChange={setCustomer} errors={errors} />

          <div className="glass-dark rounded-2xl p-4 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-ink mb-4">Delivery Method</h2>
            <div className="flex flex-col gap-3">
              {shippingMethods.map((method) => {
                const cost = (method.freeAbove && subtotal >= method.freeAbove) ? 0 : method.cost;
                return (
                  <label key={method.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingId === method.id ? 'border-trust-500 bg-trust-50' : 'border-trust-100 hover:border-trust-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={method.id} checked={shippingId === method.id} onChange={() => { play('tick'); setShippingId(method.id); }} className="w-5 h-5 accent-trust-500" />
                      <div>
                        <p className="font-bold text-ink text-sm sm:text-base">{method.name}</p>
                        <p className="text-xs text-ink/60">{method.desc}</p>
                      </div>
                    </div>
                    <p className="font-extrabold text-trust-700">{cost === 0 ? 'FREE' : formatPrice(cost)}</p>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button onClick={() => { play('click'); navigate('/shop'); }} className="btn-secondary flex-1 py-3 order-2 sm:order-1">← {t('backToCart')}</button>
            <button onClick={handleConfirm} disabled={!canConfirm} className="btn-primary flex-1 py-3 order-1 sm:order-2">{submitting ? t('loading') : `✓ ${t('confirmOrder')}`}</button>
          </div>
        </div>

        {/* Right Sticky Bill Area */}
        <div className="lg:col-span-5 xl:col-span-4 relative">
          <div className="sticky top-24">
            <BillPreview orderId={orderId} customer={customer} items={items} subtotal={subtotal} savings={savings} shippingMethod={selectedShipping?.name || 'Standard'} shippingCost={shippingCost} grandTotal={grandTotal} />
          </div>
        </div>
      </div>

      <MagicPopup open={magic.open} orderId={orderId} total={grandTotal} whatsappUrl={magic.whatsappUrl} blocked={magic.blocked} onContinue={handleContinue} />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </main>
  );
}