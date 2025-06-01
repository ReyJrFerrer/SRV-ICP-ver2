// Common base types for all entities
export interface BaseEntity {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Coordinates interface
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Media item interface
export interface MediaItem {
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string;
}

// Time slot interface aligned with Motoko backend
export interface TimeSlot {
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string;   // Format: "HH:MM" (24-hour format)
}

// Day of week enum aligned with Motoko
export type DayOfWeek = 
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

// Day availability interface
export interface DayAvailability {
  isAvailable: boolean;
  slots: TimeSlot[];
}

// Vacation period interface
export interface VacationPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  createdAt: Date;
}

// Available slot interface
export interface AvailableSlot {
  date: Date;
  timeSlot: TimeSlot;
  isAvailable: boolean;
  conflictingBookings: string[]; // Booking IDs that conflict
}

// Rating interface
export interface Rating {
  average: number;
  count: number;
}

// Profile image interface aligned with Motoko
export interface ProfileImage {
  imageUrl: string;
  thumbnailUrl: string;
}

// Evidence interface for bookings
export interface Evidence {
  id: string;
  bookingId: string;
  submitterId: string;
  description: string;
  fileUrls: string[];
  qualityScore?: number;
  createdAt: Date;
}
