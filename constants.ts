
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
    },
    {
      id: 2,
      name: {
        uz: "Efirlar",
        ru: "Эфиры",
        en: "Ethers",
        tr: "Eterler"
      }
    }
  ],
  products: [
    {
      id: 101,
      sku: "SIM-001",
      price: 45000,
      currency: "UZS",
      translations: {
        uz: {
          name: "Lavanda Shifosi",
          description: "Provans lavandasi va sovuq presslangan zaytun moyidan tayyorlangan tinchlantiruvchi ritual sovun."
        },
        ru: {
          name: "Лавандовый Дзен",
          description: "Успокаивающее ритуальное мыло из прованской лаванды и оливкового масла холодного отжима."
        },
        en: {
          name: "Lavender Zen",
          description: "Soothing ritual soap crafted from Provence lavender and cold-pressed olive oil."
        },
        tr: {
          name: "Lavanta Huzuru",
          description: "Provans lavantası ve soğuk sıkım zeytinyağından üretilmiş sakinleştirici ritüel sabunu."
        }
      },
      discount: {
        type: "PERCENT",
        value: 15,
        start_date: "2026-01-01T00:00:00Z",
        end_date: "2026-01-31T23:59:59Z"
      },
      stock: 50,
      is_active: true,
      created_at: "2024-01-08T00:00:00Z",
      image: "https://images.unsplash.com/photo-1605264964528-06403738d6dc?auto=format&fit=crop&q=80&w=800",
      categoryId: 1
    }
  ],
  promoCodes: [
    {
      id: "1",
      code: "SIMOSH2025",
      type: "PERCENT",
      value: 10,
      expiry_date: "2026-12-31T23:59:59Z",
      is_active: true
    }
  ],
  about: {
    title: {
      uz: "Bizning falsafamiz",
      ru: "Наша философия",
      en: "Our Philosophy",
      tr: "Felsefemiz"
    },
    content: {
      uz: "Simosh — bu shunchaki sovun emas, bu kundalik gigiyenani muqaddas ritualga aylantiruvchi san'at asaridir. Biz har bir mahsulotda tabiatning bor go'zalligini saqlab qolamiz.",
      ru: "Simosh — это не просто мыло, это произведение искусства, превращающее ежедневную гигиену в священный ритуал. Мы сохраняем всю красоту природы в каждом продукте.",
      en: "Simosh is not just soap; it is a piece of art that transforms daily hygiene into a sacred ritual. We preserve all the beauty of nature in every product.",
      tr: "Simosh sadece sabun değil; günlük hijyeni kutsal bir ritüele dönüştüren bir sanat eseridir. Doğanın tüm güzelliğini her üründe koruyoruz."
    },
    image: "https://images.unsplash.com/photo-1547793549-7038dd892c90?auto=format&fit=crop&q=80&w=1200"
  }
};

export const TELEGRAM_BOT_TOKEN = "8557045477:AAHNSYjRcyRs8iRj1qnYXH9yp788v8o9aLk";
export const CHAT_IDS = ["7882316826", "7571971490"];
