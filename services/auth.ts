
export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const ADMIN_CREDENTIALS = {
  email: 'akbarovamohinur23@gmail.com',
  // 'Simosh0906.' paroli uchun SHA-256 xeshi
  passwordHash: '8407c089204c356247963b538740f9f600f736021e86a9889423c10a624945d7'
};

export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  // Email va paroldan ortiqcha bo'sh joylarni olib tashlaymiz
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  const inputHash = await hashPassword(cleanPassword);
  
  // Emailni kichik harflarda solishtiramiz
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() && inputHash === ADMIN_CREDENTIALS.passwordHash) {
    localStorage.setItem('simosh_admin_token', 'session_' + Date.now());
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem('simosh_admin_token');
};

export const isAdminAuthenticated = (): boolean => {
  return !!localStorage.getItem('simosh_admin_token');
};
