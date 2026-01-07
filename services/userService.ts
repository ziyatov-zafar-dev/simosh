import { User } from '../types';
import { getDbInstance } from './dbService';
import { hashPassword } from './auth';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('users').find({}).toArray();
  },
  
  findByEmail: async (email: string): Promise<User | null> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('users').findOne({ email: email.toLowerCase() });
  },
  
  create: async (user: User) => {
    const db = await getDbInstance();
    await db.collection('users').insertOne(user);
    return user;
  },
  
  authenticate: async (email: string, password: string): Promise<User | null> => {
    const db = await getDbInstance();
    const inputHash = await hashPassword(password);
    // @ts-ignore
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase(), 
      passwordHash: inputHash 
    });
    // Fix: Cast to unknown first as WithId<Document> and User do not sufficiently overlap (id vs _id)
    return user as unknown as User | null;
  }
};