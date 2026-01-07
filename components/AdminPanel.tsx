
import React, { useState, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Building2, LogOut, Trash2, Plus, Edit, X, 
  Check, Clock, Ban, Ticket, List, Save, User, Settings, Menu as MenuIcon,
  ShoppingBag, TrendingUp, DollarSign, Users, ChevronRight, Moon, Sun, AlertCircle
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, OrderStatus, Category, GlobalPromoCode, Language } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';
import { 
  addOrUpdateProduct, deleteProduct, addOrUpdateCategory, deleteCategory,
  addOrUpdatePromo, deletePromo, updateCompany, updateAbout, updateOrderStatus
} from '../services/dbService';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { showToast, lang: currentLang, isDark, toggleTheme } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'promos' | 'company'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await loginAdmin(email, password);
      if (success) { setIsAuthenticated(true); showToast("Xush kelibsiz!"); }
      else showToast("Email yoki parol noto'g'ri!", 'error');
    };
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#070b14]">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 animate-in zoom-in duration-300">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-brand-mint/10 rounded-[2rem] flex items-center justify-center mx-auto text-brand-mint">
              <Settings size={40} className="animate-spin-slow" />
            </div>
            <h2 className="text-3xl font-black uppercase text-brand-dark dark:text-white">Admin Portal</h2>
            <p className="text-xs font-bold opacity-40 uppercase tracking-[0.2em]">Simosh Atelier Management</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-4">Elektron pochta</label>
              <input required type="email" placeholder="email@example.com" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-4">Maxfiy parol</label>
              <input required type="password" placeholder="••••••••" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <button className="w-full py-5 gradient-mint text-white rounded-[2rem] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all text-sm tracking-widest">Kirish</button>
        </form>
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
        id: editingProduct.id || Date.now(),
        created_at: editingProduct.created_at || new Date().toISOString(),
        is_active: true,
        currency: 'UZS',
        sku: editingProduct.sku || `SIM-${Math.floor(Math.random()*1000)}`
      } as Product;
      onUpdate(addOrUpdateProduct(db, p));
      setIsModalOpen(false);
      showToast("Mahsulot saqlandi!");
    };

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-brand-dark/80 backdrop-blur-md overflow-y-auto">
        <div className="bg-white dark:bg-[#0c1221] w-full max-w-4xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 my-auto border border-white/5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl md:text-3xl font-black uppercase text-brand-dark dark:text-white">Mahsulot tahriri</h3>
            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-brand-dark dark:text-white"><X /></button>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2 text-brand-dark dark:text-white">Rasm manzili (URL)</label>
                <input placeholder="https://..." className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2 text-brand-dark dark:text-white">Narxi (UZS)</label>
                  <input type="number" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2 text-brand-dark dark:text-white">Zaxira (dona)</label>
                  <input type="number" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2 text-brand-dark dark:text-white">Kategoriya</label>
                <select className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white" value={editingProduct.categoryId || ''} onChange={e => setEditingProduct({...editingProduct, categoryId: Number(e.target.value)})}>
                  <option value="">Tanlang</option>
                  {db.categories.map(c => <option key={c.id} value={c.id}>{c.name[currentLang]}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-mint">
              {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                <div key={l} className="p-5 border border-gray-100 dark:border-white/5 rounded-2xl space-y-3 bg-gray-50/50 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-mint" />
                    <span className="text-[10px] font-black uppercase text-brand-mint tracking-widest">{l} tili</span>
                  </div>
                  <input placeholder="Mahsulot nomi" className="w-full bg-transparent outline-none font-bold text-brand-dark dark:text-white border-b border-gray-200 dark:border-white/10 pb-2 focus:border-brand-mint transition-all" value={editingProduct.translations?.[l]?.name || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], name: e.target.value}} as any})} />
                  <textarea placeholder="Batafsil tavsifi..." className="w-full bg-transparent outline-none text-sm font-medium opacity-60 text-brand-dark dark:text-white h-20 resize-none" value={editingProduct.translations?.[l]?.description || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], description: e.target.value}} as any})} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={save} className="w-full py-5 gradient-mint text-white rounded-[2rem] font-black uppercase shadow-xl hover:scale-[1.02] transition-all text-sm tracking-[0.2em]">O'zgarishlarni saqlash</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#070b14] text-brand-dark dark:text-white">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0c1221] border-r border-gray-100 dark:border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 gradient-mint rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-brand-mint">Panel</span></h1>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none">Simosh Atelier</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === item.id ? 'bg-brand-mint text-white shadow-lg shadow-brand-mint/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} />
                  {item.label}
                </div>
                {item.count ? <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] ${activeTab === item.id ? 'bg-white text-brand-mint' : 'bg-brand-mint text-white'}`}>{item.count}</span> : <ChevronRight size={14} className="opacity-20" />}
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
            <button onClick={toggleTheme} className="w-full flex items-center gap-4 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
               {isDark ? <Sun size={18} /> : <Moon size={18} />}
               {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
              <LogOut size={18} />
              Chiqish
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 bg-white dark:bg-[#0c1221] border-b border-gray-100 dark:border-white/5 sticky top-0 z-40">
           <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl"><MenuIcon size={20} /></button>
           <h2 className="font-black uppercase tracking-tighter text-lg">{menuItems.find(m => m.id === activeTab)?.label}</h2>
           <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center text-brand-mint">
             <User size={18} />
           </div>
        </header>

        {/* Desktop Header Title */}
        <header className="hidden lg:flex items-center justify-between p-10">
           <div>
             <h2 className="text-4xl font-black uppercase tracking-tight">{menuItems.find(m => m.id === activeTab)?.label}</h2>
             <p className="text-sm font-bold opacity-30 uppercase tracking-widest mt-1">Sizning biznesingiz ko'rinishi</p>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-black text-sm uppercase">Mohinur Akbarova</p>
                <p className="text-[10px] font-bold text-brand-mint uppercase tracking-widest">Asosiy Admin</p>
              </div>
              <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-mint shadow-xl border border-gray-100 dark:border-white/5">
                <User size={24} />
              </div>
           </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 pt-0 animate-in fade-in duration-500">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
               <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[
                    { label: 'Umumiy Daromad', value: db.orders.filter(o => o.status === 'COMPLETED').reduce((s,o) => s+o.totalPrice, 0).toLocaleString() + ' UZS', icon: DollarSign, color: 'text-brand-mint', bg: 'bg-brand-mint/10' },
                    { label: 'Buyurtmalar', value: db.orders.length + ' ta', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Mijozlar (Taxminiy)', value: new Set(db.orders.map(o => o.customerPhone)).size + ' ta', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Mahsulotlar', value: db.products.length + ' ta', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0c1221] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:scale-105 transition-all">
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                         <stat.icon size={22} />
                       </div>
                       <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-1">{stat.label}</p>
                       <h3 className="text-2xl font-black">{stat.value}</h3>
                    </div>
                  ))}
               </div>

               <div className="grid lg:grid-cols-2 gap-10">
                  <div className="bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="text-2xl font-black uppercase">So'nggi buyurtmalar</h4>
                       <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase text-brand-mint tracking-widest hover:underline">Hammasini ko'rish</button>
                    </div>
                    <div className="space-y-6">
                       {db.orders.slice(-4).reverse().map(order => (
                         <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-brand-mint/20 rounded-xl flex items-center justify-center text-brand-mint">
                                <ShoppingBag size={18} />
                              </div>
                              <div>
                                <p className="font-black text-sm uppercase">{order.firstName}</p>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">#{order.id.slice(-6)}</p>
                              </div>
                           </div>
                           <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase text-white ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="text-2xl font-black uppercase">Top Mahsulotlar</h4>
                       <button onClick={() => setActiveTab('products')} className="text-[10px] font-black uppercase text-brand-mint tracking-widest hover:underline">Boshqarish</button>
                    </div>
                    <div className="space-y-6">
                       {db.products.slice(0, 4).map(p => (
                         <div key={p.id} className="flex items-center gap-6">
                            <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                            <div className="flex-1">
                               <p className="font-black text-sm uppercase">{p.translations[currentLang].name}</p>
                               <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-brand-mint" style={{width: `${(p.stock / 100) * 100}%`}}></div>
                               </div>
                            </div>
                            <span className="font-black text-xs">{p.stock} dona</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <h3 className="text-2xl font-black uppercase">Buyurtmalar ro'yxati</h3>
                  <div className="flex gap-2 bg-white dark:bg-[#0c1221] p-1 rounded-2xl border border-gray-100 dark:border-white/5">
                     <button className="px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest bg-brand-mint text-white">Hammasi</button>
                     <button className="px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-400">Yangi</button>
                  </div>
               </div>
               <div className="grid gap-6">
                  {db.orders.length === 0 ? <div className="text-center py-40 opacity-20 uppercase font-black text-2xl tracking-widest">Ma'lumot topilmadi</div> : 
                    db.orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                    <div key={order.id} className="bg-white dark:bg-[#0c1221] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col xl:flex-row gap-10 items-start xl:items-center">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-4">
                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase text-white ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                            <span className="text-[10px] font-black opacity-30 tracking-widest">#{order.id.slice(-6)} | {new Date(order.createdAt).toLocaleDateString()}</span>
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <p className="text-[10px] font-black uppercase opacity-30 mb-1">Mijoz ma'lumotlari</p>
                               <h4 className="text-2xl font-black uppercase">{order.firstName} {order.lastName}</h4>
                               <p className="text-brand-mint font-black text-lg mt-1">{order.customerPhone}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase opacity-30 mb-1">Mahsulotlar</p>
                               <div className="flex flex-wrap gap-2 mt-2">
                                  {order.items.map((item, idx) => (
                                    <span key={idx} className="bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-bold">{item.product.translations[currentLang].name} (x{item.quantity})</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                         {order.comment && (
                           <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl italic text-sm opacity-60">
                             "{order.comment}"
                           </div>
                         )}
                      </div>
                      <div className="flex xl:flex-col items-center gap-4 w-full xl:w-fit border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-white/10 pt-8 xl:pt-0 xl:pl-10">
                         <div className="flex-1 xl:text-center">
                            <p className="text-[10px] font-black uppercase opacity-30 mb-1">Jami Summa</p>
                            <h5 className="text-3xl font-black text-brand-mint whitespace-nowrap">{order.totalPrice.toLocaleString()} UZS</h5>
                         </div>
                         <div className="flex gap-2">
                            {order.status === 'PENDING' && (
                              <>
                                <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'COMPLETED'))} className="w-14 h-14 bg-brand-mint text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-mint/20"><Check size={24} /></button>
                                <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'CANCELLED'))} className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-rose-500/20"><Ban size={24} /></button>
                              </>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black uppercase">Mahsulotlarni boshqarish</h3>
                  <p className="text-sm font-bold opacity-30 mt-1 uppercase tracking-widest">{db.products.length} ta umumiy mahsulot</p>
                </div>
                <button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }} className="px-10 py-5 gradient-mint text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"><Plus size={18} /> Yangi qo'shish</button>
              </div>
              <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {db.products.map(p => (
                  <div key={p.id} className="bg-white dark:bg-[#0c1221] p-6 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-8px] transition-all flex flex-col group">
                     <div className="relative mb-6 overflow-hidden rounded-[2.5rem] aspect-square">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.translations[currentLang].name} />
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                          {p.price.toLocaleString()} UZS
                        </div>
                        {p.stock < 10 && (
                          <div className="absolute bottom-4 left-4 bg-rose-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                             <AlertCircle size={10} /> Kam qoldi: {p.stock}
                          </div>
                        )}
                     </div>
                     <div className="flex-1 px-2">
                        <h4 className="text-xl font-black uppercase tracking-tight line-clamp-1">{p.translations[currentLang].name}</h4>
                        <p className="text-[10px] font-black uppercase text-brand-mint tracking-widest mt-1 opacity-50">SKU: {p.sku}</p>
                        <p className="text-xs font-medium opacity-40 mt-3 line-clamp-2 leading-relaxed">{p.translations[currentLang].description}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mt-8">
                        <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="py-4 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[9px] tracking-widest hover:bg-brand-mint hover:text-white transition-all"><Edit size={14} /> Tahrirlash</button>
                        <button onClick={() => { if(confirm('Rostdan ham o\'chirmoqchimisiz?')) onUpdate(deleteProduct(db, p.id)) }} className="py-4 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[9px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /> O'chirish</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-4xl space-y-10">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase">Kategoriyalar</h3>
                  <button onClick={() => {
                    const name = prompt('Kategoriya nomi (O\'zbekcha):');
                    if(name) {
                      const c: Category = { id: Date.now(), name: { uz: name, ru: name, en: name, tr: name } };
                      onUpdate(addOrUpdateCategory(db, c));
                    }
                  }} className="px-8 py-4 gradient-mint text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"><Plus size={16} /> Qo'shish</button>
               </div>
               <div className="grid md:grid-cols-2 gap-4">
                  {db.categories.map(c => (
                    <div key={c.id} className="bg-white dark:bg-[#0c1221] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-mint/10 text-brand-mint rounded-xl flex items-center justify-center"><List size={18} /></div>
                          <h4 className="text-lg font-black uppercase tracking-tight">{c.name[currentLang]}</h4>
                       </div>
                       <button onClick={() => onUpdate(deleteCategory(db, c.id))} className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'promos' && (
            <div className="max-w-4xl space-y-10">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase">Promo-kodlar</h3>
                  <button onClick={() => {
                    const code = prompt('Promo-kod matni:');
                    if(code) {
                      const p: GlobalPromoCode = { id: Date.now().toString(), code: code.toUpperCase(), type: 'PERCENT', value: 10, min_amount: 50000, expiry_date: '2026-12-31', is_active: true };
                      onUpdate(addOrUpdatePromo(db, p));
                    }
                  }} className="px-8 py-4 gradient-mint text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"><Plus size={16} /> Yangi</button>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  {db.promoCodes.map(p => (
                    <div key={p.id} className="bg-white dark:bg-[#0c1221] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-brand-mint/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-700" />
                       <h4 className="text-3xl font-black text-brand-mint tracking-[0.3em] uppercase">{p.code}</h4>
                       <div className="mt-4 space-y-1">
                          <p className="text-[10px] font-black uppercase opacity-30">Chegirma qiymati</p>
                          <p className="font-black">{p.type === 'PERCENT' ? `${p.value}%` : `${p.value.toLocaleString()} UZS`} | Min: {p.min_amount.toLocaleString()} UZS</p>
                       </div>
                       <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100 dark:border-white/5">
                          <span className={`text-[8px] font-black uppercase px-4 py-1 rounded-full ${p.is_active ? 'bg-brand-mint/10 text-brand-mint' : 'bg-rose-500/10 text-rose-500'}`}>{p.is_active ? 'Faol' : 'Nofaol'}</span>
                          <button onClick={() => onUpdate(deletePromo(db, p.id))} className="text-rose-500 hover:scale-110 transition-all"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="max-w-4xl space-y-10">
               <h3 className="text-2xl font-black uppercase">Asosiy Sozlamalar</h3>
               <div className="bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-4">Kompaniya Nomi</label>
                        <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-black text-brand-dark dark:text-white" value={db.companyInfo.name} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, name: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-4">Logo (URL)</label>
                        <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-black text-brand-dark dark:text-white" value={db.companyInfo.logo} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, logo: e.target.value}))} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-4">Telefon Raqami</label>
                        <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-black text-brand-dark dark:text-white" value={db.companyInfo.phone} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, phone: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase opacity-40 ml-4">Telegram Username</label>
                        <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-black text-brand-dark dark:text-white" value={db.companyInfo.telegram} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, telegram: e.target.value}))} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => showToast("Barcha o'zgarishlar saqlandi!")} className="w-full py-6 gradient-mint text-white rounded-[2rem] font-black uppercase shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 tracking-widest text-sm"><Save size={20} /> O'zgarishlarni saqlash</button>
               </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && renderProductModal()}
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-md lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}
