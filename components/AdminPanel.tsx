
import React, { useState, useContext } from 'react';
import { 
  LayoutDashboard, Package, Building2, LogOut, Trash2, Plus, Edit, X, 
  Check, Clock, Ban, Ticket, List, Globe, Save, Image as ImageIcon
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, Database, OrderStatus, Category, GlobalPromoCode, Language } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';
import { 
  addOrUpdateProduct, deleteProduct, addOrUpdateCategory, deleteCategory,
  addOrUpdatePromo, deletePromo, updateCompany, updateAbout, updateOrderStatus
} from '../services/dbService';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { showToast, lang: currentLang } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'promos' | 'company' | 'about'>('dashboard');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingPromo, setEditingPromo] = useState<Partial<GlobalPromoCode> | null>(null);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await loginAdmin(email, password);
      if (success) { setIsAuthenticated(true); showToast("Xush kelibsiz!"); }
      else showToast("Email yoki parol noto'g'ri!", 'error');
    };
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-black uppercase">Simosh Admin</h2>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Atelye boshqaruvi</p>
          </div>
          <input required type="email" placeholder="Email" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" placeholder="Parol" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase shadow-xl">Kirish</button>
        </form>
      </div>
    );
  }

  // --- Renderers ---

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/60 backdrop-blur-md overflow-y-auto">
        <div className="bg-white dark:bg-brand-dark w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl space-y-8 my-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black uppercase">Mahsulot tahriri</h3>
            <button onClick={() => setIsModalOpen(false)}><X /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input placeholder="Rasm URL" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Narxi" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                <input type="number" placeholder="Zaxira" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
              </div>
              <select className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={editingProduct.categoryId || ''} onChange={e => setEditingProduct({...editingProduct, categoryId: Number(e.target.value)})}>
                <option value="">Kategoriyani tanlang</option>
                {db.categories.map(c => <option key={c.id} value={c.id}>{c.name[currentLang]}</option>)}
              </select>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                <div key={l} className="p-4 border border-gray-100 dark:border-white/5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-brand-mint">{l} tilida</span>
                  <input placeholder="Nomi" className="w-full bg-transparent outline-none font-bold" value={editingProduct.translations?.[l]?.name || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], name: e.target.value}} as any})} />
                  <textarea placeholder="Tavsifi" className="w-full bg-transparent outline-none text-sm opacity-60" value={editingProduct.translations?.[l]?.description || ''} onChange={e => setEditingProduct({...editingProduct, translations: {...editingProduct.translations, [l]: {...editingProduct.translations?.[l], description: e.target.value}} as any})} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={save} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase shadow-xl">Saqlash</button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col lg:flex-row gap-10">
      <aside className="lg:w-64 space-y-4">
        <div className="bg-brand-dark p-8 rounded-[2.5rem] shadow-xl text-white space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'dashboard' ? 'bg-brand-mint' : 'opacity-40'}`}><LayoutDashboard size={18} /> Dashboard</button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'orders' ? 'bg-brand-mint' : 'opacity-40'}`}><Clock size={18} /> Buyurtmalar</button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'products' ? 'bg-brand-mint' : 'opacity-40'}`}><Package size={18} /> Mahsulotlar</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'categories' ? 'bg-brand-mint' : 'opacity-40'}`}><List size={18} /> Kategoriyalar</button>
          <button onClick={() => setActiveTab('promos')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'promos' ? 'bg-brand-mint' : 'opacity-40'}`}><Ticket size={18} /> Promo-kodlar</button>
          <button onClick={() => setActiveTab('company')} className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] ${activeTab === 'company' ? 'bg-brand-mint' : 'opacity-40'}`}><Building2 size={18} /> Sozlamalar</button>
          <button onClick={() => { logoutAdmin(); setIsAuthenticated(false); }} className="w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold uppercase text-[10px] text-rose-400 mt-10"><LogOut size={18} /> Chiqish</button>
        </div>
      </aside>

      <main className="flex-1 space-y-8 animate-in fade-in duration-500">
        {activeTab === 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
               <DollarSign size={20} className="text-brand-mint mb-4" />
               <p className="text-[10px] font-black uppercase opacity-40">Umumiy Savdo</p>
               <h3 className="text-3xl font-black">{db.orders.filter(o => o.status === 'COMPLETED').reduce((s,o) => s+o.totalPrice, 0).toLocaleString()} UZS</h3>
            </div>
            <div onClick={() => setActiveTab('orders')} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl cursor-pointer hover:scale-105 transition-all">
               <Clock size={20} className="text-amber-500 mb-4" />
               <p className="text-[10px] font-black uppercase opacity-40">Kutilmoqda</p>
               <h3 className="text-3xl font-black">{db.orders.filter(o => o.status === 'PENDING').length} ta</h3>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase">Mahsulotlar</h2>
              <button onClick={() => { setEditingProduct({}); setIsModalOpen(true); }} className="px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase text-xs flex items-center gap-2"><Plus size={16} /> Qo'shish</button>
            </div>
            <div className="grid gap-4">
              {db.products.map(p => (
                <div key={p.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-6">
                   <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                   <div className="flex-1">
                      <h4 className="font-black uppercase tracking-tight">{p.translations[currentLang].name}</h4>
                      <p className="text-xs font-bold text-brand-mint">{p.price.toLocaleString()} UZS | Zaxira: {p.stock}</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-mint transition-all"><Edit size={18} /></button>
                      <button onClick={() => onUpdate(deleteProduct(db, p.id))} className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
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
                const p: GlobalPromoCode = { id: Date.now().toString(), code: 'NEW'+Math.floor(Math.random()*100), type: 'PERCENT', value: 10, min_amount: 50000, expiry_date: '2026-12-31', is_active: true };
                onUpdate(addOrUpdatePromo(db, p));
              }} className="px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase text-xs flex items-center gap-2"><Plus size={16} /> Yangi</button>
            </div>
            <div className="grid gap-4">
              {db.promoCodes.map(p => (
                <div key={p.id} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-widest text-brand-mint">{p.code}</h4>
                    <p className="text-xs font-bold opacity-40">{p.type === 'PERCENT' ? `${p.value}% Chegirma` : `${p.value.toLocaleString()} UZS Chegirma`} | Min: {p.min_amount.toLocaleString()} UZS</p>
                  </div>
                  <button onClick={() => onUpdate(deletePromo(db, p.id))} className="text-rose-500"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
             <h2 className="text-3xl font-black uppercase">Buyurtmalar</h2>
             <div className="grid gap-6">
                {db.orders.length === 0 ? <p className="opacity-40 font-bold uppercase text-center py-20">Hozircha buyurtmalar yo'q</p> : 
                  db.orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(order => (
                  <div key={order.id} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-md flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white ${order.status === 'COMPLETED' ? 'bg-brand-mint' : order.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-amber-500'}`}>{order.status}</span>
                          <span className="text-[10px] font-black opacity-40">#{order.id.slice(-6)}</span>
                       </div>
                       <h4 className="text-2xl font-black">{order.firstName} {order.lastName}</h4>
                       <p className="text-brand-mint font-black text-lg">{order.totalPrice.toLocaleString()} UZS</p>
                       <p className="text-sm font-bold opacity-50">{order.customerPhone}</p>
                    </div>
                    <div className="flex gap-2">
                       {order.status === 'PENDING' && (
                         <>
                          <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'COMPLETED'))} className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-xl flex items-center justify-center hover:bg-brand-mint hover:text-white transition-all"><Check /></button>
                          <button onClick={() => onUpdate(updateOrderStatus(db, order.id, 'CANCELLED'))} className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Ban /></button>
                         </>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 space-y-8">
            <h2 className="text-3xl font-black uppercase">Sozlamalar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Logo URL</label>
                <input className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={db.companyInfo.logo} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, logo: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Nomi</label>
                <input className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={db.companyInfo.name} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Telefon</label>
                <input className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 outline-none font-bold" value={db.companyInfo.phone} onChange={e => onUpdate(updateCompany(db, {...db.companyInfo, phone: e.target.value}))} />
              </div>
            </div>
            <button onClick={() => showToast("Ma'lumotlar saqlandi!")} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-2"><Save size={18} /> Saqlash</button>
          </div>
        )}
      </main>
      {isModalOpen && renderProductModal()}
    </div>
  );
}

const DollarSign = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
