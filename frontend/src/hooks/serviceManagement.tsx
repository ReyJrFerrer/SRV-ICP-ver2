import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@bundly/ares-react';
import { 
  Service, 
  ServiceStatus,
  ServiceCategory,
  ServicePackage,
  Location,
  ProviderAvailability,
  AvailableSlot,
  DayOfWeek,
  TimeSlot,
  DayAvailability,
  serviceCanisterService 
} from '../services/serviceCanisterService';
import { 
  FrontendProfile, 
  authCanisterService 
} from '../services/authCanisterService';

// Export availability-related types for use in components
export type { DayOfWeek, DayAvailability, TimeSlot, ProviderAvailability, AvailableSlot };

// Enhanced Service interface with additional frontend data
export interface EnhancedService extends Service {
  providerProfile?: FrontendProfile;
  formattedLocation?: string;
  distanceFromUser?: number;
  isProviderDataLoaded?: boolean;
  packages?: ServicePackage[];
  availability?: ProviderAvailability;
  formattedPrice?: string;
  averageRating?: number;
  totalReviews?: number;
}

// Service creation/update request types
export interface ServiceCreateRequest {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  location: Location;
  weeklySchedule?: Array<{ day: DayOfWeek; availability: DayAvailability }>;
  instantBookingEnabled?: boolean;
  bookingNoticeHours?: number;
  maxBookingsPerDay?: number;
}

export interface ServiceUpdateRequest extends Partial<ServiceCreateRequest> {
  id: string;
  status?: ServiceStatus;
}

// Package management types
export interface PackageCreateRequest {
  serviceId: string;
  title: string;
  description: string;
  price: number;
}

export interface PackageUpdateRequest extends Partial<PackageCreateRequest> {
  id: string;
}

// Search and filtering types
export interface ServiceSearchFilters {
  categoryId?: string;
  location?: Location;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: ServiceStatus;
  rating?: number;
  instantBookingOnly?: boolean;
  availableToday?: boolean;
}

export interface ServiceSearchRequest extends ServiceSearchFilters {
  query?: string;
  sortBy?: 'price' | 'rating' | 'distance' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Hook state management types
interface LoadingStates {
  services: boolean;
  profile: boolean;
  providers: boolean;
  categories: boolean;
  packages: boolean;
  availability: boolean;
  operations: Map<string, boolean>;
}

interface ServiceManagementHook {
  // Core data states
  services: EnhancedService[];
  userProfile: FrontendProfile | null;
  providerProfiles: Map<string, FrontendProfile>;
  categories: ServiceCategory[];
  userServices: EnhancedService[];
  
  // Loading states
  loading: boolean;
  loadingProfiles: boolean;
  loadingCategories: boolean;
  refreshing: boolean;
  
  // Error state
  error: string | null;
  
  // Service CRUD operations
  createService: (request: ServiceCreateRequest) => Promise<EnhancedService>;
  updateService: (serviceId: string, title: string, description: string, price: number) => Promise<EnhancedService>;
  deleteService: (serviceId: string) => Promise<void>;
  getService: (serviceId: string) => Promise<EnhancedService | null>;
  
  // Service status management
  updateServiceStatus: (serviceId: string, status: ServiceStatus) => Promise<void>;
  activateService: (serviceId: string) => Promise<void>;
  suspendService: (serviceId: string) => Promise<void>;
  deactivateService: (serviceId: string) => Promise<void>;
  
  // Package management
  createPackage: (request: PackageCreateRequest) => Promise<ServicePackage>;
  updatePackage: (request: PackageUpdateRequest) => Promise<ServicePackage>;
  deletePackage: (packageId: string) => Promise<void>;
  getServicePackages: (serviceId: string) => Promise<ServicePackage[]>;
  
  // Availability management
  updateAvailability: (serviceId: string, availability: ProviderAvailability) => Promise<void>;
  getServiceAvailability: (serviceId: string) => Promise<ProviderAvailability | null>;
  getAvailableSlots: (serviceId: string, date: Date) => Promise<AvailableSlot[]>;
  toggleInstantBooking: (serviceId: string, enabled: boolean) => Promise<void>;
  
