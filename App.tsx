
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Minus, ArrowRight, Leaf, 
  Menu, X, Sparkles, Globe2, Phone, CheckCircle, Trash2, AlertCircle, ChevronDown
} from 'lucide-react';
import { INITIAL_DB } from './constants';
import { Product, Language, Database, CompanyInfo, GlobalPromoCode, Category, OrderData } from './types';
import { translations } from './locales';
import { sendOrderToTelegram, sendContactToTelegram } from './services/telegram';
import SimoshAI from './components/SimoshAI';
import AdminPanel from './components/AdminPanel';

type ToastType = 'success' | 'warning' | 'error';

export const LanguageContext = createContext<{ 
  lang: Language, 
  setLang: (l: Language) => void, 
  t: any,
  isDark: boolean,
  toggleTheme: () => void,
  showToast: (msg: string, type?: ToastType) => void
}>({
  lang: 'uz',
  setLang: () => {},
  t: translations.uz,
  isDark: false,
  toggleTheme: () => {},
  showToast: () => {}
});

const flags: Record<Language, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇺🇸',
  tr: '🇹🇷'
};

const getEffectivePrice = (product: Product) => {
  const now = new Date();
  if (product.discount) {
    const start = new Date(product.discount.start_date);
    const end = new Date(product.discount.end_date);
    if (now >= start && now <= end) {
      if (product.discount.type === 'PERCENT') {
        return product.price * (1 - product.discount.value / 100);
      }
      return Math.max(0, product.price - product.discount.value);
    }
  }
  return product.price;
};

