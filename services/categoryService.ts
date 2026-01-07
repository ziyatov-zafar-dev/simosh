
import { Category } from '../types';
import { getDbInstance } from './dbService';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('categories').find({}).toArray();
  },
  
  save: async (category: Category) => {
    const db = await getDbInstance();
    await db.collection('categories').updateOne(
      { id: category.id },
      { $set: category },
      { upsert: true }
    );
    return category;
  },
  
  delete: async (id: number) => {
    const db = await getDbInstance();
    await db.collection('categories').deleteOne({ id });
  }
};
