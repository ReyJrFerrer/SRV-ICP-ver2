import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@bundly/ares-react';

import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import ProviderServiceListItem from '@app/components/provider/ProviderServiceListItem'; 

// Import main data sources
import { Service } from '../../../assets/types/service/service';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';
import { SERVICES as allMasterServicesList } from '../../../assets/services'; // Main list of all services
import { SERVICE_PROVIDERS } from '../../../assets/serviceProviders'; // To get the provider's offered service summaries

import { adaptServiceData } from '@app/utils/serviceDataAdapter'; // If you adapt data

const MyServicesPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();

  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !currentIdentity) {
      setLoading(false);
      setProviderServices([]);
      return;
    }

    const providerId = currentIdentity.getPrincipal().toString();
    
    // 1. Find the current provider from SERVICE_PROVIDERS mock data
    const currentProviderData = SERVICE_PROVIDERS.find(p => p.id === providerId || p.userId === providerId);

    if (currentProviderData && currentProviderData.servicesOffered) {
      // 2. Get the list of service slugs/ids that this provider offers (from their profile)
      const offeredServiceIdentifiers = currentProviderData.servicesOffered.map(s => s.slug || s.id);
      
      // 3. Adapt the main services list if necessary (e.g., for image paths)
      const allAdaptedMasterServices = adaptServiceData(allMasterServicesList);

      // 4. Filter the main services list to get the full objects for the offered services
      const filteredFullServices = allAdaptedMasterServices.filter(masterService => 
        offeredServiceIdentifiers.includes(masterService.slug) || offeredServiceIdentifiers.includes(masterService.id)
      );
      
      setProviderServices(filteredFullServices);
    } else {
      // Provider not found or has no servicesOffered listed in their profile
      setProviderServices([]);
    }
    setLoading(false);
  }, [isAuthenticated, currentIdentity]);

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    // TODO: Implement backend call
    setProviderServices(prevServices =>
      prevServices.map(s => 
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
    alert(`Mock: Service ${serviceId} status toggled. Update backend.`);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm(`Are you sure you want to delete service ${serviceId}?`)) {
      // TODO: Implement backend call
      setProviderServices(prevServices => prevServices.filter(s => s.id !== serviceId));
      alert(`Mock: Service ${serviceId} deleted. Update backend.`);
    }
  };


  return (
    <>
      <Head>
        <title>My Services | SRV Provider</title>
        <meta name="description" content="Manage your offered services." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col pb-16 md:pb-0">
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Services</h1>
            <Link href="/provider/services/add" legacyBehavior>
              <a className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm">
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Add New Service
              </a>
            </Link>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6">
          {providerServices.length === 0 && !loading ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md mt-6">
              <WrenchScrewdriverIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">You haven't listed any services that match your profile.</p>
              <p className="text-sm text-gray-500 mb-6">Ensure services in the main database are linked to your provider ID, or add new ones.</p>
              <Link href="/provider/services/add" legacyBehavior>
                <a className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Your First Service
                </a>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {providerServices.map(service => (
                <ProviderServiceListItem 
                  key={service.id} 
                  service={service} 
                  onToggleActive={handleToggleActive}
                  onDeleteService={handleDeleteService}
                />
              ))}
            </div>
          )}
        </main>
        
        <BottomNavigation />
      </div>
    </>
  );
};

export default MyServicesPage;