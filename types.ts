
export type Language = 'uz' | 'ru' | 'en' | 'tr';

export type LocalizedString = Record<Language, string>;

export interface Product {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  image: string;
  category: LocalizedString;
}

export interface CompanyInfo {
  name: string;
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
  about: {
    title: LocalizedString;
    content: LocalizedString;
    image: string;
  };
}

export interface OrderData {
  customerName: string;
  customerPhone: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  totalPrice: number;
  language: Language;
}
