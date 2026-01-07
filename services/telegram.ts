
import { OrderData } from '../types';
import { TELEGRAM_BOT_TOKEN, CHAT_IDS } from '../constants';

export const sendOrderToTelegram = async (order: OrderData) => {
  const l = { 
    order: "Yangi Buyurtma", 
    customer: "Mijoz", 
    phone: "Telefon", 
    items: "Mahsulotlar", 
    total: "Jami",
    userLang: "Foydalanuvchi tili",
    comment: "Izoh",
    promo: "Promo-kod",
    discount: "Chegirma"
  };

  const message = `
<b>🚀 ${l.order}!</b>

<b>👤 ${l.customer}:</b> ${order.firstName} ${order.lastName}
<b>📞 ${l.phone}:</b> ${order.customerPhone}
<b>🌐 ${l.userLang}:</b> ${order.language.toUpperCase()}

<b>📝 ${l.comment}:</b>
${order.comment || "Izoh qoldirilmagan"}

<b>🛒 ${l.items}:</b>
${order.items.map(item => `• ${item.product.translations.uz.name} (${item.quantity}x) - ${(item.product.price * item.quantity).toLocaleString()} so'm`).join('\n')}

${order.appliedPromo ? `<b>🏷 ${l.promo}:</b> ${order.appliedPromo.toUpperCase()}\n<b>📉 ${l.discount}:</b> ${order.discountAmount?.toLocaleString()} so'm\n` : ''}
<b>💰 ${l.total}:</b> ${order.totalPrice.toLocaleString()} so'm
  `.trim();

  return sendMessage(message);
};

export const sendContactToTelegram = async (contact: { name: string, phone: string, message: string, language: string }) => {
  const text = `
<b>📩 Yangi Xabar (Bog'lanish)!</b>

<b>👤 Ism:</b> ${contact.name}
<b>📞 Telefon:</b> ${contact.phone}
<b>🌐 Foydalanuvchi tili:</b> ${contact.language.toUpperCase()}

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
          console.error("Telegram send error:", err);
          return false;
        }
      })
    );
    return results.some(res => res === true);
  } catch (error) {
    console.error("Telegram service error:", error);
    return false;
  }
}
