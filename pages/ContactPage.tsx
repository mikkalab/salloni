import React from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface ContactPageProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isEditMode: boolean;
}

const ContactPage: React.FC<ContactPageProps> = ({ config, setConfig, isEditMode }) => {

  const updateText = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
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

  const EditableLogo = () => (
    <div 
      className={`relative group transition-all duration-300 ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[#E91254] p-1 rounded-lg' : ''}`}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
        }
      }}
    >
      <img src={config.logoImage} alt="FLOK Logo" className="h-[78px] lg:h-[100px] w-auto object-contain transition-soft" />
    </div>
  );

  return (
    <div className={`bg-black text-white min-h-screen selection:bg-[#E91254] font-sans overflow-x-hidden ${isEditMode ? 'pt-10' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 left-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <EditableLogo />
          </Link>
          <div className="hidden lg:flex items-center space-x-12 text-[10px] font-bold uppercase tracking-[0.25em]">
            <Link to="/" className="hover:text-[#E91254] transition-colors">Ballina</Link>
            <Link to="/services" className="hover:text-[#E91254] transition-colors">Shërbimet</Link>
            <Link to="/gallery" className="hover:text-[#E91254] transition-colors">Galeria</Link>
            <Link to="/contact" className="text-[#E91254] transition-colors">Kontakti</Link>
            <Link to="/book" className="px-8 py-3 bg-[#E91254] text-white rounded-full font-black tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(233,18,84,0.3)]">REZERVO TAKIMIN</Link>
          </div>
        </div>
      </nav>

      <section className="pt-48 pb-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-24 animate-fadeIn text-left">
            <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.7em] mb-12 flex items-center italic">
              <InlineText field="contactPageLabel" />
            </p>
            <h2 className="text-6xl lg:text-[11rem] font-serif italic tracking-tighter leading-none">
              <InlineText field="contactTitle" /><span className="text-[#E91254]">.</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
             <div className="lg:w-1/2 w-full space-y-6 animate-fadeIn">
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-10 flex items-center space-x-8 group hover:bg-neutral-900/60 transition-all">
                  <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center text-[#E91254] shrink-0 border border-white/5">
                    <i className="fa-solid fa-location-dot text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-2 italic">STUDIO JONË</p>
                    <h4 className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-white">
                      <InlineText field="contactAddress" />
                    </h4>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-10 flex items-center space-x-8 group hover:bg-neutral-900/60 transition-all">
                  <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center text-[#E91254] shrink-0 border border-white/5">
                    <i className="fa-solid fa-phone-flip text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-2 italic">TELEFONI</p>
                    <h4 className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-white">
                      <InlineText field="contactPhone" />
                    </h4>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-10 flex items-center space-x-8 group hover:bg-neutral-900/60 transition-all">
                  <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center text-[#E91254] shrink-0 border border-white/5">
                    <i className="fa-solid fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-2 italic">EMAIL</p>
                    <h4 className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-white">
                      <InlineText field="contactEmail" />
                    </h4>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-12 mt-12 space-y-10">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-neutral-950 rounded-full flex items-center justify-center text-[#E91254] border border-white/5 shadow-inner">
                        <i className="fa-regular fa-clock text-lg"></i>
                      </div>
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.6em] italic">ORARI I PUNËS</p>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="flex justify-between items-center border-b border-white/5 pb-6">
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">HËNË — PREMTE</span>
                         <span className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-white">
                           <InlineText field="workWeek" />
                         </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-6">
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">SHTUNË</span>
                         <span className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-white">
                           <InlineText field="workSat" />
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">DIELE</span>
                         <span className="text-2xl lg:text-3xl font-serif italic tracking-tighter text-[#E91254]">
                           <InlineText field="workSun" />
                         </span>
                      </div>
                   </div>
                </div>

             </div>

             <div className="lg:w-1/2 w-full animate-fadeIn">
                <div className="w-full aspect-square rounded-[3rem] lg:rounded-[5rem] overflow-hidden border border-white/5 shadow-3xl grayscale brightness-75 hover:grayscale-0 transition-all duration-1000 group relative">
                   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.3364020925!2d21.1594895!3d42.6629138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549ee1700681b9%3A0x6a004b50c4516641!2sMother%20Teresa%20Boulevard%2C%20Pristina!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                </div>
             </div>
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
           <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-600 italic text-center md:text-left">© 2026 FLOK STUDIO. ZHVILLUAR ME EKSELENCË. KRIJUAR: <a href="https://mikullovci.com/" target="_blank" className="hover:text-white">MIKULLOVCI.COM</a></p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;