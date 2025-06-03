import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusIcon, ArrowLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import ProviderServiceListItem from '@app/components/provider/ProviderServiceListItem'; // The new component

// Mock data and types
import { Service } from '../../../assets/types/service/service';
import { SERVICES as mockServicesData } from '../../../assets/services'; // Your mock services
import { adaptServiceData } from '@app/utils/serviceDataAdapter'; // If you adapt data
import { useAuth } from '@bundly/ares-react'; // To filter services by providerId

const MyServicesPage: React.FC = () => {
  const router = useRouter();
  const { currentIdentity } = useAuth(); // Get current provider's identity

  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentIdentity) {
      const providerId = currentIdentity.getPrincipal().toString();
      // Filter mock services to show only those belonging to the current provider
      // In a real app, you'd fetch services for this providerId from your backend.
      const allServices = adaptServiceData(mockServicesData); // Adapt if necessary
      const filteredServices = allServices.filter(service => service.providerId === providerId);
      setProviderServices(filteredServices);
    } else {
      // Handle case where provider is not authenticated or identity is not available
      setProviderServices([]); 
    }
    setLoading(false);
  }, [currentIdentity]);

  const handleToggleActive = (serviceId: string, currentStatus: boolean) => {
    // TODO: Implement backend call to toggle service active status
    console.log(`Toggling active status for service ${serviceId} from ${currentStatus}`);
    // For mock:
    setProviderServices(prevServices =>
      prevServices.map(s => 
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
    alert(`Mock: Service ${serviceId} status toggled to ${!currentStatus ? 'Active' : 'Inactive'}.`);
  };

  const handleDeleteService = (serviceId: string) => {
    // TODO: Implement backend call to delete service
    if (window.confirm(`Are you sure you want to delete service ${serviceId}? This action cannot be undone.`)) {
        console.log(`Deleting service ${serviceId}`);
        // For mock:
        setProviderServices(prevServices => prevServices.filter(s => s.id !== serviceId));
        alert(`Mock: Service ${serviceId} deleted.`);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Services | SRV Provider</title>
        <meta name="description" content="Manage your offered services." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col pb-16 md:pb-0"> {/* Padding for BottomNav */}
        {/* Page Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={() => router.push('/provider/home')} // Navigate to provider home
                    className="p-2 rounded-full hover:bg-gray-100 mr-2 lg:hidden" // Show only on mobile/tablet for quick back
                    aria-label="Back to Dashboard"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Services</h1>
            </div>
            <Link href="/provider/services/add" legacyBehavior>
              <a className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm">
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Add Service
              </a>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-4 sm:p-6">
          {providerServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <WrenchScrewdriverIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">You haven't added any services yet.</p>
              <p className="text-sm text-gray-500 mb-6">Start by adding your first service to reach clients.</p>
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