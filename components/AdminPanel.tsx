
import React, { useState, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, Package, Building2, LogOut, 
  Trash2, Save, X, CheckCircle, Ticket, Activity, Eye, EyeOff, Check, Ban, Clock
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, CompanyInfo, Database, OrderData, OrderStatus } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { lang, showToast } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'company'>('dashboard');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await loginAdmin(email, password);
      if (success) {
        setIsAuthenticated(true);
        showToast("Xush kelibsiz!");
      } else showToast("Email yoki parol noto'g'ri!", 'error');
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">Admin Login</h2>
            <p className="text-sm opacity-50 font-bold uppercase tracking-widest">Simosh Atelier</p>
          </div>
          <div className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} placeholder="Parol" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff /> : <Eye />}</button>
            </div>
          </div>
          <button type="submit" className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Kirish</button>
        </form>
      </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = db.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdate({ ...db, orders: updatedOrders });
    showToast(`Buyurtma holati o'zgartirildi: ${newStatus}`);
  };

  const getStats = () => {
    const orders = db.orders || [];
    const completed = orders.filter(o => o.status === 'COMPLETED');
    const cancelled = orders.filter(o => o.status === 'CANCELLED');
    const pending = orders.filter(o => o.status === 'PENDING');
    const totalSales = completed.reduce((sum, o) => sum + o.totalPrice, 0);

    return { total: orders.length, completed: completed.length, cancelled: cancelled.length, pending: pending.length, totalSales };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col lg:flex-row gap-10">
      <aside className="lg:w-64 space-y-4">
        <div className="bg-brand-dark p-8 rounded-[2.5rem] shadow-xl text-white">
          <nav className="space-y-4">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 py-3 font-bold uppercase tracking-widest text-[10px] ${activeTab === 'dashboard' ? 'text-brand-mint' : 'text-gray-400'}`}><LayoutDashboard size={18} /> Dashboard</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 py-3 font-bold uppercase tracking-widest text-[10px] ${activeTab === 'orders' ? 'text-brand-mint' : 'text-gray-400'}`}><Activity size={18} /> Buyurtmalar</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 py-3 font-bold uppercase tracking-widest text-[10px] ${activeTab === 'products' ? 'text-brand-mint' : 'text-gray-400'}`}><Package size={18} /> Mahsulotlar</button>
            {/* Fix: use block statement for multiple actions in onClick to avoid testing 'void' from logoutAdmin() for truthiness */}
            <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-4 py-3 font-bold uppercase tracking-widest text-[10px] text-rose-400 mt-10"><LogOut size={18} /> Chiqish</button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        {activeTab === 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <p className="text-xs font-black uppercase opacity-40 mb-2">Jami Sotuv</p>
              <h3 className="text-4xl font-black text-brand-mint">{stats.totalSales.toLocaleString()} UZS</h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <p className="text-xs font-black uppercase opacity-40 mb-2">Buyurtmalar</p>
              <h3 className="text-4xl font-black text-brand-mint">{stats.total} ta</h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <p className="text-xs font-black uppercase opacity-40 mb-2">Bekor qilingan</p>
              <h3 className="text-4xl font-black text-rose-500">{stats.cancelled} ta</h3>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase">Buyurtmalar Ro'yxati</h2>
            <div className="grid gap-6">
              {(db.orders || []).sort((a,b) => b.id.localeCompare(a.id)).map(order => (
                <div key={order.id} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-md flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'COMPLETED' ? 'bg-brand-mint/10 text-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {order.status}
                      </span>
                      <span className="text-xs opacity-50 font-bold">#{order.id.slice(-6)}</span>
                    </div>
                    <h4 className="text-xl font-black">{order.firstName} {order.lastName}</h4>
                    <p className="text-sm font-bold text-brand-mint">{order.totalPrice.toLocaleString()} UZS</p>
                    <div className="text-xs opacity-50 font-medium">
                      {order.items.map(i => `${i.product.translations.uz.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatusChange(order.id, 'COMPLETED')} className="w-12 h-12 flex items-center justify-center bg-brand-mint/10 text-brand-mint rounded-2xl hover:bg-brand-mint hover:text-white transition-all"><Check /></button>
                        <button onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Ban /></button>
                      </>
                    )}
                    {order.status !== 'PENDING' && (
                       <button onClick={() => handleStatusChange(order.id, 'PENDING')} className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-400 rounded-2xl"><Clock size={18} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase">Mahsulotlar</h2>
            <div className="grid gap-4">
               {db.products.map(product => (
                 <div key={product.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] flex items-center gap-6 border border-gray-100 dark:border-white/5 shadow-sm">
                   <img src={product.image} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                     <h5 className="font-black uppercase tracking-tight">{product.translations.uz.name}</h5>
                     <p className="text-xs opacity-50 font-bold">{product.price.toLocaleString()} UZS</p>
                   </div>
                   <div className="flex gap-2">
                     <button className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl"><Eye size={18} /></button>
                     <button className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><Trash2 size={18} /></button>
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
