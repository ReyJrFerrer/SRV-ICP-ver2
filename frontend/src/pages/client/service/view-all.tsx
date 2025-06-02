import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useAuth } from "@bundly/ares-react";

// Components
import SearchBar from '@app/components/client/SearchBarNextjs';
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Services
import serviceCanisterService, { Service as CanisterService } from '@app/services/serviceCanisterService';
import authCanisterService, { FrontendProfile } from '@app/services/authCanisterService';

// Utilities
import { 
  getCategoryIcon, 
  enrichServiceWithProvider, 
  EnrichedService, 
  principalToString,
  getCategoryImage
} from '@app/utils/serviceHelpers';

// Interface for formatted service item that matches ServiceListItem requirements
interface FormattedServiceItem {
  id: string;
  slug: string;
  name: string;
  title?: string;
  heroImage: string;
  providerName?: string;
  providerAvatar?: any;
  rating: {
    average: number;
    count: number;
  };
  price: {
    amount: number;
    unit: string;
    display?: string;
  };
  location: {
    serviceRadius: number;
    serviceRadiusUnit: string;
    address?: string;
    city?: string;
    state?: string;
  };
  category: {
    name: string;
    id?: string;
    slug?: string;
  };
}

const ViewAllServicesPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  
  const [services, setServices] = useState<FormattedServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to transform EnrichedService to the format required by ServiceListItem component
  const formatServiceForDisplay = (service: EnrichedService): FormattedServiceItem => {
    return {
      id: service.id,
      slug: service.id, // Using ID as slug if not available
      name: service.title,
      title: service.description.slice(0, 60) + (service.description.length > 60 ? '...' : ''),
      heroImage: service.category.imageUrl || getCategoryImage(service.category.name),
      providerName: service.providerName,
      providerAvatar: service.providerAvatar,
      rating: {
        average: service.rating || 0,
        count: service.reviewCount || 0
      },
      price: {
        amount: service.price,
        unit: 'hour',
        display: service.priceDisplay
      },
      location: {
        serviceRadius: 10, // Default value
        serviceRadiusUnit: 'km',
        address: service.location.address,
        city: service.location.city,
        state: service.location.state
      },
      category: {
        name: service.category.name,
        id: service.category.id,
        slug: service.category.slug
      }
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        try {
          // Load services from service canister
          console.log('Fetching all services from service canister...');
          const canisterServices = await serviceCanisterService.getAllServices();
          console.log('Fetched services from canister:', canisterServices);
          
          // Load service providers
          console.log('Fetching service providers from auth canister...');
          const serviceProviders = await authCanisterService.getAllServiceProviders();
          console.log('Fetched service providers:', serviceProviders);
          
          // Create a lookup map for providers
          const providerMap = new Map<string, FrontendProfile>();
          serviceProviders.forEach(provider => {
            providerMap.set(provider.id, provider);
          });
          
          if (canisterServices && canisterServices.length > 0) {
            // Enrich services with provider data
            const enrichedServices: EnrichedService[] = canisterServices.map(service => {
              // Convert Principal to string for lookup
              const providerIdStr = principalToString(service.providerId);
              const provider = providerMap.get(providerIdStr) || null;
              
              return enrichServiceWithProvider(service, provider);
            });
            
            // Format the enriched services for the UI
            const formattedServices = enrichedServices.map(formatServiceForDisplay);
            
            setServices(formattedServices);
            console.log('Successfully loaded and enriched services');
          } else {
            console.warn('No services found in service canister');
            setServices([]);
          }
        } catch (error) {
          console.error('Failed to load services or providers:', error);
          setServices([]);
          setError('Failed to load service data');
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load service data');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>SRV | All Services</title>
        <meta name="description" content="Browse all available services" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">All Services</h1>
          </div>
          
          <SearchBar 
            placeholder="Search for service"
            className="mb-2"
            servicesList={services}
            redirectToSearchResultsPage={false}
          />
        </div>

        {/* Services List */}
        <div className="px-4 py-6">
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : services.length === 0 && !error ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No services available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceListItem 
                  key={service.id} 
                  service={service} 
                  inCategories={true} 
                />
              ))}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default ViewAllServicesPage;
