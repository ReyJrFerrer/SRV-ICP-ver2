import React, { useState, useEffect, useMemo } from 'react'; 
import Head from 'next/head';
import SPHeaderNextjs from '@app/components/provider/SPHeaderNextjs';
import ProviderStatsNextjs from '@app/components/provider/ProviderStatsNextjs';
import BookingRequestsNextjs from '@app/components/provider/BookingRequestsNextjs';
import ServiceManagementNextjs from '@app/components/provider/ServiceManagementNextjs';
import AvailabilityManagementNextjs from '@app/components/provider/AvailabilityManagementNextjs';
import CredentialsDisplayNextjs from '@app/components/provider/CredentialsDisplayNextjs';
import BottomNavigationNextjs from '@app/components/provider/BottomNavigationNextjs';
import { SERVICE_PROVIDERS } from '../../../assets/serviceProviders'; 
import { PROVIDER_ORDERS, PROVIDER_BOOKING_REQUESTS } from '../../../assets/providerOrders';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface ProviderHomePageProps {
  // Props if needed
}

const ProviderHomePage: React.FC<ProviderHomePageProps> = () => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const providerData = SERVICE_PROVIDERS[0]; 
    setProvider(providerData as ServiceProvider);
    setLoading(false);
  }, []);

  // Calculate counts for pending and upcoming jobs consistently with bookings.tsx
  const bookingCounts = useMemo(() => {
    const now = new Date();
    // Count for "Pending" tab
    const pendingCount = PROVIDER_BOOKING_REQUESTS.length; 

    // Count for "Upcoming" tab
    const upcomingCount = PROVIDER_ORDERS.filter(
      order => order.status === 'CONFIRMED' && new Date(order.scheduledStartTime) >= now
    ).length;

    return { pendingCount, upcomingCount };
  }, []); 

  if (loading || !provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Loading Provider Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Provider Dashboard | SRV-ICP</title>
        <meta name="description" content="Manage your services, bookings, and earnings" />
      </Head>
      
      <div className="pb-20 bg-gray-50 min-h-screen">
        <SPHeaderNextjs provider={provider} notificationCount={bookingCounts.pendingCount} /> 
        
        <div className="p-4 max-w-7xl mx-auto"> 
          <ProviderStatsNextjs provider={provider} />
          
          <BookingRequestsNextjs 
            pendingRequests={bookingCounts.pendingCount}
            upcomingJobs={bookingCounts.upcomingCount}
          />
          
          <ServiceManagementNextjs provider={provider} />
          <AvailabilityManagementNextjs provider={provider} />
          <CredentialsDisplayNextjs provider={provider} />
        </div>
        
        <BottomNavigationNextjs />
      </div>
    </>
  );
};

export default ProviderHomePage;