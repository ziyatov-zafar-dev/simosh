
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Menu, X, Sparkles, 
  Globe2, Phone, CheckCircle, Trash2, AlertCircle, Tag, LogIn, Heart
} from 'lucide-react';
import { Product, Language, Database, CompanyInfo, PromoCode, OrderData } from './types';
import { translations } from './locales';
import { getDb } from './services/dbService';
import { orderService } from './services/orderService';
// Fix: Added missing import for telegram service
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
  const [lang, setLang] = useState<Language>('uz');
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [toast, setToast] = useState<{ msg: string, type: ToastType } | null>(null);

  const refreshData = useCallback(async () => {
    const currentDb = await getDb();
    setDb(currentDb);
  }, []);

  useEffect(() => {
    refreshData().then(() => setIsLoading(false));
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

  if (isLoading || !db) return (
    <div className="h-screen flex items-center justify-center font-black uppercase text-brand-mint animate-pulse bg-brand-light dark:bg-brand-dark">
      Simosh Atelier...
    </div>
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast }}>
      <Router>
        <AppContent db={db} cart={cart} setCart={setCart} refreshData={refreshData} addToCart={addToCart} toast={toast} />
      </Router>
    </LanguageContext.Provider>
  );
}

const AppContent = ({ db, cart, setCart, refreshData, addToCart, toast }: any) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const { isDark } = useContext(LanguageContext);

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className={`min-h-screen ${isAdminPath ? 'bg-gray-50 dark:bg-[#070b14]' : 'bg-brand-light dark:bg-brand-dark'} transition-colors duration-500`}>
        {!isAdminPath && <Navigation cartCount={cart.reduce((a: any, b: any) => a + b.quantity, 0)} db={db} />}
        <main className={`${isAdminPath ? '' : 'pt-24'} flex-1`}>
          <Routes>
            <Route path="/" element={<HomeView db={db} />} />
            <Route path="/products" element={<ProductsView db={db} onAdd={addToCart} />} />
            <Route path="/about" element={<AboutView db={db} />} />
            <Route path="/contact" element={<ContactView companyInfo={db.companyInfo} />} />
            <Route path="/ai" element={<SimoshAI products={db.products} />} />
            <Route path="/cart" element={<CartView cart={cart} setCart={setCart} db={db} onOrder={refreshData} />} />
            <Route path="/admin/*" element={<AdminPanel db={db} onUpdate={refreshData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-lg">
            <div className={`bg-white/95 dark:bg-brand-dark/95 backdrop-blur-2xl border shadow-2xl ${toast.type === 'warning' ? 'border-amber-500/50' : toast.type === 'error' ? 'border-rose-500/50' : 'border-brand-mint/30'} px-8 py-4 rounded-full flex items-center gap-5 font-black`}>
              <div className={`w-10 h-10 shrink-0 ${toast.type === 'warning' ? 'bg-amber-500' : toast.type === 'error' ? 'bg-rose-500' : 'gradient-mint'} rounded-full flex items-center justify-center text-white shadow-lg`}>
                {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <span className="flex-1 uppercase tracking-wider text-[12px] text-brand-dark dark:text-white">{toast.msg}</span>
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
        <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-xl py-3 px-6 flex items-center justify-between border border-white/20 dark:border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white dark:bg-brand-dark rounded-full flex items-center justify-center shadow-lg overflow-hidden border border-gray-100 dark:border-white/5">
               <img src={db.companyInfo.logo} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-dark dark:text-white uppercase">{db.companyInfo.name}</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full">
            {menu.map(item => (
              <Link key={item.path} to={item.path} className={`px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all ${location.pathname === item.path ? 'nav-active' : 'text-gray-500 hover:text-brand-mint'}`}>{item.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-mint">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="relative w-10 h-10 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark shadow-xl animate-bounce">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-dark dark:text-white"><Menu size={20} /></button>
          </div>
        </div>
      </nav>
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-4/5 bg-white dark:bg-brand-dark shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black text-brand-mint uppercase">{db.companyInfo.name}</span>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-dark dark:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {menu.map(item => (
                <Link key={item.path} to={item.path} className="text-2xl font-black uppercase tracking-widest text-gray-400" onClick={() => setIsOpen(false)}>{item.label}</Link>
              ))}
              <Link to="/admin" className="mt-auto flex items-center gap-2 text-brand-mint font-black uppercase text-sm tracking-widest" onClick={() => setIsOpen(false)}><LogIn size={18} /> Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HomeView = ({ db }: { db: Database }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
      <div className="space-y-8 animate-in slide-in-from-left-20 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest"><Heart size={14} className="fill-brand-mint" /> 100% Organik & Tabiiy</div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-brand-dark dark:text-white uppercase">{t.home.heroTitle}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">{db.companyInfo.description[lang]}</p>
        <div className="flex gap-4">
          <Link to="/products" className="gradient-mint text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">Sotib olish</Link>
          <Link to="/ai" className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-brand-dark dark:text-white">Simosh AI <Sparkles className="text-brand-mint" size={18} /></Link>
        </div>
      </div>
      <div className="hidden lg:block relative animate-in zoom-in duration-1000">
        <div className="absolute -inset-10 bg-brand-mint/10 rounded-full blur-[100px]" />
        <img src={db.products[0]?.image} className="relative rounded-[3rem] shadow-2xl w-full aspect-square object-cover" alt="" />
      </div>
    </section>
  );
};

const ProductsView = ({ db, onAdd }: { db: Database, onAdd: any }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-6xl font-black uppercase mb-16 text-brand-dark dark:text-white tracking-tighter">{t.nav.products}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {db.products.filter(p => p.status === 'ACTIVE').map(p => {
          const effectivePrice = getPrice(p);
          const hasDiscount = effectivePrice < p.price;
          return (
            <div key={p.id} className="group product-card bg-white dark:bg-white/5 p-6 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl space-y-4 hover:translate-y-[-8px] transition-all">
               <div className="relative rounded-[2rem] overflow-hidden">
                  <img src={p.image} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" alt={p.translations[lang].name} />
                  {p.stock <= 0 && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center text-white font-black uppercase text-xs">Sotilgan</div>}
                  {hasDiscount && <div className="absolute top-4 right-4 bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Chegirma!</div>}
               </div>
               <h3 className="text-2xl font-black text-brand-dark dark:text-white uppercase">{p.translations[lang].name}</h3>
               <p className="text-sm opacity-50 line-clamp-2 text-brand-dark dark:text-white">{p.translations[lang].description}</p>
               <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-4">
                  <div className="flex flex-col">
                    {hasDiscount && <span className="text-xs line-through opacity-30 font-bold text-brand-dark dark:text-white">{p.price.toLocaleString()} UZS</span>}
                    <span className="text-2xl font-black text-brand-mint">{effectivePrice.toLocaleString()} <span className="text-xs">UZS</span></span>
                  </div>
                  <button onClick={() => onAdd(p, 1)} disabled={p.stock <= 0} className="w-12 h-12 gradient-mint text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-20 transition-all"><Plus size={20} /></button>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AboutView = ({ db }: { db: Database }) => {
  const { lang } = useContext(LanguageContext);
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="absolute -inset-4 bg-brand-mint/20 rounded-[3.5rem] blur-2xl" />
        <img src={db.about.image} className="relative rounded-[3rem] shadow-2xl w-full" alt="" />
      </div>
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 text-brand-dark dark:text-white">
       <div className="space-y-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Biz bilan <br/><span className="text-brand-mint">bog'laning</span></h1>
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-xl flex items-center justify-center"><Phone size={18} /></div>
               <p className="text-xl font-bold">{companyInfo.phone}</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-xl flex items-center justify-center"><Globe2 size={18} /></div>
               <p className="text-lg font-bold opacity-50">{companyInfo.address[lang]}</p>
            </div>
          </div>
       </div>
       <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-6">
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Ismingiz" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Telefon raqamingiz" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white h-40" placeholder="Xabar..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">Yuborish</button>
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
    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) { showToast(t.cart.promoErrorMinAmount.replace('{amount}', promo.minOrderAmount.toLocaleString()), 'warning'); return; }
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
    const success = await orderService.create(order);
    if (success) { 
      onOrder(); 
      setCart([]); 
      showToast("Buyurtmangiz qabul qilindi!", 'success'); 
    }
  };

  if (cart.length === 0) return (
    <div className="h-[65vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in text-brand-dark dark:text-white">
      <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-200"><ShoppingBag size={64} /></div>
      <h2 className="text-4xl font-black uppercase tracking-tighter">{t.cart.empty}</h2>
      <Link to="/products" className="gradient-mint text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-110 transition-all">Sotib olish</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 text-brand-dark dark:text-white">
      <div className="space-y-8">
        <h2 className="text-5xl font-black uppercase tracking-tighter">Savatcha</h2>
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.product.id} className="flex gap-6 items-center bg-white dark:bg-white/5 p-5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
              <img src={item.product.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt="" />
              <div className="flex-1">
                <h4 className="text-xl font-black leading-none uppercase">{item.product.translations[lang].name}</h4>
                <p className="text-brand-mint font-black mt-2">{(getPrice(item.product) * item.quantity).toLocaleString()} UZS</p>
                <p className="text-xs opacity-40 font-bold">{item.quantity} dona</p>
              </div>
              <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
           <label className="text-xs font-black uppercase opacity-40 ml-2 tracking-widest">Promo-kod</label>
           <div className="flex gap-3">
              <input value={promoInput} onChange={e => setPromoInput(e.target.value)} className="flex-1 p-5 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-black uppercase tracking-widest text-brand-dark dark:text-white" placeholder="SIMOSH10" />
              <button onClick={handleApplyPromo} className="px-8 py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Qo'llash</button>
           </div>
           {appliedPromo && <div className="flex items-center gap-2 text-brand-mint font-black text-sm uppercase px-2"><Tag size={16} /> {appliedPromo.code} muvaffaqiyatli qo'llanildi!</div>}
        </div>
        <div className="p-10 bg-brand-dark text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/10 blur-3xl rounded-full" />
           <div className="flex justify-between items-center opacity-40 text-sm font-bold uppercase tracking-widest mb-2"><span>Summa:</span><span>{subtotal.toLocaleString()} UZS</span></div>
           {appliedPromo && <div className="flex justify-between items-center text-rose-400 text-sm font-bold uppercase tracking-widest mb-4"><span>Chegirma:</span><span>-{calculateDiscount().toLocaleString()} UZS</span></div>}
           <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-4 relative z-10">
             <span className="text-2xl font-black uppercase tracking-tighter">Jami:</span>
             <span className="text-5xl font-black text-brand-mint tracking-tight">{total.toLocaleString()} UZS</span>
           </div>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 p-10 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 h-fit">
        <h3 className="text-3xl font-black uppercase tracking-tighter">Buyurtma berish</h3>
        <div className="space-y-4">
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Ismingiz" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" placeholder="Telefon raqamingiz" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white h-32" placeholder="Izoh yoki manzil..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} />
        </div>
        <button onClick={handleCheckout} className="w-full py-6 gradient-mint text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl">Tasdiqlash va Yuborish</button>
      </div>
    </div>
  );
};
