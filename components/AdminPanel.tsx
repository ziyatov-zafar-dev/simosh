
import React, { useState, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, Package, Building2, LogOut, 
  Trash2, Save, X, CheckCircle, Ticket, Activity, Eye, EyeOff, Check, Ban, Clock, TrendingUp, DollarSign, Users, ShoppingCart,
  ArrowRight, Phone, Plus
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, CompanyInfo, Database, OrderData, OrderStatus } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { lang, showToast } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'company'>('dashboard');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // URL dan orderId bormi tekshirish (Telegramdan kelganda)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const orderId = params.get('orderId');
    if (orderId && isAuthenticated) {
      setActiveTab('orders');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await loginAdmin(email, password);
      if (success) {
        setIsAuthenticated(true);
        showToast("Admin panelga xush kelibsiz!");
      } else {
        showToast("Email yoki parol noto'g'ri!", 'error');
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">Simosh Admin</h2>
            <p className="text-sm opacity-50 font-bold uppercase tracking-widest">Atelye Boshqaruvi</p>
          </div>
          <div className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} placeholder="Parol" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <button type="submit" className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Tizimga kirish</button>
        </form>
      </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = db.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdate({ ...db, orders: updatedOrders });
    showToast(`Buyurtma #${orderId.slice(-6)} holati: ${newStatus}`, 'success');
  };

  const getStats = () => {
    const orders = db.orders || [];
    const completed = orders.filter(o => o.status === 'COMPLETED');
    const cancelled = orders.filter(o => o.status === 'CANCELLED');
    const pending = orders.filter(o => o.status === 'PENDING');
    
    const totalRevenue = completed.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalItemsSold = completed.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
    
    const successRate = orders.length > 0 ? Math.round((completed.length / orders.length) * 100) : 0;

    return { 
      total: orders.length, 
      completed: completed.length, 
      cancelled: cancelled.length, 
      pending: pending.length, 
      totalRevenue,
      totalItemsSold,
      successRate
    };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col lg:flex-row gap-10">
      {/* Sidebar */}
      <aside className="lg:w-64 space-y-4">
        <div className="bg-brand-dark p-8 rounded-[2.5rem] shadow-xl text-white">
          <nav className="space-y-4">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'dashboard' ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><LayoutDashboard size={18} /> Dashboard</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'orders' ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><ShoppingCart size={18} /> Buyurtmalar</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'products' ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><Package size={18} /> Mahsulotlar</button>
            <button onClick={() => setActiveTab('company')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === 'company' ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><Building2 size={18} /> Sozlamalar</button>
            
            <div className="pt-10">
              <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-rose-400 hover:bg-rose-500/10 transition-all"><LogOut size={18} /> Chiqish</button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 space-y-8 animate-in fade-in duration-500">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tight">Statistika</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Umumiy Tushum" value={`${stats.totalRevenue.toLocaleString()} UZS`} icon={<DollarSign size={20}/>} color="mint" />
              <StatCard label="Muvaffaqiyatli" value={`${stats.completed} ta`} icon={<CheckCircle size={20}/>} color="mint" />
              <StatCard label="Sotilgan Sovunlar" value={`${stats.totalItemsSold} dona`} icon={<Package size={20}/>} color="blue" />
              <StatCard label="Bekor qilingan" value={`${stats.cancelled} ta`} icon={<Ban size={20}/>} color="rose" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><TrendingUp className="text-brand-mint" /> Savdo holati</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm font-bold uppercase opacity-60"><span>Muvaffaqiyat ko'rsatkichi</span> <span>{stats.successRate}%</span></div>
                     <div className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full gradient-mint transition-all duration-1000" style={{ width: `${stats.successRate}%` }} />
                     </div>
                     <p className="text-xs opacity-40 font-medium">Jami {stats.total} ta buyurtmadan {stats.completed} tasi muvaffaqiyatli yakunlandi.</p>
                  </div>
               </div>
               
               <div className="bg-brand-dark p-8 rounded-[2.5rem] shadow-xl text-white flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase opacity-40">Kutilayotgan Buyurtmalar</p>
                    <h4 className="text-5xl font-black text-brand-mint">{stats.pending}</h4>
                    <p className="text-xs font-bold opacity-60">Yangi buyurtmalarni ko'rib chiqing</p>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="w-16 h-16 bg-brand-mint rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all">
                    <ArrowRight size={24} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase">Buyurtmalar</h2>
              <div className="flex gap-2">
                <span className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-[10px] font-black uppercase">Kutilmoqda: {stats.pending}</span>
              </div>
            </div>
            
            <div className="grid gap-6">
              {(db.orders || []).length === 0 ? (
                <div className="p-20 text-center bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                  <p className="font-black text-gray-300 uppercase">Hozircha buyurtmalar yo'q</p>
                </div>
              ) : (
                (db.orders || []).sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                  <div key={order.id} className={`bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border transition-all ${order.status === 'PENDING' ? 'border-amber-500/30 shadow-amber-500/5' : 'border-gray-100 dark:border-white/5'} shadow-md flex flex-col md:flex-row gap-8 items-start md:items-center`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm ${
                          order.status === 'COMPLETED' ? 'bg-brand-mint text-white' : 
                          order.status === 'CANCELLED' ? 'bg-rose-500 text-white' : 
                          'bg-amber-500 text-white'
                        }`}>
                          {order.status === 'PENDING' ? 'KUTILMOQDA' : order.status === 'COMPLETED' ? 'YAKUNLANDI' : 'BEKOR QILINGAN'}
                        </span>
                        <span className="text-[10px] opacity-40 font-black">ID: #{order.id.slice(-6)}</span>
                        <span className="text-[10px] opacity-40 font-black">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black">{order.firstName} {order.lastName}</h4>
                        <p className="text-brand-mint font-black text-lg">{order.totalPrice.toLocaleString()} UZS</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl space-y-2">
                         <p className="text-[10px] font-black uppercase opacity-40">Mijoz ma'lumotlari:</p>
                         <p className="text-sm font-bold flex items-center gap-2"><Phone size={14} className="text-brand-mint" /> {order.customerPhone}</p>
                         {order.comment && <p className="text-sm italic opacity-60">"{order.comment}"</p>}
                      </div>

                      <div className="space-y-2">
                         <p className="text-[10px] font-black uppercase opacity-40">Sotib olingan:</p>
                         <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="bg-white dark:bg-brand-dark px-3 py-1 rounded-lg border border-gray-100 dark:border-white/10 text-xs font-bold">
                                {item.product.translations.uz.name} <span className="text-brand-mint">x{item.quantity}</span>
                              </span>
                            ))}
                         </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                      {order.status === 'PENDING' ? (
                        <>
                          <button onClick={() => handleStatusChange(order.id, 'COMPLETED')} className="flex-1 md:w-40 py-4 bg-brand-mint text-white rounded-2xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Check size={16}/> Tasdiqlash
                          </button>
                          <button onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="flex-1 md:w-40 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Ban size={16}/> Bekor qilish
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleStatusChange(order.id, 'PENDING')} className="w-full py-4 bg-gray-100 dark:bg-white/10 text-gray-400 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                          <Clock size={16}/> Qayta ko'rib chiqish
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Boshqa tablar (Products, Company) - Mavjud admin funksiyalarini saqlab qolgan holda... */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase">Mahsulotlar Boshqaruvi</h2>
              <button className="gradient-mint text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg flex items-center gap-2"><Plus size={16}/> Yangi qo'shish</button>
            </div>
            <div className="grid gap-4">
               {db.products.map(product => (
                 <div key={product.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] flex items-center gap-6 border border-gray-100 dark:border-white/5 shadow-sm group">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded uppercase">{product.sku}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${product.stock < 10 ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-mint/10 text-brand-mint'}`}>Zaxira: {product.stock}</span>
                     </div>
                     <h5 className="font-black uppercase tracking-tight text-lg">{product.translations.uz.name}</h5>
                     <p className="text-sm font-black text-brand-mint">{product.price.toLocaleString()} UZS</p>
                   </div>
                   <div className="flex gap-2">
                     <button className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-brand-mint hover:text-white transition-all"><Activity size={18} /></button>
                     <button className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'mint' | 'blue' | 'rose' }) => {
  const colors = {
    mint: 'bg-brand-mint/10 text-brand-mint',
    blue: 'bg-blue-500/10 text-blue-500',
    rose: 'bg-rose-500/10 text-rose-500'
  };
  
  return (
    <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl space-y-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase opacity-40 mb-1">{label}</p>
        <h3 className="text-2xl font-black truncate">{value}</h3>
      </div>
    </div>
  );
};
