// Booking-related types aligned with Motoko backend
import { BaseEntity, MediaItem, Evidence } from './common';
import { Location } from './location';
import { PaymentDetails } from './payment';

// Booking status enum matching Motoko backend
export type BookingStatus = 
  | 'Requested'
  | 'Accepted'
  | 'Declined'
  | 'Cancelled'
  | 'InProgress'
  | 'Completed'
  | 'Disputed';

// Booking interface matching Motoko backend
export interface Booking extends BaseEntity {
  clientId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  requestedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  price: number;
  location: Location;
  evidence?: Evidence;
}

// Frontend-specific types for UI components
export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface OrderSchedule {
  scheduledDate: Date;
  scheduledTime: string;
  estimatedDuration: number;
  timezone: string;
}

export interface ServiceCompletion {
  completedAt: Date;
  completionNotes: string;
  beforePhotos: MediaItem[];
  afterPhotos: MediaItem[];
  rating?: number;
}

export interface Dispute extends BaseEntity {
  reason: string;
  description: string;
  evidence: MediaItem[];
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED';
  resolution?: string;
}

// Frontend Order interface for UI components
export interface Order extends BaseEntity {
  serviceId: string;
  clientId: string;
  providerId: string;
  status: OrderStatus;
  schedule: OrderSchedule;
  location: Location;
  payment: PaymentDetails;
  completion?: ServiceCompletion;
  dispute?: Dispute;
  rating?: number;
}
