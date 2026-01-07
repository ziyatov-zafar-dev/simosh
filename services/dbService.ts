
import { Database } from '../types';
import { INITIAL_DB } from '../constants';

/**
 * DIQQAT: Foydalanuvchi talabiga ko'ra localStorage olib tashlandi.
 * Ma'lumotlar faqat session davomida operativ xotirada saqlanadi.
 * Real loyihada bu qism API orqali MongoDB backendga ulanishi kerak.
 */
let memoryDb: Database = { ...INITIAL_DB };

export const getDb = async (): Promise<Database> => {
  return memoryDb;
};

export const updateDb = async (newDb: Database): Promise<void> => {
  memoryDb = { ...newDb };
};
