
export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const ADMIN_CREDENTIALS = {
  email: 'akbarovamohinur23@gmail.com',
  // SHA-256 hash for 'Simosh0906.'
  passwordHash: '8407c089204c356247963b538740f9f600f736021e86a9889423c10a624945d7'
};

export const getActivePasswordHash = (): string => {
  return localStorage.getItem('simosh_admin_pwd_hash_v2') || ADMIN_CREDENTIALS.passwordHash;
};

export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  const inputHash = await hashPassword(cleanPassword);
  const activeHash = getActivePasswordHash();
  
  // Ma'lumotlar foydalanuvchi bergan login va parolga mos kelishi kerak
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() && inputHash === activeHash) {
    localStorage.setItem('simosh_admin_token_v2', 'session_' + Date.now());
    return true;
  }
  return false;
};

export const updateAdminPassword = async (newPassword: string): Promise<void> => {
  const newHash = await hashPassword(newPassword.trim());
  localStorage.setItem('simosh_admin_pwd_hash_v2', newHash);
};

export const logoutAdmin = () => {
  localStorage.removeItem('simosh_admin_token_v2');
};

export const isAdminAuthenticated = (): boolean => {
  return !!localStorage.getItem('simosh_admin_token_v2');
};
