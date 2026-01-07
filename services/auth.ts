
import { User } from '../types';

/**
 * SHA-256 Password hashing
 */
export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * LocalStorage is NOT used as per request.
 * Authentication state is managed in App component.
 */
export const logoutAdmin = () => {
  // No localStorage cleanup here
};

export const isAdminAuthenticated = (): boolean => {
  // Always returns false by default; state must be checked in the app
  return false; 
};
