
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Menu, X, Sparkles, 
  Globe2, Phone, CheckCircle, Trash2, AlertCircle, Tag, LogIn, Heart
} from 'lucide-react';
import { Product, Language, Database, CompanyInfo, PromoCode, OrderData, User } from './types';
import { translations } from './locales';
import { getDb, initDatabase } from './services/dbService';
import { orderService } from './services/orderService';
import { sendContactToTelegram } from './services/telegram';
import SimoshAI from './components/SimoshAI';
import AdminPanel from './components/AdminPanel';

type ToastType = 'success' | 'warning' | 'error';

const getPrice = (product: Product): number => {
  if (product.discount && product.discount.active) {
    const now = new Date();
    const start = new Date(product.discount.start_date);
    const end = new Date(product.discount.end_date);
    if (now >= start && now <= end) {
      return product.discount.discountedPrice;
    }
  }
  return product.price;
};

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

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('uz');
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [toast, setToast] = useState<{ msg: string, type: ToastType } | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const currentDb = await getDb();
      setDb(currentDb);
    } catch (err: any) {
      setError("MongoDB ma'lumotlarini yuklashda xatolik: " + err.message);
    }
  }, []);

  useEffect(() => {
    const startApp = async () => {
      try {
        setIsLoading(true);
        await initDatabase();
        await refreshData();
      } catch (err: any) {
        setError("MongoDB ulanishi muvaffaqiyatsiz: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    startApp();
  }, [refreshData]);

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product, quantity: number) => {
    if (product.stock <= 0) {
      showToast("Mahsulot qolmagan!", 'warning');
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i);
      return [...prev, { product, quantity }];
    });
    showToast(translations[lang].cart.added);
  };

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 text-center bg-brand-light dark:bg-brand-dark">
      <AlertCircle size={64} className="text-rose-500 mb-6" />
      <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-4 uppercase">Database Error</h1>
      <p className="text-rose-600 font-bold max-w-md">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 gradient-mint text-white rounded-full font-black uppercase shadow-xl">Qayta urinish</button>
    </div>
  );

  if (isLoading || !db) return (
    <div className="h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark space-y-4">
      <div className="w-12 h-12 border-4 border-brand-mint border-t-transparent rounded-full animate-spin" />
      <p className="font-black uppercase text-brand-mint tracking-widest text-sm">Simosh Yuklanmoqda...</p>
    </div>
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast }}>
      <Router>
        <AppContent 
          db={db} cart={cart} setCart={setCart} 
          refreshData={refreshData} addToCart={addToCart} 
          toast={toast} adminUser={adminUser} setAdminUser={setAdminUser} 
        />
      </Router>
    </LanguageContext.Provider>
  );
}

