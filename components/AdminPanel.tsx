
import React, { useState, useContext, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, LogOut, Trash2, Plus, Edit, X, 
  Check, Ban, Ticket, List, Save, User as UserIcon, Settings, Menu as MenuIcon,
  ShoppingBag, DollarSign, Users, ChevronRight, Moon, Sun, AlertCircle, CheckCircle, ArrowLeft, Loader2, Camera, Upload
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, Category, PromoCode, Language, User } from '../types';
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
          navigate('/admin/dashboard');
        } else {
          showToast("Email yoki parol noto'g'ri!", 'error');
        }
      } catch (err: any) {
        setIsLoading(false);
        showToast("Database xatoligi: " + err.message, 'error');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#070b14]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
           <div className="w-10 h-10 gradient-mint rounded-xl flex items-center justify-center text-white shadow-xl"><Settings className="animate-spin-slow" /></div>
           <span className="text-2xl font-black uppercase tracking-tighter text-brand-dark dark:text-white">Simosh Admin</span>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-[#0c1221] p-12 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-10 animate-in zoom-in duration-300">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase text-brand-dark dark:text-white tracking-tighter">Kirish</h2>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Boshqaruv paneliga xush kelibsiz</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Email Manzil</label>
              <input required type="email" placeholder="email@simosh.uz" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Maxfiy Parol</label>
              <input required type="password" placeholder="••••••••" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-brand-dark dark:text-white border border-transparent focus:border-brand-mint/30 transition-all shadow-sm" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <button disabled={isLoading} className="w-full py-6 gradient-mint text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] flex items-center justify-center gap-3">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Kirish'}
          </button>
        </form>
      </div>
    );
  }

  const handleLogout = () => {
    setAdminUser(null);
    navigate('/');
    showToast("Tizimdan chiqdingiz");
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, count: db.orders.filter(o => o.status === 'PENDING').length, path: '/admin/orders' },
    { id: 'products', label: 'Mahsulotlar', icon: Package, path: '/admin/products' },
    { id: 'categories', label: 'Kategoriyalar', icon: List, path: '/admin/categories' },
    { id: 'promos', label: 'Promo-kodlar', icon: Ticket, path: '/admin/promo-codes' },
    { id: 'settings', label: 'Sozlamalar', icon: Settings, path: '/admin/settings' },
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
                key={item.id} to={item.path}
                className={`w-full flex items-center justify-between p-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.15em] transition-all ${location.pathname === item.path ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={20} />
                  {item.label}
                </div>
                {item.count ? <span className="w-6 h-6 flex items-center justify-center rounded-xl bg-white text-brand-mint text-[10px] font-black">{item.count}</span> : <ChevronRight size={14} className="opacity-20" />}
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
        <header className="flex items-center justify-between p-8 lg:p-12">
           <div className="animate-in slide-in-from-left-10">
             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                {menuItems.find(m => m.path === location.pathname)?.label || 'Boshqaruv'}
             </h2>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-black text-lg uppercase leading-none">{adminUser.firstName} {adminUser.lastName}</p>
                <p className="text-[10px] font-black text-brand-mint uppercase mt-1">@{adminUser.username}</p>
              </div>
              <img src={adminUser.profileImageUrl} className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-white/5 rounded-2xl object-cover shadow-2xl border border-gray-100 dark:border-white/5" alt="Profile" />
           </div>
        </header>

        <main className="flex-1 p-6 md:p-12 pt-0">
          <Routes>
            <Route path="dashboard" element={
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                 {[
                    { label: 'Daromad', value: db.orders.filter(o => o.status === 'COMPLETED').reduce((s,o) => s+o.totalPrice, 0).toLocaleString() + ' UZS', icon: DollarSign, color: 'text-brand-mint' },
                    { label: 'Yangi', value: db.orders.filter(o => o.status === 'PENDING').length + ' ta', icon: ShoppingBag, color: 'text-amber-500' },
                    { label: 'Mijozlar', value: new Set(db.orders.map(o => o.customerPhone)).size + ' ta', icon: Users, color: 'text-blue-500' },
                    { label: 'Ombor', value: db.products.length + ' ta', icon: Package, color: 'text-purple-500' },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white dark:bg-[#0c1221] p-8 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:translate-y-[-5px] transition-all">
                      <div className={`w-12 h-12 bg-gray-50 dark:bg-white/5 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}><stat.icon size={20} /></div>
                      <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-black">{stat.value}</h3>
                   </div>
                 ))}
              </div>
            } />

            <Route path="products" element={
               <div className="space-y-8">
                 <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-white/5">
                   <h3 className="text-4xl font-black uppercase">Mahsulotlar</h3>
                   <button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }} className="px-8 py-4 gradient-mint text-white rounded-2xl font-black uppercase text-xs shadow-xl flex items-center gap-2"><Plus size={16} /> Qo'shish</button>
                 </div>
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                   {db.products.map(p => (
                     <div key={p.id} className="bg-white dark:bg-[#0c1221] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                           <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-3 bg-white/90 rounded-xl text-brand-dark shadow-xl"><Edit size={16} /></button>
                           <button onClick={() => { if(confirm('O\'chirilsinmi?')) productService.delete(p.id).then(onUpdate); }} className="p-3 bg-white/90 rounded-xl text-rose-500 shadow-xl"><Trash2 size={16} /></button>
                        </div>
                        <img src={p.image} className="w-full aspect-square object-cover rounded-[2rem] mb-6" alt="" />
                        <h4 className="text-xl font-black uppercase truncate">{p.translations[currentLang].name}</h4>
                        <p className="text-brand-mint font-black mt-2">{p.price.toLocaleString()} UZS</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between">
                           <span className="text-[10px] font-black uppercase opacity-30">Zaxira:</span>
                           <span className="text-xs font-black">{p.stock} dona</span>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            } />

            <Route path="orders" element={
               <div className="space-y-6">
                 {db.orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                    <div key={order.id} className="bg-white dark:bg-[#0c1221] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row gap-8 items-start md:items-center">
                       <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-center gap-3">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                             <span className="text-[10px] font-black opacity-20 uppercase">ID: #{order.id.slice(-6)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <div>
                               <h4 className="text-2xl font-black uppercase leading-none">{order.firstName} {order.lastName}</h4>
                               <p className="text-brand-mint font-black text-lg mt-1">{order.customerPhone}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase opacity-20">Jami</p>
                               <p className="text-2xl font-black uppercase">{order.totalPrice.toLocaleString()} UZS</p>
                            </div>
                          </div>
                       </div>
                       <div className="flex gap-4 w-full md:w-fit pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 md:pl-8">
                          {order.status === 'PENDING' && (
                            <>
                              <button onClick={() => { orderService.updateStatus(order.id, 'COMPLETED').then(onUpdate); }} className="w-14 h-14 bg-brand-mint text-white rounded-2xl flex items-center justify-center shadow-xl"><Check size={24} /></button>
                              <button onClick={() => { orderService.updateStatus(order.id, 'CANCELLED').then(onUpdate); }} className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl"><Ban size={24} /></button>
                            </>
                          )}
                       </div>
                    </div>
                 ))}
               </div>
            } />

            <Route path="settings" element={
              <div className="max-w-3xl bg-white dark:bg-[#0c1221] p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8">
                 <h3 className="text-3xl font-black uppercase">Kompaniya Sozlamalari</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase opacity-40 ml-4">Nomi</label>
                       <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-lg" value={db.companyInfo.name} onChange={e => companyService.update({...db.companyInfo, name: e.target.value}).then(onUpdate)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase opacity-40 ml-4">Telefon</label>
                       <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold text-lg" value={db.companyInfo.phone} onChange={e => companyService.update({...db.companyInfo, phone: e.target.value}).then(onUpdate)} />
                    </div>
                 </div>
                 <button onClick={() => showToast("Sozlamalar saqlandi!")} className="w-full py-6 gradient-mint text-white rounded-[2rem] font-black uppercase shadow-xl flex items-center justify-center gap-4"><Save size={24} /> Saqlash</button>
              </div>
            } />
            
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-brand-dark/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-[#0c1221] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl space-y-6 relative animate-in slide-in-from-bottom-10">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400"><X size={28} /></button>
             <h3 className="text-3xl font-black uppercase">Mahsulot Tahriri</h3>
             <div className="space-y-4">
                <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Nomi (UZ)" value={editingProduct.translations?.uz?.name || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, uz: {...editingProduct.translations?.uz, name: e.target.value}} as any})} />
                <textarea className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold h-32" placeholder="Tavsif (UZ)" value={editingProduct.translations?.uz?.description || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, uz: {...editingProduct.translations?.uz, description: e.target.value}} as any})} />
                <div className="grid grid-cols-2 gap-4">
                   <input type="number" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Narxi" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                   <input type="number" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Zaxira" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                </div>
                <input className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" placeholder="Rasm URL" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
             </div>
             <button onClick={async () => {
                const p = {...editingProduct, id: editingProduct.id || Date.now().toString(), status: 'ACTIVE', sku: editingProduct.sku || 'SKU', categoryId: 1} as Product;
                await productService.save(p);
                onUpdate();
                setIsModalOpen(false);
                showToast("Saqlandi!");
             }} className="w-full py-6 gradient-mint text-white rounded-3xl font-black uppercase shadow-xl flex items-center justify-center gap-4"><Save /> Saqlash</button>
          </div>
        </div>
      )}
    </div>
  );
}
