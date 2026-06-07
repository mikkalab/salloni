import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface GalleryPageProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isEditMode: boolean;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ config, setConfig, isEditMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImgRef = useRef<keyof SiteConfig | null>(null);

  const updateText = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleImageClick = (field: keyof SiteConfig) => {
    if (!isEditMode) return;
    activeImgRef.current = field;
    
    // Zgjidhja midis URL ose Upload
    const choice = window.confirm("Dëshironi të ngarkoni një foto nga kompjuteri (OK) apo të vendosni një URL (Cancel)?");
    if (choice) {
      fileInputRef.current?.click();
    } else {
      const url = window.prompt("Vendosni URL-në e fotos:");
      if (url) {
        setConfig(prev => ({ ...prev, [field]: url }));
      }
    }
  };

  const compressAndSetImage = (file: File, field: keyof SiteConfig) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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
      className={`${className} transition-all duration-300 ${isEditMode ? 'outline-dashed outline-2 outline-[#E91254]/60 cursor-text px-2 bg-[#E91254]/5 rounded-sm hover:outline-[#E91254]' : ''}`}
    >
      {config[field] as string}
    </span>
  );

  const EditableImage = ({ field, className = "" }: { field: keyof SiteConfig, className?: string }) => (
    <div className={`relative group overflow-hidden h-full w-full ${isEditMode ? 'cursor-pointer' : ''}`} onClick={() => handleImageClick(field)}>
      <img src={config[field] as string} className={`${className} transition-all duration-700`} alt="Gallery" />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
           <div className="w-12 h-12 rounded-full bg-white text-[#E91254] flex items-center justify-center shadow-2xl border-2 border-[#E91254]">
              <i className="fa-solid fa-camera text-xl"></i>
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

  const galleryKeys: (keyof SiteConfig)[] = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'];

  return (
    <div className={`bg-black text-white min-h-screen selection:bg-[#E91254] font-sans overflow-x-hidden ${isEditMode ? 'pt-10' : ''}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 left-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <EditableLogo />
          </Link>
          <div className="hidden lg:flex items-center space-x-12 text-[10px] font-bold uppercase tracking-[0.25em]">
            <Link to="/" className="hover:text-[#E91254] transition-colors">Ballina</Link>
            <Link to="/services" className="hover:text-[#E91254] transition-colors">Shërbimet</Link>
            <Link to="/gallery" className="text-[#E91254] transition-colors">Galeria</Link>
            <Link to="/contact" className="hover:text-[#E91254] transition-colors">Kontakti</Link>
            <Link to="/book" className="px-8 py-3 bg-[#E91254] text-white rounded-full font-black tracking-widest hover:scale-105 transition-all">REZERVO TAKIMIN</Link>
          </div>
        </div>
      </nav>

      {/* Gallery Header */}
      <section className="pt-48 pb-24 bg-black text-center px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#E91254] text-[10px] font-black uppercase tracking-[0.8em] mb-8 flex items-center justify-center italic">PORTFOLIO JONË</p>
          <h2 className="text-6xl lg:text-[10rem] font-serif italic tracking-tighter leading-none mb-12 animate-fadeIn uppercase">
            <InlineText field="galleryTitle" /><span className="text-[#E91254]">.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-500 italic text-lg font-light opacity-70 leading-relaxed animate-fadeIn">
            <InlineText field="gallerySubText" />
          </p>
        </div>
      </section>

      {/* Image Grid */}
      <section className="pb-32 bg-black px-6">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {galleryKeys.map((key) => (
                <div key={key} className="aspect-square bg-neutral-900 overflow-hidden relative group rounded-[2rem] border border-white/5 shadow-2xl">
                   <EditableImage field={key} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
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

export default GalleryPage;