import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Provider Components
import SPHeaderNextjs from '@app/components/provider/SPHeaderNextjs';
import ProviderStatsNextjs from '@app/components/provider/ProviderStatsNextjs';
import BookingRequestsNextjs from '@app/components/provider/BookingRequestsNextjs';
import ServiceManagementNextjs from '@app/components/provider/ServiceManagementNextjs';
import AvailabilityManagementNextjs from '@app/components/provider/AvailabilityManagementNextjs';
import CredentialsDisplayNextjs from '@app/components/provider/CredentialsDisplayNextjs';
import BottomNavigationNextjs from '@app/components/provider/BottomNavigationNextjs';

// Utils for data adaptation
import { adaptProviderData } from '@app/utils/providerDataAdapter';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

// Define interface for service provider data
interface ProviderHomePageProps {
  // Props if needed
}

const ProviderHomePage: React.FC<ProviderHomePageProps> = () => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import service provider data to avoid SSR issues with React Native require()
    const loadData = async () => {
      try {
        // In production, you'd fetch this from an API using the logged-in user's ID
        const providersModule = await import('../../../assets/serviceProviders');
        
        // For demo purposes, use the first provider from the list
        const providerData = providersModule.SERVICE_PROVIDERS[0]; // Mary Gold
        
        // Adapt data for Next.js
        const adaptedProvider = adaptProviderData(providerData);
        setProvider(adaptedProvider);
      } catch (error) {
        console.error('Failed to load provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Service Provider Dashboard | SRV-ICP</title>
        <meta name="description" content="Manage your services, bookings, and earnings" />
      </Head>
      
      <div className="pb-20 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <SPHeaderNextjs provider={provider} notificationCount={3} />
        
        <div className="p-4 max-w-6xl mx-auto">
          {/* Dashboard Statistics */}
          <ProviderStatsNextjs provider={provider} />
          
          {/* Booking Requests & Upcoming Jobs */}
          <BookingRequestsNextjs provider={provider} />
          
          {/* Services Management */}
          <ServiceManagementNextjs provider={provider} />
          
          {/* Availability Management */}
          <AvailabilityManagementNextjs provider={provider} />
          
          {/* Credentials & Verification */}
          <CredentialsDisplayNextjs provider={provider} />
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigationNextjs />
      </div>
    </>
  );
};

export default ProviderHomePage;
