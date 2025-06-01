// Service-related types aligned with Motoko backend
import { BaseEntity, MediaItem, Rating, DayOfWeek, DayAvailability } from './common';
import { Location, ServiceLocation } from './location';
import { CategoryUI, Category } from './category';

// Service status enum matching Motoko backend
export type ServiceStatus = 'Available' | 'Unavailable' | 'Suspended';

// Service interface matching Motoko backend
export interface Service extends BaseEntity {
  providerId: string;
  title: string;
  description: string;
  category: Category; // Use full Category interface for backend alignment
  price: number; // Simple number as in Motoko
  location: Location;
  status: ServiceStatus;
  rating?: number;
  reviewCount: number;
  // Availability information matching Motoko
  weeklySchedule?: Array<{
    dayOfWeek: DayOfWeek;
    availability: DayAvailability;
  }>;
  instantBookingEnabled?: boolean;
  bookingNoticeHours?: number; // Minimum hours in advance for booking
  maxBookingsPerDay?: number;
  // Frontend-specific fields
  name?: string; // Alias for title
  slug?: string;
  heroImage?: string;
  media?: MediaItem[];
  requirements?: string[];
  isVerified?: boolean;
  packages?: Package[];
  terms?: Terms;
}

// Service price interface for frontend usage
export interface ServicePrice {
  amount: number;
  currency: string;
  unit: string;
  isNegotiable: boolean;
}

// Service availability interface for frontend usage
export interface ServiceAvailability {
  schedule: string[];
  timeSlots: string[];
  isAvailableNow: boolean;
}

// Service rating interface extending base Rating
export interface ServiceRating extends Rating {
  // Extends base Rating interface
}

export interface Package extends BaseEntity {
  name: string;
  description: string;
  price: number;
  currency: string;
  duration?: string;
  features: string[];
  isPopular?: boolean;
}

export interface Terms extends BaseEntity {
  title: string;
  content: string;
  lastUpdated: Date;
  version: string;
  acceptanceRequired: boolean;
}

// Frontend-specific service interface for UI components
export interface ServiceUI extends BaseEntity {
  providerId: string;
  name: string;
  title: string;
  description: string;
  price: ServicePrice;
  location: ServiceLocation;
  availability: ServiceAvailability;
  rating: ServiceRating;
  media: MediaItem[];
  requirements?: string[];
  isVerified: boolean;
  slug: string;
  heroImage: string;
  category: CategoryUI; // Use CategoryUI to avoid circular dependency
  packages?: Package[];
  terms?: Terms;
}
