import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteConfig, Service, Staff } from '../types';

interface ClientHomeProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  services: Service[];
  staff: Staff[];
  isEditMode: boolean;
}

const ClientHome: React.FC<ClientHomeProps> = ({ config, setConfig, services, staff, isEditMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImgRef = useRef<keyof SiteConfig | null>(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const updateText = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleImageClick = (field: keyof SiteConfig) => {
    if (!isEditMode) return;
    activeImgRef.current = field;
    fileInputRef.current?.click();
  };

  const compressAndSetImage = (file: File, field: keyof SiteConfig) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setConfig(prev => ({ ...prev, [field]: dataUrl }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const field = activeImgRef.current;
    if (file && field) {
      compressAndSetImage(file, field);
    }
    e.target.value = '';
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

  const EditableImage = ({ field, className = "" }: { field: keyof SiteConfig, className?: string, alt?: string }) => (
    <div className={`relative group w-full h-full ${isEditMode ? 'cursor-pointer' : ''}`} onClick={() => handleImageClick(field)}>
      <img src={config[field] as string} className={`${className} transition-all duration-700`} alt="" />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
           <div className="w-16 h-16 rounded-full bg-white text-[#E91254] flex items-center justify-center shadow-2xl border-2 border-[#E91254]">
              <i className="fa-solid fa-camera text-2xl"></i>
           </div>
        </div>
      )}
    </div>
  );

  const EditableLogo = () => (
    <div 
      className={`relative group transition-all duration-300 ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[#E91254] p-1 rounded-lg' : ''}`}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          e.stopPropagation();
          handleImageClick('logoImage');
        }
      }}
    >
      <img src={config.logoImage} alt="FLOK Logo" className="h-[78px] lg:h-[100px] w-auto object-contain transition-soft" />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <i className="fa-solid fa-camera text-[10px] text-white"></i>
        </div>
      )}
    </div>
  );

  const ModularElement: React.FC<{ children: React.ReactNode, to: string, className?: string }> = ({ children, to, className = "" }) => (
    <div 
      className={`${className} relative transition-all duration-500 ${isEditMode ? 'hover:ring-4 hover:ring-[#E91254]/30 cursor-pointer group rounded-[3.5rem]' : ''}`}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
      {isEditMode && (
        <div className="absolute -top-4 -right-4 bg-[#E91254] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 shadow-xl z-20 transition-all">
          Edito në Admin
        </div>
      )}
    </div>
  );

  const homeServices = services.filter(s => s.showOnHome).slice(0, 3);

  const handleRezervo = (id: string) => {
    navigate(`/book?serviceId=${id}`);
  };

  return (
    <div className={`bg-black text-white min-h-screen selection:bg-[#E91254] font-sans overflow-x-hidden ${isEditMode ? 'pt-10' : ''}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 left-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <EditableLogo />
          </Link>
          
          <div className="hidden lg:flex items-center space-x-12 font-bold uppercase tracking-[0.25em]" style={{ fontSize: 'var(--menu-size)' }}>
            <Link to="/" className="text-[#E91254] transition-colors">Ballina</Link>
            <Link to="/services" className="hover:text-[#E91254] transition-colors">Shërbimet</Link>
            <Link to="/gallery" className="hover:text-[#E91254] transition-colors">Galeria</Link>
            <Link to="/contact" className="hover:text-[#E91254] transition-colors">Kontakti</Link>
            <Link to="/book" className="px-8 py-3 bg-[#E91254] text-white rounded-full font-black tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(233,18,84,0.4)]">REZERVO TAKIMIN</Link>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center space-y-2 z-[110]"
          >
            <span className={`block w-8 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </button>
        </div>

        <div className={`fixed inset-0 bg-black z-[105] flex flex-col items-center justify-center space-y-12 transition-all duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <Link onClick={() => setIsMenuOpen(false)} to="/" className="text-5xl font-serif italic tracking-tighter hover:text-[#E91254] transition-colors">Ballina</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/services" className="text-5xl font-serif italic tracking-tighter hover:text-[#E91254] transition-colors">Shërbimet</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/gallery" className="text-5xl font-serif italic tracking-tighter hover:text-[#E91254] transition-colors">Galeria</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="text-5xl font-serif italic tracking-tighter hover:text-[#E91254] transition-colors">Kontakti</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/book" className="px-12 py-5 bg-[#E91254] text-white rounded-full font-black tracking-widest uppercase text-xs">REZERVO TANI</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage field="heroImage" className="w-full h-full object-cover grayscale-[0.2] brightness-[0.4]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black z-[5] pointer-events-none"></div>
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20">
          <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.6em] mb-8 animate-fadeIn">Flok Studio Prishtinë</p>
          <h1 className="font-serif font-medium leading-[0.85] tracking-tighter mb-16 animate-fadeIn" style={{ fontSize: 'var(--h1-size)' }}>
            <InlineText field="heroTitle1" /><br />
            <span className="text-[#E91254] italic"><InlineText field="heroTitle2" /></span>
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <Link to="/book" className="px-14 py-6 bg-[#E91254] rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl">FILLO UDHËTIMIN TËND</Link>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <img key={i} src={`https://picsum.photos/seed/${i+40}/100`} className="w-12 h-12 rounded-full border-2 border-black" alt="review" />)}
              </div>
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">+1k Rezervime</div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 lg:py-24 border-y border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { n: 'stat1Num', l: 'stat1Label' },
            { n: 'stat2Num', l: 'stat2Label' },
            { n: 'stat3Num', l: 'stat3Label' },
            { n: 'stat4Num', l: 'stat4Label' }
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="font-serif mb-2 tracking-tighter" style={{ fontSize: 'var(--h3-size)' }}><InlineText field={stat.n as any} /></h3>
              <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-bold"><InlineText field={stat.l as any} /></p>
            </div>
          ))}
        </div>
      </section>

      {/* Unique Services */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-left">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4 text-center lg:text-left w-full lg:w-auto">
              <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.7em]"><InlineText field="exelenceLabel" /></p>
              <h2 className="font-serif italic tracking-tighter leading-none" style={{ fontSize: 'var(--h2-size)' }}><InlineText field="servicesTitle" /></h2>
            </div>
            <Link to="/services" className="text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 px-12 py-5 rounded-full hover:bg-white hover:text-black transition-all mb-4 group flex items-center mx-auto lg:mx-0">
              SHIKO KATALOGUN <i className="fa-solid fa-arrow-right-long ml-6 text-[#E91254] group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: 's1Title', i: 's1Image', l: 's1Label' },
              { t: 's2Title', i: 's2Image', l: 's2Label' },
              { t: 's3Title', i: 's3Image', l: 's3Label' },
              { t: 's4Title', i: 's4Image', l: 's4Label' }
            ].map((s, i) => (
              <div key={i} className="group relative aspect-[3/4.5] rounded-[3.5rem] overflow-hidden cursor-pointer border border-white/5 shadow-2xl">
                <EditableImage field={s.i as any} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-12 flex flex-col justify-end pointer-events-none z-10">
                   <p className="text-[#E91254] text-[10px] font-black tracking-[0.4em] mb-5 italic pointer-events-auto">
                      <InlineText field={s.l as any} />
                   </p>
                   <h3 className="text-4xl font-serif italic mb-8 leading-tight tracking-tighter pointer-events-auto">
                      <InlineText field={s.t as any} />
                   </h3>
                   {!isEditMode && (
                      <Link to="/book" className="w-full py-5 bg-white text-black text-[11px] font-black rounded-full opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 uppercase tracking-[0.4em] text-center shadow-2xl pointer-events-auto">REZERVO</Link>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif italic mb-24 tracking-tighter leading-none" style={{ fontSize: 'var(--h2-size)' }}><InlineText field="aboutTitle" /></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { i: 'fa-star', t: 'benefit1Title', d: 'benefit1Desc' },
              { i: 'fa-circle-check', t: 'benefit2Title', d: 'benefit2Desc' },
              { i: 'fa-arrow-right', t: 'benefit3Title', d: 'benefit3Desc' }
            ].map((item, idx) => (
              <div key={idx} className="group text-center">
                <div className="w-20 h-20 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-10 group-hover:bg-[#E91254] group-hover:border-[#E91254] transition-all duration-500">
                  <i className={`fa-solid ${item.i} text-xl ${idx === 2 ? 'text-white' : 'text-[#E91254] group-hover:text-white'}`}></i>
                </div>
                <h4 className="text-2xl font-serif italic mb-5 tracking-tighter">
                   <InlineText field={item.t as any} />
                </h4>
                <p className="text-neutral-500 italic font-light leading-relaxed max-w-xs mx-auto opacity-70" style={{ fontSize: 'var(--text-size)' }}>
                   <InlineText field={item.d as any} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
             <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.8em] mb-6">INVESTONI NË VETEN TUAJ</p>
             <h2 className="font-serif italic leading-none tracking-tighter" style={{ fontSize: 'var(--h2-size)' }}><InlineText field="pricingTitle" /></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
            {homeServices.map((service, idx) => (
              <ModularElement key={service.id} to="/admin/inventari" className="h-full">
                <PricingCard 
                  title={service.name} 
                  price={service.price.toString()} 
                  subtitle={service.subtitle}
                  features={service.features || []} 
                  isPink={idx === 1}
                  onRezervo={() => handleRezervo(service.id)}
                  isEditMode={isEditMode}
                />
              </ModularElement>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-left relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
             <h2 className="font-serif italic tracking-tighter leading-none" style={{ fontSize: 'var(--h2-size)' }}>Zërat e <span className="text-[#E91254] block">Ekselencës</span></h2>
             <div className="flex space-x-6 mb-6">
                <button className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"><i className="fa-solid fa-chevron-left"></i></button>
                <button className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"><i className="fa-solid fa-chevron-right"></i></button>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             {[
               { n: 'Elena Gashi', r: 'Kliente e Kënaqur', t: '“Përvoja më e mirë e sallonit në Prishtinë. Vëmendja ndaj detajeve është e pakrahasueshme. E dua balayage-in tim të ri!”' },
               { n: 'Sara Krasniqi', r: 'Fashion Blogger', t: '“Stili i Flok Studio është ajo që kam kërkuar. Vibe-i i luksit të errët të bën të ndihesh si yll që nga fillimi.”' },
               { n: 'Artan M.', r: 'Profesionist Biznesi', t: '“Profesional, i shpejtë, dhe gjithmonë në pikë. Sistemi i rezervimit është i thjeshtë dhe shmang çdo pritje.”' }
             ].map((rev, i) => (
               <div key={i} className="bg-neutral-900/30 border border-white/5 rounded-[3rem] p-12 hover:bg-neutral-900/50 transition-all text-left">
                 <div className="flex text-[#E91254] space-x-1 mb-8">
                   {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star text-[10px]"></i>)}
                 </div>
                 <p className="italic font-light text-neutral-400 mb-12 leading-relaxed" style={{ fontSize: 'var(--text-size)' }}>{rev.t}</p>
                 <div className="flex items-center space-x-5">
                   <img src={`https://picsum.photos/seed/${i+88}/100`} className="w-14 h-14 rounded-full grayscale" alt={rev.n} />
                   <div>
                     <h4 className="text-lg font-serif italic tracking-tighter">{rev.n}</h4>
                     <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600 italic">{rev.r}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 text-left">
          <div className="lg:col-span-1 space-y-10">
            <div>
               <h2 className="text-3xl font-bold tracking-tighter italic uppercase mb-2">FLOK STUDIO</h2>
               <div className="w-12 h-1 bg-[#E91254]"></div>
            </div>
            <p className="text-neutral-500 text-sm italic font-light leading-relaxed max-w-xs">
              <InlineText field="footerText" />
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

const PricingCard = ({ title, price, subtitle, features, isPink = false, onRezervo, isEditMode }: any) => (
  <div className={`${isPink ? 'bg-[#E91254] shadow-[0_30px_70px_rgba(233,18,84,0.3)] transform lg:scale-105 z-10' : 'bg-neutral-900/40 border border-white/5'} rounded-[4rem] p-16 h-full flex flex-col justify-between relative overflow-hidden group transition-all`}>
     {isPink && <div className="absolute top-10 right-10 bg-white/20 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">MË E PËLQYERA</div>}
     <div className="text-left">
        <h3 className={`text-3xl font-serif italic mb-2 tracking-tighter text-white leading-none uppercase`}>{title}</h3>
        <div className="flex items-end space-x-4 mb-12">
           <span className={`text-[10px] font-black uppercase tracking-widest italic mb-2 ${isPink ? 'text-white/60' : 'text-neutral-500'}`}>{subtitle || 'DUKE FILLUAR NGA'}</span>
           <span className="text-6xl font-serif italic">€{price}</span>
        </div>
        <ul className={`space-y-6 mb-20 text-[10px] font-black uppercase tracking-[0.3em] ${isPink ? 'text-white' : 'text-neutral-400'}`}>
           {features.map((f: string) => (
             <li key={f} className="flex items-center"><i className={`fa-regular fa-circle-check mr-4 ${isPink ? 'text-white' : 'text-[#E91254]'}`}></i> {f}</li>
           ))}
        </ul>
     </div>
     {!isEditMode && <button onClick={(e) => { e.stopPropagation(); onRezervo(); }} className={`w-full py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all text-center ${isPink ? 'bg-white text-[#E91254] hover:bg-black hover:text-white shadow-2xl' : 'bg-[#E91254] text-white hover:scale-105 shadow-xl'}`}>REZERVO TANI</button>}
  </div>
);

export default ClientHome;
