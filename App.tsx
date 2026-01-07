
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Minus, ArrowRight, Leaf, 
  Menu, X, Sparkles, Globe2, Phone, MessageSquare, CheckCircle, Trash2
} from 'lucide-react';
import { INITIAL_DB } from './constants';
import { Product, Language } from './types';
import { translations } from './locales';
import { sendOrderToTelegram, sendContactToTelegram } from './services/telegram';
import SimoshAI from './components/SimoshAI';

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

const ProductCard = ({ product, onAdd }: { product: Product, onAdd: (p: Product, q: number) => void }) => {
  const { lang, t } = useContext(LanguageContext);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    onAdd(product, quantity);
    setIsConfiguring(false);
    setQuantity(1);
  };

  return (
    <div className="product-card bg-white dark:bg-white/5 p-5 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6">
        <img src={product.image} className="w-full h-full object-cover" alt={product.name[lang]} />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-dark/90 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          {product.category[lang]}
        </div>
      </div>
      
      <div className="px-2 space-y-4 flex-1 flex flex-col">
        <h3 className="text-2xl font-black">{product.name[lang]}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">{product.description[lang]}</p>
        
        <div className="pt-4 min-h-[80px]">
          {!isConfiguring ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-40">Narxi</span>
                <span className="text-2xl font-black text-brand-mint">{product.price.toLocaleString()} <span className="text-xs uppercase">uzs</span></span>
              </div>
              <button 
                onClick={() => setIsConfiguring(true)} 
                className="w-14 h-14 gradient-mint text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between bg-gray-100 dark:bg-white/10 rounded-2xl p-1 border border-brand-mint/20">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm text-brand-dark dark:text-white hover:text-brand-mint transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-black">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm text-brand-dark dark:text-white hover:text-brand-mint transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={handleAddClick}
                className="w-full py-4 gradient-mint text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> {t.cart.add}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ cartCount }: { cartCount: number }) => {
  const { lang, setLang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const location = useLocation();

  const menu = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.ai, path: '/ai' }
  ];

  return (
    <nav className="fixed top-6 left-0 w-full z-50 px-4">
      <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-xl py-3 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-mint rounded-full flex items-center justify-center text-white shadow-lg">
             <Leaf size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-brand-dark dark:text-white uppercase">SIMOSH</span>
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

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-mint">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-transparent text-xs font-black uppercase outline-none text-brand-dark dark:text-white cursor-pointer"
          >
            {['uz', 'ru', 'en', 'tr'].map(l => <option key={l} value={l} className="bg-white dark:bg-brand-dark">{l}</option>)}
          </select>

          <Link to="/cart" className="relative w-10 h-10 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i);
      return [...prev, { product, quantity }];
    });
    setToast(translations[lang].cart.added);
    setTimeout(() => setToast(null), 3000);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast: (m) => setToast(m) }}>
      <Router>
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-white transition-colors duration-500">
          <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
          
          <main className="pt-24">
            <Routes>
              <Route path="/" element={
                <div className="pb-20">
                  <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest">
                        <Leaf size={14} /> 100% Organik & Tabiiy
                      </div>
                      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                        {translations[lang].home.heroTitle.split(' ')[0]} <br />
                        <span className="text-gradient italic">{translations[lang].home.heroTitle.split(' ')[1]}</span> <br />
                        {translations[lang].home.heroTitle.split(' ').slice(2).join(' ')}
                      </h1>
                      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                        {INITIAL_DB.companyInfo.description[lang]}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link to="/products" className="inline-flex items-center gap-3 gradient-mint text-white px-8 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                          {translations[lang].home.viewProducts} <ArrowRight size={18} />
                        </Link>
                        <Link to="/ai" className="inline-flex items-center gap-3 bg-white dark:bg-white/10 text-brand-dark dark:text-white px-8 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-lg hover:bg-gray-50 transition-all border border-gray-100 dark:border-white/5">
                          Simosh AI <Sparkles size={18} className="text-brand-mint" />
                        </Link>
                      </div>
                    </div>
                    <div className="relative group animate-in fade-in zoom-in duration-1000">
                       <div className="absolute -inset-10 bg-brand-mint/10 rounded-full blur-[100px] group-hover:bg-brand-mint/20 transition-all" />
                       <div className="relative bg-white dark:bg-white/5 p-6 rounded-[3rem] shadow-2xl border border-white/20">
                          <img src={INITIAL_DB.products[0].image} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="Hero" />
                       </div>
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="max-w-7xl mx-auto px-6 py-16">
                   <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                      <div className="space-y-2">
                        <h2 className="text-5xl font-black tracking-tight">{translations[lang].nav.products}</h2>
                        <p className="text-brand-mint font-bold uppercase tracking-widest text-xs">Premium Botanika To'plami</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {INITIAL_DB.products.map(p => (
                       <ProductCard key={p.id} product={p} onAdd={addToCart} />
                     ))}
                   </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />
              
              <Route path="/about" element={
                <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
                  <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black">{INITIAL_DB.about.title[lang]}</h1>
                    <div className="w-24 h-1.5 gradient-mint mx-auto rounded-full" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                      <div className="absolute -inset-4 gradient-mint rounded-[3.5rem] blur-lg opacity-20" />
                      <img src={INITIAL_DB.about.image} className="relative rounded-[3rem] shadow-2xl" alt="About" />
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {INITIAL_DB.about.content[lang]}
                    </p>
                  </div>
                </div>
              } />

              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} onUpdateQty={updateCartQuantity} />} />
            </Routes>
          </main>

          {toast && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500 ease-out">
              <div className="bg-white/90 dark:bg-brand-dark/90 backdrop-blur-xl border border-brand-mint/30 px-10 py-4 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-4 font-black">
                <div className="w-10 h-10 gradient-mint rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                  <CheckCircle size={20} />
                </div>
                <span className="text-brand-dark dark:text-white uppercase tracking-wider text-sm">{toast}</span>
              </div>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

const ContactPage = () => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendContactToTelegram({ ...form, email: 'Guest', language: lang });
    if (success) {
      showToast(t.contact.success);
      setForm({ name: '', phone: '', message: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
      <div className="space-y-8">
         <h1 className="text-6xl font-black tracking-tighter">Biz bilan <br /><span className="text-gradient">bog'laning</span></h1>
         <p className="text-lg opacity-60">Savollaringiz bormi? Biz doimo yordamga tayyormiz.</p>
         <div className="space-y-6 pt-6">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center">
                  <Phone size={24} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase opacity-40">Telefon</p>
                  <p className="text-xl font-bold">{INITIAL_DB.companyInfo.phone}</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center">
                  <Globe2 size={24} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase opacity-40">Manzil</p>
                  <p className="text-xl font-bold">{INITIAL_DB.companyInfo.address[lang]}</p>
               </div>
            </div>
         </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6">
        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder={t.contact.name} />
        <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder={t.contact.phone} />
        <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold h-40 text-brand-dark dark:text-white" placeholder={t.contact.message} />
        <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
          {t.contact.send}
        </button>
      </form>
    </div>
  );
};

const CartPage = ({ cart, setCart, onUpdateQty }: any) => {
  const { t, lang, showToast } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const total = cart.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    const success = await sendOrderToTelegram({
      customerName: name,
      customerPhone: phone,
      items: cart,
      totalPrice: total,
      language: lang
    });
    if (success) {
      setCart([]);
      showToast("Buyurtmangiz qabul qilindi!");
    }
  };

  if (cart.length === 0) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in">
      <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300">
        <ShoppingBag size={64} />
      </div>
      <h2 className="text-3xl font-black text-gray-400">{t.cart.empty}</h2>
      <Link to="/products" className="gradient-mint text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs">Do'konga qaytish</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
      <div className="space-y-8">
        <h2 className="text-4xl font-black tracking-tight">{t.cart.title}</h2>
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.product.id} className="flex gap-6 items-center bg-white dark:bg-white/5 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 group relative">
              <img src={item.product.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-black">{item.product.name[lang]}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-xl p-1">
                    <button 
                      onClick={() => onUpdateQty(item.product.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/10 text-brand-dark dark:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-black">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQty(item.product.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/10 text-brand-dark dark:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-brand-mint font-bold">{(item.product.price * item.quantity).toLocaleString()} UZS</span>
                </div>
              </div>
              <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
           <span className="text-xl font-bold opacity-40">{t.cart.total}:</span>
           <span className="text-4xl font-black text-brand-mint">{total.toLocaleString()} <span className="text-sm">UZS</span></span>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 h-fit space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black">Buyurtma berish</h3>
          <p className="text-sm opacity-50 font-bold">Ma'lumotlaringizni to'ldiring, biz siz bilan bog'lanamiz.</p>
        </div>
        <div className="space-y-4">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder="F.I.SH" />
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/10 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-brand-dark dark:text-white" placeholder="+998" />
        </div>
        <button 
          onClick={handleCheckout}
          disabled={!name || !phone}
          className="w-full py-5 gradient-mint text-white rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Buyurtmani tasdiqlash
        </button>
      </div>
    </div>
  );
};
