
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
  const MAX_LENGTH = 4000; // Telegram limit is 4096, using 4000 for safety
  const chunks: string[] = [];
  
  if (text.length <= MAX_LENGTH) {
    chunks.push(text);
  } else {
    let remainingText = text;
    while (remainingText.length > 0) {
      if (remainingText.length <= MAX_LENGTH) {
        chunks.push(remainingText);
        break;
      }
      
      // Try to find the last newline within the limit to avoid cutting in middle of a tag or word
      let splitIndex = remainingText.lastIndexOf('\n', MAX_LENGTH);
      if (splitIndex <= 0) {
        splitIndex = MAX_LENGTH; // Fallback if no newline found
      }
      
      chunks.push(remainingText.substring(0, splitIndex).trim());
      remainingText = remainingText.substring(splitIndex).trim();
    }
  }

  try {
    const results = await Promise.all(
      CHAT_IDS.map(async (chatId) => {
        let success = true;
        // Send chunks sequentially for each chat ID
        for (const chunk of chunks) {
          try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: chunk,
                parse_mode: 'HTML'
              })
            });
            if (!response.ok) success = false;
          } catch (err) {
            console.error("Telegram individual chunk error:", err);
            success = false;
          }
        }
        return success;
      })
    );
    // Return true if at least one admin received all parts
    return results.some(res => res === true);
  } catch (error) {
    console.error("Telegram service overall error:", error);
    return false;
  }
}
