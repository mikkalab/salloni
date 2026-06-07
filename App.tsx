
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_STAFF, INITIAL_SERVICES, INITIAL_PRODUCTS, INITIAL_SITE_CONFIG } from './constants';
import { Staff, Service, Product, Appointment, SiteConfig } from './types';

// Pages
import ClientHome from './pages/ClientHome';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ClientBooking from './pages/ClientBooking';
import AdminDashboard from './pages/AdminDashboard';
import SchedulePage from './pages/SchedulePage';
import DesignerModule from './pages/DesignerModule';
import StaffManagement from './pages/StaffManagement';
import InventoryManagement from './pages/InventoryManagement';
import ClientsManagement from './pages/ClientsManagement';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({});
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [originalConfig, setOriginalConfig] = useState<SiteConfig | null>(null);
  const [isLiveEditing, setIsLiveEditing] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('flok_site_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.logoImage || parsed.logoImage.includes('photo-1633332755192-727a05c4013d')) {
          parsed.logoImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GD-ngEgu2y-I1XKwUWJKL5m77GQJJBRL0A&s';
          localStorage.setItem('flok_site_config', JSON.stringify(parsed));
        }
        setSiteConfig(parsed);
      } catch (e) {
        setSiteConfig(INITIAL_SITE_CONFIG);
      }
    }
    const savedAppointments = localStorage.getItem('flok_appointments');
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    const savedNotes = localStorage.getItem('flok_client_notes');
    if (savedNotes) setClientNotes(JSON.parse(savedNotes));
    const s = localStorage.getItem('flok_staff'); if(s) setStaff(JSON.parse(s));
    const ser = localStorage.getItem('flok_services'); if(ser) setServices(JSON.parse(ser));
    const p = localStorage.getItem('flok_products'); if(p) setProducts(JSON.parse(p));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', siteConfig.primaryColor);
    root.style.setProperty('--secondary-color', siteConfig.secondaryColor);
    root.style.setProperty('--h1-size', siteConfig.h1Size);
    root.style.setProperty('--h2-size', siteConfig.h2Size);
    root.style.setProperty('--h3-size', siteConfig.h3Size);
    root.style.setProperty('--text-size', siteConfig.textSize);
    root.style.setProperty('--menu-size', siteConfig.menuSize);

    // Update dynamic favicon dynamically to use flok logo from siteConfig
    if (siteConfig.logoImage) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteConfig.logoImage;
    }
  }, [siteConfig]);

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage quota exceeded. Not all changes could be saved locally.", e);
    }
  };

  const handleSetSiteConfig = useCallback((val: React.SetStateAction<SiteConfig>) => {
    setSiteConfig(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveToStorage('flok_site_config', next);
      return next;
    });
  }, []);

  const toggleLiveEdit = (active: boolean) => {
    if (active && !isLiveEditing) {
      setOriginalConfig({ ...siteConfig });
    }
    setIsLiveEditing(active);
  };

  const discardChanges = () => {
    if (originalConfig && window.confirm("A jeni të sigurt që dëshironi të anulloni të gjitha ndryshimet e bëra në këtë sesion?")) {
      setSiteConfig(originalConfig);
      saveToStorage('flok_site_config', originalConfig);
      setIsLiveEditing(false);
      setOriginalConfig(null);
    }
  };

  const exitEditMode = () => {
    setIsLiveEditing(false);
    setOriginalConfig(null);
  };

  const addAppointment = (appt: Appointment) => {
    setAppointments(prev => {
      const next = [...prev, appt];
      saveToStorage('flok_appointments', next);
      return next;
    });
  };

  const updateAppointment = (updated: Appointment) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      saveToStorage('flok_appointments', next);
      return next;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const next = prev.filter(a => a.id !== id);
      saveToStorage('flok_appointments', next);
      return next;
    });
  };

  const updateClientNotes = (phone: string, note: string) => {
    const next = { ...clientNotes, [phone]: note };
    setClientNotes(next);
    saveToStorage('flok_client_notes', next);
  };

  const handleSetStaff = (val: React.SetStateAction<Staff[]>) => {
    setStaff(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveToStorage('flok_staff', next);
      return next;
    });
  };

  const handleSetProducts = (val: React.SetStateAction<Product[]>) => {
    setProducts(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveToStorage('flok_products', next);
      return next;
    });
  };

  const handleSetServices = (val: React.SetStateAction<Service[]>) => {
    setServices(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveToStorage('flok_services', next);
      return next;
    });
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black flex flex-col">
        {isLiveEditing && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] animate-fadeIn">
            <div className="bg-black/90 backdrop-blur-3xl border-2 border-white/10 rounded-full px-10 py-5 flex items-center space-x-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-[#E91254] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Editori Live Aktiv</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10"></div>
              <div className="flex items-center space-x-6">
                <button 
                  onClick={exitEditMode}
                  className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#E91254] transition-colors"
                >
                  <i className="fa-solid fa-check mr-2"></i> Ruaj & Dil
                </button>
                <button 
                  onClick={discardChanges}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-rotate-left mr-2"></i> Anullo
                </button>
                <Link 
                  to="/admin/dashboard" 
                  onClick={exitEditMode}
                  className="bg-white text-black px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#E91254] hover:text-white transition-all"
                >
                  Kthehu në Admin
                </Link>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<ClientHome config={siteConfig} setConfig={handleSetSiteConfig} services={services} staff={staff} isEditMode={isLiveEditing} />} />
          <Route path="/gallery" element={<GalleryPage config={siteConfig} setConfig={handleSetSiteConfig} isEditMode={isLiveEditing} />} />
          <Route path="/contact" element={<ContactPage config={siteConfig} setConfig={handleSetSiteConfig} isEditMode={isLiveEditing} />} />
          <Route path="/services" element={<ClientBooking services={services} staff={staff} appointments={appointments} addAppointment={addAppointment} config={siteConfig} setConfig={handleSetSiteConfig} isEditMode={isLiveEditing} />} />
          <Route path="/book" element={<ClientBooking services={services} staff={staff} appointments={appointments} addAppointment={addAppointment} config={siteConfig} setConfig={handleSetSiteConfig} isEditMode={isLiveEditing} />} />
          
          <Route path="/admin/*" element={
            <AdminLayout appointments={appointments} products={products} staff={staff}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard appointments={appointments} products={products} services={services} staff={staff} />} />
                <Route path="orari" element={<SchedulePage appointments={appointments} services={services} staff={staff} updateAppointment={updateAppointment} addAppointment={addAppointment} deleteAppointment={deleteAppointment} onEnter={() => {}} />} />
                <Route path="klientet" element={<ClientsManagement appointments={appointments} services={services} clientNotes={clientNotes} updateClientNotes={updateClientNotes} />} />
                <Route path="dizajneri" element={<DesignerModule config={siteConfig} setConfig={handleSetSiteConfig} setLiveEditing={toggleLiveEdit} />} />
                <Route path="stafi" element={<StaffManagement staff={staff} setStaff={handleSetStaff} />} />
                <Route path="inventari" element={<InventoryManagement products={products} setProducts={handleSetProducts} services={services} setServices={handleSetServices} />} />
              </Routes>
            </AdminLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode, appointments: Appointment[], products: Product[], staff: Staff[] }> = ({ children, appointments, products, staff }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const criticalCount = products.filter(p => p.stock <= p.criticalLevel).length;
  const onlineCount = appointments.filter(a => a.isOnline && a.status === 'pending').length;

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC] text-gray-800 font-sans relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 h-24 border-b border-gray-50 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group animate-fadeIn">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GD-ngEgu2y-I1XKwUWJKL5m77GQJJBRL0A&s" alt="FLOK Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold tracking-tighter italic uppercase text-gray-900 group-hover:text-[#E91254] transition-colors">Manager</h1>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
             <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarLink to="/admin/dashboard" icon="fa-border-all" label="Paneli" current={location.pathname} />
          <SidebarLink to="/admin/orari" icon="fa-calendar-days" label="Kalendari" current={location.pathname} />
          <SidebarLink to="/admin/klientet" icon="fa-address-book" label="Klientët" current={location.pathname} />
          <SidebarLink to="/admin/stafi" icon="fa-users" label="Stafi" current={location.pathname} />
          <SidebarLink to="/admin/inventari" icon="fa-scissors" label="Shërbimet & Inventari" current={location.pathname} />
          <SidebarLink to="/admin/dizajneri" icon="fa-palette" label="Dizajneri" current={location.pathname} />
        </nav>

        <div className="p-8 border-t border-gray-50">
           <Link to="/" className="flex items-center space-x-4 text-gray-400 hover:text-[#E91254] transition-all text-[11px] font-bold uppercase tracking-widest group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#E91254]/10">
                <i className="fa-solid fa-arrow-right-from-bracket rotate-180"></i>
              </div>
              <span>Shkyçu</span>
           </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-24 bg-white border-b border-gray-50 flex items-center justify-between lg:justify-end px-6 lg:px-12 shadow-sm relative z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center space-y-1.5 bg-gray-50 rounded-xl"
          >
            <span className="w-6 h-0.5 bg-gray-900"></span>
            <span className="w-6 h-0.5 bg-gray-900"></span>
            <span className="w-6 h-0.5 bg-gray-900"></span>
          </button>

          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-[#E91254] px-3 lg:px-4 py-1.5 rounded-full text-[8px] lg:text-[10px] font-black uppercase text-white shadow-lg shadow-[#E91254]/20 flex items-center space-x-2">
                <span className="hidden sm:inline">KRITIKE</span>
                <span className="bg-white text-[#E91254] w-4 lg:w-5 h-4 lg:h-5 rounded-full flex items-center justify-center font-bold">{criticalCount}</span>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                  <i className="fa-regular fa-bell"></i>
                </div>
                {onlineCount > 0 && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-[#E91254] border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">{onlineCount}</div>
                )}
              </div>
            </div>
            <div className="hidden sm:block h-10 w-[1px] bg-gray-100"></div>
            <div className="flex items-center space-x-3 lg:space-x-4 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Admin User</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-pink-100 text-[#E91254] flex items-center justify-center font-black text-xs lg:text-sm border-2 border-white shadow-md shrink-0">AU</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#F7F9FC]">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarLink: React.FC<{ to: string; icon: string; label: string; current: string }> = ({ to, icon, label, current }) => {
  const isActive = current === to;
  return (
    <Link to={to} className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${isActive ? 'bg-[#E91254] text-white shadow-lg shadow-[#E91254]/30' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}>
      <i className={`fa-solid ${icon} w-5 text-sm`}></i>
      <span className="font-bold text-[11px] uppercase tracking-tighter leading-none">{label}</span>
    </Link>
  );
};

export default App;
