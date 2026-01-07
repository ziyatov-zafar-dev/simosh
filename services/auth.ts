
import { User } from '../types';

/**
 * Parolni hash qilish (SHA-256)
 */
export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * LocalStorage ishlatilmaydi. 
 * Autentifikatsiya holati App.tsx dagi state orqali boshqariladi.
 */
export const logoutAdmin = () => {
  // LocalStorage tozalash olib tashlandi
};

export const isAdminAuthenticated = (): boolean => {
  // Endi state orqali tekshiriladi
  return false; 
};

export const getCurrentUser = (): User | null => {
  return null;
};
