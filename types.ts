
export type Language = 'uz' | 'ru' | 'en' | 'tr';

export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
  tr: string;
}

export interface LocalizedProductInfo {
  name: string;
  description: string;
}

export interface ProductDiscount {
  type: 'PERCENT' | 'FIXED';
  value: number;
  discountedPrice: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

export interface Product {
  id: string;
  sku: string;
  translations: Record<Language, LocalizedProductInfo>;
  price: number;
  currency: string;
  categoryId: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  image: string;
  discount?: ProductDiscount;
}

export interface Category {
  id: number;
  name: LocalizedString;
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'ADMIN' | 'MODERATOR';
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  scope: 'ALL_PRODUCTS' | 'PRODUCT';
  productId?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startsAt: string;
  endsAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
}

export interface CompanyInfo {
  name: string;
  logo: string;
  description: LocalizedString;
  phone: string;
  email: string;
  address: LocalizedString;
  instagram: string;
  telegram: string;
}

export interface OrderData {
  id: string;
  firstName: string;
  lastName: string;
  customerPhone: string;
  comment: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  totalPrice: number;
  language: Language;
  appliedPromo?: string;
  discountAmount?: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Database {
  companyInfo: CompanyInfo;
  categories: Category[];
  products: Product[];
  promoCodes: PromoCode[];
  orders: OrderData[];
  users: User[];
  about: {
    title: LocalizedString;
    content: LocalizedString;
    image: string;
  };
}
