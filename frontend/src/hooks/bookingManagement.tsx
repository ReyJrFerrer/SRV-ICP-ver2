import { useState, useEffect, useCallback, useMemo } from 'react';
import { Principal } from '@dfinity/principal';
import { 
  Booking, 
  BookingStatus, 
  bookingCanisterService 
} from '../services/bookingCanisterService';
import { 
  FrontendProfile, 
  authCanisterService 
} from '../services/authCanisterService';

// Enhanced Booking interface with provider data
export interface EnhancedBooking extends Booking {
  providerProfile?: FrontendProfile;
  formattedLocation?: string;
  isProviderDataLoaded?: boolean;
}

// Types for hook state management
interface LoadingStates {
  bookings: boolean;
  profile: boolean;
  providers: boolean;
  operations: Map<string, boolean>;
}

interface BookingManagementHook {
  // Data states
  bookings: EnhancedBooking[];
  userProfile: FrontendProfile | null;
  providerProfiles: Map<string, FrontendProfile>;
  
  // Loading states
  loading: boolean;
  loadingProfiles: boolean;
  refreshing: boolean;
  
  // Error state
  error: string | null;
  
  // Functions
  bookingsByStatus: (status: BookingStatus) => EnhancedBooking[];
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  refreshBookings: () => Promise<void>;
  clearError: () => void;
  getBookingCount: (status: BookingStatus) => number;
  formatBookingDate: (dateString: string) => string;
  getStatusColor: (status: BookingStatus) => string;
  enrichBookingWithProviderData: (booking: Booking) => Promise<EnhancedBooking>;
  formatLocationString: (location: any) => string;
  getCurrentUserId: () => string | null;
  isUserAuthenticated: () => boolean;
  retryOperation: (operation: string) => Promise<void>;
  isOperationInProgress: (operation: string) => boolean;
}

