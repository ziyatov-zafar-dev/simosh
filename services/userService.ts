
import { User } from '../types';
import { getDbInstance } from './dbService';
import { hashPassword } from './auth';

export const userService = {
  authenticate: async (email: string, password: string): Promise<User | null> => {
    try {
      const db = await getDbInstance();
      const inputHash = await hashPassword(password);
      const user = await db.collection('users').findOne({ 
        email: email.toLowerCase(), 
        passwordHash: inputHash 
      });
      return user as unknown as User | null;
    } catch (err) {
      throw new Error("Tizimga kirishda xatolik yuz berdi");
    }
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const db = await getDbInstance();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    return user as unknown as User | null;
  }
};
