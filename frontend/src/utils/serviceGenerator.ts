// Service Generator Utility
// Converts ServiceProvider data to Service format for TopPicks component

import { ServiceProvider } from '../../assets/types/provider/service-provider';
import { Service } from '../../assets/types/service/service';

/**
 * Generates Service objects from ServiceProvider data
 * This creates mock service listings based on provider profiles
 */
export function generateServicesFromProviders(providers: ServiceProvider[]): Service[] {
  const services: Service[] = [];

  providers.forEach((provider, index) => {
    // Generate a primary service for each provider
    const service: Service = {
      id: `generated-svc-${provider.id}`,
      providerId: provider.id,
      name: `${provider.firstName} ${provider.lastName}`,
      title: getServiceTitleFromProvider(provider),
      description: provider.biography || `Professional service by ${provider.firstName}`,
      isActive: provider.isActive,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      
      // Price based on provider type or default
      price: {
        amount: getServicePrice(provider),
        currency: "PHP",
        unit: "/ Hr",
        isNegotiable: true
      },
      
      // Location from provider
      location: {
        address: provider.location.address,
        coordinates: {
          latitude: provider.location.latitude,
          longitude: provider.location.longitude
        },
        serviceRadius: 10, // Default service radius
        serviceRadiusUnit: "km"
      },
      
      // Availability (simplified)
      availability: {
        schedule: Object.keys(provider.availability.weeklySchedule)
          .filter(day => provider.availability.weeklySchedule[day].isAvailable) as any[], // Type assertion for now
        timeSlots: ["08:00-17:00"], // Simplified time slots
        isAvailableNow: provider.isActive
      },
      
      // Rating from provider
      rating: {
        average: provider.averageRating,
        count: provider.totalReviews
      },
      
      // Media - use profile picture as hero image
      media: provider.profilePicture ? [{
        type: "IMAGE" as const,
        url: provider.profilePicture.url,
        thumbnail: provider.profilePicture.thumbnail
      }] : [],
      
      // Hero image
      heroImage: provider.profilePicture?.url || '',
      
      // Category based on service type
      category: {
        id: getCategoryFromProvider(provider),
        name: getCategoryNameFromProvider(provider),
        description: `Services offered by ${provider.firstName}`,
        icon: "🏠", // Default icon
        slug: getCategoryFromProvider(provider),
        imageUrl: provider.profilePicture?.url || '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Additional service fields
      slug: `${provider.firstName.toLowerCase()}-${provider.lastName.toLowerCase()}-${provider.id}`,
      isVerified: provider.identityVerified,
      
      // Default packages and terms
      packages: [],
      terms: {
        id: `terms-${provider.id}`,
        title: `Terms for ${provider.firstName} ${provider.lastName}`,
        content: "Standard service terms and conditions apply.",
        lastUpdated: new Date(),
        version: "1.0",
        acceptanceRequired: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    services.push(service);
  });

  return services;
}

/**
 * Determines service title based on provider data
 */
function getServiceTitleFromProvider(provider: ServiceProvider): string {
  // Try to infer service type from biography or use default
  const bio = provider.biography?.toLowerCase() || '';
  
  if (bio.includes('maid') || bio.includes('cleaning')) return 'House Cleaning Service';
  if (bio.includes('plumber') || bio.includes('plumbing')) return 'Plumbing Service';
  if (bio.includes('technician') || bio.includes('repair')) return 'Repair Service';
  if (bio.includes('beauty') || bio.includes('hair')) return 'Beauty Service';
  if (bio.includes('photo') || bio.includes('photographer')) return 'Photography Service';
  if (bio.includes('delivery') || bio.includes('courier')) return 'Delivery Service';
  
  return 'Professional Service';
}

/**
 * Determines service price based on provider type
 */
function getServicePrice(provider: ServiceProvider): number {
  const bio = provider.biography?.toLowerCase() || '';
  
  if (bio.includes('maid') || bio.includes('cleaning')) return 1250;
  if (bio.includes('plumber')) return 1500;
  if (bio.includes('technician')) return 1800;
  if (bio.includes('beauty') || bio.includes('hair')) return 2000;
  if (bio.includes('photo')) return 3000;
  if (bio.includes('delivery')) return 800;
  
  return 1500; // Default price
}

/**
 * Determines category ID based on provider type
 */
function getCategoryFromProvider(provider: ServiceProvider): string {
  const bio = provider.biography?.toLowerCase() || '';
  
  if (bio.includes('maid') || bio.includes('cleaning')) return 'cleaning-services';
  if (bio.includes('plumber')) return 'home-repairs';
  if (bio.includes('technician')) return 'gadget-technicians';
  if (bio.includes('beauty') || bio.includes('hair')) return 'beauty-services';
  if (bio.includes('photo')) return 'photography';
  if (bio.includes('delivery')) return 'delivery-services';
  
  return 'other-services';
}

/**
 * Determines category name based on provider type
 */
function getCategoryNameFromProvider(provider: ServiceProvider): string {
  const bio = provider.biography?.toLowerCase() || '';
  
  if (bio.includes('maid') || bio.includes('cleaning')) return 'Cleaning Services';
  if (bio.includes('plumber')) return 'Home Repairs';
  if (bio.includes('technician')) return 'Gadget Technicians';
  if (bio.includes('beauty') || bio.includes('hair')) return 'Beauty Services';
  if (bio.includes('photo')) return 'Photography';
  if (bio.includes('delivery')) return 'Delivery Services';
  
  return 'Other Services';
}

export default {
  generateServicesFromProviders
};
