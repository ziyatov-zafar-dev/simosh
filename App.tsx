
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Info, Home, Phone, Sparkles, Plus, Minus, Trash2, 
  Globe, ArrowRight, Sun, Moon, ArrowLeft, CheckCircle2, Leaf, 
  Instagram, Send, X, Camera
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
      <div className="max-w-6xl mx-auto glass-nav rounded-full shadow-2xl py-3 px-8 flex items-center justify-between border border-white/20 dark:border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
             <img src="https://i.postimg.cc/mD83WqVq/simosh-logo.png" alt="Simosh" className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/194/194206.png")} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-brand-dark dark:text-white">SIMOSH</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all uppercase tracking-wider ${location.pathname === item.path ? 'nav-pill-active' : 'text-gray-600 dark:text-gray-300 hover:text-brand-mint'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-3 bg-gray-100/50 dark:bg-white/5 text-yellow-500 dark:text-yellow-400 rounded-full hover:scale-110 transition-transform">
            {isDark ? <Sun size={20} /> : <Moon size={20} className="text-indigo-600" />}
          </button>
          
          <button onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')} className="w-12 h-12 flex items-center justify-center bg-gray-100/50 dark:bg-white/5 rounded-full text-sm font-black text-brand-dark dark:text-white uppercase">
            {lang}
          </button>

          <Link to="/cart" className="relative w-12 h-12 gradient-mint text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-dark dark:bg-white text-white dark:text-brand-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <div className="group bg-white dark:bg-brand-dark/50 rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name[lang]} />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-dark/90 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-mint">
          {product.category[lang]}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-black text-brand-dark dark:text-white leading-none tracking-tight">{product.name[lang]}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{product.description[lang]}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-black text-brand-mint">{product.price.toLocaleString()} <span className="text-xs uppercase">UZS</span></span>
          <button 
            onClick={() => addToCart(product)}
            className="p-4 gradient-mint text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setToast(translations[lang].cart.added);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast: (m) => setToast(m) }}>
      <Router>
        <div className="min-h-screen">
          <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
          
          <main className="pt-32">
            <Routes>
              <Route path="/" element={
                <div className="pb-32 space-y-40">
                  {/* Hero - Screenshotda ko'rsatilgan uslubda */}
                  <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                    <div className="space-y-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint/10 rounded-full text-brand-mint text-xs font-black uppercase tracking-widest">
                        <Leaf size={14} /> 100% Organik Mahsulot
                      </div>
                      <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-brand-dark dark:text-white">
                        Tabiatning <br />
                        <span className="text-gradient">Sof</span> <br />
                        Mo'jizasi
                      </h1>
                      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                        Biz — tabiatdan ilhom olgan, inson salomatligini ustuvor biladigan tabiiy parvarish mahsulotlari ishlab chiqaruvchi kompaniyamiz.
                      </p>
                      <Link to="/products" className="inline-flex items-center gap-4 gradient-mint text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all">
                        Mahsulotlar <ArrowRight size={24} />
                      </Link>
                    </div>
                    <div className="relative">
                       <div className="absolute -inset-10 bg-brand-mint/5 rounded-full blur-3xl" />
                       <div className="relative bg-white dark:bg-white/5 p-8 rounded-[4rem] shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                          <img src="https://images.unsplash.com/photo-1605264964528-06403738d6dc?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover rounded-[3rem]" alt="Simosh Soap" />
                       </div>
                    </div>
                  </section>

                  {/* Mashhur mahsulotlar */}
                  <section className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                      <h2 className="text-5xl font-black text-brand-dark dark:text-white tracking-tight">Ommabop mahsulotlar</h2>
                      <Link to="/products" className="text-brand-mint font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                        Barchasi <ArrowRight size={20} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {INITIAL_DB.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="max-w-7xl mx-auto px-6 py-20">
                  <h1 className="text-6xl font-black text-brand-dark dark:text-white mb-16 tracking-tight">Bizning to'plamlar</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {INITIAL_DB.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                  </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />
              <Route path="/contact" element={
                <div className="max-w-3xl mx-auto px-6 py-20">
                  <h1 className="text-5xl font-black text-brand-dark dark:text-white mb-10">Bog'lanish</h1>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <input className="w-full p-6 rounded-3xl bg-gray-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-lg" placeholder="Ismingiz" />
                    <input className="w-full p-6 rounded-3xl bg-gray-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-lg" placeholder="Telefon raqamingiz" />
                    <textarea className="w-full p-6 rounded-3xl bg-gray-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-brand-mint font-bold text-lg h-40" placeholder="Xabaringiz"></textarea>
                    <button className="w-full py-6 gradient-mint text-white rounded-3xl font-black text-xl shadow-xl">Yuborish</button>
                  </form>
                </div>
              } />
            </Routes>
          </main>

          {toast && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
              <div className="gradient-mint text-white px-10 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs">
                <CheckCircle2 size={18} /> {toast}
              </div>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}
