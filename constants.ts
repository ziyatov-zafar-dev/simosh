
import { Database } from './types';

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
    phone: "+998 90 123 45 67",
    email: "atelier@simosh.com",
    address: {
      uz: "Toshkent, Botanika bog'i majmuasi",
      ru: "Ташкент, Комплекс Ботанического сада",
      en: "Tashkent, Botanical Garden Complex",
      tr: "Taşkent, Botanik Bahçesi Kompleksi"
    },
    instagram: "simosh_atelier",
    telegram: "simosh_official"
  },
  categories: [
    {
      id: 1,
      name: {
        uz: "Botanika",
        ru: "Ботаника",
        en: "Botanical",
        tr: "Botanik"
      }
    }
  ],
  products: [],
  promoCodes: [],
  orders: [],
  about: {
    title: {
      uz: "Biz haqimizda",
      ru: "О нас",
      en: "About Us",
      tr: "Hakkımızda"
    },
    content: {
      uz: "Simosh — bu tabiiy go'zallik va salomatlik markazi.",
      ru: "Simosh — это центр естественной красоты и здоровья.",
      en: "Simosh is a center of natural beauty and health.",
      tr: "Simosh, doğal güzellik ve sağlık merkezidir."
    },
    image: "https://images.unsplash.com/photo-1547793549-7038dd892c90?auto=format&fit=crop&q=80&w=1200"
  }
};

export const TELEGRAM_BOT_TOKEN = "8557045477:AAHNSYjRcyRs8iRj1qnYXH9yp788v8o9aLk";
export const CHAT_IDS = ["7882316826", "7571971490"];
