
import { Database, User } from '../types';

export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const loginAdmin = async (email: string, password: string, db: Database): Promise<boolean> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const inputHash = await hashPassword(cleanPassword);
  
  // Ma'lumotlar bazasidagi foydalanuvchilarni tekshirish
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail && u.passwordHash === inputHash);
  
  if (user) {
    localStorage.setItem('simosh_admin_token_v2', 'session_' + Date.now());
    localStorage.setItem('simosh_user_data', JSON.stringify(user));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem('simosh_admin_token_v2');
  localStorage.removeItem('simosh_user_data');
};

export const isAdminAuthenticated = (): boolean => {
  return !!localStorage.getItem('simosh_admin_token_v2');
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('simosh_user_data');
  return data ? JSON.parse(data) : null;
};
