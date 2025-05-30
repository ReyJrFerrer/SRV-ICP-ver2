import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Components
import SearchBar from '@app/components/client/SearchBarNextjs';
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Types
import { Service } from '../../../../assets/types/service/service';

// Utils
import { adaptServiceData } from '@app/utils/serviceDataAdapter';

const ViewAllServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const servicesModule = await import('../../../../assets/services');
        const adaptedServices = adaptServiceData(servicesModule.SERVICES);
        setServices(adaptedServices);
      } catch (error) {
        console.error('Failed to load service data:', error);
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
        <title>All Services | Service Provider App</title>
        <meta name="description" content="Browse all available services" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold">All Services</h1>
          </div>
          
          <SearchBar 
            placeholder="Search for service"
            className="mb-2"
          />
        </div>

        {/* Services List */}
        <div className="px-4 py-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : services.length === 0 ? (
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
