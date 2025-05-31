// Service Provider Adapter
// Converts backend auth canister profiles to frontend ServiceProvider format

import { FrontendProfile } from '../services/authCanisterService';
import { ServiceProvider, ProviderVerificationStatus, ProviderAccountStatus } from '../../assets/types/provider/service-provider';

/**
 * Converts a backend profile to a frontend ServiceProvider
 * @param profile - Profile from auth canister
 * @returns ServiceProvider compatible with existing frontend components
 */
export function convertProfileToServiceProvider(profile: FrontendProfile): ServiceProvider {
  // Extract first name and last name from full name
  const nameParts = profile.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: profile.id,
    firstName,
    lastName,
    email: profile.email,
    phoneNumber: profile.phone,
    profilePicture: profile.profilePicture ? {
      type: "IMAGE",
      url: profile.profilePicture.imageUrl,
      thumbnail: profile.profilePicture.thumbnailUrl
    } : undefined,
    biography: profile.biography || "Experienced service provider committed to quality work.",
    location: {
      // Default location for static profiles - should be enhanced with real location data
      address: "Service Area",
      city: "Your City",
      country: "Philippines",
      latitude: 16.4145,
      longitude: 120.5960,
      postalCode: "2600",
      state: "Your Province"
    },
    verificationStatus: profile.isVerified ? 'VERIFIED' as ProviderVerificationStatus : 'PENDING' as ProviderVerificationStatus,
    accountStatus: 'ACTIVE' as ProviderAccountStatus,
    averageRating: 4.5, // Default rating - should be fetched from reputation canister
    totalReviews: 0, // Default - should be fetched from review canister
    totalCompletedJobs: 0, // Default - should be fetched from booking canister
    identityVerified: profile.isVerified,
    backgroundCheckPassed: profile.isVerified,
    servicesOffered: [], // Should be fetched from service canister
    languages: ["English"], // Default languages
    isActive: true,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    availability: {
      weeklySchedule: {
        "Monday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Tuesday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Wednesday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Thursday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Friday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Saturday": { isAvailable: false, slots: [] },
        "Sunday": { isAvailable: false, slots: [] }
      },
      vacationDates: [],
      instantBookingEnabled: false,
      bookingNoticeHours: 2,
      maxBookingsPerDay: 5
    },
    earningSummary: {
      totalEarnings: 0,
      totalEarningsThisMonth: 0,
      totalEarningsLastMonth: 0,
      pendingPayouts: 0,
      completionRate: 100,
      cancellationRate: 0,
      avgRating: profile.isVerified ? 4.5 : 0
    },
    credentials: [],
    taxInformation: undefined
  };
}

/**
 * Converts an array of backend profiles to ServiceProvider array
 */
export function convertProfilesToServiceProviders(profiles: FrontendProfile[]): ServiceProvider[] {
  return profiles
    .filter(profile => profile.role === 'ServiceProvider')
    .map(convertProfileToServiceProvider);
}

export default {
  convertProfileToServiceProvider,
  convertProfilesToServiceProviders
};
