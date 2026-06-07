import { Staff, Service, Product, SiteConfig } from './types';

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Xeni', role: 'menaxher', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800', bio: 'Menaxher i studios.', shift: '09:00 - 17:00', skills: ['Prerje', 'Ngjyrosje'] },
  { id: '2', name: 'Shehrie', role: 'stilist', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800', bio: 'Stiliste Senior.', shift: '09:00 - 17:00', skills: ['Prerje', 'Ngjyrosje'] },
  { id: '3', name: 'Muki', role: 'stilist', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800', bio: 'Ekspert në prerje.', shift: '09:00 - 17:00', skills: ['Prerje', 'Stilist'] }
];

export const INITIAL_SERVICES: Service[] = [
  { 
    id: 's1', 
    name: 'Prerje Signature', 
    category: 'Prerje', 
    description: 'Përjetoni një prerje për femra premium me detaje unike.', 
    price: 35, 
    durationMinutes: 45,
    showOnHome: true,
    subtitle: 'DUKE FILLUAR NGA',
    features: ['KONSULTIM', 'LARJE LUKSOZE', 'MASAZH I KOKËS', 'PRERJE PRECIZE', 'STILIM NGA STILISTI']
  },
  { 
    id: 's4', 
    name: 'Mjeshtër i Ngjyrës', 
    category: 'Ngjyrosje', 
    description: 'Ngjyrosje profesionale me produkte të cilësisë më të lartë.', 
    price: 85, 
    durationMinutes: 90,
    showOnHome: true,
    subtitle: 'INVESTONI NË VETEN TUAJ',
    features: ['ANALIZË E TONIT', 'BOJË PREMIUM', 'MBROJTJE UV', 'KONDICIONIM I THELLË', 'FINISH SHKËLQYES']
  },
  { 
    id: 's6', 
    name: 'Rilindje Totale', 
    category: 'Trajtim', 
    description: 'Rikonstruksion i plotë i flokëve tuaj.', 
    price: 120, 
    durationMinutes: 120,
    showOnHome: true,
    subtitle: 'PËR NJË PAMJE UNIKE',
    features: ['TRAJTIM DETOKS', 'INFUZION KERATINE', 'RIPARIM I MAJAVE', 'TERAPI ME AVULL', 'VULOSJE ME SERUM']
  },
  { id: 's2', name: 'Prerje për Meshkuj', category: 'Prerje', description: 'Stil dhe saktësi.', price: 15, durationMinutes: 30 },
  { id: 's3', name: 'Krehje / Stilim', category: 'Stilim', description: 'Modelim profesional.', price: 15, durationMinutes: 40 },
  { id: 's5', name: 'Balayage', category: 'Ngjyrosje', description: 'Teknikë unike.', price: 80, durationMinutes: 180 }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Schwarzkopf Professional Shampoo', stock: 12, unit: 'copë', criticalLevel: 5, category: 'Kujdesi' },
  { id: 'p2', name: "L'Oreal Hair Dye #4", stock: 5, unit: 'tubeta', criticalLevel: 6, category: 'Ngjyrosje' },
  { id: 'p3', name: 'Keratin Treatment Kit', stock: 2, unit: 'set', criticalLevel: 3, category: 'Trajtim' },
  { id: 'p4', name: 'Hair Spray Strong Hold', stock: 24, unit: 'copë', criticalLevel: 10, category: 'Stilim' }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  primaryColor: '#E91254',
  secondaryColor: '#000000',
  h1Size: '9.5rem',
  h2Size: '7.5rem',
  h3Size: '4rem',
  textSize: '1rem',
  menuSize: '10px',
  logoImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GD-ngEgu2y-I1XKwUWJKL5m77GQJJBRL0A&s',
  heroTitle1: 'Ku Bukuria Takon',
  heroTitle2: 'Vetëbesimin.',
  heroSubText: 'Një koleksion i përzgjedhur i transformimeve tona më të mira. Ku arti takohet me pasionin dhe çdo fije floku tregon një histori ekselence.',
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074',
  stat1Num: '200+', stat1Label: 'Klientë të Lumtur',
  stat2Num: '16', stat2Label: 'Vite Përvojë',
  stat3Num: '15k+', stat3Label: 'Stile të Krijura',
  stat4Num: '12+', stat4Label: 'Çmime të Fituara',
  aboutTitle: 'Sepse Ju Meritoni më të Mirën',
  aboutDesc: 'Përjetoni bukurinë e redefineuar në studion tonë luksoze. Ku arti takohet me pasionin.',
  exelenceLabel: 'EKSELENCË',
  servicesTitle: 'Shërbimet tona Unike',
  galleryTitle: 'Estetika',
  gallerySubText: 'Një koleksion i përzgjedhur i transformimeve tona më të mira. Ku arti takohet me pasionin dhe çdo fije floku tregon një histori ekselence.',
  pricingTitle: 'Luks i Pranishëm për të Gjithë',
  contactTitle: 'Na Kontaktoni',
  contactSubTitle: 'Hyni në shenjtëroren tonë të bukurisë. Na kontaktoni për të caktuar një përvojë të jashtëzakonshme në Flok Studio.',
  footerText: 'Përjetoni bukurinë e redefineuar në studion tonë luksoze. Ku arti takohet me pasionin.',
  footerImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070',
  s1Title: 'Prerje & Stilim', s1Image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800', s1Label: 'PRERJE & STILIM',
  s2Title: 'Art i Ngjyrës', s2Image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800', s2Label: 'ART I NGJYRËS',
  s3Title: 'Trajtime', s3Image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800', s3Label: 'TRAJTIME',
  s4Title: 'Nuse', s4Image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800', s4Label: 'NUSE',
  // Benefits
  benefit1Title: 'Stilistë Ekspertë', benefit1Desc: 'Ekipi ynë përbëhet nga profesionistë të trajnuar lartë me vite përvojë ndërkombëtare.',
  benefit2Title: 'Produkte më të Mira', benefit2Desc: 'Ne përdorim vetëm produkte premium dhe ekologjike për të siguruar shëndetin e flokëve tuaj.',
  benefit3Title: 'Shërbim VIP', benefit3Desc: 'Çdo vizitë është një udhëtim i personalizuar. Ne dëgjojmë, ne kujdesemi, ne transformojmë.',
  // Contact
  contactAddress: 'Rruga Nënë Tereza, Nr. 12, Prishtinë',
  contactPhone: '+383 44 123 456',
  contactEmail: 'info@flokstudio.com',
  workWeek: '09:00 — 19:00',
  workSat: '09:00 — 17:00',
  workSun: 'Mbyllur',
  g1: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800',
  g2: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800',
  g3: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800',
  g4: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800',
  g5: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074',
  g6: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070',
  g7: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800',
  g8: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800',
  g9: 'https://images.unsplash.com/photo-1522337363627-63a1372b6672?q=80&w=800',
  g10: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
  g11: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800',
  g12: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800',
  // Defaults
  bookingTitle: 'Katalogu',
  bookingSubtitle: 'ZGJIDH SHËRBIMIN',
  contactPageLabel: 'GJEJENI STUDION TONË'
};