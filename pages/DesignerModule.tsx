
import React from 'react';
import { SiteConfig } from '../types';
import { useNavigate } from 'react-router-dom';

interface DesignerModuleProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  setLiveEditing: (val: boolean) => void;
}

const DesignerModule: React.FC<DesignerModuleProps> = ({ config, setConfig, setLiveEditing }) => {
  const navigate = useNavigate();

  const handleStartLiveEdit = () => {
    setLiveEditing(true);
    navigate('/');
  };

  const updateConfig = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-12 animate-fadeIn text-gray-800 pb-24 text-left">
      {/* Call to Action */}
      <section className="bg-black p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E91254] opacity-20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-6 leading-none">Përvoja e Re e Editimit</h2>
            <p className="text-lg opacity-60 italic font-light mb-8">
              Modifikoni çdo tekst, çdo foto dhe çdo stil direkt duke e parë faqen. Rezultati shfaqet në kohë reale.
            </p>
            <button 
              onClick={handleStartLiveEdit}
              className="bg-[#E91254] text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center mx-auto md:mx-0"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-4"></i>
              MODIFIKO FAQEN LIVE
            </button>
          </div>
          <div className="w-48 h-48 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-all duration-700">
             <i className="fa-solid fa-palette text-6xl text-[#E91254]"></i>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Font Controls */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Madhësia e Shkronjave</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">KONTROLLO ESTETIKËN E TIPOGRAFISË</p>
          </div>
          
          <div className="space-y-8">
            <FontSizeSlider label="H1 - Titujt Kryesorë" value={config.h1Size} onChange={(v: string) => updateConfig('h1Size', v)} unit="rem" min="2" max="15" />
            <FontSizeSlider label="H2 - Titujt e Seksioneve" value={config.h2Size} onChange={(v: string) => updateConfig('h2Size', v)} unit="rem" min="1.5" max="10" />
            <FontSizeSlider label="H3 - Nëntitujt" value={config.h3Size} onChange={(v: string) => updateConfig('h3Size', v)} unit="rem" min="1" max="6" />
            <FontSizeSlider label="Menu - Navigimi" value={config.menuSize} onChange={(v: string) => updateConfig('menuSize', v)} unit="px" min="8" max="24" />
            <FontSizeSlider label="Text - Përshkrimet" value={config.textSize} onChange={(v: string) => updateConfig('textSize', v)} unit="rem" min="0.5" max="2" />
          </div>
        </div>

        {/* Color Controls */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-gray-900 mb-4">Ngjyrat e Brendit</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">PËRZGJIDH PALETËN TËNDE SIGNATURE</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <ColorBox label="NGJYRA PRIMARE" color={config.primaryColor} onChange={(c: string) => updateConfig('primaryColor', c)} />
            <ColorBox label="NGJYRA SEKONDARE" color={config.secondaryColor} onChange={(c: string) => updateConfig('secondaryColor', c)} />
          </div>

          <div className="mt-12 bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 italic font-light text-sm text-gray-500 leading-relaxed">
             <i className="fa-solid fa-circle-info text-[#E91254] mr-3"></i>
             Këshillë: Përdorni ngjyrën primare (#E91254) për butona dhe elemente të rëndësishme për të mbajtur stilin luksoz të salonit.
          </div>
        </div>
      </div>
    </div>
  );
};

const FontSizeSlider = ({ label, value, onChange, unit = 'rem', min = '1', max = '10' }: any) => {
  const numericValue = parseFloat(value) || 0;
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center italic">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
          <span className="text-sm font-black text-[#E91254]">{value}</span>
       </div>
       <input 
         type="range" 
         min={min} 
         max={max} 
         step={unit === 'rem' ? "0.1" : "1"} 
         value={numericValue} 
         onChange={(e) => onChange(e.target.value + unit)}
         className="w-full accent-[#E91254] h-2 bg-gray-100 rounded-lg cursor-pointer" 
       />
    </div>
  );
}

const ColorBox = ({ label, color, onChange }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block italic">{label}</label>
    <div className="flex items-center space-x-4">
       <input type="color" value={color} onChange={e => onChange(e.target.value)} className="w-16 h-16 rounded-2xl border-none cursor-pointer shadow-lg overflow-hidden" />
       <span className="text-sm font-bold text-gray-700 font-mono tracking-tighter uppercase">{color}</span>
    </div>
  </div>
);

export default DesignerModule;
