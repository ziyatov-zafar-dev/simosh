
import { OrderData } from '../types';
import { TELEGRAM_BOT_TOKEN, CHAT_IDS } from '../constants';

export const sendOrderToTelegram = async (order: OrderData) => {
  const langLabels: Record<string, any> = {
    uz: { order: "Yangi Buyurtma", customer: "Mijoz", phone: "Telefon", items: "Mahsulotlar", total: "Jami" },
    ru: { order: "Новый Заказ", customer: "Клиент", phone: "Телефон", items: "Товары", total: "Итого" },
    en: { order: "New Order", customer: "Customer", phone: "Phone", items: "Items", total: "Total" },
    tr: { order: "Yeni Sipariş", customer: "Müşteri", phone: "Telefon", items: "Ürünler", total: "Toplam" }
  };

  const l = langLabels[order.language] || langLabels.uz;

  const message = `
<b>🚀 ${l.order}!</b>

<b>👤 ${l.customer}:</b> ${order.customerName}
<b>📞 ${l.phone}:</b> ${order.customerPhone}
<b>🌐 Til:</b> ${order.language.toUpperCase()}

<b>🛒 ${l.items}:</b>
${order.items.map(item => `• ${item.product.name} (${item.quantity}x) - ${(item.product.price * item.quantity).toLocaleString()} so'm`).join('\n')}

<b>💰 ${l.total}:</b> ${order.totalPrice.toLocaleString()} so'm
  `.trim();

  return sendMessage(message);
};

export const sendContactToTelegram = async (contact: { name: string, email: string, message: string, language: string }) => {
  const text = `
<b>📩 Yangi Xabar (Bog'lanish)!</b>

<b>👤 Ism:</b> ${contact.name}
<b>📧 Email:</b> ${contact.email}
<b>🌐 Til:</b> ${contact.language.toUpperCase()}

<b>📝 Xabar:</b>
${contact.message}
  `.trim();

  return sendMessage(text);
};

async function sendMessage(text: string) {
  try {
    const results = await Promise.all(
      CHAT_IDS.map(async (chatId) => {
        try {
          const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: text,
              parse_mode: 'HTML'
            })
          });
          return response.ok;
        } catch (err) {
          return false;
        }
      })
    );
    return results.some(res => res === true);
  } catch (error) {
    return false;
  }
}
