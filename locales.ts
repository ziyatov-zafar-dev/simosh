
import { Language } from './types';

export const translations: Record<Language, any> = {
  uz: {
    nav: { home: 'Asosiy', products: 'Sovunlar', about: 'Biz haqimizda', contact: 'Aloqa', ai: 'Simosh AI' },
    home: { heroTitle: 'Tabiatning Sof Mo\'jizasi', viewProducts: 'Mahsulotlar', popular: 'Ommabop Mahsulotlar' },
    cart: { title: 'Savatcha', empty: 'Savatchangiz bo\'sh', checkout: 'Buyurtma berish', add: 'Qo\'shish', added: 'Savatchaga qo\'shildi!' },
    ai: { welcome: 'Salom! Men Simosh AI yordamchisiman. Mahsulotlarimiz haqida so\'rang.', thinking: 'O\'ylayapman...', placeholder: 'Savolingizni yozing...' },
    contact: { title: 'Bog\'lanish', name: 'Ismingiz', phone: 'Telefon', message: 'Xabar', send: 'Yuborish', success: 'Xabaringiz yuborildi!' }
  },
  ru: {
    nav: { home: 'Главная', products: 'Мыло', about: 'О нас', contact: 'Контакты', ai: 'Simosh AI' },
    home: { heroTitle: 'Чистое Чудо Природы', viewProducts: 'Продукты', popular: 'Популярные Товары' },
    cart: { title: 'Корзина', empty: 'Корзина пуста', checkout: 'Оформить заказ', add: 'Добавить', added: 'Добавлено в корзину!' },
    ai: { welcome: 'Привет! Я ИИ-помощник Simosh. Спросите о наших продуктах.', thinking: 'Думаю...', placeholder: 'Напишите ваш вопрос...' },
    contact: { title: 'Связаться с нами', name: 'Имя', phone: 'Телефон', message: 'Сообщение', send: 'Отправить', success: 'Сообщение отправлено!' }
  },
  en: {
    nav: { home: 'Home', products: 'Soaps', about: 'About', contact: 'Contact', ai: 'Simosh AI' },
    home: { heroTitle: 'Pure Wonder of Nature', viewProducts: 'Products', popular: 'Popular Products' },
    cart: { title: 'Shopping Cart', empty: 'Cart is empty', checkout: 'Checkout', add: 'Add', added: 'Added to cart!' },
    ai: { welcome: 'Hello! I am Simosh AI. Ask me about our products.', thinking: 'Thinking...', placeholder: 'Type your question...' },
    contact: { title: 'Contact Us', name: 'Name', phone: 'Phone', message: 'Message', send: 'Send', success: 'Message sent!' }
  },
  tr: {
    nav: { home: 'Ana Sayfa', products: 'Sabunlar', about: 'Hakkımızda', contact: 'İletişim', ai: 'Simosh AI' },
    home: { heroTitle: 'Doğanın Saf Mucizesi', viewProducts: 'Ürünler', popular: 'Popüler Ürünler' },
    cart: { title: 'Sepetim', empty: 'Sepet boş', checkout: 'Sipariş Ver', add: 'Ekle', added: 'Sepete eklendi!' },
    ai: { welcome: 'Merhaba! Ben Simosh AI. Ürünlerimiz hakkında soru sorun.', thinking: 'Düşünüyorum...', placeholder: 'Sorunuzu yazın...' },
    contact: { title: 'Bizimle İletişime Geçin', name: 'Adınız', phone: 'Telefon', message: 'Mesaj', send: 'Gönder', success: 'Mesajınız gönderildi!' }
  }
};
