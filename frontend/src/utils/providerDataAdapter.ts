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
      url: convertImageToObjectOrPath(provider.profilePicture.url),
      thumbnail: convertImageToObjectOrPath(provider.profilePicture.thumbnail)
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
        adaptedService.heroImage = convertImageToObjectOrPath(provider.profilePicture.url);
      }
      
      return adaptedService;
    });
  }
  
  return adaptedProvider;
}

// In serviceDataAdapter.ts and providerDataAdapter.ts
function convertImageToObjectOrPath(image: any): any { // Change return type
  if (typeof image === 'string') {
    return image; // It's already a path string
  }
  // If it's a Webpack module (common structure: { default: { src: ... }} or { src: ... })
  if (typeof image === 'object' && image !== null) {
    if (image.default && typeof image.default.src === 'string') {
      return image.default; // Or just image.default.src if you only need the path
    }
    if (typeof image.src === 'string') {
      return image; // Or just image.src
    }
    // If it's React Native style { uri: ... } (though less likely in Next.js adapters)
    if ('uri' in image && typeof image.uri === 'string') {
      return image.uri;
    }
  }
  // Fallback if the structure is not recognized or it's not what <Image> expects
  // Ensure this path points to an image in your `public` directory
  return '/images/default-service.jpg';
}
