
import { Database } from '../types';
import { INITIAL_DB } from '../constants';

const DB_URL = '/db.json';

export const loadDb = async (): Promise<Database> => {
  try {
    const response = await fetch(DB_URL);
    if (!response.ok) throw new Error('DB yuklanmadi');
    const data = await response.json();
    // Agar db.json bo'sh bo'lsa yoki noto'g'ri bo'lsa, INITIAL_DB dan foydalanamiz
    return { ...INITIAL_DB, ...data };
  } catch (error) {
    console.error('DB o\'qishda xatolik:', error);
    // Lokal saqlash joyidan zaxira sifatida foydalanish
    const local = localStorage.getItem('simosh_db');
    return local ? JSON.parse(local) : INITIAL_DB;
  }
};

export const saveDb = async (db: Database): Promise<boolean> => {
  try {
    // Lokal saqlash (zaxira uchun)
    localStorage.setItem('simosh_db', JSON.stringify(db));
    
    // Serverga yozish (json-server yoki shunga o'xshash API talab qilinadi)
    const response = await fetch(DB_URL, {
      method: 'POST', // Yoki PUT, serveringizga qarab
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
    
    return response.ok;
  } catch (error) {
    console.error('DB saqlashda xatolik:', error);
    return false;
  }
};