const ProductCard = ({ product, categories, onAdd }: { product: Product, categories: Category[], onAdd: (p: Product, q: number) => void }) => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const effectivePrice = getEffectivePrice(product);
  const categoryName = categories.find(c => c.id === product.categoryId)?.name[lang] || "---";

  const handleAddClick = () => {
    onAdd(product, quantity);
    setIsConfiguring(false);
    setQuantity(1);
  };

  return (
    <div className="product-card bg-white dark:bg-white/5 p-5 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden flex flex-col h-full group">
      <div className={`absolute inset-x-0 bottom-0 z-20 p-6 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-xl border-t border-brand-mint/20 rounded-t-[2.5rem] transition-all duration-500 ease-out transform ${isConfiguring ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-mint">{t.cart.title}</span>
          <button onClick={() => setIsConfiguring(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-rose-500 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm"><Minus size={18} /></button>
            <span className="text-2xl font-black">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm"><Plus size={18} /></button>
          </div>
          <button onClick={handleAddClick} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
            <ShoppingBag size={18} /> {t.cart.add}
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6">
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.translations[lang].name} />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-dark/90 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          {categoryName}
        </div>
      </div>
      
      <div className="space-y-4 flex-1 flex flex-col">
        <h3 className="text-2xl font-black leading-tight">{product.translations[lang].name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">{product.translations[lang].description}</p>
        <div className="flex flex-col border-t border-gray-50 dark:border-white/5 pt-3">
          <span className="text-2xl font-black text-brand-mint">{effectivePrice.toLocaleString()} <span className="text-xs uppercase">{product.currency}</span></span>
        </div>
        <button onClick={() => setIsConfiguring(true)} className="w-full py-4 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-[10px]">
          {t.cart.checkout}
        </button>
      </div>
    </div>
  );
};

const Navigation = ({ cartCount, db }: { cartCount: number, db: Database }) => {
  const { lang, setLang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.ai, path: '/ai' }
  ];

  return (
    <>
      <nav className="fixed top-6 left-0 w-full z-50 px-4">
        <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-xl py-3 px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white dark:bg-brand-dark rounded-full flex items-center justify-center shadow-lg overflow-hidden">
               <img src={db.companyInfo.logo} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-dark dark:text-white uppercase">SIMOSH</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-full">
            {menu.map(item => (
              <Link key={item.path} to={item.path} className={`px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all ${location.pathname === item.path ? 'nav-active' : 'text-gray-500 hover:text-brand-mint'}`}>{item.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-mint">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative hidden md:block">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="h-10 flex items-center gap-2 px-3 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-black uppercase">
                <span className="text-base">{flags[lang]}</span>
                <ChevronDown size={14} className={isLangOpen ? 'rotate-180' : ''} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-brand-dark border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-10">
                  {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                    <button key={l} onClick={() => { setLang(l); setIsLangOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black uppercase ${lang === l ? 'bg-brand-mint/10 text-brand-mint' : ''}`}>
                      <span className="text-lg">{flags[l]}</span> {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/cart" className="relative w-10 h-10 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingBag size={16} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark shadow-lg">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full"><Menu size={18} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-4/5 bg-white dark:bg-brand-dark shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black text-brand-mint uppercase">SIMOSH</span>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {menu.map(item => (
                <Link key={item.path} to={item.path} className="text-2xl font-black uppercase tracking-widest text-gray-400" onClick={() => setIsOpen(false)}>{item.label}</Link>
              ))}
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
    return saved ? JSON.parse(saved) : INITIAL_DB;
  });

  const [lang, setLang] = useState<Language>('uz');
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [toast, setToast] = useState<{ msg: string, type: ToastType } | null>(null);

  useEffect(() => {
    localStorage.setItem('simosh_db', JSON.stringify(db));
  }, [db]);

  const showToast = (msg: string, type: ToastType = 'success') => setToast({ msg, type });

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i);
      return [...prev, { product, quantity }];
    });
    showToast(translations[lang].cart.added);
  };

  const updateOrder = (newDb: Database) => setDb(newDb);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast }}>
      <Router>
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
          <div className="bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-white transition-colors duration-500 flex flex-col min-h-screen">
            <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} db={db} />
            <main className="pt-24 flex-1">
              <Routes>
                <Route path="/" element={<HomeView db={db} />} />
                <Route path="/products" element={<ProductsView db={db} onAdd={addToCart} />} />
                <Route path="/about" element={<AboutView db={db} />} />
                <Route path="/contact" element={<ContactView companyInfo={db.companyInfo} />} />
                <Route path="/ai" element={<SimoshAI products={db.products} />} />
                <Route path="/cart" element={<CartView cart={cart} setCart={setCart} db={db} onOrder={(order) => setDb({ ...db, orders: [...(db.orders || []), order] })} />} />
                <Route path="/admin" element={<AdminPanel db={db} onUpdate={updateOrder} />} />
              </Routes>
            </main>
            {toast && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-lg animate-in slide-in-from-top-10">
                <div className={`bg-white/95 dark:bg-brand-dark/95 backdrop-blur-2xl border shadow-2xl ${toast.type === 'warning' ? 'border-amber-500/50' : 'border-brand-mint/30'} px-8 py-4 rounded-full flex items-center gap-5 font-black`}>
                  <div className={`w-12 h-12 shrink-0 ${toast.type === 'warning' ? 'bg-amber-500' : 'gradient-mint'} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    {toast.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
                  </div>
                  <span className="flex-1 uppercase tracking-wider text-[13px]">{toast.msg}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

const HomeView = ({ db }: { db: Database }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest">
          <Leaf size={14} /> 100% Organik
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
          {t.home.heroTitle}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg">{db.companyInfo.description[lang]}</p>
        <div className="flex gap-4">
          <Link to="/products" className="gradient-mint text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
            {t.home.viewProducts} <ArrowRight size={18} className="inline ml-2" />
          </Link>
        </div>
      </div>
      <div className="hidden lg:block relative">
        <div className="absolute -inset-10 bg-brand-mint/10 rounded-full blur-[100px]" />
        <img src={db.products[0]?.image} className="relative rounded-[3rem] shadow-2xl w-full aspect-square object-cover border border-white/20" alt="Hero" />
      </div>
    </section>
  );
};

const ProductsView = ({ db, onAdd }: { db: Database, onAdd: any }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-5xl font-black uppercase mb-12">{t.nav.products}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {db.products.filter(p => p.is_active).map(p => (
          <ProductCard key={p.id} product={p} categories={db.categories} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
};

const AboutView = ({ db }: { db: Database }) => {
  const { lang } = useContext(LanguageContext);
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
      <h1 className="text-6xl font-black uppercase text-center">{db.about.title[lang]}</h1>
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <img src={db.about.image} className="rounded-[3rem] shadow-2xl w-full" alt="About" />
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{db.about.content[lang]}</p>
      </div>
    </div>
  );
};

const ContactView = ({ companyInfo }: { companyInfo: CompanyInfo }) => {
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
    <div className="max-w-4xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
      <div className="space-y-8">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Bog'laning</h1>
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center"><Phone size={20} /></div>
            <div><p className="text-xl font-bold">{companyInfo.phone}</p></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center"><Globe2 size={20} /></div>
            <div><p className="text-xl font-bold">{companyInfo.address[lang]}</p></div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6 h-fit">
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder={t.contact.name} />
        <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder={t.contact.phone} />
        <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold h-40" placeholder={t.contact.message} />
        <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Yuborish</button>
      </form>
    </div>
  );
};

const CartView = ({ cart, setCart, db, onOrder }: { cart: any, setCart: any, db: Database, onOrder: (o: OrderData) => void }) => {
  const { t, lang, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', comment: '' });

  const subtotal = cart.reduce((s: number, i: any) => s + getEffectivePrice(i.product) * i.quantity, 0);

  const handleCheckout = async () => {
    const order: OrderData = {
      id: Date.now().toString(),
      firstName: form.firstName,
      lastName: form.lastName,
      customerPhone: form.phone,
      comment: form.comment,
      items: cart,
      totalPrice: subtotal,
      language: lang,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const success = await sendOrderToTelegram(order);
    if (success) {
      onOrder(order);
      setCart([]);
      showToast("Buyurtmangiz qabul qilindi!");
    }
  };

  if (cart.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
      <ShoppingBag className="w-24 h-24 text-gray-200" />
      <h2 className="text-4xl font-black text-gray-300 uppercase">{t.cart.empty}</h2>
      <Link to="/products" className="gradient-mint text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm">Xarid qilish</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
      <div className="space-y-8">
        <h2 className="text-4xl font-black uppercase">{t.cart.title}</h2>
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.product.id} className="flex gap-6 items-center bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
              <img src={item.product.image} className="w-24 h-24 rounded-2xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="text-xl font-black">{item.product.translations[lang].name}</h4>
                <p className="text-brand-mint font-bold">{(getEffectivePrice(item.product) * item.quantity).toLocaleString()} UZS</p>
                <p className="text-xs opacity-50">Soni: {item.quantity}</p>
              </div>
              <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="text-rose-500"><Trash2 /></button>
            </div>
          ))}
        </div>
        <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
           <div className="flex justify-between items-center"><span className="text-xl font-bold">{t.cart.total}:</span><span className="text-4xl font-black text-brand-mint">{subtotal.toLocaleString()} UZS</span></div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 h-fit">
        <h3 className="text-3xl font-black uppercase">Ma'lumotlar</h3>
        <div className="space-y-4">
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Ism" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Familiya" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Telefon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold h-32" placeholder="Izoh" value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} />
        </div>
        <button onClick={handleCheckout} disabled={!form.firstName || !form.phone} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-20">Buyurtma berish</button>
      </div>
    </div>
  );
};
