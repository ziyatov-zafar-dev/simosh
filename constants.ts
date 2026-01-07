
import { Database } from './types';

export const APP_CONFIG = {
  mongodbUri: "mongodb://localhost:27017",
  telegramBotToken: "8557045477:AAHNSYjRcyRs8iRj1qnYXH9yp788v8o9aLk",
  chatIds: ["7882316826", "7571971490"]
};

export const INITIAL_DB: Database = {
  companyInfo: {
    name: "Simosh",
    logo: "https://img.icons8.com/ios-filled/100/10B981/leaf.png",
    description: {
      uz: "Simosh — tabiiy ingredientlar asosida tayyorlangan premium sovunlar atelyesi.",
      ru: "Simosh — ателье премиального мыла на основе натуральных ингредиентов.",
      en: "Simosh is a premium soap atelier made from natural ingredients.",
      tr: "Simosh, doğal içeriklerden yapılmış premium bir sabun atölyesidir."
    },
    phone: "+998 90 000 00 00",
    email: "akbarovamohinur23@gmail.com",
    address: {
      uz: "Toshkent shahri",
      ru: "Город Ташкент",
      en: "Tashkent City",
      tr: "Taşkent Şehri"
    },
    instagram: "simosh_official",
    telegram: "simosh_admin"
  },
  users: [
    {
      id: "admin-1",
      email: "akbarovamohinur23@gmail.com",
      // 'Simosh0906.' paroli uchun SHA-256 hash
      passwordHash: "8407c089204c356247963b538740f9f600f736021e86a9889423c10a624945d7",
      role: "ADMIN",
      name: "Mohinur Akbarova"
    }
  ],
  categories: [
    {
      id: 1,
      name: { 
        uz: "Botanika Sovunlari", 
        ru: "Ботаническое мыло", 
        en: "Botanical Soaps", 
        tr: "Botanik Sabunlar" 
      }
    }
  ],
  products: [
    {
      id: "prod-101",
      sku: "SIM-LAV-01",
      translations: {
        uz: { name: "Lavanda Premium", description: "Tabiiy lavanda moyi va tinchlantiruvchi ta'sir." },
        ru: { name: "Лаванда Премиум", description: "Натуральное масло лаванды и успокаивающий эффект." },
        en: { name: "Lavender Premium", description: "Natural lavender oil and soothing effect." },
        tr: { name: "Lavanta Premium", description: "Doğal lavanta yağı ve sakinleştirici etki." }
      },
      price: 55000,
      currency: "UZS",
      categoryId: 1,
      stock: 100,
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1605264964528-06403738d6dc",
      discount: {
        type: "PERCENT",
        value: 10,
        discountedPrice: 49500,
        start_date: "2024-01-01T00:00:00Z",
        end_date: "2026-12-31T23:59:59Z",
        active: true
      }
    }
  ],
  promoCodes: [
    {
      id: "promo-1",
      code: "SIMOSH10",
      description: "Barcha mahsulotlarga 10% chegirma",
      scope: "ALL_PRODUCTS",
      discountType: "PERCENT",
      discountValue: 10,
      minOrderAmount: 100000,
      startsAt: "2024-01-01T00:00:00Z",
      endsAt: "2026-12-31T23:59:59Z",
      status: "ACTIVE"
    }
  ],
  orders: [],
  about: {
    title: { uz: "Biz haqimizda", ru: "О нас", en: "About Us", tr: "Hakkımızda" },
    content: { 
      uz: "Simosh kompaniyasi 2023-yilda tashkil etilgan. Bizning asosiy maqsadimiz — aholiga butunlay tabiiy va kimyoviy qo'shimchalarsiz sovunlarni taqdim etishdir.", 
      ru: "Компания Simosh была основана в 2023 году. Наша главная цель — предоставить людям полностью натуральное мыло.", 
      en: "Simosh was founded in 2023. Our main goal is to provide people with completely natural soaps.", 
      tr: "Simosh 2023 yılında kuruldu. Temel amacımız tamamen doğal sabunlar sunmaktır." 
    },
    image: "https://images.unsplash.com/photo-1547793549-7038dd892c90"
  }
};
