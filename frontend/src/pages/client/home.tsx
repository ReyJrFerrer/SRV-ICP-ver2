import React, { useState, useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Components
import Header from '@app/components/client/HeaderNextjs';
import Categories from '@app/components/client/CategoriesNextjs';
import TopPicks from '@app/components/client/TopPicksNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Types
import { Service } from '../../../assets/types/service/service';
import { Category as BaseCategory } from '../../../assets/types/category/category';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

// Services
import authCanisterService from '@app/services/authCanisterService';
import { convertProfilesToServiceProviders } from '@app/utils/serviceProviderAdapter';
import { generateServicesFromProviders } from '@app/utils/serviceGenerator';

// Utils for data adaptation
import { adaptServiceData, adaptCategoryData } from '@app/utils/serviceDataAdapter';

// Define the adapted category type that matches the Categories component requirements
interface AdaptedCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

// Mock data - in production, this would be imported from your data sources
// We're using dynamic import to avoid issues with server-side rendering of React Native components
const ClientHomePage: React.FC = () => {
  const { isAuthenticated, currentIdentity } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<AdaptedCategory[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Load categories (always from local assets for now)
        const categoriesModule = await import('../../../assets/categories');
        const adaptedCategories = adaptCategoryData(categoriesModule.CATEGORIES) as AdaptedCategory[];
        setCategories(adaptedCategories);

        // Try to load service providers from auth canister first
        try {
          console.log('Fetching service providers from auth canister...');
          const profiles = await authCanisterService.getAllServiceProviders();
          console.log('Fetched profiles:', profiles);
          
          if (profiles && profiles.length > 0) {
            // Convert backend profiles to frontend ServiceProvider format
            const serviceProviders = convertProfilesToServiceProviders(profiles);
            setServiceProviders(serviceProviders);
            
            // Generate services from provider data for TopPicks component
            const generatedServices = generateServicesFromProviders(serviceProviders);
            setServices(generatedServices);
            
            console.log('Successfully loaded data from auth canister');
          } else {
            throw new Error('No service providers found in canister');
          }
        } catch (canisterError) {
          console.warn('Failed to load from auth canister, falling back to local data:', canisterError);
          
          // Fallback to local assets
          const servicesModule = await import('../../../assets/services');
          const serviceProvidersModule = await import('../../../assets/serviceProviders');
          
          const adaptedServices = adaptServiceData(servicesModule.SERVICES);
          setServices(adaptedServices);
          setServiceProviders(serviceProvidersModule.SERVICE_PROVIDERS);
          
          setError('Using local data - Auth canister unavailable');
        }
        
      } catch (error) {
        console.error('Failed to load any data:', error);
        setError('Failed to load service data');
        // Set empty arrays as last resort
        setServices([]);
        setServiceProviders([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home | Service Provider App</title>
        <meta name="description" content="Find the best service providers near you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">

        <div className="px-4 pt-4 pb-16">
          <Header className="mb-6" />

          <Categories 
            categories={categories} 
            className="mb-8" 
            
          />

          <TopPicks 
            services={services} 
            className="mb-8" 
          />
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default ClientHomePage;
