
import { CompanyInfo, Database } from '../types';
import { getDb, updateDb } from './dbService';

export const companyService = {
  getInfo: async () => {
    const db = await getDb();
    return db.companyInfo;
  },
  
  update: async (info: CompanyInfo) => {
    const db = await getDb();
    await updateDb({ ...db, companyInfo: info });
    return info;
  },
  
  getAbout: async () => {
    const db = await getDb();
    return db.about;
  },
  
  updateAbout: async (about: Database['about']) => {
    const db = await getDb();
    await updateDb({ ...db, about });
    return about;
  }
};
