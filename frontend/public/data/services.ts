
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

export interface Service {
  id: string;
  providerId: string;
  name: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  price: ServicePrice;
  location: ServiceLocation;
  availability: ServiceAvailability;
  rating: ServiceRating;
  heroImage: string;
  slug: string;
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
    price: {
      amount: 1250,
      currency: "PHP",
      unit: "/ Hr",
      isNegotiable: true
    },
    location: {
      address: "Baguio City - Session Road",
      coordinates: {
        latitude: 16.4145,
        longitude: 120.5960
      },
      serviceRadius: 10,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: true
    },
    rating: {
      average: 4.8,
      count: 156
    },
    heroImage: "/images/CleaningServices-HouseMaid3.jpg",
    slug: "mary-gold-house-maid"
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
    price: {
      amount: 850,
      currency: "PHP",
      unit: "/ Hr",
      isNegotiable: true
    },
    location: {
      address: "Quezon City - Diliman",
      coordinates: {
        latitude: 14.6559,
        longitude: 121.0684
      },
      serviceRadius: 15,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["07:00-18:00"],
      isAvailableNow: true
    },
    rating: {
      average: 4.6,
      count: 89
    },
    heroImage: "/images/HomeServices-Plumbing1.jpg",
    slug: "carlos-santos-plumber"
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
    price: {
      amount: 1500,
      currency: "PHP",
      unit: "/ Hr",
      isNegotiable: false
    },
    location: {
      address: "Manila - Ermita",
      coordinates: {
        latitude: 14.5958,
        longitude: 120.9772
      },
      serviceRadius: 20,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: false
    },
    rating: {
      average: 4.9,
      count: 234
    },
    heroImage: "/images/Automobile Repairs-AutoMechanic2.jpg",
    slug: "lisa-chen-auto-mechanic"
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
    price: {
      amount: 800,
      currency: "PHP",
      unit: "/ Session",
      isNegotiable: true
    },
    location: {
      address: "Makati City - Salcedo Village",
      coordinates: {
        latitude: 14.5547,
        longitude: 121.0244
      },
      serviceRadius: 12,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: ["10:00-19:00"],
      isAvailableNow: true
    },
    rating: {
      average: 4.7,
      count: 112
    },
    heroImage: "/images/BeautyServices-Hairstylist1.jpg",
    slug: "maria-rodriguez-hairstylist"
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
    price: {
      amount: 750,
      currency: "PHP",
      unit: "/ Hr",
      isNegotiable: true
    },
    location: {
      address: "Pasig City - Ortigas",
      coordinates: {
        latitude: 14.5764,
        longitude: 121.0851
      },
      serviceRadius: 18,
      serviceRadiusUnit: "km"
    },
    availability: {
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["08:00-17:00"],
      isAvailableNow: true
    },
    rating: {
      average: 4.5,
      count: 78
    },
    heroImage: "/images/HomeServices-RepairTechnician1.jpg",
    slug: "john-delos-santos-repair-technician"
  }
];
