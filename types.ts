
export type Language = 'uz' | 'ru' | 'en' | 'tr';

export interface LocalizedProductInfo {
  name: string;
  description: string;
}

export type LocalizedString = Record<Language, string>;

export interface ProductDiscount {
  type: 'PERCENT' | 'FIXED';
  value: number;
  start_date: string;
  end_date: string;
}

export interface GlobalPromoCode {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  expiry_date: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  sku: string;
  price: number;
  currency: string;
  translations: Record<Language, LocalizedProductInfo>;
  discount?: ProductDiscount;
  stock: number;
  is_active: boolean;
  created_at: string;
  image: string;
  category: LocalizedString;
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

export interface Database {
  companyInfo: CompanyInfo;
  products: Product[];
  promoCodes: GlobalPromoCode[];
  about: {
    title: LocalizedString;
    content: LocalizedString;
    image: string;
  };
}

export interface OrderData {
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
}
