// Booking Canister Service
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/booking/booking.did.js';
import type { 
  _SERVICE as BookingService,
  Booking as CanisterBooking,
  BookingStatus as CanisterBookingStatus,
  Location as CanisterLocation,
  Evidence as CanisterEvidence
} from '../declarations/booking/booking.did';

// Canister configuration
const BOOKING_CANISTER_ID = process.env.NEXT_PUBLIC_BOOKING_CANISTER_ID || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

// Create agent and actor
let agent: HttpAgent | null = null;
let bookingActor: BookingService | null = null;

const initializeAgent = async (): Promise<HttpAgent> => {
  if (!agent) {
    agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943',
    });

    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV === 'development') {
      try {
        await agent.fetchRootKey();
      } catch (err) {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      }
    }
  }
  return agent;
};

const getBookingActor = async (): Promise<BookingService> => {
  if (!bookingActor) {
    const agentInstance = await initializeAgent();
    bookingActor = Actor.createActor(idlFactory, {
      agent: agentInstance,
      canisterId: BOOKING_CANISTER_ID,
    }) as BookingService;
  }
  return bookingActor;
};

// Type mappings for frontend compatibility
export type BookingStatus = 
  | 'Requested'
  | 'Accepted' 
  | 'Declined'
  | 'Cancelled'
  | 'InProgress'
  | 'Completed'
  | 'Disputed';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Evidence {
  id: string;
  bookingId: string;
  submitterId: Principal;
  description: string;
  fileUrls: string[];
  qualityScore?: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: Principal;
  providerId: Principal;
  serviceId: string;
  status: BookingStatus;
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  price: number;
  location: Location;
  evidence?: Evidence;
  createdAt: string;
  updatedAt: string;
  // Additional UI fields
  serviceName?: string;
  serviceImage?: string;
  providerName?: string;
  bookingDate?: string;
  bookingTime?: string;
  duration?: string;
  priceDisplay?: string;
  serviceSlug?: string;
}

// Helper functions to convert between canister and frontend types
const convertCanisterBookingStatus = (status: CanisterBookingStatus): BookingStatus => {
  if ('Requested' in status) return 'Requested';
  if ('Accepted' in status) return 'Accepted';
  if ('Declined' in status) return 'Declined';
  if ('Cancelled' in status) return 'Cancelled';
  if ('InProgress' in status) return 'InProgress';
  if ('Completed' in status) return 'Completed';
  if ('Disputed' in status) return 'Disputed';
  return 'Requested'; // fallback
};

const convertToCanisterBookingStatus = (status: BookingStatus): CanisterBookingStatus => {
  switch (status) {
    case 'Requested': return { 'Requested': null };
    case 'Accepted': return { 'Accepted': null };
    case 'Declined': return { 'Declined': null };
    case 'Cancelled': return { 'Cancelled': null };
    case 'InProgress': return { 'InProgress': null };
    case 'Completed': return { 'Completed': null };
    case 'Disputed': return { 'Disputed': null };
    default: return { 'Requested': null };
  }
};

const convertCanisterLocation = (location: CanisterLocation): Location => ({
  latitude: location.latitude,
  longitude: location.longitude,
  address: location.address,
  city: location.city,
  state: location.state,
  country: location.country,
  postalCode: location.postalCode,
});

const convertToCanisterLocation = (location: Location): CanisterLocation => ({
  latitude: location.latitude,
  longitude: location.longitude,
  address: location.address,
  city: location.city,
  state: location.state,
  country: location.country,
  postalCode: location.postalCode,
});

const convertCanisterEvidence = (evidence: CanisterEvidence): Evidence => ({
  id: evidence.id,
  bookingId: evidence.bookingId,
  submitterId: evidence.submitterId,
  description: evidence.description,
  fileUrls: evidence.fileUrls,
  qualityScore: evidence.qualityScore[0],
  createdAt: new Date(Number(evidence.createdAt) / 1000000).toISOString(),
});

