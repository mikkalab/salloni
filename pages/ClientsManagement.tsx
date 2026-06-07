
import React, { useState, useMemo } from 'react';
import { Appointment, Service } from '../types';

interface ClientsManagementProps {
  appointments: Appointment[];
  services: Service[];
  clientNotes: Record<string, string>;
  updateClientNotes: (phone: string, note: string) => void;
}

interface ClientSummary {
  phone: string;
  name: string;
  lastVisit: string;
  appointmentCount: number;
}

const ClientsManagement: React.FC<ClientsManagementProps> = ({ appointments, services, clientNotes, updateClientNotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientPhone, setSelectedClientPhone] = useState<string | null>(null);

  // Derive unique clients from appointments
  const clients = useMemo(() => {
    const map = new Map<string, ClientSummary>();
    
    appointments.forEach(appt => {
      const phone = appt.clientPhone || 'Unknown';
      const existing = map.get(phone);
      
      const apptDate = new Date(appt.startTime).toISOString().split('T')[0];
      
      if (!existing || apptDate > existing.lastVisit) {
        map.set(phone, {
          phone,
          name: appt.clientName,
          lastVisit: apptDate,
          appointmentCount: (existing?.appointmentCount || 0) + 1
        });
      } else {
        existing.appointmentCount += 1;
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    ).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  }, [clients, searchTerm]);

  const selectedClient = useMemo(() => {
    return clients.find(c => c.phone === selectedClientPhone);
  }, [clients, selectedClientPhone]);

  const clientHistory = useMemo(() => {
    if (!selectedClientPhone) return [];
    return appointments
      .filter(a => a.clientPhone === selectedClientPhone)
      .sort((a, b) => b.startTime.localeCompare(a.startTime));
  }, [appointments, selectedClientPhone]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedClientPhone) {
      updateClientNotes(selectedClientPhone, e.target.value);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sq-AL', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-12 animate-fadeIn h-full relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic uppercase text-gray-900">Direktoria e Klientëve</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2 italic">MENAXHIMI I BAZËS SË TË DHËNAVE</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
          <input 
            type="text" 
            placeholder="Kërko me Emër ose Telefon..."
            className="w-full bg-white pl-14 pr-6 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#E91254]/10 focus:outline-none text-xs font-bold text-gray-700 italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 pb-20">
        {/* Clients List */}
        <div className="flex-1 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">KLIENTI</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">TELEFONI</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">VIZITA E FUNDIT</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">TAKIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map(c => (
                  <tr 
                    key={c.phone} 
                    onClick={() => setSelectedClientPhone(c.phone)}
                    className={`group cursor-pointer transition-colors ${selectedClientPhone === c.phone ? 'bg-pink-50/50' : 'hover:bg-gray-50/50'}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] uppercase italic ${selectedClientPhone === c.phone ? 'bg-[#E91254] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {c.name.split(' ').map(n => n[0]).join('').substr(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-gray-900 uppercase italic">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-mono tracking-tighter">{c.phone}</td>
                    <td className="px-8 py-6 text-sm text-gray-400 italic font-medium">{formatDate(c.lastVisit)}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[9px] font-black">{c.appointmentCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Profile Panel */}
        <div className="w-full lg:w-[450px] space-y-8 animate-fadeIn">
          {selectedClient ? (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 space-y-8">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900 leading-none">{selectedClient.name}</h3>
                      <p className="text-sm font-bold text-[#E91254] tracking-tighter">{selectedClient.phone}</p>
                   </div>
                   <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-[#E91254] border border-gray-100">
                      <i className="fa-solid fa-user text-2xl"></i>
                   </div>
                </div>

                <div className="h-[1px] bg-gray-50"></div>

                {/* Smart Notes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Shënime Interne (Smart Notes)</label>
                    {clientNotes[selectedClient.phone] && <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">E RUAJTUR</span>}
                  </div>
                  <textarea 
                    className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm focus:border-[#E91254] focus:ring-2 focus:ring-[#E91254]/5 outline-none resize-none italic font-medium text-gray-600"
                    placeholder="Shto shënime specifike për këtë klient (p.sh. alergjitë, preferencat e ngjyrës...)"
                    value={clientNotes[selectedClient.phone] || ''}
                    onChange={handleNoteChange}
                  ></textarea>
                  <p className="text-[9px] text-gray-400 italic">Këto shënime do të shfaqen automatikisht gjatë rezervimit të ardhshëm të këtij klienti.</p>
                </div>
              </div>

              {/* History List */}
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col h-[500px]">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic mb-8 flex items-center">
                   <i className="fa-solid fa-history mr-3 text-[#E91254]"></i> Histori Takimesh (Module B)
                </h4>
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
                  {clientHistory.map(appt => (
                    <div key={appt.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-[#E91254]/20 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-[#E91254] uppercase tracking-widest italic">{services.find(s => s.id === appt.serviceId)?.name || 'Shërbim'}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${appt.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{appt.status}</span>
                       </div>
                       <p className="text-xl font-black italic text-gray-900 tracking-tighter uppercase">{formatDate(appt.startTime)}</p>
                       <p className="text-[10px] font-bold text-gray-400 mt-2 italic uppercase">Ora {new Date(appt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[3rem] p-12 text-center">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                 <i className="fa-solid fa-address-book text-gray-200 text-3xl"></i>
               </div>
               <h3 className="text-lg font-bold text-gray-400 uppercase tracking-tighter italic">Asnjë klient i zgjedhur</h3>
               <p className="text-sm text-gray-400 mt-2 italic">Zgjidhni një klient nga lista për të parë historinë dhe shënimet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsManagement;
