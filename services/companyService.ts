
import { CompanyInfo, Database } from '../types';
import { getDbInstance } from './dbService';

export const companyService = {
  getInfo: async (): Promise<CompanyInfo> => {
    const db = await getDbInstance();
    const doc = await db.collection('settings').findOne({ type: 'companyInfo' });
    return doc?.data;
  },
  
  update: async (info: CompanyInfo) => {
    const db = await getDbInstance();
    await db.collection('settings').updateOne(
      { type: 'companyInfo' },
      { $set: { data: info } },
      { upsert: true }
    );
    return info;
  },
  
  getAbout: async (): Promise<Database['about']> => {
    const db = await getDbInstance();
    const doc = await db.collection('settings').findOne({ type: 'about' });
    return doc?.data;
  },
  
  updateAbout: async (about: Database['about']) => {
    const db = await getDbInstance();
    await db.collection('settings').updateOne(
      { type: 'about' },
      { $set: { data: about } },
      { upsert: true }
    );
    return about;
  }
};
