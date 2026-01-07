
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
  products: [
    {
      id: "1",
      name: {
        uz: "Lavanda Shifosi",
        ru: "Лавандовый Дзен",
        en: "Lavender Zen",
        tr: "Lavanta Huzuru"
      },
      description: {
        uz: "Provans lavandasi va sovuq presslangan zaytun moyidan tayyorlangan tinchlantiruvchi ritual sovun.",
        ru: "Успокаивающее ритуальное мыло из прованской лаванды и оливкового масла холодного отжима.",
        en: "Soothing ritual soap crafted from Provence lavender and cold-pressed olive oil.",
        tr: "Provans lavantası ve soğuk sıkım zeytinyağından üretilmiş sakinleştirici ritüel sabunu."
      },
      price: 45000,
      image: "https://images.unsplash.com/photo-1605264964528-06403738d6dc?auto=format&fit=crop&q=80&w=800",
      category: {
        uz: "Botanika",
        ru: "Ботаника",
        en: "Botanical",
        tr: "Botanik"
      }
    },
    {
      id: "2",
      name: {
        uz: "Asal va Sut",
        ru: "Мед и Шелк",
        en: "Honey & Silk",
        tr: "Bal ve İpek"
      },
      description: {
        uz: "Tog' asali va ipak oqsillari bilan boyitilgan, teringizni chuqur oziqlantiruvchi mo'jiza.",
        ru: "Чудо, обогащенное горным медом и протеинами шелка для глубокого питания вашей кожи.",
        en: "Enriched with mountain honey and silk proteins to deeply nourish your skin.",
        tr: "Cildinizi derinlemesine beslemek için dağ balı ve ipek proteinleriyle zenginleştirilmiştir."
      },
      price: 38000,
      image: "https://images.unsplash.com/photo-1546931457-3f895c12792e?auto=format&fit=crop&q=80&w=800",
      category: {
        uz: "Namlovchi",
        ru: "Увлажнение",
        en: "Hydrating",
        tr: "Nemlendirici"
      }
    },
    {
      id: "3",
      name: {
        uz: "Zaytun Moyli",
        ru: "Оливковый Ритуал",
        en: "Olive Heritage",
        tr: "Zeytin Mirası"
      },
      description: {
        uz: "Asriy an'analar asosida yaratilgan, Egey dengizi zaytunlaridan olingan toza energiya.",
        ru: "Чистая энергия эгейских оливок, созданная на основе вековых традиций.",
        en: "Pure energy of Aegean olives, crafted based on centuries-old traditions.",
        tr: "Asırlık geleneklere dayanan, Ege zeytinlerinin saf enerjisi."
      },
      price: 52000,
      image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
      category: {
        uz: "Klassik",
        ru: "Классика",
        en: "Heritage",
        tr: "Klasik"
      }
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