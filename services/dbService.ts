
import { Database, Product, Category, GlobalPromoCode, CompanyInfo, OrderData } from '../types';
import { INITIAL_DB, APP_CONFIG } from '../constants';

const STORAGE_KEY = 'simosh_mongo_db';

/**
 * MongoDB mantiqini simulyatsiya qiluvchi servis.
 * Ma'lumotlar localStorage'da saqlanadi, bu sahifa yangilanganda ham saqlanib qolishini ta'minlaydi.
 */
export const loadDb = async (): Promise<Database> => {
  console.log(`Ulanish: ${APP_CONFIG.mongodbUri}`);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("DB Parse xatosi:", e);
    }
  }
  // Agar ma'lumot bo'lmasa, dastlabki ma'lumotlarni yozib qo'yamiz
  await saveDb(INITIAL_DB);
  return INITIAL_DB;
};

export const saveDb = async (db: Database): Promise<boolean> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.error('DB saqlashda xatolik:', error);
    return false;
  }
};

// --- CRUD operatsiyalari ---

export const addOrUpdateProduct = (db: Database, product: Product): Database => {
  const exists = db.products.find(p => p.id === product.id);
  const newProducts = exists 
    ? db.products.map(p => p.id === product.id ? product : p)
    : [...db.products, product];
  return { ...db, products: newProducts };
};

export const deleteProduct = (db: Database, id: number): Database => {
  return { ...db, products: db.products.filter(p => p.id !== id) };
};

export const addOrUpdateCategory = (db: Database, category: Category): Database => {
  const exists = db.categories.find(c => c.id === category.id);
  const newCats = exists
    ? db.categories.map(c => c.id === category.id ? category : c)
    : [...db.categories, category];
  return { ...db, categories: newCats };
};

export const deleteCategory = (db: Database, id: number): Database => {
  return { ...db, categories: db.categories.filter(c => c.id !== id) };
};

export const addOrUpdatePromo = (db: Database, promo: GlobalPromoCode): Database => {
  const exists = db.promoCodes.find(p => p.id === promo.id);
  const newPromos = exists
    ? db.promoCodes.map(p => p.id === promo.id ? promo : p)
    : [...db.promoCodes, promo];
  return { ...db, promoCodes: newPromos };
};

export const deletePromo = (db: Database, id: string): Database => {
  return { ...db, promoCodes: db.promoCodes.filter(p => p.id !== id) };
};

export const updateCompany = (db: Database, info: CompanyInfo): Database => ({ ...db, companyInfo: info });
export const updateOrderStatus = (db: Database, orderId: string, status: OrderData['status']): Database => {
  return { ...db, orders: db.orders.map(o => o.id === orderId ? { ...o, status } : o) };
};
