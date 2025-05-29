/**
 * This adapter converts React Native image objects to strings for Next.js compatibility
 */

interface RNImageObject {
  uri: string;
  __packager_asset: boolean;
  width?: number;
  height?: number;
  scale?: number;
  // Add other potential properties of RN image objects
}

export function adaptServiceData(services: any[]) {
  return services.map(service => {
    // Convert any React Native image objects to string URLs
    const adaptedService = { ...service };

    // Adapt heroImage
    if (service.media && service.media.length > 0) {
      adaptedService.heroImage = convertImageToPath(service.media[0].url);
    } else {
      adaptedService.heroImage = '/images/default-service.jpg';
    }

    // Adapt any other image fields if needed
    
    return adaptedService;
  });
}

export function adaptCategoryData(categories: any[]) {
  return categories.map(category => {
    const adaptedCategory = { ...category };
    
    // Convert imageUrl if it's a React Native image object
    if (category.imageUrl) {
      adaptedCategory.imageUrl = convertImageToPath(category.imageUrl);
    }
    
    return adaptedCategory;
  });
}

// Helper function to convert React Native image objects to path strings
function convertImageToPath(image: string | RNImageObject): string {
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object' && image && 'uri' in image) {
    return image.uri;
  }
  
  // Extract filename from the object if possible
  if (typeof image === 'object' && image !== null) {
    // This is a simplification - in reality, you'd need to map the require() ID
    // to the correct file path in your Next.js project
    return '/images/default-service.jpg';
  }
  
  return '/images/default-service.jpg';
}
