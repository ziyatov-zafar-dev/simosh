
import { Database, Product, Category, GlobalPromoCode, CompanyInfo, OrderData } from '../types';
import { INITIAL_DB } from '../constants';

const DB_URL = '/db.json';

// Umumiy yuklash
export const loadDb = async (): Promise<Database> => {
  try {
    const response = await fetch(DB_URL);
    if (!response.ok) throw new Error('DB yuklanmadi');
    const data = await response.json();
    return { ...INITIAL_DB, ...data };
  } catch (error) {
    console.error('DB o\'qishda xatolik:', error);
    return INITIAL_DB;
  }
};

// Umumiy saqlash (Barcha CRUD amallari oxirida ushbu funksiya orqali serverga yozadi)
export const saveDb = async (db: Database): Promise<boolean> => {
  try {
    const response = await fetch(DB_URL, {
      method: 'POST', // Eslatma: Haqiqiy serverda bu PUT yoki POST bo'lishi kerak
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
    return response.ok;
  } catch (error) {
    console.error('DB saqlashda xatolik:', error);
    return false;
  }
};

// Mahsulotlar uchun CRUD
export const addProduct = (db: Database, product: Product): Database => {
  return { ...db, products: [...db.products, product] };
};

export const updateProduct = (db: Database, updatedProduct: Product): Database => {
  return { ...db, products: db.products.map(p => p.id === updatedProduct.id ? updatedProduct : p) };
};

export const deleteProduct = (db: Database, id: number): Database => {
  return { ...db, products: db.products.filter(p => p.id !== id) };
};

// Kategoriyalar uchun CRUD
export const addCategory = (db: Database, category: Category): Database => {
  return { ...db, categories: [...db.categories, category] };
};

export const updateCategory = (db: Database, updatedCategory: Category): Database => {
  return { ...db, categories: db.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c) };
};

export const deleteCategory = (db: Database, id: number): Database => {
  return { ...db, categories: db.categories.filter(c => c.id !== id) };
};

// Promo-kodlar uchun CRUD
export const addPromoCode = (db: Database, promo: GlobalPromoCode): Database => {
  return { ...db, promoCodes: [...db.promoCodes, promo] };
};

export const deletePromoCode = (db: Database, id: string): Database => {
  return { ...db, promoCodes: db.promoCodes.filter(p => p.id !== id) };
};

// Kompaniya ma'lumotlarini yangilash
export const updateCompanyInfo = (db: Database, info: CompanyInfo): Database => {
  return { ...db, companyInfo: info };
};

// Buyurtmalar statusini o'zgartirish
export const updateOrderStatus = (db: Database, orderId: string, status: OrderData['status']): Database => {
  return { ...db, orders: db.orders.map(o => o.id === orderId ? { ...o, status } : o) };
};
