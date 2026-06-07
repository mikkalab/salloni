export type Role = 'admin' | 'stilist' | 'asistent' | 'recepsionist' | 'menaxher';

export interface Staff {
  id: string;
  name: string;
  role: Role;
  photo: string;
  bio: string;
  shift?: string;
  skills?: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  showOnHome?: boolean;
  subtitle?: string;
  features?: string[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceId: string;
  staffId: string;
  startTime: string; 
  endTime?: string;   
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  isOnline: boolean;
}

export interface Client {
  phone: string;
  name: string;
  lastVisit: string;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  unit: string;
  criticalLevel: number;
  category: string;
}

export interface SiteConfig {
  primaryColor: string;
  secondaryColor: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  textSize: string;
  menuSize: string;
  logoImage: string;
  heroTitle1: string;
  heroTitle2: string; 
  heroSubText: string;
  heroImage: string;
  stat1Num: string; stat1Label: string;
  stat2Num: string; stat2Label: string;
  stat3Num: string; stat3Label: string;
  stat4Num: string; stat4Label: string;
  aboutTitle: string;
  aboutDesc: string;
  exelenceLabel: string;
  servicesTitle: string;
  galleryTitle: string;
  gallerySubText: string;
  pricingTitle: string;
  contactTitle: string;
  contactSubTitle: string;
  footerText: string;
  footerImage: string;
  s1Title: string; s1Image: string; s1Label: string;
  s2Title: string; s2Image: string; s2Label: string;
  s3Title: string; s3Image: string; s3Label: string;
  s4Title: string; s4Image: string; s4Label: string;
  // Benefits
  benefit1Title: string; benefit1Desc: string;
  benefit2Title: string; benefit2Desc: string;
  benefit3Title: string; benefit3Desc: string;
  // Contact Fields
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  workWeek: string;
  workSat: string;
  workSun: string;
  // Gallery Images
  g1: string; g2: string; g3: string; g4: string;
  g5: string; g6: string; g7: string; g8: string;
  g9: string; g10: string; g11: string; g12: string;
  // New Editable Fields
  bookingTitle: string;
  bookingSubtitle: string;
  contactPageLabel: string;
}