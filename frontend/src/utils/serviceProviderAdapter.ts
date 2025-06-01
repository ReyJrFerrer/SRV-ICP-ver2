// Service provider adapter utilities
// Converts between backend Profile types and frontend ServiceProvider types

import { Profile, ServiceProvider } from '../services/types';

/**
 * Converts backend Profile objects to frontend ServiceProvider objects
 * @param profiles - Array of Profile objects from backend
 * @returns Array of ServiceProvider objects for frontend use
 */
export function convertProfilesToServiceProviders(profiles: Profile[]): ServiceProvider[] {
  return profiles
    .filter(profile => profile.role === 'ServiceProvider')
    .map(profile => ({
      ...profile,
      // Ensure all ServiceProvider fields are properly mapped
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      isVerified: profile.isVerified,
      profilePicture: profile.profilePicture,
      biography: profile.biography,
      isActive: true, // Default value for BaseEntity
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    }));
}

/**
 * Converts a single Profile to ServiceProvider
 * @param profile - Profile object from backend
 * @returns ServiceProvider object for frontend use
 */
export function convertProfileToServiceProvider(profile: Profile): ServiceProvider | null {
  if (profile.role !== 'ServiceProvider') {
    return null;
  }

  return {
    ...profile,
    isActive: true, // Default value for BaseEntity
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  };
}

/**
 * Filters profiles to get only service providers
 * @param profiles - Array of Profile objects
 * @returns Array of Profile objects that are service providers
 */
export function filterServiceProviders(profiles: Profile[]): Profile[] {
  return profiles.filter(profile => profile.role === 'ServiceProvider');
}
