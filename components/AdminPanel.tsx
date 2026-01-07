
import React, { useState, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, Package, Building2, Info, LogOut, 
  Plus, Edit, Trash2, Save, X, Image as ImageIcon,
  CheckCircle, AlertCircle, Loader2, Tag, Calendar, Box, Activity, Ticket
} from 'lucide-react';
import { LanguageContext } from '../App';
import { Product, CompanyInfo, Database, Language, GlobalPromoCode } from '../types';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../services/auth';

export default function AdminPanel({ db, onUpdate }: { db: Database, onUpdate: (newDb: Database) => void }) {
  const { lang, t, showToast } = useContext(LanguageContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'promos' | 'company' | 'about'>('dashboard');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [editingPromo, setEditingPromo] = useState<GlobalPromoCode | null>(null);
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      const success = await loginAdmin(email, password);
      if (success) {
        setIsAuthenticated(true);
        showToast("Xush kelibsiz, Admin!");
      } else {
        showToast("Email yoki parol noto'g'ri!");
      }
      setLoginLoading(false);
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2 mb-8">
            <div className="w-20 h-20 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-brand-mint w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Admin Login</h2>
            <p className="text-sm opacity-50 font-bold uppercase tracking-widest">Simosh Atelier Boshqaruvi</p>
          </div>
          
          <div className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-brand-mint font-bold" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" placeholder="Parol" className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-brand-mint font-bold" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loginLoading} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            {loginLoading ? <Loader2 className="animate-spin" /> : "Kirish"}
          </button>
        </form>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleUpdateCompany = (field: keyof CompanyInfo, value: any) => {
    onUpdate({ ...db, companyInfo: { ...db.companyInfo, [field]: value } });
    showToast("Ma'lumotlar saqlandi");
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      onUpdate({ ...db, products: db.products.filter(p => p.id !== id) });
      showToast("Mahsulot o'chirildi");
    }
  };

  const handleSaveProduct = (product: Product) => {
    const newProducts = [...db.products];
    const index = newProducts.findIndex(p => p.id === product.id);
    if (index > -1) newProducts[index] = product;
    else newProducts.push(product);
    onUpdate({ ...db, products: newProducts });
    setEditingProduct(null);
    setIsAddingProduct(false);
    showToast("Mahsulot saqlandi");
  };

  const handleDeletePromo = (id: string) => {
    if (confirm("Ushbu promo-kodni o'chirmoqchimisiz?")) {
      onUpdate({ ...db, promoCodes: db.promoCodes.filter(p => p.id !== id) });
      showToast("Promo-kod o'chirildi");
    }
  };

  const handleSavePromo = (promo: GlobalPromoCode) => {
    const newPromos = [...db.promoCodes];
    const index = newPromos.findIndex(p => p.id === promo.id);
    if (index > -1) newPromos[index] = promo;
    else newPromos.push(promo);
    onUpdate({ ...db, promoCodes: newPromos });
    setEditingPromo(null);
    setIsAddingPromo(false);
    showToast("Promo-kod saqlandi");
  };

  const createEmptyProduct = (): Product => ({
    id: Date.now(),
    sku: `SKU-${Date.now().toString().slice(-4)}`,
    price: 0,
    currency: "UZS",
    translations: {
      uz: { name: '', description: '' },
      ru: { name: '', description: '' },
      en: { name: '', description: '' },
      tr: { name: '', description: '' }
    },
    stock: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    image: '',
    category: { uz: '', ru: '', en: '', tr: '' }
  });

  const createEmptyPromo = (): GlobalPromoCode => ({
    id: Date.now().toString(),
    code: '',
    type: 'PERCENT',
    value: 0,
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col lg:flex-row gap-10">
      <aside className="lg:w-72 space-y-4">
        <div className="bg-brand-dark dark:bg-white/5 p-6 rounded-[2.5rem] shadow-xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <img src={db.companyInfo.logo} className="w-10 h-10 object-contain" alt="Logo" />
            <span className="font-black text-white uppercase tracking-tighter">Panel</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Mahsulotlar', icon: Package },
              { id: 'promos', label: 'Promo-kodlar', icon: Ticket },
              { id: 'company', label: 'Kompaniya', icon: Building2 },
              { id: 'about', label: 'Biz haqimizda', icon: Info },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand-mint text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all mt-8">
              <LogOut size={20} /> Chiqish
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {activeTab === 'dashboard' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Mahsulotlar</p>
              <h3 className="text-5xl font-black text-brand-mint">{db.products.length}</h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Promo-kodlar</p>
              <h3 className="text-5xl font-black text-brand-mint">{db.promoCodes.length}</h3>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase tracking-tight">Mahsulotlar Ro'yxati</h2>
              <button onClick={() => { setIsAddingProduct(true); setEditingProduct(createEmptyProduct()); }} className="flex items-center gap-2 px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all text-xs">
                <Plus size={18} /> Qo'shish
              </button>
            </div>
            <div className="grid gap-4">
              {db.products.map(product => (
                <div key={product.id} className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-md flex items-center gap-6 group hover:border-brand-mint/30 transition-all">
                  <img src={product.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                  <div className="flex-1">
                    <h4 className="text-xl font-black">{product.translations.uz.name}</h4>
                    <p className="text-sm opacity-50 font-bold">{product.price.toLocaleString()} {product.currency}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(product)} className="w-12 h-12 flex items-center justify-center bg-brand-mint/10 text-brand-mint rounded-xl hover:bg-brand-mint hover:text-white transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase tracking-tight">Global Promo-kodlar</h2>
              <button onClick={() => { setIsAddingPromo(true); setEditingPromo(createEmptyPromo()); }} className="flex items-center gap-2 px-6 py-3 gradient-mint text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all text-xs">
                <Plus size={18} /> Yangi Promo
              </button>
            </div>
            <div className="grid gap-4">
              {db.promoCodes.map(promo => (
                <div key={promo.id} className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-md flex items-center gap-6 group hover:border-brand-mint/30 transition-all">
                  <div className="w-14 h-14 bg-brand-mint/10 rounded-2xl flex items-center justify-center text-brand-mint">
                    <Ticket size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black uppercase tracking-widest">{promo.code}</h4>
                    <p className="text-xs font-bold opacity-50">
                      {promo.type === 'PERCENT' ? `${promo.value}%` : `${promo.value.toLocaleString()} UZS`} • 
                      Amal qilish muddati: {new Date(promo.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPromo(promo)} className="w-12 h-12 flex items-center justify-center bg-brand-mint/10 text-brand-mint rounded-xl hover:bg-brand-mint hover:text-white transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDeletePromo(promo.id)} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Company & About Tabs UI... */}
      </main>

      {/* Product Edit Modal (existing) */}
      {(editingProduct || isAddingProduct) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/80 backdrop-blur-md">
           {/* ... existing Product Modal UI ... */}
           <div className="bg-white dark:bg-brand-dark w-full max-w-6xl p-8 md:p-10 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] space-y-8 border border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase">{isAddingProduct ? "Yangi Mahsulot" : "Tahrirlash"}</h3>
              <button onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full"><X /></button>
            </div>
            {/* Form Fields for Product */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="font-black text-xs uppercase opacity-30 border-b pb-2">Asosiy</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2">SKU</label>
                  <input className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingProduct?.sku} onChange={e => setEditingProduct({...editingProduct!, sku: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2">Narx</label>
                  <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-2">Stock</label>
                   <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingProduct?.stock} onChange={e => setEditingProduct({...editingProduct!, stock: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-2">Rasm URL</label>
                   <input className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingProduct?.image} onChange={e => setEditingProduct({...editingProduct!, image: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <p className="font-black text-xs uppercase opacity-30 border-b pb-2">Tarjimalar</p>
                <div className="grid md:grid-cols-2 gap-4">
                   {(['uz', 'ru', 'en', 'tr'] as Language[]).map(l => (
                    <div key={l} className="space-y-2 border-l-2 border-brand-mint/20 pl-4 py-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-2">{l.toUpperCase()} Name</label>
                      <input className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/10 outline-none font-bold mb-2" value={editingProduct?.translations[l].name} onChange={e => setEditingProduct({...editingProduct!, translations: { ...editingProduct!.translations, [l]: { ...editingProduct!.translations[l], name: e.target.value } }})} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => handleSaveProduct(editingProduct!)} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 mt-8">
              <Save size={20} /> Mahsulotni saqlash
            </button>
           </div>
        </div>
      )}

      {/* Global Promo Edit Modal */}
      {(editingPromo || isAddingPromo) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/80 backdrop-blur-md">
          <div className="bg-white dark:bg-brand-dark w-full max-w-md p-8 rounded-[3rem] shadow-2xl border border-white/10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase">{isAddingPromo ? "Yangi Promo" : "Tahrirlash"}</h3>
              <button onClick={() => { setEditingPromo(null); setIsAddingPromo(false); }} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">KOD (Masalan: SIMOSH20)</label>
                <input className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold uppercase tracking-widest" value={editingPromo?.code} onChange={e => setEditingPromo({...editingPromo!, code: e.target.value.toUpperCase()})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2">Turi</label>
                  <select className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingPromo?.type} onChange={e => setEditingPromo({...editingPromo!, type: e.target.value as any})}>
                    <option value="PERCENT">Foiz (%)</option>
                    <option value="FIXED">Summa (UZS)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2">Qiymat</label>
                  <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingPromo?.value} onChange={e => setEditingPromo({...editingPromo!, value: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Amal qilish muddati</label>
                <input type="date" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/10 outline-none font-bold" value={editingPromo?.expiry_date?.split('T')[0]} onChange={e => setEditingPromo({...editingPromo!, expiry_date: new Date(e.target.value).toISOString()})} />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" checked={editingPromo?.is_active} onChange={e => setEditingPromo({...editingPromo!, is_active: e.target.checked})} className="w-5 h-5 accent-brand-mint rounded" />
                <span className="font-black text-xs uppercase opacity-40">Faol kod</span>
              </div>
            </div>

            <button onClick={() => handleSavePromo(editingPromo!)} className="w-full py-5 gradient-mint text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
              <Save size={20} /> Promo-kodni saqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