const convertCanisterBooking = (booking: CanisterBooking): Booking => ({
  id: booking.id,
  clientId: booking.clientId,
  providerId: booking.providerId,
  serviceId: booking.serviceId,
  status: convertCanisterBookingStatus(booking.status),
  requestedDate: new Date(Number(booking.requestedDate) / 1000000).toISOString(),
  scheduledDate: booking.scheduledDate[0] ? new Date(Number(booking.scheduledDate[0]) / 1000000).toISOString() : undefined,
  completedDate: booking.completedDate[0] ? new Date(Number(booking.completedDate[0]) / 1000000).toISOString() : undefined,
  price: Number(booking.price),
  location: convertCanisterLocation(booking.location),
  evidence: booking.evidence[0] ? convertCanisterEvidence(booking.evidence[0]) : undefined,
  createdAt: new Date(Number(booking.createdAt) / 1000000).toISOString(),
  updatedAt: new Date(Number(booking.updatedAt) / 1000000).toISOString(),
});

// Booking Canister Service Functions
export const bookingCanisterService = {
  /**
   * Create a new booking
   */
  async createBooking(
    serviceId: string,
    providerId: Principal,
    price: number,
    location: Location,
    requestedDate: Date
  ): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const canisterLocation = convertToCanisterLocation(location);
      const requestedTimestamp = BigInt(requestedDate.getTime() * 1000000); // Convert to nanoseconds
      
      const result = await actor.createBooking(
        serviceId,
        providerId,
        BigInt(price),
        canisterLocation,
        requestedTimestamp
      );
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error creating booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error}`);
    }
  },

  /**
   * Get a specific booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.getBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error fetching booking:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error(`Failed to fetch booking: ${error}`);
    }
  },

  /**
   * Get all bookings for a client
   */
  async getClientBookings(clientId: Principal): Promise<Booking[]> {
    try {
      const actor = await getBookingActor();
      const bookings = await actor.getClientBookings(clientId);
      return bookings.map(convertCanisterBooking);
    } catch (error) {
      console.error('Error fetching client bookings:', error);
      throw new Error(`Failed to fetch client bookings: ${error}`);
    }
  },

  /**
   * Get all bookings for a provider
   */
  async getProviderBookings(providerId: Principal): Promise<Booking[]> {
    try {
      const actor = await getBookingActor();
      const bookings = await actor.getProviderBookings(providerId);
      return bookings.map(convertCanisterBooking);
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
      throw new Error(`Failed to fetch provider bookings: ${error}`);
    }
  },

  /**
   * Get bookings by status
   */
  async getBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
    try {
      const actor = await getBookingActor();
      const canisterStatus = convertToCanisterBookingStatus(status);
      const bookings = await actor.getBookingsByStatus(canisterStatus);
      return bookings.map(convertCanisterBooking);
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw new Error(`Failed to fetch bookings by status: ${error}`);
    }
  },

  /**
   * Accept a booking
   */
  async acceptBooking(bookingId: string, scheduledDate: Date): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const scheduledTimestamp = BigInt(scheduledDate.getTime() * 1000000);
      
      const result = await actor.acceptBooking(bookingId, scheduledTimestamp);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error accepting booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw new Error(`Failed to accept booking: ${error}`);
    }
  },

  /**
   * Decline a booking
   */
  async declineBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.declineBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error declining booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error declining booking:', error);
      throw new Error(`Failed to decline booking: ${error}`);
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.cancelBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error cancelling booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error(`Failed to cancel booking: ${error}`);
    }
  },

  /**
   * Start a booking (mark as in progress)
   */
  async startBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.startBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error starting booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error starting booking:', error);
      throw new Error(`Failed to start booking: ${error}`);
    }
  },

  /**
   * Complete a booking
   */
  async completeBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.completeBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error completing booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      throw new Error(`Failed to complete booking: ${error}`);
    }
  },

  /**
   * Dispute a booking
   */
  async disputeBooking(bookingId: string): Promise<Booking | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.disputeBooking(bookingId);
      
      if ('ok' in result) {
        return convertCanisterBooking(result.ok);
      } else {
        console.error('Error disputing booking:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error disputing booking:', error);
      throw new Error(`Failed to dispute booking: ${error}`);
    }
  },

  /**
   * Submit evidence for a booking
   */
  async submitEvidence(
    bookingId: string,
    description: string,
    fileUrls: string[]
  ): Promise<Evidence | null> {
    try {
      const actor = await getBookingActor();
      const result = await actor.submitEvidence(bookingId, description, fileUrls);
      
      if ('ok' in result) {
        return convertCanisterEvidence(result.ok);
      } else {
        console.error('Error submitting evidence:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
      throw new Error(`Failed to submit evidence: ${error}`);
    }
  }
};

export default bookingCanisterService;
