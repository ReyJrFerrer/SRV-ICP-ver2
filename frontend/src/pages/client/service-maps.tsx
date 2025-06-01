import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeftIcon, AdjustmentsHorizontalIcon, MapPinIcon } from '@heroicons/react/24/solid'; 

// Components
import ServiceLocationMap from '@app/components/client/ServiceLocationMapNextjs';
import SearchBar from '@app/components/client/SearchBarNextjs'; 
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomSheet from '@app/components/client/BottomSheetNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Types & Data
import { Service } from '../../../assets/types/service/service';
import { SERVICES as mockServices } from '../../../assets/services';
import { adaptServiceData } from '@app/utils/serviceDataAdapter';

const ServiceMapPage: React.FC = () => {
  const router = useRouter();
  const { q: queryParam, category: categoryParam } = router.query;
  
  const [services, setServices] = useState<Service[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(true); 

  const fetchAndFilterServices = useCallback(() => {
    setLoading(true);
    const allServices = adaptServiceData(mockServices); 
    let filtered = allServices;

    // Filter by category if categoryParam exists
    if (currentCategory) {
      filtered = filtered.filter(service => 
        service.category.slug === currentCategory
      );
    }
    
    // Filter by search query if currentSearchQuery exists
    if (currentSearchQuery) {
      const lowerCaseQuery = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(lowerCaseQuery) || 
        (service.title && service.title.toLowerCase().includes(lowerCaseQuery)) ||
        service.description.toLowerCase().includes(lowerCaseQuery) ||
        service.category.name.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    setServices(filtered);
    setLoading(false);
  }, [currentSearchQuery, currentCategory]);


  useEffect(() => {
    let q = '';
    if (Array.isArray(queryParam)) q = queryParam[0] || '';
    else if (typeof queryParam === 'string') q = queryParam;
    setCurrentSearchQuery(q);

    let cat = null;
    if (Array.isArray(categoryParam)) cat = categoryParam[0] || null;
    else if (typeof categoryParam === 'string') cat = categoryParam;
    setCurrentCategory(cat);
    
  }, [queryParam, categoryParam]);

  useEffect(() => {
    fetchAndFilterServices();
  }, [currentSearchQuery, currentCategory, fetchAndFilterServices]);


  const handleBackClick = () => {
    router.back(); // Or router.push for a consistent back target
  };

  // Called when search is submitted from SearchBar on this page
  const handleMapPageSearch = (newQuery: string) => {
    const newRouteParams: { q?: string; category?: string } = {};
    if (newQuery.trim()) newRouteParams.q = newQuery.trim();
    if (currentCategory) newRouteParams.category = currentCategory;
    
    router.push({
      pathname: '/client/service-maps',
      query: newRouteParams,
    }, undefined, { shallow: true }); 
  };

  return (
    <>
      <Head>
        <title>Find Services on Map | SRV Client</title>
        <meta name="description" content="Find and explore services near your location on a map" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Full height layout */}
        {/* Top controls overlay (Header part of the map page) */}
        <div className="bg-white shadow-sm p-3 sm:p-4 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            
            <div className="flex-1">
              <SearchBar 
                placeholder={currentSearchQuery || "Search services on map..."}
                onSearch={handleMapPageSearch} 
                redirectToSearchResultsPage={false} 
                initialQuery={currentSearchQuery}
                className="bg-white" 
              />
            </div>
            
            <button 
              onClick={() => setFiltersOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open filters"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Map View - takes remaining height */}
        <div className="relative flex-grow"> 
          <ServiceLocationMap 
            fullScreen={true}  
          />
        </div>
        
        {/* Results Bottom Sheet */}
        {(services.length > 0 || loading) && (
             <BottomSheet
                isOpen={resultsOpen} 
                onClose={() => setResultsOpen(false)}
                title={loading ? "Loading..." : `${services.length} Service${services.length === 1 ? '' : 's'} Found`}
                height="medium" 
             >
                <div className="space-y-3 sm:space-y-4 max-h-[45vh] overflow-y-auto"> {/* Max height for scroll */}
                {loading ? (
                    <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <MapPinIcon className="h-10 w-10 text-gray-400 mx-auto mb-3"/>
                        <p className="text-gray-500">No services found matching your criteria in this area.</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {services.map((service) => (
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
          </BottomSheet>
        )}
        
        {/* Filters Bottom Sheet (Placeholder Content) */}
        <BottomSheet
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title="Filter Services"
          height="large"
        >
          <div className="space-y-4 p-1">
            {/* Placeholder for filter options */}
            <div className="text-center text-gray-500 py-10">
                <AdjustmentsHorizontalIcon className="h-12 w-12 mx-auto mb-3 text-gray-400"/>
                <p>Filter options will appear here.</p>
                <p className="text-xs text-gray-400"> (e.g., by category, price, distance, rating)</p>
            </div>
             <div className="pt-4 flex gap-3">
              <button onClick={() => setFiltersOpen(false)} className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Reset
              </button>
              <button onClick={() => setFiltersOpen(false)} className="w-1/2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                Apply Filters
              </button>
            </div>
          </div>
        </BottomSheet>
        
        <div className="lg:hidden"> {/* Show BottomNavigation only on smaller screens */}
            <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default ServiceMapPage;