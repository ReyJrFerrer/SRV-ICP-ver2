import { useState, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import serviceCanisterService, { 
  Service, 
  ServicePackage, 
  AvailableSlot,
  Location 
} from '../services/serviceCanisterService';
import bookingCanisterService, { 
  Booking, 
  BookingStatus 
} from '../services/bookingCanisterService';

// TypeScript Interfaces
export interface BookingRequest {
  serviceId: string;
  serviceName: string;
  providerId: string;
  packages: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
  }>;
  totalPrice: number;
  bookingType: 'sameday' | 'scheduled';
  scheduledDate?: Date;
  scheduledTime?: string;
  location: string | Location;
  concerns?: string;
}

export interface UseBookRequestReturn {
  // Service data
  service: Service | null;
  packages: ServicePackage[];
  loading: boolean;
  error: string | null;
  
  // Availability data
  availableSlots: AvailableSlot[];
  isSameDayAvailable: boolean;
  
  // Booking operations
  loadServiceData: (serviceSlug: string) => Promise<void>;
  checkSameDayAvailability: (serviceId: string) => Promise<boolean>;
  getAvailableSlots: (serviceId: string, date: Date) => Promise<AvailableSlot[]>;
  checkTimeSlotAvailability: (serviceId: string, date: Date, timeSlot: string) => Promise<boolean>;
  createBookingRequest: (bookingData: BookingRequest) => Promise<Booking | null>;
  
  // Utility functions
  validateBookingRequest: (bookingData: BookingRequest) => { isValid: boolean; errors: string[] };
  calculateTotalPrice: (selectedPackages: string[], allPackages: ServicePackage[]) => number;
  formatLocationForBooking: (location: any) => Location;
}

