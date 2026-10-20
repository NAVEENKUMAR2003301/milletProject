import { SHOP } from '../config/shop';
import { formatDateTime } from './format';

export function buildBillText(order) {
  const { orderId, customer, items, subtotal, savings, shippingMethod, shippingCost, total, createdAt } = order;
  const lines = [];

  lines.push(`*${SHOP.brand}* — ${SHOP.name}`);
  lines.push(`${SHOP.location}`);
  lines.push(`FSSAI: ${SHOP.fssai}`);
  lines.push('———————————————');
  lines.push(`🧾 *Order ID:* ${orderId}`);
  lines.push(`📅 *Date:* ${formatDateTime(createdAt || new Date())}`);
  lines.push('');
  lines.push(`👤 *Name:* ${customer.name}`);
  lines.push(`📞 *Phone:* ${customer.phone}`);
  if (customer.address) lines.push(`📍 *Address:* ${customer.address}`);
  if (customer.notes) lines.push(`📝 *Notes:* ${customer.notes}`);
  lines.push('');
  lines.push('———————————————');
  lines.push('*Items:*');
  items.forEach((i, idx) => {
    const title = i.titleTa || i.title;
    lines.push(
      `${idx + 1}. ${title} ${i.weight ? `(${i.weight})` : ''}`
    );
    lines.push(`   ${i.qty} × ₹${i.price} = ₹${i.qty * i.price}`);
  });
  lines.push('———————————————');
  lines.push(`Subtotal: ₹${subtotal}`);
  if (savings > 0) lines.push(`You Save: ₹${savings}`);
  
  // Shipping Logic
  lines.push(`Shipping (${shippingMethod}): ${shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}`);
  
  lines.push(`*TOTAL: ₹${total}*`);
  lines.push('');
  lines.push('Please confirm this order. Thank you! 🙏');
  lines.push(`— ${SHOP.brand}`);

  return lines.join('\n');
}