export const useBookingManagement = (): BookingManagementHook => {
  // Core state management
  const [userBookings, setUserBookings] = useState<EnhancedBooking[]>([]);
  const [userProfile, setUserProfile] = useState<FrontendProfile | null>(null);
  const [providerProfiles, setProviderProfiles] = useState<Map<string, FrontendProfile>>(new Map());
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    bookings: false,
    profile: false,
    providers: false,
    operations: new Map()
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed loading state
  const loading = useMemo(() => 
    loadingStates.bookings || loadingStates.profile,
    [loadingStates.bookings, loadingStates.profile]
  );

  const loadingProfiles = useMemo(() => 
    loadingStates.providers,
    [loadingStates.providers]
  );

  // Authentication functions
  const getCurrentUserId = useCallback((): string | null => {
    try {
      return userProfile?.id || null;
    } catch {
      return null;
    }
  }, [userProfile]);

  const isUserAuthenticated = useCallback((): boolean => {
    return userProfile !== null;
  }, [userProfile]);

  // Error handling functions
  const handleBookingError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    const errorMessage = error?.message || `Failed to ${operation}`;
    setError(errorMessage);
  }, []);

  const handleAuthError = useCallback(() => {
    setError('Authentication required. Please login to continue.');
    setUserProfile(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Loading state management
  const setLoadingState = useCallback((operation: string, loading: boolean) => {
    setLoadingStates(prev => {
      const newOperations = new Map(prev.operations);
      if (loading) {
        newOperations.set(operation, true);
      } else {
        newOperations.delete(operation);
      }
      
      return {
        ...prev,
        operations: newOperations,
        [operation]: loading
      };
    });
  }, []);

  const isOperationInProgress = useCallback((operation: string): boolean => {
    return loadingStates.operations.get(operation) || false;
  }, [loadingStates.operations]);

  // Provider profile caching functions
  const cacheProviderProfile = useCallback((providerId: string, profile: FrontendProfile) => {
    setProviderProfiles(prev => new Map(prev.set(providerId, profile)));
  }, []);

  const getCachedProviderProfile = useCallback((providerId: string): FrontendProfile | null => {
    return providerProfiles.get(providerId) || null;
  }, [providerProfiles]);

  // Location formatting function
  const formatLocationString = useCallback((location: any): string => {
    if (!location) return 'Location not specified';

    // Handle string location
    if (typeof location === 'string') {
      return location;
    }

    // Handle object location with address components
    if (typeof location === 'object') {
      const { address, city, state, country, latitude, longitude } = location;
      
      // Build location string from available components
      const components = [];
      
      if (address && address.trim()) components.push(address.trim());
      if (city && city.trim()) components.push(city.trim());
      if (state && state.trim()) components.push(state.trim());
      
      // If we have address components, use them
      if (components.length > 0) {
        return components.join(', ');
      }
      
      // If we only have coordinates, format them nicely
      if (latitude && longitude) {
        // You could integrate reverse geocoding here for better UX
        return `${parseFloat(latitude).toFixed(4)}°, ${parseFloat(longitude).toFixed(4)}°`;
      }
      
      // Fallback for other object structures
      if (country) return country;
    }

    return 'Location not available';
  }, []);

  // Enhanced provider profile loading
  const loadProviderProfile = useCallback(async (providerId: string): Promise<FrontendProfile | null> => {
    try {
      // Check cache first
      const cached = getCachedProviderProfile(providerId);
      if (cached) {
        console.log(`📋 Using cached provider profile for ${providerId}`);
        return cached;
      }

      console.log(`🔄 Loading provider profile for ${providerId}`);
      setLoadingState('providers', true);
      
      const profile = await authCanisterService.getProfile(providerId);
      
      if (profile) {
        console.log(`✅ Provider profile loaded:`, profile);
        cacheProviderProfile(providerId, profile);
        return profile;
      } else {
        console.log(`⚠️ No profile found for provider ${providerId}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error loading provider profile for ${providerId}:`, error);
      return null;
    } finally {
      setLoadingState('providers', false);
    }
  }, [getCachedProviderProfile, setLoadingState, cacheProviderProfile]);

  // Enhanced booking enrichment
  const enrichBookingWithProviderData = useCallback(async (booking: Booking): Promise<EnhancedBooking> => {
    try {
      console.log(`🔄 Enriching booking ${booking.id} with provider data`);
      
      const providerProfile = await loadProviderProfile(booking.providerId.toString());
      const formattedLocation = formatLocationString(booking.location);
      
      const enhancedBooking: EnhancedBooking = {
        ...booking,
        providerProfile: providerProfile || undefined,
        providerName: providerProfile?.name || booking.providerName || 'Unknown Provider',
        formattedLocation,
        isProviderDataLoaded: true
      };
      
      console.log(`✅ Booking enriched:`, {
        bookingId: booking.id,
        providerName: enhancedBooking.providerName,
        hasProviderProfile: !!providerProfile,
        formattedLocation
      });
      
      return enhancedBooking;
    } catch (error) {
      console.error(`❌ Error enriching booking ${booking.id}:`, error);
      
      // Return booking with minimal enhancement
      return {
        ...booking,
        providerName: booking.providerName || 'Unknown Provider',
        formattedLocation: formatLocationString(booking.location),
        isProviderDataLoaded: false
      };
    }
  }, [loadProviderProfile, formatLocationString]);

  // Enhanced data loading functions
  const loadUserProfile = useCallback(async () => {
    try {
      setLoadingState('profile', true);
      clearError();
      
      const profile = await authCanisterService.getMyProfile();
      setUserProfile(profile);
      console.log('✅ User profile loaded:', profile);
    } catch (error) {
      handleBookingError(error, 'load user profile');
      handleAuthError();
    } finally {
      setLoadingState('profile', false);
    }
  }, [setLoadingState, clearError, handleBookingError, handleAuthError]);

  const loadUserBookings = useCallback(async () => {
    if (!isUserAuthenticated()) {
      handleAuthError();
      return;
    }

    try {
      setLoadingState('bookings', true);
      clearError();
      
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        throw new Error('No authenticated user found');
      }

      console.log('🔄 Loading bookings for user:', currentUserId);
      const userPrincipal = Principal.fromText(currentUserId);
      const rawBookings = await bookingCanisterService.getClientBookings(userPrincipal);
      
      console.log(`📋 Loaded ${rawBookings.length} raw bookings`);
      
      // Enrich bookings with provider data in parallel
      const enrichedBookings = await Promise.all(
        rawBookings.map(booking => enrichBookingWithProviderData(booking))
      );
      
      console.log(`✅ Enriched ${enrichedBookings.length} bookings with provider data`);
      setUserBookings(enrichedBookings);
      
    } catch (error) {
      handleBookingError(error, 'load user bookings');
    } finally {
      setLoadingState('bookings', false);
    }
  }, [
    isUserAuthenticated, 
    handleAuthError, 
    setLoadingState, 
    clearError, 
    getCurrentUserId, 
    handleBookingError,
    enrichBookingWithProviderData
  ]);

  const refreshBookings = useCallback(async () => {
    setRefreshing(true);
    try {
      // Clear provider cache to ensure fresh data
      setProviderProfiles(new Map());
      await loadUserBookings();
    } finally {
      setRefreshing(false);
    }
  }, [loadUserBookings]);

  // Booking status management (unchanged)
  const updateBookingStatus = useCallback(async (bookingId: string, newStatus: BookingStatus) => {
    try {
      setLoadingState(`update-${bookingId}`, true);
      clearError();
      
      let updatedBooking: Booking | null = null;
      
      switch (newStatus) {
        case 'Cancelled':
          updatedBooking = await bookingCanisterService.cancelBooking(bookingId);
          break;
        case 'Accepted':
          updatedBooking = await bookingCanisterService.acceptBooking(bookingId, new Date());
          break;
        case 'Declined':
          updatedBooking = await bookingCanisterService.declineBooking(bookingId);
          break;
        case 'InProgress':
          updatedBooking = await bookingCanisterService.startBooking(bookingId);
          break;
        case 'Completed':
          updatedBooking = await bookingCanisterService.completeBooking(bookingId);
          break;
        case 'Disputed':
          updatedBooking = await bookingCanisterService.disputeBooking(bookingId);
          break;
        default:
          throw new Error(`Unsupported status update: ${newStatus}`);
      }
      
      if (updatedBooking) {
        // Enrich the updated booking and update state
        const enrichedBooking = await enrichBookingWithProviderData(updatedBooking);
        setUserBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? enrichedBooking : booking
          )
        );
      }
    } catch (error) {
      handleBookingError(error, `update booking status to ${newStatus}`);
      throw error;
    } finally {
      setLoadingState(`update-${bookingId}`, false);
    }
  }, [setLoadingState, clearError, handleBookingError, enrichBookingWithProviderData]);

  // Data processing functions
  const getBookingsByStatus = useCallback((status: BookingStatus): EnhancedBooking[] => {
    return userBookings.filter(booking => booking.status === status);
  }, [userBookings]);

  // Utility functions (unchanged)
  const formatBookingDate = useCallback((dateString: string): string => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const getStatusColor = useCallback((status: BookingStatus): string => {
    switch (status) {
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'InProgress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Declined':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Disputed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const getBookingCount = useCallback((status: BookingStatus): number => {
    return getBookingsByStatus(status).length;
  }, [getBookingsByStatus]);

  // Retry operation function
  const retryOperation = useCallback(async (operation: string) => {
    clearError();
    
    switch (operation) {
      case 'loadBookings':
        await loadUserBookings();
        break;
      case 'loadProfile':
        await loadUserProfile();
        break;
      case 'refreshBookings':
        await refreshBookings();
        break;
      default:
        console.warn(`Unknown operation to retry: ${operation}`);
    }
  }, [clearError, loadUserBookings, loadUserProfile, refreshBookings]);

  // Initialize data on mount
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  useEffect(() => {
    if (isUserAuthenticated()) {
      loadUserBookings();
    }
  }, [isUserAuthenticated, loadUserBookings]);

  // Return hook interface
  return {
    // Data states
    bookings: userBookings,
    userProfile,
    providerProfiles,
    
    // Loading states
    loading,
    loadingProfiles,
    refreshing,
    
    // Error state
    error,
    
    // Functions
    bookingsByStatus: getBookingsByStatus,
    updateBookingStatus,
    refreshBookings,
    clearError,
    getBookingCount,
    formatBookingDate,
    getStatusColor,
    enrichBookingWithProviderData,
    formatLocationString,
    getCurrentUserId,
    isUserAuthenticated,
    retryOperation,
    isOperationInProgress,
  };
};

export default useBookingManagement;