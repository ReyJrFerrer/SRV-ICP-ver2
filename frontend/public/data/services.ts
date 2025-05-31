// SRV-ICP-1/public/data/services.ts

export interface ServicePrice {
  amount: number;
  currency: string;
  unit: string;
  isNegotiable: boolean;
}

export interface ServiceLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  serviceRadius: number;
  serviceRadiusUnit: string;
}

export interface ServiceAvailability {
  schedule: string[];
  timeSlots: string[];
  isAvailableNow: boolean;
}

export interface ServiceRating {
  average: number;
  count: number;
}

export interface ServicePackage {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string; // Provider's Name
  title: string; // Service Title
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  price: ServicePrice;
  location: ServiceLocation;
  availability: ServiceAvailability;
  rating: ServiceRating;
  heroImage: string;
  galleryImages?: string[];
  slug: string;
  packages: ServicePackage[];
  categoryId: string;
  contactEmail?: string;    
  contactPhone?: string;    
}

export const SERVICES: Service[] = [
  {
    id: "svc-001",
    providerId: "prov-001",
    name: "Mary Gold",
    title: "House Maid",
    description: "Experienced house maid for cleaning, organizing, and maintaining your home",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    price: { amount: 350, currency: "PHP", unit: "/ Hr", isNegotiable: true },
    location: { address: "Baguio City - Session Road", coordinates: { latitude: 16.4145, longitude: 120.5960 }, serviceRadius: 10, serviceRadiusUnit: "km" },
    availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], timeSlots: ["08:00-17:00"], isAvailableNow: true },
    rating: { average: 4.8, count: 156 },
    heroImage: "/images/CleaningServices-HouseMaid3.jpg",
    slug: "mary-gold-house-maid",
    packages: [ { id: 'pkg1-1', name: 'Regular Cleaning (2hrs)' }, { id: 'pkg1-2', name: 'Deep Cleaning Kitchen' }, { id: 'pkg1-3', name: 'Laundry Service' }, { id: 'pkg1-4', name: 'Full House Deep Clean (4hrs)' }, ],
    galleryImages: [ "/images/CleaningServices-HouseMaid2.jpg", "/images/CleaningServices-HouseMaid3.jpg" ],
    categoryId: "cat-001-01",
    contactEmail: "mary.gold@example.com",
    contactPhone: "0917-123-4567"
  },
  {
    id: "svc-002",
    providerId: "prov-002",
    name: "Carlos Santos",
    title: "Plumber",
    description: "Professional plumbing services for residential and commercial properties",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    price: { amount: 850, currency: "PHP", unit: "/ Hr", isNegotiable: true },
    location: { address: "Quezon City - Diliman", coordinates: { latitude: 14.6559, longitude: 121.0684 }, serviceRadius: 15, serviceRadiusUnit: "km" },
    availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], timeSlots: ["07:00-18:00"], isAvailableNow: true },
    rating: { average: 4.6, count: 89 },
    heroImage: "/images/HomeServices-Plumbing1.jpg",
    slug: "carlos-santos-plumber",
    packages: [ { id: 'pkg2-1', name: 'Faucet Repair/Replacement' }, { id: 'pkg2-2', name: 'Toilet Repair' }, { id: 'pkg2-3', name: 'Drain Cleaning' }, { id: 'pkg2-4', name: 'Emergency Plumbing Service (1hr)' }, ],
    galleryImages: [ "/images/HomeServices-Plumbing2.jpg", "/images/HomeServices-Plumbing3.jpg" ],
    categoryId: "cat-001",
    contactPhone: "0922-987-6543"
  },
  {
    id: "svc-003",
    providerId: "prov-003",
    name: "Lisa Chen",
    title: "Auto Mechanic",
    description: "Expert automotive repair and maintenance services",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    price: { amount: 1500, currency: "PHP", unit: "/ Hr", isNegotiable: false },
    location: { address: "Manila - Ermita", coordinates: { latitude: 14.5958, longitude: 120.9772 }, serviceRadius: 20, serviceRadiusUnit: "km" },
    availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], timeSlots: ["08:00-17:00"], isAvailableNow: false },
    rating: { average: 4.9, count: 234 },
    heroImage: "/images/Automobile Repairs-AutoMechanic2.jpg",
    slug: "lisa-chen-auto-mechanic",
    packages: [ { id: 'pkg3-1', name: 'Oil Change & Basic Checkup' }, { id: 'pkg3-2', name: 'Brake Inspection & Repair' }, { id: 'pkg3-3', name: 'Engine Diagnostics' }, { id: 'pkg3-4', name: 'Tire Rotation & Balancing' }, ],
    galleryImages: [ "/images/Automobile Repairs-AutoMechanic3.jpg" ],
    categoryId: "cat-003",
    contactEmail: "lisa.mechanic@example.com"
  },
  {
    id: "svc-004",
    providerId: "prov-004",
    name: "Maria Rodriguez",
    title: "Hairstylist",
    description: "Professional hair styling and beauty services at your location",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    price: { amount: 800, currency: "PHP", unit: "/ Session", isNegotiable: true },
    location: { address: "Makati City - Salcedo Village", coordinates: { latitude: 14.5547, longitude: 121.0244 }, serviceRadius: 12, serviceRadiusUnit: "km" },
    availability: { schedule: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], timeSlots: ["10:00-19:00"], isAvailableNow: true },
    rating: { average: 4.7, count: 112 },
    heroImage: "/images/BeautyServices-Hairstylist1.jpg",
    slug: "maria-rodriguez-hairstylist",
    packages: [ { id: 'pkg4-1', name: 'Haircut & Blowdry' }, { id: 'pkg4-2', name: 'Hair Color (Full)' }, { id: 'pkg4-3', name: 'Event Styling / Updo' }, { id: 'pkg4-4', name: 'Manicure & Pedicure Add-on' }, ],
    galleryImages: [ "/images/BeautyServices-Hairstylist2.jpg", "/images/BeautyServices-Hairstylist3.jpg" ],
    categoryId: "cat-002",
    contactEmail: "maria.stylist@example.com",
    contactPhone: "0918-111-2222"
  },
  {
    id: "svc-005",
    providerId: "prov-005",
    name: "John Delos Santos",
    title: "Repair Technician",
    description: "General home repair and maintenance specialist",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    price: { amount: 750, currency: "PHP", unit: "/ Hr", isNegotiable: true },
    location: { address: "Pasig City - Ortigas", coordinates: { latitude: 14.5764, longitude: 121.0851 }, serviceRadius: 18, serviceRadiusUnit: "km" },
    availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], timeSlots: ["08:00-17:00"], isAvailableNow: true },
    rating: { average: 4.5, count: 78 },
    heroImage: "/images/HomeServices-RepairTechnician1.jpg",
    slug: "john-delos-santos-repair-technician",
    packages: [ { id: 'pkg5-1', name: 'Appliance Repair Assessment' }, { id: 'pkg5-2', name: 'Furniture Assembly' }, { id: 'pkg5-3', name: 'Picture Hanging & Shelf Mounting' }, { id: 'pkg5-4', name: 'Minor Electrical Fixes' }, ],
    galleryImages: [ "/images/HomeServices-RepairTechnician2.jpg", "/images/HomeServices-RepairTechnician3.jpg" ],
    categoryId: "cat-001",
    contactPhone: "0920-555-7890"
  },

  // --- Gadget Technicians (with contacts) ---
  {
    id: "svc-006", providerId: "prov-006", name: "Alex Reyes", title: "Smartphone Repair Specialist", description: "Expert in screen replacements, battery issues, and software troubleshooting for all major smartphone brands.", isActive: true, createdAt: new Date("2024-02-01"), updatedAt: new Date("2024-05-15"), price: { amount: 1000, currency: "PHP", unit: "/ Repair", isNegotiable: true }, location: { address: "Cebu City - IT Park", coordinates: { latitude: 10.3292, longitude: 123.9055 }, serviceRadius: 15, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Saturday"], timeSlots: ["10:00-19:00"], isAvailableNow: true }, rating: { average: 4.9, count: 95 }, heroImage: "/images/GadgetTechnician-Smartphone1.jpg", slug: "alex-reyes-smartphone-repair", packages: [ { id: 'pkg6-1', name: 'Screen Replacement (iPhone)' }, { id: 'pkg6-2', name: 'Battery Replacement (Android)' }, { id: 'pkg6-3', name: 'Software Update & Backup' }, ], galleryImages: ["/images/GadgetTechnician-Smartphone2.jpg", "/images/GadgetTechnician-Smartphone3.jpg"], categoryId: "cat-005", contactEmail: "alex.gadgets@example.com", contactPhone: "0917-234-5678"
  },
  {
    id: "svc-007", providerId: "prov-007", name: "Bianca Cruz", title: "Laptop & PC Technician", description: "Hardware upgrades, virus removal, OS installation, and performance tuning for laptops and desktops.", isActive: true, createdAt: new Date("2024-02-10"), updatedAt: new Date("2024-05-10"), price: { amount: 1200, currency: "PHP", unit: "/ Service", isNegotiable: false }, location: { address: "Davao City - Downtown", coordinates: { latitude: 7.0722, longitude: 125.6131 }, serviceRadius: 20, serviceRadiusUnit: "km" }, availability: { schedule: ["Tuesday", "Thursday", "Saturday"], timeSlots: ["09:00-18:00", "19:00-21:00"], isAvailableNow: false }, rating: { average: 4.7, count: 110 }, heroImage: "/images/GadgetTechnician-Laptop1.jpg", slug: "bianca-cruz-laptop-pc-tech", packages: [ { id: 'pkg7-1', name: 'Laptop Keyboard Replacement' }, { id: 'pkg7-2', name: 'SSD Upgrade & OS Migration' }, { id: 'pkg7-3', name: 'Full System Virus Scan & Removal' }, ], galleryImages: ["/images/GadgetTechnician-Laptop2.jpg"], categoryId: "cat-005", contactEmail: "bianca.pcfix@example.com"
  },
  {
    id: "svc-008", providerId: "prov-008", name: "Kevin Lee", title: "Game Console Repair", description: "Fixing common issues with PlayStation, Xbox, and Nintendo consoles like overheating, disk read errors, and controller problems.", isActive: true, createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-05-20"), price: { amount: 1500, currency: "PHP", unit: "/ Fix", isNegotiable: true }, location: { address: "Mandaluyong City - Greenfield District", coordinates: { latitude: 14.5776, longitude: 121.0480 }, serviceRadius: 10, serviceRadiusUnit: "km" }, availability: { schedule: ["Wednesday", "Friday", "Sunday"], timeSlots: ["13:00-22:00"], isAvailableNow: true }, rating: { average: 4.8, count: 75 }, heroImage: "/images/GadgetTechnician-Console1.jpg", slug: "kevin-lee-console-repair", packages: [ { id: 'pkg8-1', name: 'PS5 HDMI Port Repair' }, { id: 'pkg8-2', name: 'Xbox Controller Drift Fix' }, { id: 'pkg8-3', name: 'Nintendo Switch Screen Repair' }, ], categoryId: "cat-005", contactPhone: "0928-345-6789"
  },
  {
    id: "svc-009", providerId: "prov-009", name: "Sarah David", title: "Tablet & E-Reader Specialist", description: "Specializing in repairs for iPads, Android tablets, and Kindle devices, including screen and battery issues.", isActive: true, createdAt: new Date("2024-03-15"), updatedAt: new Date("2024-05-25"), price: { amount: 900, currency: "PHP", unit: "/ Repair", isNegotiable: true }, location: { address: "Taguig City - BGC", coordinates: { latitude: 14.5510, longitude: 121.0509 }, serviceRadius: 12, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Thursday"], timeSlots: ["11:00-20:00"], isAvailableNow: true }, rating: { average: 4.6, count: 60 }, heroImage: "/images/GadgetTechnician-Tablet1.jpg", slug: "sarah-david-tablet-repair", packages: [ { id: 'pkg9-1', name: 'iPad Screen Replacement' }, { id: 'pkg9-2', name: 'Kindle Battery Change' }, ], galleryImages: ["/images/GadgetTechnician-Tablet2.jpg"], categoryId: "cat-005", contactEmail: "sarah.tabletfix@example.com", contactPhone: "0919-456-7890"
  },
  {
    id: "svc-010", providerId: "prov-010", name: "Mike Tan", title: "Data Recovery Expert", description: "Professional data recovery from corrupted hard drives, SSDs, USB drives, and memory cards.", isActive: true, createdAt: new Date("2024-04-01"), updatedAt: new Date("2024-05-18"), price: { amount: 2500, currency: "PHP", unit: "/ Attempt", isNegotiable: false }, location: { address: "Pasay City - Mall of Asia Complex", coordinates: { latitude: 14.5350, longitude: 120.9822 }, serviceRadius: 25, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday"], timeSlots: ["09:00-17:00"], isAvailableNow: false }, rating: { average: 4.9, count: 45 }, heroImage: "/images/GadgetTechnician-DataRecovery1.jpg", slug: "mike-tan-data-recovery", packages: [ { id: 'pkg10-1', name: 'Hard Drive Data Recovery Assessment' }, { id: 'pkg10-2', name: 'USB Flash Drive Recovery' }, ], categoryId: "cat-005", contactEmail: "mike.datarecovery@example.com"
  },

  // Electricians (with contacts)
  {
    id: "svc-011", providerId: "prov-011", name: "Robert Gomez", title: "Residential Electrician", description: "Licensed electrician for home wiring, outlet installation, circuit breaker issues, and lighting fixtures.", isActive: true, createdAt: new Date("2024-01-05"), updatedAt: new Date("2024-05-01"), price: { amount: 900, currency: "PHP", unit: "/ Hr", isNegotiable: true }, location: { address: "Antipolo City - Rizal", coordinates: { latitude: 14.5869, longitude: 121.1754 }, serviceRadius: 30, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], timeSlots: ["07:30-17:30"], isAvailableNow: true }, rating: { average: 4.7, count: 130 }, heroImage: "/images/Electrician-Residential1.jpg", slug: "robert-gomez-electrician", packages: [ { id: 'pkg11-1', name: 'Outlet Installation (per unit)' }, { id: 'pkg11-2', name: 'Ceiling Fan Installation' }, { id: 'pkg11-3', name: 'Electrical Safety Inspection' }, ], galleryImages: ["/images/Electrician-Residential2.jpg"], categoryId: "cat-001", contactPhone: "0921-567-8901"
  },
  {
    id: "svc-012", providerId: "prov-012", name: "Isabelle Dizon", title: "Commercial Electrical Services", description: "Specializing in electrical systems for commercial buildings, including maintenance, upgrades, and emergency repairs.", isActive: true, createdAt: new Date("2024-01-20"), updatedAt: new Date("2024-04-20"), price: { amount: 1500, currency: "PHP", unit: "/ Hr", isNegotiable: false }, location: { address: "Parañaque City - Entertainment City", coordinates: { latitude: 14.5208, longitude: 120.9839 }, serviceRadius: 25, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday"], timeSlots: ["09:00-18:00"], isAvailableNow: false }, rating: { average: 4.8, count: 88 }, heroImage: "/images/Electrician-Commercial1.jpg", slug: "isabelle-dizon-commercial-electrician", packages: [ { id: 'pkg12-1', name: 'Office Lighting Upgrade' }, { id: 'pkg12-2', name: 'Generator Set Maintenance' }, ], categoryId: "cat-001", contactEmail: "isabelle.electric@example.com", contactPhone: "0916-678-9012"
  },
  {
    id: "svc-013", providerId: "prov-013", name: "Juan Dela Cruz", title: "Emergency Electrician 24/7", description: "Available 24/7 for urgent electrical issues, power outages, and safety hazards.", isActive: true, createdAt: new Date("2024-02-01"), updatedAt: new Date("2024-05-15"), price: { amount: 2000, currency: "PHP", unit: "/ Call-out", isNegotiable: false }, location: { address: "Caloocan City - Monumento", coordinates: { latitude: 14.6572, longitude: 120.9845 }, serviceRadius: 20, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], timeSlots: ["00:00-23:59"], isAvailableNow: true }, rating: { average: 4.9, count: 210 }, heroImage: "/images/Electrician-Emergency1.jpg", slug: "juan-delacruz-emergency-electrician", packages: [ { id: 'pkg13-1', name: 'Emergency Power Restoration' }, { id: 'pkg13-2', name: 'Urgent Fault Finding' }, ], categoryId: "cat-001", contactPhone: "0927-247-HELP"
  },
  {
    id: "svc-014", providerId: "prov-014", name: "Angela Santos", title: "Solar Panel Electrician", description: "Installation, maintenance, and repair of solar panel systems for residential and commercial properties.", isActive: true, createdAt: new Date("2024-03-10"), updatedAt: new Date("2024-05-22"), price: { amount: 1800, currency: "PHP", unit: "/ Hr", isNegotiable: true }, location: { address: "Laguna - Santa Rosa City", coordinates: { latitude: 14.2809, longitude: 121.0900 }, serviceRadius: 40, serviceRadiusUnit: "km" }, availability: { schedule: ["Tuesday", "Thursday", "Saturday"], timeSlots: ["08:00-16:00"], isAvailableNow: false }, rating: { average: 4.7, count: 65 }, heroImage: "/images/Electrician-Solar1.jpg", slug: "angela-santos-solar-electrician", packages: [ { id: 'pkg14-1', name: 'Solar Panel Installation (per panel)' }, { id: 'pkg14-2', name: 'Inverter Check and Repair' }, ], categoryId: "cat-001", contactEmail: "angela.solar@example.com"
  },
  {
    id: "svc-015", providerId: "prov-015", name: "Mark Bautista", title: "Appliance Wiring & Installation", description: "Specialized in wiring and installation for heavy-duty appliances like air conditioners, ovens, and water heaters.", isActive: true, createdAt: new Date("2024-04-05"), updatedAt: new Date("2024-05-28"), price: { amount: 1000, currency: "PHP", unit: "/ Appliance", isNegotiable: true }, location: { address: "Marikina City - Concepcion", coordinates: { latitude: 14.6400, longitude: 121.0989 }, serviceRadius: 15, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday"], timeSlots: ["09:00-17:00", "18:00-20:00"], isAvailableNow: true }, rating: { average: 4.6, count: 92 }, heroImage: "/images/Electrician-Appliance1.jpg", slug: "mark-bautista-appliance-wiring", packages: [ { id: 'pkg15-1', name: 'Aircon Unit Wiring & Setup' }, { id: 'pkg15-2', name: 'Electric Stove Installation' }, ], categoryId: "cat-001", contactPhone: "0915-789-0123", contactEmail: "mark.appliance@example.com"
  },

  // Photographers (with contacts)
  {
    id: "svc-016", providerId: "prov-016", name: "Chloe Lim", title: "Wedding Photographer", description: "Capturing your special day with artistic and candid wedding photography.", isActive: true, createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-05-10"), price: { amount: 25000, currency: "PHP", unit: "/ Event", isNegotiable: true }, location: { address: "Tagaytay City - Cavite", coordinates: { latitude: 14.1169, longitude: 120.9620 }, serviceRadius: 100, serviceRadiusUnit: "km" }, availability: { schedule: ["Friday", "Saturday", "Sunday"], timeSlots: ["08:00-22:00"], isAvailableNow: false }, rating: { average: 4.9, count: 150 }, heroImage: "/images/Photographer-Wedding1.jpg", slug: "chloe-lim-wedding-photo", packages: [ { id: 'pkg16-1', name: 'Full Day Wedding Coverage' }, { id: 'pkg16-2', name: 'Engagement Photoshoot (2hrs)' }, { id: 'pkg16-3', name: 'Wedding Album & Prints' }, ], galleryImages: ["/images/Photographer-Wedding2.jpg", "/images/Photographer-Wedding3.jpg"], categoryId: "cat-006", contactEmail: "chloe.lim.photo@example.com"
  },
  {
    id: "svc-017", providerId: "prov-017", name: "Jameson Yap", title: "Portrait & Lifestyle Photographer", description: "Creating stunning portraits for individuals, families, and lifestyle branding.", isActive: true, createdAt: new Date("2024-02-05"), updatedAt: new Date("2024-05-20"), price: { amount: 5000, currency: "PHP", unit: "/ Session (2hrs)", isNegotiable: true }, location: { address: "Quezon City - Scout Area", coordinates: { latitude: 14.637, longitude: 121.03 }, serviceRadius: 20, serviceRadiusUnit: "km" }, availability: { schedule: ["Tuesday", "Thursday", "Saturday", "Sunday"], timeSlots: ["09:00-18:00"], isAvailableNow: true }, rating: { average: 4.8, count: 85 }, heroImage: "/images/Photographer-Portrait1.jpg", slug: "jameson-yap-portrait-photo", packages: [ { id: 'pkg17-1', name: 'Individual Portrait Session' }, { id: 'pkg17-2', name: 'Family Photoshoot' }, { id: 'pkg17-3', name: 'Branding/Lifestyle Shoot' }, ], galleryImages: ["/images/Photographer-Portrait2.jpg"], categoryId: "cat-006", contactPhone: "0922-890-1234"
  },
  {
    id: "svc-018", providerId: "prov-018", name: "Sofia Reyes", title: "Event Photographer (Corporate & Parties)", description: "Professional photography for corporate events, birthdays, debuts, and other celebrations.", isActive: true, createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-05-25"), price: { amount: 8000, currency: "PHP", unit: "/ 4hr Event", isNegotiable: true }, location: { address: "Makati City - CBD", coordinates: { latitude: 14.5547, longitude: 121.0244 }, serviceRadius: 25, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"], timeSlots: ["10:00-23:00"], isAvailableNow: true }, rating: { average: 4.7, count: 112 }, heroImage: "/images/Photographer-Event1.jpg", slug: "sofia-reyes-event-photo", packages: [ { id: 'pkg18-1', name: 'Corporate Event (Half Day)' }, { id: 'pkg18-2', name: 'Birthday Party Coverage' }, { id: 'pkg18-3', name: 'Photo Booth Add-on' }, ], categoryId: "cat-006", contactEmail: "sofia.events@example.com", contactPhone: "0917-345-0011"
  },
  {
    id: "svc-019", providerId: "prov-019", name: "Ethan Miller", title: "Product Photographer", description: "High-quality product photography for e-commerce, catalogs, and advertising.", isActive: true, createdAt: new Date("2024-03-20"), updatedAt: new Date("2024-05-19"), price: { amount: 500, currency: "PHP", unit: "/ Product", isNegotiable: true }, location: { address: "Pasig City - Kapitolyo", coordinates: { latitude: 14.5707, longitude: 121.0604 }, serviceRadius: 15, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], timeSlots: ["09:00-17:00"], isAvailableNow: true }, rating: { average: 4.9, count: 70 }, heroImage: "/images/Photographer-Product1.jpg", slug: "ethan-miller-product-photo", packages: [ { id: 'pkg19-1', name: 'Basic Product Shot (White BG)' }, { id: 'pkg19-2', name: 'Lifestyle Product Shot' }, { id: 'pkg19-3', name: 'Bulk Product Photography (10+ items)' }, ], galleryImages: ["/images/Photographer-Product2.jpg", "/images/Photographer-Product3.jpg"], categoryId: "cat-006", contactEmail: "ethan.productshots@example.com"
  },
  {
    id: "svc-020", providerId: "prov-020", name: "Isla Santos", title: "Real Estate Photographer", description: "Professional interior and exterior photography for real estate listings and property marketing.", isActive: true, createdAt: new Date("2024-04-10"), updatedAt: new Date("2024-05-28"), price: { amount: 7000, currency: "PHP", unit: "/ Property", isNegotiable: false }, location: { address: "Alabang, Muntinlupa City", coordinates: { latitude: 14.4181, longitude: 121.0429 }, serviceRadius: 30, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday"], timeSlots: ["08:00-17:00"], isAvailableNow: false }, rating: { average: 4.8, count: 55 }, heroImage: "/images/Photographer-RealEstate1.jpg", slug: "isla-santos-realestate-photo", packages: [ { id: 'pkg20-1', name: 'Standard Property Shoot (20 photos)' }, { id: 'pkg20-2', name: 'Premium Shoot + Drone Shots' }, { id: 'pkg20-3', name: 'Virtual Tour Add-on' }, ], categoryId: "cat-006", contactPhone: "0928-123-9876"
  },

  // Tutors (with contacts)
  {
    id: "svc-021", providerId: "prov-021", name: "Prof. Elena Reyes", title: "Math & Science Tutor (High School)", description: "Experienced tutor specializing in High School Mathematics (Algebra, Geometry, Calculus) and Sciences (Physics, Chemistry).", isActive: true, createdAt: new Date("2024-01-10"), updatedAt: new Date("2024-05-12"), price: { amount: 700, currency: "PHP", unit: "/ Hr", isNegotiable: true }, location: { address: "Quezon City - Katipunan Ave", coordinates: { latitude: 14.638, longitude: 121.074 }, serviceRadius: 10, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Saturday"], timeSlots: ["15:00-20:00"], isAvailableNow: true }, rating: { average: 4.9, count: 120 }, heroImage: "/images/Tutor-MathScience1.jpg", slug: "elena-reyes-math-science-tutor", packages: [ { id: 'pkg21-1', name: 'Algebra Tutoring (1hr)' }, { id: 'pkg21-2', name: 'Physics Exam Prep (2hrs)' }, { id: 'pkg21-3', name: 'Weekly Tutoring Package (4 sessions)' }, ], categoryId: "cat-007", contactEmail: "prof.elena@example.edu"
  },
  {
    id: "svc-022", providerId: "prov-022", name: "David Lee", title: "English & Literature Tutor (College)", description: "TESOL certified tutor for college-level English, essay writing, literature analysis, and exam preparation.", isActive: true, createdAt: new Date("2024-02-15"), updatedAt: new Date("2024-05-20"), price: { amount: 800, currency: "PHP", unit: "/ Hr", isNegotiable: false }, location: { address: "Online / Makati City for in-person", coordinates: { latitude: 14.5547, longitude: 121.0244 }, serviceRadius: 0, serviceRadiusUnit: "km" }, availability: { schedule: ["Tuesday", "Thursday", "Saturday", "Sunday"], timeSlots: ["10:00-19:00"], isAvailableNow: false }, rating: { average: 4.8, count: 95 }, heroImage: "/images/Tutor-English1.jpg", slug: "david-lee-english-tutor", packages: [ { id: 'pkg22-1', name: 'Essay Writing Workshop (1.5hr)' }, { id: 'pkg22-2', name: 'IELTS Speaking Practice' }, { id: 'pkg22-3', name: 'Literature Review Assistance' }, ], galleryImages: ["/images/Tutor-English2.jpg"], categoryId: "cat-007", contactEmail: "david.lee.tutor@example.com", contactPhone: "0917-555-0101"
  },
  {
    id: "svc-023", providerId: "prov-023", name: "Anna Garcia", title: "Music Tutor (Piano & Guitar)", description: "Patient and skilled music instructor for beginner to intermediate piano and guitar lessons.", isActive: true, createdAt: new Date("2024-03-05"), updatedAt: new Date("2024-05-28"), price: { amount: 600, currency: "PHP", unit: "/ 45min Lesson", isNegotiable: true }, location: { address: "San Juan City - Greenhills", coordinates: { latitude: 14.6036, longitude: 121.0454 }, serviceRadius: 8, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday"], timeSlots: ["14:00-19:00"], isAvailableNow: true }, rating: { average: 4.9, count: 70 }, heroImage: "/images/Tutor-Music1.jpg", slug: "anna-garcia-music-tutor", packages: [ { id: 'pkg23-1', name: 'Beginner Piano Lesson' }, { id: 'pkg23-2', name: 'Acoustic Guitar Fundamentals' }, { id: 'pkg23-3', name: 'Music Theory Basics' }, ], categoryId: "cat-007", contactPhone: "0920-121-3434"
  },
  {
    id: "svc-024", providerId: "prov-024", name: "Miguel Castro", title: "Coding Tutor (Python & Web Dev)", description: "Software developer offering tutoring in Python programming, HTML, CSS, JavaScript, and basic web development concepts.", isActive: true, createdAt: new Date("2024-03-20"), updatedAt: new Date("2024-05-15"), price: { amount: 1000, currency: "PHP", unit: "/ Hr", isNegotiable: false }, location: { address: "Online", coordinates: { latitude: 0, longitude: 0 }, serviceRadius: 0, serviceRadiusUnit: "km" }, availability: { schedule: ["Tuesday", "Thursday", "Saturday"], timeSlots: ["18:00-22:00"], isAvailableNow: true }, rating: { average: 4.8, count: 110 }, heroImage: "/images/Tutor-Coding1.jpg", slug: "miguel-castro-coding-tutor", packages: [ { id: 'pkg24-1', name: 'Introduction to Python (2hrs)' }, { id: 'pkg24-2', name: 'HTML & CSS Basics Workshop' }, { id: 'pkg24-3', name: 'JavaScript Fundamentals' }, ], categoryId: "cat-007", contactEmail: "miguelcodes@example.dev"
  },
  {
    id: "svc-025", providerId: "prov-025", name: "Jasmine Aquino", title: "Language Tutor (Filipino & Spanish)", description: "Native Filipino speaker and fluent Spanish tutor offering conversational lessons and grammar instruction.", isActive: true, createdAt: new Date("2024-04-01"), updatedAt: new Date("2024-05-25"), price: { amount: 650, currency: "PHP", unit: "/ Hr", isNegotiable: true }, location: { address: "Manila - Intramuros (for historical context or online)", coordinates: { latitude: 14.5890, longitude: 120.9747 }, serviceRadius: 10, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Sunday"], timeSlots: ["09:00-15:00"], isAvailableNow: false }, rating: { average: 4.7, count: 80 }, heroImage: "/images/Tutor-Language1.jpg", slug: "jasmine-aquino-language-tutor", packages: [ { id: 'pkg25-1', name: 'Conversational Filipino Practice' }, { id: 'pkg25-2', name: 'Beginner Spanish Lessons' }, ], galleryImages: ["/images/Tutor-Language2.jpg"], categoryId: "cat-007", contactEmail: "jasmine.speaks@example.com", contactPhone: "0918-777-6543"
  },

  // Delivery Services (with contacts)
  {
    id: "svc-026", providerId: "prov-026", name: "QuickDrop Deliveries", title: "Same-Day Parcel Delivery", description: "Fast and reliable same-day parcel and document delivery within Metro Manila.", isActive: true, createdAt: new Date("2024-01-25"), updatedAt: new Date("2024-05-20"), price: { amount: 150, currency: "PHP", unit: "/ Drop (within 5km)", isNegotiable: false }, location: { address: "Makati City - Central Post Office", coordinates: { latitude: 14.5547, longitude: 121.0244 }, serviceRadius: 25, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], timeSlots: ["08:00-20:00"], isAvailableNow: true }, rating: { average: 4.6, count: 350 }, heroImage: "/images/Delivery-Parcel1.jpg", slug: "quickdrop-parcel-delivery", packages: [ { id: 'pkg26-1', name: 'Small Parcel (Max 1kg)' }, { id: 'pkg26-2', name: 'Medium Parcel (Max 5kg)' }, { id: 'pkg26-3', name: 'Document Delivery' }, ], categoryId: "cat-004", contactPhone: "02-8-QUICKDROP"
  },
  {
    id: "svc-027", providerId: "prov-027", name: "FoodieExpress", title: "Local Food Delivery", description: "Your neighborhood food delivery service. We pick up from local restaurants and deliver to your doorstep.", isActive: true, createdAt: new Date("2024-02-10"), updatedAt: new Date("2024-05-22"), price: { amount: 80, currency: "PHP", unit: "/ Delivery Fee", isNegotiable: false }, location: { address: "Quezon City - Tomas Morato", coordinates: { latitude: 14.633, longitude: 121.033 }, serviceRadius: 8, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], timeSlots: ["10:00-22:00"], isAvailableNow: true }, rating: { average: 4.7, count: 550 }, heroImage: "/images/Delivery-Food1.jpg", slug: "foodieexpress-local-food", packages: [ { id: 'pkg27-1', name: 'Standard Food Delivery' }, { id: 'pkg27-2', name: 'Bulk Order (3+ items from same resto)' }, ], galleryImages: ["/images/Delivery-Food2.jpg"], categoryId: "cat-004", contactPhone: "0999-FOOD-EXP"
  },
  {
    id: "svc-028", providerId: "prov-028", name: "GroceriesOnWheels", title: "Grocery Shopping & Delivery", description: "Personalized grocery shopping from your favorite supermarkets and delivery to your home.", isActive: true, createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-05-18"), price: { amount: 250, currency: "PHP", unit: "/ Shopping Trip + Delivery", isNegotiable: false }, location: { address: "Pasig City - Kapitolyo", coordinates: { latitude: 14.5707, longitude: 121.0604 }, serviceRadius: 10, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Saturday"], timeSlots: ["09:00-18:00"], isAvailableNow: false }, rating: { average: 4.8, count: 210 }, heroImage: "/images/Delivery-Grocery1.jpg", slug: "groceriesonwheels-delivery", packages: [ { id: 'pkg28-1', name: 'Express Grocery (Max 10 items)' }, { id: 'pkg28-2', name: 'Full Cart Shopping' }, ], categoryId: "cat-004", contactEmail: "orders@groceriesonwheels.ph"
  },
  {
    id: "svc-029", providerId: "prov-029", name: "PharmaGo", title: "Medicine Delivery", description: "Fast and discreet delivery of prescription and over-the-counter medicines from pharmacies.", isActive: true, createdAt: new Date("2024-04-05"), updatedAt: new Date("2024-05-29"), price: { amount: 120, currency: "PHP", unit: "/ Delivery", isNegotiable: false }, location: { address: "Mandaluyong City - Near Hospitals", coordinates: { latitude: 14.5812, longitude: 121.039 }, serviceRadius: 15, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], timeSlots: ["07:00-23:00"], isAvailableNow: true }, rating: { average: 4.9, count: 180 }, heroImage: "/images/Delivery-Medicine1.jpg", slug: "pharmago-medicine-delivery", packages: [ { id: 'pkg29-1', name: 'Standard Medicine Delivery' }, { id: 'pkg29-2', name: 'Urgent Prescription Refill' }, ], categoryId: "cat-004", contactPhone: "0917-PHARMA-GO", contactEmail: "support@pharmago.ph"
  },
  {
    id: "svc-030", providerId: "prov-030", name: "MoveItBuddy", title: "Small Moves & Item Transport", description: "Assistance with moving small furniture, appliances, or multiple boxes. Van or motorcycle with sidecar available.", isActive: true, createdAt: new Date("2024-04-15"), updatedAt: new Date("2024-05-26"), price: { amount: 800, currency: "PHP", unit: "/ Trip (within zone)", isNegotiable: true }, location: { address: "Various points in Metro Manila", coordinates: { latitude: 14.6091, longitude: 121.0223 }, serviceRadius: 30, serviceRadiusUnit: "km" }, availability: { schedule: ["Monday", "Wednesday", "Friday", "Saturday"], timeSlots: ["09:00-19:00"], isAvailableNow: true }, rating: { average: 4.7, count: 95 }, heroImage: "/images/Delivery-Movers1.jpg", slug: "moveitbuddy-small-moves", packages: [ { id: 'pkg30-1', name: 'Motorcycle Delivery (Max 50kg)' }, { id: 'pkg30-2', name: 'Small Van Transport (1-2 items)' }, { id: 'pkg30-3', name: 'Room Relocation Assistance' }, ], galleryImages: ["/images/Delivery-Movers2.jpg"], categoryId: "cat-004", contactPhone: "0929-MOVE-IT1"
  }
];