
import { Product, Database } from '../types';
import { getDb, updateDb } from './dbService';

export const productService = {
  getAll: async () => {
    const db = await getDb();
    return db.products;
  },
  
  getById: async (id: string) => {
    const db = await getDb();
    return db.products.find(p => p.id === id);
  },
  
  save: async (product: Product) => {
    const db = await getDb();
    const index = db.products.findIndex(p => p.id === product.id);
    let newProducts;
    if (index > -1) {
      newProducts = [...db.products];
      newProducts[index] = product;
    } else {
      newProducts = [...db.products, product];
    }
    await updateDb({ ...db, products: newProducts });
    return product;
  },
  
  delete: async (id: string) => {
    const db = await getDb();
    const newProducts = db.products.filter(p => p.id !== id);
    await updateDb({ ...db, products: newProducts });
  }
};
