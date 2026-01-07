
import React, { useState, useContext, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, LogOut, Trash2, Plus, Edit, X, 
  Check, Ban, Ticket, List, Save, User as UserIcon, Settings, Menu as MenuIcon,
  ShoppingBag, DollarSign, Users, ChevronRight, Moon, Sun, AlertCircle, CheckCircle, ArrowLeft, Loader2, Camera, Upload
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, Category, PromoCode, Language, User } from '../types';
import { logoutAdmin } from '../services/auth';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { promoService } from '../services/promoService';
import { companyService } from '../services/companyService';
import { orderService } from '../services/orderService';
import { sendResetRequestToTelegram } from '../services/telegram';

interface AdminPanelProps {
  db: Database;
  onUpdate: () => void;
  adminUser: User | null;
  setAdminUser: (user: User | null) => void;
}

export default function AdminPanel({ db, onUpdate, adminUser, setAdminUser }: AdminPanelProps) {
  const { showToast, lang: currentLang, isDark, toggleTheme } = useContext(LanguageContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginView, setLoginView] = useState<'login' | 'forgot' | 'sent'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  if (!adminUser) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const user = await userService.authenticate(email, password);
        setIsLoading(false);
        if (user) { 
          setAdminUser(user);
          showToast("Xush kelibsiz!", 'success'); 
        } else {
          showToast("Email yoki parol noto'g'ri!", 'error');
        }
      } catch (err: any) {
        setIsLoading(false);
        showToast("Database xatoligi: " + (err.message || "Ulanish muvaffaqiyatsiz"), 'error');
      }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const user = await userService.findByEmail(email);
        if (!user) {
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
      } catch (err: any) {
        setIsLoading(false);
        showToast("Database Error: " + err.message, 'error');
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
                <input required type="email" placeholder="email@simosh.uz" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={email} onChange={e => setEmail(e.target.value)} />
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
                <p className="text-sm font-bold opacity-50 uppercase tracking-widest leading-relaxed">Telegram botingizni tekshiring. Tiklash ko'rsatmalari yuborildi.</p>
             </div>
             <button onClick={() => setLoginView('login')} className="w-full py-6 bg-gray-100 dark:bg-white/5 text-brand-dark dark:text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-brand-mint hover:text-white transition-all">Login sahifasiga qaytish</button>
          </div>
        )}
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    navigate('/');
    showToast("Tizimdan chiqdingiz");
  };

  const renderProductModal = () => {
    if (!editingProduct) return null;
    const save = async () => {
      try {
        const p = {
          ...editingProduct,
          id: (editingProduct.id || Date.now()).toString(),
          status: editingProduct.status || 'ACTIVE',
          currency: 'UZS',
          sku: editingProduct.sku || `SIM-${Math.floor(Math.random()*1000)}`
        } as Product;
        await productService.save(p);
        onUpdate();
        setIsModalOpen(false);
        showToast("Mahsulot muvaffaqiyatli saqlandi!");
      } catch (err: any) {
        showToast("Saqlashda xatolik: " + err.message, 'error');
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingProduct({ ...editingProduct, image: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
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
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase opacity-40 ml-4">Mahsulot Rasmi</label>
                <div 
                  onClick={() => productFileRef.current?.click()}
                  className="w-full aspect-square rounded-[3rem] bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-mint/50 transition-all overflow-hidden relative group"
                >
                  {editingProduct.image ? (
                    <>
                      <img src={editingProduct.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={40} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-300 dark:text-gray-600 mb-4" size={48} />
                      <span className="text-xs font-black uppercase text-gray-400">Rasm yuklash</span>
                    </>
                  )}
                </div>
                <input type="file" ref={productFileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
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
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
              {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                <div key={l} className="p-8 border border-gray-100 dark:border-white/5 rounded-[3rem] space-y-4 bg-gray-50/50 dark:bg-white/5 group hover:border-brand-mint/30 transition-all">
                  <span className="text-[10px] font-black uppercase text-brand-mint tracking-widest">{l} tili sozlamalari</span>
                  <input placeholder="Mahsulot nomi" className="w-full bg-transparent outline-none font-black text-2xl text-brand-dark dark:text-white border-b-2 border-gray-200 dark:border-white/10 pb-2 focus:border-brand-mint transition-all" value={editingProduct.translations?.[l]?.name || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], name: e.target.value}} as any})} />
                  <textarea placeholder="Batafsil tavsifi..." className="w-full bg-transparent outline-none text-sm font-medium opacity-60 text-brand-dark dark:text-white h-24 resize-none" value={editingProduct.translations?.[l]?.description || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], description: e.target.value}} as any})} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={save} className="w-full py-7 gradient-mint text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
            <Save size={20} /> Saqlash
          </button>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, count: db.orders.filter(o => o.status === 'PENDING').length, path: '/admin/orders' },
    { id: 'products', label: 'Mahsulotlar', icon: Package, path: '/admin/products' },
    { id: 'categories', label: 'Kategoriyalar', icon: List, path: '/admin/categories' },
    { id: 'promos', label: 'Promo-kodlar', icon: Ticket, path: '/admin/promos' },
    { id: 'company', label: 'Sozlamalar', icon: Settings, path: '/admin/company' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#070b14] text-brand-dark dark:text-white">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-[#0c1221] border-r border-gray-100 dark:border-white/5 transform transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        <div className="flex flex-col h-full p-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 gradient-mint rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-[-10deg]"><Settings size={28} /></div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Admin <span className="text-brand-mint">Panel</span></h1>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Simosh Atelier</p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map(item => (
              <Link 
                key={item.id} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center justify-between p-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.15em] transition-all ${location.pathname === item.path ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={20} />
                  {item.label}
                </div>
                {item.count ? <span className="w-6 h-6 flex items-center justify-center rounded-xl bg-white text-brand-mint text-[10px]">{item.count}</span> : <ChevronRight size={14} className="opacity-20" />}
              </Link>
            ))}
          </nav>

          <div className="pt-10 mt-10 border-t border-gray-100 dark:border-white/5 space-y-4">
            <button onClick={toggleTheme} className="w-full flex items-center gap-5 p-5 rounded-[2rem] font-black uppercase text-[11px] text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
               {isDark ? 'Yorug' : 'Tungi'}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-5 p-5 rounded-[2rem] font-black uppercase text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
              <LogOut size={20} /> Chiqish
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-80 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-between p-12">
           <div className="animate-in slide-in-from-left-10 duration-700">
             <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                {menuItems.find(m => m.path === location.pathname)?.label || 'Boshqaruv'}
             </h2>
             <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em] mt-2">Boshqaruv markaziga xush kelibsiz</p>
           </div>
           <div className="flex items-center gap-8 animate-in slide-in-from-right-10 duration-700">
              <div className="text-right">
                <p className="font-black text-lg uppercase tracking-tight">{adminUser.name}</p>
                <p className="text-[10px] font-black text-brand-mint uppercase tracking-[0.2em]">Administrator</p>
              </div>
              <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-brand-mint shadow-2xl border border-gray-100 dark:border-white/5 hover:scale-110 transition-transform cursor-pointer"><UserIcon size={28} /></div>
           </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 pt-0 animate-in fade-in duration-1000">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                 {[
                    { label: 'Daromad', value: db.orders.filter(o => o.status === 'COMPLETED').reduce((s,o) => s+o.totalPrice, 0).toLocaleString() + ' UZS', icon: DollarSign, color: 'text-brand-mint' },
                    { label: 'Yangi Buyurtmalar', value: db.orders.filter(o => o.status === 'PENDING').length + ' ta', icon: ShoppingBag, color: 'text-amber-500' },
                    { label: 'Mijozlar', value: new Set(db.orders.map(o => o.customerPhone)).size + ' ta', icon: Users, color: 'text-blue-500' },
                    { label: 'Mahsulotlar', value: db.products.length + ' ta', icon: Package, color: 'text-purple-500' },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-10px] transition-all">
                      <div className={`w-14 h-14 bg-gray-50 dark:bg-white/5 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}><stat.icon size={24} /></div>
                      <p className="text-[11px] font-black uppercase opacity-30 tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                   </div>
                 ))}
              </div>
            } />

            <Route path="orders" element={
              <div className="space-y-10">
                 {db.orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                    <div key={order.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col xl:flex-row gap-12 items-start xl:items-center">
                      <div className="flex-1 space-y-6 w-full">
                         <div className="flex flex-wrap items-center gap-4">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase text-white ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                            <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">ID: #{order.id.slice(-6)}</span>
                         </div>
                         <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">Mijoz</p>
                               <h4 className="text-3xl font-black uppercase">{order.firstName} {order.lastName}</h4>
                               <p className="text-brand-mint font-black text-xl">{order.customerPhone}</p>
                            </div>
                            <div className="space-y-3">
                               {order.items.map((item, idx) => (
                                 <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-5 py-3 rounded-2xl">
                                    <span className="font-black text-brand-mint">x{item.quantity}</span>
                                    <span className="text-xs font-black uppercase">{item.product.translations[currentLang].name}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="flex xl:flex-col items-center gap-8 w-full xl:w-fit pt-8 border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-white/10 xl:pl-12">
                         <div className="flex-1 xl:text-center">
                            <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">Jami</p>
                            <h5 className="text-4xl font-black text-brand-mint whitespace-nowrap">{order.totalPrice.toLocaleString()} UZS</h5>
                         </div>
                         <div className="flex gap-4">
                            {order.status === 'PENDING' && (
                              <>
                                <button onClick={() => { orderService.updateStatus(order.id, 'COMPLETED').then(onUpdate) }} className="w-16 h-16 bg-brand-mint text-white rounded-3xl flex items-center justify-center shadow-xl shadow-brand-mint/30"><Check size={28} /></button>
                                <button onClick={() => { orderService.updateStatus(order.id, 'CANCELLED').then(onUpdate) }} className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/30"><Ban size={28} /></button>
                              </>
                            )}
                         </div>
                      </div>
                    </div>
                 ))}
              </div>
            } />

            <Route path="products" element={
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-10">
                  <h3 className="text-5xl font-black uppercase tracking-tighter">Ombor</h3>
                  <button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-xs shadow-xl flex items-center gap-3"><Plus size={20} /> Mahsulot Qo'shish</button>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {db.products.map(p => (
                    <div key={p.id} className="bg-white dark:bg-[#0c1221] p-8 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-10px] transition-all flex flex-col group overflow-hidden">
                      <div className="relative rounded-[3rem] overflow-hidden aspect-square mb-8 shadow-2xl">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-6 right-6 flex gap-3">
                          <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-4 bg-white/95 backdrop-blur-md rounded-2xl text-brand-dark shadow-2xl hover:bg-brand-mint hover:text-white transition-all"><Edit size={20} /></button>
                          <button onClick={() => { if(confirm('O\'chirilsinmi?')) productService.delete(p.id).then(onUpdate) }} className="p-4 bg-white/95 backdrop-blur-md rounded-2xl text-rose-500 shadow-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                        </div>
                        <div className="absolute bottom-6 left-6 bg-brand-mint text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl">
                          {p.price.toLocaleString()} UZS
                        </div>
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">{p.translations[currentLang].name}</h4>
                      <p className="text-[10px] font-black uppercase text-brand-mint tracking-widest opacity-60">SKU: {p.sku}</p>
                      <p className="text-sm font-medium opacity-40 leading-relaxed line-clamp-2 mt-4">{p.translations[currentLang].description}</p>
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                         <span className="text-xs font-black uppercase opacity-30">Zaxira:</span>
                         <span className={`text-xl font-black ${p.stock < 10 ? 'text-rose-500' : 'text-brand-mint'}`}>{p.stock} ta</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            } />

            <Route path="categories" element={
              <div className="max-w-4xl space-y-12">
                 <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-12">
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Bo'limlar</h3>
                    <button onClick={() => {
                      const name = prompt('Yangi kategoriya nomi:');
                      if(name) {
                        categoryService.save({ id: Date.now(), name: { uz: name, ru: name, en: name, tr: name } }).then(onUpdate);
                      }
                    }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl flex items-center gap-3"><Plus size={18} /> Yangi Qo'shish</button>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    {db.categories.map(c => (
                      <div key={c.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center"><List size={22} /></div>
                            <h4 className="text-2xl font-black uppercase tracking-tight">{c.name[currentLang]}</h4>
                         </div>
                         <button onClick={() => categoryService.delete(c.id).then(onUpdate)} className="w-12 h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    ))}
                 </div>
              </div>
            } />

            <Route path="promos" element={
              <div className="max-w-4xl space-y-12">
                 <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-12">
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Promokodlar</h3>
                    <button onClick={() => {
                      const code = prompt('Promokod:');
                      if(code) {
                        promoService.save({ 
                          id: Date.now().toString(), 
                          code: code.toUpperCase(), 
                          description: 'Special', 
                          scope: 'ALL_PRODUCTS', 
                          discountType: 'PERCENT', 
                          discountValue: 10, 
                          status: 'ACTIVE', 
                          startsAt: new Date().toISOString(), 
                          endsAt: '2030-12-31' 
                        }).then(onUpdate);
                      }
                    }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl flex items-center gap-3"><Plus size={18} /> Yangi Kod</button>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    {db.promoCodes.map(p => (
                      <div key={p.id} className="bg-white dark:bg-[#0c1221] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
                         <h4 className="text-4xl font-black text-brand-mint tracking-[0.2em] uppercase mb-6">{p.code}</h4>
                         <div className="space-y-4">
                            <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                              <span className="text-[10px] font-black uppercase opacity-30">Chegirma</span>
                              <span className="font-black text-xl">{p.discountType === 'PERCENT' ? `${p.discountValue}%` : `${p.discountValue} UZS`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[10px] font-black uppercase opacity-30">Holat</span>
                              <span className="text-brand-mint font-black">{p.status}</span>
                            </div>
                         </div>
                         <div className="flex justify-end mt-8">
                            <button onClick={() => promoService.delete(p.id).then(onUpdate)} className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            } />

            <Route path="company" element={
              <div className="max-w-4xl space-y-12">
                 <div className="border-b border-gray-100 dark:border-white/5 pb-12">
                   <h3 className="text-5xl font-black uppercase tracking-tighter">Sozlamalar</h3>
                 </div>
                 <div className="bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-12">
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-4 tracking-widest">Nomi</label>
                        <input className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-black text-2xl" value={db.companyInfo.name} onChange={e => { companyService.update({...db.companyInfo, name: e.target.value}).then(onUpdate) }} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase opacity-40 ml-4 tracking-widest">Telefon</label>
                        <input className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 outline-none font-black text-2xl" value={db.companyInfo.phone} onChange={e => { companyService.update({...db.companyInfo, phone: e.target.value}).then(onUpdate) }} />
                      </div>
                    </div>
                    <button onClick={() => showToast("Barcha o'zgarishlar tasdiqlandi!")} className="w-full py-8 gradient-mint text-white rounded-[3rem] font-black uppercase shadow-2xl flex items-center justify-center gap-4 tracking-[0.2em] text-sm"><Save size={24} /> Saqlash</button>
                 </div>
              </div>
            } />
          </Routes>
        </main>
      </div>

      {isModalOpen && renderProductModal()}
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-brand-dark/80 backdrop-blur-md lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
