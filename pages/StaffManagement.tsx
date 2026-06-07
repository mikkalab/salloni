
import React, { useState, useRef } from 'react';
import { Staff, Role } from '../types';

interface StaffManagementProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ staff, setStaff }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<Partial<Staff>>({
    name: '',
    role: 'stilist',
    shift: '09:00 - 17:00',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
    skills: []
  });

  const handleSave = () => {
    if(!form.name) return;
    if (editingId) {
      setStaff(staff.map(s => s.id === editingId ? { ...s, ...form } as Staff : s));
    } else {
      const member: Staff = {
        ...form as Staff,
        id: Math.random().toString(36).substr(2, 9),
        bio: ''
      };
      setStaff([...staff, member]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      name: '',
      role: 'stilist',
      shift: '09:00 - 17:00',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
      skills: []
    });
  };

  const openEdit = (s: Staff) => {
    setForm(s);
    setEditingId(s.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("A jeni i sigurt që dëshironi të fshini këtë anëtar?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    const skills = form.skills || [];
    if (skills.includes(skill)) {
      setForm({ ...form, skills: skills.filter(s => s !== skill) });
    } else {
      setForm({ ...form, skills: [...skills, skill] });
    }
  };

  const availableSkills = ['Prerje', 'Ngjyrosje', 'Stilim', 'Trajtim', 'Nuse', 'Fëmijë'];

  return (
    <div className="space-y-12 animate-fadeIn h-full relative">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic uppercase text-gray-900">Menaxhimi i Stafit</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2 italic">SKUADRA PROFESIONALE E FLOK STUDIO</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#E91254] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#E91254]/20 flex items-center hover:scale-105 transition-all"
        >
          <i className="fa-solid fa-plus mr-3"></i> SHTO ANËTAR
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-700 group">
             <div className="p-10 flex items-center space-x-6 border-b border-gray-50">
                <div className="relative">
                  <img src={member.photo} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700" alt={member.name} />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">{member.name.toUpperCase()}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 italic mt-2">{member.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills?.map(skill => (
                      <span key={skill} className="bg-gray-100 text-[8px] font-black text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">{skill}</span>
                    ))}
                  </div>
                </div>
             </div>
             <div className="p-10 bg-gray-50/30 flex items-center justify-between">
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">ORARI I PUNËS</p>
                   <p className="text-sm font-bold text-gray-700">{member.shift || '09:00 - 17:00'}</p>
                </div>
                <div className="flex space-x-2">
                   <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm" onClick={() => openEdit(member)}>
                      <i className="fa-solid fa-pen text-xs"></i>
                   </button>
                   <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-[#E91254] hover:bg-[#E91254] hover:text-white transition-all shadow-sm" onClick={() => handleDelete(member.id)}>
                      <i className="fa-regular fa-trash-can text-xs"></i>
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
           <div className="bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-3xl animate-fadeIn overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase">{editingId ? 'Edito Anëtar' : 'Shto Anëtar'}</h3>
                <button onClick={closeModal} className="text-gray-400"><i className="fa-solid fa-xmark text-2xl"></i></button>
              </div>
              
              <div className="space-y-6">
                 <div className="flex justify-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                       <img src={form.photo} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-gray-50 shadow-xl" />
                       <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <i className="fa-solid fa-camera text-white text-2xl"></i>
                       </div>
                       <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">EMRI I PLOTË</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">ROLI</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})}>
                         <option value="stilist">STILIST</option>
                         <option value="menaxher">MENAXHER</option>
                         <option value="recepsionist">RECEPSIONIST</option>
                         <option value="asistent">ASISTENT</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">ORARI</label>
                      <input type="text" placeholder="09:00 - 17:00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-[#E91254] outline-none" value={form.shift} onChange={e => setForm({...form, shift: e.target.value})} />
                    </div>
                 </div>

                 <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 block italic">SPECIALIZIMET (TAGS)</label>
                    <div className="flex flex-wrap gap-2">
                       {availableSkills.map(s => (
                         <button 
                           key={s} 
                           onClick={() => toggleSkill(s)}
                           className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${form.skills?.includes(s) ? 'bg-[#E91254] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <button className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest" onClick={closeModal}>Anulo</button>
                    <button className="flex-1 py-4 bg-[#E91254] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg" onClick={handleSave}>Ruaj Ndryshimet</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
