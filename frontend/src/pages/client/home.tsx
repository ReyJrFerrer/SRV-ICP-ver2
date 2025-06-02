import React, { useState, useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';

// Components
import Header from '@app/components/client/HeaderNextjs';
import Categories from '@app/components/client/CategoriesNextjs';
import TopPicks from '@app/components/client/TopPicksNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Services
import serviceCanisterService, { Service, ServiceCategory } from '@app/services/serviceCanisterService';

// Icon mapping function to convert category names to Heroicon names
const getCategoryIcon = (categoryName: string): string => {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes('cleaning') || lowerName.includes('house')) return 'home';
  if (lowerName.includes('repair') || lowerName.includes('auto') || lowerName.includes('car')) return 'car';
  if (lowerName.includes('beauty') || lowerName.includes('wellness')) return 'broom';
  if (lowerName.includes('delivery') || lowerName.includes('courier') || lowerName.includes('truck')) return 'truck';
  if (lowerName.includes('tech') || lowerName.includes('gadget') || lowerName.includes('computer')) return 'computer';
  if (lowerName.includes('electric') || lowerName.includes('electrical')) return 'bolt';
  if (lowerName.includes('wrench') || lowerName.includes('tool') || lowerName.includes('maintenance')) return 'wrench';
  return 'default'; // fallback to default icon
};

// Define the adapted category type that matches the Categories component requirements
interface AdaptedCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

const ClientHomePage: React.FC = () => {
  const { isAuthenticated, currentIdentity } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<AdaptedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Load categories from service canister
        try {
          console.log('Fetching categories from service canister...');
          const canisterCategories = await serviceCanisterService.getAllCategories();
          console.log('Fetched categories from canister:', canisterCategories);
          
          if (canisterCategories && canisterCategories.length > 0) {
            // Convert ServiceCategory to AdaptedCategory format
            const adaptedCategories: AdaptedCategory[] = canisterCategories.map(category => ({
              id: category.id,
              name: category.name,
              icon: getCategoryIcon(category.name), // Map category name to Heroicon
              slug: category.slug
            }));
            setCategories(adaptedCategories);
            console.log('Successfully loaded categories from service canister');
          } else {
            console.warn('No categories found in service canister');
            setCategories([]);
          }
        } catch (canisterError) {
          console.error('Failed to load categories from service canister:', canisterError);
          setCategories([]);
        }

        // Load services from service canister
        try {
          console.log('Fetching services from service canister...');
          const canisterServices = await serviceCanisterService.getAllServices();
          console.log('Fetched services from canister:', canisterServices);
          
          if (canisterServices && canisterServices.length > 0) {
            // Use services directly from serviceCanisterService
            setServices(canisterServices);
            console.log('Successfully loaded services from service canister');
          } else {
            console.warn('No services found in service canister');
            setServices([]);
          }
        } catch (canisterError) {
          console.error('Failed to load services from service canister:', canisterError);
          setServices([]);
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load service data');
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
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 mt-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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
