
import { Product } from '../types';
import { getDbInstance } from './dbService';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('products').find({}).toArray();
  },
  
  getById: async (id: string): Promise<Product | null> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('products').findOne({ id });
  },
  
  save: async (product: Product) => {
    const db = await getDbInstance();
    await db.collection('products').updateOne(
      { id: product.id },
      { $set: product },
      { upsert: true }
    );
    return product;
  },
  
  delete: async (id: string) => {
    const db = await getDbInstance();
    await db.collection('products').deleteOne({ id });
  }
};
