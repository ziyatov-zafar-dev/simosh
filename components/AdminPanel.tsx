
import React, { useState, useContext } from 'react';
import { 
  LayoutDashboard, Package, Building2, LogOut, 
  Trash2, Plus, Edit, X, Check, Clock, Ban, Ticket, TrendingUp, DollarSign, List, CheckCircle
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, OrderStatus, Category, GlobalPromoCode } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';
import { 
  updateOrderStatus, addProduct, updateProduct, deleteProduct, 
  addCategory, deleteCategory, addPromoCode, deletePromoCode, updateCompanyInfo 
} from '../services/dbService';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { showToast } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'promos' | 'company'>('dashboard');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await loginAdmin(email, password);
      if (success) { setIsAuthenticated(true); showToast("Xush kelibsiz!"); }
      else showToast("Xatolik!", 'error');
    };
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl space-y-6">
          <h2 className="text-3xl font-black uppercase text-center">Simosh Admin</h2>
          <input required type="email" placeholder="Email" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" placeholder="Parol" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase">Kirish</button>
        </form>
      </div>
    );
  }

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    onUpdate(updateOrderStatus(db, orderId, status));
    showToast("Status yangilandi!");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      onUpdate(deleteProduct(db, id));
    }
  };

  const getStats = () => {
    const orders = db.orders || [];
    const completed = orders.filter(o => o.status === 'COMPLETED');
    const totalRevenue = completed.reduce((s, o) => s + o.totalPrice, 0);
    return { total: orders.length, completed: completed.length, revenue: totalRevenue };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col lg:flex-row gap-10">
      <aside className="lg:w-64 space-y-2">
        <div className="bg-brand-dark p-6 rounded-[2.5rem] shadow-xl text-white space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'dashboard' ? 'bg-brand-mint' : ''}`}><LayoutDashboard size={18} /> Dashboard</button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'orders' ? 'bg-brand-mint' : ''}`}><Clock size={18} /> Buyurtmalar</button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'products' ? 'bg-brand-mint' : ''}`}><Package size={18} /> Mahsulotlar</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'categories' ? 'bg-brand-mint' : ''}`}><List size={18} /> Kategoriyalar</button>
          <button onClick={() => setActiveTab('promos')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'promos' ? 'bg-brand-mint' : ''}`}><Ticket size={18} /> Promo-kodlar</button>
          <button onClick={() => setActiveTab('company')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'company' ? 'bg-brand-mint' : ''}`}><Building2 size={18} /> Sozlamalar</button>
          <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] text-rose-400 mt-10"><LogOut size={18} /> Chiqish</button>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        {activeTab === 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
               <DollarSign className="text-brand-mint mb-4" />
               <p className="text-[10px] font-black uppercase opacity-40">Umumiy Savdo</p>
               <h3 className="text-3xl font-black">{stats.revenue.toLocaleString()} UZS</h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
               <TrendingUp className="text-brand-mint mb-4" />
               <p className="text-[10px] font-black uppercase opacity-40">Buyurtmalar</p>
               <h3 className="text-3xl font-black">{stats.total} ta</h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
               {/* Fix: Added missing CheckCircle import from lucide-react */}
               <CheckCircle className="text-brand-mint mb-4" />
               <p className="text-[10px] font-black uppercase opacity-40">Muvaffaqiyatli</p>
               <h3 className="text-3xl font-black">{stats.completed} ta</h3>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase">Buyurtmalar</h2>
            <div className="grid gap-4">
              {db.orders.map(order => (
                <div key={order.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-black">{order.firstName} - <span className="text-brand-mint">{order.totalPrice.toLocaleString()} UZS</span></h4>
                    <p className="text-xs opacity-50">#{order.id.slice(-6)} | {new Date(order.createdAt).toLocaleDateString()}</p>
                    {order.appliedPromo && <span className="text-[10px] bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full font-bold">Promo: {order.appliedPromo}</span>}
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatusChange(order.id, 'COMPLETED')} className="w-10 h-10 bg-brand-mint/10 text-brand-mint rounded-xl flex items-center justify-center"><Check /></button>
                        <button onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center"><Ban /></button>
                      </>
                    )}
                    <span className="text-[10px] font-black uppercase opacity-40 self-center">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase">Mahsulotlar</h2>
              <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase text-xs flex items-center gap-2"><Plus size={16} /> Qo'shish</button>
            </div>
            <div className="grid gap-4">
              {db.products.map(p => (
                <div key={p.id} className="bg-white dark:bg-white/5 p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                   <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                      <h4 className="font-black uppercase">{p.translations.uz.name}</h4>
                      <p className="text-xs opacity-50">{p.price.toLocaleString()} UZS | Zaxira: {p.stock}</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleDeleteProduct(p.id)} className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center"><Trash2 size={18} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase">Promo-kodlar</h2>
              <button onClick={() => { 
                const newPromo: GlobalPromoCode = {
                  id: Date.now().toString(),
                  code: "NEWPROMO" + Math.floor(Math.random() * 1000),
                  type: 'PERCENT',
                  value: 10,
                  min_amount: 50000,
                  expiry_date: "2026-12-31",
                  is_active: true
                };
                onUpdate(addPromoCode(db, newPromo));
              }} className="px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase text-xs flex items-center gap-2"><Plus size={16} /> Yangi</button>
            </div>
            <div className="grid gap-4">
               {db.promoCodes.map(p => (
                 <div key={p.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
                    <div>
                       <h4 className="text-lg font-black tracking-widest uppercase">{p.code}</h4>
                       <p className="text-xs opacity-50">Chegirma: {p.type === 'PERCENT' ? `${p.value}%` : `${p.value} UZS`} | Min: {p.min_amount} UZS</p>
                    </div>
                    <button onClick={() => onUpdate(deletePromoCode(db, p.id))} className="text-rose-500"><Trash2 size={18} /></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-xl space-y-6">
             <h2 className="text-3xl font-black uppercase">Kompaniya Ma'lumotlari</h2>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-2">Nomi</label>
                   <input className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 font-bold outline-none" value={db.companyInfo.name} onChange={e => onUpdate(updateCompanyInfo(db, {...db.companyInfo, name: e.target.value}))} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-2">Telefon</label>
                   <input className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 font-bold outline-none" value={db.companyInfo.phone} onChange={e => onUpdate(updateCompanyInfo(db, {...db.companyInfo, phone: e.target.value}))} />
                </div>
             </div>
             <button onClick={() => showToast("Ma'lumotlar saqlandi!")} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase">Saqlash</button>
          </div>
        )}
      </main>
    </div>
  );
}
