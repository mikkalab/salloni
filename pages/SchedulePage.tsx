
import React, { useState, useEffect, useRef } from 'react';
import { Appointment, Service, Staff } from '../types';

interface SchedulePageProps {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
  updateAppointment: (appt: Appointment) => void;
  deleteAppointment: (id: string) => void;
  onEnter: () => void;
  addAppointment: (appt: Appointment) => void;
}

// Reduktuar me 30% nga 160 në 112
const SLOT_HEIGHT = 112; 
const START_HOUR = 9;

const SchedulePage: React.FC<SchedulePageProps> = ({ appointments, services, staff, addAppointment, updateAppointment, deleteAppointment }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  // Shtimi i lundrimit të datës
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  
  const [form, setForm] = useState<any>({
    clientName: '',
    serviceId: services[0]?.id || '',
    staffId: staff[0]?.id || '',
    status: 'confirmed',
    manualDuration: '30', 
    startTime: ''
  });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeSlots = [];
  for (let h = START_HOUR; h <= 20; h++) {
    timeSlots.push(`${h < 10 ? '0'+h : h}:00`);
    timeSlots.push(`${h < 10 ? '0'+h : h}:30`);
  }

  const todayStr = currentViewDate.toISOString().split('T')[0];
  const viewAppts = appointments.filter(a => a.startTime.startsWith(todayStr));

  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= START_HOUR && currentHour <= 20) {
        const index = (currentHour - START_HOUR) * 2 + (now.getMinutes() >= 30 ? 1 : 0);
        const offset = index * SLOT_HEIGHT;
        scrollContainerRef.current.scrollTop = offset - 100;
      }
    }
  }, []);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentViewDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentViewDate(newDate);
  };

  const resetToToday = () => setCurrentViewDate(new Date());

  const handleSaveBooking = () => {
    if (!form.clientName || (selectedTimes.length === 0 && !editingAppointment)) {
      alert("Ju lutem plotësoni emrin dhe zgjidhni kohën.");
      return;
    }

    const service = services.find(s => s.id === form.serviceId);
    let startTimeStr = '';
    
    if (selectedTimes.length > 0) {
      startTimeStr = `${todayStr}T${selectedTimes[0]}:00`;
    } else if (editingAppointment) {
      startTimeStr = editingAppointment.startTime;
    }

    const durationNum = parseInt(form.manualDuration);
    const duration = isNaN(durationNum) ? (service?.durationMinutes || 30) : durationNum;
    
    const startObj = new Date(startTimeStr);
    const endTimeStr = new Date(startObj.getTime() + duration * 60000).toISOString();
    const endObj = new Date(endTimeStr);

    const hasOverlap = appointments.some(appt => {
      if (appt.id === editingAppointment?.id) return false;
      if (appt.staffId !== form.staffId) return false;
      const apptStart = new Date(appt.startTime);
      const apptEnd = appt.endTime ? new Date(appt.endTime) : new Date(apptStart.getTime() + (services.find(s => s.id === appt.serviceId)?.durationMinutes || 30) * 60000);
      return startObj < apptEnd && endObj > apptStart;
    });

    if (hasOverlap) {
      alert("Kujdes! Ky orar përplaset me një takim tjetër të këtij stilisti.");
      return;
    }

    const apptData: Appointment = {
      ...(editingAppointment || {}),
      ...form,
      id: editingAppointment?.id || Math.random().toString(36).substr(2, 9),
      startTime: startTimeStr,
      endTime: endTimeStr,
    } as Appointment;

    if (editingAppointment) {
      updateAppointment(apptData);
    } else {
      addAppointment(apptData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setSelectedTimes([]);
    setForm({
      clientName: '',
      serviceId: services[0]?.id || '',
      staffId: staff[0]?.id || '',
      status: 'confirmed',
      manualDuration: '30',
      startTime: ''
    });
  };

  const openEdit = (appt: Appointment) => {
    const service = services.find(s => s.id === appt.serviceId);
    const duration = appt.endTime 
      ? (new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000 
      : (service?.durationMinutes || 30);

    const timePart = appt.startTime.split('T')[1].substring(0, 5);
    
    setEditingAppointment(appt);
    setForm({ 
      ...appt, 
      manualDuration: duration.toString(),
      startTime: appt.startTime 
    });
    setSelectedTimes([timePart]);
    setShowModal(true);
  };

  const getApptStyle = (appt: Appointment) => {
    const timePart = appt.startTime.split('T')[1]; 
    const [h, m] = timePart.split(':').map(Number);
    
    const service = services.find(s => s.id === appt.serviceId);
    const duration = appt.endTime 
      ? (new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000 
      : (service?.durationMinutes || 30);
    
    const totalMinutesFromStartOfDay = (h - START_HOUR) * 60 + m;
    const slotsFromStart = totalMinutesFromStartOfDay / 30;
    
    const top = slotsFromStart * SLOT_HEIGHT;
    const height = (duration / 30) * SLOT_HEIGHT;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  const formatHeaderDate = () => {
    return currentViewDate.toLocaleDateString('sq-AL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();
  };

  return (
    <div className="space-y-10 animate-fadeIn h-full flex flex-col relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#E91254] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#E91254]/30 shrink-0">
            <i className="fa-solid fa-calendar-days text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter italic uppercase text-gray-900">Kalendari i Salonit</h2>
            <div className="flex items-center space-x-3 mt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{formatHeaderDate()}</p>
              <button onClick={resetToToday} className="text-[8px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200">SOT</button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center bg-gray-100/50 p-1.5 rounded-2xl shadow-inner">
            <button onClick={() => navigateDate('prev')} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
            <button 
              onClick={() => setViewMode('day')} 
              className={`px-4 lg:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
            >DITË</button>
            <button 
              onClick={() => setViewMode('week')} 
              className={`px-4 lg:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
            >JAVË</button>
            <button 
              onClick={() => setViewMode('month')} 
              className={`px-4 lg:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
            >MUAJ</button>
            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
            <button onClick={() => navigateDate('next')} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#E91254] text-white px-6 lg:px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#E91254]/20 flex items-center hover:scale-105 transition-all shrink-0"
          >
            <i className="fa-solid fa-plus mr-3"></i> REZERVIM
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] lg:rounded-[3rem] border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[500px]">
        {viewMode === 'day' ? (
          <>
            <div className="flex bg-gray-50/50 border-b border-gray-100 px-4 lg:px-8 py-6 z-20">
               <div className="w-16 lg:w-24 text-[10px] font-black text-gray-400 uppercase italic">ORA</div>
               <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-6">
                  {staff.map(s => (
                    <div key={s.id} className="text-center">
                       <p className="text-xs lg:text-sm font-black text-gray-900 tracking-tighter italic leading-none uppercase truncate">{s.name}</p>
                       <p className="text-[8px] font-black text-[#E91254] uppercase tracking-widest mt-1 opacity-70 italic truncate">{s.role}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 lg:px-8 custom-scrollbar scroll-smooth relative">
              <div className="relative">
                 {timeSlots.map((time, idx) => (
                   <div key={idx} className="flex border-b border-gray-50" style={{ height: `${SLOT_HEIGHT}px` }}>
                      <div className="w-16 lg:w-24 text-[10px] font-bold text-gray-300 pt-2 italic">{time}</div>
                      <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-6 relative">
                         {staff.map(member => (
                           <div key={member.id} className="border-r border-gray-50/50 last:border-none"></div>
                         ))}
                      </div>
                   </div>
                 ))}

                 <div className="absolute inset-0 left-16 lg:left-24 pointer-events-none">
                    <div className="grid grid-cols-3 gap-4 lg:gap-6 h-full">
                      {staff.map(member => (
                        <div key={member.id} className="relative h-full">
                           {viewAppts
                             .filter(a => a.staffId === member.id)
                             .map(appt => (
                               <div 
                                 key={appt.id} 
                                 className="absolute left-1 right-1 lg:left-2 lg:right-2 z-10 pointer-events-auto" 
                                 style={getApptStyle(appt)}
                               >
                                  <div className="relative h-full w-full group">
                                    <div onClick={() => openEdit(appt)} className="h-full w-full cursor-pointer">
                                      <AppointmentCard 
                                        time={new Date(appt.startTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})} 
                                        client={appt.clientName} 
                                        service={services.find(s => s.id === appt.serviceId)?.name || 'Shërbim'}
                                        status={appt.status}
                                        duration={(appt.endTime ? (new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000 : 30)}
                                        onDelete={(e: React.MouseEvent) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (window.confirm("A jeni të sigurt që dëshironi të fshini këtë takim?")) {
                                            deleteAppointment(appt.id);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                               </div>
                             ))
                           }
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
               <i className="fa-solid fa-layer-group text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-tighter italic">Pamja {viewMode === 'week' ? 'Javore' : 'Mujore'} në Zhvillim</h3>
            <p className="text-sm text-gray-400 max-w-sm italic">Kjo pamje është planifikuar për përditësimin e radhës. Përdorni pamjen ditore për menaxhimin e takimeve aktualisht.</p>
            <button onClick={() => setViewMode('day')} className="text-[10px] font-black text-[#E91254] uppercase tracking-widest border-b border-[#E91254]">KTHEHU TE DITA</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-fadeIn">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-black italic tracking-tighter uppercase text-gray-900">{editingAppointment ? 'Edito Takimin' : 'Shto Rezervim Manual'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-900"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              
              <div className="p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">Klienti</label>
                       <input type="text" placeholder="Emri i klientit" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-[#E91254]" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">Shërbimi</label>
                       <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-[#E91254]" value={form.serviceId} onChange={e => setForm({...form, serviceId: e.target.value})}>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name} - {s.durationMinutes}min</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">Kohëzgjatja (Minuta)</label>
                       <input 
                         type="text" 
                         inputMode="numeric"
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-[#E91254]" 
                         value={form.manualDuration} 
                         onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setForm({...form, manualDuration: val});
                         }} 
                       />
                       <p className="text-[9px] text-gray-400 mt-2 italic">Ndryshoni manualisht për kontroll të plotë mbi orarin.</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">Stilisti</label>
                       <div className="flex gap-4">
                          {staff.map(s => (
                            <button key={s.id} onClick={() => setForm({...form, staffId: s.id})} className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${form.staffId === s.id ? 'border-[#E91254] scale-110 shadow-lg' : 'border-transparent grayscale opacity-50'}`}>
                               <img src={s.photo} className="w-full h-full object-cover" alt={s.name} />
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block italic">Zgjidh Orën e Fillimit</label>
                       <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {timeSlots.map(t => (
                            <button 
                              key={t} 
                              onClick={() => setSelectedTimes([t])}
                              className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${selectedTimes.includes(t) ? 'bg-[#E91254] text-white border-[#E91254]' : 'bg-white border-gray-100 text-gray-400 hover:border-[#E91254]'}`}
                            >
                              {t}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="bg-pink-50 rounded-3xl p-6 lg:p-8 border border-pink-100 text-center">
                       <p className="text-[10px] font-black uppercase text-[#E91254] tracking-widest italic mb-2">KOHA E RE</p>
                       <h4 className="text-2xl font-black italic text-gray-900 tracking-tighter">
                          {selectedTimes.length > 0 ? selectedTimes[0] : (editingAppointment ? editingAppointment.startTime.split('T')[1].substring(0, 5) : 'Asnjë')}
                       </h4>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-gray-50 flex justify-end items-center">
                 <div className="flex space-x-4">
                   <button onClick={closeModal} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Anulo</button>
                   <button 
                     onClick={handleSaveBooking}
                     className="bg-[#E91254] text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#E91254]/20 flex items-center hover:scale-105 transition-all"
                   >
                     <i className="fa-solid fa-check mr-3"></i> {editingAppointment ? 'Ruaj Ndryshimet' : 'Konfirmo Rezervimin'}
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const AppointmentCard = ({ time, client, service, status, duration, onDelete }: any) => (
  <div className={`bg-pink-50 border-l-[6px] border-[#E91254] rounded-[1.2rem] lg:rounded-[1.5rem] p-3 lg:p-6 shadow-xl h-full flex flex-col transition-all duration-300 backdrop-blur-sm relative overflow-hidden group`}>
    <button 
      onClick={onDelete}
      className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white text-[#E91254] flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-[#E91254] hover:text-white z-50 shadow-lg active:scale-90 border border-gray-100 pointer-events-auto"
      title="Fshij Takimin"
    >
      <i className="fa-solid fa-xmark text-sm"></i>
    </button>

    <div className="flex justify-between items-start mb-2 lg:mb-4">
       <div className="bg-white px-2 lg:px-4 py-1 rounded-full text-[8px] lg:text-[10px] font-black text-[#E91254] shadow-md shrink-0 uppercase italic">
          {time}
       </div>
       <div className={`w-2 h-2 rounded-full ${status === 'confirmed' ? 'bg-green-500' : 'bg-orange-400'} shadow-sm shrink-0`}></div>
    </div>
    
    <div className="flex-1 min-w-0">
      <h4 className="text-sm lg:text-xl font-black text-gray-900 tracking-tighter leading-none italic uppercase mb-0.5 lg:mb-1 truncate">{client}</h4>
      <p className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-80 truncate">{service}</p>
    </div>

    <div className="mt-auto pt-2 lg:pt-4 flex items-center justify-center space-x-2 lg:space-x-4">
       <div className="flex-1 h-[1px] bg-pink-200/50"></div>
       <span className="text-[8px] lg:text-[10px] font-black text-pink-300 italic uppercase tracking-[0.2em] whitespace-nowrap">{duration} MIN</span>
       <div className="flex-1 h-[1px] bg-pink-200/50"></div>
    </div>
  </div>
);

export default SchedulePage;
