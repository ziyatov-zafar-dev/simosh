
import { PromoCode } from '../types';
import { getDb, updateDb } from './dbService';

export const promoService = {
  getAll: async () => {
    const db = await getDb();
    return db.promoCodes;
  },
  
  save: async (promo: PromoCode) => {
    const db = await getDb();
    const index = db.promoCodes.findIndex(p => p.id === promo.id);
    let newPromos;
    if (index > -1) {
      newPromos = [...db.promoCodes];
      newPromos[index] = promo;
    } else {
      newPromos = [...db.promoCodes, promo];
    }
    await updateDb({ ...db, promoCodes: newPromos });
    return promo;
  },
  
  delete: async (id: string) => {
    const db = await getDb();
    const newPromos = db.promoCodes.filter(p => p.id !== id);
    await updateDb({ ...db, promoCodes: newPromos });
  }
};