  // Search and filtering
  searchServices: (request: ServiceSearchRequest) => Promise<EnhancedService[]>;
  getServicesByCategory: (categoryId: string) => Promise<EnhancedService[]>;
  getServicesByLocation: (location: Location, radius: number) => Promise<EnhancedService[]>;
  getNearbyServices: (userLocation?: Location) => Promise<EnhancedService[]>;
  
  // Utility functions
  servicesByStatus: (status: ServiceStatus) => EnhancedService[];
  refreshServices: () => Promise<void>;
  clearError: () => void;
  getServiceCount: (status?: ServiceStatus) => number;
  formatServicePrice: (price: number) => string;
  getStatusColor: (status: ServiceStatus) => string;
  enrichServiceWithProviderData: (service: Service) => Promise<EnhancedService>;
  formatLocationString: (location: Location) => string;
  calculateDistance: (from: Location, to: Location) => number;
  getCurrentUserId: () => string | null;
  isUserAuthenticated: () => boolean;
  retryOperation: (operation: string) => Promise<void>;
  isOperationInProgress: (operation: string) => boolean;
  
  // Category management
  getCategories: () => Promise<ServiceCategory[]>;
  refreshCategories: () => Promise<void>;
  
  // Provider functions
  getProviderServices: (providerId?: string) => Promise<EnhancedService[]>;
  getProviderStats: (providerId?: string) => Promise<{
    totalServices: number;
    activeServices: number;
    totalBookings: number;
    averageRating: number;
  }>;
}

export const useServiceManagement = (): ServiceManagementHook => {
  // Authentication - Fixed: using currentIdentity instead of user
  const { isAuthenticated, currentIdentity } = useAuth();
  
  // Core state management
  const [services, setServices] = useState<EnhancedService[]>([]);
  const [userProfile, setUserProfile] = useState<FrontendProfile | null>(null);
  const [providerProfiles, setProviderProfiles] = useState<Map<string, FrontendProfile>>(new Map());
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    services: false,
    profile: false,
    providers: false,
    categories: false,
    packages: false,
    availability: false,
    operations: new Map()
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add initialization and retry state tracking (like home.tsx and bookings.tsx)
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  
  // Add refs to prevent concurrent operations
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(true);
  
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000; // 1 second

  // Computed states
  const loading = useMemo(() => 
    loadingStates.services || loadingStates.profile,
    [loadingStates.services, loadingStates.profile]
  );
  
  const loadingProfiles = useMemo(() => 
    loadingStates.providers,
    [loadingStates.providers]
  );
  
  const loadingCategories = useMemo(() => 
    loadingStates.categories,
    [loadingStates.categories]
  );

  // User services filtered from all services
  const userServices = useMemo(() => {
    if (!currentIdentity) return [];
    const currentUserIdString = currentIdentity.getPrincipal().toString();
    return services.filter(service => 
      service.providerId.toString() === currentUserIdString
    );
  }, [services, currentIdentity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper function to update loading state
  const setLoadingState = useCallback((key: keyof Omit<LoadingStates, 'operations'>, value: boolean) => {
    if (!mountedRef.current) return;
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Helper function to update operation loading state
  const setOperationLoading = useCallback((operation: string, value: boolean) => {
    if (!mountedRef.current) return;
    setLoadingStates(prev => {
      const newOperations = new Map(prev.operations);
      if (value) {
        newOperations.set(operation, true);
      } else {
        newOperations.delete(operation);
      }
      return { ...prev, operations: newOperations };
    });
  }, []);

  // Enhanced error handling with retry logic
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    
    // Check if it's a certificate error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isCertificateError = errorMessage.includes('certificate') || errorMessage.includes('Invalid certificate');
    
    if (isCertificateError) {
      console.log(`Certificate error detected in ${operation}, will retry automatically`);
      
      // Don't set the error state immediately for certificate errors
      // Let the retry mechanism handle it
      return;
    }
    
    if (mountedRef.current) {
      setError(`${operation}: ${errorMessage}`);
    }
  }, []);

  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  // Enhanced operation wrapper with retry logic (similar to home.tsx and bookings.tsx)
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = MAX_RETRY_ATTEMPTS
  ): Promise<T | null> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add progressive delay for retries
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        }
        
        // Check if component was unmounted during delay
        if (!mountedRef.current) {
          return null;
        }
        
        const result = await operation();
        
        // Reset retry count on success
        if (attempt > 1) {
          console.log(`${operationName} succeeded on attempt ${attempt}`);
        }
        
        return result;
      } catch (error) {
        console.error(`${operationName} attempt ${attempt} failed:`, error);
        lastError = error as Error;
        
        // Check if it's a certificate error
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isCertificateError = errorMessage.includes('certificate') || errorMessage.includes('Invalid certificate');
        
        if (isCertificateError) {
          console.log(`Certificate error in ${operationName}, attempt ${attempt}/${maxRetries}`);
          
          // If this is the last attempt, we'll throw the error
          if (attempt === maxRetries) {
            break;
          }
          
          // Continue to next attempt for certificate errors
          continue;
        } else {
          // For non-certificate errors, fail immediately
          break;
        }
      }
    }
    
    // All retries failed
    if (mountedRef.current) {
      handleError(lastError, operationName);
    }
    throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
  }, [handleError]);

  // Enhanced fetch user profile with retry logic
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !currentIdentity || !isInitialized || !mountedRef.current) return;

    try {
      setLoadingState('profile', true);
      
      await executeWithRetry(async () => {
        const profileData = await authCanisterService.getProfile(currentIdentity.getPrincipal().toString());
        if (mountedRef.current) {
          setUserProfile(profileData);
        }
        return profileData;
      }, 'fetch user profile');
      
    } catch (error) {
      // Error already handled by executeWithRetry
    } finally {
      setLoadingState('profile', false);
    }
  }, [isAuthenticated, currentIdentity, isInitialized, setLoadingState, executeWithRetry]);

  // Enhanced initialization (similar to home.tsx and bookings.tsx)
  const initializeHook = useCallback(async () => {
    if (isInitializingRef.current || !mountedRef.current) return;
    
    try {
      console.log('Initializing service management hook - attempt:', initializationAttempts + 1);
      isInitializingRef.current = true;
      
      // Check authentication first with retry logic
      if (!isAuthenticated || !currentIdentity) {
        console.log('User not authenticated, waiting...');
        
        if (initializationAttempts < MAX_RETRY_ATTEMPTS) {
          setTimeout(() => {
            if (mountedRef.current) {
              setInitializationAttempts(prev => prev + 1);
            }
          }, RETRY_DELAY * (initializationAttempts + 1));
          return;
        } else {
          console.log('Authentication failed after multiple attempts');
          setIsInitialized(true); // Still mark as initialized to prevent infinite loops
          return;
        }
      }

      // Reset initialization attempts once authenticated
      setInitializationAttempts(0);
      setRetryCount(0);
      setIsInitialized(true);
      
      console.log('Service management hook initialized successfully');
      
    } catch (error) {
      console.error('Error initializing service management hook:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('certificate') || errorMessage.includes('Invalid certificate')) {
        console.log('Certificate error detected during initialization, implementing retry logic...');
        
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          console.log(`Retrying initialization in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
          setRetryCount(prev => prev + 1);
          
          setTimeout(() => {
            if (mountedRef.current) {
              initializeHook();
            }
          }, RETRY_DELAY * (retryCount + 1));
          
          return;
        }
      }
      
      setIsInitialized(true); // Mark as initialized even on error to prevent infinite loops
    } finally {
      isInitializingRef.current = false;
    }
  }, [isAuthenticated, currentIdentity, initializationAttempts, retryCount]);

  // Initialize on mount and auth changes
  useEffect(() => {
    initializeHook();
  }, [initializeHook]);

  // Fetch provider profile with enhanced error handling
  const fetchProviderProfile = useCallback(async (providerId: string): Promise<FrontendProfile | null> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching provider profile');
      return null;
    }

    try {
      if (providerProfiles.has(providerId)) {
        return providerProfiles.get(providerId)!;
      }

      const profile = await executeWithRetry(async () => {
        return await authCanisterService.getProfile(providerId);
      }, 'fetch provider profile');

      if (profile && mountedRef.current) {
        setProviderProfiles(prev => new Map(prev).set(providerId, profile));
        return profile;
      }
      return null;
    } catch (error) {
      // Error already handled by executeWithRetry
      return null;
    }
  }, [isInitialized, providerProfiles, executeWithRetry]);

  // Enhanced fetch categories with retry logic
  const fetchCategories = useCallback(async () => {
    if (!isInitialized || !mountedRef.current) return;
    
    try {
      setLoadingState('categories', true);
      
      await executeWithRetry(async () => {
        const categoriesData = await serviceCanisterService.getAllCategories();
        if (mountedRef.current) {
          setCategories(categoriesData);
        }
        return categoriesData;
      }, 'fetch categories');
      
    } catch (error) {
      // Error already handled by executeWithRetry
      console.log('Failed to fetch categories after retries, continuing with empty array');
      if (mountedRef.current) {
        setCategories([]); // Set empty array on failure
      }
    } finally {
      setLoadingState('categories', false);
    }
  }, [isInitialized, setLoadingState, executeWithRetry]);

  // Enrich service with provider data
  const enrichServiceWithProviderData = useCallback(async (service: Service): Promise<EnhancedService> => {
    const providerProfile = await fetchProviderProfile(service.providerId.toString());
    
    const enrichedService: EnhancedService = {
      ...service,
      providerProfile: providerProfile ?? undefined,
      formattedLocation: formatLocationString(service.location),
      isProviderDataLoaded: true,
      formattedPrice: formatServicePrice(service.price),
      averageRating: service.rating || 0,
      totalReviews: Number(service.reviewCount) || 0,
    };

    return enrichedService;
  }, [fetchProviderProfile]);

  // Enhanced fetch services with retry logic
  const fetchServices = useCallback(async () => {
    if (!isInitialized || !mountedRef.current) return;
    
    try {
      setLoadingState('services', true);
      
      await executeWithRetry(async () => {
        const servicesData = await serviceCanisterService.getAllServices();
        
        // Enrich services with provider data
        const enrichedServices = await Promise.all(
          servicesData.map(service => enrichServiceWithProviderData(service))
        );
        
        if (mountedRef.current) {
          setServices(enrichedServices);
        }
        return enrichedServices;
      }, 'fetch services');
      
    } catch (error) {
      // Error already handled by executeWithRetry
      console.log('Failed to fetch services after retries, continuing with empty array');
      if (mountedRef.current) {
        setServices([]); // Set empty array on failure
      }
    } finally {
      setLoadingState('services', false);
    }
  }, [isInitialized, setLoadingState, executeWithRetry, enrichServiceWithProviderData]);

  // Service CRUD Operations with enhanced error handling

  const createService = useCallback(async (request: ServiceCreateRequest): Promise<EnhancedService> => {
    try {
      setOperationLoading('createService', true);
      
      const result = await executeWithRetry(async () => {
        const newService = await serviceCanisterService.createService(
          request.title,
          request.description,
          request.categoryId,
          request.price,
          request.location,
          request.weeklySchedule,
          request.instantBookingEnabled,
          request.bookingNoticeHours,
          request.maxBookingsPerDay
        );

        if (!newService) {
          throw new Error('Failed to create service');
        }

        const enrichedService = await enrichServiceWithProviderData(newService);
        if (mountedRef.current) {
          setServices(prev => [...prev, enrichedService]);
        }
        return enrichedService;
      }, 'create service');

      return result!;
    } catch (error) {
      handleError(error, 'create service');
      throw error;
    } finally {
      setOperationLoading('createService', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const updateService = useCallback(async (
    serviceId: string, 
    title: string, 
    description: string, 
    price: number
  ): Promise<EnhancedService> => {
    try {
      setOperationLoading('updateService', true);
      
      const result = await executeWithRetry(async () => {
        const updatedService = await serviceCanisterService.updateService(
          serviceId,
          title,
          description,
          price
        );

        if (!updatedService) {
          throw new Error('Failed to update service');
        }

        const enrichedService = await enrichServiceWithProviderData(updatedService);
        if (mountedRef.current) {
          setServices(prev => prev.map(service => 
            service.id === serviceId ? enrichedService : service
          ));
        }
        return enrichedService;
      }, 'update service');

      return result!;
    } catch (error) {
      handleError(error, 'update service');
      throw error;
    } finally {
      setOperationLoading('updateService', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const deleteService = useCallback(async (serviceId: string): Promise<void> => {
    try {
      setOperationLoading('deleteService', true);
      
      await executeWithRetry(async () => {
        await serviceCanisterService.deleteService(serviceId);
        if (mountedRef.current) {
          setServices(prev => prev.filter(service => service.id !== serviceId));
        }
      }, 'delete service');
      
    } catch (error) {
      handleError(error, 'delete service');
      throw error;
    } finally {
      setOperationLoading('deleteService', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  const getService = useCallback(async (serviceId: string): Promise<EnhancedService | null> => {
    try {
      const result = await executeWithRetry(async () => {
        const service = await serviceCanisterService.getService(serviceId);
        if (!service) return null;
        
        return await enrichServiceWithProviderData(service);
      }, 'get service');
      
      return result;
    } catch (error) {
      handleError(error, 'get service');
      return null;
    }
  }, [executeWithRetry, handleError, enrichServiceWithProviderData]);

  // Service status management
  const updateServiceStatus = useCallback(async (serviceId: string, status: ServiceStatus): Promise<void> => {
    try {
      setOperationLoading('updateServiceStatus', true);
      
      await executeWithRetry(async () => {
        const updatedService = await serviceCanisterService.updateServiceStatus(serviceId, status);
        if (!updatedService) {
          throw new Error('Failed to update service status');
        }

        const enrichedService = await enrichServiceWithProviderData(updatedService);
        if (mountedRef.current) {
          setServices(prev => prev.map(service => 
            service.id === serviceId ? enrichedService : service
          ));
        }
      }, 'update service status');
      
    } catch (error) {
      handleError(error, 'update service status');
      throw error;
    } finally {
      setOperationLoading('updateServiceStatus', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const activateService = useCallback(async (serviceId: string): Promise<void> => {
    await updateServiceStatus(serviceId, 'Available');
  }, [updateServiceStatus]);

  const suspendService = useCallback(async (serviceId: string): Promise<void> => {
    await updateServiceStatus(serviceId, 'Suspended');
  }, [updateServiceStatus]);

  const deactivateService = useCallback(async (serviceId: string): Promise<void> => {
    await updateServiceStatus(serviceId, 'Unavailable');
  }, [updateServiceStatus]);

  // Package management with enhanced error handling
  const createPackage = useCallback(async (request: PackageCreateRequest): Promise<ServicePackage> => {
    try {
      setOperationLoading('createPackage', true);
      
      const result = await executeWithRetry(async () => {
        const newPackage = await serviceCanisterService.createServicePackage(
          request.serviceId,
          request.title,
          request.description,
          request.price
        );

        if (!newPackage) {
          throw new Error('Failed to create package');
        }

        return newPackage;
      }, 'create package');

      return result!;
    } catch (error) {
      handleError(error, 'create package');
      throw error;
    } finally {
      setOperationLoading('createPackage', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  const updatePackage = useCallback(async (request: PackageUpdateRequest): Promise<ServicePackage> => {
    try {
      setOperationLoading('updatePackage', true);
      
      const result = await executeWithRetry(async () => {
        const updatedPackage = await serviceCanisterService.updateServicePackage(
          request.id,
          request.title!,
          request.description!,
          request.price!
        );

        if (!updatedPackage) {
          throw new Error('Failed to update package');
        }

        return updatedPackage;
      }, 'update package');

      return result!;
    } catch (error) {
      handleError(error, 'update package');
      throw error;
    } finally {
      setOperationLoading('updatePackage', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  const deletePackage = useCallback(async (packageId: string): Promise<void> => {
    try {
      setOperationLoading('deletePackage', true);
      
      await executeWithRetry(async () => {
        await serviceCanisterService.deleteServicePackage(packageId);
      }, 'delete package');
      
    } catch (error) {
      handleError(error, 'delete package');
      throw error;
    } finally {
      setOperationLoading('deletePackage', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  const getServicePackages = useCallback(async (serviceId: string): Promise<ServicePackage[]> => {
    try {
      const result = await executeWithRetry(async () => {
        return await serviceCanisterService.getServicePackages(serviceId);
      }, 'get service packages');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get service packages');
      return [];
    }
  }, [executeWithRetry, handleError]);

  // Availability management with enhanced error handling
  const updateAvailability = useCallback(async (
    serviceId: string, 
    availability: ProviderAvailability
  ): Promise<void> => {
    try {
      setOperationLoading('updateAvailability', true);
      
      await executeWithRetry(async () => {
        const updatedAvailability = await serviceCanisterService.setServiceAvailability(
          serviceId,
          availability.weeklySchedule,
          availability.instantBookingEnabled,
          availability.bookingNoticeHours,
          availability.maxBookingsPerDay
        );

        if (!updatedAvailability) {
          throw new Error('Failed to update availability');
        }

        // Update the service in local state
        if (mountedRef.current) {
          setServices(prev => prev.map(service => 
            service.id === serviceId 
              ? { ...service, availability: updatedAvailability }
              : service
          ));
        }
      }, 'update availability');
      
    } catch (error) {
      handleError(error, 'update availability');
      throw error;
    } finally {
      setOperationLoading('updateAvailability', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  const getAvailableSlots = useCallback(async (
    serviceId: string, 
    date: Date
  ): Promise<AvailableSlot[]> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching available slots');
      return [];
    }

    try {
      const result = await executeWithRetry(async () => {
        return await serviceCanisterService.getAvailableTimeSlots(serviceId, date);
      }, 'get available slots');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get available slots');
      return [];
    }
  }, [isInitialized, executeWithRetry, handleError]);

  const toggleInstantBooking = useCallback(async (
    serviceId: string, 
    enabled: boolean
  ): Promise<void> => {
    try {
      setOperationLoading('toggleInstantBooking', true);
      
      await executeWithRetry(async () => {
        // Get current availability
        const currentAvailability = await serviceCanisterService.getServiceAvailability(serviceId);
        if (!currentAvailability) {
          throw new Error('Service availability not found');
        }

        // Update with new instant booking setting
        await serviceCanisterService.setServiceAvailability(
          serviceId,
          currentAvailability.weeklySchedule,
          enabled,
          currentAvailability.bookingNoticeHours,
          currentAvailability.maxBookingsPerDay
        );

        // Update local state
        if (mountedRef.current) {
          setServices(prev => prev.map(service => 
            service.id === serviceId 
              ? { 
                  ...service, 
                  availability: service.availability ? 
                    { ...service.availability, instantBookingEnabled: enabled } 
                    : undefined 
                }
              : service
          ));
        }
      }, 'toggle instant booking');
      
    } catch (error) {
      handleError(error, 'toggle instant booking');
      throw error;
    } finally {
      setOperationLoading('toggleInstantBooking', false);
    }
  }, [setOperationLoading, executeWithRetry, handleError]);

  // Search and filtering with enhanced error handling
  const searchServices = useCallback(async (request: ServiceSearchRequest): Promise<EnhancedService[]> => {
    try {
      // For now, implement basic filtering on loaded services
      // This can be enhanced with backend search in the future
      let filteredServices = [...services];

      if (request.categoryId) {
        filteredServices = filteredServices.filter(service => 
          service.category.id === request.categoryId
        );
      }

      if (request.status) {
        filteredServices = filteredServices.filter(service => 
          service.status === request.status
        );
      }

      if (request.minPrice !== undefined) {
        filteredServices = filteredServices.filter(service => 
          service.price >= request.minPrice!
        );
      }

      if (request.maxPrice !== undefined) {
        filteredServices = filteredServices.filter(service => 
          service.price <= request.maxPrice!
        );
      }

      if (request.query) {
        const searchTerm = request.query.toLowerCase();
        filteredServices = filteredServices.filter(service => 
          service.title.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm)
        );
      }

      return filteredServices;
    } catch (error) {
      handleError(error, 'search services');
      return [];
    }
  }, [services, handleError]);

  const getServicesByCategory = useCallback(async (categoryId: string): Promise<EnhancedService[]> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching services by category');
      return [];
    }

    try {
      const result = await executeWithRetry(async () => {
        const categoryServices = await serviceCanisterService.getServicesByCategory(categoryId);
        return await Promise.all(
          categoryServices.map(service => enrichServiceWithProviderData(service))
        );
      }, 'get services by category');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get services by category');
      return [];
    }
  }, [isInitialized, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const getServicesByLocation = useCallback(async (
    location: Location, 
    radius: number
  ): Promise<EnhancedService[]> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching services by location');
      return [];
    }

    try {
      const result = await executeWithRetry(async () => {
        const locationServices = await serviceCanisterService.searchServicesByLocation(
          location, 
          radius
        );
        return await Promise.all(
          locationServices.map(service => enrichServiceWithProviderData(service))
        );
      }, 'get services by location');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get services by location');
      return [];
    }
  }, [isInitialized, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const getNearbyServices = useCallback(async (userLocation?: Location): Promise<EnhancedService[]> => {
    if (!userLocation) return services;
    
    try {
      return await getServicesByLocation(userLocation, 50); // 50km default radius
    } catch (error) {
      handleError(error, 'get nearby services');
      return services;
    }
  }, [services, getServicesByLocation, handleError]);

  // Utility functions
  const servicesByStatus = useCallback((status: ServiceStatus): EnhancedService[] => {
    return services.filter(service => service.status === status);
  }, [services]);

  const refreshServices = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    try {
      await fetchServices();
    } finally {
      setRefreshing(false);
    }
  }, [fetchServices]);

  const getServiceCount = useCallback((status?: ServiceStatus): number => {
    if (!status) return services.length;
    return servicesByStatus(status).length;
  }, [services.length, servicesByStatus]);

  const formatServicePrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  }, []);

  const getStatusColor = useCallback((status: ServiceStatus): string => {
    switch (status) {
      case 'Available': return 'green';
      case 'Suspended': return 'yellow';
      case 'Unavailable': return 'red';
      default: return 'gray';
    }
  }, []);

  const formatLocationString = useCallback((location: Location): string => {
    return `${location.city}, ${location.state}`;
  }, []);

  const calculateDistance = useCallback((from: Location, to: Location): number => {
    // Haversine formula for calculating distance between two coordinates
    const R = 6371; // Earth's radius in kilometers
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const getCurrentUserId = useCallback((): string | null => {
    return currentIdentity ? currentIdentity.getPrincipal().toString() : null;
  }, [currentIdentity]);

  const isUserAuthenticated = useCallback((): boolean => {
    return isAuthenticated && currentIdentity !== null;
  }, [isAuthenticated, currentIdentity]);

  const retryOperation = useCallback(async (operation: string): Promise<void> => {
    // Simple retry mechanism - can be enhanced based on operation type
    switch (operation) {
      case 'fetchServices':
        await fetchServices();
        break;
      case 'fetchCategories':
        await fetchCategories();
        break;
      case 'fetchUserProfile':
        await fetchUserProfile();
        break;
      default:
        console.warn(`Retry not implemented for operation: ${operation}`);
    }
  }, [fetchServices, fetchCategories, fetchUserProfile]);

  const isOperationInProgress = useCallback((operation: string): boolean => {
    return loadingStates.operations.has(operation);
  }, [loadingStates.operations]);

  // Enhanced category management
  const getCategories = useCallback(async (): Promise<ServiceCategory[]> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching categories');
      return [];
    }

    try {
      const result = await executeWithRetry(async () => {
        return await serviceCanisterService.getAllCategories();
      }, 'get categories');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get categories');
      return [];
    }
  }, [isInitialized, executeWithRetry, handleError]);

  const refreshCategories = useCallback(async (): Promise<void> => {
    await fetchCategories();
  }, [fetchCategories]);

  // Provider functions with enhanced error handling
  const getProviderServices = useCallback(async (providerId?: string): Promise<EnhancedService[]> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching provider services');
      return [];
    }

    try {
      const targetProviderId = providerId || getCurrentUserId();
      if (!targetProviderId) return [];

      const result = await executeWithRetry(async () => {
        const providerServices = await serviceCanisterService.getServicesByProvider(targetProviderId);
        return await Promise.all(
          providerServices.map(service => enrichServiceWithProviderData(service))
        );
      }, 'get provider services');
      
      return result || [];
    } catch (error) {
      handleError(error, 'get provider services');
      return [];
    }
  }, [isInitialized, getCurrentUserId, executeWithRetry, handleError, enrichServiceWithProviderData]);

  const getProviderStats = useCallback(async (providerId?: string): Promise<{
    totalServices: number;
    activeServices: number;
    totalBookings: number;
    averageRating: number;
  }> => {
    try {
      const providerServices = await getProviderServices(providerId);
      
      const totalServices = providerServices.length;
      const activeServices = providerServices.filter(s => s.status === 'Available').length;
      const totalBookings = 0; // This would need to be fetched from booking service
      const averageRating = providerServices.length > 0 
        ? providerServices.reduce((sum, s) => sum + (s.rating || 0), 0) / providerServices.length
        : 0;

      return {
        totalServices,
        activeServices,
        totalBookings,
        averageRating
      };
    } catch (error) {
      handleError(error, 'get provider stats');
      return {
        totalServices: 0,
        activeServices: 0,
        totalBookings: 0,
        averageRating: 0
      };
    }
  }, [getProviderServices, handleError]);

  // Enhanced service availability function
  const getServiceAvailability = useCallback(async (serviceId: string): Promise<ProviderAvailability | null> => {
    if (!isInitialized || !mountedRef.current) {
      console.log('Waiting for initialization before fetching service availability');
      return null;
    }

    try {
      const result = await executeWithRetry(async () => {
        return await serviceCanisterService.getServiceAvailability(serviceId);
      }, 'get service availability');
      
      return result;
    } catch (error) {
      handleError(error, 'get service availability');
      return null;
    }
  }, [isInitialized, executeWithRetry, handleError]);

  // Effects with enhanced initialization
  useEffect(() => {
    if (isAuthenticated && currentIdentity && isInitialized) {
      fetchUserProfile();
    }
  }, [isAuthenticated, currentIdentity, isInitialized, fetchUserProfile]);

  useEffect(() => {
    if (isInitialized) {
      fetchServices();
      fetchCategories();
    }
  }, [isInitialized, fetchServices, fetchCategories]);

  // Return the hook interface
  return {
    // Core data states
    services,
    userProfile,
    providerProfiles,
    categories,
    userServices,
    
    // Loading states
    loading,
    loadingProfiles,
    loadingCategories,
    refreshing,
    
    // Error state
    error,
    
    // Service CRUD operations
    createService,
    updateService,
    deleteService,
    getService,
    
    // Service status management
    updateServiceStatus,
    activateService,
    suspendService,
    deactivateService,
    
    // Package management
    createPackage,
    updatePackage,
    deletePackage,
    getServicePackages,
    
    // Availability management
    updateAvailability,
    getServiceAvailability,
    getAvailableSlots,
    toggleInstantBooking,
    
    // Search and filtering
    searchServices,
    getServicesByCategory,
    getServicesByLocation,
    getNearbyServices,
    
    // Utility functions
    servicesByStatus,
    refreshServices,
    clearError,
    getServiceCount,
    formatServicePrice,
    getStatusColor,
    enrichServiceWithProviderData,
    formatLocationString,
    calculateDistance,
    getCurrentUserId,
    isUserAuthenticated,
    retryOperation,
    isOperationInProgress,
    
    // Category management
    getCategories,
    refreshCategories,
    
    // Provider functions
    getProviderServices,
    getProviderStats,
  };
};