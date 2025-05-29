
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  slug: string;
  parentId?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-001",
    name: "Home Services",
    description: "Professional home maintenance and improvement services",
    icon: "home",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/HomeServices-CoverImage.jpg",
    slug: "home-services"
  },
  {
    id: "cat-001-01",
    name: "Cleaning Services",
    description: "Professional cleaning and housekeeping services",
    icon: "broom",
    parentId: "cat-001",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/CleaningServices-CoverImage.jpeg",
    slug: "home-cleaning"
  },
  {
    id: "cat-002",
    name: "Beauty & Wellness",
    description: "Personal care and wellness services",
    icon: "spa",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/Beauty&Wellness-CoverImage.jpg",
    slug: "beauty-wellness"
  },
  {
    id: "cat-003",
    name: "Automobile Repairs",
    description: "Professional automotive repair and maintenance",
    icon: "car",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/AutomobileRepairs-CoverImage.jpg",
    slug: "automobile-repairs"
  },
  {
    id: "cat-004",
    name: "Delivery Services",
    description: "Fast and reliable delivery solutions",
    icon: "shipping-fast",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/Delivery-CoverImage.jpg",
    slug: "delivery-services"
  },
  {
    id: "cat-005",
    name: "Gadget Technicians",
    description: "Electronic device repair and maintenance",
    icon: "mobile-alt",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/GadgetTechnician-CoverImage1.jpg",
    slug: "gadget-technicians"
  },
  {
    id: "cat-006",
    name: "Photography",
    description: "Professional photography services",
    icon: "camera",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/Photographer-CoverImage.jpg",
    slug: "photography"
  },
  {
    id: "cat-007",
    name: "Tutoring",
    description: "Educational and tutoring services",
    icon: "graduation-cap",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    imageUrl: "/images/Tutoring-CoverImage.jpg",
    slug: "tutoring"
  }
];
