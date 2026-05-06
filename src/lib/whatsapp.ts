// WhatsApp message templates and link builder for order notifications

export type OrderEvent = 'placed' | 'accepted' | 'shipped' | 'delivered' | 'coupon';

interface OrderInfo {
  orderNumber: string;
  customerName?: string;
  total?: number;
  tracking?: string;
  courier?: string;
  invoiceUrl?: string;
}

export function buildOrderMessage(event: OrderEvent, info: OrderInfo): string {
  const name = info.customerName || 'Customer';
  const id = info.orderNumber;
  const total = info.total ? `₹${Number(info.total).toFixed(2)}` : '';
  switch (event) {
    case 'placed':
      return `🌿 *Mittika by Ecovia*\n\nHi ${name}, your order *${id}* has been *placed* successfully${total ? ` for ${total}` : ''}.\n\nWe will confirm acceptance shortly. Thank you for choosing Mittika! 💚`;
    case 'accepted':
      return `✅ *Order Accepted*\n\nHi ${name}, your order *${id}* has been *accepted* and is being prepared. Packing starts shortly.\n\n— Team Mittika`;
    case 'shipped':
      return `📦 *Order Dispatched*\n\nHi ${name}, your order *${id}* has been *shipped*${info.courier ? ` via *${info.courier}*` : ''}${info.tracking ? `.\nTracking: *${info.tracking}*` : ''}.\n\nExpect delivery soon. — Team Mittika`;
    case 'delivered':
      return `🎉 *Order Delivered*\n\nHi ${name}, your order *${id}* has been *delivered*. Hope you love it!${info.invoiceUrl ? `\n\nDownload invoice: ${info.invoiceUrl}` : ''}\n\nThank you for trusting Mittika 🌿`;
    case 'coupon':
      return `🎁 Hi ${name}, exclusive Mittika coupon for you. Check your account to apply.`;
  }
}

export function waLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  // Default to India country code if 10-digit number
  const final = cleaned.length === 10 ? `91${cleaned}` : cleaned;
  return `https://wa.me/${final}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, event: OrderEvent, info: OrderInfo) {
  const msg = buildOrderMessage(event, info);
  window.open(waLink(phone, msg), '_blank');
}