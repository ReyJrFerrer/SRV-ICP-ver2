import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

// Components
import ServiceLocationMap from '@app/components/client/ServiceLocationMapNextjs';
import SearchBar from '@app/components/client/SearchBarNextjs';
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomSheet from '@app/components/client/BottomSheetNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Utils
import { adaptServiceData } from '@app/utils/serviceDataAdapter';

const ServiceMapPage: React.FC = () => {
  const router = useRouter();
  const { q: searchQuery, category } = router.query;
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(true);

  useEffect(() => {
    // Load services data
    const loadData = async () => {
      try {
        const servicesModule = await import('../../../assets/services');
        let adaptedServices = adaptServiceData(servicesModule.SERVICES);
        
        // Filter by search query if provided
        if (searchQuery && typeof searchQuery === 'string') {
          adaptedServices = adaptedServices.filter(service => 
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (service.title && service.title.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        // Filter by category if provided
        if (category && typeof category === 'string') {
          adaptedServices = adaptedServices.filter(service => 
            service.category.slug === category
          );
        }
        
        setServices(adaptedServices);
      } catch (error) {
        console.error('Failed to load service data:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery, category]);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Find Services | Service Provider App</title>
        <meta name="description" content="Find services near your location" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Map View */}
        <div className="relative h-[40vh] w-full">
          <ServiceLocationMap fullScreen={true} />
          
          {/* Top controls overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3">
            <button 
              onClick={handleBackClick}
              className="p-2 bg-white rounded-full shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex-1">
              <SearchBar 
                placeholder={searchQuery ? String(searchQuery) : "Search for service"}
                className="bg-white shadow-md"
                redirectToSearch={false}
              />
            </div>
            
            <button 
              onClick={() => setFiltersOpen(true)}
              className="p-2 bg-white rounded-full shadow-md"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Results Bottom Sheet */}
        <BottomSheet
          isOpen={resultsOpen}
          onClose={() => setResultsOpen(false)}
          title={`${services.length} Services Found`}
          height="medium"
        >
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
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
        </BottomSheet>
        
        {/* Filters Bottom Sheet */}
        <BottomSheet
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title="Filter Services"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  All
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Home Services
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Cleaning
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Auto Repair
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Distance</h3>
              <input 
                type="range" 
                min="1" 
                max="50" 
                className="w-full accent-green-600" 
                defaultValue="10" 
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Price Range</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Min" 
                  className="border rounded-lg px-3 py-2 w-1/2" 
                />
                <input 
                  type="text" 
                  placeholder="Max" 
                  className="border rounded-lg px-3 py-2 w-1/2" 
                />
              </div>
            </div>
            
            <div className="pt-4 flex gap-3">
              <button className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg">
                Reset
              </button>
              <button className="w-1/2 px-4 py-2 bg-green-600 text-white rounded-lg">
                Apply Filters
              </button>
            </div>
          </div>
        </BottomSheet>
        
        <BottomNavigation />
      </div>
    </>
  );
};

export default ServiceMapPage;