export const useBookRequest = (): UseBookRequestReturn => {
  // State management
  const [service, setService] = useState<Service | null>(null);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isSameDayAvailable, setIsSameDayAvailable] = useState(false);

  // Load service and package data
  const loadServiceData = useCallback(async (serviceSlug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading service data for:', serviceSlug);
      
      // Get service details
      const serviceData = await serviceCanisterService.getService(serviceSlug);
      if (!serviceData) {
        throw new Error('Service not found');
      }
      
      // Get service packages
      const servicePackages = await serviceCanisterService.getServicePackages(serviceSlug);
      
      setService(serviceData);
      setPackages(servicePackages || []);
      
      // Check same-day availability
      const sameDayAvailable = await checkSameDayAvailability(serviceSlug);
      setIsSameDayAvailable(sameDayAvailable);
      
      console.log('Service data loaded successfully:', {
        service: serviceData.title,
        packages: servicePackages?.length || 0,
        sameDayAvailable
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load service data';
      setError(errorMessage);
      console.error('Error loading service data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if same-day booking is available
  const checkSameDayAvailability = useCallback(async (serviceId: string): Promise<boolean> => {
    try {
      const now = new Date();
      
      // Get service data if not already loaded
      let serviceData = service;
      if (!serviceData) {
        serviceData = await serviceCanisterService.getService(serviceId);
      }
      
      // Check if service allows same-day booking
      if (!serviceData?.instantBookingEnabled) {
        console.log('Same-day booking not enabled for service');
        return false;
      }
      
      // Check current time availability using booking canister
      const isAvailable = await bookingCanisterService.checkServiceAvailability(serviceId, now);
      
      console.log('Same-day availability check:', { serviceId, isAvailable });
      return isAvailable || false;
      
    } catch (err) {
      console.error('Error checking same-day availability:', err);
      return false;
    }
  }, [service]);

  // Get available time slots for a specific date
  const getAvailableSlots = useCallback(async (serviceId: string, date: Date): Promise<AvailableSlot[]> => {
    try {
      console.log('Fetching available slots for:', { serviceId, date: date.toISOString() });
      
      const slots = await bookingCanisterService.getServiceAvailableSlots(serviceId, date);
      const availableSlots = slots || [];
      
      setAvailableSlots(availableSlots);
      console.log('Available slots fetched:', availableSlots.length);
      
      return availableSlots;
      
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setAvailableSlots([]);
      return [];
    }
  }, []);

  // Check if a specific time slot is available
  const checkTimeSlotAvailability = useCallback(async (
    serviceId: string, 
    date: Date, 
    timeSlot: string
  ): Promise<boolean> => {
    try {
      // Parse time slot (format: "HH:MM" or "HH:MM-HH:MM")
      let hours: number, minutes: number;
      
      if (timeSlot.includes('-')) {
        // Handle time range, use start time
        const startTime = timeSlot.split('-')[0];
        [hours, minutes] = startTime.split(':').map(Number);
      } else {
        // Handle single time
        [hours, minutes] = timeSlot.split(':').map(Number);
      }
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time slot format:', timeSlot);
        return false;
      }
      
      // Create specific datetime
      const requestedDateTime = new Date(date);
      requestedDateTime.setHours(hours, minutes, 0, 0);
      
      const isAvailable = await bookingCanisterService.checkServiceAvailability(serviceId, requestedDateTime);
      
      console.log('Time slot availability check:', { 
        serviceId, 
        timeSlot, 
        requestedDateTime: requestedDateTime.toISOString(), 
        isAvailable 
      });
      
      return isAvailable || false;
      
    } catch (err) {
      console.error('Error checking time slot availability:', err);
      return false;
    }
  }, []);

  // Create a booking request
  const createBookingRequest = useCallback(async (bookingData: BookingRequest): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating booking request:', bookingData);
      
      // Validate booking data
      const validation = validateBookingRequest(bookingData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      // Format location
      const location = formatLocationForBooking(bookingData.location);
      
      // Determine requested date
      let requestedDate: Date;
      if (bookingData.bookingType === 'sameday') {
        requestedDate = new Date();
      } else if (bookingData.scheduledDate && bookingData.scheduledTime) {
        const [hours, minutes] = bookingData.scheduledTime.split(':').map(Number);
        requestedDate = new Date(bookingData.scheduledDate);
        requestedDate.setHours(hours, minutes, 0, 0);
      } else {
        throw new Error('Invalid booking date/time');
      }
      
      // Get the first package ID (you might want to modify this based on your business logic)
      const firstPackageId = bookingData.packages.length > 0 ? bookingData.packages[0].id : undefined;
      
      // Create booking through canister
      const booking = await bookingCanisterService.createBooking(
        bookingData.serviceId,
        Principal.fromText(bookingData.providerId),
        bookingData.totalPrice,
        location,
        requestedDate,
        firstPackageId
      );
      
      console.log('Booking created successfully:', booking);
      return booking;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      console.error('Error creating booking:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate booking request data
  const validateBookingRequest = useCallback((bookingData: BookingRequest) => {
    const errors: string[] = [];
    
    if (!bookingData.serviceId) {
      errors.push('Service ID is required');
    }
    
    if (!bookingData.providerId) {
      errors.push('Provider ID is required');
    }
    
    if (!bookingData.packages || bookingData.packages.length === 0) {
      errors.push('At least one package must be selected');
    }
    
    if (bookingData.totalPrice <= 0) {
      errors.push('Total price must be greater than 0');
    }
    
    if (bookingData.bookingType === 'scheduled') {
      if (!bookingData.scheduledDate) {
        errors.push('Scheduled date is required');
      }
      if (!bookingData.scheduledTime) {
        errors.push('Scheduled time is required');
      }
      
      // Validate that scheduled date is in the future
      if (bookingData.scheduledDate && bookingData.scheduledDate <= new Date()) {
        errors.push('Scheduled date must be in the future');
      }
    }
    
    if (!bookingData.location) {
      errors.push('Location is required');
    }
    
    console.log('Booking validation:', { isValid: errors.length === 0, errors });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Calculate total price from selected packages
  const calculateTotalPrice = useCallback((
    selectedPackageIds: string[], 
    allPackages: ServicePackage[]
  ): number => {
    const total = selectedPackageIds.reduce((sum, packageId) => {
      const pkg = allPackages.find(p => p.id === packageId);
      return sum + (pkg?.price || 0);
    }, 0);
    
    console.log('Total price calculated:', { selectedPackageIds, total });
    return total;
  }, []);

  // Format location data for booking
  const formatLocationForBooking = useCallback((location: any): Location => {
    if (typeof location === 'string') {
      // If location is a string (manual address or GPS), convert to Location object
      console.log('Formatting string location:', location);
      return {
        latitude: 0, // Default values - you might want to geocode the address
        longitude: 0,
        address: location,
        city: '',
        state: '',
        country: 'Philippines', // Default country
        postalCode: ''
      };
    } else if (typeof location === 'object' && location !== null) {
      // If location is already a Location object
      console.log('Using existing Location object:', location);
      return location as Location;
    } else {
      // Fallback
      console.log('Using fallback location');
      return {
        latitude: 0,
        longitude: 0,
        address: 'Address not specified',
        city: '',
        state: '',
        country: 'Philippines',
        postalCode: ''
      };
    }
  }, []);

  return {
    // Service data
    service,
    packages,
    loading,
    error,
    
    // Availability data
    availableSlots,
    isSameDayAvailable,
    
    // Booking operations
    loadServiceData,
    checkSameDayAvailability,
    getAvailableSlots,
    checkTimeSlotAvailability,
    createBookingRequest,
    
    // Utility functions
    validateBookingRequest,
    calculateTotalPrice,
    formatLocationForBooking,
  };
};

export default useBookRequest;