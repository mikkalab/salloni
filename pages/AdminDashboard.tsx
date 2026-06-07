
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Product, Service, Staff } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  appointments: Appointment[];
  products: Product[];
  services: Service[];
  staff: Staff[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, products, services, staff }) => {
  const navigate = useNavigate();
  const todayDate = '2026-01-30';
  const todayAppts = appointments.filter(a => a.startTime.startsWith(todayDate));
  const yesterdayDate = '2026-01-29';
  const yesterdayCount = appointments.filter(a => a.startTime.startsWith(yesterdayDate)).length;
  
  const diff = todayAppts.length - yesterdayCount;
  const subText = diff >= 0 ? `+${diff} NGA DJE` : `${diff} NGA DJE`;

  const criticalCount = products.filter(p => p.stock <= p.criticalLevel).length;
  const activeStaffCount = staff.length; 

  const data = [
    { name: 'Hën', val: 12 },
    { name: 'Mar', val: 18 },
    { name: 'Mër', val: 15 },
    { name: 'Enj', val: 22 },
    { name: 'Pre', val: todayAppts.length + 20 },
    { name: 'Sht', val: 30 },
    { name: 'Die', val: 20 },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase text-gray-900">Paneli i Kontrollit</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2">STATUSI I SALONIT PËR SOT</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-600 italic">
          30 JANAR 2026
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashCard 
          label="REZERVIME SOT" 
          value={todayAppts.length} 
          subValue={subText} 
          dotColor="bg-blue-300" 
          onClick={() => navigate('/admin/orari')}
        />
        <DashCard 
          label="PRODUKTE KRITIKE" 
          value={criticalCount} 
          subValue="NEVOJË PËR STOK" 
          dotColor="bg-[#E91254]" 
          onClick={() => navigate('/admin/inventari')}
        />
        <DashCard 
          label="STILISTË AKTIVË" 
          value={activeStaffCount} 
          subValue="TË GJITHË NË ORAR" 
          dotColor="bg-purple-300" 
          onClick={() => navigate('/admin/stafi')}
        />
        <DashCard 
          label="ONLINE REZ." 
          value={appointments.filter(a => a.isOnline).length} 
          subValue="PËRMES UEBSAJTIT" 
          dotColor="bg-pink-300" 
          isLast 
          onClick={() => navigate('/admin/orari')}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-10">Analitika e Javës - Rezervimet</h3>
           <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="val" radius={[8, 8, 8, 8]} barSize={40}>
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 4 ? '#E91254' : '#f1f5f9'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="w-full lg:w-[400px] bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-gray-900 mb-8">Lista e Detyrave (Hapja)</h3>
           <div className="space-y-6 flex-1">
              <TaskItem label="Hapja e sistemit dhe kasës" />
              <TaskItem label="Kontrolli i rezervimeve të ditës" />
              <TaskItem label="Dezinfektimi i mjeteve" />
              <TaskItem label="Përgatitja e peshqirëve" />
              <TaskItem label="Verifikimi i stokut bazë" />
           </div>
           <button className="mt-12 w-full py-5 bg-gray-50 text-gray-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-colors italic">
              Shiko Protokollet e Mbylljes
           </button>
        </div>
      </div>
    </div>
  );
};

const DashCard = ({ label, value, subValue, dotColor, isLast = false, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer"
  >
    <div className={`absolute top-10 right-10 w-3 h-3 rounded-full ${dotColor} opacity-40 group-hover:scale-150 transition-transform`}></div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 italic">{label}</p>
    <div className="flex flex-col">
      <span className="text-6xl font-black text-gray-900 tracking-tighter mb-2 italic">{value}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isLast ? 'text-green-500' : 'text-[#E91254]'} italic`}>{subValue}</span>
    </div>
  </div>
);

const TaskItem = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
    <div className="w-6 h-6 border-2 border-gray-200 rounded-lg flex items-center justify-center group-hover:border-[#E91254] transition-all">
      <div className="w-2 h-2 bg-[#E91254] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors italic">{label}</span>
  </div>
);

export default AdminDashboard;
