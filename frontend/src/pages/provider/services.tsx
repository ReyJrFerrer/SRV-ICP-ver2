import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@bundly/ares-react';
import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import ProviderServiceListItem from '@app/components/provider/ProviderServiceListItem';
import { Service } from '../../../assets/types/service/service';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';
import { SERVICES as allMasterServicesList } from '../../../assets/services'; 
import { SERVICE_PROVIDERS } from '../../../assets/serviceProviders'; 

import { adaptServiceData } from '@app/utils/serviceDataAdapter';

const MyServicesPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();

  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!isAuthenticated || !currentIdentity) {
      console.log("Auth: Not authenticated or no current identity. Clearing services.");
      setLoading(false);
      setProviderServices([]);
      return;
    }
    const providerId = currentIdentity.getPrincipal().toString();
    console.log("AUTH-DERIVED providerId:", providerId);
    const currentProviderData = SERVICE_PROVIDERS.find(p => {
      console.log(`Comparing AUTH-DERIVED providerId ("${providerId}") with mock p.id ("${p.id}")`);
      return p.id === providerId || p.userId === providerId;
    });

    console.log("FOUND currentProviderData:", currentProviderData);

    if (currentProviderData && currentProviderData.servicesOffered && currentProviderData.servicesOffered.length > 0) {
      console.log("Provider found. Raw servicesOffered:", currentProviderData.servicesOffered);
      const adaptedServices = adaptServiceData(currentProviderData.servicesOffered);
      console.log("Adapted services for this provider:", adaptedServices);
      setProviderServices(adaptedServices);
    } else {
      if (!currentProviderData) {
        console.log(`Provider with ID "${providerId}" NOT FOUND in SERVICE_PROVIDERS mock data.`);
      } else if (!currentProviderData.servicesOffered || currentProviderData.servicesOffered.length === 0) {
        console.log(`Provider "${providerId}" found, but their servicesOffered array is empty or missing.`);
      }
      setProviderServices([]);
    }
    setLoading(false);
  }, [isAuthenticated, currentIdentity]);

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    setProviderServices(prevServices =>
      prevServices.map(s =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
    alert(`Mock: Service ${serviceId} status toggled to ${!currentStatus}. Remember to update the backend.`);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm(`Are you sure you want to delete service ${serviceId}? This action cannot be undone.`)) {
      setProviderServices(prevServices => prevServices.filter(s => s.id !== serviceId));
      alert(`Mock: Service ${serviceId} deleted. Remember to update the backend.`);
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
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your services...</p>
            </div>
          )}

          {!loading && providerServices.length === 0 && (
            <div className="text-center py-16 bg-yellow-50 rounded-xl shadow-md mt-6">
              <WrenchScrewdriverIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-lg text-black mb-2">No services found for your provider profile.</p>
              <p className="text-sm text-gray-700 mb-6">
                Please ensure your authentication ID matches a provider in the mock data,
                or add new services if your profile is correctly identified.
              </p>
              <Link href="/provider/services/add" legacyBehavior>
                <a className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Your First Service
                </a>
              </Link>
            </div>
          )}

          {!loading && providerServices.length > 0 && (
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