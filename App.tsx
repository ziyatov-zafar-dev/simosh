
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Plus, ArrowRight, Leaf, Send, CheckCircle2, Menu, X } from 'lucide-react';
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

const Navigation = ({ cartCount }: { cartCount: number }) => {
  const { lang, setLang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const location = useLocation();

  const menuItems = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.ai, path: '/ai' }
  ];

  return (
    <nav className="fixed top-6 left-0 w-full z-50 px-4">
      <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-2xl py-3 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-mint rounded-full flex items-center justify-center text-white shadow-lg">
             <Leaf size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-brand-dark dark:text-white">SIMOSH</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all uppercase tracking-wider ${location.pathname === item.path ? 'nav-active' : 'text-gray-500 dark:text-gray-400 hover:text-brand-mint'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-100/50 dark:bg-white/5 rounded-full text-brand-mint">
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
    const saved = localStorage.getItem('simosh-cart');
    if (saved) setCart(JSON.parse(saved));
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('simosh-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setToast(translations[lang].cart.added);
    setTimeout(() => setToast(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id));
  };

  const handleCheckout = async (customerName: string, customerPhone: string) => {
    const orderData = {
      customerName,
      customerPhone,
      items: cart,
      totalPrice: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      language: lang
    };
    const success = await sendOrderToTelegram(orderData);
    if (success) {
      setCart([]);
      setToast(translations[lang].checkout.success);
    } else {
      setToast(translations[lang].checkout.error);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast: (m) => setToast(m) }}>
      <Router>
        <div className="min-h-screen">
          <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
          
          <main className="pt-24 min-h-screen">
            <Routes>
              <Route path="/" element={
                <div className="pb-20">
                  <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center min-h-[80vh]">
                    <div className="space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest">
                        <Leaf size={14} /> 100% ORGANIK
                      </div>
                      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-brand-dark dark:text-white">
                        {translations[lang].home.heroTitle.split(' ')[0]} <br />
                        <span className="text-gradient">{translations[lang].home.heroTitle.split(' ')[1]}</span> <br />
                        {translations[lang].home.heroTitle.split(' ').slice(2).join(' ')}
                      </h1>
                      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg">
                        {INITIAL_DB.companyInfo.description[lang]}
                      </p>
                      <Link to="/products" className="inline-flex items-center gap-3 gradient-mint text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                        {translations[lang].home.viewProducts} <ArrowRight size={18} />
                      </Link>
                    </div>
                    <div className="relative group">
                       <div className="absolute -inset-10 bg-brand-mint/5 rounded-full blur-3xl animate-pulse" />
                       <div className="relative bg-white dark:bg-white/5 p-4 rounded-[3rem] shadow-2xl">
                          <img src={INITIAL_DB.products[0].image} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="Product Hero" />
                       </div>
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="max-w-7xl mx-auto px-6 py-12">
                   <h2 className="text-4xl font-black text-brand-dark dark:text-white mb-10 tracking-tight">{translations[lang].nav.products}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {INITIAL_DB.products.map(p => (
                       <div key={p.id} className="bg-white dark:bg-white/5 p-4 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 group">
                          <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6">
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name[lang]} />
                          </div>
                          <div className="px-2 space-y-3">
                            <h3 className="text-xl font-black text-brand-dark dark:text-white">{p.name[lang]}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{p.description[lang]}</p>
                            <div className="flex items-center justify-between pt-4">
                              <span className="text-2xl font-black text-brand-mint">{p.price.toLocaleString()} <span className="text-xs">UZS</span></span>
                              <button onClick={() => addToCart(p)} className="w-12 h-12 gradient-mint text-white rounded-2xl flex items-center justify-center shadow-lg hover:rotate-90 transition-transform">
                                <Plus size={20} />
                              </button>
                            </div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />
              
              <Route path="/about" element={
                <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                  <h1 className="text-5xl font-black text-brand-dark dark:text-white">{INITIAL_DB.about.title[lang]}</h1>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <img src={INITIAL_DB.about.image} className="rounded-[3rem] shadow-2xl" alt="About Simosh" />
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {INITIAL_DB.about.content[lang]}
                    </p>
                  </div>
                </div>
              } />

              <Route path="/contact" element={<ContactPage />} />

              <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} onCheckout={handleCheckout} />} />
            </Routes>
          </main>

          {toast && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
              <div className="gradient-mint text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold">
                <CheckCircle2 size={18} /> {toast}
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
    const success = await sendContactToTelegram({ ...form, email: '', language: lang });
    if (success) {
      showToast(t.contact.success);
      setForm({ name: '', phone: '', message: '' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-10 text-brand-dark dark:text-white">{t.contact.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input 
          required 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
          className="w-full p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-brand-mint font-bold" 
          placeholder={t.contact.name} 
        />
        <input 
          required 
          value={form.phone} 
          onChange={e => setForm({...form, phone: e.target.value})}
          className="w-full p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-brand-mint font-bold" 
          placeholder={t.contact.phone} 
        />
        <textarea 
          required 
          value={form.message} 
          onChange={e => setForm({...form, message: e.target.value})}
          className="w-full p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-brand-mint font-bold h-40" 
          placeholder={t.contact.message}
        />
        <button className="w-full py-5 gradient-mint text-white rounded-3xl font-black text-lg shadow-xl uppercase tracking-widest">{t.contact.send}</button>
      </form>
    </div>
  );
};

const CartPage = ({ cart, removeFromCart, onCheckout }: any) => {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const total = cart.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);

  if (cart.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
      <ShoppingBag size={80} className="text-gray-200" />
      <h2 className="text-2xl font-black text-gray-400">{t.cart.empty}</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-brand-dark dark:text-white">{t.cart.title}</h2>
        {cart.map((item: any) => (
          <div key={item.product.id} className="flex gap-4 items-center bg-white dark:bg-white/5 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
            <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h4 className="font-black text-brand-dark dark:text-white">{item.product.name.uz}</h4>
              <p className="text-sm text-brand-mint font-bold">{item.quantity} x {item.product.price.toLocaleString()} UZS</p>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full">
              <X size={18} />
            </button>
          </div>
        ))}
        <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
           <span className="text-xl font-bold opacity-50">{t.cart.total}:</span>
           <span className="text-3xl font-black text-brand-mint">{total.toLocaleString()} UZS</span>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 h-fit space-y-6">
        <h3 className="text-2xl font-black text-brand-dark dark:text-white">Buyurtmani tasdiqlash</h3>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold" placeholder="Ismingiz" />
        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold" placeholder="+998 90 123 45 67" />
        <button 
          onClick={() => onCheckout(name, phone)}
          disabled={!name || !phone}
          className="w-full py-5 gradient-mint text-white rounded-3xl font-black text-lg shadow-xl disabled:opacity-30"
        >
          {t.cart.checkout}
        </button>
      </div>
    </div>
  );
};
