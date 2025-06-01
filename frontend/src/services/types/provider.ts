// Provider-related types aligned with Motoko backend
import { BaseEntity, ProfileImage, DayOfWeek, DayAvailability, VacationPeriod } from './common';

// User role enum matching Motoko backend
export type UserRole = 'Client' | 'ServiceProvider';

// Profile interface matching Motoko backend
export interface Profile extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  profilePicture?: ProfileImage;
  biography?: string;
}

// ServiceProvider interface extending Profile
export interface ServiceProvider extends Profile {
  // Additional provider-specific fields can be added here
}

// Provider availability interface matching Motoko backend
export interface ProviderAvailability {
  providerId: string;
  weeklySchedule: Array<{
    dayOfWeek: DayOfWeek;
    availability: DayAvailability;
  }>;
  vacationDates: VacationPeriod[];
  instantBookingEnabled: boolean;
  bookingNoticeHours: number; // Minimum hours in advance for booking
  maxBookingsPerDay: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Provider order related types
export type ProviderOrderActionType = 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'STARTED' 
  | 'ARRIVED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'MESSAGE_SENT'
  | 'LOCATION_SHARED'
  | 'PHOTO_UPLOADED'
  | 'EXTRA_REQUESTED'
  | 'PAYMENT_CONFIRMED';

export interface ProviderOrderAction {
  type: ProviderOrderActionType;
  timestamp: Date;
  message?: string;
  data?: any;
}

export interface ExtraCharge extends BaseEntity {
  description: string;
  amount: number;
  currency: string;
  isApproved: boolean;
}

export interface OrderPenalty extends BaseEntity {
  reason: string;
  amount: number;
  currency: string;
  isActive: boolean;
}
