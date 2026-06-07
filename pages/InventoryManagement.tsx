
import React, { useState, useMemo } from 'react';
import { Product, Service } from '../types';

interface InventoryManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ products, setProducts, services, setServices }) => {
  const [activeTab, setActiveTab] = useState<'inventari' | 'shërbimet'>('inventari');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const isACritical = a.stock <= a.criticalLevel;
      const isBCritical = b.stock <= b.criticalLevel;
      if (isACritical && !isBCritical) return -1;
      if (!isACritical && isBCritical) return 1;
      return a.stock - b.stock;
    });
  }, [products]);

  const handleSave = () => {
    if(!form.name) return;
    
    if(activeTab === 'inventari') {
      const p: Product = {
        ...form,
        id: editingId || Math.random().toString(36).substr(2, 9),
        stock: Number(form.stock || 0),
        criticalLevel: Number(form.criticalLevel || 5),
        unit: form.unit || 'copë',
        category: form.category || 'Përgjithshme'
      };
      if (editingId) setProducts(products.map(item => item.id === editingId ? p : item));
      else setProducts([...products, p]);
    } else {
      // Home Page Limit Logic
      const homeCount = services.filter(s => s.showOnHome && s.id !== editingId).length;
      if (form.showOnHome && homeCount >= 3) {
        alert("Gabim! Mund të shfaqni vetëm 3 shërbime në ballinë njëkohësisht. Ju lutem hiqni një shërbim tjetër së pari.");
        return;
      }

      const s: Service = {
        ...form,
        id: editingId || Math.random().toString(36).substr(2, 9),
        price: Number(form.price || 0),
        durationMinutes: Number(form.durationMinutes || 30),
        category: form.category || 'Prerje',
        description: form.description || '',
        showOnHome: !!form.showOnHome,
        subtitle: form.subtitle || '',
        features: Array.isArray(form.features) ? form.features : (form.featuresText ? form.featuresText.split('\n').filter((x: string) => x.trim()) : [])
      };
      if (editingId) setServices(services.map(item => item.id === editingId ? s : item));
      else setServices([...services, s]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({});
  };

  const openEdit = (item: any) => {
    if (activeTab === 'shërbimet') {
      setForm({
        ...item,
        featuresText: item.features?.join('\n') || ''
      });
    } else {
      setForm(item);
    }
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("A jeni i sigurt?")) {
      if(activeTab === 'inventari') setProducts(products.filter(p => p.id !== id));
      else setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn h-full relative">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic uppercase text-gray-900">Menaxhimi i Burimeve</h2>
          <div className="flex space-x-8 mt-6">
             <button 
               onClick={() => setActiveTab('inventari')}
               className={`text-[11px] font-black uppercase tracking-[0.4em] pb-2 transition-all ${activeTab === 'inventari' ? 'text-[#E91254] border-b-2 border-[#E91254]' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Inventari
             </button>
             <button 
               onClick={() => setActiveTab('shërbimet')}
               className={`text-[11px] font-black uppercase tracking-[0.4em] pb-2 transition-all ${activeTab === 'shërbimet' ? 'text-[#E91254] border-b-2 border-[#E91254]' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Shërbimet
             </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder={activeTab === 'inventari' ? "Kërko produkt..." : "Kërko shërbim..."}
              className="w-full bg-white pl-14 pr-6 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#E91254]/10 focus:outline-none text-xs font-bold text-gray-700 italic"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#E91254] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#E91254]/20 flex flex-shrink-0 items-center hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-plus mr-3"></i> {activeTab === 'inventari' ? 'SHTO PRODUKT' : 'SHTO SHËRBIM'}
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 pb-20">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="border-b border-gray-50">
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">EMRI</th>
              {activeTab === 'inventari' ? (
                <>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">STOKU</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">NJËSIA</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">STATUSI</th>
                </>
              ) : (
                <>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">BALLINË</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">KATEGORIA</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">KOHËZGJATJA</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">ÇMIMI</th>
                </>
              )}
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">VEPRIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activeTab === 'inventari' ? (
              sortedProducts.map(p => (
                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-8 text-sm font-bold text-gray-900 italic">{p.name}</td>
                  <td className="px-8 py-8 text-sm font-medium text-gray-600 italic">{p.stock}</td>
                  <td className="px-8 py-8 text-sm text-gray-400 italic">{p.unit}</td>
                  <td className="px-8 py-8">
                    <StatusBadge stock={p.stock} critical={p.criticalLevel} />
                  </td>
                  <td className="px-8 py-8 text-right space-x-3">
                    <button className="text-gray-300 hover:text-blue-500" onClick={() => openEdit(p)}><i className="fa-solid fa-pen"></i></button>
                    <button className="text-gray-300 hover:text-[#E91254]" onClick={() => handleDelete(p.id)}><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              ))
            ) : (
              services.map(s => (
                <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-8 text-sm font-bold text-gray-900 italic leading-none">{s.name.toUpperCase()}</td>
                  <td className="px-8 py-8 text-center">
                    {s.showOnHome ? (
                      <span className="bg-[#E91254] text-white px-3 py-1 rounded-full text-[8px] font-black">AKTIVE</span>
                    ) : (
                      <span className="text-gray-200"><i className="fa-solid fa-circle text-[8px]"></i></span>
                    )}
                  </td>
                  <td className="px-8 py-8 text-[10px] font-black text-[#E91254] italic uppercase tracking-widest">{s.category}</td>
                  <td className="px-8 py-8 text-sm text-gray-400 italic font-medium">{s.durationMinutes} min</td>
                  <td className="px-8 py-8 text-xl font-black text-gray-900 tracking-tighter italic">€{s.price}</td>
                  <td className="px-8 py-8 text-right space-x-3">
                    <button className="text-gray-300 hover:text-blue-500" onClick={() => openEdit(s)}><i className="fa-solid fa-pen"></i></button>
                    <button className="text-gray-300 hover:text-[#E91254]" onClick={() => handleDelete(s.id)}><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl p-12 shadow-3xl animate-fadeIn overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-8">
                {editingId ? 'Edito' : 'Shto'} {activeTab === 'inventari' ? 'Produkt' : 'Shërbim'}
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">EMRI</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
                 </div>
                 
                 {activeTab === 'shërbimet' && (
                   <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 space-y-4">
                      <div className="flex items-center space-x-4">
                         <input 
                           type="checkbox" 
                           id="showOnHome" 
                           className="w-6 h-6 accent-[#E91254] cursor-pointer"
                           checked={form.showOnHome || false}
                           onChange={e => setForm({...form, showOnHome: e.target.checked})}
                         />
                         <label htmlFor="showOnHome" className="text-[10px] font-black uppercase tracking-widest text-gray-900 cursor-pointer">VENDOS NË BALLINË (MAX 3)</label>
                      </div>
                      
                      {form.showOnHome && (
                        <div className="space-y-4 animate-fadeIn">
                           <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">NËNTITULLI (P.SH. INVESTONI NË VETEN TUAJ)</label>
                              <input type="text" className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#E91254] outline-none" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">PIKAT KRYESORE (NJË PËR RRRESHT)</label>
                              <textarea className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#E91254] outline-none h-24" value={form.featuresText || ''} onChange={e => setForm({...form, featuresText: e.target.value})} placeholder="P.sh.&#10;KONSULTIM&#10;LARJE LUKSOZE"></textarea>
                           </div>
                        </div>
                      )}
                   </div>
                 )}

                 {activeTab === 'inventari' ? (
                   <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">STOKU</label>
                          <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.stock || 0} onChange={e => setForm({...form, stock: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">LIMITI KRITIK</label>
                          <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.criticalLevel || 5} onChange={e => setForm({...form, criticalLevel: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">NJËSIA (p.sh. copë, set, tubeta)</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.unit || ''} onChange={e => setForm({...form, unit: e.target.value})} />
                    </div>
                   </>
                 ) : (
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">ÇMIMI (€)</label>
                        <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.price || 0} onChange={e => setForm({...form, price: e.target.value})} />
                     </div>
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">KOHA (MIN)</label>
                        <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.durationMinutes || 30} onChange={e => setForm({...form, durationMinutes: e.target.value})} />
                     </div>
                   </div>
                 )}
                 <div className="flex gap-4 pt-6">
                    <button className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest" onClick={closeModal}>Anulo</button>
                    <button className="flex-1 py-4 bg-[#E91254] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg" onClick={handleSave}>Konfirmo</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ stock, critical }: { stock: number, critical: number }) => {
  if (stock === 0) return <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest">Pa Stok</span>;
  if (stock <= critical) return <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest">Mbetje e Pakët</span>;
  return <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest">Në Rregull</span>;
};

export default InventoryManagement;
