
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Minus, ArrowRight, Leaf, 
  Menu, X, Sparkles, Globe2, Phone, MessageSquare, CheckCircle, Trash2, Settings, Tag, Calendar, AlertCircle
} from 'lucide-react';
import { INITIAL_DB } from './constants';
import { Product, Language, Database, CompanyInfo, GlobalPromoCode, Category } from './types';
import { translations } from './locales';
import { sendOrderToTelegram, sendContactToTelegram } from './services/telegram';
import SimoshAI from './components/SimoshAI';
import AdminPanel from './components/AdminPanel';

export const LanguageContext = createContext<{ 
  lang: Language, 
  setLang: (l: Language) => void, 
  t: any,
  isDark: boolean,
  toggleTheme: () => void,
  showToast: (msg: string) => void
}>({
  lang: 'uz',
  setLang: () => {},
  t: translations.uz,
  isDark: false,
  toggleTheme: () => {},
  showToast: () => {}
});

const getUzbekistanTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const map: any = {};
  parts.forEach(({type, value}) => map[type] = value);
  return new Date(`${map.year}-${map.month.padStart(2, '0')}-${map.day.padStart(2, '0')}T${map.hour.padStart(2, '0')}:${map.minute.padStart(2, '0')}:${map.second.padStart(2, '0')}`);
};

const isDateActive = (start?: string, end?: string) => {
  if (!start || !end) return false;
  const now = getUzbekistanTime();
  const startDate = new Date(start);
  const endDate = new Date(end);
  return now >= startDate && now <= endDate;
};

const getEffectivePrice = (product: Product) => {
  if (product.discount && isDateActive(product.discount.start_date, product.discount.end_date)) {
    if (product.discount.type === 'PERCENT') {
      return product.price * (1 - product.discount.value / 100);
    } else {
      return Math.max(0, product.price - product.discount.value);
    }
  }
  return product.price;
};

