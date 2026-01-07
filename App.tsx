
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, ArrowRight, Leaf, 
  Instagram, Menu, X, Sparkles, Globe2, Phone
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
  showToast: (msg: string) => void
}>({
  lang: 'uz',
  setLang: () => {},
  t: translations.uz,
  showToast: () => {}
});

const SideNav = () => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const location = useLocation();

  const menu = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.ai, path: '/ai' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 md:w-24 bg-simosh-moss flex flex-col items-center justify-between py-10 z-[100]">
      <Link to="/" className="text-simosh-paper font-serif text-2xl font-black rotate-180 nav-vertical tracking-widest">
        SIMOSH
      </Link>
      
      <div className="flex flex-col gap-8">
        {menu.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-vertical text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-simosh-clay ${location.pathname === item.path ? 'text-simosh-paper' : 'text-simosh-paper/40'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center">
        <select 
          onChange={(e) => setLang(e.target.value as Language)} 
          value={lang}
          className="bg-transparent text-simosh-paper/60 text-[10px] font-black uppercase outline-none"
        >
          {['uz', 'ru', 'en', 'tr'].map(l => <option key={l} value={l} className="bg-simosh-moss">{l}</option>)}
        </select>
      </div>
    </div>
  );
};

const CartBubble = ({ count }: { count: number }) => (
  <Link to="/cart" className="fixed right-10 bottom-10 w-20 h-20 bg-simosh-ink text-simosh-paper rounded-full flex items-center justify-center shadow-2xl z-[90] hover:scale-110 transition-transform group">
    <ShoppingBag className="group-hover:rotate-12 transition-transform" />
    {count > 0 && <span className="absolute top-0 right-0 bg-simosh-clay w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-simosh-paper">{count}</span>}
  </Link>
);

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { product, quantity: 1 }];
    });
    setToast(translations[lang].cart.added);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], showToast: (m) => setToast(m) }}>
      <Router>
        <div className="min-h-screen pl-20 md:pl-24 bg-simosh-paper">
          <SideNav />
          <CartBubble count={cart.reduce((a, b) => a + b.quantity, 0)} />

          <main>
            <Routes>
              <Route path="/" element={
                <div className="p-6 md:p-12 space-y-20">
                  {/* Editorial Hero */}
                  <section className="grid lg:grid-cols-12 gap-6 min-h-[90vh]">
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-12">
                      <span className="text-simosh-moss font-bold uppercase tracking-[0.4em] text-xs">Simosh — Organic Atelier</span>
                      <h1 className="serif-title text-7xl md:text-[10rem] leading-[0.85] tracking-tighter text-simosh-ink italic">
                        The Art <br /> of <span className="text-simosh-clay">Nature</span>
                      </h1>
                      <div className="flex gap-12 items-end">
                        <p className="max-w-xs text-sm font-medium leading-relaxed opacity-60">
                          {translations[lang].home.heroTitle} - {INITIAL_DB.companyInfo.description[lang]}
                        </p>
                        <Link to="/products" className="group flex items-center gap-4 text-simosh-moss font-black uppercase tracking-widest text-xs">
                          Collection <div className="w-12 h-[1px] bg-simosh-moss group-hover:w-20 transition-all"></div>
                        </Link>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <img 
                        src={INITIAL_DB.products[0].image} 
                        className="w-full h-full object-cover rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-1000" 
                        alt="Simosh Hero"
                      />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-simosh-paper p-4 rounded-full flex items-center justify-center text-center leading-none animate-spin-slow">
                        <span className="text-[10px] font-black uppercase tracking-tighter italic">Handcrafted • Organic • Simosh • Handcrafted • </span>
                      </div>
                    </div>
                  </section>

                  {/* Bento Collection */}
                  <section className="space-y-12">
                    <h2 className="serif-title text-5xl italic">{translations[lang].home.popular}</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                      {INITIAL_DB.products.map((p, idx) => (
                        <div 
                          key={p.id} 
                          className={`bento-card bg-white p-6 rounded-[2.5rem] flex flex-col gap-6 shadow-sm border border-black/5 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                        >
                          <img src={p.image} className="w-full h-full min-h-[250px] object-cover rounded-[2rem]" />
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-simosh-clay mb-2">{p.category[lang]}</p>
                              <h3 className="serif-title text-2xl">{p.name[lang]}</h3>
                              <p className="text-xl font-medium mt-2">{p.price.toLocaleString()} UZS</p>
                            </div>
                            <button onClick={() => addToCart(p)} className="w-12 h-12 bg-simosh-moss text-white rounded-full flex items-center justify-center hover:rotate-90 transition-transform">
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              } />

              <Route path="/products" element={
                <div className="p-6 md:p-12">
                   <h1 className="serif-title text-6xl mb-12">Our Selection</h1>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {INITIAL_DB.products.map(p => (
                         <div key={p.id} className="group relative overflow-hidden rounded-[3rem] aspect-[3/4]">
                            <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-simosh-moss/80 to-transparent flex flex-col justify-end p-10 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                               <h3 className="text-white serif-title text-3xl mb-2">{p.name[lang]}</h3>
                               <p className="text-white/60 text-sm mb-6 line-clamp-2">{p.description[lang]}</p>
                               <button onClick={() => addToCart(p)} className="bg-simosh-clay text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest self-start">
                                 {translations[lang].cart.add}
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              } />

              <Route path="/ai" element={<SimoshAI products={INITIAL_DB.products} />} />
              <Route path="/contact" element={<ContactPanel />} />
              <Route path="/cart" element={<CartPanel cart={cart} setCart={setCart} />} />
            </Routes>
          </main>

          {toast && (
            <div className="fixed top-10 right-10 bg-simosh-ink text-simosh-paper px-8 py-4 rounded-2xl shadow-2xl z-[200] animate-bounce">
              <p className="text-xs font-black uppercase tracking-widest">{toast}</p>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

const ContactPanel = () => {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const submit = async (e: any) => {
    e.preventDefault();
    const ok = await sendContactToTelegram({...form, email: 'Guest', language: lang});
    if(ok) {
      showToast(t.contact.success);
      setForm({ name: '', phone: '', message: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-12">
      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-8">
          <h1 className="serif-title text-8xl leading-none italic">Let's <br /> <span className="text-simosh-clay">Talk</span></h1>
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-simosh-moss">
                <Globe2 size={20} /> <span className="font-bold">{INITIAL_DB.companyInfo.address[lang]}</span>
             </div>
             <div className="flex items-center gap-4 text-simosh-moss">
                <Phone size={20} /> <span className="font-bold">{INITIAL_DB.companyInfo.phone}</span>
             </div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent border-b-2 border-simosh-moss/20 py-4 outline-none focus:border-simosh-clay font-bold text-lg" placeholder={t.contact.name} />
          <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-transparent border-b-2 border-simosh-moss/20 py-4 outline-none focus:border-simosh-clay font-bold text-lg" placeholder={t.contact.phone} />
          <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-transparent border-b-2 border-simosh-moss/20 py-4 outline-none focus:border-simosh-clay font-bold text-lg h-32" placeholder={t.contact.message} />
          <button className="w-full bg-simosh-moss text-white py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-simosh-ink transition-colors">
            {t.contact.send}
          </button>
        </form>
      </div>
    </div>
  );
}

const CartPanel = ({ cart, setCart }: any) => {
  const { t, lang, showToast } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const checkout = async () => {
    const ok = await sendOrderToTelegram({
      customerName: name,
      customerPhone: phone,
      items: cart,
      totalPrice: cart.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0),
      language: lang
    });
    if(ok) {
      setCart([]);
      showToast("Sipariş alındı!");
    }
  };

  return (
    <div className="p-12 max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
      <div className="space-y-8">
        <h2 className="serif-title text-6xl italic">{t.cart.title}</h2>
        {cart.length === 0 ? <p className="opacity-40">{t.cart.empty}</p> : (
          <div className="space-y-6">
            {cart.map((item: any) => (
              <div key={item.product.id} className="flex items-center justify-between border-b border-black/5 pb-4">
                <div className="flex gap-4">
                  <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold">{item.product.name[lang]}</h4>
                    <p className="text-xs text-simosh-clay">{item.quantity} x {item.product.price.toLocaleString()} UZS</p>
                  </div>
                </div>
                <button onClick={() => setCart((p: any) => p.filter((i: any) => i.product.id !== item.product.id))} className="text-red-400"><X size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8">
        <h3 className="serif-title text-3xl">Checkout</h3>
        <div className="space-y-4">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-5 rounded-2xl bg-simosh-paper outline-none border border-black/5 font-bold" placeholder="Full Name" />
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-5 rounded-2xl bg-simosh-paper outline-none border border-black/5 font-bold" placeholder="+998" />
        </div>
        <button onClick={checkout} disabled={!name || !phone || cart.length === 0} className="w-full py-6 bg-simosh-clay text-white rounded-full font-black uppercase tracking-widest shadow-xl disabled:opacity-20 transition-all active:scale-95">
          Order Now
        </button>
      </div>
    </div>
  );
}
