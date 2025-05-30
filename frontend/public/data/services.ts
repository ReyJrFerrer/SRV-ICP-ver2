

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

// Define a type for ServicePackage
export interface ServicePackage {
  id: string;
  name: string;
  // You could add more fields like price, duration, defaultChecked later if needed
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date; // Keep as Date here, will be serialized for page props
  updatedAt: Date; // Keep as Date here
  price: ServicePrice; // This might become a base price or vary by package
  location: ServiceLocation;
  availability: ServiceAvailability;
  rating: ServiceRating;
  heroImage: string;
  galleryImages?: string[];
  slug: string;
  packages: ServicePackage[]; // Added packages array
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
    price: { // Base price, actual price might depend on packages
      amount: 1250,
      currency: "PHP",
      unit: "/ Hr", 
      isNegotiable: true
    },
    location: {
      address: "Baguio City - Session Road",
      coordinates: { latitude: 16.4145, longitude: 120.5960 },
      serviceRadius: 10,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: true
    },
    rating: { average: 4.8, count: 156 },
    heroImage: "/images/CleaningServices-HouseMaid3.jpg",
    slug: "mary-gold-house-maid",
    packages: [
      { id: 'pkg1-1', name: 'Regular Cleaning (2hrs)' },
      { id: 'pkg1-2', name: 'Deep Cleaning Kitchen' },
      { id: 'pkg1-3', name: 'Laundry Service' },
      { id: 'pkg1-4', name: 'Full House Deep Clean (4hrs)' },
    ],
    galleryImages: [ // Add actual paths to your images
      "/images/CleaningServices-HouseMaid2.jpg",
      "/images/CleaningServices-HouseMaid3.jpg"
    ]
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
    location: {
      address: "Quezon City - Diliman",
      coordinates: { latitude: 14.6559, longitude: 121.0684 },
      serviceRadius: 15,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["07:00-18:00"],
      isAvailableNow: true
    },
    rating: { average: 4.6, count: 89 },
    heroImage: "/images/HomeServices-Plumbing1.jpg",
    slug: "carlos-santos-plumber",
    packages: [
      { id: 'pkg2-1', name: 'Faucet Repair/Replacement' },
      { id: 'pkg2-2', name: 'Toilet Repair' },
      { id: 'pkg2-3', name: 'Drain Cleaning' },
      { id: 'pkg2-4', name: 'Emergency Plumbing Service (1hr)' },
    ],
    galleryImages: [ // Add actual paths to your images
      "/images/HomeServices-Plumbing2.jpg",
      "/images/HomeServices-Plumbing3.jpg"
    ]
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
    location: {
      address: "Manila - Ermita",
      coordinates: { latitude: 14.5958, longitude: 120.9772 },
      serviceRadius: 20,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: false
    },
    rating: { average: 4.9, count: 234 },
    heroImage: "/images/Automobile Repairs-AutoMechanic2.jpg",
    slug: "lisa-chen-auto-mechanic",
    packages: [
      { id: 'pkg3-1', name: 'Oil Change & Basic Checkup' },
      { id: 'pkg3-2', name: 'Brake Inspection & Repair' },
      { id: 'pkg3-3', name: 'Engine Diagnostics' },
      { id: 'pkg3-4', name: 'Tire Rotation & Balancing' },
    ],
    galleryImages: [ // Add actual paths to your images
      "/images/Automobile Repairs-AutoMechanic3.jpg"
    ]
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
    location: {
      address: "Makati City - Salcedo Village",
      coordinates: { latitude: 14.5547, longitude: 121.0244 },
      serviceRadius: 12,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: ["10:00-19:00"],
      isAvailableNow: true
    },
    rating: { average: 4.7, count: 112 },
    heroImage: "/images/BeautyServices-Hairstylist1.jpg",
    slug: "maria-rodriguez-hairstylist",
    packages: [
      { id: 'pkg4-1', name: 'Haircut & Blowdry' },
      { id: 'pkg4-2', name: 'Hair Color (Full)' },
      { id: 'pkg4-3', name: 'Event Styling / Updo' },
      { id: 'pkg4-4', name: 'Manicure & Pedicure Add-on' },
    ],
    galleryImages: [ // Add actual paths to your images
      "/images/BeautyServices-Hairstylist2.jpg",
      "/images/BeautyServices-Hairstylist3.jpg"
    ]
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
    location: {
      address: "Pasig City - Ortigas",
      coordinates: { latitude: 14.5764, longitude: 121.0851 },
      serviceRadius: 18,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: true
    },
    rating: { average: 4.5, count: 78 },
    heroImage: "/images/HomeServices-RepairTechnician1.jpg",
    slug: "john-delos-santos-repair-technician",
    packages: [
      { id: 'pkg5-1', name: 'Appliance Repair Assessment' },
      { id: 'pkg5-2', name: 'Furniture Assembly' },
      { id: 'pkg5-3', name: 'Picture Hanging & Shelf Mounting' },
      { id: 'pkg5-4', name: 'Minor Electrical Fixes' },
    ],
    galleryImages: [ // Add actual paths to your images
      "/images/BeautyServices-Hairstylist2.jpg",
      "/images/BeautyServices-Hairstylist3.jpg"
    ]
  }
];