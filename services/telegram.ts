
import { OrderData } from '../types';
import { TELEGRAM_BOT_TOKEN, CHAT_IDS } from '../constants';

export const sendOrderToTelegram = async (order: OrderData) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const adminOrderUrl = `${baseUrl}#/admin?orderId=${order.id}`;

  const message = `
<b>📦 Yangi Buyurtma #${order.id.slice(-6)}</b>

<b>👤 Mijoz:</b> ${order.firstName} ${order.lastName}
<b>📞 Telefon:</b> ${order.customerPhone}
<b>🌐 Til:</b> ${order.language.toUpperCase()}

<b>🛒 Mahsulotlar:</b>
${order.items.map(item => `• ${item.product.translations.uz.name} (${item.quantity}x) - ${(item.product.price * item.quantity).toLocaleString()} UZS`).join('\n')}

${order.appliedPromo ? `<b>🏷 Promo:</b> ${order.appliedPromo}\n<b>📉 Chegirma:</b> ${order.discountAmount?.toLocaleString()} UZS\n` : ''}
<b>💰 Jami:</b> ${order.totalPrice.toLocaleString()} UZS

<b>📝 Izoh:</b> ${order.comment || "Yo'q"}
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "👁 Buyurtmani ko'rish", url: adminOrderUrl }
      ]
    ]
  };

  return sendMessage(message, keyboard);
};

export const sendContactToTelegram = async (contact: { name: string, phone: string, message: string, language: string }) => {
  const text = `
<b>📩 Yangi Aloqa Xabari!</b>

<b>👤 Ism:</b> ${contact.name}
<b>📞 Telefon:</b> ${contact.phone}
<b>🌐 Til:</b> ${contact.language.toUpperCase()}

<b>📝 Xabar:</b>
${contact.message}
  `.trim();

  return sendMessage(text);
};

async function sendMessage(text: string, replyMarkup?: any) {
  try {
    const results = await Promise.all(
      CHAT_IDS.map(async (chatId) => {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
          })
        });
        return response.ok;
      })
    );
    return results.some(res => res === true);
  } catch (error) {
    console.error("Telegram error:", error);
    return false;
  }
}