const ProductCard = ({ product, categories, onAdd }: { product: Product, categories: Category[], onAdd: (p: Product, q: number) => void }) => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const activeDiscount = product.discount && isDateActive(product.discount.start_date, product.discount.end_date);
  const effectivePrice = getEffectivePrice(product);
  const categoryName = categories.find(c => c.id === product.categoryId)?.name[lang] || "---";

  const handleAddClick = () => {
    onAdd(product, quantity);
    setIsConfiguring(false);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      const msg = lang === 'uz' ? "Boshqa mahsulot qolmagan" : 
                  lang === 'ru' ? "Больше товара нет" : 
                  lang === 'tr' ? "Daha fazla ürün kalmadı" : "No more items left";
      showToast(msg);
    }
  };

  return (
    <div className="product-card bg-white dark:bg-white/5 p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden flex flex-col h-full group">
      {/* Configuration Overlay Panel */}
      <div className={`absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-xl border-t border-brand-mint/20 rounded-t-[2.5rem] transition-all duration-500 ease-out transform ${isConfiguring ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-mint">{t.cart.title}</span>
          <button onClick={() => setIsConfiguring(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-rose-500 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm text-brand-dark dark:text-white hover:scale-105 active:scale-90 transition-all"
            >
              <Minus size={18} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black">{quantity}</span>
              <span className="text-[8px] font-bold uppercase opacity-30">Dona</span>
            </div>
            <button 
              onClick={increaseQuantity}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm text-brand-dark dark:text-white hover:scale-105 active:scale-90 transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleAddClick}
            className="w-full py-4 md:py-5 gradient-mint text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <ShoppingBag size={18} /> {t.cart.add}
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] mb-4 md:mb-6">
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.translations[lang].name} />
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 dark:bg-brand-dark/90 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
          {categoryName}
        </div>
        {activeDiscount && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
            {product.discount?.type === 'PERCENT' ? `-${product.discount?.value}%` : 'SALE'}
          </div>
        )}
      </div>
      
      <div className="px-1 md:px-2 space-y-3 md:space-y-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl md:text-2xl font-black leading-tight flex-1">{product.translations[lang].name}</h3>
          <span className="text-[10px] opacity-30 font-bold font-mono">{product.sku}</span>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">{product.translations[lang].description}</p>
        
        <div className="flex flex-col border-t border-gray-50 dark:border-white/5 pt-3 mb-2">
          <span className="text-[8px] md:text-[10px] font-black uppercase opacity-40">{lang === 'uz' ? 'Narxi' : lang === 'ru' ? 'Цена' : 'Price'}</span>
          {activeDiscount ? (
            <div className="flex items-end gap-2">
              <span className="text-xl md:text-2xl font-black text-rose-500 leading-none">{effectivePrice.toLocaleString()} <span className="text-[10px] uppercase">{product.currency}</span></span>
              <span className="text-xs line-through opacity-30 mb-0.5">{product.price.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-xl md:text-2xl font-black text-brand-mint leading-none">{product.price.toLocaleString()} <span className="text-[10px] md:text-xs uppercase">{product.currency}</span></span>
          )}
        </div>

        <div className="pt-2 min-h-[50px] md:min-h-[60px] flex items-center mt-auto">
          <button 
            onClick={() => setIsConfiguring(true)} 
            className={`w-full py-3 md:py-4 gradient-mint text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all font-black uppercase tracking-widest text-[10px] ${product.stock <= 0 ? 'opacity-20 pointer-events-none grayscale' : ''}`}
          >
            {product.stock <= 0 ? <><X size={16} /> Sotuvda yo'q</> : <><Plus size={16} /> Tanlash</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ cartCount, db }: { cartCount: number, db: Database }) => {
  const { lang, setLang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.ai, path: '/ai' }
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-0 w-full z-50 px-4">
        <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-xl py-2 md:py-3 px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-brand-dark rounded-full flex items-center justify-center shadow-lg overflow-hidden">
               <img src={db.companyInfo.logo} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-brand-dark dark:text-white uppercase">{db.companyInfo.name.split(' ')[0]}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-full">
            {menu.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all ${location.pathname === item.path ? 'nav-active' : 'text-gray-500 dark:text-gray-400 hover:text-brand-mint'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-mint">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-[10px] md:text-xs font-black uppercase outline-none text-brand-dark dark:text-white cursor-pointer hidden md:block"
            >
              {['uz', 'ru', 'en', 'tr'].map(l => <option key={l} value={l} className="bg-white dark:bg-brand-dark">{l}</option>)}
            </select>

            <Link to="/cart" className="relative w-8 h-8 md:w-10 md:h-10 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] md:text-[10px] font-black w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark shadow-lg animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-dark dark:text-white">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-brand-dark/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-4/5 max-sm max-w-sm bg-white dark:bg-brand-dark shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                 <img src={db.companyInfo.logo} className="w-8 h-8 object-contain" alt="Logo" />
                 <span className="text-2xl font-black tracking-tighter uppercase text-brand-mint">{db.companyInfo.name.split(' ')[0]}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {menu.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`text-2xl font-black uppercase tracking-widest transition-colors ${location.pathname === item.path ? 'text-brand-mint' : 'text-gray-400'}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/admin" className="text-xl font-bold uppercase text-gray-400">Admin Panel</Link>
            </div>
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black uppercase opacity-40">Tilni tanlang</span>
                 <div className="flex gap-3">
                   {['uz', 'ru', 'en', 'tr'].map(l => (
                     <button 
                       key={l} 
                       onClick={() => setLang(l as Language)}
                       className={`w-8 h-8 text-[10px] font-black rounded-lg uppercase transition-all ${lang === l ? 'gradient-mint text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}
                     >
                       {l}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  const [db, setDb] = useState<Database>(() => {
    const saved = localStorage.getItem('simosh_db');
    if (!saved) return INITIAL_DB;
    
    try {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_DB,
        ...parsed,
        categories: (parsed.categories && parsed.categories.length > 0) ? parsed.categories : INITIAL_DB.categories,
        promoCodes: (parsed.promoCodes && parsed.promoCodes.length > 0) ? parsed.promoCodes : INITIAL_DB.promoCodes,
        products: (parsed.products && parsed.products.length > 0) ? parsed.products : INITIAL_DB.products
      };
    } catch (e) {
      return INITIAL_DB;
    }
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('simosh_lang');
    return (saved as Language) || 'uz';
  });
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('simosh_dark') === 'true';
  });
  
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>(() => {
    const saved = localStorage.getItem('simosh_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('simosh_dark', isDark.toString());
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('simosh_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('simosh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('simosh_db', JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, quantity: Math.min(product.stock, i.quantity + quantity)} : i);
      return [...prev, { product, quantity }];
    });
    setToast(translations[lang].cart.added);
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        if (delta > 0 && item.quantity >= item.product.stock) {
          const msg = lang === 'uz' ? "Boshqa mahsulot qolmagan" : 
                      lang === 'ru' ? "Больше товара нет" : 
                      lang === 'tr' ? "Daha fazla ürün kalmadı" : "No more items left";
          setToast(msg);
          return item;
        }
        const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      t: translations[lang], 
      isDark, 
      toggleTheme: () => setIsDark(!isDark), 
      showToast: (m) => setToast(m) 
    }}>
      <Router>
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-white transition-colors duration-500 flex flex-col">
          <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} db={db} />
          
          <main className="pt-20 md:pt-24 flex-1">
            <Routes>
              <Route path="/" element={
                <div className="pb-10 md:pb-20">
                  <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 md:gap-16 items-center min-h-[70vh] md:min-h-[80vh]">
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-mint/10 rounded-full text-brand-mint text-[10px] md:text-xs font-black uppercase tracking-widest">
                        <Leaf size={14} /> 100% Organik & Tabiiy
                      </div>
                      <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                        {translations[lang].home.heroTitle.split(' ')[0]} <br />
                        <span className="text-gradient italic">{translations[lang].home.heroTitle.split(' ')[1]}</span> <br />
                        {translations[lang].home.heroTitle.split(' ').slice(2).join(' ')}
                      </h1>
                      <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                        {db.companyInfo.description[lang]}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/products" className="inline-flex items-center justify-center gap-3 gradient-mint text-white px-8 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-sm shadow-xl hover:scale-105 transition-all w-full sm:w-auto text-center">
                          {translations[lang].home.viewProducts} <ArrowRight size={18} />
                        </Link>
                        <Link to="/ai" className="inline-flex items-center justify-center gap-3 bg-white dark:bg-white/10 text-brand-dark dark:text-white px-8 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-sm shadow-lg hover:bg-gray-50 transition-all border border-gray-100 dark:border-white/5 w-full sm:w-auto text-center">
                          Simosh AI <Sparkles size={18} className="text-brand-mint" />
                        </Link>
                      </div>
                    </div>
                    <div className="relative group animate-in fade-in zoom-in duration-1000 hidden lg:block">
                       <div className="absolute -inset-10 bg-brand-mint/10 rounded-full blur-[100px] group-hover:bg-brand-mint/20 transition-all" />
                       <div className="relative bg-white dark:bg-white/5 p-6 rounded-[3rem] shadow-2xl border border-white/20">
                          <img src={db.products[0]?.image || INITIAL_DB.products[0].image} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="Hero" />
                       </div>
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
                   <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                      <div className="space-y-1 md:space-y-2 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">{translations[lang].nav.products}</h2>
                        <p className="text-brand-mint font-bold uppercase tracking-widest text-[10px] md:text-xs">Premium Botanika To'plami</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                     {db.products.filter(p => p.is_active).map(p => (
                       <ProductCard key={p.id} product={p} categories={db.categories} onAdd={addToCart} />
                     ))}
                   </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={db.products} />} />
              
              <Route path="/about" element={
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-10 md:space-y-16">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black uppercase">{db.about.title[lang]}</h1>
                    <div className="w-16 md:w-24 h-1.5 gradient-mint mx-auto rounded-full" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="relative order-2 md:order-1">
                      <div className="absolute -inset-4 gradient-mint rounded-[2.5rem] md:rounded-[3.5rem] blur-lg opacity-20" />
                      <img src={db.about.image} className="relative rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full" alt="About" />
                    </div>
                    <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium order-1 md:order-2">
                      {db.about.content[lang]}
                    </p>
                  </div>
                </div>
              } />

              <Route path="/contact" element={<ContactPage companyInfo={db.companyInfo} />} />
              <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} onUpdateQty={updateCartQuantity} promoCodes={db.promoCodes} />} />
              <Route path="/admin" element={<AdminPanel db={db} onUpdate={setDb} />} />
            </Routes>
          </main>

          {toast && (
            <div className="fixed top-16 md:top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500 ease-out px-4 w-full max-w-sm">
              <div className="bg-white/90 dark:bg-brand-dark/90 backdrop-blur-xl border border-brand-mint/30 px-6 md:px-10 py-3 md:py-4 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-3 md:gap-4 font-black">
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 gradient-mint rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                  <CheckCircle size={18} />
                </div>
                <span className="text-brand-dark dark:text-white uppercase tracking-wider text-[10px] md:text-sm truncate">{toast}</span>
              </div>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

const ContactPage = ({ companyInfo }: { companyInfo: CompanyInfo }) => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendContactToTelegram({ ...form, language: lang });
    if (success) {
      showToast(t.contact.success);
      setForm({ name: '', phone: '', message: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-20 grid lg:grid-cols-2 gap-10 md:gap-16">
      <div className="space-y-6 md:space-y-8">
         <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Biz bilan <br /><span className="text-gradient">bog'laning</span></h1>
         <p className="text-sm md:text-lg opacity-60">Savollaringiz bormi? Biz doimo yordamga tayyormiz.</p>
         <div className="space-y-4 md:space-y-6 pt-4 md:pt-6">
            <div className="flex items-center gap-4 md:gap-6">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-mint/10 text-brand-mint rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Phone size={20} />
               </div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40">Telefon</p>
                  <p className="text-lg md:text-xl font-bold">{companyInfo.phone}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-mint/10 text-brand-mint rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Globe2 size={20} />
               </div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40">Manzil</p>
                  <p className="text-lg md:text-xl font-bold leading-tight">{companyInfo.address[lang]}</p>
               </div>
            </div>
         </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-4 md:space-y-6 h-fit">
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder={t.contact.name} />
        <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder={t.contact.phone} />
        <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold h-32 md:h-40 text-brand-dark dark:text-white" placeholder={t.contact.message} />
        <button className="w-full py-4 md:py-5 gradient-mint text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
          {t.contact.send}
        </button>
      </form>
    </div>
  );
};

const CartPage = ({ cart, setCart, onUpdateQty, promoCodes = [] }: { cart: any, setCart: any, onUpdateQty: any, promoCodes: GlobalPromoCode[] }) => {
  const { t, lang, showToast } = useContext(LanguageContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<GlobalPromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((s: number, i: any) => s + getEffectivePrice(i.product) * i.quantity, 0);
  
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'PERCENT') {
      return (subtotal * appliedPromo.value) / 100;
    }
    return appliedPromo.value;
  };

  const total = Math.max(0, subtotal - calculateDiscount());

  const handleApplyPromo = () => {
    setPromoError(null);
    const inputCode = promoInput.trim().toUpperCase();
    if (!inputCode) return;

    // 1. Find the code
    const code = (promoCodes || []).find((p: GlobalPromoCode) => p.code.trim().toUpperCase() === inputCode);
    
    if (!code) {
      setPromoError(t.cart.promoErrorNotFound);
      setAppliedPromo(null);
      return;
    }

    // 2. Check if active
    if (!code.is_active) {
      setPromoError(t.cart.promoErrorInactive);
      setAppliedPromo(null);
      return;
    }

    // 3. Check expiry
    const now = getUzbekistanTime();
    const expiryDate = new Date(code.expiry_date);
    if (now > expiryDate) {
      setPromoError(t.cart.promoErrorExpired);
      setAppliedPromo(null);
      return;
    }

    // 4. Check minimum order amount
    if (subtotal < code.min_amount) {
      const msg = t.cart.promoErrorMinAmount.replace('{amount}', code.min_amount.toLocaleString());
      setPromoError(msg);
      setAppliedPromo(null);
      return;
    }

    // 5. Success
    setAppliedPromo(code);
    setPromoError(null);
    showToast(t.cart.promoSuccess);
  };

  const handleCheckout = async () => {
    const success = await sendOrderToTelegram({
      firstName,
      lastName,
      customerPhone: phone,
      comment,
      items: cart,
      totalPrice: total,
      language: lang,
      appliedPromo: appliedPromo?.code,
      discountAmount: calculateDiscount()
    });
    if (success) {
      setCart([]);
      showToast(lang === 'uz' ? "Buyurtmangiz qabul qilindi!" : "Your order has been received!");
    }
  };

  if (cart.length === 0) return (
    <div className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center space-y-6 md:space-y-8 animate-in fade-in zoom-in px-6 text-center">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300">
        <ShoppingBag className="w-12 h-12 md:w-16 md:h-16" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-gray-400">{t.cart.empty}</h2>
      <Link to="/products" className="gradient-mint text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs">Do'konga qaytish</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20 grid lg:grid-cols-2 gap-10 md:gap-16">
      <div className="space-y-6 md:space-y-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{t.cart.title}</h2>
        <div className="space-y-4">
          {cart.map((item: any) => {
            const currentPrice = getEffectivePrice(item.product);
            return (
              <div key={item.product.id} className="flex gap-4 md:gap-6 items-center bg-white dark:bg-white/5 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 group relative">
                <img src={item.product.image} className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover shadow-md" />
                <div className="flex-1 space-y-1 md:space-y-2">
                  <h4 className="text-lg md:text-xl font-black leading-tight">{item.product.translations[lang].name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                    <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-lg md:rounded-xl p-1 w-fit">
                      <button onClick={() => onUpdateQty(item.product.id, -1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md md:rounded-lg bg-white dark:bg-white/10 text-brand-dark dark:text-white">
                        <Minus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </button>
                      <span className="w-8 md:w-10 text-center font-black text-sm md:text-base">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.product.id, 1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md md:rounded-lg bg-white dark:bg-white/10 text-brand-dark dark:text-white">
                        <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                    <span className="text-brand-mint font-bold text-sm md:text-base">{(currentPrice * item.quantity).toLocaleString()} {item.product.currency}</span>
                  </div>
                </div>
                <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors">
                  <Trash2 className="w-4.5 h-4.5 md:w-5 md:h-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
          <label className="text-xs font-black uppercase opacity-40 ml-2">{t.cart.promoLabel}</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input 
                value={promoInput} 
                onChange={e => {
                  setPromoInput(e.target.value);
                  if (promoError) setPromoError(null);
                }} 
                className={`w-full p-4 rounded-xl bg-gray-50 dark:bg-white/10 outline-none font-bold uppercase tracking-widest border transition-all ${promoError ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/5' : 'border-transparent focus:border-brand-mint'}`} 
                placeholder="PROMO2025" 
              />
              {promoError && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-[10px] text-rose-500 font-bold animate-in slide-in-from-top-1">
                  <AlertCircle size={10} /> {promoError}
                </div>
              )}
            </div>
            <button 
              onClick={handleApplyPromo}
              className="px-6 py-4 gradient-mint text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              {t.cart.promoApply}
            </button>
          </div>
          {appliedPromo && (
            <div className="flex items-center justify-between p-3 bg-brand-mint/10 rounded-xl border border-brand-mint/20 text-brand-mint animate-in zoom-in duration-300">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-brand-mint/20 rounded-lg flex items-center justify-center">
                    <Tag size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase opacity-60">{t.cart.promoLabel}</span>
                    <span className="text-sm font-black uppercase tracking-widest">{appliedPromo.code}</span>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-sm font-black bg-brand-mint text-white px-2 py-1 rounded-md">-{appliedPromo.type === 'PERCENT' ? `${appliedPromo.value}%` : `${appliedPromo.value.toLocaleString()} so'm`}</span>
                 <button onClick={() => { setAppliedPromo(null); setPromoInput(''); }} className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors">
                   <X size={16} />
                 </button>
               </div>
            </div>
          )}
        </div>

        <div className="pt-6 md:pt-8 space-y-4 bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
           <div className="flex justify-between items-center text-sm font-bold opacity-40">
             <span>{t.cart.subtotal}:</span>
             <span>{subtotal.toLocaleString()} {cart[0]?.product.currency}</span>
           </div>
           {appliedPromo && (
             <div className="flex justify-between items-center text-sm font-bold text-rose-500">
               <span className="flex items-center gap-2"><Tag size={14} /> {t.cart.promoDiscount}:</span>
               <span>-{calculateDiscount().toLocaleString()} {cart[0]?.product.currency}</span>
             </div>
           )}
           <div className="flex justify-between items-center border-t border-gray-200 dark:border-white/10 pt-4">
              <span className="text-lg md:text-xl font-bold">{t.cart.total}:</span>
              <span className="text-2xl md:text-4xl font-black text-brand-mint">{total.toLocaleString()} <span className="text-xs md:text-sm">{cart[0]?.product.currency}</span></span>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 h-fit space-y-6 md:space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl md:text-3xl font-black uppercase">Buyurtma berish</h3>
          <p className="text-[10px] md:text-sm opacity-50 font-bold">Ma'lumotlaringizni to'ldiring, biz siz bilan bog'lanamiz.</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder="Ism" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder="Familiya" />
          </div>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder="+998" />
          <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold h-24 text-brand-dark dark:text-white" placeholder="Izoh (ixtiyoriy)" />
        </div>
        <button 
          onClick={handleCheckout}
          disabled={!firstName || !lastName || !phone}
          className="w-full py-4 md:py-5 gradient-mint text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Buyurtmani tasdiqlash
        </button>
      </div>
    </div>
  );
};
