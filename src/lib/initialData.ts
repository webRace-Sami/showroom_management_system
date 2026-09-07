export interface UserData {
  id: string;
  username: string;
  password: string; // bcrypt hashed or plain for seed
  fullName: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'INVENTORY_OFFICER';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfoData {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  openingHours: string;
  aboutUs: string;
  visionText: string;
  warrantyPolicy: string;
  warrantyHighlightTitle?: string;
  warrantyHighlightSubtitle?: string;
  warrantyInspectionPoints?: string;
  warrantyInspectionSubtitle?: string;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedIn: string;
  socialTwitter: string;
  socialWhatsApp: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  vin: string;
  engineNo: string;
  bodyType: 'Sedan' | 'SUV' | 'Coupe' | 'Convertible' | 'Electric' | 'Supercar';
  transmission: 'Automatic' | 'Dual-Clutch' | 'Manual' | 'Single-Speed';
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  exteriorColor: string;
  interiorColor: string;
  mileage: number;
  costPrice: number;
  sellingPrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'IN_SERVICE';
  condition: 'BRAND_NEW' | 'CERTIFIED_PRE_OWNED' | 'USED';
  features: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleData {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleId?: string;
  vehicleName: string;
  vehicleVin: string;
  basePrice: number;
  taxAmount: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: 'Bank Wire' | 'Certified Cheque' | 'Cash' | 'Financing';
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  deliveryStatus: 'PENDING' | 'READY' | 'DELIVERED';
  saleDate: string;
  soldBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId?: string;
  address?: string;
  preferredCategory?: string;
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  interestedVehicle: string;
  budget?: number;
  status: 'NEW' | 'CONTACTED' | 'TEST_DRIVE_SCHEDULED' | 'NEGOTIATING' | 'CONVERTED' | 'LOST';
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestDriveData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleName: string;
  scheduledDate: string;
  licenseNumber?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierData {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  totalProcured: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial rich seed dataset in Pakistani Rupees (PKR / Rs.)
export const initialCompanyInfo: CompanyInfoData = {
  id: 'comp_001',
  name: 'Apex Luxury Motors',
  tagline: 'Excellence in Automotive Luxury & High-Performance Engineering',
  logoText: 'APEX MOTORS',
  email: 'concierge@apexluxurymotors.com',
  phone: '+92 (42) 3578-9900',
  secondaryPhone: '+92 (300) 845-1122',
  address: 'Plot 48-A, Main Boulevard, Gulberg III',
  city: 'Lahore',
  state: 'Punjab',
  postalCode: '54660',
  country: 'Pakistan',
  openingHours: 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 2:00 PM - 8:00 PM (By Appointment)',
  aboutUs: 'For over two decades, Apex Luxury Motors has set the benchmark for prestige automotive retail across Pakistan and internationally. We curate an ultra-exclusive inventory of the world’s most sought-after luxury sedans, grand tourers, hypercars, and bespoke SUVs with full import clearance and white-glove delivery.',
  visionText: 'Delivering unmatched automotive craftsmanship, transparent advisory, and white-glove client experience to connoisseurs and collectors across Pakistan and worldwide.',
  warrantyPolicy: 'Every certified vehicle undergoes an uncompromising 180-point inspection and includes our 24-month comprehensive concierge warranty with 24/7 VIP roadside assistance and factory maintenance packages.',
  warrantyHighlightTitle: '24 Months',
  warrantyHighlightSubtitle: 'Concierge Warranty Included',
  warrantyInspectionPoints: '180-Point',
  warrantyInspectionSubtitle: 'Certified Multi-Point Audit',
  socialInstagram: 'https://instagram.com/apexluxurymotors',
  socialFacebook: 'https://facebook.com/apexluxurymotors',
  socialLinkedIn: 'https://linkedin.com/company/apexluxurymotors',
  socialTwitter: 'https://twitter.com/apexluxurymotors',
  socialWhatsApp: '+923008451122',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

// Default Admin user (password: admin123)
export const initialUsers: UserData[] = [
  {
    id: 'user_admin_01',
    username: 'admin',
    password: '$2b$10$R6ciJrh.Bo0dJoK4nOBqaeOKlz8IDtqu.geNkdaDLESQ717W71F6W', // admin123
    fullName: 'Executive Showroom Admin',
    email: 'admin@apexluxurymotors.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user_sales_01',
    username: 'jordan',
    password: '$2b$10$R6ciJrh.Bo0dJoK4nOBqaeOKlz8IDtqu.geNkdaDLESQ717W71F6W', // admin123
    fullName: 'Jordan Belfort',
    email: 'jordan@apexluxurymotors.com',
    role: 'SALES_AGENT',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'user_admin_02',
    username: 'samiullah',
    password: '$2b$10$R6ciJrh.Bo0dJoK4nOBqaeOKlz8IDtqu.geNkdaDLESQ717W71F6W', // admin123
    fullName: 'Samiullah Nawaz (Super Admin)',
    email: 'samiullah@apexluxurymotors.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user_mgr_01',
    username: 'elena',
    password: '$2b$10$R6ciJrh.Bo0dJoK4nOBqaeOKlz8IDtqu.geNkdaDLESQ717W71F6W', // admin123
    fullName: 'Elena Rostova',
    email: 'elena@apexluxurymotors.com',
    role: 'MANAGER',
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  }
];

export const initialVehicles: VehicleData[] = [
  {
    id: 'veh_001',
    make: 'Rolls-Royce',
    model: 'Ghost Black Badge',
    year: 2025,
    variant: 'V12 Twin-Turbo Bespoke Edition',
    vin: 'SCA664S58NU108921',
    engineNo: 'RR-6.75L-TT-9981',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    exteriorColor: 'Diamond Black Crystal with Mandarin Coachline',
    interiorColor: 'Scivaro Grey & Mandarin Bespoke Leather',
    mileage: 1200,
    costPrice: 125000000,
    sellingPrice: 145000000,
    status: 'AVAILABLE',
    condition: 'CERTIFIED_PRE_OWNED',
    features: 'Starlight Headliner, Illuminated Grille, Rear Theatre Configuration, Bespoke Audio, Massage Seating, Lambswool Floor Mats',
    description: 'The pinnacle of bespoke automotive luxury. Pristine condition with complete provenance and factory warranty remaining.',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'veh_002',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2026,
    variant: 'Weissach Package (992)',
    vin: 'WP0AF2A92RS891204',
    engineNo: 'P992-4.0L-NA-4819',
    bodyType: 'Coupe',
    transmission: 'Dual-Clutch',
    fuelType: 'Petrol',
    exteriorColor: 'Arctic Grey with Pyro Red Accents',
    interiorColor: 'Black Leather & Race-Tex with Guards Red Stitching',
    mileage: 450,
    costPrice: 95000000,
    sellingPrice: 115000000,
    status: 'AVAILABLE',
    condition: 'BRAND_NEW',
    features: 'Weissach Package, Carbon Fiber Roll Cage, PCCB Ceramic Composite Brakes, Front Axle Lift, Bose Surround Sound, Magnesium Wheels',
    description: 'Track-bred masterpiece producing 518 hp naturally aspirated flat-six. Extreme downforce aero package and Weissach carbon appointments.',
    createdAt: '2026-01-12T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'veh_003',
    make: 'Mercedes-Maybach',
    model: 'S 680 4MATIC',
    year: 2025,
    variant: 'V12 Executive First Class Edition',
    vin: 'WDD2231761A990142',
    engineNo: 'M279-6.0L-V12-7712',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    exteriorColor: 'Two-Tone Obsidian Black over Kalahari Gold',
    interiorColor: 'Exclusive Nappa Leather Deep White / Silver Grey',
    mileage: 2800,
    costPrice: 78000000,
    sellingPrice: 95000000,
    status: 'RESERVED',
    condition: 'CERTIFIED_PRE_OWNED',
    features: 'First-Class Rear Suite, Burmester High-End 4D Surround Sound, Rear-Axle Steering (10 deg), Executive Reclining Seats, Champagne Flutes',
    description: 'The ultimate handcrafted V12 luxury limousine. Incomparable ride comfort with E-Active Body Control suspension.',
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'veh_004',
    make: 'Ferrari',
    model: '296 GTB',
    year: 2025,
    variant: 'Assetto Fiorano Hybrid',
    vin: 'ZFF98NMA000289174',
    engineNo: 'F163-3.0L-V6T-2189',
    bodyType: 'Supercar',
    transmission: 'Dual-Clutch',
    fuelType: 'Hybrid',
    exteriorColor: 'Rosso Corsa with Silver Racing Livery',
    interiorColor: 'Nero Alcantara with Giallo Yellow Accents',
    mileage: 890,
    costPrice: 110000000,
    sellingPrice: 135000000,
    status: 'AVAILABLE',
    condition: 'BRAND_NEW',
    features: 'Assetto Fiorano Track Package, Carbon Fiber Wheels, Titanium Exhaust System, Passenger Display, Carbon Ceramic Braking',
    description: '819 hp mid-rear engine plug-in hybrid berlinetta. Exceptional agility and electrified supercar performance.',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'veh_005',
    make: 'Lamborghini',
    model: 'Urus Performante',
    year: 2025,
    variant: '4.0L Twin-Turbo V8 Super SUV',
    vin: 'ZPBUA1ZL7PLA04821',
    engineNo: 'LAM-4.0L-TT-5012',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    exteriorColor: 'Giallo Auge Yellow with Exposed Carbon Bonnet',
    interiorColor: 'Nero Cosmus Alcantara with Performante Trim',
    mileage: 3200,
    costPrice: 88000000,
    sellingPrice: 105000000,
    status: 'SOLD',
    condition: 'CERTIFIED_PRE_OWNED',
    features: 'Akrapovič Titanium Sport Exhaust, 23-inch Pelope Wheels, Bang & Olufsen 3D Sound, Carbon Ceramic Brakes, Carbon Aerokit',
    description: 'The sharpest super SUV on the road. Sold to VIP collector with full ceramic coating and XPEL PPF protection.',
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z',
  },
  {
    id: 'veh_006',
    make: 'Aston Martin',
    model: 'DBX707',
    year: 2026,
    variant: '4.0L Twin-Turbo 707PS Edition',
    vin: 'SCFRMAAW8PGK01934',
    engineNo: 'AMG-4.0L-707-1192',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    exteriorColor: 'Satin Aston Martin Racing Green',
    interiorColor: 'Oxford Tan / Forest Green Semi-Aniline Leather',
    mileage: 600,
    costPrice: 75000000,
    sellingPrice: 92000000,
    status: 'AVAILABLE',
    condition: 'BRAND_NEW',
    features: 'Carbon Ceramic Brakes, Dark Chrome Jewellery Pack, Wireless Apple CarPlay, 16-way Comfort Ventilated Seats, Sport Plus Exhaust',
    description: 'The world’s most powerful luxury SUV. Astonishing dynamics, bespoke British interior tailoring and twin-turbo punch.',
    createdAt: '2026-02-14T00:00:00.000Z',
    updatedAt: '2026-02-14T00:00:00.000Z',
  },
  {
    id: 'veh_007',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2026,
    variant: 'Carbon Vorsprung Quattro 637HP',
    vin: 'WAUZZZFW8PA034912',
    engineNo: 'EV-DUAL-MOTOR-8890',
    bodyType: 'Electric',
    transmission: 'Single-Speed',
    fuelType: 'Electric',
    exteriorColor: 'Kemora Grey Metallic with Gloss Carbon Package',
    interiorColor: 'Fine Nappa Leather Arras Red with Honeycomb Stitching',
    mileage: 150,
    costPrice: 42000000,
    sellingPrice: 55000000,
    status: 'AVAILABLE',
    condition: 'BRAND_NEW',
    features: 'Carbon Ceramic Brakes with Anthracite Calipers, Matrix LED Headlights with Laser Light, Bang & Olufsen 3D, All-Wheel Steering',
    description: 'Electric grand touring perfection. 0-60 in 2.9 seconds with dual-motor Quattro precision and 800V ultra-fast charging.',
    createdAt: '2026-02-18T00:00:00.000Z',
    updatedAt: '2026-02-18T00:00:00.000Z',
  }
];

export const initialSales: SaleData[] = [
  {
    id: 'sale_001',
    invoiceNo: 'INV-2026-001',
    customerId: 'cust_001',
    customerName: 'Chaudhry Tariq Mehmood',
    customerPhone: '+92 (300) 841-2299',
    customerEmail: 'tariq.mehmood@crestview.pk',
    vehicleId: 'veh_005',
    vehicleName: '2025 Lamborghini Urus Performante',
    vehicleVin: 'ZPBUA1ZL7PLA04821',
    basePrice: 105000000,
    taxAmount: 8400000,
    discountAmount: 1500000,
    finalPrice: 111900000,
    paymentMethod: 'Bank Wire',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    saleDate: '2026-02-20T14:30:00.000Z',
    soldBy: 'Jordan Belfort',
    notes: 'Full payment received via interbank RTGS wire. VIP concierge delivery to private residence in DHA Phase 6.',
    createdAt: '2026-02-20T14:30:00.000Z',
    updatedAt: '2026-02-20T14:30:00.000Z',
  },
  {
    id: 'sale_002',
    invoiceNo: 'INV-2026-002',
    customerId: 'cust_002',
    customerName: 'Malik Jahangir Khan',
    customerPhone: '+92 (321) 902-8811',
    customerEmail: 'j.khan@sterlinggroup.com.pk',
    vehicleId: 'veh_past_01',
    vehicleName: '2025 Bentley Flying Spur Mulliner',
    vehicleVin: 'SCBEA6ZG4NC072199',
    basePrice: 85000000,
    taxAmount: 6800000,
    discountAmount: 1000000,
    finalPrice: 90800000,
    paymentMethod: 'Certified Cheque',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    saleDate: '2026-02-28T11:15:00.000Z',
    soldBy: 'Elena Rostova',
    notes: 'Certified pay order verified by bank. Extended 3-year Mulliner executive maintenance package included.',
    createdAt: '2026-02-28T11:15:00.000Z',
    updatedAt: '2026-02-28T11:15:00.000Z',
  }
];

export const initialCustomers: CustomerData[] = [
  {
    id: 'cust_001',
    name: 'Chaudhry Tariq Mehmood',
    phone: '+92 (300) 841-2299',
    email: 'tariq.mehmood@crestview.pk',
    nationalId: '35202-8912093-1',
    address: 'House 142, Sector J, DHA Phase 6, Lahore',
    preferredCategory: 'Supercar / SUV',
    budgetMin: 80000000,
    budgetMax: 160000000,
    notes: 'High-net-worth VIP client. Collects V10 and V12 exotics.',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cust_002',
    name: 'Malik Jahangir Khan',
    phone: '+92 (321) 902-8811',
    email: 'j.khan@sterlinggroup.com.pk',
    nationalId: '42101-7719283-3',
    address: 'Plot 12-B, Khayaban-e-Shamsheer, DHA Phase 5, Karachi',
    preferredCategory: 'Luxury Sedan',
    budgetMin: 70000000,
    budgetMax: 120000000,
    notes: 'Industrialist & VIP client. Prefers chauffeured ultra-luxury saloons.',
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-01-22T00:00:00.000Z',
  },
  {
    id: 'cust_003',
    name: 'Barrister Daniyal Qureshi',
    phone: '+92 (333) 490-1288',
    email: 'daniyal@qureshilegal.com',
    nationalId: '61101-4418902-7',
    address: 'Street 15, Sector F-7/2, Islamabad',
    preferredCategory: 'Sports / Track Coupe',
    budgetMin: 90000000,
    budgetMax: 130000000,
    notes: 'Looking for track-spec Weissach 911 GT3 RS.',
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  }
];

export const initialInquiries: InquiryData[] = [
  {
    id: 'inq_001',
    customerName: 'Barrister Daniyal Qureshi',
    customerPhone: '+92 (333) 490-1288',
    customerEmail: 'daniyal@qureshilegal.com',
    interestedVehicle: 'Porsche 911 GT3 RS Weissach',
    budget: 115000000,
    status: 'TEST_DRIVE_SCHEDULED',
    followUpDate: '2026-09-08T10:00:00.000Z',
    notes: 'Client requested private track demonstration and PTS color consultation.',
    createdAt: '2026-02-12T00:00:00.000Z',
    updatedAt: '2026-02-12T00:00:00.000Z',
  },
  {
    id: 'inq_002',
    customerName: 'Dr. Tariq Al-Mansoor',
    customerPhone: '+92 (301) 554-9912',
    customerEmail: 't.almansoor@medcare.org',
    interestedVehicle: 'Rolls-Royce Ghost Black Badge',
    budget: 145000000,
    status: 'NEGOTIATING',
    followUpDate: '2026-09-10T15:00:00.000Z',
    notes: 'Discussing custom starlight headliner and trade-in evaluation.',
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'inq_003',
    customerName: 'Zainab Fatima',
    customerPhone: '+92 (345) 609-4411',
    customerEmail: 'zainab.fatima@artisanstudios.pk',
    interestedVehicle: 'Audi RS e-tron GT',
    budget: 55000000,
    status: 'NEW',
    followUpDate: '2026-09-07T11:00:00.000Z',
    notes: 'Inquired via showroom web portal regarding home fast charger setup and battery warranty.',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  }
];

export const initialTestDrives: TestDriveData[] = [
  {
    id: 'td_001',
    customerName: 'Barrister Daniyal Qureshi',
    customerPhone: '+92 (333) 490-1288',
    customerEmail: 'daniyal@qureshilegal.com',
    vehicleName: 'Porsche 911 GT3 RS (WP0AF2A92RS891204)',
    scheduledDate: '2026-09-08T10:00:00.000Z',
    licenseNumber: 'DL-ICT-9021884-A',
    status: 'SCHEDULED',
    feedback: 'Pre-flight vehicle checks complete. Showroom VIP demonstration arranged.',
    createdAt: '2026-02-12T00:00:00.000Z',
    updatedAt: '2026-02-12T00:00:00.000Z',
  },
  {
    id: 'td_002',
    customerName: 'Malik Jahangir Khan',
    customerPhone: '+92 (321) 902-8811',
    customerEmail: 'j.khan@sterlinggroup.com.pk',
    vehicleName: 'Mercedes-Maybach S 680 4MATIC',
    scheduledDate: '2026-02-25T14:00:00.000Z',
    licenseNumber: 'DL-KHI-4481029-B',
    status: 'COMPLETED',
    feedback: 'Client thoroughly impressed with rear executive suite, first-class legroom and Burmester 4D audio.',
    createdAt: '2026-02-20T00:00:00.000Z',
    updatedAt: '2026-02-25T16:00:00.000Z',
  }
];

export const initialSuppliers: SupplierData[] = [
  {
    id: 'sup_001',
    name: 'Dubai & Monaco Luxury Auto Logistics FZE',
    contactPerson: 'Henri de Montferrat',
    phone: '+971 4 399 2200',
    email: 'h.montferrat@monacoprestige.ae',
    address: 'Office 1204, Downtown Boulevard, Dubai, UAE',
    totalProcured: 380000000,
    notes: 'Primary international procurement partner for direct zero-meter bespoke allocations.',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'sup_002',
    name: 'Stuttgart Direct Exotics Direct Import GmbH',
    contactPerson: 'Klaus Weidemann',
    phone: '+49 711 911 00',
    email: 'klaus.w@stuttgart-exotics.de',
    address: 'Porscheplatz 1, 70435 Stuttgart, Germany',
    totalProcured: 290000000,
    notes: 'Official channel for bespoke Weissach and Paint-to-Sample GT allocations.',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  }
];
