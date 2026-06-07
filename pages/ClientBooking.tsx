import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Service, Staff, Appointment, SiteConfig } from '../types';

interface ClientBookingProps {
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];
  addAppointment: (appt: Appointment) => void;
  config: SiteConfig;
  setConfig?: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isEditMode?: boolean;
}

const ClientBooking: React.FC<ClientBookingProps> = ({ services, staff, appointments, addAppointment, config, setConfig, isEditMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentTime.toISOString().split('T')[0];
  
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isLoadingClient, setIsLoadingClient] = useState(false);

  const updateText = (field: keyof SiteConfig, value: string) => {
    if (setConfig) {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const InlineText = ({ field, className = "" }: { field: keyof SiteConfig, className?: string }) => (
    <span
      contentEditable={isEditMode}
      suppressContentEditableWarning
      onBlur={(e) => updateText(field, e.currentTarget.innerText)}
      className={`${className} transition-all duration-300 ${isEditMode ? 'outline-dashed outline-1 outline-[#E91254]/40 cursor-text px-1 bg-[#E91254]/5 rounded-sm hover:outline-[#E91254]' : ''}`}
    >
      {config[field] as string}
    </span>
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceId = params.get('serviceId');
    if (serviceId && services.find(s => s.id === serviceId)) {
      setSelectedService(serviceId);
      setStep(2);
    }
  }, [location.search, services]);

  const currentService = useMemo(() => services.find(s => s.id === selectedService), [selectedService, services]);
  const currentStaff = useMemo(() => staff.find(s => s.id === selectedStaff), [selectedStaff, staff]);

  const validatePhone = (phone: string) => {
    return /^0\d{8}$/.test(phone);
  };

  useEffect(() => {
    const searchClient = async () => {
      if (clientPhone.length === 9 && validatePhone(clientPhone)) {
        setIsLoadingClient(true);
        try {
          if (clientPhone === "044111222") {
             setTimeout(() => {
                const fullName = "BESIM MIKULLOVCI";
                const parts = fullName.split(' ');
                setFirstName(parts[0] || "");
                setLastName(parts.slice(1).join(' ') || "");
                setIsReturning(true);
                setIsLoadingClient(false);
             }, 500);
          } else {
             setIsReturning(false);
             setIsLoadingClient(false);
          }
        } catch (error) {
          console.error("Gabim gjatë kërkimit të klientit:", error);
          setIsLoadingClient(false);
        }
      } else {
        setIsReturning(false);
      }
    };
    searchClient();
  }, [clientPhone]);

  const areDetailsFilled = useMemo(() => {
    return validatePhone(clientPhone) && firstName.trim().length >= 2 && lastName.trim().length >= 2;
  }, [clientPhone, firstName, lastName]);

  const isFormValid = useMemo(() => {
    return areDetailsFilled && termsAccepted && selectedService && time && date;
  }, [areDetailsFilled, termsAccepted, selectedService, time, date]);

  const getSlotAvailability = (slotTime: string) => {
    if (!selectedStaff || !date) return 'free';
    
    const [h, m] = slotTime.split(':').map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(h, m, 0, 0);
    
    if (slotDateTime < currentTime) return 'past';

    const slotStart = new Date(`${date}T${slotTime}:00`);
    const isBusy = appointments.some(appt => {
      if (appt.staffId !== selectedStaff || !appt.startTime) return false;
      const apptStart = new Date(appt.startTime);
      let apptEnd: Date;
      if (appt.endTime) {
        apptEnd = new Date(appt.endTime);
      } else {
        const service = services.find(s => s.id === appt.serviceId);
        apptEnd = new Date(apptStart.getTime() + (service?.durationMinutes || 30) * 60000);
      }
      const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
      return slotStart < apptEnd && slotEnd > apptStart;
    });
    return isBusy ? 'busy' : 'free';
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !currentService) return;

    const startTimeStr = `${date}T${time}:00`;
    const startObj = new Date(startTimeStr);
    const endObj = new Date(startObj.getTime() + currentService.durationMinutes * 60000);
    const endTimeStr = endObj.toISOString();

    const hasOverlap = appointments.some(appt => {
      if (appt.staffId !== selectedStaff) return false;
      const apptStart = new Date(appt.startTime);
      const apptEnd = appt.endTime ? new Date(appt.endTime) : new Date(apptStart.getTime() + (services.find(s => s.id === appt.serviceId)?.durationMinutes || 30) * 60000);
      return startObj < apptEnd && endObj > apptStart;
    });

    if (hasOverlap) {
      alert("Ky orar përplaset me një takim ekzistues. Ju lutem zgjidhni një kohë tjetër.");
      return;
    }

    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: `${firstName.trim()} ${lastName.trim()}`,
      clientEmail: '',
      clientPhone: clientPhone,
      serviceId: selectedService,
      staffId: selectedStaff,
      startTime: startTimeStr,
      endTime: endTimeStr,
      status: 'pending',
      isOnline: true
    };
    addAppointment(newAppt);
    setStep(5);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sq-AL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
    '18:00', '18:30'
  ];

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h} orë${m > 0 ? ` ${m} min` : ''}`;
    return `${m} min`;
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(v => v + 1);
    } else {
      setViewMonth(v => v + 1);
    }
  };

  const prevMonth = () => {
    const currentRealMonth = new Date().getMonth();
    const currentRealYear = new Date().getFullYear();
    if (viewYear === currentRealYear && viewMonth <= currentRealMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(v => v - 1);
    } else {
      setViewMonth(v => v - 1);
    }
  };

  const monthNames = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const Navigation = () => (
    <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 left-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={config.logoImage} alt="FLOK Logo" className="h-[78px] lg:h-[100px] w-auto object-contain transition-soft" />
        </Link>
        <div className="hidden lg:flex items-center space-x-12 text-[10px] font-bold uppercase tracking-[0.25em]">
          <Link to="/" className="hover:text-[#E91254] transition-colors">Ballina</Link>
          <button onClick={() => setStep(1)} className={`${step === 1 ? 'text-[#E91254]' : 'hover:text-[#E91254]'} transition-colors uppercase`}>Shërbimet</button>
          <Link to="/gallery" className="hover:text-[#E91254] transition-colors">Galeria</Link>
          <Link to="/contact" className="hover:text-[#E91254] transition-colors">Kontakti</Link>
          <button onClick={() => setStep(1)} className="px-8 py-3 bg-[#E91254] text-white rounded-full font-black tracking-widest hover:scale-105 transition-all">REZERVO TAKIMIN</button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className={`min-h-screen bg-black text-white font-sans selection:bg-[#E91254] overflow-x-hidden ${isEditMode ? 'pt-10' : ''}`}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-40">
        <div className="pt-40">
           {step < 5 && (
              <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 p-4 lg:p-6 rounded-full max-w-4xl mx-auto flex items-center justify-between mb-24 px-8 lg:px-12 shadow-2xl animate-fadeIn overflow-x-auto gap-4 custom-scrollbar text-left">
                {[
                  { n: 1, l: 'Katalogu', i: 'fa-list-ul' },
                  { n: 2, l: 'Stilisti', i: 'fa-user-tie' },
                  { n: 3, l: 'Koha', i: 'fa-clock' },
                  { n: 4, l: 'Detajet', i: 'fa-id-card' }
                ].map((s) => (
                  <div key={s.n} className="flex items-center space-x-3 whitespace-nowrap">
                    <div className={`w-8 h-8 lg:w-11 lg:h-11 rounded-full flex items-center justify-center transition-all duration-700 shrink-0 ${step >= s.n ? 'bg-[#E91254] text-white shadow-[0_0_25px_rgba(233,18,84,0.4)]' : 'bg-neutral-800 text-neutral-500'}`}>
                      <i className={`fa-solid ${s.i} text-[10px] lg:text-sm`}></i>
                    </div>
                    <span className={`hidden md:block text-[10px] font-black uppercase tracking-[0.2em] ${step >= s.n ? 'text-white' : 'text-neutral-600'}`}>{s.l}</span>
                    {s.n < 4 && <div className={`hidden lg:block w-10 h-[1px] ${step > s.n ? 'bg-[#E91254]' : 'bg-neutral-800'} mx-2`}></div>}
                  </div>
                ))}
              </div>
           )}

           {step === 4 ? (
              <div className="animate-fadeIn max-w-7xl mx-auto text-left">
                 <button onClick={() => setStep(3)} className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-12 hover:text-white transition-colors flex items-center mx-auto lg:mx-0">
                   <i className="fa-solid fa-arrow-left-long mr-3 text-xs"></i> MBRAPA TEK KOHA
                 </button>
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 rounded-[3rem] lg:rounded-[4rem] p-8 lg:p-16 shadow-2xl">
                       <h2 className="text-3xl lg:text-5xl font-serif italic mb-14 tracking-tighter leading-none">Detajet e <span className="text-[#E91254]">Rezervimit.</span></h2>
                       
                       <div className="space-y-10">
                          <div>
                             <div className="flex justify-between items-center mb-6">
                                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-600 block italic">TELEFONI (9 SHIFRA) <span className="text-red-500 font-bold">*</span></label>
                                {isReturning && (
                                   <div className="flex items-center space-x-2 text-green-500 animate-fadeIn">
                                      <i className="fa-solid fa-circle-check text-xs"></i>
                                      <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Mirëseerdhët përsëri {firstName}!</span>
                                   </div>
                                )}
                             </div>
                             <div className="relative">
                               <input 
                                  type="tel" 
                                  maxLength={9} 
                                  value={clientPhone} 
                                  onChange={e => setClientPhone(e.target.value.replace(/\D/g, ''))} 
                                  placeholder="04X XXX XXX" 
                                  className={`w-full bg-neutral-950 border ${validatePhone(clientPhone) ? 'border-green-500/50' : 'border-white/5'} rounded-3xl p-6 lg:p-8 text-xl lg:text-3xl font-serif italic text-white focus:border-[#E91254] outline-none transition-all placeholder:text-neutral-700 shadow-inner`} 
                               />
                               {isLoadingClient && (
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                     <div className="w-5 h-5 border-2 border-[#E91254] border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                               )}
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div>
                                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-6 block italic">EMRI <span className="text-red-500 font-bold">*</span></label>
                                <input 
                                   type="text" 
                                   value={firstName} 
                                   onChange={e => setFirstName(e.target.value)} 
                                   placeholder="EMRI" 
                                   className="w-full bg-neutral-950 border border-white/5 rounded-3xl p-6 lg:p-8 text-xl lg:text-3xl font-serif italic text-white focus:border-[#E91254] outline-none transition-all placeholder:text-neutral-700 shadow-inner uppercase" 
                                />
                             </div>
                             <div>
                                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-6 block italic">MBIEMRI <span className="text-red-500 font-bold">*</span></label>
                                <input 
                                   type="text" 
                                   value={lastName} 
                                   onChange={e => setLastName(e.target.value)} 
                                   placeholder="MBIEMRI" 
                                   className="w-full bg-neutral-950 border border-white/5 rounded-3xl p-6 lg:p-8 text-xl lg:text-3xl font-serif italic text-white focus:border-[#E91254] outline-none transition-all placeholder:text-neutral-700 shadow-inner uppercase" 
                                />
                             </div>
                          </div>

                          <div 
                             className={`mt-6 flex items-start space-x-6 p-8 rounded-[2rem] transition-all duration-700 cursor-pointer select-none ${areDetailsFilled ? 'bg-white/10 border border-[#E91254]/30 opacity-100 scale-100' : 'bg-neutral-900 opacity-30 border border-transparent scale-95 pointer-events-none'}`} 
                             onClick={() => areDetailsFilled && setTermsAccepted(!termsAccepted)}
                          >
                             <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${termsAccepted ? 'bg-[#E91254] border-[#E91254] shadow-[0_0_20px_rgba(233,18,84,0.5)]' : 'border-white/20'}`}>
                                {termsAccepted && <i className="fa-solid fa-check text-white text-sm"></i>}
                             </div>
                             <p className={`flex-1 text-[11px] lg:text-[12px] font-bold leading-relaxed uppercase tracking-wider italic ${termsAccepted ? 'text-white' : 'text-neutral-400'}`}>
                                Pajtohem me kushtet e rezervimit. Anulimi i terminit duhet te behet permes telefonit. <span className="text-red-500 font-bold">*</span>
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-5 bg-gradient-to-br from-[#E91254] to-[#C00F45] rounded-[3rem] lg:rounded-[4rem] p-8 lg:p-16 flex flex-col justify-between shadow-[0_40px_100px_rgba(233,18,84,0.4)] text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-6 opacity-70 italic text-center lg:text-left">PËRMBLEDHJA</p>
                          <h3 className="text-4xl lg:text-6xl font-serif italic mb-4 tracking-tighter leading-none uppercase text-center lg:text-left">{currentService?.name}</h3>
                          <p className="text-sm font-black uppercase tracking-[0.4em] italic mb-12 opacity-80 text-center lg:text-left">ME {currentStaff?.name}</p>
                          <div className="h-[1px] bg-white/20 mb-12"></div>
                          <div className="grid grid-cols-2 gap-10 text-center lg:text-left">
                             <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60 mb-3 italic">DATA</p>
                                <p className="text-3xl lg:text-4xl font-black italic tracking-tighter">
                                  {date.split('-').reverse().join(' ')}
                                </p>
                             </div>
                             <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60 mb-3 italic">ORA</p>
                                <p className="text-3xl lg:text-4xl font-black italic tracking-tighter">{time}</p>
                             </div>
                          </div>
                       </div>

                       <button 
                          disabled={!isFormValid}
                          onClick={handleBooking} 
                          className={`relative z-10 w-full py-8 lg:py-10 rounded-full text-[13px] font-black uppercase tracking-[0.5em] transition-all mt-16 shadow-2xl ${isFormValid ? 'bg-white text-[#E91254] hover:bg-black hover:text-white hover:scale-[1.02]' : 'bg-black/20 text-white/30 cursor-not-allowed shadow-none'}`}
                       >
                          KONFIRMO TAKIMIN
                       </button>
                    </div>
                 </div>
              </div>
           ) : (
             <div className="animate-fadeIn max-w-5xl mx-auto">
                {step === 1 && (
                  <>
                    <div className="text-center mb-20">
                      <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.6em] mb-4 italic">
                        <InlineText field="bookingSubtitle" />
                      </p>
                      <h2 className="text-5xl lg:text-[8rem] font-serif italic mb-8 leading-none tracking-tighter">
                        <InlineText field="bookingTitle" /><span className="text-[#E91254]">.</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {services.map((s, idx) => (
                        <div key={idx} onClick={() => { setSelectedService(s.id); setStep(2); }} className="group bg-neutral-900/30 border border-white/5 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between hover:border-[#E91254]/40 transition-all cursor-pointer hover:bg-neutral-900/50 gap-8">
                           <div className="flex items-center space-x-6 lg:space-x-10 text-left w-full">
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black border border-white/5 flex items-center justify-center group-hover:border-[#E91254] transition-all shrink-0"><i className="fa-solid fa-scissors text-[#E91254] text-lg lg:text-xl"></i></div>
                              <div>
                                 <h3 className="text-2xl lg:text-4xl font-serif italic group-hover:text-[#E91254] transition-colors leading-none tracking-tighter uppercase">{s.name}</h3>
                                 <p className="text-neutral-500 text-sm lg:text-lg italic font-light opacity-70 mt-2 line-clamp-2">{s.description}</p>
                                 <div className="mt-4 flex items-center space-x-3">
                                    <i className="fa-regular fa-clock text-[#E91254] text-xs"></i>
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-neutral-400">KOHËZGJATJA: {formatDuration(s.durationMinutes)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-12 mt-2 md:mt-0">
                              <span className="text-4xl lg:text-5xl font-serif italic text-white tracking-tighter">€{s.price}</span>
                              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#E91254] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform shrink-0"><i className="fa-solid fa-arrow-right"></i></div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <div className="animate-fadeIn max-w-6xl mx-auto text-center">
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-12 hover:text-white transition-colors flex items-center justify-center mx-auto">
                      <i className="fa-solid fa-arrow-left-long mr-3 text-xs"></i> MBRAPA TEK SHËRBIMET
                    </button>
                    <h2 className="text-5xl lg:text-[9.5rem] font-serif italic mb-20 leading-none tracking-tighter">Zgjidh <span className="text-[#E91254]">Stilistin.</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                      {staff.map(m => (
                        <div key={m.id} onClick={() => { setSelectedStaff(m.id); setStep(3); }} className="group cursor-pointer">
                          <div className="aspect-[3/4.5] rounded-[3rem] lg:rounded-[4rem] overflow-hidden mb-8 border border-white/5 group-hover:border-[#E91254] transition-all duration-1000 relative">
                            <img src={m.photo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all" alt={m.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                          </div>
                          <h3 className="text-3xl lg:text-4xl font-serif italic mb-2 tracking-tighter uppercase">{m.name}</h3>
                          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 italic">{m.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 animate-fadeIn text-left">
                    <div>
                      <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-12 hover:text-white transition-colors flex items-center">
                        <i className="fa-solid fa-arrow-left-long mr-3 text-xs"></i> MBRAPA TEK STILISTI
                      </button>
                      <h2 className="text-5xl lg:text-8xl font-serif italic mb-6 leading-none tracking-tighter">Cila ditë <span className="text-[#E91254]">ju konvenon?</span></h2>
                      
                      <div className="bg-neutral-900/40 rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-10 border border-white/5 shadow-2xl mt-12 overflow-x-auto">
                        <div className="flex items-center justify-between mb-8 px-4">
                           <button onClick={prevMonth} className="text-[#E91254] hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-left"></i></button>
                           <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">{monthNames[viewMonth]} {viewYear}</h4>
                           <button onClick={nextMonth} className="text-[#E91254] hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-right"></i></button>
                        </div>
                        <div className="grid grid-cols-7 gap-3 min-w-[280px]">
                          {Array.from({length: daysInMonth}).map((_, i) => {
                            const day = i + 1;
                            const dStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            const isSelected = date === dStr;
                            const dayDate = new Date(viewYear, viewMonth, day);
                            const isPastDay = dayDate.getTime() < new Date(todayStr).getTime();
                            return (
                              <button 
                                key={i} 
                                disabled={isPastDay}
                                onClick={() => !isPastDay && setDate(dStr)} 
                                className={`aspect-square rounded-full text-xs font-bold transition-all flex items-center justify-center ${isSelected ? 'bg-[#E91254] text-white shadow-xl scale-110' : isPastDay ? 'text-neutral-800 opacity-20 cursor-not-allowed' : 'hover:bg-white/5 text-neutral-400'}`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#E91254] ml-4 italic">DISPONUESHMËRIA E {currentStaff?.name.toUpperCase()}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {timeSlots.map(t => {
                          const availability = getSlotAvailability(t);
                          const isBusy = availability === 'busy';
                          const isPast = availability === 'past';
                          const isDisabled = isBusy || isPast;
                          return (
                            <button 
                              key={t} 
                              disabled={isDisabled} 
                              onClick={() => { if(!isDisabled) { setTime(t); setStep(4); } }} 
                              className={`p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border transition-all group text-left ${isDisabled ? 'bg-neutral-950/50 border-white/5 opacity-40 cursor-not-allowed' : 'border-white/5 bg-neutral-900/40 hover:border-[#E91254] hover:bg-neutral-900'}`}
                            >
                              <div className={`text-2xl lg:text-3xl font-serif italic mb-1 ${isDisabled ? 'text-neutral-700' : 'group-hover:text-[#E91254] transition-colors'}`}>{t}</div>
                              <div className={`text-[8px] font-black uppercase tracking-widest ${isBusy ? 'text-red-900' : isPast ? 'text-neutral-800' : 'text-neutral-600'}`}>
                                {isBusy ? 'E ZËNË' : isPast ? 'KALUAR' : 'E LIRË'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="max-w-4xl mx-auto py-20 animate-fadeIn text-center">
                    <div className="mb-16">
                       <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl animate-bounce"><i className="fa-solid fa-check text-3xl lg:text-4xl"></i></div>
                       <h2 className="text-6xl lg:text-7xl font-serif italic mb-6 leading-none tracking-tighter">Sukses!</h2>
                       <p className="text-neutral-500 italic text-xl lg:text-2xl font-light opacity-80 px-4">Faleminderit <span className="text-white font-bold">{firstName} {lastName}</span>, rezervimi juaj u krye me sukses.</p>
                    </div>
                    <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] lg:rounded-[5rem] p-10 lg:p-24 shadow-3xl relative overflow-hidden text-center">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-[#E91254] mb-16 italic opacity-80">KARTELA E REZERVIMIT</h3>
                       <div className="space-y-10 lg:space-y-12">
                          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-8 gap-4 text-left md:text-center w-full">
                             <span className="text-[10px] font-black text-neutral-600 uppercase italic">SHËRBIMI</span>
                             <span className="text-3xl lg:text-4xl font-serif italic text-white tracking-tighter uppercase">{currentService?.name}</span>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-8 gap-4 text-left md:text-center w-full">
                             <span className="text-[10px] font-black text-neutral-600 uppercase italic">STILISTI / EKSPERTI</span>
                             <span className="text-2xl lg:text-3xl font-black italic text-[#E91254] uppercase tracking-tighter">{currentStaff?.name}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 pt-4">
                             <div className="bg-black/50 p-8 lg:p-10 rounded-3xl border border-white/5 shadow-inner">
                                <span className="text-[10px] font-black text-neutral-600 uppercase italic block mb-4 tracking-widest">DATA</span>
                                <span className="text-xl lg:text-2xl font-black italic text-white uppercase tracking-tighter">{formatDate(date)}</span>
                             </div>
                             <div className="bg-black/50 p-8 lg:p-10 rounded-3xl border border-white/5 shadow-inner">
                                <span className="text-[10px] font-black text-neutral-600 uppercase italic block mb-4 tracking-widest">ORA</span>
                                <span className="text-5xl lg:text-6xl font-serif italic text-[#E91254] tracking-tighter">{time}</span>
                             </div>
                          </div>
                       </div>
                       <button onClick={() => navigate('/')} className="mt-12 px-12 lg:px-20 py-5 lg:py-7 bg-white text-black font-black uppercase text-[10px] lg:text-[11px] tracking-[0.4em] rounded-full hover:bg-[#E91254] hover:text-white transition-all shadow-2xl">KTHEHU TE BALLINA</button>
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      <footer className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 text-left">
          <div className="lg:col-span-1 space-y-10">
            <div>
               <h2 className="text-3xl font-bold tracking-tighter italic uppercase mb-2">FLOK STUDIO</h2>
               <div className="w-12 h-1 bg-[#E91254]"></div>
            </div>
            <p className="text-neutral-500 text-sm italic font-light leading-relaxed max-w-xs">
              {config.footerText}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-neutral-400 italic">Navigimi</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-neutral-600">
              <li><Link to="/services" className="hover:text-white transition-colors">SHËRBIMET</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">PORTFOLIO</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">NA KONTAKTONI</Link></li>
              <li><Link to="/admin/dashboard" className="text-neutral-800 hover:text-white transition-colors">STAFI</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-neutral-400 italic">Rregullat</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-neutral-600">
              <li><a href="javascript:void(0)" className="hover:text-white transition-colors">POLITIKA E PRIVATËSISË</a></li>
              <li><a href="javascript:void(0)" className="hover:text-white transition-colors">KUSHTET E SHËRBIMIT</a></li>
              <li><a href="javascript:void(0)" className="hover:text-white transition-colors">POLITIKA E COOKIES</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-neutral-400 italic">LIDHU ME NE</h4>
            <div className="flex space-x-4">
              {['In', 'Fb', 'Tk'].map(s => (
                <div key={s} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[11px] font-black hover:bg-[#E91254] hover:border-[#E91254] hover:text-white transition-all cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-left">
           <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-600 italic">© 2026 FLOK STUDIO. ZHVILLUAR ME EKSELENCË. KRIJUAR: <a href="https://mikullovci.com/" target="_blank" className="hover:text-white">MIKULLOVCI.COM</a></p>
        </div>
      </footer>
    </div>
  );
};

export default ClientBooking;