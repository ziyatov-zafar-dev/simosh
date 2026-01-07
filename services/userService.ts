
import { User } from '../types';
import { getDb, updateDb } from './dbService';
import { hashPassword } from './auth';

export const userService = {
  getAll: async () => {
    const db = await getDb();
    return db.users;
  },
  
  findByEmail: async (email: string) => {
    const db = await getDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  create: async (user: User) => {
    const db = await getDb();
    const newUsers = [...db.users, user];
    await updateDb({ ...db, users: newUsers });
    return user;
  },
  
  authenticate: async (email: string, password: string) => {
    const db = await getDb();
    const inputHash = await hashPassword(password);
    const user = db.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.passwordHash === inputHash
    );
    return user || null;
  }
};
