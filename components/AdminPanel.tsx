
import React, { useState, useContext } from 'react';
import { 
  LayoutDashboard, Package, LogOut, Trash2, Plus, Edit, X, 
  Check, Ban, Ticket, List, Save, User, Settings, Menu as MenuIcon,
  ShoppingBag, DollarSign, Users, ChevronRight, Moon, Sun, AlertCircle, CheckCircle, ArrowLeft, Loader2
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, Category, PromoCode, Language } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated, ADMIN_CREDENTIALS } from '../services/auth';
import { 
  addOrUpdateProduct, deleteProduct, addOrUpdateCategory, deleteCategory,
  addOrUpdatePromo, deletePromo, updateCompany, updateOrderStatus
} from '../services/dbService';
import { sendResetRequestToTelegram } from '../services/telegram';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { showToast, lang: currentLang, isDark, toggleTheme } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'promos' | 'company'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginView, setLoginView] = useState<'login' | 'forgot' | 'sent'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const success = await loginAdmin(email, password);
      setIsLoading(false);
      if (success) { 
        setIsAuthenticated(true); 
        showToast("Xush kelibsiz, Mohinur!", 'success'); 
      }
      else showToast("Email yoki parol noto'g'ri!", 'error');
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (email.toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) {
        showToast("Ushbu email tizimda topilmadi!", 'error');
        return;
      }
      setIsLoading(true);
      const success = await sendResetRequestToTelegram(email);
      setIsLoading(false);
      if (success) {
        setLoginView('sent');
        showToast("Tiklash so'rovi Telegram botingizga yuborildi!", 'success');
      } else {
        showToast("Xatolik yuz berdi. Bot sozlamalarini tekshiring.", 'error');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#070b14]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
           <div className="w-10 h-10 gradient-mint rounded-xl flex items-center justify-center text-white shadow-xl"><Settings className="animate-spin-slow" /></div>
           <span className="text-2xl font-black uppercase tracking-tighter text-brand-dark dark:text-white">Simosh Admin</span>
        </div>

        {loginView === 'login' ? (
          <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 space-y-10 animate-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase text-brand-dark dark:text-white tracking-tighter leading-none">Kirish</h2>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Boshqaruv paneliga xush kelibsiz</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Email Manzil</label>
                <input required type="email" placeholder="admin@simosh.uz" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Maxfiy Parol</label>
                  <button type="button" onClick={() => setLoginView('forgot')} className="text-[9px] font-black uppercase text-brand-mint hover:underline">Unutdingizmi?</button>
                </div>
                <input required type="password" placeholder="••••••••" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={isLoading} className="w-full py-6 gradient-mint text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Kirish'}
            </button>
          </form>
        ) : loginView === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="w-full max-w-md bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 space-y-10 animate-in slide-in-from-right-10 duration-300">
            <button type="button" onClick={() => setLoginView('login')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors">
              <ArrowLeft size={14} /> Orqaga
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black uppercase text-brand-dark dark:text-white tracking-tighter leading-none">Parolni Tiklash</h2>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] leading-relaxed">Email manzilingizni kiriting, biz Telegram botingizga parolni tiklash so'rovini yuboramiz</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Email Manzil</label>
              <input required type="email" placeholder="email@example.com" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button disabled={isLoading} className="w-full py-6 gradient-mint text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'So\'rovni Yuborish'}
            </button>
          </form>
        ) : (
          <div className="w-full max-w-md bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 text-center space-y-8 animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center mx-auto shadow-inner">
               <CheckCircle size={40} />
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase text-brand-dark dark:text-white tracking-tighter">So'rov yuborildi!</h2>
                <p className="text-sm font-bold opacity-50 uppercase tracking-widest leading-relaxed">Telegram botingizni (chat_id: 7882316826) tekshiring. Tiklash ko'rsatmalari o'sha yerga yuborildi.</p>
             </div>
             <button onClick={() => setLoginView('login')} className="w-full py-6 bg-gray-100 dark:bg-white/5 text-brand-dark dark:text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-brand-mint hover:text-white transition-all">Login sahifasiga qaytish</button>
          </div>
        )}
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, count: db.orders.filter(o => o.status === 'PENDING').length },
    { id: 'products', label: 'Mahsulotlar', icon: Package },
    { id: 'categories', label: 'Kategoriyalar', icon: List },
    { id: 'promos', label: 'Promo-kodlar', icon: Ticket },
    { id: 'company', label: 'Sozlamalar', icon: Settings },
  ];

  const renderProductModal = () => {
    if (!editingProduct) return null;
    const save = () => {
      const p = {
        ...editingProduct,
        id: (editingProduct.id || Date.now()).toString(),
        status: editingProduct.status || 'ACTIVE',
        currency: 'UZS',
        sku: editingProduct.sku || `SIM-${Math.floor(Math.random()*1000)}`
      } as Product;
      onUpdate(addOrUpdateProduct(db, p));
      setIsModalOpen(false);
      showToast("Mahsulot muvaffaqiyatli saqlandi!");
    };

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-brand-dark/80 backdrop-blur-md overflow-y-auto">
        <div className="bg-white dark:bg-[#0c1221] w-full max-w-4xl rounded-[4rem] p-10 md:p-14 shadow-2xl space-y-10 my-auto border border-white/10 animate-in slide-in-from-bottom-20">
          <div className="flex justify-between items-center">
            <h3 className="text-4xl font-black uppercase text-brand-dark dark:text-white tracking-tighter">Mahsulot Tahriri</h3>
            <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-3xl text-brand-dark dark:text-white hover:bg-rose-500 hover:text-white transition-colors"><X size={28} /></button>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-4">Rasm manzili (URL)</label>
                <input placeholder="https://..." className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white shadow-inner" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">Narxi (UZS)</label>
                  <input type="number" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white shadow-inner" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">Zaxira (dona)</label>
                  <input type="number" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white shadow-inner" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-4">Kategoriya</label>
                <select className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white shadow-inner appearance-none" value={editingProduct.categoryId || ''} onChange={e => setEditingProduct({...editingProduct, categoryId: Number(e.target.value)})}>
                  <option value="">Tanlang</option>
                  {db.categories.map(c => <option key={c.id} value={c.id}>{c.name[currentLang]}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-brand-mint">
              {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                <div key={l} className="p-8 border border-gray-100 dark:border-white/5 rounded-[3rem] space-y-4 bg-gray-50/50 dark:bg-white/5 group hover:border-brand-mint/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-brand-mint group-hover:animate-ping" />
                    <span className="text-[10px] font-black uppercase text-brand-mint tracking-widest">{l} tili sozlamalari</span>
                  </div>
                  <input placeholder="Mahsulot nomi" className="w-full bg-transparent outline-none font-black text-2xl text-brand-dark dark:text-white border-b-2 border-gray-200 dark:border-white/10 pb-3 focus:border-brand-mint transition-all" value={editingProduct.translations?.[l]?.name || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], name: e.target.value}} as any})} />
                  <textarea placeholder="Batafsil tavsifi..." className="w-full bg-transparent outline-none text-sm font-medium opacity-60 text-brand-dark dark:text-white h-28 resize-none leading-relaxed" value={editingProduct.translations?.[l]?.description || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], description: e.target.value}} as any})} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={save} className="w-full py-7 gradient-mint text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-[1.02] transition-all text-sm tracking-[0.3em] shadow-brand-mint/40 flex items-center justify-center gap-4">
            <Save size={20} /> O'zgarishlarni Saqlash
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#070b14] text-brand-dark dark:text-white">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-[#0c1221] border-r border-gray-100 dark:border-white/5 transform transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        <div className="flex flex-col h-full p-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 gradient-mint rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-[-10deg]">
              <Settings size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Admin <span className="text-brand-mint">Panel</span></h1>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none mt-1">Simosh Atelier</p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between p-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.15em] transition-all duration-300 ${activeTab === item.id ? 'bg-brand-mint text-white shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] scale-105' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={20} />
                  {item.label}
                </div>
                {item.count ? <span className={`w-6 h-6 flex items-center justify-center rounded-xl text-[10px] ${activeTab === item.id ? 'bg-white text-brand-mint' : 'bg-brand-mint text-white shadow-lg shadow-brand-mint/30'}`}>{item.count}</span> : <ChevronRight size={14} className="opacity-20" />}
              </button>
            ))}
          </nav>

          <div className="pt-10 mt-10 border-t border-gray-100 dark:border-white/5 space-y-4">
            <button onClick={toggleTheme} className="w-full flex items-center gap-5 p-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
               {isDark ? 'Light Rejim' : 'Dark Rejim'}
            </button>
            <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-5 p-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
              <LogOut size={20} />
              Chiqish
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-8 bg-white dark:bg-[#0c1221] border-b border-gray-100 dark:border-white/5 sticky top-0 z-40 shadow-sm">
           <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-brand-dark dark:text-white"><MenuIcon size={24} /></button>
           <h2 className="font-black uppercase tracking-tighter text-xl">{menuItems.find(m => m.id === activeTab)?.label}</h2>
           <div className="w-12 h-12 bg-brand-mint/10 rounded-2xl flex items-center justify-center text-brand-mint shadow-md">
             <User size={22} />
           </div>
        </header>

        {/* Desktop Title Header */}
        <header className="hidden lg:flex items-center justify-between p-12">
           <div className="animate-in slide-in-from-left-10 duration-700">
             <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{menuItems.find(m => m.id === activeTab)?.label}</h2>
             <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em] mt-2">Boshqaruv markaziga xush kelibsiz</p>
           </div>
           <div className="flex items-center gap-8 animate-in slide-in-from-right-10 duration-700">
              <div className="text-right">
                <p className="font-black text-lg uppercase tracking-tight">Mohinur Akbarova</p>
                <p className="text-[10px] font-black text-brand-mint uppercase tracking-[0.2em]">Boshqaruvchi Direktor</p>
              </div>
              <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-brand-mint shadow-2xl border border-gray-100 dark:border-white/5 hover:scale-110 transition-transform cursor-pointer">
                <User size={28} />
              </div>
           </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 pt-0 animate-in fade-in duration-1000">
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
               <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {[
                    { label: 'Umumiy Daromad', value: db.orders.filter(o => o.status === 'COMPLETED').reduce((s,o) => s+o.totalPrice, 0).toLocaleString() + ' UZS', icon: DollarSign, color: 'text-brand-mint', bg: 'bg-brand-mint/10' },
                    { label: 'Faol Buyurtmalar', value: db.orders.filter(o => o.status === 'PENDING').length + ' ta', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Jami Mijozlar', value: new Set(db.orders.map(o => o.customerPhone)).size + ' ta', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Mahsulotlar Soni', value: db.products.length + ' ta', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-10px] transition-all duration-500 group">
                       <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                         <stat.icon size={26} />
                       </div>
                       <p className="text-[11px] font-black uppercase opacity-30 tracking-[0.2em] mb-2">{stat.label}</p>
                       <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                    </div>
                  ))}
               </div>

               <div className="grid lg:grid-cols-2 gap-10">
                  <div className="bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-10">
                    <div className="flex justify-between items-center">
                       <h4 className="text-2xl font-black uppercase tracking-tighter">Yangi Buyurtmalar</h4>
                       <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase text-brand-mint tracking-widest bg-brand-mint/10 px-6 py-2 rounded-full hover:bg-brand-mint hover:text-white transition-all">Hammasi</button>
                    </div>
                    <div className="space-y-6">
                       {db.orders.filter(o => o.status === 'PENDING').slice(0, 5).map(order => (
                         <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 gradient-mint rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <ShoppingBag size={20} />
                              </div>
                              <div>
                                <p className="font-black text-lg uppercase leading-none">{order.firstName}</p>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">ID: #{order.id.slice(-6)}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-brand-mint">{order.totalPrice.toLocaleString()} UZS</p>
                              <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">Kutilmoqda</span>
                           </div>
                         </div>
                       ))}
                       {db.orders.filter(o => o.status === 'PENDING').length === 0 && (
                         <div className="text-center py-20 opacity-20 uppercase font-black text-sm tracking-[0.3em]">Hozircha yangi buyurtma yo'q</div>
                       )}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-10">
                    <div className="flex justify-between items-center">
                       <h4 className="text-2xl font-black uppercase tracking-tighter">Zaxira Holati</h4>
                       <button onClick={() => setActiveTab('products')} className="text-[10px] font-black uppercase text-brand-mint tracking-widest bg-brand-mint/10 px-6 py-2 rounded-full hover:bg-brand-mint hover:text-white transition-all">Yangilash</button>
                    </div>
                    <div className="space-y-8">
                       {db.products.slice(0, 4).map(p => (
                         <div key={p.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <img src={p.image} className="w-12 h-12 rounded-2xl object-cover shadow-xl" />
                                 <p className="font-black text-sm uppercase tracking-tight">{p.translations[currentLang].name}</p>
                               </div>
                               <span className={`font-black text-sm ${p.stock < 10 ? 'text-rose-500' : 'text-brand-mint'}`}>{p.stock} dona</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                               <div className={`h-full transition-all duration-1000 ${p.stock < 10 ? 'bg-rose-500' : 'bg-brand-mint'}`} style={{width: `${Math.min(100, (p.stock / 50) * 100)}%`}}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-white/5 pb-10">
                  <div>
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Barcha Buyurtmalar</h3>
                    <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em] mt-2">Umumiy: {db.orders.length} ta buyurtma</p>
                  </div>
                  <div className="flex gap-3 bg-white dark:bg-[#0c1221] p-2 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5">
                     {['HAMMASI', 'PENDING', 'COMPLETED', 'CANCELLED'].map(s => (
                       <button key={s} className="px-8 py-3 rounded-[1.5rem] font-black uppercase text-[9px] tracking-widest transition-all hover:text-brand-mint">
                         {s === 'HAMMASI' ? 'Hammasi' : s === 'PENDING' ? 'Yangi' : s === 'COMPLETED' ? 'Yopilgan' : 'Rad etilgan'}
                       </button>
                     ))}
                  </div>
               </div>
               
               <div className="grid gap-10">
                  {db.orders.length === 0 ? (
                    <div className="text-center py-60 opacity-10 uppercase font-black text-6xl tracking-widest rotate-[-5deg]">Sokinlik...</div>
                  ) : (
                    db.orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                    <div key={order.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col xl:flex-row gap-12 items-start xl:items-center group hover:border-brand-mint/20 transition-all duration-500">
                      <div className="flex-1 space-y-8 w-full">
                         <div className="flex flex-wrap items-center gap-4">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase text-white shadow-xl ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                            <span className="text-[11px] font-black opacity-30 tracking-widest bg-gray-50 dark:bg-white/5 px-5 py-2 rounded-full">BUYURTMA ID: #{order.id.slice(-6)}</span>
                            <span className="text-[11px] font-black opacity-30 tracking-widest bg-gray-50 dark:bg-white/5 px-5 py-2 rounded-full">{new Date(order.createdAt).toLocaleString()}</span>
                         </div>
                         <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-2">
                               <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">Mijoz Kontakt</p>
                               <h4 className="text-3xl font-black uppercase tracking-tight">{order.firstName} {order.lastName}</h4>
                               <p className="text-brand-mint font-black text-2xl mt-1 underline decoration-brand-mint/30 underline-offset-4">{order.customerPhone}</p>
                            </div>
                            <div className="space-y-4">
                               <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">Sotib olinganlar</p>
                               <div className="flex flex-wrap gap-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-white/5 px-6 py-3 rounded-[1.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-brand-mint/10 flex items-center justify-center font-black text-brand-mint text-xs">x{item.quantity}</div>
                                       <span className="text-xs font-black uppercase tracking-tight">{item.product.translations[currentLang].name}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                         {order.comment && (
                           <div className="p-8 bg-gray-50 dark:bg-brand-dark/30 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 italic text-lg font-medium opacity-70">
                             "{order.comment}"
                           </div>
                         )}
                      </div>
                      <div className="flex xl:flex-col items-center gap-8 w-full xl:w-fit border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-white/10 pt-10 xl:pt-0 xl:pl-16">
                         <div className="flex-1 xl:text-center space-y-1">
                            <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">Jami To'lov</p>
                            <h5 className="text-4xl font-black text-brand-mint whitespace-nowrap tracking-tight">{order.totalPrice.toLocaleString()} <span className="text-sm">UZS</span></h5>
                         </div>
                         <div className="flex gap-4">
                            {order.status === 'PENDING' && (
                              <>
                                <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'COMPLETED'))} className="w-16 h-16 bg-brand-mint text-white rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-brand-mint/30" title="Yakunlash"><Check size={28} /></button>
                                <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'CANCELLED'))} className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-rose-500/30" title="Rad etish"><Ban size={28} /></button>
                              </>
                            )}
                            {order.status !== 'PENDING' && (
                               <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center text-gray-400">
                                 <CheckCircle size={28} />
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                  )))}
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
                <div className="space-y-2">
                  <h3 className="text-5xl font-black uppercase tracking-tighter">Omborxona</h3>
                  <p className="text-sm font-bold opacity-30 mt-1 uppercase tracking-[0.3em]">{db.products.length} ta umumiy mahsulot mavjud</p>
                </div>
                <button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }} className="px-12 py-6 gradient-mint text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all active:scale-95"><Plus size={20} /> Yangi Mahsulot</button>
              </div>
              
              <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-10">
                {db.products.map(p => (
                  <div key={p.id} className="bg-white dark:bg-[#0c1221] p-8 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-10px] transition-all duration-700 flex flex-col group overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-[2s]" />
                     <div className="relative mb-8 overflow-hidden rounded-[3rem] aspect-square shadow-2xl">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={p.translations[currentLang].name} />
                        <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl text-brand-mint">
                          {p.price.toLocaleString()} UZS
                        </div>
                        {p.stock < 10 && (
                          <div className="absolute top-6 left-6 bg-rose-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 animate-pulse">
                             <AlertCircle size={12} /> Zaxira Kam: {p.stock}
                          </div>
                        )}
                     </div>
                     <div className="flex-1 space-y-3 relative z-10 px-2">
                        <div className="flex justify-between items-start">
                           <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{p.translations[currentLang].name}</h4>
                        </div>
                        <p className="text-[11px] font-black uppercase text-brand-mint tracking-[0.3em] opacity-60">SKU KODI: {p.sku}</p>
                        <p className="text-sm font-medium opacity-40 leading-relaxed line-clamp-2">{p.translations[currentLang].description}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-10 relative z-10">
                        <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="py-5 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-brand-mint hover:text-white transition-all shadow-md active:scale-95"><Edit size={16} /> Tahrir</button>
                        <button onClick={() => { if(confirm('Rostdan ham ushbu mahsulotni butunlay o\'chirmoqchimisiz?')) onUpdate(deleteProduct(db, p.id)) }} className="py-5 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-md active:scale-95"><Trash2 size={16} /> O'chirish</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-4xl space-y-12">
               <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-12">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Bo'limlar</h3>
                    <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em]">Kategoriyalar boshqaruvi</p>
                  </div>
                  <button onClick={() => {
                    const name = prompt('Yangi kategoriya nomi (O\'zbekcha):');
                    if(name) {
                      const c: Category = { id: Date.now(), name: { uz: name, ru: name, en: name, tr: name } };
                      onUpdate(addOrUpdateCategory(db, c));
                      showToast("Yangi bo'lim qo'shildi!");
                    }
                  }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"><Plus size={18} /> Yangi Qo'shish</button>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  {db.categories.map(c => (
                    <div key={c.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl flex items-center justify-between group hover:border-brand-mint/40 transition-all duration-500">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><List size={22} /></div>
                          <h4 className="text-2xl font-black uppercase tracking-tight">{c.name[currentLang]}</h4>
                       </div>
                       <button onClick={() => onUpdate(deleteCategory(db, c.id))} className="w-12 h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'promos' && (
            <div className="max-w-4xl space-y-12">
               <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-12">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Promokodlar</h3>
                    <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em]">Chegirma tizimi boshqaruvi</p>
                  </div>
                  <button onClick={() => {
                    const code = prompt('Yangi promo-kod nomi (Masalan: SIMOSH30):');
                    if(code) {
                      const p: PromoCode = { 
                        id: Date.now().toString(), 
                        code: code.toUpperCase(), 
                        description: 'Special Discount',
                        scope: 'ALL_PRODUCTS',
                        discountType: 'PERCENT', 
                        discountValue: 10, 
                        minOrderAmount: 50000, 
                        startsAt: new Date().toISOString(),
                        endsAt: '2026-12-31T23:59:59Z', 
                        status: 'ACTIVE' 
                      };
                      onUpdate(addOrUpdatePromo(db, p));
                      showToast("Yangi promo-kod yaratildi!");
                    }
                  }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"><Plus size={18} /> Yangi Kod</button>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                  {db.promoCodes.map(p => (
                    <div key={p.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group hover:border-brand-mint/40 transition-all duration-500">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/5 -mr-16 -mt-16 rounded-full group-hover:scale-[2] transition-transform duration-[2s]" />
                       <h4 className="text-4xl font-black text-brand-mint tracking-[0.3em] uppercase mb-6">{p.code}</h4>
                       <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                            <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Chegirma Miqdori</p>
                            <p className="font-black text-xl">{p.discountType === 'PERCENT' ? `${p.discountValue}%` : `${p.discountValue.toLocaleString()} UZS`}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Minimal Summa</p>
                            <p className="font-black text-lg">{(p.minOrderAmount || 0).toLocaleString()} UZS</p>
                          </div>
                       </div>
                       <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100 dark:border-white/5 relative z-10">
                          <span className={`text-[9px] font-black uppercase px-6 py-2 rounded-full shadow-inner ${p.status === 'ACTIVE' ? 'bg-brand-mint/10 text-brand-mint' : 'bg-rose-500/10 text-rose-500'}`}>{p.status === 'ACTIVE' ? 'Hozir Faol' : 'Nofaol'}</span>
                          <button onClick={() => onUpdate(deletePromo(db, p.id))} className="text-rose-500 hover:scale-125 transition-all p-3 bg-rose-500/5 rounded-2xl"><Trash2 size={20} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="max-w-5xl space-y-12">
               <div className="border-b border-gray-100 dark:border-white/5 pb-12">
                 <h3 className="text-5xl font-black uppercase tracking-tighter">Ilova Sozlamalari</h3>
                 <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em] mt-2">Kompaniya va brend ma'lumotlari</p>
               </div>
               <div className="bg-white dark:bg-[#0c1221] p-12 lg:p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mint/5 -mr-32 -mt-32 rounded-full" />
                  <div className="grid md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-6 tracking-widest">Brend Nomi</label>
                        <input className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-black text-2xl text-brand-dark dark:text-white shadow-inner border border-transparent focus:border-brand-mint/30" value={db.companyInfo.name} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, name: e.target.value}))} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-6 tracking-widest">Logo URL Manzili</label>
                        <div className="flex gap-4 items-center">
                          <img src={db.companyInfo.logo} className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl border border-gray-100" />
                          <input className="flex-1 p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white shadow-inner border border-transparent focus:border-brand-mint/30" value={db.companyInfo.logo} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, logo: e.target.value}))} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-6 tracking-widest">Bog'lanish Uchun Telefon</label>
                        <input className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-black text-2xl text-brand-dark dark:text-white shadow-inner border border-transparent focus:border-brand-mint/30" value={db.companyInfo.phone} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, phone: e.target.value}))} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-6 tracking-widest">Telegram Username</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-brand-mint">@</span>
                          <input className="w-full p-6 pl-14 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-black text-2xl text-brand-dark dark:text-white shadow-inner border border-transparent focus:border-brand-mint/30" value={db.companyInfo.telegram} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, telegram: e.target.value}))} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => showToast("Barcha o'zgarishlar muvaffaqiyatli saqlandi!")} className="w-full py-8 gradient-mint text-white rounded-[3rem] font-black uppercase shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 tracking-[0.3em] text-sm relative z-10"><Save size={24} /> Ma'lumotlarni Tasdiqlash</button>
               </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && renderProductModal()}
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark/80 backdrop-blur-md lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}
