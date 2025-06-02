import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useAuth } from "@bundly/ares-react";

// Components
import SearchBar from '@app/components/client/SearchBarNextjs';
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Services
import serviceCanisterService, { Service as CanisterService, ServiceCategory } from '@app/services/serviceCanisterService';
import authCanisterService, { FrontendProfile } from '@app/services/authCanisterService';

// Utilities
import { 
  getCategoryIcon, 
  enrichServiceWithProvider, 
  EnrichedService, 
  principalToString,
  getCategoryImage
} from '@app/utils/serviceHelpers';

interface CategoryState {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
}

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

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated, currentIdentity } = useAuth();
  
  const [category, setCategory] = useState<CategoryState | null>(null);
  const [services, setServices] = useState<FormattedServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!slug) return;

    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Load categories from service canister
        try {
          console.log('Fetching categories from service canister...');
          const canisterCategories = await serviceCanisterService.getAllCategories();
          console.log('Fetched categories from canister:', canisterCategories);
          
          let foundCategory: CategoryState | null = null;
          
          if (canisterCategories && canisterCategories.length > 0) {
            // Look for the specific category by slug
            const matchedCategory = canisterCategories.find(cat => cat.slug === slug);
            
            if (matchedCategory) {
              foundCategory = {
                id: matchedCategory.id,
                name: matchedCategory.name,
                description: matchedCategory.description || `Services in ${matchedCategory.name} category`,
                slug: matchedCategory.slug,
                icon: getCategoryIcon(matchedCategory.name)
              };
              setCategory(foundCategory);
            } else if (slug === 'all-service-types') {
              // Special case for all services
              foundCategory = {
                id: 'all',
                name: 'All Service Types',
                description: 'Browse all available service types',
                slug: 'all-service-types'
              };
              setCategory(foundCategory);
            } else {
              console.warn(`Category with slug "${slug}" not found`);
              setCategory(null);
            }
          } else {
            console.warn('No categories found in service canister');
            setCategory(null);
          }
          
          // Load services and provider information based on category
          if (foundCategory) {
            try {
              console.log('Fetching services from service canister...');
              let canisterServices: CanisterService[];
              
              if (foundCategory.slug === 'all-service-types') {
                canisterServices = await serviceCanisterService.getAllServices();
              } else {
                canisterServices = await serviceCanisterService.getServicesByCategory(foundCategory.id);
              }
              
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
                console.log('Successfully loaded and enriched services for category');
              } else {
                console.warn('No services found for this category');
                setServices([]);
              }
            } catch (error) {
              console.error('Failed to load services or providers:', error);
              setServices([]);
            }
          }
        } catch (canisterError) {
          console.error('Failed to load category data from canister:', canisterError);
          setCategory(null);
          setServices([]);
          setError('Failed to load category data');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load category data');
        setCategory(null);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleBackClick = () => {
    router.back();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (service.category.name && service.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Category not found</p>
          <Link href="/client/home" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} | Service Provider App</title>
        <meta name="description" content={category.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold truncate">{category.name}</h1>
          </div>
          
          <SearchBar 
            placeholder={`Search in ${category.name}`}
            className="mb-2"
            onSearch={handleSearch}
          />
        </div>

        {/* Services List */}
        <div className="p-2 sm:p-4">
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {filteredServices.length === 0 && !error ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchTerm ? `No services found for "${searchTerm}" in this category.` : "No services found in this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {filteredServices.map((service) => (
                <ServiceListItem 
                  key={service.id} 
                  service={service} 
                  isGridItem={true}
                  retainMobileLayout={true}
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

export default CategoryPage;
