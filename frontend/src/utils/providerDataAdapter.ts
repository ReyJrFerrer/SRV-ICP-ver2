/**
 * This adapter converts service provider data for Next.js compatibility
 */

interface RNImageObject {
  uri: string;
  __packager_asset: boolean;
  width?: number;
  height?: number;
  scale?: number;
  // Add other potential properties of RN image objects
}

export function adaptProviderData(provider: any) {
  if (!provider) return null;
  
  // Create a deep copy to avoid mutating original
  const adaptedProvider = { ...provider };
  
  // Convert profile picture if needed
  if (provider.profilePicture && provider.profilePicture.url) {
    adaptedProvider.profilePicture = {
      ...provider.profilePicture,
      url: convertImageToPath(provider.profilePicture.url),
      thumbnail: convertImageToPath(provider.profilePicture.thumbnail)
    };
  }
  
  // Adapt services offered
  if (provider.servicesOffered && Array.isArray(provider.servicesOffered)) {
    adaptedProvider.servicesOffered = provider.servicesOffered.map((service: any) => {
      const adaptedService = { ...service };
      
      // Add default price and rating if not available
      if (!adaptedService.price) {
        adaptedService.price = {
          amount: 1250.00,
          unit: 'hr'
        };
      }
      
      if (!adaptedService.rating) {
        adaptedService.rating = {
          average: provider.averageRating || 4.5,
          count: provider.totalReviews || 0
        };
      }
      
      // Ensure services have category info
      if (!adaptedService.category) {
        adaptedService.category = {
          name: 'Home Services'
        };
      }
      
      // Add service images from provider profile picture as fallback
      if (!adaptedService.heroImage && provider.profilePicture) {
        adaptedService.heroImage = convertImageToPath(provider.profilePicture.url);
      }
      
      return adaptedService;
    });
  }
  
  return adaptedProvider;
}

// Helper function to convert React Native image objects to path strings
function convertImageToPath(image: string | RNImageObject): string {
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object' && image && 'uri' in image) {
    return image.uri;
  }
  
  // If a require() function result that's not a string or object with uri
  // Try to get a URL that Next.js can understand
  if (typeof image === 'object' && image !== null) {
    // For webpack/Next.js assets, use default path
    return '/images/default-profile.jpg';
  }
  
  return '/images/default-profile.jpg';
}
