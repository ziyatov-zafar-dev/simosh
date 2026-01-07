
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Info, 
  Home, 
  Menu, 
  X, 
  Phone, 
  Instagram, 
  Send,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Globe,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle2,
  Leaf,
  Wind
} from 'lucide-react';
import { INITIAL_DB } from './constants';
import { Product, OrderData, Language } from './types';
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

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-8 fade-in duration-500">
      <div className="bg-atelier-900 dark:bg-accent-500 text-atelier-50 dark:text-atelier-950 px-10 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-white/10 font-bold backdrop-blur-xl">
        <CheckCircle2 size={20} className="text-accent-400 dark:text-atelier-950" />
        {message}
      </div>
    </div>
  );
};

const Navbar = ({ cartCount }: { cartCount: number }) => {
  const { lang, setLang, t, isDark, toggleTheme } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: t.nav.home, path: '/', icon: <Home size={18} /> },
    { name: t.nav.products, path: '/products', icon: <ShoppingBag size={18} /> },
    { name: t.nav.about, path: '/about', icon: <Info size={18} /> },
    { name: t.nav.contact, path: '/contact', icon: <Phone size={18} /> },
    { name: t.nav.ai, path: '/ai', icon: <Sparkles size={18} className="text-accent-500 animate-pulse" /> },
  ];

  const langs: { id: Language, label: string }[] = [
    { id: 'uz', label: 'UZ' },
    { id: 'ru', label: 'RU' },
    { id: 'en', label: 'EN' },
    { id: 'tr', label: 'TR' }
  ];

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 border-b border-atelier-200 dark:border-atelier-800/50 h-24 flex items-center transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-atelier-900 dark:bg-accent-500 rounded-[24px] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Leaf className="text-accent-400 dark:text-atelier-900" size={28} />
            </div>
            <div className="hidden sm:block">
              <span className="text-3xl font-black text-atelier-900 dark:text-atelier-50 tracking-tighter leading-none block font-serif uppercase italic">SIMOSH</span>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-30 dark:text-atelier-400 mt-1 block">Botanical Atelier</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2.5 text-[11px] font-black tracking-[0.2em] uppercase rounded-full transition-all ${
                  location.pathname === item.path 
                    ? 'bg-atelier-900 text-white dark:bg-accent-500 dark:text-atelier-900' 
                    : 'text-atelier-900/40 dark:text-atelier-500 hover:text-atelier-900 dark:hover:text-atelier-50 hover:bg-atelier-100 dark:hover:bg-atelier-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-3.5 text-atelier-900/30 dark:text-atelier-500 hover:bg-atelier-100 dark:hover:bg-atelier-800 rounded-full transition-all"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowLangs(!showLangs)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-atelier-100 dark:bg-atelier-800 text-atelier-900 dark:text-atelier-100 font-black text-[10px] tracking-widest transition-all hover:bg-atelier-200"
              >
                <Globe size={16} />
                {lang.toUpperCase()}
              </button>
              {showLangs && (
                <div className="absolute right-0 mt-4 w-40 bg-white dark:bg-atelier-900 rounded-[32px] shadow-2xl border border-atelier-100 dark:border-atelier-800 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4">
                  {langs.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { setLang(l.id); setShowLangs(false); }}
                      className={`w-full px-8 py-3 text-left text-[11px] font-black tracking-widest transition-all ${lang === l.id ? 'bg-atelier-900 text-white dark:bg-accent-500 dark:text-atelier-900' : 'text-atelier-900/40 dark:text-atelier-500 hover:bg-atelier-50 dark:hover:bg-atelier-800'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/cart"
              className="relative p-4 bg-atelier-900 dark:bg-accent-500 text-white dark:text-atelier-900 rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-atelier-200 dark:bg-atelier-900 text-atelier-900 dark:text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-atelier-50 dark:border-atelier-950">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProductCard: React.FC<{ product: Product, addToCart: (p: Product, q: number) => void }> = ({ product, addToCart }) => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(product, qty);
    showToast(`${product.name[lang]} ${t.cart.added}`);
    setTimeout(() => {
      setIsAdding(false);
      setQty(1);
    }, 1500);
  };

  return (
    <div className="group bg-white dark:bg-atelier-900/50 rounded-[64px] overflow-hidden shadow-xl border border-atelier-100 dark:border-atelier-800/50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-5 flex flex-col h-full">
      <div className="relative h-[480px] overflow-hidden bg-atelier-100 dark:bg-atelier-950">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" alt={product.name[lang]} />
        <div className="absolute top-10 right-10 bg-atelier-900/90 dark:bg-accent-500/90 backdrop-blur-3xl px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white dark:text-atelier-900">
          Essential
        </div>
      </div>
      <div className="p-14 flex-1 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-4xl font-black text-atelier-900 dark:text-atelier-50 tracking-tighter leading-none font-serif italic">{product.name[lang]}</h3>
            <span className="bg-atelier-100 dark:bg-atelier-800 px-5 py-2 rounded-full text-[10px] font-black text-atelier-900/30 dark:text-atelier-400 uppercase tracking-[0.2em]">{product.category[lang]}</span>
          </div>
          <p className="text-atelier-900/40 dark:text-atelier-500 text-xl font-medium leading-relaxed font-serif italic line-clamp-2">{product.description[lang]}</p>
        </div>
        
        <div className="mt-12 space-y-10">
          <div className="flex items-center justify-between bg-atelier-50 dark:bg-atelier-950 p-4 rounded-[40px] border border-atelier-100 dark:border-atelier-800">
             <div className="flex items-center gap-5">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 bg-white dark:bg-atelier-800 text-atelier-900 dark:text-atelier-50 rounded-2xl shadow-sm hover:scale-110"><Minus size={18} /></button>
                <span className="w-10 text-center font-black text-2xl dark:text-atelier-50">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 bg-white dark:bg-atelier-800 text-atelier-900 dark:text-atelier-50 rounded-2xl shadow-sm hover:scale-110"><Plus size={18} /></button>
             </div>
             <div className="text-right pr-4">
                <p className="text-[10px] font-black text-atelier-900/20 dark:text-atelier-500 uppercase tracking-widest mb-1">Ritual Price</p>
                <p className="text-3xl font-black text-atelier-900 dark:text-atelier-50">{(product.price * qty).toLocaleString()}</p>
             </div>
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={isAdding}
            className={`w-full py-7 rounded-full transition-all flex items-center justify-center gap-5 font-black text-xl tracking-widest uppercase shadow-xl ${
              isAdding 
                ? 'bg-accent-500 text-atelier-900 scale-95' 
                : 'bg-atelier-900 dark:bg-accent-500 text-white dark:text-atelier-900 hover:scale-[1.03]'
            }`}
          >
            {isAdding ? <CheckCircle2 size={28} /> : <ShoppingBag size={28} />}
            {isAdding ? 'Added' : t.cart.add}
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, updateQuantity, removeFromCart, onCheckout }: any) => {
  const { lang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const total = cart.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-40 min-h-[90vh] animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-4 text-atelier-900/30 dark:text-atelier-500 font-black mb-20 hover:text-atelier-900 dark:hover:text-atelier-50 transition-all group"
      >
        <div className="p-4 rounded-full bg-atelier-100 dark:bg-atelier-800 group-hover:-translate-x-3 transition-transform shadow-xl">
          <ArrowLeft size={22} />
        </div>
        <span className="uppercase tracking-[0.4em] text-sm font-black">Return to Gallery</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-28">
        <div className="flex-1 space-y-16">
          <h1 className="text-8xl font-black text-atelier-900 dark:text-atelier-50 tracking-tighter font-serif italic">
            {t.cart.title}
            <span className="ml-10 text-3xl font-light text-atelier-900/20 dark:text-atelier-700">
              — {cart.length} items
            </span>
          </h1>

          {cart.length === 0 ? (
            <div className="py-40 text-center space-y-14 bg-white dark:bg-atelier-900/20 rounded-[80px] shadow-2xl border border-atelier-100 dark:border-atelier-800">
              <div className="w-48 h-48 bg-atelier-50 dark:bg-atelier-950 rounded-full flex items-center justify-center mx-auto">
                <Wind size={80} className="text-atelier-900/10 dark:text-atelier-700" />
              </div>
              <p className="text-4xl font-serif italic text-atelier-900/20 dark:text-atelier-500">{t.cart.empty}</p>
              <Link to="/products" className="inline-flex items-center gap-6 bg-atelier-900 text-white dark:bg-accent-500 dark:text-atelier-900 px-16 py-8 rounded-full font-black text-2xl hover:scale-110 transition-all shadow-luxury uppercase tracking-[0.2em]">
                Explore Collection <ArrowRight size={32} />
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item: any) => (
                <div key={item.product.id} className="bg-white dark:bg-atelier-900/30 p-12 rounded-[72px] border border-atelier-100 dark:border-atelier-800 flex flex-col md:flex-row items-center gap-12 group hover:shadow-2xl transition-all duration-700">
                  <div className="w-52 h-52 rounded-[56px] overflow-hidden shrink-0 shadow-lg">
                    <img src={item.product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.product.name[lang]} />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-8">
                    <div>
                      <h3 className="text-5xl font-black text-atelier-900 dark:text-atelier-50 mb-3 font-serif italic">{item.product.name[lang]}</h3>
                      <p className="text-accent-500 font-bold uppercase tracking-[0.4em] text-[11px]">Organic Essence</p>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-12">
                      <div className="flex items-center gap-6 bg-atelier-50 dark:bg-atelier-950 p-3 rounded-[32px]">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-4 hover:bg-white dark:hover:bg-atelier-800 rounded-3xl transition-all shadow-sm"><Minus size={20} /></button>
                        <span className="w-12 text-center font-black text-3xl dark:text-atelier-50">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-4 hover:bg-white dark:hover:bg-atelier-800 rounded-3xl transition-all shadow-sm"><Plus size={20} /></button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)} 
                        className="p-5 text-atelier-900/10 dark:text-atelier-500/20 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[32px] transition-all"
                      >
                        <Trash2 size={32} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right hidden md:block border-l border-atelier-100 dark:border-atelier-800 pl-16">
                    <p className="text-[11px] font-black text-atelier-900/20 dark:text-atelier-500 uppercase tracking-[0.5em] mb-4">Atelier Subtotal</p>
                    <p className="text-5xl font-black text-atelier-900 dark:text-atelier-50 leading-none">{(item.product.price * item.quantity).toLocaleString()}<span className="text-base font-bold ml-3 opacity-20">UZS</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="lg:w-[500px]">
            <div className="sticky top-40 bg-atelier-900 dark:bg-atelier-900 rounded-[80px] p-20 text-white shadow-2xl space-y-16 border border-white/5">
              <h3 className="text-5xl font-black tracking-tighter font-serif italic">Purification Order</h3>
              
              <div className="space-y-10 pb-16 border-b border-white/10">
                <div className="flex justify-between font-serif italic text-2xl opacity-40">
                  <span>Botanical Items</span>
                  <span>{total.toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between font-serif italic text-2xl opacity-40">
                  <span>Concierge Delivery</span>
                  <span className="text-accent-500">Included</span>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-atelier-400">Total Investment</p>
                <p className="text-7xl font-black tracking-tighter leading-none">{total.toLocaleString()}<span className="text-xl font-bold ml-6 opacity-20">UZS</span></p>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-atelier-50 text-atelier-900 py-9 rounded-full font-black text-2xl hover:scale-105 transition-all flex items-center justify-center gap-6 shadow-xl uppercase tracking-[0.2em]"
              >
                {t.cart.checkout} <ArrowRight size={32} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => Promise<boolean> }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ customerName: '', customerPhone: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-atelier-950/95 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-atelier-100 dark:bg-atelier-900 w-full max-w-3xl rounded-[80px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-1000 border border-white/10">
        <div className="p-20 sm:p-28">
          <div className="flex justify-between items-center mb-20">
            <h2 className="text-6xl font-black text-atelier-900 dark:text-atelier-50 tracking-tighter font-serif leading-none italic">Reservation</h2>
            <button onClick={onClose} className="p-5 hover:bg-atelier-200 dark:hover:bg-atelier-800 rounded-full text-atelier-900 dark:text-atelier-50 transition-all">
              <X size={40} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-6">
              <label className="text-[14px] font-black text-atelier-900/20 dark:text-atelier-500 uppercase tracking-[0.6em] ml-10">{t.checkout.name}</label>
              <input 
                required
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                className="w-full bg-white dark:bg-atelier-950 border border-atelier-200 dark:border-atelier-800 p-10 rounded-[48px] outline-none focus:ring-4 focus:ring-atelier-900 transition-all font-bold text-2xl" 
                placeholder={t.checkout.namePlaceholder} 
              />
            </div>
            <div className="space-y-6">
              <label className="text-[14px] font-black text-atelier-900/20 dark:text-atelier-500 uppercase tracking-[0.6em] ml-10">{t.checkout.phone}</label>
              <input 
                required
                value={formData.customerPhone}
                onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                className="w-full bg-white dark:bg-atelier-950 border border-atelier-200 dark:border-atelier-800 p-10 rounded-[48px] outline-none focus:ring-4 focus:ring-atelier-900 transition-all font-bold text-2xl" 
                placeholder={t.checkout.phonePlaceholder} 
              />
            </div>

            <div className="pt-14 flex flex-col sm:flex-row gap-8">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-12 py-9 rounded-full font-black text-atelier-900/30 dark:text-atelier-500 hover:bg-atelier-200 dark:hover:bg-atelier-950 transition-all text-[12px] tracking-[0.4em] uppercase"
              >
                {t.checkout.cancel}
              </button>
              <button 
                disabled={loading}
                className="flex-[2] bg-atelier-900 dark:bg-accent-500 text-white dark:text-atelier-900 py-9 rounded-full font-black text-3xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-6 uppercase tracking-[0.3em]"
              >
                {loading ? t.checkout.sending : t.checkout.confirm}
                <ArrowRight size={32} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('simosh_lang') as Language) || 'uz');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('simosh_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('simosh_lang', lang);
  }, [lang]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('simosh_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('simosh_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const showToast = (msg: string) => setToast(msg);
  const t = translations[lang];

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));

  const handleCheckout = async (orderData: Omit<OrderData, 'items' | 'totalPrice'>) => {
    const fullOrder: OrderData = {
      ...orderData,
      items: cart,
      totalPrice: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      language: lang
    };
    const success = await sendOrderToTelegram(fullOrder);
    if (success) {
      showToast(t.checkout.success);
      setCart([]);
      setIsCheckoutOpen(false);
    }
    return success;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isDark, toggleTheme, showToast }}>
      <Router>
        <div className="min-h-screen flex flex-col transition-all duration-700 bg-atelier-50 dark:bg-atelier-950">
          <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
          
          <main className="flex-1 pt-24">
            <Routes>
              <Route path="/" element={
                <div className="space-y-64 pb-64">
                  <section className="px-4 lg:px-8 pt-16">
                    <div className="max-w-7xl mx-auto h-[920px] rounded-[120px] overflow-hidden relative flex items-center shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-atelier-950/80 via-atelier-950/20 to-transparent z-10" />
                      <img src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-[25s] ease-linear" alt="Luxury Soap" />
                      <div className="relative z-20 px-16 lg:px-32 max-w-6xl space-y-20 animate-in fade-in slide-in-from-left-24 duration-1000">
                        <div className="inline-flex items-center gap-5 px-10 py-4 bg-white/10 backdrop-blur-3xl rounded-full text-atelier-50 text-[11px] font-black tracking-[0.6em] uppercase border border-white/20">
                           Divine Botanics
                        </div>
                        <h1 className="text-[130px] lg:text-[200px] font-black text-white leading-[0.7] tracking-tighter font-serif italic drop-shadow-2xl">
                          {t.home.heroTitle}
                        </h1>
                        <p className="text-3xl lg:text-4xl text-white/70 leading-relaxed font-light max-w-4xl italic font-serif">
                          {t.home.heroSubtitle}
                        </p>
                        <Link to="/products" className="inline-flex items-center gap-8 bg-white text-atelier-900 px-20 py-9 rounded-full font-black text-2xl hover:scale-110 hover:shadow-2xl transition-all duration-700 uppercase tracking-[0.3em]">
                          The Gallery <ArrowRight size={36} />
                        </Link>
                      </div>
                    </div>
                  </section>

                  <section className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-16">
                      <div className="space-y-8">
                        <h2 className="text-[100px] font-black text-atelier-900 dark:text-atelier-50 tracking-tighter font-serif italic leading-[0.8]">{t.home.popularTitle}</h2>
                        <p className="text-3xl text-atelier-900/30 dark:text-atelier-500 font-medium italic font-serif max-w-3xl">{t.home.popularSubtitle}</p>
                      </div>
                      <Link to="/products" className="group flex items-center gap-6 font-black text-atelier-900 dark:text-atelier-50 bg-atelier-100 dark:bg-atelier-800 px-14 py-8 rounded-full hover:bg-atelier-900 hover:text-white dark:hover:bg-accent-500 dark:hover:text-atelier-900 transition-all shadow-xl uppercase tracking-[0.3em] text-xs">
                        {t.home.viewAll} <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-24">
                      {INITIAL_DB.products.map((p) => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                    </div>
                  </section>
                </div>
              } />
              
              <Route path="/products" element={
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-48 space-y-48">
                  <div className="text-center space-y-12 max-w-6xl mx-auto">
                    <h1 className="text-[120px] font-black tracking-tighter text-atelier-900 dark:text-atelier-50 leading-none font-serif italic">{t.nav.products}</h1>
                    <p className="text-4xl text-atelier-900/20 dark:text-atelier-600 font-serif italic leading-relaxed">The sanctuary of high-end purification and olfactory excellence.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-24">
                    {INITIAL_DB.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                  </div>
                </div>
              } />

              <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onCheckout={() => setIsCheckoutOpen(true)} />} />

              <Route path="/about" element={
                <div className="max-w-7xl mx-auto px-4 py-48 space-y-64">
                  <div className="grid lg:grid-cols-2 gap-48 items-center">
                    <div className="space-y-20 animate-in fade-in slide-in-from-left-16 duration-1000">
                      <h1 className="text-[140px] font-black text-atelier-900 dark:text-atelier-50 tracking-tighter leading-none italic font-serif">
                        {INITIAL_DB.about.title[lang]}
                      </h1>
                      <div className="prose dark:prose-invert prose-2xl max-w-none text-atelier-900/60 dark:text-atelier-500 font-medium leading-relaxed font-serif italic">
                        {INITIAL_DB.about.content[lang]}
                      </div>
                      <div className="grid grid-cols-2 gap-20 pt-20 border-t border-atelier-200 dark:border-atelier-800">
                        <div>
                          <p className="text-8xl font-black text-accent-500 font-serif">100%</p>
                          <p className="text-[12px] font-bold uppercase tracking-[0.6em] mt-6 opacity-30">Pure Botanical</p>
                        </div>
                        <div>
                          <p className="text-8xl font-black text-accent-500 font-serif">Art</p>
                          <p className="text-[12px] font-bold uppercase tracking-[0.6em] mt-6 opacity-30">Poured Rituals</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative rounded-[120px] overflow-hidden shadow-2xl aspect-[4/5] group">
                      <img src={INITIAL_DB.about.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt="Atelier Craft" />
                    </div>
                  </div>
                </div>
              } />

              <Route path="/contact" element={
                <div className="max-w-7xl mx-auto px-4 py-48 grid lg:grid-cols-2 gap-48">
                  <div className="space-y-32">
                    <div className="space-y-12">
                      <h1 className="text-[140px] font-black text-atelier-900 dark:text-atelier-50 tracking-tighter leading-none font-serif italic">{t.contact.title}</h1>
                      <p className="text-4xl text-atelier-900/30 dark:text-atelier-600 font-serif italic leading-relaxed">{t.contact.subtitle}</p>
                    </div>
                    
                    <div className="space-y-20">
                      {[{icon: <Phone />, label: 'Concierge Support', val: INITIAL_DB.companyInfo.phone}, {icon: <Send />, label: 'Telegram Portal', val: `@${INITIAL_DB.companyInfo.telegram}`}, {icon: <Instagram />, label: 'Visual Archives', val: `@${INITIAL_DB.companyInfo.instagram}`}].map((item, i) => (
                        <div key={i} className="flex items-center gap-14 group cursor-pointer p-6 rounded-[56px] hover:bg-white dark:hover:bg-atelier-800 transition-all duration-700 shadow-lg">
                          <div className="w-28 h-28 bg-atelier-900 dark:bg-atelier-100 text-accent-400 dark:text-accent-500 rounded-[40px] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                          <div>
                            <div className="text-[12px] font-black uppercase text-atelier-900/20 dark:text-atelier-500 tracking-[0.6em] mb-3">{item.label}</div>
                            <div className="text-4xl font-black text-atelier-900 dark:text-atelier-50 font-serif italic">{item.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-atelier-900 rounded-[100px] p-24 sm:p-32 text-white shadow-2xl border border-white/5 space-y-16">
                    <h3 className="text-6xl font-black tracking-tighter font-serif italic">Inquiry</h3>
                    <form className="space-y-12" onSubmit={async (e) => {
                       e.preventDefault();
                       const target = e.target as any;
                       const data = { name: target[0].value, email: target[1].value, message: target[2].value, language: lang };
                       const success = await sendContactToTelegram(data);
                       if (success) {
                         alert(t.contact.success);
                         target.reset();
                       }
                    }}>
                      <div className="space-y-6">
                        <label className="text-[12px] font-black text-atelier-500 uppercase tracking-[0.6em] ml-8">{t.contact.formName}</label>
                        <input required className="w-full bg-white/5 border border-white/10 p-10 rounded-[48px] outline-none focus:ring-1 focus:ring-accent-400 font-bold transition-all text-2xl" placeholder={t.contact.formName} />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[12px] font-black text-atelier-500 uppercase tracking-[0.6em] ml-8">{t.contact.formEmail}</label>
                        <input required type="email" className="w-full bg-white/5 border border-white/10 p-10 rounded-[48px] outline-none focus:ring-1 focus:ring-accent-400 font-bold transition-all text-2xl" placeholder={t.contact.formEmail} />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[12px] font-black text-atelier-500 uppercase tracking-[0.6em] ml-8">{t.contact.formMessage}</label>
                        <textarea required className="w-full bg-white/5 border border-white/10 p-10 rounded-[48px] outline-none focus:ring-1 focus:ring-accent-400 font-bold h-64 transition-all text-2xl resize-none" placeholder={t.contact.formMessage} />
                      </div>
                      <button className="w-full bg-atelier-50 text-atelier-900 py-10 rounded-full font-black text-3xl hover:scale-[1.03] transition-all shadow-xl uppercase tracking-[0.4em]">
                        {t.contact.send} <ArrowRight size={36} className="inline ml-3" />
                      </button>
                    </form>
                  </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />
            </Routes>
          </main>

          <footer className="bg-atelier-950 text-white py-64 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-40">
              <div className="space-y-20">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-atelier-100 rounded-[40px] flex items-center justify-center text-atelier-950 shadow-2xl"><Leaf size={40} /></div>
                  <span className="text-6xl font-black tracking-tighter font-serif italic">SIMOSH</span>
                </div>
                <p className="text-atelier-500 font-medium leading-relaxed text-2xl italic font-serif">{INITIAL_DB.companyInfo.description[lang]}</p>
                <div className="flex gap-8">
                  <a href="#" className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-400 hover:text-atelier-900 transition-all duration-700"><Instagram size={28} /></a>
                  <a href="#" className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent-400 hover:text-atelier-900 transition-all duration-700"><Send size={28} /></a>
                </div>
              </div>
              
              <div className="space-y-16">
                <h3 className="text-[14px] font-black uppercase tracking-[0.6em] text-atelier-500">The Atelier</h3>
                <ul className="space-y-10 text-2xl font-medium font-serif italic opacity-40">
                  <li><Link to="/products" className="hover:text-accent-400 transition-colors">Botanical Rituals</Link></li>
                  <li><Link to="/products" className="hover:text-accent-400 transition-colors">Olfactory Arts</Link></li>
                  <li><Link to="/products" className="hover:text-accent-400 transition-colors">Sacred Parcels</Link></li>
                </ul>
              </div>

              <div className="space-y-16">
                <h3 className="text-[14px] font-black uppercase tracking-[0.6em] text-atelier-500">Privileges</h3>
                <ul className="space-y-10 text-2xl font-medium font-serif italic opacity-40">
                  <li><Link to="/contact" className="hover:text-accent-400 transition-colors">Concierge Ritual</Link></li>
                  <li><a href="#" className="hover:text-accent-400 transition-colors">Shipping Etiquette</a></li>
                  <li><a href="#" className="hover:text-accent-400 transition-colors">Terms of Sanctity</a></li>
                </ul>
              </div>

              <div className="space-y-16">
                <h3 className="text-[14px] font-black uppercase tracking-[0.6em] text-atelier-500">Gazette</h3>
                <div className="space-y-10">
                  <p className="text-atelier-500 text-xl font-medium italic font-serif">Enroll for botanical revelations and early sanctuary access.</p>
                  <div className="relative">
                    <input className="w-full bg-white/5 border border-white/10 p-9 rounded-[40px] outline-none focus:ring-1 focus:ring-accent-400 font-bold text-xl" placeholder="Your Email" />
                    <button className="absolute right-4 top-4 bottom-4 bg-atelier-50 text-atelier-900 px-10 rounded-[32px] font-black text-[12px] tracking-widest uppercase hover:scale-105 transition-all">Enroll</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-64 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-14 opacity-20 text-[12px] font-black uppercase tracking-[0.7em]">
              <p>&copy; {new Date().getFullYear()} Simosh Atelier. Purest Excellence.</p>
              <div className="flex gap-20">
                <a href="#" className="hover:opacity-100">Etiquette</a>
                <a href="#" className="hover:opacity-100">Sacred Data</a>
              </div>
            </div>
          </footer>

          <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSubmit={handleCheckout}
          />

          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}
