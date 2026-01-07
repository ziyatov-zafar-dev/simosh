
import { OrderData } from '../types';
import { APP_CONFIG } from '../constants';

export const sendOrderToTelegram = async (order: OrderData) => {
  const message = `
<b>📦 YANGI BUYURTMA #${order.id.slice(-6)}</b>
━━━━━━━━━━━━━━━━━━
<b>👤 Mijoz:</b> ${order.firstName} ${order.lastName}
<b>📞 Telefon:</b> ${order.customerPhone}
<b>🌐 Til:</b> ${order.language.toUpperCase()}

<b>🛒 Mahsulotlar:</b>
${order.items.map(item => `• <b>${item.product.translations[order.language].name}</b> (x${item.quantity})`).join('\n')}

━━━━━━━━━━━━━━━━━━
<b>💰 JAMI SUMMA:</b> ${order.totalPrice.toLocaleString()} UZS
${order.comment ? `\n<b>📝 Izoh:</b> <i>${order.comment}</i>` : ''}
  `.trim();

  return sendMessage(message);
};

export const sendContactToTelegram = async (contact: { name: string, phone: string, message: string, language: string }) => {
  const text = `
<b>📩 YANGI ALOQA XABARI!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 Ism:</b> ${contact.name}
<b>📞 Telefon:</b> ${contact.phone}
<b>📝 Xabar:</b> <i>${contact.message}</i>
  `.trim();

  return sendMessage(text);
};

async function sendMessage(text: string) {
  try {
    const results = await Promise.all(
      APP_CONFIG.chatIds.map(async (chatId) => {
        const response = await fetch(`https://api.telegram.org/bot${APP_CONFIG.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          })
        });
        return response.ok;
      })
    );
    return results.some(res => res === true);
  } catch (error) {
    console.error("Telegram xatolik:", error);
    return false;
  }
}