const AppContent = ({ db, cart, setCart, refreshData, addToCart, toast, adminUser, setAdminUser }: any) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const { isDark } = useContext(LanguageContext);

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className={`min-h-screen ${isAdminPath ? 'bg-gray-50 dark:bg-[#070b14]' : 'bg-brand-light dark:bg-brand-dark'} transition-colors`}>
        {!isAdminPath && <Navigation cartCount={cart.reduce((a: any, b: any) => a + b.quantity, 0)} db={db} />}
        <main className={`${isAdminPath ? '' : 'pt-24'}`}>
          <Routes>
            <Route path="/" element={<HomeView db={db} />} />
            <Route path="/products" element={<ProductsView db={db} onAdd={addToCart} />} />
            <Route path="/about" element={<AboutView db={db} />} />
            <Route path="/contact" element={<ContactView companyInfo={db.companyInfo} />} />
            <Route path="/ai" element={<SimoshAI products={db.products} />} />
            <Route path="/cart" element={<CartView cart={cart} setCart={setCart} db={db} onOrder={refreshData} />} />
            <Route path="/admin/*" element={<AdminPanel db={db} onUpdate={refreshData} adminUser={adminUser} setAdminUser={setAdminUser} />} />
          </Routes>
        </main>
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-md animate-in slide-in-from-top-10">
            <div className={`bg-white dark:bg-brand-dark border shadow-2xl ${toast.type === 'error' ? 'border-rose-500' : 'border-brand-mint'} px-6 py-4 rounded-3xl flex items-center gap-4`}>
              {toast.type === 'success' ? <CheckCircle className="text-brand-mint" /> : <AlertCircle className="text-rose-500" />}
              <span className="font-bold text-sm text-brand-dark dark:text-white uppercase">{toast.msg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Navigation = ({ cartCount, db }: { cartCount: number, db: Database }) => {
  const { lang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
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
            <div className="w-10 h-10 bg-white dark:bg-brand-dark rounded-full flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
               <img src={db.companyInfo.logo} className="w-6 h-6 object-contain" alt="Logo" />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-dark dark:text-white uppercase">{db.companyInfo.name}</span>
          </Link>
          <div className="hidden lg:flex items-center gap-2">
            {menu.map(item => (
              <Link key={item.path} to={item.path} className={`px-5 py-2 rounded-full text-[13px] font-bold uppercase transition-all ${location.pathname === item.path ? 'nav-active' : 'text-gray-500 hover:text-brand-mint'}`}>{item.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-mint">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="relative w-10 h-10 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark shadow-lg">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-dark dark:text-white"><Menu size={20} /></button>
          </div>
        </div>
      </nav>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-white dark:bg-brand-dark p-10 flex flex-col gap-8 shadow-2xl">
            <div className="flex justify-between items-center">
               <span className="text-2xl font-black text-brand-mint uppercase">{db.companyInfo.name}</span>
               <X onClick={() => setIsOpen(false)} />
            </div>
            {menu.map(item => (
              <Link key={item.path} to={item.path} className="text-2xl font-black uppercase text-gray-400" onClick={() => setIsOpen(false)}>{item.label}</Link>
            ))}
            <Link to="/admin" className="mt-auto flex items-center gap-2 text-brand-mint font-bold uppercase text-xs" onClick={() => setIsOpen(false)}><LogIn size={16} /> Admin</Link>
          </div>
        </div>
      )}
    </>
  );
};

const HomeView = ({ db }: { db: Database }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
      <div className="space-y-8 animate-in slide-in-from-left-20 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest"><Heart size={14} fill="currentColor" /> Premium & Tabiiy</div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-brand-dark dark:text-white uppercase">{t.home.heroTitle}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">{db.companyInfo.description[lang]}</p>
        <div className="flex gap-4">
          <Link to="/products" className="gradient-mint text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl">Sotib olish</Link>
          <Link to="/ai" className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-2 text-brand-dark dark:text-white">Simosh AI <Sparkles className="text-brand-mint" size={18} /></Link>
        </div>
      </div>
      <div className="hidden lg:block animate-in zoom-in duration-1000">
        <img src={db.products[0]?.image} className="rounded-[4rem] shadow-2xl w-full aspect-square object-cover" alt="Hero" />
      </div>
    </section>
  );
};

const ProductsView = ({ db, onAdd }: { db: Database, onAdd: any }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-5xl font-black uppercase mb-16 text-brand-dark dark:text-white tracking-tighter">Sovunlar Atelyesi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {db.products.filter(p => p.status === 'ACTIVE').map(p => (
          <div key={p.id} className="group product-card bg-white dark:bg-white/5 p-6 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl space-y-4">
             <div className="relative rounded-[2.5rem] overflow-hidden">
                <img src={p.image} className="w-full aspect-[4/5] object-cover" alt={p.translations[lang].name} />
                {p.stock <= 0 && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white font-black uppercase">Tugagan</div>}
             </div>
             <h3 className="text-2xl font-black text-brand-dark dark:text-white uppercase">{p.translations[lang].name}</h3>
             <p className="text-sm opacity-50 line-clamp-2 text-brand-dark dark:text-white">{p.translations[lang].description}</p>
             <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-2xl font-black text-brand-mint">{getPrice(p).toLocaleString()} UZS</span>
                <button onClick={() => onAdd(p, 1)} disabled={p.stock <= 0} className="w-12 h-12 gradient-mint text-white rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-20"><Plus /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutView = ({ db }: { db: Database }) => {
  const { lang } = useContext(LanguageContext);
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <img src={db.about.image} className="rounded-[3rem] shadow-2xl w-full" alt="About" />
      <div className="space-y-6">
        <h1 className="text-6xl font-black uppercase leading-tight text-brand-dark dark:text-white tracking-tighter">{db.about.title[lang]}</h1>
        <p className="text-xl text-gray-500 leading-relaxed font-medium">{db.about.content[lang]}</p>
      </div>
    </div>
  );
};

const ContactView = ({ companyInfo }: { companyInfo: CompanyInfo }) => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const success = await sendContactToTelegram({...form, language: lang});
    if (success) { 
      showToast(t.contact.success); 
      setForm({ name: '', phone: '', message: '' }); 
    } else {
      showToast("Xabar yuborishda xatolik", 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 text-brand-dark dark:text-white">
       <div className="space-y-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Biz bilan bog'laning</h1>
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center"><Phone size={18} /></div>
               <p className="text-xl font-bold">{companyInfo.phone}</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center"><Globe2 size={18} /></div>
               <p className="text-lg font-bold opacity-50">{companyInfo.address[lang]}</p>
            </div>
          </div>
       </div>
       <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl space-y-4">
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Ismingiz" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Telefon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white h-40" placeholder="Xabar..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all">Yuborish</button>
       </form>
    </div>
  );
};

const CartView = ({ cart, setCart, db, onOrder }: { cart: any, setCart: any, db: Database, onOrder: () => void }) => {
  const { t, lang, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', comment: '' });
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const subtotal = cart.reduce((s: number, i: any) => s + getPrice(i.product) * i.quantity, 0);
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'PERCENT') return (subtotal * appliedPromo.discountValue) / 100;
    return appliedPromo.discountValue;
  };
  const total = Math.max(0, subtotal - calculateDiscount());

  const handleApplyPromo = () => {
    const promo = db.promoCodes.find(p => p.code.toUpperCase() === promoInput.toUpperCase() && p.status === 'ACTIVE');
    if (!promo) { showToast(t.cart.promoErrorNotFound, 'error'); return; }
    setAppliedPromo(promo);
    showToast(t.cart.promoSuccess);
  };

  const handleCheckout = async () => {
    if (!form.firstName || !form.phone) { showToast("Ism va telefon raqam shart!", 'warning'); return; }
    const order: OrderData = {
      id: Date.now().toString(),
      firstName: form.firstName,
      lastName: form.lastName,
      customerPhone: form.phone,
      comment: form.comment,
      items: cart,
      totalPrice: total,
      language: lang,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      appliedPromo: appliedPromo?.code,
      discountAmount: calculateDiscount()
    };
    try {
      const success = await orderService.create(order);
      if (success) { 
        onOrder(); 
        setCart([]); 
        showToast("Buyurtmangiz qabul qilindi!", 'success'); 
      }
    } catch (e: any) {
      showToast("Xatolik: " + e.message, 'error');
    }
  };

  if (cart.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
      <ShoppingBag size={80} className="text-gray-200" />
      <h2 className="text-3xl font-black uppercase text-brand-dark dark:text-white">Savat bo'sh</h2>
      <Link to="/products" className="gradient-mint text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs">Xaridni boshlash</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-16 text-brand-dark dark:text-white">
      <div className="space-y-6">
        <h2 className="text-4xl font-black uppercase">Savatcha</h2>
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.product.id} className="flex gap-4 items-center bg-white dark:bg-white/5 p-4 rounded-3xl shadow-sm">
              <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-black uppercase">{item.product.translations[lang].name}</h4>
                <p className="text-brand-mint font-black">{(getPrice(item.product) * item.quantity).toLocaleString()} UZS</p>
                <p className="text-[10px] opacity-40 font-bold">{item.quantity} dona</p>
              </div>
              <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="text-rose-500 p-2"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl space-y-4 shadow-sm border border-gray-100 dark:border-white/5">
           <div className="flex gap-2">
              <input value={promoInput} onChange={e => setPromoInput(e.target.value)} className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold uppercase text-xs" placeholder="PROMO" />
              <button onClick={handleApplyPromo} className="px-6 py-4 gradient-mint text-white rounded-2xl font-black uppercase text-[10px]">Qo'llash</button>
           </div>
           {appliedPromo && <div className="text-brand-mint font-bold text-[10px] uppercase">Kod qo'llanildi: {appliedPromo.code}</div>}
        </div>
        <div className="p-8 bg-brand-dark text-white rounded-[2.5rem] shadow-2xl">
           <div className="flex justify-between border-b border-white/10 pb-4 mb-4 font-bold opacity-50 uppercase text-xs"><span>Summa:</span><span>{subtotal.toLocaleString()} UZS</span></div>
           <div className="flex justify-between items-center">
             <span className="text-xl font-black uppercase">Jami:</span>
             <span className="text-4xl font-black text-brand-mint">{total.toLocaleString()} UZS</span>
           </div>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] shadow-2xl space-y-6 h-fit border border-gray-100 dark:border-white/5">
        <h3 className="text-2xl font-black uppercase">Buyurtma Ma'lumotlari</h3>
        <div className="space-y-4">
          <input required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-sm" placeholder="Ismingiz" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-sm" placeholder="Telefon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-sm h-32" placeholder="Izoh..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} />
        </div>
        <button onClick={handleCheckout} className="w-full py-5 gradient-mint text-white rounded-3xl font-black uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl">Tasdiqlash</button>
      </div>
    </div>
  );
};
