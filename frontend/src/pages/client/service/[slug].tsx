import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from "@bundly/ares-react";

// Components
import ServiceDetailPageComponent from '../../../components/client/ServiceDetailPageComponent';
import BottomNavigation from '../../../components/client/BottomNavigationNextjs';

// Services
import serviceCanisterService, { Service as CanisterService } from '@app/services/serviceCanisterService';
import authCanisterService, { FrontendProfile } from '@app/services/authCanisterService';

// Utilities
import { 
  enrichServiceWithProvider, 
  EnrichedService, 
  principalToString,
  getCategoryImage
} from '@app/utils/serviceHelpers';

// Interface for formatted service that matches the ServiceDetailPageComponent requirements
interface FormattedServiceDetail {
  id: string;
  providerId: string;
  name: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  price: {
    amount: number;
    currency: string;
    unit: string;
    isNegotiable: boolean;
  };
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    serviceRadius: number;
    serviceRadiusUnit: string;
  };
  availability: {
    schedule: string[];
    timeSlots: string[];
    isAvailableNow: boolean;
  };
  rating: {
    average: number;
    count: number;
  };
  media: Array<{ url: string; type: string }>;
  requirements: string[];
  isVerified: boolean;
  slug: string;
  heroImage: string;
  category: {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  providerName?: string;
  providerAvatar?: any;
}

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated, currentIdentity } = useAuth();
  
  const [service, setService] = useState<FormattedServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to transform EnrichedService to the format required by ServiceDetailPageComponent
  const formatServiceForDetailPage = (service: EnrichedService): FormattedServiceDetail => {
    return {
      id: service.id,
      providerId: service.providerId.toString(),
      name: service.title,
      title: service.title,
      description: service.description,
      isActive: service.status === 'Available',
      createdAt: new Date(service.createdAt),
      updatedAt: new Date(service.updatedAt),
      price: {
        amount: service.price,
        currency: 'PHP', // Default currency, update if available from backend
        unit: '/ Service', // Default unit, update if available from backend
        isNegotiable: false // Default value, update if available from backend
      },
      location: {
        address: `${service.location.city}, ${service.location.state}, ${service.location.country}`,
        coordinates: {
          latitude: service.location.latitude,
          longitude: service.location.longitude
        },
        serviceRadius: 10, // Default value, update if available from backend
        serviceRadiusUnit: 'km' // Default value, update if available from backend
      },
      availability: {
        schedule: service.weeklySchedule 
          ? service.weeklySchedule.filter(day => day.availability.isAvailable).map(day => day.day) 
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], // Default schedule
        timeSlots: service.weeklySchedule 
          ? service.weeklySchedule
              .filter(day => day.availability.isAvailable)
              .flatMap(day => day.availability.slots.map(slot => `${slot.startTime}-${slot.endTime}`))
          : ['09:00-17:00'], // Default time slot
        isAvailableNow: true // Default value, could be calculated based on current time and availability
      },
      rating: {
        average: service.rating || 0,
        count: service.reviewCount || 0
      },
      media: [], // Default empty media array
      requirements: [], // Default empty requirements
      isVerified: true, // Default value
      slug: service.id, // Using ID as slug
      heroImage: service.category.imageUrl || getCategoryImage(service.category.name),
      category: {
        id: service.category.id,
        name: service.category.name,
        description: service.category.description,
        slug: service.category.slug,
        icon: 'default',
        imageUrl: service.category.imageUrl || getCategoryImage(service.category.name),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      providerName: service.providerName,
      providerAvatar: service.providerAvatar
    };
  };

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        try {
          console.log('Fetching service with slug/id:', slug);
          
          // Attempt to fetch the service by ID first
          const service = await serviceCanisterService.getService(slug.toString());
          
          if (service) {
            console.log('Fetched service from canister:', service);
            
            // Get provider information
            try {
              console.log('Fetching provider details...');
              const providerIdStr = principalToString(service.providerId);
              const provider = await authCanisterService.getProfile(providerIdStr);
              
              if (provider) {
                console.log('Fetched provider:', provider);
                
                // Enrich service with provider data
                const enrichedService = enrichServiceWithProvider(service, provider);
                
                // Format for UI display
                const formattedService = formatServiceForDetailPage(enrichedService);
                setService(formattedService);
                console.log('Successfully loaded and formatted service for detail page');
              } else {
                console.warn('Provider not found for service');
                const enrichedService = enrichServiceWithProvider(service, null);
                const formattedService = formatServiceForDetailPage(enrichedService);
                setService(formattedService);
              }
            } catch (providerError) {
              console.error('Failed to load provider information:', providerError);
              const enrichedService = enrichServiceWithProvider(service, null);
              const formattedService = formatServiceForDetailPage(enrichedService);
              setService(formattedService);
            }
          } else {
            console.warn(`Service with ID "${slug}" not found`);
            setService(null);
            setError('Service not found');
          }
        } catch (serviceError) {
          console.error('Failed to load service from canister:', serviceError);
          setService(null);
          setError('Failed to load service data');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load service data');
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {service ? `${service.name} - ${service.title}` : 'Service Details'} | SRV Client
        </title>
        <meta 
          name="description" 
          content={service?.description || 'Professional service details'} 
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Page Header */}
        <header className="flex items-center justify-between px-4 py-4 md:px-6 lg:px-8 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center flex-grow">
            <button 
              onClick={handleBackClick} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 mr-4"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <div className="flex-grow lg:flex lg:items-center lg:justify-between">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 truncate">
                {service?.title || 'Service Details'}
              </h1>
              {/* Desktop breadcrumb */}
              <div className="hidden lg:flex items-center text-sm text-gray-500 space-x-2">
                <span>Services</span>
                <span>/</span>
                <span className="text-gray-800 font-medium">{service?.category?.name || 'Category'}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow overflow-y-auto scrollbar-hide pb-20 lg:pb-0">
          {error && (
            <div className="mx-4 my-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <ServiceDetailPageComponent service={service} />
        </main>
        
        {/* Bottom Navigation - Hidden on large screens */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
