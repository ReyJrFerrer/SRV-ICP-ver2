// Service data adapter utilities
// Adapts and transforms service and category data for frontend consumption

import { Service, ServiceUI, Category, CategoryUI, ServicePrice, ServiceAvailability, ServiceRating } from '../services/types';

/**
 * Adapts backend Service data to frontend ServiceUI format
 * @param service - Service object from backend
 * @returns ServiceUI object optimized for frontend use
 */
export function adaptServiceData(service: Service): ServiceUI {
  return {
    id: service.id,
    providerId: service.providerId,
    name: service.title, // Map title to name for frontend
    title: service.title,
    description: service.description,
    price: adaptServicePrice(service.price),
    location: {
      address: service.location.address,
      coordinates: {
        latitude: service.location.latitude,
        longitude: service.location.longitude
      },
      serviceRadius: 10, // Default 10km radius
      serviceRadiusUnit: 'km'
    },
    availability: adaptServiceAvailability(service),
    rating: adaptServiceRating(service.rating, service.reviewCount),
    media: [], // Initialize empty media array
    requirements: [],
    isVerified: true, // Default to verified
    slug: generateSlug(service.title),
    heroImage: generateHeroImage(service.category.name),
    category: adaptCategoryData(service.category),
    isActive: service.isActive,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt
  };
}

/**
 * Adapts backend Category data to frontend CategoryUI format
 * @param category - Category object from backend
 * @returns CategoryUI object optimized for frontend use
 */
export function adaptCategoryData(category: Category): CategoryUI {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    imageUrl: category.imageUrl,
    icon: generateCategoryIcon(category.name)
  };
}

/**
 * Adapts simple price number to ServicePrice object
 */
function adaptServicePrice(price: number): ServicePrice {
  return {
    amount: price,
    currency: 'PHP',
    unit: 'per service',
    isNegotiable: false
  };
}

/**
 * Adapts service availability data
 */
function adaptServiceAvailability(service: Service): ServiceAvailability {
  const schedule = service.weeklySchedule?.map(ws => 
    `${ws.dayOfWeek}: ${ws.availability.isAvailable ? 'Available' : 'Unavailable'}`
  ) || [];

  const timeSlots = service.weeklySchedule?.flatMap(ws => 
    ws.availability.slots.map(slot => `${slot.startTime}-${slot.endTime}`)
  ) || [];

  return {
    schedule,
    timeSlots,
    isAvailableNow: service.instantBookingEnabled || false
  };
}

/**
 * Adapts rating data to ServiceRating object
 */
function adaptServiceRating(rating?: number, reviewCount: number = 0): ServiceRating {
  return {
    average: rating || 0,
    count: reviewCount
  };
}

/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Generates hero image URL based on category
 */
function generateHeroImage(categoryName: string): string {
  const imageMap: Record<string, string> = {
    'Home Services': '/assets/images/HomeServices-RepairTechnician1.jpg',
    'Beauty Services': '/assets/images/BeautyServices-Hairstylist1.jpg',
    'Cleaning Services': '/assets/images/CleaningServices-HouseMaid1.jpg',
    'Automobile Repairs': '/assets/images/Automobile Repairs-AutoMechanic2.jpg',
    'Gadget Technicians': '/assets/images/GadgetTechnicians-ComputerRepair1.jpg',
    'Delivery Services': '/assets/images/Delivery-Courier1.jpg',
    'Beauty & Wellness': '/assets/images/Beauty&Wellness-Massage1.jpg'
  };

  return imageMap[categoryName] || '/assets/images/hero-image.jpg';
}

/**
 * Generates icon class name for category
 */
function generateCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'Home Services': 'home-repair',
    'Beauty Services': 'beauty',
    'Cleaning Services': 'cleaning',
    'Automobile Repairs': 'car-repair',
    'Gadget Technicians': 'electronics',
    'Delivery Services': 'delivery',
    'Beauty & Wellness': 'wellness'
  };

  return iconMap[categoryName] || 'service';
}

/**
 * Batch adapts multiple services
 */
export function adaptServicesData(services: Service[]): ServiceUI[] {
  return services.map(service => adaptServiceData(service));
}

/**
 * Batch adapts multiple categories
 */
export function adaptCategoriesData(categories: Category[]): CategoryUI[] {
  return categories.map(category => adaptCategoryData(category));
}

/**
 * Filters and adapts services by category
 */
export function adaptServicesByCategory(services: Service[], categorySlug: string): ServiceUI[] {
  const filteredServices = services.filter(service => 
    service.category.slug === categorySlug
  );
  
  return adaptServicesData(filteredServices);
}

/**
 * Searches and adapts services by query
 */
export function adaptServicesSearch(services: Service[], query: string): ServiceUI[] {
  const searchTerm = query.toLowerCase();
  
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm) ||
    service.description.toLowerCase().includes(searchTerm) ||
    service.category.name.toLowerCase().includes(searchTerm)
  );
  
  return adaptServicesData(filteredServices);
}

/**
 * Adapts service for detailed view
 */
export function adaptServiceDetailData(service: Service): ServiceUI & {
  packages?: any[];
  terms?: any[];
  requirements: string[];
  media: any[];
} {
  const adaptedService = adaptServiceData(service);
  
  return {
    ...adaptedService,
    packages: [], // Add packages if available
    terms: [], // Add terms if available
    requirements: generateServiceRequirements(service.category.name),
    media: generateServiceMedia(service.category.name)
  };
}

/**
 * Generates service requirements based on category
 */
function generateServiceRequirements(categoryName: string): string[] {
  const requirementMap: Record<string, string[]> = {
    'Home Services': ['Valid ID', 'Access to work area', 'Basic tools provided'],
    'Beauty Services': ['Clean workspace', 'Proper lighting', 'Towels and water'],
    'Cleaning Services': ['Access to all areas', 'Storage for supplies', 'Trash disposal'],
    'Automobile Repairs': ['Vehicle keys', 'Clear work area', 'Vehicle documentation'],
    'Gadget Technicians': ['Device and accessories', 'Warranty information', 'Device password'],
    'Delivery Services': ['Accurate address', 'Contact number', 'Recipient availability'],
    'Beauty & Wellness': ['Comfortable space', 'Clean towels', 'Privacy']
  };

  return requirementMap[categoryName] || ['Valid ID', 'Clear instructions'];
}

/**
 * Generates service media based on category
 */
function generateServiceMedia(categoryName: string): any[] {
  // Return empty array for now, can be expanded with actual media data
  return [];
}
