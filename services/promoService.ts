
import { PromoCode } from '../types';
import { getDbInstance } from './dbService';

export const promoService = {
  getAll: async (): Promise<PromoCode[]> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('promoCodes').find({}).toArray();
  },
  
  save: async (promo: PromoCode) => {
    const db = await getDbInstance();
    await db.collection('promoCodes').updateOne(
      { id: promo.id },
      { $set: promo },
      { upsert: true }
    );
    return promo;
  },
  
  delete: async (id: string) => {
    const db = await getDbInstance();
    await db.collection('promoCodes').deleteOne({ id });
  }
};
