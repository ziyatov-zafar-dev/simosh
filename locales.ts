
import { Language } from './types';

export const translations: Record<Language, any> = {
  uz: {
    nav: {
      home: 'Asosiy',
      products: 'Sovunlar',
      about: 'Biz haqimizda',
      contact: 'Bog\'lanish',
      ai: 'Simosh AI'
    },
    home: {
      heroTitle: 'Tabiatning eng toza in\'omi — Simosh',
      heroSubtitle: 'Sifatli va tabiiy sovunlar bilan teringizga haqiqiy go\'zallik va sog\'liq baxsh eting.',
      viewProducts: 'Mahsulotlarni ko\'rish',
      popularTitle: 'Ommabop Mahsulotlar',
      popularSubtitle: 'Mijozlarimiz tomonidan eng ko\'p tanlanayotganlar',
      viewAll: 'Hammasi'
    },
    cart: {
      title: 'Savatcha',
      empty: 'Savatchangiz bo\'sh',
      total: 'Jami',
      checkout: 'Buyurtma berish',
      add: 'Qo\'shish',
      added: 'Savatchaga qo\'shildi!',
      items: 'mahsulot',
      quantity: 'Miqdor'
    },
    checkout: {
      title: 'Ma\'lumotlaringiz',
      name: 'Ismingiz',
      namePlaceholder: 'Masalan: Mohinur Akbarova',
      phone: 'Telefon raqamingiz',
      phonePlaceholder: '+998 90 123 45 67',
      confirm: 'Tasdiqlash',
      cancel: 'Bekor qilish',
      sending: 'Yuborilmoqda...',
      success: 'Buyurtmangiz qabul qilindi! Tez orada bog\'lanamiz.',
      error: 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
    },
    ai: {
      welcome: 'Salom! Men Simosh AI yordamchisiman. Mahsulotlarimiz haqida qanday yordam bera olaman?',
      thinking: 'O\'ylayapman...',
      placeholder: 'Mahsulot haqida so\'rang...',
      analyzeImage: 'Ushbu rasm haqida ma\'lumot bering.'
    },
    contact: {
      title: 'Biz bilan bog\'lanish',
      subtitle: 'Savollaringiz bormi? Bizga xabar qoldiring.',
      formName: 'Ismingiz',
      formEmail: 'Email manzilingiz',
      formMessage: 'Xabaringiz...',
      send: 'Yuborish',
      sending: 'Yuborilmoqda...',
      success: 'Xabaringiz yuborildi! Tez orada javob beramiz.',
      error: 'Xabar yuborishda xatolik.'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      products: 'Мыло',
      about: 'О нас',
      contact: 'Контакты',
      ai: 'Simosh AI'
    },
    home: {
      heroTitle: 'Чистейший дар природы — Simosh',
      heroSubtitle: 'Подарите своей коже истинную красоту и здоровье с качественным натуральным мылом.',
      viewProducts: 'Смотреть товары',
      popularTitle: 'Популярные товары',
      popularSubtitle: 'Самые выбираемые нашими клиентами',
      viewAll: 'Все'
    },
    cart: {
      title: 'Корзина',
      empty: 'Ваша корзина пуста',
      total: 'Итого',
      checkout: 'Оформить заказ',
      add: 'Добавить',
      added: 'Добавлено в корзину!',
      items: 'товаров',
      quantity: 'Количество'
    },
    checkout: {
      title: 'Ваши данные',
      name: 'Ваше имя',
      namePlaceholder: 'Например: Мохинур Акбарова',
      phone: 'Номер телефона',
      phonePlaceholder: '+998 90 123 45 67',
      confirm: 'Подтвердить',
      cancel: 'Отмена',
      sending: 'Отправка...',
      success: 'Ваш заказ принят! Мы скоро свяжемся с вами.',
      error: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
    },
    ai: {
      welcome: 'Здравствуйте! Я ИИ-помощник Simosh. Чем я могу помочь вам в выборе нашей продукции?',
      thinking: 'Думаю...',
      placeholder: 'Спросите о продукте...',
      analyzeImage: 'Дайте информацию об этом изображении.'
    },
    contact: {
      title: 'Свяжитесь с нами',
      subtitle: 'У вас есть вопросы? Оставьте нам сообщение.',
      formName: 'Ваше имя',
      formEmail: 'Ваш Email',
      formMessage: 'Ваше сообщение...',
      send: 'Отправить',
      sending: 'Отправка...',
      success: 'Ваше сообщение отправлено!',
      error: 'Ошибка при отправке.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Soaps',
      about: 'About Us',
      contact: 'Contact',
      ai: 'Simosh AI'
    },
    home: {
      heroTitle: "Nature's Purest Gift — Simosh",
      heroSubtitle: 'Give your skin true beauty and health with quality natural soaps.',
      viewProducts: 'View Products',
      popularTitle: 'Popular Products',
      popularSubtitle: 'Most selected by our customers',
      viewAll: 'All'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout Now',
      add: 'Add to Cart',
      added: 'Added to cart!',
      items: 'items',
      quantity: 'Quantity'
    },
    checkout: {
      title: 'Your Details',
      name: 'Your Name',
      namePlaceholder: 'e.g., Mohinur Akbarova',
      phone: 'Phone Number',
      phonePlaceholder: '+998 90 123 45 67',
      confirm: 'Confirm Order',
      cancel: 'Cancel',
      sending: 'Sending...',
      success: 'Your order has been received! We will contact you soon.',
      error: 'An error occurred. Please try again.'
    },
    ai: {
      welcome: 'Hello! I am Simosh AI assistant. How can I help you with our products?',
      thinking: 'Thinking...',
      placeholder: 'Ask about a product...',
      analyzeImage: 'Give information about this image.'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Have questions? Leave us a message.',
      formName: 'Your Name',
      formEmail: 'Your Email',
      formMessage: 'Your message...',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent! We will get back to you soon.',
      error: 'Error sending message.'
    }
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      products: 'Sabunlar',
      about: 'Hakkımızda',
      contact: 'İletişim',
      ai: 'Simosh AI'
    },
    home: {
      heroTitle: 'Doğanın En Saf Hediyesi — Simosh',
      heroSubtitle: 'Kaliteli ve doğal sabunlarla cildinize gerçek güzellik ve sağlık katın.',
      viewProducts: 'Ürünleri Gör',
      popularTitle: 'Popüler Ürünler',
      popularSubtitle: 'Müşterilerimiz tarafından en çok seçilenler',
      viewAll: 'Hepsi'
    },
    cart: {
      title: 'Sepetim',
      empty: 'Sepetiniz boş',
      total: 'Toplam',
      checkout: 'Siparişi Tamamla',
      add: 'Sepete Ekle',
      added: 'Sepete eklendi!',
      items: 'ürün',
      quantity: 'Adet'
    },
    checkout: {
      title: 'Bilgileriniz',
      name: 'Adınız',
      namePlaceholder: 'Örn: Mohinur Akbarova',
      phone: 'Telefon Numaranız',
      phonePlaceholder: '+998 90 123 45 67',
      confirm: 'Siparişi Onayla',
      cancel: 'İptal',
      sending: 'Gönderiliyor...',
      success: 'Siparişiniz alındı! Yakında sizinle iletişime geçeceğiz.',
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    },
    ai: {
      welcome: 'Merhaba! Ben Simosh AI asistanıyım. Ürünlerimiz hakkında size nasıl yardımcı olabilirim?',
      thinking: 'Düşünüyorum...',
      placeholder: 'Ürün hakkında soru sorun...',
      analyzeImage: 'Bu resim hakkında bilgi verin.'
    },
    contact: {
      title: 'Bize Ulaşın',
      subtitle: 'Sorularınız mı var? Bize mesaj bırakın.',
      formName: 'Adınız',
      formEmail: 'E-posta',
      formMessage: 'Mesajınız...',
      send: 'Gönder',
      sending: 'Gönderiliyor...',
      success: 'Mesajınız gönderildi!',
      error: 'Mesaj gönderilemedi.'
    }
  }
};
