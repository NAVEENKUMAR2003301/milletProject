// src/utils/email.js
export async function sendOrderEmail(order) {
  const KEY = import.meta.env.VITE_WEB3FORMS_KEY;
  const CLIENT_EMAIL = import.meta.env.VITE_CLIENT_EMAIL;

  if (!KEY) {
    console.warn('[Email] VITE_WEB3FORMS_KEY is missing. Skipping email.');
    return;
  }

  try {
    const itemsText = (order.items || [])
      .map((i) => `${i.qty}x ${i.title} (${i.weight || 'Standard'}) - ₹${i.qty * i.price}`)
      .join('\n');

    const payload = {
      access_key: KEY,
      subject: `🛒 New Order ${order.orderId} — ₹${order.total}`,
      from_name: "Priya's Millet Shop",
      to: CLIENT_EMAIL,
      order_id: order.orderId,
      customer_name: order.customer?.name || '—',
      customer_phone: order.customer?.phone || '—',
      customer_address: order.customer?.address || '—',
      notes: order.customer?.notes || '—',
      items: itemsText,
      subtotal: `₹${order.subtotal}`,
      shipping: `${order.shippingMethod} (₹${order.shippingCost})`,
      total: `₹${order.total}`,
      order_time: new Date().toLocaleString('en-IN'),
    };

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[Email] Failed to send order email:', err);
  }
}