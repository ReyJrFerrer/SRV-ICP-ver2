// Asset resolver utility for handling backend image references
// This bridges the gap between backend image paths and frontend asset requirements

/**
 * Resolves backend image paths to frontend require() statements
 * @param imagePath - Path from backend (e.g., "/images/Maid1.jpg")
 * @returns Resolved asset path for frontend use
 */
export function resolveAssetPath(imagePath: string): any {
  if (!imagePath) return null;
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Map common image paths to their require() equivalents
  const assetMap: { [key: string]: any } = {
    'images/Maid1.jpg': require('../../assets/images/Maid1.jpg'),
    'images/Maid2.jpg': require('../../assets/images/Maid2.jpg'),
    'images/Plumber1.jpg': require('../../assets/images/Plumber1.jpg'),
    'images/Plumber2.jpg': require('../../assets/images/Plumber2.jpg'),
    'images/Technician1.jpg': require('../../assets/images/Technician1.jpg'),
    'images/Technician2.jpg': require('../../assets/images/Technician2.jpg'),
    'images/BeautyServices-Hairstylist1.jpg': require('../../assets/images/BeautyServices-Hairstylist1.jpg'),
    'images/BeautyServices-Hairstylist2.jpg': require('../../assets/images/BeautyServices-Hairstylist2.jpg'),
    'images/BeautyServices-Hairstylist3.jpg': require('../../assets/images/BeautyServices-Hairstylist3.jpg'),
    'images/Photographer-ProPhotographer1.jpg': require('../../assets/images/Photographer-ProPhotographer1.jpg'),
    'images/Photographer-ProPhotographer2.jpg': require('../../assets/images/Photographer-ProPhotographer2.jpg'),
    'images/Photographer-ProPhotographer3.jpg': require('../../assets/images/Photographer-ProPhotographer3.jpg'),
    'images/DeliveryService-Courier1.jpg': require('../../assets/images/DeliveryService-Courier1.jpg'),
    'images/DeliveryService-Courier2.jpg': require('../../assets/images/DeliveryService-Courier2.jpg'),
    // Add more mappings as needed
  };
  
  return assetMap[cleanPath] || imagePath;
}

/**
 * Converts backend profile data to frontend-compatible format
 * @param backendProfile - Profile data from ICP backend
 * @returns Frontend-compatible profile with resolved asset paths
 */
export function adaptBackendProfile(backendProfile: any): any {
  if (!backendProfile) return null;
  
  const adapted = { ...backendProfile };
  
  // Resolve profile picture paths
  if (backendProfile.profilePicture) {
    adapted.profilePicture = {
      type: "IMAGE",
      url: resolveAssetPath(backendProfile.profilePicture.imageUrl),
      thumbnail: resolveAssetPath(backendProfile.profilePicture.thumbnailUrl)
    };
  }
  
  return adapted;
}

/**
 * Helper function to get asset path for a specific image name
 * Useful for dynamic asset loading
 */
export function getAssetByName(imageName: string): any {
  return resolveAssetPath(`images/${imageName}`);
}
