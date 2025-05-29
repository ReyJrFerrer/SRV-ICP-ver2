import React, { useState, useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Components
import Header from '@app/components/client/HeaderNextjs';
import Categories from '@app/components/client/CategoriesNextjs';
import TopPicks from '@app/components/client/TopPicksNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Utils for data adaptation
import { adaptServiceData, adaptCategoryData } from '@app/utils/serviceDataAdapter';

// Mock data - in production, this would be imported from your data sources
// We're using dynamic import to avoid issues with server-side rendering of React Native components
const ClientHomePage: React.FC = () => {
  const { isAuthenticated, currentIdentity } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import data to avoid SSR issues with React Native require()
    const loadData = async () => {
      try {
        // In production, you'd fetch this from an API
        const servicesModule = await import('../../../assets/services');
        const categoriesModule = await import('../../../assets/categories');
        
        // Adapt data for Next.js
        const adaptedServices = adaptServiceData(servicesModule.SERVICES);
        const adaptedCategories = adaptCategoryData(categoriesModule.CATEGORIES);
        
        setServices(adaptedServices);
        setCategories(adaptedCategories);
      } catch (error) {
        console.error('Failed to load service data:', error);
        // Set default empty arrays in case of error
        setServices([]);
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
        {/* Status bar - just a visual representation */}
        <div className="bg-white px-4 py-1 flex justify-between items-center text-xs text-gray-500">
          <span>10:26</span>
          <div className="flex space-x-2">
            <span>WiFi</span>
            <span>Signal</span>
            <span>100%</span>
          </div>
        </div>

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
