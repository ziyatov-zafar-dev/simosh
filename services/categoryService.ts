
import { Category } from '../types';
import { getDb, updateDb } from './dbService';

export const categoryService = {
  getAll: async () => {
    const db = await getDb();
    return db.categories;
  },
  
  save: async (category: Category) => {
    const db = await getDb();
    const index = db.categories.findIndex(c => c.id === category.id);
    let newCats;
    if (index > -1) {
      newCats = [...db.categories];
      newCats[index] = category;
    } else {
      newCats = [...db.categories, category];
    }
    await updateDb({ ...db, categories: newCats });
    return category;
  },
  
  delete: async (id: number) => {
    const db = await getDb();
    const newCats = db.categories.filter(c => c.id !== id);
    await updateDb({ ...db, categories: newCats });
  }
};
