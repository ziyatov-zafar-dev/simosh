
import { Database, AppConfig } from './types';

export const APP_CONFIG: AppConfig = {
  mongodbUri: "mongodb://localhost:27017",
  telegramBotToken: "8557045477:AAHNSYjRcyRs8iRj1qnYXH9yp788v8o9aLk",
  chatIds: ["7882316826", "7571971490"]
};

export const INITIAL_DB: Database = {
  companyInfo: {
    name: "Simosh Atelier",
    logo: "https://img.icons8.com/ios-filled/100/10B981/leaf.png",
    description: {
      uz: "Simosh — tabiatning eng sof moddalari va zamonaviy botanika ilmi uyg'unlashgan premium sovunlar atelyesi.",
      ru: "Simosh — ателье премиального мыла, где чистейшие природные компоненты встречаются с современной ботанической наукой.",
      en: "Simosh is a premium soap atelier where nature's purest elements meet modern botanical science.",
      tr: "Simosh, doğanın en saf elementlerinin modern botanik bilimiyle buluştuğu premium bir sabun atölyesidir."
    },
    phone: "+998 90 000 00 00",
    email: "info@simosh.uz",
    address: {
      uz: "Toshkent shahri, Botanika bog'i majmuasi",
      ru: "Город Ташкент, Комплекс Ботанического сада",
      en: "Tashkent City, Botanical Garden Complex",
      tr: "Taşkent Şehri, Botanik Bahçesi Kompleksi"
    },
    instagram: "simosh_official",
    telegram: "simosh_admin"
  },
  categories: [
    {
      id: 1,
      name: { uz: "Botanika", ru: "Ботаника", en: "Botanical", tr: "Botanik" }
    }
  ],
  products: [
    {
      id: 1,
      sku: "SIM-001",
      translations: {
        uz: { name: "Lavanda Shifosi", description: "Tinchlantiruvchi lavanda moyi bilan boyitilgan tabiiy sovun." },
        ru: { name: "Лавандовое Исцеление", description: "Натуральное мыло с успокаивающим маслом лаванды." },
        en: { name: "Lavender Healing", description: "Natural soap with soothing lavender oil." },
        tr: { name: "Lavanta Şifası", description: "Sakinleştirici lavanta yağı içeren doğal sabun." }
      },
      price: 45000,
      currency: "UZS",
      image: "https://images.unsplash.com/photo-1605264964528-06403738d6dc",
      categoryId: 1,
      stock: 50,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  promoCodes: [
    { id: "1", code: "SIMOSH", type: "PERCENT", value: 10, min_amount: 10000, expiry_date: "2026-01-01", is_active: true }
  ],
  orders: [],
  about: {
    title: { uz: "Biz haqimizda", ru: "О нас", en: "About Us", tr: "Hakkımızda" },
    content: { 
      uz: "Biz 2023-yildan beri tabiiy go'zallik ustida ishlaymiz.", 
      ru: "Мы работаем над естественной красотой с 2023 года.", 
      en: "We have been working on natural beauty since 2023.", 
      tr: "2023'ten beri doğal güzellik üzerine çalışıyoruz." 
    },
    image: "https://images.unsplash.com/photo-1547793549-7038dd892c90"
  }
};
