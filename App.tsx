
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500 ${isScrolled ? 'bg-atelier-paper/80 dark:bg-atelier-dark/80 backdrop-blur-2xl shadow-2xl border border-atelier-accent/10' : 'bg-transparent'}`}>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-atelier-accent rounded-full flex items-center justify-center text-atelier-light">
              <Leaf size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter serif-italic">SIMOSH</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: t.nav.home, path: '/' },
              { label: t.nav.products, path: '/products' },
              { label: t.nav.about, path: '/about' },
              { label: t.nav.contact, path: '/contact' },
              { label: t.nav.ai, path: '/ai', highlight: true }
            ].map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all hover:text-atelier-gold ${location.pathname === item.path ? 'text-atelier-gold' : item.highlight ? 'text-atelier-accent' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="p-2 hover:bg-atelier-paper dark:hover:bg-atelier-accent/20 rounded-full transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex bg-atelier-paper dark:bg-atelier-accent/20 p-1 rounded-full">
              {(['uz', 'ru', 'en'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === l ? 'bg-atelier-accent text-white' : 'opacity-40'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Link to="/cart" className="relative p-2 bg-atelier-accent text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-atelier-gold text-atelier-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-atelier-light dark:border-atelier-dark">
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

const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) => {
  const { lang, t } = useContext(LanguageContext);
  return (
    <div className="group relative bg-atelier-paper dark:bg-atelier-accent/10 rounded-[40px] overflow-hidden border border-atelier-accent/5 hover:border-atelier-accent/20 transition-all duration-700">
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
          alt={product.name[lang]} 
        />
      </div>
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-black serif-italic leading-none">{product.name[lang]}</h3>
          <span className="text-xs font-black uppercase tracking-widest text-atelier-gold">{product.price.toLocaleString()} UZS</span>
        </div>
        <p className="text-sm opacity-60 leading-relaxed line-clamp-2">{product.description[lang]}</p>
        <button 
          onClick={() => addToCart(product)}
          className="w-full py-4 bg-atelier-accent text-atelier-light rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-atelier-gold hover:text-atelier-dark transition-all"
        >
          <Plus size={16} /> {t.cart.add}
        </button>
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    showToast(translations[lang].cart.added);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isDark, toggleTheme: () => setIsDark(!isDark), showToast }}>
      <Router>
        <div className="min-h-screen">
          <Navigation cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
          
          <main>
            <Routes>
              <Route path="/" element={
                <div className="space-y-32 pb-32">
                  {/* Hero Section */}
                  <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <img src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-30 scale-105 animate-float" />
                      <div className="absolute inset-0 bg-gradient-to-b from-atelier-light via-transparent to-atelier-light dark:from-atelier-dark dark:to-atelier-dark" />
                    </div>
                    
                    <div className="relative z-10 text-center max-w-4xl px-6 space-y-12">
                      <h1 className="text-8xl md:text-[140px] font-black tracking-tighter serif-italic leading-[0.85] animate-reveal">
                        {translations[lang].home.heroTitle}
                      </h1>
                      <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed">
                        {translations[lang].home.heroSubtitle}
                      </p>
                      <Link to="/products" className="inline-flex items-center gap-4 bg-atelier-accent text-atelier-light px-12 py-6 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                        {translations[lang].home.viewProducts} <ArrowRight size={20} />
                      </Link>
                    </div>
                  </section>

                  {/* Featured Products */}
                  <section className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                      <div className="space-y-4">
                        <h2 className="text-6xl font-black serif-italic">{translations[lang].home.popularTitle}</h2>
                        <p className="opacity-50 text-xl">{translations[lang].home.popularSubtitle}</p>
                      </div>
                      <Link to="/products" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest hover:text-atelier-gold transition-all">
                        {translations[lang].home.viewAll} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {INITIAL_DB.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 space-y-20">
                  <div className="text-center space-y-6">
                    <h1 className="text-7xl font-black serif-italic">{translations[lang].nav.products}</h1>
                    <p className="opacity-50 text-xl max-w-2xl mx-auto">Pure essence of nature captured in artisan soap blocks.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {INITIAL_DB.products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
                  </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />

              {/* Other routes omitted for brevity but they follow the same aesthetic */}
            </Routes>
          </main>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5">
              <div className="bg-atelier-accent text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold">
                <CheckCircle2 size={20} /> {toast}
              </div>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}
